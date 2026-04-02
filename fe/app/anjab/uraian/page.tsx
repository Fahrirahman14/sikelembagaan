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
import { daftarOPD, jabatanDetailList, type JabatanDetail } from "@/lib/abk-data";
import {
    Briefcase,
    Building2,
    CheckCircle,
    ChevronRight,
    Download,
    Edit,
    Eye,
    FileText,
    Printer,
    Search,
    Target,
} from "lucide-react";
import { useState } from "react";

// Extended uraian jabatan data
const uraianJabatanData = [
  {
    jabatanId: "JD001",
    tugas: [
      "Menyusun rencana strategis dan program kerja Bappeda",
      "Mengoordinasikan penyusunan RPJMD dan RKPD",
      "Memimpin dan mengarahkan pelaksanaan tugas seluruh bidang",
      "Melakukan pembinaan dan pengawasan terhadap staf",
      "Mengevaluasi hasil pelaksanaan program dan kegiatan",
    ],
    fungsi: [
      "Perumusan kebijakan teknis di bidang perencanaan pembangunan",
      "Pengoordinasian penyusunan perencanaan pembangunan daerah",
      "Pembinaan dan pelaksanaan tugas di bidang perencanaan",
      "Pelaksanaan tugas lain yang diberikan pimpinan",
    ],
    wewenang: [
      "Mengambil keputusan strategis terkait perencanaan daerah",
      "Menetapkan kebijakan internal organisasi",
      "Memberikan penilaian kinerja bawahan",
      "Mengusulkan mutasi dan promosi pegawai",
    ],
    tanggungJawab: [
      "Tercapainya target kinerja organisasi",
      "Kualitas dokumen perencanaan daerah",
      "Efektivitas koordinasi antar bidang",
      "Pengembangan kapasitas SDM organisasi",
    ],
  },
  {
    jabatanId: "JD002",
    tugas: [
      "Menyusun rencana kegiatan kesekretariatan",
      "Mengoordinasikan penyusunan program dan anggaran",
      "Mengelola administrasi kepegawaian dan keuangan",
      "Menyiapkan bahan evaluasi dan pelaporan",
    ],
    fungsi: [
      "Pengoordinasian penyusunan program kerja",
      "Pengelolaan administrasi umum dan kepegawaian",
      "Pengelolaan keuangan dan aset",
      "Pelayanan administrasi pimpinan",
    ],
    wewenang: [
      "Mengoordinasikan kegiatan antar subbagian",
      "Memvalidasi dokumen administrasi",
      "Mengusulkan kebutuhan anggaran",
    ],
    tanggungJawab: [
      "Kelancaran administrasi organisasi",
      "Akurasi data kepegawaian dan keuangan",
      "Ketepatan waktu pelaporan",
    ],
  },
];

export default function UraianJabatanPage() {
  const [search, setSearch] = useState("");
  const [opdFilter, setOpdFilter] = useState("all");
  const [selectedJabatan, setSelectedJabatan] = useState<JabatanDetail | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredData = jabatanDetailList.filter((jabatan) => {
    const matchSearch =
      jabatan.namaJabatan.toLowerCase().includes(search.toLowerCase()) ||
      jabatan.kodeJabatan.includes(search);
    const matchOpd = opdFilter === "all" || jabatan.opdId === opdFilter;
    return matchSearch && matchOpd;
  });

  const getUraianData = (jabatanId: string) => {
    return uraianJabatanData.find((u) => u.jabatanId === jabatanId) || {
      tugas: ["Melaksanakan tugas sesuai dengan ketentuan yang berlaku"],
      fungsi: ["Pelaksanaan fungsi sesuai jabatan"],
      wewenang: ["Wewenang sesuai dengan tugas pokok"],
      tanggungJawab: ["Bertanggung jawab terhadap pelaksanaan tugas"],
    };
  };

  const openDetail = (jabatan: JabatanDetail) => {
    setSelectedJabatan(jabatan);
    setDetailOpen(true);
  };
  const activeFilters = [
    search ? `Pencarian: ${search}` : null,
    opdFilter !== "all"
      ? `OPD: ${daftarOPD.find((opd) => opd.id === opdFilter)?.nama ?? opdFilter}`
      : null,
  ].filter((value): value is string => Boolean(value));

  return (
    <AdminPageShell>
      <AdminPageHeader
        icon={FileText}
        eyebrow="Uraian tugas jabatan"
        title="Dokumentasi tugas, fungsi, dan tanggung jawab kini tampil lebih mudah dipindai."
        description="Halaman uraian jabatan mengikuti shell admin baru, lengkap dengan ringkasan status, filter yang lebih jelas, dan tabel yang lebih konsisten dengan halaman admin lain."
        actions={
          <>
            <Button variant="outline" className="gap-2 rounded-xl border-border/70 bg-background/80">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" className="gap-2 rounded-xl border-border/70 bg-background/80">
              <Printer className="h-4 w-4" />
              Cetak
            </Button>
          </>
        }
        aside={
          <>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Jabatan terdata
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{jabatanDetailList.length}</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Dokumen lengkap
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">
                {jabatanDetailList.filter((j) => j.statusAnjab === "disetujui").length}
              </p>
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
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Jabatan</p>
                    <p className="text-2xl font-bold text-foreground">{jabatanDetailList.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-emerald-100 p-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sudah Lengkap</p>
                    <p className="text-2xl font-bold text-foreground">
                      {jabatanDetailList.filter((j) => j.statusAnjab === "disetujui").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-accent/30 p-3">
                    <Target className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dalam Proses</p>
                    <p className="text-2xl font-bold text-foreground">
                      {jabatanDetailList.filter((j) => j.statusAnjab === "final").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-muted p-3">
                    <Briefcase className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Draft</p>
                    <p className="text-2xl font-bold text-foreground">
                      {jabatanDetailList.filter((j) => j.statusAnjab === "draft").length}
                    </p>
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
                    {daftarOPD.map((opd) => (
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
                    Menampilkan seluruh uraian jabatan
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardHeader className="border-b border-border/70">
              <CardTitle className="text-lg">Daftar Uraian Jabatan</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/70 hover:bg-transparent">
                      <TableHead>Kode</TableHead>
                      <TableHead>Nama Jabatan</TableHead>
                      <TableHead>OPD</TableHead>
                      <TableHead>Ikhtisar</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((jabatan) => (
                      <TableRow key={jabatan.id} className="cursor-pointer border-border/60 hover:bg-background/80" onClick={() => openDetail(jabatan)}>
                        <TableCell className="font-mono text-sm">{jabatan.kodeJabatan}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{jabatan.namaJabatan}</p>
                            <p className="text-xs text-muted-foreground">{jabatan.unitKerja}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{jabatan.namaOpd}</TableCell>
                        <TableCell className="max-w-xs truncate text-muted-foreground">
                          {jabatan.ikhtisar}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openDetail(jabatan); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Uraian Jabatan
                </DialogTitle>
              </DialogHeader>
              {selectedJabatan && (
                <div className="space-y-6 py-4">
                  {/* Header Info */}
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <Building2 className="mt-0.5 h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Nama Jabatan</p>
                          <p className="font-semibold text-foreground">{selectedJabatan.namaJabatan}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Briefcase className="mt-0.5 h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Unit Kerja</p>
                          <p className="font-semibold text-foreground">{selectedJabatan.unitKerja}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ikhtisar */}
                  <div>
                    <h4 className="mb-2 font-semibold text-foreground">Ikhtisar Jabatan</h4>
                    <p className="text-muted-foreground">{selectedJabatan.ikhtisar}</p>
                  </div>

                  <Separator />

                  {/* Tugas */}
                  <div>
                    <h4 className="mb-3 font-semibold text-foreground">Uraian Tugas</h4>
                    <ul className="space-y-2">
                      {getUraianData(selectedJabatan.id).tugas.map((tugas, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                            {i + 1}
                          </span>
                          <span className="text-muted-foreground">{tugas}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  {/* Fungsi */}
                  <div>
                    <h4 className="mb-3 font-semibold text-foreground">Fungsi</h4>
                    <ul className="space-y-2">
                      {getUraianData(selectedJabatan.id).fungsi.map((fungsi, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          <span className="text-muted-foreground">{fungsi}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  {/* Wewenang & Tanggung Jawab */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <h4 className="mb-3 font-semibold text-foreground">Wewenang</h4>
                      <ul className="space-y-2">
                        {getUraianData(selectedJabatan.id).wewenang.map((w, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span className="text-muted-foreground">{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-3 font-semibold text-foreground">Tanggung Jawab</h4>
                      <ul className="space-y-2">
                        {getUraianData(selectedJabatan.id).tanggungJawab.map((t, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Target className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" />
                            <span className="text-muted-foreground">{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
    </AdminPageShell>
  );
}
