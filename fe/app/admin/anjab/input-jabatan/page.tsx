"use client";

import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminPageShell } from "@/components/admin-page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { api, type Jabatan, type OPD } from "@/lib/api";
import {
    Briefcase,
    Building2,
    Edit,
    Eye,
    FileText,
    Plus,
    Search,
    Sparkles,
    Trash2,
    Users
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function JenisBadge({ jenis }: { jenis: "struktural" | "fungsional" | "pelaksana" }) {
  const variants = {
    struktural: "bg-primary text-primary-foreground",
    fungsional: "bg-accent text-accent-foreground",
    pelaksana: "bg-muted text-muted-foreground",
  };
  return (
    <Badge className={variants[jenis]}>
      {jenis.charAt(0).toUpperCase() + jenis.slice(1)}
    </Badge>
  );
}

function StatusBadge({ status }: { status: "draft" | "final" | "disetujui" }) {
  const variants = {
    draft: "bg-muted text-muted-foreground border-muted",
    final: "bg-accent/30 text-accent-foreground border-accent/40",
    disetujui: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };
  return (
    <Badge variant="outline" className={variants[status]}>
      {status === "draft" ? "Draft" : status === "final" ? "Final" : "Disetujui"}
    </Badge>
  );
}

export default function InputJabatanPage() {
  const [items, setItems] = useState<Jabatan[]>([]);
  const [opdList, setOpdList] = useState<OPD[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [opdFilter, setOpdFilter] = useState("all");
  const [jenisFilter, setJenisFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newKode, setNewKode] = useState("");
  const [newNama, setNewNama] = useState("");
  const [newJenis, setNewJenis] = useState("");
  const [newEselon, setNewEselon] = useState("");
  const [newOpdId, setNewOpdId] = useState("");
  const [newUnitKerja, setNewUnitKerja] = useState("");
  const [newIkhtisar, setNewIkhtisar] = useState("");
  const [newPendidikan, setNewPendidikan] = useState("");
  const [newPengalaman, setNewPengalaman] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [jabatanData, opdData] = await Promise.all([
        api.jabatan.list({
          opd_id: opdFilter !== "all" ? opdFilter : undefined,
          search: search || undefined,
          jenis: jenisFilter !== "all" ? jenisFilter : undefined,
        }),
        api.opd.list(),
      ]);
      setItems(jabatanData);
      setOpdList(opdData);
    } catch {
      // keep previous data
    } finally {
      setLoading(false);
    }
  }, [search, opdFilter, jenisFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async () => {
    if (!newNama || !newOpdId) return;
    await api.jabatan.create({
      kode: newKode,
      nama: newNama,
      jenis: newJenis,
      eselon: newEselon,
      opd_id: newOpdId,
      unit_kerja: newUnitKerja,
      ikhtisar: newIkhtisar,
      kualifikasi_pendidikan: newPendidikan,
      pengalaman: newPengalaman,
    });
    setDialogOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus jabatan ini?")) return;
    await api.jabatan.delete(id);
    fetchData();
  };

  const filteredData = items;

  const stats = {
    total: items.length,
    struktural: items.filter((j) => j.jenis === "struktural").length,
    fungsional: items.filter((j) => j.jenis === "fungsional").length,
    pelaksana: items.filter((j) => j.jenis === "pelaksana").length,
  };
  const activeFilters = [
    search ? `Pencarian: ${search}` : null,
    opdFilter !== "all"
      ? `OPD: ${opdList.find((opd) => opd.id === opdFilter)?.nama ?? opdFilter}`
      : null,
    jenisFilter !== "all" ? `Jenis: ${jenisFilter}` : null,
  ].filter((value): value is string => Boolean(value));

  return (
    <AdminPageShell>
      <AdminPageHeader
        icon={Briefcase}
        eyebrow="Manajemen data jabatan"
        title="Susun data jabatan dengan tampilan yang lebih rapi, cepat dicari, dan siap dipakai untuk Anjab."
        description="Form penambahan jabatan, statistik, dan tabel kini mengikuti shell admin baru agar proses input data jabatan terasa konsisten dengan modul lain."
        actions={
          <Badge className="rounded-full border border-border/80 bg-background/80 px-3 py-2 text-muted-foreground">
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            Data siap untuk analisis lanjutan
          </Badge>
        }
        aside={
          <>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Total jabatan
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{stats.total}</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Struktur organisasi
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{stats.struktural}</p>
            </div>
          </>
        }
      />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Input Data Jabatan</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Kelola data jabatan untuk analisis jabatan
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 rounded-xl shadow-lg shadow-primary/15">
                  <Plus className="h-4 w-4" />
                  Tambah Jabatan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Tambah Data Jabatan</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="kode">Kode Jabatan</Label>
                      <Input id="kode" placeholder="Contoh: 1.05.01.001" value={newKode} onChange={(e) => setNewKode(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nama">Nama Jabatan</Label>
                      <Input id="nama" placeholder="Nama jabatan" value={newNama} onChange={(e) => setNewNama(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jenis">Jenis Jabatan</Label>
                      <Select value={newJenis} onValueChange={setNewJenis}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="struktural">Struktural</SelectItem>
                          <SelectItem value="fungsional">Fungsional</SelectItem>
                          <SelectItem value="pelaksana">Pelaksana</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eselon">Eselon (jika struktural)</Label>
                      <Select value={newEselon} onValueChange={setNewEselon}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih eselon" />
                        </SelectTrigger>
                        <SelectContent>
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
                    <div className="space-y-2">
                      <Label htmlFor="opd">OPD</Label>
                      <Select value={newOpdId} onValueChange={setNewOpdId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih OPD" />
                        </SelectTrigger>
                        <SelectContent>
                          {opdList.map((opd) => (
                            <SelectItem key={opd.id} value={opd.id}>
                              {opd.nama}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit Kerja</Label>
                      <Input id="unit" placeholder="Unit kerja" value={newUnitKerja} onChange={(e) => setNewUnitKerja(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ikhtisar">Ikhtisar Jabatan</Label>
                    <Textarea id="ikhtisar" placeholder="Deskripsi singkat tugas jabatan" rows={3} value={newIkhtisar} onChange={(e) => setNewIkhtisar(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pendidikan">Kualifikasi Pendidikan</Label>
                    <Input id="pendidikan" placeholder="Contoh: S1 Administrasi/Manajemen" value={newPendidikan} onChange={(e) => setNewPendidikan(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pengalaman">Pengalaman</Label>
                    <Input id="pengalaman" placeholder="Contoh: Minimal 2 tahun di bidang terkait" value={newPengalaman} onChange={(e) => setNewPengalaman(e.target.value)} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
                  <Button onClick={handleCreate}>Simpan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Jabatan</p>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Struktural</p>
                    <p className="text-2xl font-bold text-foreground">{stats.struktural}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-accent/30 p-3">
                    <FileText className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fungsional</p>
                    <p className="text-2xl font-bold text-foreground">{stats.fungsional}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-muted p-3">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pelaksana</p>
                    <p className="text-2xl font-bold text-foreground">{stats.pelaksana}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardHeader className="border-b border-border/70">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg">Data Jabatan</CardTitle>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {activeFilters.length > 0 ? (
                      activeFilters.map((filter) => (
                        <Badge
                          key={filter}
                          className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-primary"
                        >
                          {filter}
                        </Badge>
                      ))
                    ) : (
                      <Badge className="rounded-full border border-border/80 bg-background/80 px-3 py-1 text-muted-foreground">
                        Semua jabatan aktif
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Cari jabatan..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-11 rounded-xl border-border/70 bg-background/80 pl-9 sm:w-56"
                    />
                  </div>
                  <Select value={opdFilter} onValueChange={setOpdFilter}>
                    <SelectTrigger className="h-11 w-full rounded-xl border-border/70 bg-background/80 sm:w-40">
                      <SelectValue placeholder="Filter OPD" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua OPD</SelectItem>
                      {opdList.map((opd) => (
                        <SelectItem key={opd.id} value={opd.id}>
                          {opd.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={jenisFilter} onValueChange={setJenisFilter}>
                    <SelectTrigger className="h-11 w-full rounded-xl border-border/70 bg-background/80 sm:w-36">
                      <SelectValue placeholder="Filter Jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Jenis</SelectItem>
                      <SelectItem value="struktural">Struktural</SelectItem>
                      <SelectItem value="fungsional">Fungsional</SelectItem>
                      <SelectItem value="pelaksana">Pelaksana</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    className="h-11 rounded-xl border-border/70"
                    onClick={() => {
                      setSearch("");
                      setOpdFilter("all");
                      setJenisFilter("all");
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kode</TableHead>
                      <TableHead>Nama Jabatan</TableHead>
                      <TableHead>Jenis</TableHead>
                      <TableHead>OPD</TableHead>
                      <TableHead>Unit Kerja</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">Memuat data...</TableCell></TableRow>
                    ) : filteredData.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">Tidak ada data jabatan</TableCell></TableRow>
                    ) : filteredData.map((jabatan) => (
                      <TableRow key={jabatan.id} className="transition-colors hover:bg-muted/30">
                        <TableCell className="font-mono text-sm">{jabatan.kode}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{jabatan.nama}</p>
                            {jabatan.eselon && (
                              <p className="text-xs text-muted-foreground">Eselon {jabatan.eselon}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <JenisBadge jenis={jabatan.jenis as "struktural" | "fungsional" | "pelaksana"} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">{jabatan.opd_nama}</TableCell>
                        <TableCell className="text-muted-foreground">{jabatan.unit_kerja}</TableCell>
                        <TableCell>
                          <StatusBadge status={jabatan.status_anjab as "draft" | "final" | "disetujui"} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(jabatan.id)}>
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
    </AdminPageShell>
  );
}
