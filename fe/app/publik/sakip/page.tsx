"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dokumenSAKIPList, NilaiSAKIP, nilaiSAKIPList } from "@/lib/abk-data";
import { cn } from "@/lib/utils";
import {
    Award,
    BarChart3,
    CheckCircle2,
    ExternalLink,
    FileText,
    Filter,
    Medal,
    Search,
    ShieldCheck,
    Sparkles,
    TrendingUp,
} from "lucide-react";
import { useState } from "react";

function getPredikatColor(predikat: string) {
  switch (predikat) {
    case "AA":
      return "border-emerald-200 bg-emerald-500 text-white";
    case "A":
      return "border-green-200 bg-green-500 text-white";
    case "BB":
      return "border-blue-200 bg-blue-500 text-white";
    case "B":
      return "border-cyan-200 bg-cyan-500 text-white";
    case "CC":
      return "border-yellow-200 bg-yellow-500 text-white";
    case "C":
      return "border-orange-200 bg-orange-500 text-white";
    case "D":
      return "border-red-200 bg-red-500 text-white";
    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

function getPredikatSurface(predikat: string) {
  switch (predikat) {
    case "AA":
      return "border-emerald-200/70 bg-emerald-50/70";
    case "A":
      return "border-green-200/70 bg-green-50/70";
    case "BB":
    case "B":
      return "border-blue-200/70 bg-blue-50/70";
    default:
      return "border-amber-200/70 bg-amber-50/70";
  }
}

function getJenisDokumenLabel(jenis: string) {
  const labels: Record<string, string> = {
    renstra: "Renstra",
    renja: "Renja",
    lakip: "LAKIP",
    iku: "IKU",
    tapkin: "Tapkin",
    lainnya: "Lainnya",
  };
  return labels[jenis] || jenis;
}

export default function PublicSAKIPPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedOPD, setSelectedOPD] = useState<NilaiSAKIP | null>(null);

  const totalOPD = nilaiSAKIPList.length;
  const avgNilai = nilaiSAKIPList.reduce((sum, n) => sum + n.nilaiTotal, 0) / totalOPD;
  const predikatA = nilaiSAKIPList.filter((n) => n.predikat === "A" || n.predikat === "AA").length;
  const predikatBB = nilaiSAKIPList.filter((n) => n.predikat === "BB" || n.predikat === "B").length;

  const years = Array.from(new Set(nilaiSAKIPList.map((n) => n.tahun))).sort((a, b) => b - a);

  const filteredNilai = nilaiSAKIPList.filter((nilai) => {
    const matchSearch = nilai.namaOpd.toLowerCase().includes(searchTerm.toLowerCase());
    const matchYear = selectedYear === "all" || nilai.tahun.toString() === selectedYear;
    return matchSearch && matchYear;
  });

  const filteredDokumen = dokumenSAKIPList.filter((dok) => {
    const matchSearch = dok.namaOpd.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dok.namaDokumen.toLowerCase().includes(searchTerm.toLowerCase());
    const matchYear = selectedYear === "all" || dok.tahun.toString() === selectedYear;
    return matchSearch && matchYear;
  });

  const activeFilters = [
    searchTerm ? `Pencarian: ${searchTerm}` : null,
    selectedYear !== "all" ? `Tahun: ${selectedYear}` : null,
  ].filter((value): value is string => Boolean(value));
  const topScore = [...filteredNilai].sort((a, b) => b.nilaiTotal - a.nilaiTotal)[0];
  const filterAnimationKey = `${searchTerm}-${selectedYear}`;

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedYear("all");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(39,81,191,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(232,183,35,0.18),transparent_22%)] py-8 sm:py-10">
      <div className="absolute left-0 top-12 -z-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <section className="relative overflow-hidden rounded-4xl border border-white/60 bg-card/85 p-6 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8 lg:p-10">
            <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.2),transparent_60%)] lg:block" />
            <div className="relative grid gap-8 lg:grid-cols-[1.35fr_0.9fr] lg:items-center">
              <div className="space-y-6 animate-in fade-in-0 slide-in-from-top-4 duration-700">
                <Badge className="inline-flex rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Capaian SAKIP dalam tampilan publik yang lebih eksploratif
                </Badge>

                <div className="max-w-3xl space-y-4">
                  <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                    Pantau nilai, predikat, dan dokumen SAKIP dengan ritme visual yang lebih jelas.
                  </h1>
                  <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                    Halaman ini merangkum performa OPD, memudahkan penyaringan data, dan menampilkan detail penilaian dengan bahasa visual yang konsisten dengan portal publik lainnya.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      label: "OPD Dinilai",
                      value: totalOPD,
                      icon: BarChart3,
                      tone: "bg-primary/10 text-primary",
                    },
                    {
                      label: "Rata-rata Nilai",
                      value: avgNilai.toFixed(1),
                      icon: TrendingUp,
                      tone: "bg-accent/30 text-accent-foreground",
                    },
                    {
                      label: "Predikat A/AA",
                      value: predikatA,
                      icon: Medal,
                      tone: "bg-emerald-100 text-emerald-700",
                    },
                    {
                      label: "Predikat BB/B",
                      value: predikatBB,
                      icon: FileText,
                      tone: "bg-blue-100 text-blue-700",
                    },
                  ].map((stat) => (
                    <Card
                      key={stat.label}
                      className="border-white/60 bg-background/80 shadow-sm backdrop-blur transition-transform duration-300 hover:-translate-y-1"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                              {stat.label}
                            </p>
                            <p className="mt-3 text-3xl font-semibold text-foreground">
                              {stat.value}
                            </p>
                          </div>
                          <div className={cn("rounded-2xl p-3", stat.tone)}>
                            <stat.icon className="h-5 w-5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Card className="overflow-hidden border-0 bg-slate-950 text-slate-50 shadow-2xl shadow-slate-900/25 animate-in fade-in-0 slide-in-from-right-6 duration-700">
                <CardContent className="space-y-6 p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.26em] text-slate-400">
                        Snapshot SAKIP
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold">Sorotan hasil</h2>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-3">
                      <ShieldCheck className="h-5 w-5 text-accent" />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm text-slate-400">Nilai tertinggi pada hasil tersaring</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {topScore?.namaOpd ?? "Belum ada data"}
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">Nilai total</span>
                        <span className="font-medium text-white">
                          {topScore?.nilaiTotal.toFixed(2) ?? "0.00"}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(100, topScore?.nilaiTotal ?? 0)}
                        className="h-2.5 bg-white/10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Dokumen tampil</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{filteredDokumen.length}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Filter aktif</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{activeFilters.length}</p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <p className="text-sm text-slate-300">
                        Penilaian, dokumen, dan detail komponen kini bisa dibaca lebih cepat tanpa kehilangan konteks data.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <Card className="overflow-hidden border-white/60 bg-card/80 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
                <div className="border-b border-border/60 bg-muted/40 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-primary/10 p-2.5 text-primary">
                      <Filter className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">Panel filter</h2>
                      <p className="text-sm text-muted-foreground">
                        Saring nilai dan dokumen secara real-time
                      </p>
                    </div>
                  </div>
                </div>

                <CardContent className="space-y-5 p-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Cari OPD atau dokumen
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Masukkan nama OPD atau dokumen"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-11 rounded-xl border-border/70 bg-background/80 pl-10 shadow-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Filter tahun
                    </label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="h-11 rounded-xl border-border/70 bg-background/80 shadow-none">
                        <SelectValue placeholder="Tahun" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Tahun</SelectItem>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="rounded-2xl border border-dashed border-border/80 bg-muted/30 p-4">
                    <p className="text-sm font-medium text-foreground">Status pencarian</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {filteredNilai.length} nilai dan {filteredDokumen.length} dokumen tampil
                    </p>
                    {activeFilters.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {activeFilters.map((filter) => (
                          <Badge
                            key={filter}
                            className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-primary"
                          >
                            {filter}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-xs text-muted-foreground">
                        Semua data publik sedang ditampilkan.
                      </p>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    className="h-11 w-full rounded-xl border-border/70"
                    onClick={resetFilters}
                  >
                    Reset filter
                  </Button>
                </CardContent>
              </Card>
            </aside>

            <section className="space-y-6">
              <div
                key={filterAnimationKey}
                className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
              >
                <Card className="border-white/60 bg-card/80 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
                  <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
                        Hasil Eksplorasi
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-foreground">
                        {filteredNilai.length} penilaian ditemukan
                      </h2>
                    </div>

                    <div className="flex flex-wrap gap-2">
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
                          Semua hasil sedang ditampilkan
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Tabs defaultValue="nilai" className="space-y-6">
          <TabsList>
            <TabsTrigger value="nilai">Nilai SAKIP</TabsTrigger>
            <TabsTrigger value="dokumen">Dokumen</TabsTrigger>
          </TabsList>

          <TabsContent value="nilai">
            <Card className="border-white/60 bg-card/80 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardHeader>
                <CardTitle>Hasil Penilaian SAKIP</CardTitle>
                <CardDescription>
                  Nilai akuntabilitas kinerja per OPD
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>OPD</TableHead>
                        <TableHead className="text-center">Tahun</TableHead>
                        <TableHead className="text-center">Perencanaan</TableHead>
                        <TableHead className="text-center">Pengukuran</TableHead>
                        <TableHead className="text-center">Pelaporan</TableHead>
                        <TableHead className="text-center">Evaluasi</TableHead>
                        <TableHead className="text-center">Capaian</TableHead>
                        <TableHead className="text-center">Total</TableHead>
                        <TableHead className="text-center">Predikat</TableHead>
                        <TableHead className="text-center">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredNilai.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="py-8 text-center text-muted-foreground">
                            Tidak ada data ditemukan
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredNilai.map((nilai) => (
                          <TableRow key={nilai.id}>
                            <TableCell className="font-medium">{nilai.namaOpd}</TableCell>
                            <TableCell className="text-center">{nilai.tahun}</TableCell>
                            <TableCell className="text-center">{nilai.nilaiPerencanaan}</TableCell>
                            <TableCell className="text-center">{nilai.nilaiPengukuran}</TableCell>
                            <TableCell className="text-center">{nilai.nilaiPelaporan}</TableCell>
                            <TableCell className="text-center">{nilai.nilaiEvaluasi}</TableCell>
                            <TableCell className="text-center">{nilai.nilaiCapaian}</TableCell>
                            <TableCell className="text-center font-bold">{nilai.nilaiTotal}</TableCell>
                            <TableCell className="text-center">
                              <Badge className={cn("rounded-full border px-3 py-1 font-semibold", getPredikatColor(nilai.predikat))}>
                                {nilai.predikat}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedOPD(nilai)}
                              >
                                Detail
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dokumen">
            <Card className="border-white/60 bg-card/80 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardHeader>
                <CardTitle>Dokumen SAKIP</CardTitle>
                <CardDescription>
                  Dokumen perencanaan dan pelaporan kinerja
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>OPD</TableHead>
                        <TableHead>Jenis</TableHead>
                        <TableHead>Nama Dokumen</TableHead>
                        <TableHead className="text-center">Tahun</TableHead>
                        <TableHead className="text-center">Tanggal Upload</TableHead>
                        <TableHead className="text-center">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDokumen.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                            Tidak ada dokumen ditemukan
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredDokumen.map((dok) => (
                          <TableRow key={dok.id}>
                            <TableCell className="font-medium">{dok.namaOpd}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="rounded-full">
                                {getJenisDokumenLabel(dok.jenisDokumen)}
                              </Badge>
                            </TableCell>
                            <TableCell>{dok.namaDokumen}</TableCell>
                            <TableCell className="text-center">{dok.tahun}</TableCell>
                            <TableCell className="text-center">
                              {new Date(dok.uploadedAt).toLocaleDateString("id-ID")}
                            </TableCell>
                            <TableCell className="text-center">
                              {dok.linkDokumen && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                >
                                  <a
                                    href={dok.linkDokumen}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="mr-1 h-4 w-4" />
                                    Lihat
                                  </a>
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
                </Tabs>
              </div>
            </section>
          </div>

        <Dialog open={!!selectedOPD} onOpenChange={() => setSelectedOPD(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detail Nilai SAKIP</DialogTitle>
              <DialogDescription>
                {selectedOPD?.namaOpd} - Tahun {selectedOPD?.tahun}
              </DialogDescription>
            </DialogHeader>
            {selectedOPD && (
              <div className="space-y-6">
                <div className={cn("flex items-center justify-between rounded-3xl border p-5", getPredikatSurface(selectedOPD.predikat))}>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Nilai</p>
                    <p className="text-3xl font-bold text-foreground">{selectedOPD.nilaiTotal}</p>
                  </div>
                  <Badge className={cn("rounded-full border px-4 py-2 text-lg", getPredikatColor(selectedOPD.predikat))}>
                    Predikat {selectedOPD.predikat}
                  </Badge>
                </div>

                <div className="grid gap-4 sm:grid-cols-5">
                  {[
                    { label: "Perencanaan", value: selectedOPD.nilaiPerencanaan, max: 30 },
                    { label: "Pengukuran", value: selectedOPD.nilaiPengukuran, max: 25 },
                    { label: "Pelaporan", value: selectedOPD.nilaiPelaporan, max: 15 },
                    { label: "Evaluasi", value: selectedOPD.nilaiEvaluasi, max: 10 },
                    { label: "Capaian", value: selectedOPD.nilaiCapaian, max: 20 },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-border/70 bg-background/80 p-3 text-center">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-xl font-bold text-foreground">{item.value}</p>
                      <p className="text-xs text-muted-foreground">/ {item.max}</p>
                      <Progress value={(item.value / item.max) * 100} className="mt-3 h-2" />
                    </div>
                  ))}
                </div>

                {selectedOPD.catatan && (
                  <div className="rounded-2xl border border-accent/40 bg-accent/10 p-4">
                    <p className="mb-1 text-sm font-medium text-foreground">Catatan Review</p>
                    <p className="text-sm text-muted-foreground">{selectedOPD.catatan}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Direview oleh: {selectedOPD.reviewedBy}</span>
                  <span>
                    {new Date(selectedOPD.reviewedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Card className="mt-8 border-accent/40 bg-card/80 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
          <CardContent className="flex items-start gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-lg shadow-accent/20">
              <Award className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Tentang SAKIP</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                SAKIP (Sistem Akuntabilitas Kinerja Instansi Pemerintah) adalah rangkaian sistematik
                dari berbagai aktivitas, alat, dan prosedur yang dirancang untuk tujuan penetapan
                dan pengukuran, pengumpulan data, pengklasifikasian, pengikhtisaran, dan pelaporan
                kinerja pada instansi pemerintah.
              </p>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
