"use client";

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
import { JabatanCombobox } from "@/components/jabatan-combobox";
import { DataTablePagination } from "@/components/data-table-pagination";
import { api, type Jabatan, type OPD, type Pejabat } from "@/lib/api";
import {
    Edit,
    Eye,
    Filter,
    Loader2,
    Plus,
    Search,
    Trash2,
    UserCircle,
    Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const ESELON_OPTIONS = ["II.a", "II.b", "III.a", "III.b", "IV.a", "IV.b", "Non-eselon"];

function JenisBadge({ eselon }: { eselon: string }) {
  if (!eselon || eselon === "Non-eselon") {
    return (
      <Badge variant="outline" className="border-violet-200 bg-violet-50 text-violet-700">
        Fungsional
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
      Struktural · {eselon}
    </Badge>
  );
}

interface PegawaiForm {
  opd_id: string;
  nip: string;
  nama: string;
  jabatan: string;
  eselon: string;
  pangkat: string;
  golongan: string;
  tmt_jabatan: string;
  pendidikan: string;
}

const emptyForm: PegawaiForm = {
  opd_id: "none", nip: "", nama: "", jabatan: "", eselon: "Non-eselon",
  pangkat: "", golongan: "", tmt_jabatan: "", pendidikan: "",
};

export default function DataPegawaiPage() {
  const [items, setItems] = useState<Pejabat[]>([]);
  const [opdList, setOpdList] = useState<OPD[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [opdFilter, setOpdFilter] = useState("all");
  const [jenisFilter, setJenisFilter] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingPegawai, setEditingPegawai] = useState<Pejabat | null>(null);
  const [selectedPegawai, setSelectedPegawai] = useState<Pejabat | null>(null);
  const [deletingPegawai, setDeletingPegawai] = useState<Pejabat | null>(null);
  const [form, setForm] = useState<PegawaiForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);

  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [statsData, setStatsData] = useState<Pejabat[]>([]);

  // Load jabatan ketika OPD berubah di form dialog
  useEffect(() => {
    if (!dialogOpen) return;
    if (!form.opd_id || form.opd_id === "none") { setJabatanList([]); return; }
    api.jabatan.list({ opd_id: form.opd_id, limit: 0 }).then((r) => setJabatanList(r.data)).catch(() => {});
  }, [form.opd_id, dialogOpen]);

  const fetchStats = useCallback(async () => {
    try {
      const [statsResult, opdData] = await Promise.all([
        api.pejabat.list({ opd_id: opdFilter !== "all" ? opdFilter : undefined, limit: 0 }),
        api.opd.list({ limit: 0 }),
      ]);
      setStatsData(statsResult.data);
      setOpdList(opdData.data);
    } catch { /* keep previous */ }
  }, [opdFilter]);

  const fetchTable = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.pejabat.list({
        opd_id: opdFilter !== "all" ? opdFilter : undefined,
        search: search || undefined,
        limit,
        offset,
      });
      setItems(result.data);
      setTotal(result.total);
    } catch {
      toast.error("Gagal memuat data pegawai");
    } finally {
      setLoading(false);
    }
  }, [opdFilter, search, limit, offset]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchTable(); }, [fetchTable]);

  const filteredData = useMemo(() => {
    if (jenisFilter === "all") return items;
    return items.filter((p) =>
      (jenisFilter === "struktural" && p.eselon && p.eselon !== "Non-eselon") ||
      (jenisFilter === "fungsional" && (!p.eselon || p.eselon === "Non-eselon"))
    );
  }, [items, jenisFilter]);

  const stats = useMemo(() => ({
    total: statsData.length || total,
    struktural: statsData.filter((p) => p.eselon && p.eselon !== "Non-eselon").length,
    fungsional: statsData.filter((p) => !p.eselon || p.eselon === "Non-eselon").length,
    eselon2: statsData.filter((p) => p.eselon?.startsWith("II")).length,
  }), [statsData, total]);

  function openCreate() {
    setEditingPegawai(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(p: Pejabat) {
    setEditingPegawai(p);
    setForm({
      opd_id: p.opd_id ?? "none",
      nip: p.nip,
      nama: p.nama,
      jabatan: p.jabatan ?? "",
      eselon: p.eselon || "Non-eselon",
      pangkat: p.pangkat ?? "",
      golongan: p.golongan ?? "",
      tmt_jabatan: p.tmt_jabatan ? String(p.tmt_jabatan).substring(0, 10) : "",
      pendidikan: p.pendidikan ?? "",
    });
    setDialogOpen(true);
  }

  async function handleSubmit() {
    if (!form.nip || !form.nama) {
      toast.error("NIP dan nama wajib diisi");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        opd_id: form.opd_id !== "none" ? form.opd_id : undefined,
        nip: form.nip,
        nama: form.nama,
        jabatan: form.jabatan,
        eselon: form.eselon !== "Non-eselon" ? form.eselon : "",
        pangkat: form.pangkat,
        golongan: form.golongan,
        tmt_jabatan: form.tmt_jabatan || undefined,
        pendidikan: form.pendidikan,
      };
      if (editingPegawai) {
        await api.pejabat.update(editingPegawai.id, payload);
        toast.success("Data pegawai berhasil diperbarui");
      } else {
        await api.pejabat.create(payload);
        toast.success("Pegawai berhasil ditambahkan");
      }
      setDialogOpen(false);
      fetchTable();
      fetchStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      toast.error(`Gagal menyimpan: ${msg}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingPegawai) return;
    setSaving(true);
    try {
      await api.pejabat.delete(deletingPegawai.id);
      toast.success("Pegawai berhasil dihapus");
      setDeleteOpen(false);
      fetchTable();
      fetchStats();
    } catch {
      toast.error("Gagal menghapus pegawai");
    } finally {
      setSaving(false);
    }
  }

  function initials(name: string) {
    return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  }

  return (
    <AdminPageShell>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Master data kepegawaian
          </p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">Data Pegawai</h1>
        </div>
        <Button className="gap-2 rounded-xl shadow-lg shadow-primary/15" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Tambah Pegawai
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Pegawai", value: stats.total, icon: Users, color: "bg-primary/10 text-primary" },
          { label: "Eselon II", value: stats.eselon2, icon: UserCircle, color: "bg-purple-100 text-purple-600" },
          { label: "Struktural", value: stats.struktural, icon: UserCircle, color: "bg-blue-100 text-blue-600" },
          { label: "Fungsional / Pelaksana", value: stats.fungsional, icon: UserCircle, color: "bg-violet-100 text-violet-600" },
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
            <p className="font-semibold">
              Daftar Pegawai
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({filteredData.length} dari {items.length})
              </span>
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Cari nama, NIP, jabatan..."
                  value={search} onChange={(e) => { setSearch(e.target.value); setOffset(0); }}
                  className="h-9 rounded-xl border-border/70 bg-background/80 pl-9 sm:w-52" />
              </div>
              <Select value={opdFilter} onValueChange={(v) => { setOpdFilter(v); setOffset(0); }}>
                <SelectTrigger className="h-9 rounded-xl border-border/70 bg-background/80 sm:w-44">
                  <Filter className="mr-2 h-3.5 w-3.5" />
                  <SelectValue placeholder="Semua OPD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua OPD</SelectItem>
                  {opdList.map((o) => (
                    <SelectItem key={o.id} value={o.id}>{o.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={jenisFilter} onValueChange={setJenisFilter}>
                <SelectTrigger className="h-9 rounded-xl border-border/70 bg-background/80 sm:w-40">
                  <SelectValue placeholder="Semua Jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  <SelectItem value="struktural">Struktural</SelectItem>
                  <SelectItem value="fungsional">Fungsional</SelectItem>
                </SelectContent>
              </Select>
              {(search || opdFilter !== "all" || jenisFilter !== "all") && (
                <Button variant="outline" size="sm" className="h-9 rounded-xl"
                  onClick={() => { setSearch(""); setOpdFilter("all"); setJenisFilter("all"); setOffset(0); }}>
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
                  <TableHead className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">NIP</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Nama</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Jabatan</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">OPD</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Jenis / Eselon</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Golongan</TableHead>
                  <TableHead className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                      <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin opacity-40" />
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                      <Users className="mx-auto mb-3 h-8 w-8 opacity-30" />
                      <p>Tidak ada data pegawai</p>
                      {/* {items.length === 0 && (
                        <Button variant="outline" size="sm" className="mt-3" onClick={openCreate}>
                          <Plus className="mr-2 h-3.5 w-3.5" /> Tambah pegawai pertama
                        </Button>
                      )} */}
                    </TableCell>
                  </TableRow>
                ) : filteredData.map((pegawai) => (
                  <TableRow key={pegawai.id} className="border-border/60 hover:bg-background/60">
                    <TableCell className="px-6 py-4 font-mono text-sm">{pegawai.nip}</TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {initials(pegawai.nama)}
                        </div>
                        <div>
                          <p className="font-medium">{pegawai.nama}</p>
                          {pegawai.pangkat && <p className="text-xs text-muted-foreground">{pegawai.pangkat}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 font-medium">{pegawai.jabatan || "—"}</TableCell>
                    <TableCell className="px-4 py-4 text-sm text-muted-foreground">{pegawai.opd_nama || "—"}</TableCell>
                    <TableCell className="px-4 py-4">
                      <JenisBadge eselon={pegawai.eselon} />
                    </TableCell>
                    <TableCell className="px-4 py-4 font-medium">{pegawai.golongan || "—"}</TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"
                          onClick={() => { setSelectedPegawai(pegawai); setDetailOpen(true); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"
                          onClick={() => openEdit(pegawai)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => { setDeletingPegawai(pegawai); setDeleteOpen(true); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {total > 0 && (
            <div className="border-t border-border/70">
              <DataTablePagination
                total={total}
                limit={limit}
                offset={offset}
                onPageChange={setOffset}
                onPageSizeChange={(newLimit) => { setLimit(newLimit); setOffset(0); }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tambah / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingPegawai ? "Edit Pegawai" : "Tambah Pegawai"}</DialogTitle>
            <DialogDescription>
              {editingPegawai
                ? "Perbarui data pegawai."
                : "Tambah data pegawai baru (struktural, fungsional, atau pelaksana)."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label>OPD</Label>
              <Select value={form.opd_id} onValueChange={(v) => setForm((f) => ({ ...f, opd_id: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Pilih OPD" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tanpa OPD</SelectItem>
                  {opdList.map((o) => <SelectItem key={o.id} value={o.id}>{o.nama}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>NIP *</Label>
                <Input placeholder="NIP pegawai" value={form.nip}
                  onChange={(e) => setForm((f) => ({ ...f, nip: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Nama Lengkap *</Label>
                <Input placeholder="Nama lengkap" value={form.nama}
                  onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Nama Jabatan</Label>
              <JabatanCombobox
                items={jabatanList}
                value={form.jabatan}
                placeholder={
                  form.opd_id === "none"
                    ? "Pilih OPD dulu..."
                    : jabatanList.length === 0
                    ? "Belum ada jabatan di OPD ini..."
                    : "Pilih dari master jabatan..."
                }
                onSelect={(j) =>
                  setForm((f) => ({
                    ...f,
                    jabatan: j?.nama ?? f.jabatan,
                    eselon: j?.eselon ? j.eselon : f.eselon,
                  }))
                }
              />
              {form.opd_id !== "none" && jabatanList.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Tambahkan jabatan di{" "}
                  <span className="font-medium">Anjab → Input Data Jabatan</span> terlebih dahulu.
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Eselon</Label>
                <Select value={form.eselon} onValueChange={(v) => setForm((f) => ({ ...f, eselon: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ESELON_OPTIONS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>TMT Jabatan</Label>
                <Input type="date" value={form.tmt_jabatan}
                  onChange={(e) => setForm((f) => ({ ...f, tmt_jabatan: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Pangkat</Label>
                <Input placeholder="Pangkat" value={form.pangkat}
                  onChange={(e) => setForm((f) => ({ ...f, pangkat: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Golongan</Label>
                <Input placeholder="mis. III/c" value={form.golongan}
                  onChange={(e) => setForm((f) => ({ ...f, golongan: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Pendidikan Terakhir</Label>
              <Input placeholder="mis. S1 Administrasi Negara" value={form.pendidikan}
                onChange={(e) => setForm((f) => ({ ...f, pendidikan: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Batal</Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingPegawai ? "Simpan Perubahan" : "Tambah Pegawai"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Detail Pegawai</DialogTitle></DialogHeader>
          {selectedPegawai && (
            <div className="py-2">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                  {initials(selectedPegawai.nama)}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{selectedPegawai.nama}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPegawai.jabatan || "—"}</p>
                  <JenisBadge eselon={selectedPegawai.eselon} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {[
                  { label: "NIP", value: selectedPegawai.nip },
                  { label: "OPD", value: selectedPegawai.opd_nama || "—" },
                  { label: "Pangkat", value: selectedPegawai.pangkat || "—" },
                  { label: "Golongan", value: selectedPegawai.golongan || "—" },
                  { label: "Pendidikan", value: selectedPegawai.pendidikan || "—" },
                  {
                    label: "TMT Jabatan",
                    value: selectedPegawai.tmt_jabatan
                      ? new Date(selectedPegawai.tmt_jabatan).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                      : "—",
                  },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-0.5 font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>Tutup</Button>
            <Button onClick={() => { setDetailOpen(false); if (selectedPegawai) openEdit(selectedPegawai); }}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hapus Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Pegawai</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus <strong>{deletingPegawai?.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
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
