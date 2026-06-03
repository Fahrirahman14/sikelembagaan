"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, type Jabatan, type OPD, type PerhitunganABK } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Building2,
  ChevronDown,
  CircleAlert,
  Gauge,
  Search,
  SlidersHorizontal,
  Target,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

type JenisJabatan = "struktural" | "fungsional" | "pelaksana";
type JenisFilter = "all" | JenisJabatan;

const jenisOptions: Array<{ value: JenisFilter; label: string }> = [
  { value: "all", label: "Semua" },
  { value: "struktural", label: "Struktural" },
  { value: "fungsional", label: "Fungsional" },
  { value: "pelaksana", label: "Pelaksana" },
];

const jenisBadgeClass: Record<JenisJabatan, string> = {
  struktural: "border-primary/20 bg-primary/10 text-primary",
  fungsional: "border-amber-200 bg-amber-50 text-amber-800",
  pelaksana: "border-slate-200 bg-slate-100 text-slate-700",
};

const jenisBarClass: Record<JenisJabatan, string> = {
  struktural: "bg-primary",
  fungsional: "bg-amber-400",
  pelaksana: "bg-slate-400",
};

function getBebanTone(beban: number) {
  if (beban > 1.2)
    return {
      label: "Tinggi",
      badge: "border-red-200 bg-red-50 text-red-700",
      surface: "border-red-200/60 bg-red-50/60",
    };
  if (beban > 1.0)
    return {
      label: "Sedang",
      badge: "border-amber-200 bg-amber-50 text-amber-800",
      surface: "border-amber-200/60 bg-amber-50/60",
    };
  return {
    label: "Normal",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    surface: "border-emerald-200/60 bg-emerald-50/60",
  };
}

function getStatusBadge(keterangan: string) {
  if (keterangan === "Kekurangan") return "border-destructive/20 bg-destructive/10 text-destructive";
  if (keterangan === "Kelebihan") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  return "border-primary/20 bg-primary/10 text-primary";
}

function getBebanProgress(beban: number) {
  return Math.max(12, Math.min(100, beban * 40));
}

function getPegawaiProgress(existing: number, needed: number) {
  if (needed <= 0) return 0;
  return Math.min(100, (existing / needed) * 100);
}

interface ExpandedRows {
  [key: string]: boolean;
}

export default function PublicAnjabPage() {
  const [search, setSearch] = useState("");
  const [opdFilter, setOpdFilter] = useState("all");
  const [jenisFilter, setJenisFilter] = useState<JenisFilter>("all");
  const [expandedRows, setExpandedRows] = useState<ExpandedRows>({});
  const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);
  const [opdList, setOpdList] = useState<OPD[]>([]);
  const [perhitunganList, setPerhitunganList] = useState<PerhitunganABK[]>([]);

  useEffect(() => {
    api.jabatan.list({ limit: 0 }).then((r) => setJabatanList(r.data)).catch(() => {});
    api.opd.list({ limit: 0 }).then((r) => setOpdList(r.data)).catch(() => {});
    api.perhitungan.list({ limit: 0 }).then((r) => setPerhitunganList(r.data)).catch(() => {});
  }, []);

  const filteredJabatan = jabatanList.filter((jabatan) => {
    const matchSearch =
      jabatan.nama.toLowerCase().includes(search.toLowerCase()) ||
      jabatan.kode.includes(search);
    const matchOpd = opdFilter === "all" || jabatan.opd_id === opdFilter;
    const matchJenis = jenisFilter === "all" || jabatan.jenis === jenisFilter;
    return matchSearch && matchOpd && matchJenis;
  });

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetFilters = () => {
    setSearch("");
    setOpdFilter("all");
    setJenisFilter("all");
  };

  const stats = {
    total: jabatanList.length,
    struktural: jabatanList.filter((j) => j.jenis === "struktural").length,
    fungsional: jabatanList.filter((j) => j.jenis === "fungsional").length,
    pelaksana: jabatanList.filter((j) => j.jenis === "pelaksana").length,
  };

  const filteredIds = new Set(filteredJabatan.map((j) => j.id));
  const filteredPerhitungan = perhitunganList.filter((item) => filteredIds.has(item.jabatan_id));

  const activeFilters = [
    search ? `Pencarian: ${search}` : null,
    opdFilter !== "all"
      ? `OPD: ${opdList.find((o) => o.id === opdFilter)?.nama ?? opdFilter}`
      : null,
    jenisFilter !== "all" ? `Jenis: ${jenisFilter.charAt(0).toUpperCase() + jenisFilter.slice(1)}` : null,
  ].filter((v): v is string => Boolean(v));

  const hasActiveFilters = activeFilters.length > 0;
  const averageBeban = filteredPerhitungan.length
    ? filteredPerhitungan.reduce((t, item) => t + item.beban_kerja, 0) / filteredPerhitungan.length
    : 0;
  const highPressureCount = filteredPerhitungan.filter((i) => i.keterangan === "Kekurangan").length;
  const balancedCount = filteredPerhitungan.filter((i) => i.keterangan === "Sesuai").length;
  const highestLoad = filteredPerhitungan.reduce<PerhitunganABK | undefined>(
    (cur, item) => (!cur || item.beban_kerja > cur.beban_kerja ? item : cur),
    undefined,
  );
  const filteredOpdCount = new Set(filteredJabatan.map((item) => item.opd_id)).size;
  const filterAnimationKey = `${search}-${opdFilter}-${jenisFilter}`;

  // Distribusi jenis jabatan untuk visualisasi
  const jenisDistItems: Array<{ key: JenisJabatan; label: string; count: number }> = [
    { key: "struktural", label: "Struktural", count: stats.struktural },
    { key: "fungsional", label: "Fungsional", count: stats.fungsional },
    { key: "pelaksana", label: "Pelaksana", count: stats.pelaksana },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Analisis Jabatan
              </p>
              <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
                Anjab — Peta Jabatan & Beban Kerja
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Kualifikasi jabatan, distribusi posisi, dan analisis beban kerja per OPD secara publik.
              </p>
            </div>
            <div className="flex shrink-0 items-start">
              <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 py-1.5">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  {stats.total} jabatan tercatat
                </span>
              </div>
            </div>
          </div>

          {/* Stat strip */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Total Jabatan", value: stats.total, icon: Briefcase },
              { label: "OPD Tercakup", value: new Set(jabatanList.map((j) => j.opd_id)).size, icon: Building2 },
              { label: "Rata-rata Beban", value: averageBeban ? averageBeban.toFixed(2) : "0.00", icon: Gauge },
              { label: "Posisi Kurang SDM", value: highPressureCount, icon: CircleAlert },
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

          {/* Distribusi jenis jabatan */}
          {stats.total > 0 && (
            <div className="mt-4 rounded-lg border border-border bg-background p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Distribusi Jenis Jabatan — {stats.total} posisi
              </p>
              <div className="flex h-3 overflow-hidden rounded-full border border-border">
                {jenisDistItems.map((item) =>
                  item.count > 0 ? (
                    <div
                      key={item.key}
                      className={cn("h-full", jenisBarClass[item.key])}
                      style={{ width: `${(item.count / stats.total) * 100}%` }}
                      title={`${item.label}: ${item.count}`}
                    />
                  ) : null,
                )}
              </div>
              <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
                {jenisDistItems.map((item) => (
                  <div key={item.key} className="flex items-center gap-1.5 text-xs">
                    <div className={cn("h-2 w-2 rounded-full", jenisBarClass[item.key])} />
                    <span className="font-semibold text-foreground">{item.label}</span>
                    <span className="text-muted-foreground">
                      {item.count} ({stats.total > 0 ? ((item.count / stats.total) * 100).toFixed(0) : 0}%)
                    </span>
                  </div>
                ))}
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
                <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">Filter Jabatan</h2>
              </div>
              <div className="space-y-4 p-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    Cari jabatan
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Nama, kode, atau OPD"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-9 pl-9 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    Filter OPD
                  </label>
                  <Select value={opdFilter} onValueChange={setOpdFilter}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Semua OPD" />
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

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    Jenis jabatan
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {jenisOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setJenisFilter(option.value)}
                        className={cn(
                          "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                          jenisFilter === option.value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-md border border-dashed border-border bg-muted/20 p-3">
                  <p className="text-xs font-medium text-foreground">Status filter</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {filteredJabatan.length} dari {stats.total} jabatan tampil
                  </p>
                  {hasActiveFilters && (
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
                  disabled={!hasActiveFilters}
                >
                  Reset filter
                </Button>
              </div>
            </div>

            {/* Insight tersaring */}
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Insight Tersaring
                </p>
                <Target className="h-3.5 w-3.5 text-muted-foreground/50" />
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2.5 text-xs">
                  <span className="text-muted-foreground">OPD terlihat</span>
                  <span className="font-bold text-foreground">{filteredOpdCount}</span>
                </div>
                <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2.5 text-xs">
                  <span className="text-muted-foreground">Beban rata-rata</span>
                  <span className="font-bold text-foreground">
                    {averageBeban ? averageBeban.toFixed(2) : "0.00"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-md border border-red-200/60 bg-red-50/60 px-3 py-2.5 text-xs">
                  <div>
                    <p className="font-medium text-red-700">Perlu perhatian</p>
                    <p className="text-red-600/70">Kekurangan pegawai</p>
                  </div>
                  <p className="text-lg font-bold text-red-700">{highPressureCount}</p>
                </div>
                <div className="flex items-center justify-between rounded-md border border-blue-200/60 bg-blue-50/60 px-3 py-2.5 text-xs">
                  <div>
                    <p className="font-medium text-blue-700">Seimbang</p>
                    <p className="text-blue-600/70">Kebutuhan sesuai</p>
                  </div>
                  <p className="text-lg font-bold text-blue-700">{balancedCount}</p>
                </div>

                {/* Highest load */}
                {highestLoad && (
                  <div className="rounded-md border border-border bg-muted/40 p-3">
                    <p className="text-[10px] text-muted-foreground">Beban tertinggi</p>
                    <p className="mt-0.5 line-clamp-2 text-xs font-semibold text-foreground">
                      {highestLoad.jabatan_nama}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Indeks</span>
                      <span className="font-bold text-foreground">
                        {highestLoad.beban_kerja.toFixed(2)}
                      </span>
                    </div>
                    <Progress
                      value={getBebanProgress(highestLoad.beban_kerja)}
                      className="mt-1 h-1.5"
                    />
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  {filteredJabatan.length} jabatan ditemukan
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Klik kartu untuk membuka detail kualifikasi dan beban kerja.
                </p>
              </div>
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-1.5">
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

            <div
              key={filterAnimationKey}
              className="space-y-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
            >
              {filteredJabatan.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-14 text-center">
                  <div className="mb-3 rounded-full bg-muted p-4">
                    <Briefcase className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    Hasil belum ditemukan
                  </h3>
                  <p className="mt-1.5 max-w-sm text-sm leading-6 text-muted-foreground">
                    Coba longgarkan kata kunci atau ubah filter OPD dan jenis jabatan.
                  </p>
                  <Button className="mt-4 rounded-lg" onClick={resetFilters}>
                    Tampilkan semua data
                  </Button>
                </div>
              ) : (
                filteredJabatan.map((jabatan) => {
                  const perhitungan = perhitunganList.find(
                    (item) => item.jabatan_id === jabatan.id,
                  );
                  const isExpanded = expandedRows[jabatan.id];
                  const beban = perhitungan ? getBebanTone(perhitungan.beban_kerja) : null;
                  const jenisClass =
                    jenisBadgeClass[jabatan.jenis as JenisJabatan] ??
                    "border-border bg-muted text-muted-foreground";

                  return (
                    <div
                      key={jabatan.id}
                      className="overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-border/80"
                    >
                      <button
                        type="button"
                        onClick={() => toggleRow(jabatan.id)}
                        aria-expanded={isExpanded}
                        className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <div className="p-4 sm:p-5">
                          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                            <div className="flex min-w-0 gap-3.5">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                              </div>

                              <div className="min-w-0 space-y-2">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <Badge
                                    className={cn(
                                      "rounded border px-2 py-0.5 text-xs font-semibold",
                                      jenisClass,
                                    )}
                                  >
                                    {jabatan.jenis.charAt(0).toUpperCase() + jabatan.jenis.slice(1)}
                                  </Badge>
                                  <Badge className="rounded border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                    {jabatan.opd_nama}
                                  </Badge>
                                </div>

                                <div>
                                  <h3 className="text-base font-semibold text-foreground">
                                    {jabatan.nama}
                                  </h3>
                                  <p className="mt-0.5 text-xs text-muted-foreground">
                                    {jabatan.unit_kerja} · Kode {jabatan.kode}
                                  </p>
                                </div>

                                <p className="max-w-2xl text-sm leading-5 text-muted-foreground line-clamp-2">
                                  {jabatan.ikhtisar}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-start xl:pl-2">
                              {beban && (
                                <Badge
                                  className={cn(
                                    "rounded border px-2.5 py-0.5 text-xs font-semibold",
                                    beban.badge,
                                  )}
                                >
                                  {beban.label}{" "}
                                  {perhitungan && `(${perhitungan.beban_kerja.toFixed(2)})`}
                                </Badge>
                              )}
                              <div className="rounded-md border border-border bg-muted/40 p-1.5 text-muted-foreground">
                                <ChevronDown
                                  className={cn(
                                    "h-4 w-4 transition-transform duration-200",
                                    isExpanded && "rotate-180",
                                  )}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Info bar */}
                          <div className="mt-4 grid gap-2 sm:grid-cols-3">
                            <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                Unit Kerja
                              </p>
                              <p className="mt-0.5 text-sm font-medium text-foreground">
                                {jabatan.unit_kerja}
                              </p>
                            </div>
                            <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                Pendidikan
                              </p>
                              <p className="mt-0.5 line-clamp-1 text-sm font-medium text-foreground">
                                {jabatan.kualifikasi_pendidikan}
                              </p>
                            </div>
                            <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                Pengalaman
                              </p>
                              <p className="mt-0.5 line-clamp-1 text-sm font-medium text-foreground">
                                {jabatan.pengalaman}
                              </p>
                            </div>
                          </div>

                          {/* Beban kerja inline */}
                          {perhitungan && (
                            <div
                              className={cn(
                                "mt-3 rounded-md border p-3",
                                beban?.surface,
                              )}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-4 text-sm">
                                  <div>
                                    <span className="text-xs text-muted-foreground">Indeks beban </span>
                                    <span className="font-bold text-foreground tabular-nums">
                                      {perhitungan.beban_kerja.toFixed(2)}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-xs text-muted-foreground">Kebutuhan </span>
                                    <span className="font-bold text-foreground">
                                      {perhitungan.kebutuhan_pegawai} org
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-xs text-muted-foreground">Tersedia </span>
                                    <span className="font-bold text-foreground">
                                      {perhitungan.pegawai_existing} org
                                    </span>
                                  </div>
                                </div>
                                <Badge
                                  className={cn(
                                    "rounded border px-2.5 py-0.5 text-xs font-semibold",
                                    getStatusBadge(perhitungan.keterangan),
                                  )}
                                >
                                  {perhitungan.keterangan}{" "}
                                  {perhitungan.selisih > 0 ? "+" : ""}
                                  {perhitungan.selisih}
                                </Badge>
                              </div>
                              <Progress
                                value={getBebanProgress(perhitungan.beban_kerja)}
                                className="mt-2 h-1.5 bg-black/5"
                              />
                            </div>
                          )}
                        </div>
                      </button>

                      {/* Expanded detail */}
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
                          <div className="border-t border-border" />
                          <div className="space-y-4 bg-muted/20 p-4 sm:p-5 animate-in fade-in-0 slide-in-from-top-1 duration-200">
                            <div className="grid gap-3 lg:grid-cols-3">
                              <div className="rounded-lg border border-border bg-background p-4">
                                <h4 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                  Deskripsi Jabatan
                                </h4>
                                <p className="mt-2.5 text-sm leading-6 text-foreground">
                                  {jabatan.ikhtisar}
                                </p>
                              </div>

                              <div className="rounded-lg border border-border bg-background p-4">
                                <h4 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                  Kualifikasi Inti
                                </h4>
                                <div className="mt-2.5 space-y-3 text-sm">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Pendidikan</p>
                                    <p className="mt-0.5 font-medium text-foreground">
                                      {jabatan.kualifikasi_pendidikan}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Pengalaman</p>
                                    <p className="mt-0.5 font-medium text-foreground">
                                      {jabatan.pengalaman}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="rounded-lg border border-border bg-background p-4">
                                <h4 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                  Ringkasan Posisi
                                </h4>
                                <div className="mt-2.5 space-y-3 text-sm">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Jenis jabatan</p>
                                    <div className="mt-1">
                                      <Badge
                                        className={cn(
                                          "rounded border px-2 py-0.5 text-xs font-semibold",
                                          jenisClass,
                                        )}
                                      >
                                        {jabatan.jenis.charAt(0).toUpperCase() +
                                          jabatan.jenis.slice(1)}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Kode jabatan</p>
                                    <p className="mt-0.5 font-mono text-sm font-medium text-foreground">
                                      {jabatan.kode}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {perhitungan && (
                              <div className="rounded-lg border border-border bg-background p-4">
                                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                  <h4 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                    Detail Beban Kerja
                                  </h4>
                                  <Badge
                                    className={cn(
                                      "w-fit rounded border px-2.5 py-0.5 text-xs font-semibold",
                                      getStatusBadge(perhitungan.keterangan),
                                    )}
                                  >
                                    {perhitungan.keterangan}{" "}
                                    {perhitungan.selisih > 0 ? "+" : ""}
                                    {perhitungan.selisih}
                                  </Badge>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                  {[
                                    {
                                      label: "Total waktu kerja",
                                      value: perhitungan.total_waktu_kerja,
                                      unit: "Jam/tahun",
                                    },
                                    {
                                      label: "Waktu efektif",
                                      value: perhitungan.total_waktu_kerja,
                                      unit: "Jam/tahun",
                                    },
                                    {
                                      label: "Indeks beban kerja",
                                      value: perhitungan.beban_kerja.toFixed(2),
                                      unit: "Rasio",
                                    },
                                    {
                                      label: "Kebutuhan pegawai",
                                      value: perhitungan.kebutuhan_pegawai,
                                      unit: "Orang",
                                    },
                                  ].map((item) => (
                                    <div
                                      key={item.label}
                                      className="rounded-md border border-border bg-muted/30 p-3"
                                    >
                                      <p className="text-xs text-muted-foreground">{item.label}</p>
                                      <p className="mt-1 text-xl font-bold tabular-nums text-foreground">
                                        {item.value}
                                      </p>
                                      <p className="text-[10px] text-muted-foreground">{item.unit}</p>
                                    </div>
                                  ))}
                                </div>

                                <div className="mt-3 rounded-md border border-border bg-muted/30 p-3">
                                  <div className="flex items-center justify-between gap-3">
                                    <div>
                                      <p className="text-sm font-medium text-foreground">
                                        Perbandingan pegawai tersedia
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {perhitungan.pegawai_existing} dari{" "}
                                        {perhitungan.kebutuhan_pegawai} yang dibutuhkan
                                      </p>
                                    </div>
                                    <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                                  </div>
                                  <Progress
                                    value={getPegawaiProgress(
                                      perhitungan.pegawai_existing,
                                      perhitungan.kebutuhan_pegawai,
                                    )}
                                    className="mt-2.5 h-2"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
