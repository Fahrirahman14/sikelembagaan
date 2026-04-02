"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  daftarOPD,
  dummyHasilPerhitungan,
  type HasilPerhitungan,
  jabatanDetailList,
} from "@/lib/abk-data";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Building2,
  ChevronDown,
  CircleAlert,
  Gauge,
  Info,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

type JenisJabatan = "struktural" | "fungsional" | "pelaksana";
type JenisFilter = "all" | JenisJabatan;

const jenisOptions: Array<{ value: JenisFilter; label: string }> = [
  { value: "all", label: "Semua jenis" },
  { value: "struktural", label: "Struktural" },
  { value: "fungsional", label: "Fungsional" },
  { value: "pelaksana", label: "Pelaksana" },
];

function formatJenisLabel(jenis: JenisJabatan) {
  return jenis.charAt(0).toUpperCase() + jenis.slice(1);
}

function getBebanTone(beban: number) {
  if (beban > 1.2) {
    return {
      label: "Tinggi",
      badgeClass:
        "border-red-200 bg-red-100/90 text-red-700 shadow-sm shadow-red-100",
      surfaceClass: "border-red-200/70 bg-red-50/70",
    };
  }

  if (beban > 1.0) {
    return {
      label: "Sedang",
      badgeClass:
        "border-amber-200 bg-amber-100/90 text-amber-800 shadow-sm shadow-amber-100",
      surfaceClass: "border-amber-200/70 bg-amber-50/70",
    };
  }

  return {
    label: "Normal",
    badgeClass:
      "border-emerald-200 bg-emerald-100/90 text-emerald-700 shadow-sm shadow-emerald-100",
    surfaceClass: "border-emerald-200/70 bg-emerald-50/70",
  };
}

function getStatusTone(status: HasilPerhitungan["keterangan"]) {
  if (status === "Kekurangan") {
    return "border-red-200/80 bg-red-50 text-red-700";
  }

  if (status === "Kelebihan") {
    return "border-emerald-200/80 bg-emerald-50 text-emerald-700";
  }

  return "border-blue-200/80 bg-blue-50 text-blue-700";
}

function getBebanProgress(beban: number) {
  return Math.max(12, Math.min(100, beban * 40));
}

function getPegawaiProgress(existing: number, needed: number) {
  if (needed <= 0) {
    return 0;
  }

  return Math.min(100, (existing / needed) * 100);
}

function JenisBadge({
  jenis,
}: {
  jenis: JenisJabatan;
}) {
  const variants = {
    struktural:
      "border border-primary/15 bg-primary/10 text-primary shadow-sm shadow-primary/5",
    fungsional:
      "border border-amber-200 bg-amber-100/80 text-amber-900 shadow-sm shadow-amber-100",
    pelaksana:
      "border border-slate-200 bg-slate-100/90 text-slate-700 shadow-sm shadow-slate-100",
  };

  return (
    <Badge className={cn("rounded-full px-3 py-1 text-xs font-semibold", variants[jenis])}>
      {formatJenisLabel(jenis)}
    </Badge>
  );
}

function BebanBadge({ beban }: { beban: number }) {
  const tone = getBebanTone(beban);

  return (
    <Badge
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-semibold",
        tone.badgeClass,
      )}
    >
      {tone.label} ({beban.toFixed(2)})
    </Badge>
  );
}

interface ExpandedRows {
  [key: string]: boolean;
}

export default function PublicAnjabPage() {
  const [search, setSearch] = useState("");
  const [opdFilter, setOpdFilter] = useState("all");
  const [jenisFilter, setJenisFilter] = useState<JenisFilter>("all");
  const [expandedRows, setExpandedRows] = useState<ExpandedRows>({});

  const filteredJabatan = jabatanDetailList.filter((jabatan) => {
    const matchSearch =
      jabatan.namaJabatan.toLowerCase().includes(search.toLowerCase()) ||
      jabatan.kodeJabatan.includes(search);
    const matchOpd = opdFilter === "all" || jabatan.opdId === opdFilter;
    const matchJenis =
      jenisFilter === "all" || jabatan.jenisJabatan === jenisFilter;
    return matchSearch && matchOpd && matchJenis;
  });

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const resetFilters = () => {
    setSearch("");
    setOpdFilter("all");
    setJenisFilter("all");
  };

  const stats = {
    total: jabatanDetailList.length,
    struktural: jabatanDetailList.filter((j) => j.jenisJabatan === "struktural")
      .length,
    fungsional: jabatanDetailList.filter((j) => j.jenisJabatan === "fungsional")
      .length,
    pelaksana: jabatanDetailList.filter((j) => j.jenisJabatan === "pelaksana")
      .length,
  };

  const filteredIds = new Set(filteredJabatan.map((jabatan) => jabatan.id));
  const filteredPerhitungan = dummyHasilPerhitungan.filter((item) =>
    filteredIds.has(item.jabatanId),
  );
  const activeFilters = [
    search ? `Pencarian: ${search}` : null,
    opdFilter !== "all"
      ? `OPD: ${daftarOPD.find((opd) => opd.id === opdFilter)?.nama ?? opdFilter}`
      : null,
    jenisFilter !== "all" ? `Jenis: ${formatJenisLabel(jenisFilter)}` : null,
  ].filter((value): value is string => Boolean(value));
  const hasActiveFilters = activeFilters.length > 0;
  const averageBeban = filteredPerhitungan.length
    ? filteredPerhitungan.reduce((total, item) => total + item.bebanKerja, 0) /
      filteredPerhitungan.length
    : 0;
  const highPressureCount = filteredPerhitungan.filter(
    (item) => item.keterangan === "Kekurangan",
  ).length;
  const balancedCount = filteredPerhitungan.filter(
    (item) => item.keterangan === "Sesuai",
  ).length;
  const highestLoad = filteredPerhitungan.reduce<HasilPerhitungan | undefined>(
    (currentHighest, item) => {
      if (!currentHighest || item.bebanKerja > currentHighest.bebanKerja) {
        return item;
      }

      return currentHighest;
    },
    undefined,
  );
  const filteredOpdCount = new Set(filteredJabatan.map((item) => item.opdId)).size;
  const filterAnimationKey = `${search}-${opdFilter}-${jenisFilter}`;
  const dominantJenis = [
    { label: "Struktural", value: stats.struktural },
    { label: "Fungsional", value: stats.fungsional },
    { label: "Pelaksana", value: stats.pelaksana },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(39,81,191,0.14),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(232,183,35,0.18),transparent_24%)] py-8 sm:py-10">
      <div className="absolute left-0 top-8 -z-10 h-52 w-52 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <section className="relative overflow-hidden rounded-4xl border border-white/50 bg-card/85 p-6 shadow-[0_24px_80px_-36px_rgba(30,41,59,0.45)] backdrop-blur sm:p-8 lg:p-10">
            <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.22),transparent_58%)] lg:block" />
            <div className="absolute -right-14 top-10 h-36 w-36 rounded-full border border-primary/10 bg-primary/10 blur-2xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1.35fr_0.9fr] lg:items-center">
              <div className="space-y-6">
                <Badge className="inline-flex rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Dashboard publik yang lebih eksploratif
                </Badge>

                <div className="max-w-3xl space-y-4">
                  <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                    Analisis jabatan yang terasa lebih hidup, cepat dipindai, dan
                    enak dieksplor.
                  </h1>
                  <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                    Halaman ini sekarang menonjolkan gambaran umum, status beban
                    kerja, dan detail jabatan dengan ritme visual yang lebih kuat,
                    sehingga pengguna publik tidak terasa seperti membaca tabel
                    datar.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <Card className="border-white/60 bg-background/80 shadow-sm backdrop-blur">
                    <CardContent className="p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        Total Jabatan
                      </p>
                      <div className="mt-3 flex items-end justify-between gap-3">
                        <p className="text-3xl font-semibold text-foreground">
                          {stats.total}
                        </p>
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-white/60 bg-background/80 shadow-sm backdrop-blur">
                    <CardContent className="p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        OPD Tercakup
                      </p>
                      <div className="mt-3 flex items-end justify-between gap-3">
                        <p className="text-3xl font-semibold text-foreground">
                          {new Set(jabatanDetailList.map((item) => item.opdId)).size}
                        </p>
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-white/60 bg-background/80 shadow-sm backdrop-blur">
                    <CardContent className="p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        Rata-rata Beban
                      </p>
                      <div className="mt-3 flex items-end justify-between gap-3">
                        <p className="text-3xl font-semibold text-foreground">
                          {averageBeban ? averageBeban.toFixed(2) : "0.00"}
                        </p>
                        <Gauge className="h-5 w-5 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-white/60 bg-background/80 shadow-sm backdrop-blur">
                    <CardContent className="p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        Posisi Kurang SDM
                      </p>
                      <div className="mt-3 flex items-end justify-between gap-3">
                        <p className="text-3xl font-semibold text-foreground">
                          {highPressureCount}
                        </p>
                        <CircleAlert className="h-5 w-5 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Card className="overflow-hidden border-0 bg-slate-950 text-slate-50 shadow-2xl shadow-slate-900/25">
                <CardContent className="space-y-6 p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.26em] text-slate-400">
                        Snapshot Publik
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold">
                        Kondisi jabatan saat ini
                      </h2>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-3">
                      <TrendingUp className="h-5 w-5 text-accent" />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm text-slate-400">Sorotan beban tertinggi</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {highestLoad?.namaJabatan ?? "Belum ada data"}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {highestLoad?.namaOpd ?? "-"}
                    </p>
                    {highestLoad && (
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">Indeks beban</span>
                          <span className="font-medium text-white">
                            {highestLoad.bebanKerja.toFixed(2)}
                          </span>
                        </div>
                        <Progress
                          value={getBebanProgress(highestLoad.bebanKerja)}
                          className="h-2.5 bg-white/10"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {dominantJenis.map((item) => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">{item.label}</span>
                          <span className="font-medium text-white">{item.value}</span>
                        </div>
                        <Progress
                          value={(item.value / stats.total) * 100}
                          className="h-2 bg-white/10"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Kebutuhan seimbang</p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {balancedCount}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Filter aktif</p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {activeFilters.length}
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
                      <SlidersHorizontal className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">Panel filter</h2>
                      <p className="text-sm text-muted-foreground">
                        Atur tampilan hasil secara real-time
                      </p>
                    </div>
                  </div>
                </div>

                <CardContent className="space-y-5 p-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Cari jabatan
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Nama, kode, atau OPD"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-11 rounded-xl border-border/70 bg-background/80 pl-10 shadow-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Filter OPD
                    </label>
                    <Select value={opdFilter} onValueChange={setOpdFilter}>
                      <SelectTrigger className="h-11 rounded-xl border-border/70 bg-background/80 shadow-none">
                        <SelectValue placeholder="Pilih OPD" />
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

                  <div>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <label className="block text-sm font-medium text-foreground">
                        Jenis jabatan
                      </label>
                      <span className="text-xs text-muted-foreground">
                        Pilih cepat
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {jenisOptions.map((option) => {
                        const isActive = jenisFilter === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setJenisFilter(option.value)}
                            className={cn(
                              "rounded-full border px-3 py-2 text-sm font-medium transition-all",
                              isActive
                                ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/15"
                                : "border-border/70 bg-background/80 text-muted-foreground hover:border-primary/30 hover:text-foreground",
                            )}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-border/80 bg-muted/30 p-4">
                    <p className="text-sm font-medium text-foreground">Status pencarian</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {filteredJabatan.length} jabatan dari {stats.total} data tampil
                    </p>
                    {hasActiveFilters ? (
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
                        Belum ada filter yang dipersempit.
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

              <Card className="border-white/60 bg-card/80 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        Insight Cepat
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-foreground">
                        Gambaran hasil tersaring
                      </h3>
                    </div>
                    <Target className="mt-1 h-5 w-5 text-primary" />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                      <p className="text-sm text-muted-foreground">OPD terlihat</p>
                      <p className="mt-2 text-2xl font-semibold text-foreground">
                        {filteredOpdCount}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                      <p className="text-sm text-muted-foreground">Beban rata-rata</p>
                      <p className="mt-2 text-2xl font-semibold text-foreground">
                        {averageBeban ? averageBeban.toFixed(2) : "0.00"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-2xl border border-red-200/70 bg-red-50/70 p-4">
                      <div>
                        <p className="text-sm font-medium text-red-700">Perlu perhatian</p>
                        <p className="text-xs text-red-600/80">Kebutuhan pegawai belum terpenuhi</p>
                      </div>
                      <p className="text-2xl font-semibold text-red-700">{highPressureCount}</p>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-blue-200/70 bg-blue-50/70 p-4">
                      <div>
                        <p className="text-sm font-medium text-blue-700">Seimbang</p>
                        <p className="text-xs text-blue-600/80">Kebutuhan sesuai dengan kondisi</p>
                      </div>
                      <p className="text-2xl font-semibold text-blue-700">{balancedCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>

            <section className="space-y-4">
              <Card className="border-white/60 bg-card/80 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
                      Hasil Eksplorasi
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-foreground">
                      {filteredJabatan.length} jabatan ditemukan
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Klik kartu untuk membuka detail kualifikasi, beban kerja,
                      dan kebutuhan pegawai.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {hasActiveFilters ? (
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
                        Semua data sedang ditampilkan
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div
                key={filterAnimationKey}
                className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
              >
                {filteredJabatan.length === 0 ? (
                <Card className="border-dashed border-border/80 bg-card/75 shadow-none">
                  <CardContent className="flex flex-col items-center justify-center px-6 py-14 text-center">
                    <div className="mb-4 rounded-full bg-muted p-4">
                      <Briefcase className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Hasil belum ditemukan
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                      Coba longgarkan kata kunci atau ubah filter OPD dan jenis
                      jabatan agar hasilnya kembali muncul.
                    </p>
                    <Button className="mt-5 rounded-xl" onClick={resetFilters}>
                      Tampilkan semua data
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredJabatan.map((jabatan) => {
                  const perhitungan = dummyHasilPerhitungan.find(
                    (item) => item.jabatanId === jabatan.id,
                  );
                  const isExpanded = expandedRows[jabatan.id];
                  const bebanTone = perhitungan
                    ? getBebanTone(perhitungan.bebanKerja)
                    : null;

                  return (
                    <Card
                      key={jabatan.id}
                      className="group overflow-hidden border border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_-32px_rgba(15,23,42,0.6)]"
                    >
                      <button
                        type="button"
                        onClick={() => toggleRow(jabatan.id)}
                        aria-expanded={isExpanded}
                        className="block w-full text-left focus:outline-none"
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                            <div className="flex min-w-0 flex-1 gap-4">
                              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                <Briefcase className="h-6 w-6" />
                              </div>

                              <div className="min-w-0 space-y-3">
                                <div className="space-y-2">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <JenisBadge jenis={jabatan.jenisJabatan} />
                                    <Badge className="rounded-full border border-border/80 bg-background/80 px-3 py-1 text-muted-foreground">
                                      {jabatan.namaOpd}
                                    </Badge>
                                  </div>

                                  <div>
                                    <h3 className="text-xl font-semibold text-foreground">
                                      {jabatan.namaJabatan}
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                      {jabatan.unitKerja} • Kode {jabatan.kodeJabatan}
                                    </p>
                                  </div>
                                </div>

                                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                                  {jabatan.ikhtisar}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 self-start xl:pl-4">
                              {perhitungan ? <BebanBadge beban={perhitungan.bebanKerja} /> : null}
                              <div className="rounded-full border border-border/70 bg-background/80 p-2 text-muted-foreground transition-transform duration-300 group-hover:bg-primary/5">
                                <ChevronDown
                                  className={cn(
                                    "h-5 w-5 transition-transform duration-300",
                                    isExpanded && "rotate-180",
                                  )}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                              <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                  Unit Kerja
                                </p>
                                <p className="mt-2 font-medium text-foreground">
                                  {jabatan.unitKerja}
                                </p>
                              </div>
                              <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                  Pendidikan
                                </p>
                                <p className="mt-2 line-clamp-2 font-medium text-foreground">
                                  {jabatan.kualifikasiPendidikan}
                                </p>
                              </div>
                              <div className="rounded-2xl border border-border/70 bg-background/80 p-4 sm:col-span-2 xl:col-span-1">
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                  Pengalaman
                                </p>
                                <p className="mt-2 line-clamp-2 font-medium text-foreground">
                                  {jabatan.pengalaman}
                                </p>
                              </div>
                            </div>

                            {perhitungan ? (
                              <div
                                className={cn(
                                  "rounded-3xl border p-4",
                                  bebanTone?.surfaceClass,
                                )}
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                      Beban Kerja
                                    </p>
                                    <p className="mt-2 text-2xl font-semibold text-foreground">
                                      {perhitungan.bebanKerja.toFixed(2)}
                                    </p>
                                  </div>
                                  <Gauge className="h-5 w-5 text-foreground/70" />
                                </div>

                                <div className="mt-4 space-y-2">
                                  <Progress
                                    value={getBebanProgress(perhitungan.bebanKerja)}
                                    className="h-2.5 bg-black/5"
                                  />
                                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Normal 1.00</span>
                                    <span>{bebanTone?.label}</span>
                                  </div>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Kebutuhan</p>
                                    <p className="mt-1 font-semibold text-foreground">
                                      {perhitungan.kebutuhanPegawai} orang
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Pegawai ada</p>
                                    <p className="mt-1 font-semibold text-foreground">
                                      {perhitungan.pegawaiExisting} orang
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </CardContent>
                      </button>

                      <div
                        className={cn(
                          "grid overflow-hidden transition-all duration-300 ease-out",
                          isExpanded
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0",
                        )}
                        aria-hidden={!isExpanded}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <div className="border-t border-border/70" />
                          <CardContent className="space-y-6 bg-muted/20 p-6 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
                              <div className="rounded-3xl border border-border/70 bg-background/85 p-5">
                                <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                  Deskripsi Jabatan
                                </h4>
                                <p className="mt-4 text-sm leading-7 text-foreground">
                                  {jabatan.ikhtisar}
                                </p>
                              </div>

                              <div className="rounded-3xl border border-border/70 bg-background/85 p-5">
                                <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                  Kualifikasi Inti
                                </h4>
                                <div className="mt-4 space-y-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Pendidikan</p>
                                    <p className="mt-1 font-medium text-foreground">
                                      {jabatan.kualifikasiPendidikan}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Pengalaman</p>
                                    <p className="mt-1 font-medium text-foreground">
                                      {jabatan.pengalaman}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="rounded-3xl border border-border/70 bg-background/85 p-5">
                                <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                  Ringkasan Posisi
                                </h4>
                                <div className="mt-4 space-y-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Jenis jabatan</p>
                                    <div className="mt-2">
                                      <JenisBadge jenis={jabatan.jenisJabatan} />
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Kode jabatan</p>
                                    <p className="mt-1 font-medium text-foreground">
                                      {jabatan.kodeJabatan}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {perhitungan && (
                              <div className="space-y-4 rounded-4xl border border-border/70 bg-background/90 p-5">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                  <div>
                                    <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                      Detail Beban Kerja
                                    </h4>
                                    <p className="mt-2 text-lg font-semibold text-foreground">
                                      Evaluasi kebutuhan pegawai dan kapasitas kerja
                                    </p>
                                  </div>
                                  <Badge
                                    className={cn(
                                      "rounded-full border px-3 py-1 text-sm font-semibold",
                                      getStatusTone(perhitungan.keterangan),
                                    )}
                                  >
                                    {perhitungan.keterangan} {perhitungan.selisih > 0 ? "+" : ""}
                                    {perhitungan.selisih}
                                  </Badge>
                                </div>

                                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                  <Card className="border-border/70 bg-muted/20 shadow-none">
                                    <CardContent className="p-4">
                                      <p className="text-sm text-muted-foreground">
                                        Total waktu kerja
                                      </p>
                                      <p className="mt-2 text-2xl font-semibold text-foreground">
                                        {perhitungan.totalWaktuKerja}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        Jam per tahun
                                      </p>
                                    </CardContent>
                                  </Card>
                                  <Card className="border-border/70 bg-muted/20 shadow-none">
                                    <CardContent className="p-4">
                                      <p className="text-sm text-muted-foreground">
                                        Waktu efektif
                                      </p>
                                      <p className="mt-2 text-2xl font-semibold text-foreground">
                                        {perhitungan.waktuKerjaEfektif}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        Jam per tahun
                                      </p>
                                    </CardContent>
                                  </Card>
                                  <Card className="border-border/70 bg-muted/20 shadow-none">
                                    <CardContent className="p-4">
                                      <p className="text-sm text-muted-foreground">
                                        Indeks beban kerja
                                      </p>
                                      <p className="mt-2 text-2xl font-semibold text-foreground">
                                        {perhitungan.bebanKerja.toFixed(2)}
                                      </p>
                                      <p className="text-xs text-muted-foreground">Rasio beban</p>
                                    </CardContent>
                                  </Card>
                                  <Card className="border-border/70 bg-muted/20 shadow-none">
                                    <CardContent className="p-4">
                                      <p className="text-sm text-muted-foreground">
                                        Kebutuhan pegawai
                                      </p>
                                      <p className="mt-2 text-2xl font-semibold text-foreground">
                                        {perhitungan.kebutuhanPegawai}
                                      </p>
                                      <p className="text-xs text-muted-foreground">Orang</p>
                                    </CardContent>
                                  </Card>
                                </div>

                                <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                                  <div className="rounded-3xl border border-border/70 bg-muted/20 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                      <div>
                                        <p className="text-sm font-medium text-foreground">
                                          Perbandingan pegawai tersedia
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {perhitungan.pegawaiExisting} dari {perhitungan.kebutuhanPegawai} pegawai yang dibutuhkan
                                        </p>
                                      </div>
                                      <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <Progress
                                      value={getPegawaiProgress(
                                        perhitungan.pegawaiExisting,
                                        perhitungan.kebutuhanPegawai,
                                      )}
                                      className="mt-4 h-2.5 bg-primary/10"
                                    />
                                  </div>

                                  <div className="rounded-3xl border border-border/70 bg-muted/20 p-4">
                                    <p className="text-sm font-medium text-foreground">
                                      Status kebutuhan
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                      Dibutuhkan {perhitungan.kebutuhanPegawai} orang
                                      dengan selisih {perhitungan.selisih > 0 ? "+" : ""}
                                      {perhitungan.selisih} terhadap kondisi saat ini.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
              </div>
            </section>
          </div>

          <Card className="overflow-hidden border border-accent/30 bg-card/80 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-lg shadow-accent/20">
                <Info className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Tentang Analisis Jabatan</h3>
                <p className="max-w-4xl text-sm leading-7 text-muted-foreground">
                  Data publik ini menampilkan informasi posisi jabatan,
                  kualifikasi dasar, serta hasil analisis beban kerja untuk
                  membantu masyarakat memahami bagaimana struktur organisasi dan
                  kebutuhan sumber daya manusia dipetakan pada tiap OPD.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
