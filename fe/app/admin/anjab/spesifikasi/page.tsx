"use client";

import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminPageShell } from "@/components/admin-page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { api, type Jabatan, type OPD } from "@/lib/api";
import {
    Award,
    Brain,
    Building2,
    ClipboardList,
    Clock,
    Download,
    Edit,
    Eye,
    GraduationCap,
    HeartPulse,
    Search,
    Shield,
} from "lucide-react";
import { useEffect, useState } from "react";

// Extended spesifikasi jabatan data
const spesifikasiData = [
  {
    jabatanId: "JD001",
    pendidikanFormal: {
      jenjang: "S2",
      jurusan: ["Ekonomi Pembangunan", "Perencanaan Wilayah", "Administrasi Publik", "Teknik"],
      minimal: "S1",
    },
    pendidikanPelatihan: [
      { nama: "Diklatpim II", jenis: "struktural", wajib: true },
      { nama: "Manajemen Strategis", jenis: "teknis", wajib: true },
      { nama: "Perencanaan Pembangunan Daerah", jenis: "teknis", wajib: true },
      { nama: "Kepemimpinan", jenis: "manajerial", wajib: false },
    ],
    pengalaman: [
      { deskripsi: "Menduduki jabatan eselon III minimal 5 tahun", wajib: true },
      { deskripsi: "Pengalaman di bidang perencanaan minimal 3 tahun", wajib: true },
      { deskripsi: "Pengalaman memimpin tim/organisasi", wajib: false },
    ],
    kompetensi: {
      manajerial: [
        { nama: "Integritas", level: 4, maxLevel: 5 },
        { nama: "Kerjasama", level: 4, maxLevel: 5 },
        { nama: "Komunikasi", level: 4, maxLevel: 5 },
        { nama: "Orientasi pada Hasil", level: 4, maxLevel: 5 },
        { nama: "Pelayanan Publik", level: 4, maxLevel: 5 },
        { nama: "Pengembangan Diri", level: 4, maxLevel: 5 },
        { nama: "Mengelola Perubahan", level: 4, maxLevel: 5 },
        { nama: "Pengambilan Keputusan", level: 4, maxLevel: 5 },
      ],
      teknis: [
        { nama: "Perencanaan Pembangunan", level: 5, maxLevel: 5 },
        { nama: "Analisis Kebijakan", level: 4, maxLevel: 5 },
        { nama: "Monitoring dan Evaluasi", level: 4, maxLevel: 5 },
        { nama: "Pengelolaan Data", level: 3, maxLevel: 5 },
      ],
    },
    kondisiFisik: {
      usia: "Maksimal 58 tahun",
      kesehatan: "Sehat jasmani dan rohani",
      kondisiKhusus: "Tidak dipersyaratkan",
    },
  },
  {
    jabatanId: "JD004",
    pendidikanFormal: {
      jenjang: "S1",
      jurusan: ["Administrasi Publik", "Ekonomi", "Hukum", "Ilmu Pemerintahan"],
      minimal: "S1",
    },
    pendidikanPelatihan: [
      { nama: "Diklat Analis Kebijakan", jenis: "fungsional", wajib: true },
      { nama: "Metode Penelitian", jenis: "teknis", wajib: true },
      { nama: "Analisis Data", jenis: "teknis", wajib: false },
    ],
    pengalaman: [
      { deskripsi: "Pengalaman di bidang analisis minimal 2 tahun", wajib: true },
      { deskripsi: "Pengalaman menyusun kajian/laporan", wajib: true },
    ],
    kompetensi: {
      manajerial: [
        { nama: "Integritas", level: 3, maxLevel: 5 },
        { nama: "Kerjasama", level: 3, maxLevel: 5 },
        { nama: "Komunikasi", level: 3, maxLevel: 5 },
        { nama: "Orientasi pada Hasil", level: 3, maxLevel: 5 },
      ],
      teknis: [
        { nama: "Analisis Kebijakan", level: 4, maxLevel: 5 },
        { nama: "Penulisan Ilmiah", level: 4, maxLevel: 5 },
        { nama: "Pengolahan Data", level: 4, maxLevel: 5 },
        { nama: "Presentasi", level: 3, maxLevel: 5 },
      ],
    },
    kondisiFisik: {
      usia: "Tidak ada batasan",
      kesehatan: "Sehat jasmani dan rohani",
      kondisiKhusus: "Tidak dipersyaratkan",
    },
  },
];

export default function SpesifikasiJabatanPage() {
  const [search, setSearch] = useState("");
  const [opdFilter, setOpdFilter] = useState("all");
  const [selectedJabatan, setSelectedJabatan] = useState<Jabatan | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [opdList, setOpdList] = useState<OPD[]>([]);
  const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);

  useEffect(() => {
    api.opd.list().then(setOpdList);
    api.jabatan.list().then(setJabatanList);
  }, []);

  const filteredData = jabatanList.filter((jabatan) => {
    const matchSearch =
      jabatan.nama.toLowerCase().includes(search.toLowerCase()) ||
      jabatan.kode.includes(search);
    const matchOpd = opdFilter === "all" || jabatan.opd_id === opdFilter;
    return matchSearch && matchOpd;
  });

  const getSpesifikasiData = (jabatanId: string) => {
    return spesifikasiData.find((s) => s.jabatanId === jabatanId) || {
      pendidikanFormal: {
        jenjang: "S1",
        jurusan: ["Sesuai dengan bidang jabatan"],
        minimal: "D3",
      },
      pendidikanPelatihan: [
        { nama: "Pelatihan dasar jabatan", jenis: "teknis", wajib: true },
      ],
      pengalaman: [
        { deskripsi: "Sesuai dengan persyaratan jabatan", wajib: true },
      ],
      kompetensi: {
        manajerial: [
          { nama: "Integritas", level: 2, maxLevel: 5 },
          { nama: "Kerjasama", level: 2, maxLevel: 5 },
          { nama: "Komunikasi", level: 2, maxLevel: 5 },
        ],
        teknis: [
          { nama: "Kompetensi teknis jabatan", level: 3, maxLevel: 5 },
        ],
      },
      kondisiFisik: {
        usia: "Sesuai ketentuan",
        kesehatan: "Sehat jasmani dan rohani",
        kondisiKhusus: "Tidak dipersyaratkan",
      },
    };
  };

  const openDetail = (jabatan: Jabatan) => {
    setSelectedJabatan(jabatan);
    setDetailOpen(true);
  };
  const activeFilters = [
    search ? `Pencarian: ${search}` : null,
    opdFilter !== "all"
      ? `OPD: ${opdList.find((opd) => opd.id === opdFilter)?.nama ?? opdFilter}`
      : null,
  ].filter((value): value is string => Boolean(value));

  return (
    <AdminPageShell>
      <AdminPageHeader
        icon={ClipboardList}
        eyebrow="Spesifikasi jabatan"
        title="Persyaratan pendidikan dan kompetensi jabatan kini tersaji lebih jelas."
        description="Tampilan spesifikasi jabatan diselaraskan dengan desain admin baru agar proses telaah kebutuhan kompetensi, pengalaman, dan pelatihan terasa lebih cepat dipahami."
        actions={
          <Button variant="outline" className="gap-2 rounded-xl border-border/70 bg-background/80">
            <Download className="h-4 w-4" />
            Export
          </Button>
        }
        aside={
          <>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Total jabatan
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{jabatanList.length}</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Pelatihan aktif
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">24</p>
            </div>
          </>
        }
      />

          {/* Stats */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <ClipboardList className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Jabatan</p>
                    <p className="text-2xl font-bold text-foreground">{jabatanList.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rata-rata Pendidikan</p>
                    <p className="text-2xl font-bold text-foreground">S1</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-accent/30 p-3">
                    <Award className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pelatihan</p>
                    <p className="text-2xl font-bold text-foreground">24</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-emerald-100 p-3">
                    <Brain className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Kompetensi Terdaftar</p>
                    <p className="text-2xl font-bold text-foreground">48</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter */}
          <Card className="mb-6 border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari jabatan..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-11 rounded-xl border-border/70 bg-background/80 pl-9"
                  />
                </div>
                <Select value={opdFilter} onValueChange={setOpdFilter}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-border/70 bg-background/80 sm:w-64">
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
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
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
                    Semua spesifikasi jabatan aktif
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardHeader className="border-b border-border/70">
              <CardTitle className="text-lg">Daftar Spesifikasi Jabatan</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/70 hover:bg-transparent">
                      <TableHead>Kode</TableHead>
                      <TableHead>Nama Jabatan</TableHead>
                      <TableHead>OPD</TableHead>
                      <TableHead>Pendidikan</TableHead>
                      <TableHead>Pengalaman</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((jabatan) => (
                      <TableRow key={jabatan.id} className="cursor-pointer border-border/60 hover:bg-background/80" onClick={() => openDetail(jabatan)}>
                        <TableCell className="font-mono text-sm">{jabatan.kode}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{jabatan.nama}</p>
                            <p className="text-xs text-muted-foreground">{jabatan.unit_kerja}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{jabatan.opd_nama}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-primary/5">
                            <GraduationCap className="mr-1 h-3 w-3" />
                            {jabatan.kualifikasi_pendidikan?.split(" ")[0] ?? "S1"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                          {jabatan.pengalaman}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openDetail(jabatan); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                              <Edit className="h-4 w-4" />
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

          {/* Detail Dialog */}
          <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Spesifikasi Jabatan
                </DialogTitle>
              </DialogHeader>
              {selectedJabatan && (
                <div className="space-y-6 py-4">
                  {/* Header Info */}
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <Building2 className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{selectedJabatan.nama}</h3>
                        <p className="text-muted-foreground">{selectedJabatan.opd_nama} - {selectedJabatan.unit_kerja}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pendidikan */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      Pendidikan Formal
                    </h4>
                    <div className="rounded-lg border p-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Jenjang Pendidikan</p>
                          <p className="font-semibold">{getSpesifikasiData(selectedJabatan.id).pendidikanFormal.jenjang}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Minimal</p>
                          <p className="font-semibold">{getSpesifikasiData(selectedJabatan.id).pendidikanFormal.minimal}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-sm text-muted-foreground">Jurusan/Program Studi</p>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {getSpesifikasiData(selectedJabatan.id).pendidikanFormal.jurusan.map((j, i) => (
                              <Badge key={i} variant="outline">{j}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Pelatihan */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                      <Award className="h-5 w-5 text-accent-foreground" />
                      Pelatihan
                    </h4>
                    <div className="space-y-2">
                      {getSpesifikasiData(selectedJabatan.id).pendidikanPelatihan.map((p, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                          <div className="flex items-center gap-3">
                            <div className={`h-2 w-2 rounded-full ${p.wajib ? "bg-destructive" : "bg-muted-foreground"}`} />
                            <div>
                              <p className="font-medium">{p.nama}</p>
                              <p className="text-xs text-muted-foreground capitalize">{p.jenis}</p>
                            </div>
                          </div>
                          <Badge variant={p.wajib ? "destructive" : "outline"}>
                            {p.wajib ? "Wajib" : "Diutamakan"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Pengalaman */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                      <Clock className="h-5 w-5 text-primary" />
                      Pengalaman Kerja
                    </h4>
                    <ul className="space-y-2">
                      {getSpesifikasiData(selectedJabatan.id).pengalaman.map((p, i) => (
                        <li key={i} className="flex items-start gap-3 rounded-lg border p-3">
                          <Shield className={`mt-0.5 h-4 w-4 shrink-0 ${p.wajib ? "text-destructive" : "text-muted-foreground"}`} />
                          <div className="flex-1">
                            <p className="text-muted-foreground">{p.deskripsi}</p>
                          </div>
                          <Badge variant={p.wajib ? "destructive" : "outline"} className="shrink-0">
                            {p.wajib ? "Wajib" : "Opsional"}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  {/* Kompetensi */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                      <Brain className="h-5 w-5 text-emerald-600" />
                      Kompetensi
                    </h4>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="rounded-lg border p-4">
                        <h5 className="mb-3 font-medium text-foreground">Kompetensi Manajerial</h5>
                        <div className="space-y-3">
                          {getSpesifikasiData(selectedJabatan.id).kompetensi.manajerial.map((k, i) => (
                            <div key={i}>
                              <div className="mb-1 flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{k.nama}</span>
                                <span className="font-medium">Level {k.level}</span>
                              </div>
                              <Progress value={(k.level / k.maxLevel) * 100} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <h5 className="mb-3 font-medium text-foreground">Kompetensi Teknis</h5>
                        <div className="space-y-3">
                          {getSpesifikasiData(selectedJabatan.id).kompetensi.teknis.map((k, i) => (
                            <div key={i}>
                              <div className="mb-1 flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{k.nama}</span>
                                <span className="font-medium">Level {k.level}</span>
                              </div>
                              <Progress value={(k.level / k.maxLevel) * 100} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Kondisi Fisik */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                      <HeartPulse className="h-5 w-5 text-destructive" />
                      Kondisi Fisik
                    </h4>
                    <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Usia</p>
                        <p className="font-medium">{getSpesifikasiData(selectedJabatan.id).kondisiFisik.usia}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Kesehatan</p>
                        <p className="font-medium">{getSpesifikasiData(selectedJabatan.id).kondisiFisik.kesehatan}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Kondisi Khusus</p>
                        <p className="font-medium">{getSpesifikasiData(selectedJabatan.id).kondisiFisik.kondisiKhusus}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
    </AdminPageShell>
  );
}
