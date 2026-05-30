"use client";

import { JabatanCombobox } from "@/components/jabatan-combobox";
import { PegawaiCombobox } from "@/components/pegawai-combobox";
import { AdminPageShell } from "@/components/admin-page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { api, type Jabatan, type OPD, type Pejabat, type StrukturOrganisasi } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    Building2,
    ChevronDown,
    ChevronRight,
    Edit,
    Loader2,
    Plus,
    Trash2,
    UserCheck,
    Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface StrukturForm {
  jabatan: string;
  nama: string;
  nip: string;
  parent_id: string;
  level: string;
  urutan: string;
  _pejabat_id?: string;
}

const emptyForm: StrukturForm = {
  jabatan: "", nama: "", nip: "", parent_id: "none", level: "1", urutan: "1",
};

interface OrgNodeProps {
  node: StrukturOrganisasi;
  allNodes: StrukturOrganisasi[];
  expandedNodes: Set<string>;
  onToggle: (id: string) => void;
  onEdit: (node: StrukturOrganisasi) => void;
  onDelete: (node: StrukturOrganisasi) => void;
}

function OrgNode({ node, allNodes, expandedNodes, onToggle, onEdit, onDelete }: OrgNodeProps) {
  const childNodes = allNodes.filter((n) => n.parent_id === node.id);
  const hasChildren = childNodes.length > 0;
  const isExpanded = expandedNodes.has(node.id);

  return (
    <div className="relative">
      <div className={cn(
        "group flex items-center gap-3 rounded-2xl border p-3.5 transition-all hover:shadow-md",
        node.level === 1 && "border-primary/30 bg-primary/5",
        node.level === 2 && "border-blue-200 bg-blue-50/50",
        node.level >= 3 && "border-border/70 bg-card/60",
      )}>
        {hasChildren ? (
          <button type="button" onClick={() => onToggle(node.id)}
            className="rounded-lg p-1 hover:bg-muted/60">
            {isExpanded
              ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
              : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </button>
        ) : (
          <div className="w-6" />
        )}
        <div className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          node.level === 1 ? "bg-primary/15 text-primary"
            : node.level === 2 ? "bg-blue-100 text-blue-600"
            : "bg-muted text-muted-foreground",
        )}>
          <Users className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">{node.jabatan}</p>
          {node.nama
            ? <p className="truncate text-xs text-muted-foreground">{node.nama} · NIP {node.nip}</p>
            : <p className="text-xs italic text-muted-foreground/60">Belum terisi</p>
          }
        </div>
        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(node)}>
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={() => onDelete(node)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div className="ml-8 mt-2 space-y-2 border-l-2 border-dashed border-muted pl-4">
          {childNodes
            .sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0))
            .map((child) => (
              <OrgNode key={child.id} node={child} allNodes={allNodes}
                expandedNodes={expandedNodes} onToggle={onToggle}
                onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>
      )}
    </div>
  );
}

export default function StrukturOrganisasiPage() {
  const [opdList, setOpdList] = useState<OPD[]>([]);
  const [selectedOpd, setSelectedOpd] = useState("none");
  const [nodes, setNodes] = useState<StrukturOrganisasi[]>([]);
  const [pejabatList, setPejabatList] = useState<Pejabat[]>([]);
  const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<StrukturOrganisasi | null>(null);
  const [deletingNode, setDeletingNode] = useState<StrukturOrganisasi | null>(null);
  const [form, setForm] = useState<StrukturForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  // Load OPD list
  useEffect(() => {
    api.opd.list().then((list) => {
      setOpdList(list);
      if (list.length > 0) setSelectedOpd(list[0].id);
    });
  }, []);

  // Load struktur + pejabat when OPD changes
  useEffect(() => {
    if (!selectedOpd || selectedOpd === "none") return;
    setLoading(true);
    Promise.all([
      api.struktur.listByOpd(selectedOpd),
      api.pejabat.list({ opd_id: selectedOpd }),
      api.jabatan.list({ opd_id: selectedOpd }),
    ])
      .then(([strukturData, pejabatData, jabatanData]) => {
        setNodes(strukturData);
        setExpandedNodes(new Set(strukturData.map((n) => n.id)));
        setPejabatList(pejabatData);
        setJabatanList(jabatanData);
      })
      .catch(() => toast.error("Gagal memuat data"))
      .finally(() => setLoading(false));
  }, [selectedOpd]);

  const rootNodes = useMemo(
    () => nodes.filter((n) => !n.parent_id).sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0)),
    [nodes],
  );
  const selectedOpdData = opdList.find((o) => o.id === selectedOpd);
  const filledCount = nodes.filter((n) => Boolean(n.nama)).length;

  function toggleNode(id: string) {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function openCreate() {
    setEditingNode(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(node: StrukturOrganisasi) {
    const matchingPejabat = pejabatList.find((p) => p.nama === node.nama);
    setEditingNode(node);
    setForm({
      jabatan: node.jabatan,
      nama: node.nama ?? "",
      nip: node.nip ?? "",
      parent_id: node.parent_id ?? "none",
      level: String(node.level ?? 1),
      urutan: String(node.urutan ?? 1),
      _pejabat_id: matchingPejabat?.id,
    });
    setDialogOpen(true);
  }

  async function handleSubmit() {
    if (!form.jabatan) { toast.error("Nama jabatan wajib diisi"); return; }
    if (!selectedOpd || selectedOpd === "none") { toast.error("Pilih OPD terlebih dahulu"); return; }
    setSaving(true);
    try {
      const payload = {
        opd_id: selectedOpd,
        jabatan: form.jabatan,
        nama: form.nama || "",
        nip: form.nip || "",
        parent_id: form.parent_id !== "none" ? form.parent_id : undefined,
        level: parseInt(form.level) || 1,
        urutan: parseInt(form.urutan) || 1,
      };
      if (editingNode) {
        const updated = await api.struktur.update(editingNode.id, payload);
        setNodes((prev) => prev.map((n) => n.id === updated.id ? updated : n));
        toast.success("Posisi jabatan berhasil diperbarui");
      } else {
        const created = await api.struktur.create(payload);
        setNodes((prev) => [...prev, created]);
        toast.success("Posisi jabatan berhasil ditambahkan");
      }
      setDialogOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      toast.error(`Gagal menyimpan: ${msg}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingNode) return;
    setSaving(true);
    try {
      await api.struktur.delete(deletingNode.id);
      setNodes((prev) => prev.filter((n) => n.id !== deletingNode.id));
      toast.success("Posisi jabatan berhasil dihapus");
      setDeleteOpen(false);
    } catch {
      toast.error("Gagal menghapus posisi jabatan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminPageShell>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Peta struktur OPD
          </p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">Struktur Organisasi</h1>
        </div>
        <Button className="gap-2 rounded-xl shadow-lg shadow-primary/15"
          onClick={openCreate} disabled={!selectedOpd || selectedOpd === "none"}>
          <Plus className="h-4 w-4" />
          Tambah Jabatan
        </Button>
      </div>

      {/* OPD selector + stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur sm:col-span-2">
          <CardContent className="pb-4 pt-4">
            <Label className="text-xs text-muted-foreground">Pilih OPD</Label>
            <Select value={selectedOpd} onValueChange={setSelectedOpd}>
              <SelectTrigger className="mt-2 h-10 rounded-xl border-border/70 bg-background/80">
                <SelectValue placeholder="Pilih OPD" />
              </SelectTrigger>
              <SelectContent>
                {opdList.map((opd) => (
                  <SelectItem key={opd.id} value={opd.id}>{opd.nama}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Posisi</p>
                <p className="text-2xl font-bold">{nodes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2.5">
                <UserCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Posisi Terisi</p>
                <p className="text-2xl font-bold">{filledCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info bar */}
      {selectedOpdData && nodes.length > 0 && (
        <Card className="mb-4 border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{selectedOpdData.nama}</p>
                  <p className="text-sm text-muted-foreground">
                    {nodes.length} posisi · {nodes.length - filledCount} belum terisi ·{" "}
                    {pejabatList.length} pegawai terdaftar
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Keterisian:{" "}
                  <span className="font-semibold text-foreground">
                    {nodes.length > 0 ? Math.round((filledCount / nodes.length) * 100) : 0}%
                  </span>
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs"
                    onClick={() => setExpandedNodes(new Set(nodes.map((n) => n.id)))}>
                    Expand
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs"
                    onClick={() => setExpandedNodes(new Set())}>
                    Collapse
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bagan */}
      <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardHeader className="border-b border-border/70 px-6 py-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <p className="font-semibold">Bagan Struktur Organisasi</p>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Memuat struktur...
            </div>
          ) : rootNodes.length > 0 ? (
            <div className="space-y-3">
              {rootNodes.map((node) => (
                <OrgNode key={node.id} node={node} allNodes={nodes}
                  expandedNodes={expandedNodes} onToggle={toggleNode}
                  onEdit={openEdit}
                  onDelete={(n) => { setDeletingNode(n); setDeleteOpen(true); }} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Building2 className="mb-3 h-10 w-10 opacity-30" />
              <p>Belum ada data struktur untuk OPD ini</p>
              {/* <Button variant="outline" size="sm" className="mt-3" onClick={openCreate}
                disabled={!selectedOpd || selectedOpd === "none"}>
                <Plus className="mr-2 h-3.5 w-3.5" /> Tambah jabatan pertama
              </Button> */}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-3 flex flex-wrap gap-4 px-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded border-2 border-primary/40 bg-primary/5" />
          <span>Level 1 (Pimpinan)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded border-2 border-blue-200 bg-blue-50" />
          <span>Level 2</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded border-2 border-border bg-card" />
          <span>Level 3+</span>
        </div>
        <span className="italic">Hover node → muncul tombol edit/hapus</span>
      </div>

      {/* Tambah / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingNode ? "Edit Posisi Jabatan" : "Tambah Posisi Jabatan"}</DialogTitle>
            <DialogDescription>
              {editingNode
                ? "Perbarui data posisi jabatan di struktur organisasi."
                : "Tambah posisi jabatan baru ke bagan struktur."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label>Nama Jabatan *</Label>
              <JabatanCombobox
                items={jabatanList}
                value={form.jabatan}
                placeholder="Pilih dari master jabatan OPD ini..."
                onSelect={(j) =>
                  setForm((f) => ({
                    ...f,
                    jabatan: j?.nama ?? f.jabatan,
                  }))
                }
              />
              {jabatanList.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Belum ada jabatan di OPD ini. Tambahkan di{" "}
                  <span className="font-medium">Anjab → Input Data Jabatan</span>.
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Atasan Langsung</Label>
              <Select value={form.parent_id} onValueChange={(v) => setForm((f) => ({ ...f, parent_id: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Tidak ada (jabatan tertinggi)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tidak ada (jabatan tertinggi)</SelectItem>
                  {nodes
                    .filter((n) => !editingNode || n.id !== editingNode.id)
                    .map((n) => <SelectItem key={n.id} value={n.id}>{n.jabatan}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Level</Label>
                <Select value={form.level} onValueChange={(v) => setForm((f) => ({ ...f, level: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((l) => (
                      <SelectItem key={l} value={String(l)}>Level {l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Urutan</Label>
                <Input type="number" min={1} value={form.urutan}
                  onChange={(e) => setForm((f) => ({ ...f, urutan: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2 border-t border-border/60 pt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Pegawai yang menduduki jabatan ini
              </p>
              <Label className="text-sm font-normal">Pilih dari data pegawai</Label>
              <PegawaiCombobox
                items={pejabatList}
                value={form._pejabat_id}
                placeholder="Pilih pegawai OPD ini..."
                onSelect={(p) =>
                  setForm((f) => ({
                    ...f,
                    nama: p?.nama ?? f.nama,
                    nip: p?.nip ?? f.nip,
                    _pejabat_id: p?.id,
                  }))
                }
              />
              {pejabatList.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Belum ada pegawai di OPD ini. Tambahkan di menu Data Pegawai.
                </p>
              )}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Nama</Label>
                  <Input placeholder="Nama pejabat" value={form.nama}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, nama: e.target.value, _pejabat_id: undefined }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">NIP</Label>
                  <Input placeholder="NIP" value={form.nip}
                    onChange={(e) => setForm((f) => ({ ...f, nip: e.target.value }))} />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Batal</Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingNode ? "Simpan Perubahan" : "Tambah Jabatan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hapus Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Posisi Jabatan</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus posisi <strong>{deletingNode?.jabatan}</strong>?
              Jabatan di bawahnya juga akan terpengaruh.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={saving}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  );
}
