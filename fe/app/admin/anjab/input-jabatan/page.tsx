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
import { Textarea } from "@/components/ui/textarea";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { api, type Jabatan, type OPD } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    Briefcase,
    Building2,
    Check,
    ChevronsUpDown,
    Edit,
    FileText,
    Loader2,
    Plus,
    Search,
    Trash2,
    Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

function JenisBadge({ jenis }: { jenis: string }) {
  const variants: Record<string, string> = {
    struktural: "bg-primary/5 text-primary border-primary/25",
    fungsional: "bg-violet-50 text-violet-700 border-violet-200",
    pelaksana: "bg-muted text-muted-foreground border-border",
  };
  return (
    <Badge variant="outline" className={variants[jenis] ?? variants.pelaksana}>
      {jenis ? jenis.charAt(0).toUpperCase() + jenis.slice(1) : "—"}
    </Badge>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    draft: "bg-muted text-muted-foreground border-border",
    final: "bg-amber-50 text-amber-700 border-amber-200",
    disetujui: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  const labels: Record<string, string> = { draft: "Draft", final: "Final", disetujui: "Disetujui" };
  return (
    <Badge variant="outline" className={variants[status] ?? variants.draft}>
      {labels[status] ?? status}
    </Badge>
  );
}

// Searchable OPD combobox (inline, tidak perlu komponen terpisah)
interface OpdComboboxProps {
  opdList: OPD[];
  value: string;
  onValueChange: (val: string) => void;
}
function OpdCombobox({ opdList, value, onValueChange }: OpdComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selected = opdList.find((o) => o.id === value);
  const filtered = useMemo(() => {
    if (!search) return opdList;
    return opdList.filter((o) => o.nama.toLowerCase().includes(search.toLowerCase()) || o.kode.toLowerCase().includes(search.toLowerCase()));
  }, [opdList, search]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" role="combobox" aria-expanded={open}
          className="flex h-9 w-full items-center justify-between rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-sm transition-colors hover:bg-accent/30 focus:outline-none focus:ring-2 focus:ring-ring/50">
          {selected
            ? <span className="truncate">{selected.nama}</span>
            : <span className="text-muted-foreground">Pilih OPD...</span>
          }
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Cari nama atau kode OPD..." value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>OPD tidak ditemukan</CommandEmpty>
            <CommandGroup>
              {filtered.map((o) => (
                <CommandItem key={o.id} value={o.id} onSelect={() => { onValueChange(o.id); setOpen(false); setSearch(""); }}>
                  <Check className={cn("mr-2 h-3.5 w-3.5 shrink-0", value === o.id ? "opacity-100" : "opacity-0")} />
                  <span className={cn(value === o.id && "font-medium")}>{o.nama}</span>
                  <span className="ml-auto font-mono text-xs text-muted-foreground">{o.kode}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface JabatanForm {
  kode: string;
  nama: string;
  jenis: string;
  eselon: string;
  opd_id: string;
  unit_kerja: string;
  ikhtisar: string;
  kualifikasi_pendidikan: string;
  pengalaman: string;
}

const emptyForm: JabatanForm = {
  kode: "", nama: "", jenis: "struktural", eselon: "", opd_id: "",
  unit_kerja: "", ikhtisar: "", kualifikasi_pendidikan: "", pengalaman: "",
};

export default function InputJabatanPage() {
  const [items, setItems] = useState<Jabatan[]>([]);
  const [opdList, setOpdList] = useState<OPD[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [opdFilter, setOpdFilter] = useState("all");
  const [jenisFilter, setJenisFilter] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingJabatan, setEditingJabatan] = useState<Jabatan | null>(null);
  const [deletingJabatan, setDeletingJabatan] = useState<Jabatan | null>(null);
  const [form, setForm] = useState<JabatanForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [jabatanResult, opdResult] = await Promise.all([
        api.jabatan.list({
          opd_id: opdFilter !== "all" ? opdFilter : undefined,
          jenis: jenisFilter !== "all" ? jenisFilter : undefined,
          limit: 0,
        }),
        api.opd.list({ limit: 0 }),
      ]);
      setItems(jabatanResult.data);
      setOpdList(opdResult.data);
    } catch {
      toast.error("Gagal memuat data jabatan");
    } finally {
      setLoading(false);
    }
  }, [opdFilter, jenisFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredData = useMemo(() => {
    if (!search) return items;
    const lc = search.toLowerCase();
    return items.filter(
      (j) => j.nama.toLowerCase().includes(lc) || (j.kode ?? "").toLowerCase().includes(lc),
    );
  }, [items, search]);

  const stats = useMemo(() => ({
    total: items.length,
    struktural: items.filter((j) => j.jenis === "struktural").length,
    fungsional: items.filter((j) => j.jenis === "fungsional").length,
    pelaksana: items.filter((j) => j.jenis === "pelaksana").length,
  }), [items]);

  function openCreate() {
    setEditingJabatan(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(j: Jabatan) {
    setEditingJabatan(j);
    setForm({
      kode: j.kode ?? "",
      nama: j.nama,
      jenis: j.jenis ?? "struktural",
      eselon: j.eselon ?? "",
      opd_id: j.opd_id ?? "",
      unit_kerja: j.unit_kerja ?? "",
      ikhtisar: j.ikhtisar ?? "",
      kualifikasi_pendidikan: j.kualifikasi_pendidikan ?? "",
      pengalaman: j.pengalaman ?? "",
    });
    setDialogOpen(true);
  }

  async function handleSubmit() {
    if (!form.nama) { toast.error("Nama jabatan wajib diisi"); return; }
    setSaving(true);
    try {
      const payload = {
        kode: form.kode,
        nama: form.nama,
        jenis: form.jenis,
        eselon: form.eselon,
        opd_id: form.opd_id || undefined,
        unit_kerja: form.unit_kerja,
        ikhtisar: form.ikhtisar,
        kualifikasi_pendidikan: form.kualifikasi_pendidikan,
        pengalaman: form.pengalaman,
      };
      if (editingJabatan) {
        const updated = await api.jabatan.update(editingJabatan.id, payload);
        setItems((prev) => prev.map((j) => j.id === updated.id ? updated : j));
        toast.success("Jabatan berhasil diperbarui");
      } else {
        const created = await api.jabatan.create(payload);
        setItems((prev) => [...prev, created]);
        toast.success("Jabatan berhasil ditambahkan");
      }
      setDialogOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      toast.error(`Gagal menyimpan jabatan: ${msg}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingJabatan) return;
    setSaving(true);
    try {
      await api.jabatan.delete(deletingJabatan.id);
      setItems((prev) => prev.filter((j) => j.id !== deletingJabatan.id));
      toast.success("Jabatan berhasil dihapus");
      setDeleteOpen(false);
    } catch {
      toast.error("Gagal menghapus jabatan");
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
            Manajemen data jabatan
          </p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">Input Data Jabatan</h1>
        </div>
        <Button className="gap-2 rounded-xl shadow-lg shadow-primary/15" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Tambah Jabatan
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Jabatan", value: stats.total, icon: Briefcase, color: "bg-primary/10 text-primary" },
          { label: "Struktural", value: stats.struktural, icon: Users, color: "bg-blue-100 text-blue-600" },
          { label: "Fungsional", value: stats.fungsional, icon: FileText, color: "bg-violet-100 text-violet-600" },
          { label: "Pelaksana", value: stats.pelaksana, icon: Building2, color: "bg-muted text-muted-foreground" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-3 ${color.split(" ")[0]}`}>
                  <Icon className={`h-5 w-5 ${color.split(" ")[1]}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold">{value}</p>
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
              Daftar Jabatan
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({filteredData.length} dari {items.length})
              </span>
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Cari nama jabatan..." value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 rounded-xl border-border/70 bg-background/80 pl-9 sm:w-52" />
              </div>
              <Select value={opdFilter} onValueChange={setOpdFilter}>
                <SelectTrigger className="h-9 rounded-xl border-border/70 bg-background/80 sm:w-40">
                  <SelectValue placeholder="Semua OPD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua OPD</SelectItem>
                  {opdList.map((o) => <SelectItem key={o.id} value={o.id}>{o.nama}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={jenisFilter} onValueChange={setJenisFilter}>
                <SelectTrigger className="h-9 rounded-xl border-border/70 bg-background/80 sm:w-36">
                  <SelectValue placeholder="Semua Jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  <SelectItem value="struktural">Struktural</SelectItem>
                  <SelectItem value="fungsional">Fungsional</SelectItem>
                  <SelectItem value="pelaksana">Pelaksana</SelectItem>
                </SelectContent>
              </Select>
              {(search || opdFilter !== "all" || jenisFilter !== "all") && (
                <Button variant="outline" size="sm" className="h-9 rounded-xl"
                  onClick={() => { setSearch(""); setOpdFilter("all"); setJenisFilter("all"); }}>
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
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Nama Jabatan</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Jenis</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">OPD</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Unit Kerja</TableHead>
                  <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Status</TableHead>
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
                      <Briefcase className="mx-auto mb-3 h-8 w-8 opacity-30" />
                      <p>Tidak ada data jabatan</p>
                      {/* {items.length === 0 && (
                        <Button variant="outline" size="sm" className="mt-3" onClick={openCreate}>
                          <Plus className="mr-2 h-3.5 w-3.5" /> Tambah jabatan pertama
                        </Button>
                      )} */}
                    </TableCell>
                  </TableRow>
                ) : filteredData.map((jabatan) => (
                  <TableRow key={jabatan.id} className="border-border/60 hover:bg-background/60">
                    <TableCell className="px-6 py-4 font-mono text-sm">{jabatan.kode || "—"}</TableCell>
                    <TableCell className="px-4 py-4">
                      <div>
                        <p className="font-medium">{jabatan.nama}</p>
                        {jabatan.eselon && (
                          <p className="text-xs text-muted-foreground">Eselon {jabatan.eselon}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <JenisBadge jenis={jabatan.jenis} />
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm text-muted-foreground">{jabatan.opd_nama || "—"}</TableCell>
                    <TableCell className="px-4 py-4 text-sm text-muted-foreground">{jabatan.unit_kerja || "—"}</TableCell>
                    <TableCell className="px-4 py-4">
                      <StatusBadge status={jabatan.status_anjab} />
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"
                          onClick={() => openEdit(jabatan)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => { setDeletingJabatan(jabatan); setDeleteOpen(true); }}>
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
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingJabatan ? "Edit Jabatan" : "Tambah Jabatan"}</DialogTitle>
            <DialogDescription>
              {editingJabatan ? "Perbarui data jabatan." : "Tambah data jabatan baru untuk analisis jabatan."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Kode Jabatan</Label>
                <Input placeholder="mis. 1.05.01.001" value={form.kode}
                  onChange={(e) => setForm((f) => ({ ...f, kode: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Nama Jabatan *</Label>
                <Input placeholder="Nama jabatan" value={form.nama}
                  onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Jenis Jabatan</Label>
                <Select value={form.jenis} onValueChange={(v) => setForm((f) => ({ ...f, jenis: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="struktural">Struktural</SelectItem>
                    <SelectItem value="fungsional">Fungsional</SelectItem>
                    <SelectItem value="pelaksana">Pelaksana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Eselon (jika struktural)</Label>
                <Select value={form.eselon || "none"} onValueChange={(v) => setForm((f) => ({ ...f, eselon: v === "none" ? "" : v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Pilih eselon" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tidak ada</SelectItem>
                    <SelectItem value="II.a">II.a</SelectItem>
                    <SelectItem value="II.b">II.b</SelectItem>
                    <SelectItem value="III.a">III.a</SelectItem>
                    <SelectItem value="III.b">III.b</SelectItem>
                    <SelectItem value="IV.a">IV.a</SelectItem>
                    <SelectItem value="IV.b">IV.b</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>OPD</Label>
                <OpdCombobox
                  opdList={opdList}
                  value={form.opd_id}
                  onValueChange={(v) => setForm((f) => ({ ...f, opd_id: v, unit_kerja: opdList.find((o) => o.id === v)?.nama ?? f.unit_kerja }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Unit Kerja</Label>
                <Input placeholder="Unit kerja" value={form.unit_kerja}
                  onChange={(e) => setForm((f) => ({ ...f, unit_kerja: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Ikhtisar Jabatan</Label>
              <Textarea placeholder="Deskripsi singkat tugas pokok jabatan" rows={3}
                value={form.ikhtisar}
                onChange={(e) => setForm((f) => ({ ...f, ikhtisar: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Kualifikasi Pendidikan</Label>
                <Input placeholder="mis. S1 Administrasi" value={form.kualifikasi_pendidikan}
                  onChange={(e) => setForm((f) => ({ ...f, kualifikasi_pendidikan: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Pengalaman</Label>
                <Input placeholder="mis. Min. 2 tahun" value={form.pengalaman}
                  onChange={(e) => setForm((f) => ({ ...f, pengalaman: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Batal</Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingJabatan ? "Simpan Perubahan" : "Tambah Jabatan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hapus Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Jabatan</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus jabatan <strong>{deletingJabatan?.nama}</strong>? Data uraian dan spesifikasi terkait mungkin ikut terhapus.
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
