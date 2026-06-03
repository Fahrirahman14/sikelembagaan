"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  api,
  type NilaiSAKIP as ApiNilaiSAKIP,
  type DokumenSAKIP,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Award,
  BarChart3,
  ExternalLink,
  FileText,
  Filter,
  Medal,
  Search,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

const PREDIKAT_CONFIG: Record<
  string,
  { bg: string; text: string; border: string; bar: string }
> = {
  AA: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", bar: "bg-emerald-500" },
  A:  { bg: "bg-green-50",   text: "text-green-700",   border: "border-green-200",   bar: "bg-green-500" },
  BB: { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    bar: "bg-blue-500" },
  B:  { bg: "bg-sky-50",     text: "text-sky-700",     border: "border-sky-200",     bar: "bg-sky-400" },
  CC: { bg: "bg-yellow-50",  text: "text-yellow-700",  border: "border-yellow-200",  bar: "bg-yellow-400" },
  C:  { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200",  bar: "bg-orange-400" },
  D:  { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     bar: "bg-red-500" },
};

function getPredikatBadge(predikat: string) {
  const cfg = PREDIKAT_CONFIG[predikat];
  if (!cfg) return "border-border bg-muted text-muted-foreground";
  return `${cfg.border} ${cfg.bg} ${cfg.text}`;
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

function getKomponen(nilaiSakip: ApiNilaiSAKIP) {
  const k = (nilaiSakip.komponen_nilai as Record<string, number> | null) ?? {};
  return {
    perencanaan: k.perencanaan ?? 0,
    pengukuran: k.pengukuran ?? 0,
    pelaporan: k.pelaporan ?? 0,
    evaluasi: k.evaluasi ?? 0,
    capaian: k.capaian ?? 0,
  };
}

export default function PublicSAKIPPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedOPD, setSelectedOPD] = useState<ApiNilaiSAKIP | null>(null);
  const [nilaiList, setNilaiList] = useState<ApiNilaiSAKIP[]>([]);
  const [dokumenList, setDokumenList] = useState<DokumenSAKIP[]>([]);

  useEffect(() => {
    api.nilaiSakip.list({ limit: 0 }).then((r) => setNilaiList(r.data)).catch(() => {});
    api.dokumenSakip.list({ limit: 0 }).then((r) => setDokumenList(r.data)).catch(() => {});
  }, []);

  const totalOPD = nilaiList.length;
  const avgNilai =
    totalOPD > 0 ? nilaiList.reduce((sum, n) => sum + n.nilai_total, 0) / totalOPD : 0;
  const predikatA = nilaiList.filter((n) => n.predikat === "A" || n.predikat === "AA").length;
  const predikatBB = nilaiList.filter((n) => n.predikat === "BB" || n.predikat === "B").length;

  // Distribusi predikat untuk visualisasi bar
  const predikatOrder = ["AA", "A", "BB", "B", "CC", "C", "D"];
  const predikatDist = predikatOrder.map((p) => ({
    label: p,
    count: nilaiList.filter((n) => n.predikat === p).length,
    cfg: PREDIKAT_CONFIG[p],
  }));

  const years = Array.from(new Set(nilaiList.map((n) => n.tahun))).sort((a, b) => b - a);

  const filteredNilai = nilaiList.filter((nilai) => {
    const matchSearch = (nilai.opd_nama ?? "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchYear =
      selectedYear === "all" || nilai.tahun.toString() === selectedYear;
    return matchSearch && matchYear;
  });

  const filteredDokumen = dokumenList.filter((dok) => {
    const matchSearch =
      (dok.opd_nama ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      dok.nama_dokumen.toLowerCase().includes(searchTerm.toLowerCase());
    const matchYear =
      selectedYear === "all" || dok.tahun.toString() === selectedYear;
    return matchSearch && matchYear;
  });

  const activeFilters = [
    searchTerm ? `Pencarian: ${searchTerm}` : null,
    selectedYear !== "all" ? `Tahun: ${selectedYear}` : null,
  ].filter((value): value is string => Boolean(value));

  const topScore = [...filteredNilai].sort((a, b) => b.nilai_total - a.nilai_total)[0];
  const filterAnimationKey = `${searchTerm}-${selectedYear}`;

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedYear("all");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Capaian Kinerja
              </p>
              <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
                SAKIP — Akuntabilitas Kinerja Instansi
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Nilai, predikat, dan dokumen kinerja OPD tersedia untuk publik.
              </p>
            </div>
            <div className="flex shrink-0 items-start">
              <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 py-1.5">
                <Award className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  {totalOPD} OPD dinilai
                </span>
              </div>
            </div>
          </div>

          {/* Stat strip */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "OPD Dinilai", value: totalOPD, icon: BarChart3 },
              { label: "Rata-rata Nilai", value: avgNilai.toFixed(1), icon: TrendingUp },
              { label: "Predikat A / AA", value: predikatA, icon: Medal },
              { label: "Predikat BB / B", value: predikatBB, icon: FileText },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-border bg-background px-4 py-3"
              >
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <stat.icon className="h-3.5 w-3.5 text-muted-foreground/40" />
                </div>
                <p className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Distribusi predikat */}
          {totalOPD > 0 && (
            <div className="mt-4 rounded-lg border border-border bg-background p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Distribusi Predikat — {totalOPD} OPD
              </p>
              <div className="flex h-3 overflow-hidden rounded-full border border-border">
                {predikatDist.map((item) =>
                  item.count > 0 ? (
                    <div
                      key={item.label}
                      className={cn("h-full", item.cfg.bar)}
                      style={{ width: `${(item.count / totalOPD) * 100}%` }}
                      title={`${item.label}: ${item.count} OPD`}
                    />
                  ) : null,
                )}
              </div>
              <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
                {predikatDist.map((item) =>
                  item.count > 0 ? (
                    <div key={item.label} className="flex items-center gap-1.5 text-xs">
                      <div className={cn("h-2 w-2 rounded-full", item.cfg.bar)} />
                      <span className="font-semibold text-foreground">{item.label}</span>
                      <span className="text-muted-foreground">
                        {item.count} OPD ({((item.count / totalOPD) * 100).toFixed(0)}%)
                      </span>
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[264px_minmax(0,1fr)]">
          {/* Sidebar filter */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">Filter Data</h2>
              </div>
              <div className="space-y-4 p-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    Cari OPD / dokumen
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Nama OPD atau dokumen"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-9 pl-9 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    Tahun
                  </label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Semua tahun" />
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

                {/* Result status */}
                <div className="rounded-md border border-dashed border-border bg-muted/20 p-3">
                  <p className="text-xs font-medium text-foreground">Status filter</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {filteredNilai.length} nilai · {filteredDokumen.length} dokumen
                  </p>
                  {activeFilters.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {activeFilters.map((f) => (
                        <Badge
                          key={f}
                          className="rounded border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] text-primary"
                        >
                          {f}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="h-9 w-full text-sm"
                  onClick={resetFilters}
                  disabled={activeFilters.length === 0}
                >
                  Reset filter
                </Button>
              </div>
            </div>

            {/* Top scorer */}
            {topScore && (
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Nilai Tertinggi (tersaring)
                </p>
                <p className="mt-2 line-clamp-3 text-sm font-semibold text-foreground">
                  {topScore.opd_nama}
                </p>
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Total nilai</span>
                    <span className="font-bold text-foreground">
                      {topScore.nilai_total.toFixed(2)}
                    </span>
                  </div>
                  <Progress value={Math.min(100, topScore.nilai_total)} className="h-1.5" />
                </div>
                <div className="mt-3">
                  <Badge
                    className={cn(
                      "rounded border px-2.5 py-0.5 text-xs font-bold",
                      getPredikatBadge(topScore.predikat),
                    )}
                  >
                    Predikat {topScore.predikat}
                  </Badge>
                </div>
              </div>
            )}

            {/* Info SAKIP */}
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-start gap-2.5">
                <Award className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Tentang SAKIP</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Sistem Akuntabilitas Kinerja Instansi Pemerintah — rangkaian sistematis
                    untuk penetapan, pengukuran, dan pelaporan kinerja instansi.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  {filteredNilai.length} penilaian ditemukan
                </h2>
                {activeFilters.length > 0 && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Dengan filter: {activeFilters.join(", ")}
                  </p>
                )}
              </div>
            </div>

            <div
              key={filterAnimationKey}
              className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
            >
              <Tabs defaultValue="nilai" className="space-y-4">
                <TabsList className="h-9">
                  <TabsTrigger value="nilai" className="text-sm">
                    Nilai SAKIP
                  </TabsTrigger>
                  <TabsTrigger value="dokumen" className="text-sm">
                    Dokumen
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="nilai">
                  <div className="overflow-hidden rounded-lg border border-border bg-card">
                    <div className="border-b border-border px-4 py-3">
                      <h3 className="text-sm font-semibold text-foreground">
                        Hasil Penilaian SAKIP
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Nilai akuntabilitas kinerja per OPD
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <Table className="min-w-[860px]">
                        <TableHeader>
                          <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="w-[200px] text-xs font-semibold">OPD</TableHead>
                            <TableHead className="w-[64px] text-center text-xs font-semibold">Tahun</TableHead>
                            <TableHead className="w-[88px] text-center text-xs font-semibold">Perencanaan</TableHead>
                            <TableHead className="w-[88px] text-center text-xs font-semibold">Pengukuran</TableHead>
                            <TableHead className="w-[80px] text-center text-xs font-semibold">Pelaporan</TableHead>
                            <TableHead className="w-[72px] text-center text-xs font-semibold">Evaluasi</TableHead>
                            <TableHead className="w-[72px] text-center text-xs font-semibold">Capaian</TableHead>
                            <TableHead className="w-[64px] text-center text-xs font-semibold">Total</TableHead>
                            <TableHead className="w-[72px] text-center text-xs font-semibold">Predikat</TableHead>
                            <TableHead className="w-[64px] text-center text-xs font-semibold">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredNilai.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={10}
                                className="py-10 text-center text-sm text-muted-foreground"
                              >
                                Tidak ada data ditemukan
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredNilai.map((nilai) => (
                              <TableRow key={nilai.id} className="text-sm">
                                <TableCell className="w-[200px] font-medium">
                                  <span className="block truncate" title={nilai.opd_nama ?? ""}>
                                    {nilai.opd_nama}
                                  </span>
                                </TableCell>
                                <TableCell className="text-center tabular-nums">
                                  {nilai.tahun}
                                </TableCell>
                                <TableCell className="text-center tabular-nums">
                                  {getKomponen(nilai).perencanaan}
                                </TableCell>
                                <TableCell className="text-center tabular-nums">
                                  {getKomponen(nilai).pengukuran}
                                </TableCell>
                                <TableCell className="text-center tabular-nums">
                                  {getKomponen(nilai).pelaporan}
                                </TableCell>
                                <TableCell className="text-center tabular-nums">
                                  {getKomponen(nilai).evaluasi}
                                </TableCell>
                                <TableCell className="text-center tabular-nums">
                                  {getKomponen(nilai).capaian}
                                </TableCell>
                                <TableCell className="text-center font-bold tabular-nums">
                                  {nilai.nilai_total}
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge
                                    className={cn(
                                      "rounded border px-2 py-0.5 text-xs font-bold",
                                      getPredikatBadge(nilai.predikat),
                                    )}
                                  >
                                    {nilai.predikat}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs"
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
                  </div>
                </TabsContent>

                <TabsContent value="dokumen">
                  <div className="overflow-hidden rounded-lg border border-border bg-card">
                    <div className="border-b border-border px-4 py-3">
                      <h3 className="text-sm font-semibold text-foreground">Dokumen SAKIP</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Dokumen perencanaan dan pelaporan kinerja
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <Table className="min-w-[700px]">
                        <TableHeader>
                          <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="w-[180px] text-xs font-semibold">OPD</TableHead>
                            <TableHead className="w-[80px] text-xs font-semibold">Jenis</TableHead>
                            <TableHead className="text-xs font-semibold">Nama Dokumen</TableHead>
                            <TableHead className="w-[64px] text-center text-xs font-semibold">Tahun</TableHead>
                            <TableHead className="w-[88px] text-center text-xs font-semibold">Upload</TableHead>
                            <TableHead className="w-[64px] text-center text-xs font-semibold">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDokumen.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="py-10 text-center text-sm text-muted-foreground"
                              >
                                Tidak ada dokumen ditemukan
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredDokumen.map((dok) => (
                              <TableRow key={dok.id} className="text-sm">
                                <TableCell className="w-[180px] font-medium">
                                  <span className="block truncate" title={dok.opd_nama ?? ""}>
                                    {dok.opd_nama}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="whitespace-nowrap text-xs">
                                    {getJenisDokumenLabel(dok.jenis_dokumen)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <span className="block truncate" title={dok.nama_dokumen}>
                                    {dok.nama_dokumen}
                                  </span>
                                </TableCell>
                                <TableCell className="text-center tabular-nums">{dok.tahun}</TableCell>
                                <TableCell className="text-center text-xs text-muted-foreground">
                                  {dok.created_at
                                    ? new Date(dok.created_at).toLocaleDateString("id-ID")
                                    : "—"}
                                </TableCell>
                                <TableCell className="text-center">
                                  {dok.file_path && (
                                    <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                                      <a
                                        href={dok.file_path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <ExternalLink className="mr-1 h-3 w-3" />
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
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedOPD} onOpenChange={() => setSelectedOPD(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Nilai SAKIP</DialogTitle>
            <DialogDescription>
              {selectedOPD?.opd_nama} — Tahun {selectedOPD?.tahun}
            </DialogDescription>
          </DialogHeader>
          {selectedOPD && (
            <div className="space-y-5">
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total Nilai</p>
                  <p className="mt-1 text-3xl font-bold tabular-nums text-foreground">
                    {selectedOPD.nilai_total}
                  </p>
                </div>
                <Badge
                  className={cn(
                    "rounded border px-3 py-1.5 text-base font-bold",
                    getPredikatBadge(selectedOPD.predikat),
                  )}
                >
                  {selectedOPD.predikat}
                </Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-5">
                {[
                  { label: "Perencanaan", value: getKomponen(selectedOPD).perencanaan, max: 30 },
                  { label: "Pengukuran", value: getKomponen(selectedOPD).pengukuran, max: 25 },
                  { label: "Pelaporan", value: getKomponen(selectedOPD).pelaporan, max: 15 },
                  { label: "Evaluasi", value: getKomponen(selectedOPD).evaluasi, max: 10 },
                  { label: "Capaian", value: getKomponen(selectedOPD).capaian, max: 20 },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-border bg-muted/20 p-3 text-center"
                  >
                    <p className="text-[10px] font-medium text-muted-foreground">{item.label}</p>
                    <p className="mt-1.5 text-xl font-bold tabular-nums text-foreground">
                      {item.value}
                    </p>
                    <p className="text-[10px] text-muted-foreground">/ {item.max}</p>
                    <Progress
                      value={(item.value / item.max) * 100}
                      className="mt-2 h-1.5"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Diunggah: {selectedOPD.uploaded_by ?? "—"}</span>
                <span>
                  {selectedOPD.created_at
                    ? new Date(selectedOPD.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
