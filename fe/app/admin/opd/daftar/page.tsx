"use client";

import { PegawaiCombobox } from "@/components/pegawai-combobox";
import { AdminPageShell } from "@/components/admin-page-shell";
import { Badge } from "@/components/ui/badge";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { api, type OPD, type Pejabat } from "@/lib/api";
import {
    Building2,
    Clock,
    Edit,
    Eye,
    FileCheck,
    FileText,
    FileX,
    Filter,
    Loader2,
    Plus,
    Search,
    Trash2,
    Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

function StatusBadge({ status }: { status: "belum" | "proses" | "selesai" }) {
  const variants = {
    belum: { icon: FileX, className: "bg-destructive/10 text-destructive border-destructive/20" },
    proses: { icon: Clock, className: "bg-amber-100 text-amber-700 border-amber-200" },
    selesai: { icon: FileCheck, className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  };
  const labels = { belum: "Belum", proses: "Proses", selesai: "Selesai" };
  const { icon: Icon, className } = variants[status];
  return (
    <Badge variant="outline" className={className}>
      <Icon className="mr-1 h-3 w-3" />
      {labels[status]}
    </Badge>
  );
}

interface OpdForm {
  kode: string;
  nama: string;
  kepala: string;
  nip_kepala: string;
  alamat: string;
  telepon: string;
  email: string;
  _kepala_id?: string;
}

const emptyForm: OpdForm = {
  kode: "", nama: "", kepala: "", nip_kepala: "", alamat: "", telepon: "", email: "",
};

export default function DaftarOPDPage() {
  const [items, setItems] = useState<OPD[]>([]);
  const [pejabatList, setPejabatList] = useState<Pejabat[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingOpd, setEditingOpd] = useState<OPD | null>(null);
  const [selectedOpd, setSelectedOpd] = useState<OPD | null>(null);
  const [deletingOpd, setDeletingOpd] = useState<OPD | null>(null);
  const [form, setForm] = useState<OpdForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [opdData, pejabatData] = await Promise.all([
        api.opd.list(),
        api.pejabat.list(),
      ]);
      setItems(opdData);
      setPejabatList(pejabatData);
    } catch {
      toast.error("Gagal memuat data OPD");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredData = useMemo(() => {
    return items.filter((opd) => {
      const matchSearch =
        !search ||
        opd.nama.toLowerCase().includes(search.toLowerCase()) ||
        opd.kode.toLowerCase().includes(search.toLowerCase()) ||
        (opd.kepala ?? "").toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "all" ||
        opd.status_anjab === statusFilter ||
        opd.status_abk === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [items, search, statusFilter]);

  const stats = useMemo(() => ({
    total: items.length,
    anjabSelesai: items.filter((o) => o.status_anjab === "selesai").length,
    abkSelesai: items.filter((o) => o.status_abk === "selesai").length,
    totalPegawai: items.reduce((sum, o) => sum + (o.total_pegawai ?? 0), 0),
  }), [items]);

  function openCreate() {
    setEditingOpd(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(opd: OPD) {
    const matchingPejabat = pejabatList.find((p) => p.nama === opd.kepala);
    setEditingOpd(opd);
    setForm({
      kode: opd.kode,
      nama: opd.nama,
      kepala: opd.kepala ?? "",
      nip_kepala: opd.nip_kepala ?? "",
      alamat: opd.alamat ?? "",
      telepon: opd.telepon ?? "",
      email: opd.email ?? "",
      _kepala_id: matchingPejabat?.id,
    });
    setDialogOpen(true);
  }

  async function handleSubmit() {
    if (!form.kode || !form.nama) { toast.error("Kode dan nama OPD wajib diisi"); return; }
    setSaving(true);
    try {
      const payload = {
        kode: form.kode, nama: form.nama, kepala: form.kepala,
        nip_kepala: form.nip_kepala, alamat: form.alamat,
        telepon: form.telepon, email: form.email,
      };
      if (editingOpd) {
        const updated = await api.opd.update(editingOpd.id, payload);
        setItems((prev) => prev.map((o) => o.id === updated.id ? updated : o));
        toast.success("OPD berhasil diperbarui");
      } else {
        const created = await api.opd.create(payload);
        setItems((prev) => [...prev, created]);
        toast.success("OPD berhasil ditambahkan");
      }
      setDialogOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      toast.error(`Gagal menyimpan OPD: ${msg}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingOpd) return;
    setSaving(true);
    try {
      await api.opd.delete(deletingOpd.id);
      setItems((prev) => prev.filter((o) => o.id !== deletingOpd.id));
      toast.success("OPD berhasil dihapus");
      setDeleteOpen(false);
    } catch {
      toast.error("Gagal menghapus OPD");
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
            Manajemen data OPD
          </p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">Data OPD</h1>
        </div>
        <Button className="gap-2 rounded-xl shadow-lg shadow-primary/15" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Tambah OPD
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total OPD", value: stats.total, icon: Building2, color: "bg-primary/10 text-primary" },
          { label: "Anjab Selesai", value: stats.anjabSelesai, icon: FileCheck, color: "bg-emerald-100 text-emerald-600" },
          { label: "ABK Selesai", value: stats.abkSelesai, icon: FileText, color: "bg-blue-100 text-blue-600" },
          { label: "Total Pegawai", value: stats.totalPegawai, icon: Users, color: "bg-purple-100 text-purple-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-3 ${color.split(" ")[0]}`}>
                  <Icon className={`h-5 w-5 ${color.split(" ")[1]}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabel */}
      <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardHeader className="border-b border-border/70 px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-semibold text-foreground">
              Daftar OPD
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({filteredData.length} dari {items.length})
              </span>
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari nama, kode, kepala..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 rounded-xl border-border/70 bg-background/80 pl-9 sm:w-56"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-full rounded-xl border-border/70 bg-background/80 sm:w-40">
                  <Filter className="mr-2 h-3.5 w-3.5" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="selesai">Selesai</SelectItem>
                  <SelectItem value="proses">Proses</SelectItem>
                  <SelectItem value="belum">Belum</SelectItem>
                </SelectContent>
              </Select>
              {(search || statusFilter !== "all") && (
                <Button variant="outline" size="sm" className="h-9 rounded-xl"
                  onClick={() => { setSearch(""); setStatusFilter("all"); }}>
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/70 hover:bg-transparent">
                  <TableHead className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Kode</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Nama OPD</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Kepala</TableHead>
                  <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">Pegawai</TableHead>
                  <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">Jabatan</TableHead>
                  <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">Anjab</TableHead>
                  <TableHead className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">ABK</TableHead>
                  <TableHead className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                      <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin opacity-40" />
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                      <Building2 className="mx-auto mb-3 h-8 w-8 opacity-30" />
                      <p>Tidak ada data OPD</p>
                      {items.length === 0 && (
                        <Button variant="outline" size="sm" className="mt-3" onClick={openCreate}>
                          <Plus className="mr-2 h-3.5 w-3.5" /> Tambah OPD pertama
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ) : filteredData.map((opd) => (
                  <TableRow key={opd.id} className="border-border/60 hover:bg-background/60">
                    <TableCell className="px-6 py-4 font-mono text-sm font-medium">{opd.kode}</TableCell>
                    <TableCell className="px-4 py-4">
                      <div>
                        <p className="font-medium text-foreground">{opd.nama}</p>
                        {opd.email && <p className="text-xs text-muted-foreground">{opd.email}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div>
                        <p className="text-sm text-foreground">{opd.kepala || "—"}</p>
                        {opd.nip_kepala && <p className="text-xs text-muted-foreground">NIP: {opd.nip_kepala}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-center font-medium">{opd.total_pegawai}</TableCell>
                    <TableCell className="px-4 py-4 text-center font-medium">{opd.total_jabatan}</TableCell>
                    <TableCell className="px-4 py-4 text-center">
                      <StatusBadge status={opd.status_anjab} />
                    </TableCell>
                    <TableCell className="px-4 py-4 text-center">
                      <StatusBadge status={opd.status_abk} />
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Lihat detail"
                          onClick={() => { setSelectedOpd(opd); setDetailOpen(true); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit OPD"
                          onClick={() => openEdit(opd)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                          title="Hapus OPD"
                          onClick={() => { setDeletingOpd(opd); setDeleteOpen(true); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Tambah / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingOpd ? "Edit OPD" : "Tambah OPD"}</DialogTitle>
            <DialogDescription>
              {editingOpd ? "Perbarui data organisasi perangkat daerah." : "Tambah organisasi perangkat daerah baru."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Kode OPD *</Label>
                <Input placeholder="mis. DINAS-001" value={form.kode}
                  onChange={(e) => setForm((f) => ({ ...f, kode: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Nama OPD *</Label>
                <Input placeholder="Nama lengkap OPD" value={form.nama}
                  onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Kepala OPD</Label>
              <PegawaiCombobox
                items={pejabatList}
                value={form._kepala_id}
                placeholder="Pilih dari data pegawai..."
                onSelect={(p) =>
                  setForm((f) => ({
                    ...f,
                    kepala: p?.nama ?? "",
                    nip_kepala: p?.nip ?? "",
                    _kepala_id: p?.id,
                  }))
                }
              />
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Input
                  placeholder="atau ketik nama kepala..."
                  value={form.kepala}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, kepala: e.target.value, _kepala_id: undefined }))
                  }
                />
                <Input
                  placeholder="NIP kepala"
                  value={form.nip_kepala}
                  onChange={(e) => setForm((f) => ({ ...f, nip_kepala: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Alamat</Label>
              <Input placeholder="Alamat kantor" value={form.alamat}
                onChange={(e) => setForm((f) => ({ ...f, alamat: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Telepon</Label>
                <Input placeholder="021-xxxxx" value={form.telepon}
                  onChange={(e) => setForm((f) => ({ ...f, telepon: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" placeholder="email@opd.go.id" value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Batal</Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingOpd ? "Simpan Perubahan" : "Tambah OPD"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail OPD</DialogTitle>
          </DialogHeader>
          {selectedOpd && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-2">
              {[
                { label: "Kode OPD", value: selectedOpd.kode },
                { label: "Nama OPD", value: selectedOpd.nama },
                { label: "Kepala", value: selectedOpd.kepala || "—" },
                { label: "NIP Kepala", value: selectedOpd.nip_kepala || "—" },
                { label: "Alamat", value: selectedOpd.alamat || "—" },
                { label: "Telepon", value: selectedOpd.telepon || "—" },
                { label: "Email", value: selectedOpd.email || "—" },
                { label: "Total Pegawai", value: String(selectedOpd.total_pegawai) },
                { label: "Total Jabatan", value: String(selectedOpd.total_jabatan) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-0.5 font-medium">{value}</p>
                </div>
              ))}
              <div>
                <p className="text-xs text-muted-foreground">Status Anjab</p>
                <div className="mt-1"><StatusBadge status={selectedOpd.status_anjab} /></div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status ABK</p>
                <div className="mt-1"><StatusBadge status={selectedOpd.status_abk} /></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>Tutup</Button>
            <Button onClick={() => { setDetailOpen(false); if (selectedOpd) openEdit(selectedOpd); }}>
              <Edit className="mr-2 h-4 w-4" /> Edit OPD
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hapus Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus OPD</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus OPD <strong>{deletingOpd?.nama}</strong>? Data terkait (jabatan, pejabat, dokumen) mungkin ikut terhapus.
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
