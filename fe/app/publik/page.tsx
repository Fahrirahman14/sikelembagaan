"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { dummyLaporan, jabatanDetailList, opdDetailList } from "@/lib/abk-data";
import { cn } from "@/lib/utils";
import {
    ArrowRight,
    Award,
    BarChart3,
    Briefcase,
    Building2,
    CheckCircle2,
    FileText,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Users,
} from "lucide-react";
import Link from "next/link";

function getStatusTone(status: "belum" | "proses" | "selesai") {
  if (status === "selesai") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "proses") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-600";
}

export default function PublicDashboardPage() {
  const totalOPD = opdDetailList.length;
  const totalJabatan = jabatanDetailList.length;
  const totalPegawai = opdDetailList.reduce((sum, opd) => sum + opd.totalPegawai, 0);
  const avgEfisiensi =
    dummyLaporan.reduce((sum, laporan) => sum + laporan.efisiensi, 0) /
    dummyLaporan.length;
  const opdSelesaiAnjab = opdDetailList.filter((opd) => opd.statusAnjab === "selesai").length;
  const topPerformer = [...dummyLaporan].sort((a, b) => b.efisiensi - a.efisiensi)[0];

  const stats = [
    {
      label: "Total OPD",
      value: totalOPD,
      caption: "Perangkat daerah terdata",
      icon: Building2,
      tone: "bg-primary/10 text-primary",
    },
    {
      label: "Total Jabatan",
      value: totalJabatan,
      caption: "Posisi terpetakan",
      icon: Briefcase,
      tone: "bg-accent/30 text-accent-foreground",
    },
    {
      label: "Total Pegawai",
      value: totalPegawai,
      caption: "Pegawai aktif lintas OPD",
      icon: Users,
      tone: "bg-sky-100 text-sky-700",
    },
    {
      label: "Rata-rata Efisiensi",
      value: `${avgEfisiensi.toFixed(1)}%`,
      caption: "Berdasarkan laporan ABK",
      icon: TrendingUp,
      tone: "bg-emerald-100 text-emerald-700",
    },
  ];

  const quickLinks = [
    {
      title: "Capaian SAKIP",
      description:
        "Pantau nilai akuntabilitas, predikat, dan dokumen kinerja OPD secara terbuka.",
      href: "/publik/sakip",
      icon: Award,
    },
    {
      title: "Analisis Jabatan",
      description:
        "Jelajahi kebutuhan jabatan, kualifikasi inti, dan kondisi beban kerja terkini.",
      href: "/publik/anjab",
      icon: BarChart3,
    },
  ];

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
                  Portal publik kelembagaan yang lebih modern
                </Badge>

                <div className="max-w-3xl space-y-4">
                  <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                    Transparansi struktur kelembagaan, capaian kinerja, dan kebutuhan SDM dalam satu alur visual.
                  </h1>
                  <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                    Dashboard publik ini merangkum OPD, jabatan, efisiensi, dan akses ke halaman analitik utama dengan gaya visual yang seragam dan lebih mudah dipindai.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map((stat) => (
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
                            <p className="mt-1 text-sm text-muted-foreground">{stat.caption}</p>
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
                        Snapshot Publik
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold">Kondisi terbaru</h2>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-3">
                      <ShieldCheck className="h-5 w-5 text-accent" />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm text-slate-400">OPD dengan efisiensi tertinggi</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {topPerformer?.namaOpd ?? "Belum ada data"}
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">Efisiensi</span>
                        <span className="font-medium text-white">
                          {topPerformer?.efisiensi.toFixed(1) ?? "0.0"}%
                        </span>
                      </div>
                      <Progress
                        value={Math.min(100, topPerformer?.efisiensi ?? 0)}
                        className="h-2.5 bg-white/10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Anjab selesai</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{opdSelesaiAnjab}</p>
                      <p className="text-xs text-slate-400">dari {totalOPD} OPD</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Laporan ABK</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{dummyLaporan.length}</p>
                      <p className="text-xs text-slate-400">dataset terpublikasi</p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <p className="text-sm text-slate-300">
                        Informasi publik dirancang agar cepat dipahami oleh warga, pimpinan, maupun perangkat daerah.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_360px]">
            <Card className="border-white/60 bg-card/80 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur animate-in fade-in-0 slide-in-from-bottom-3 duration-700">
              <CardContent className="p-6 sm:p-7">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
                      Akses Utama
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-foreground">
                      Jelajahi modul publik utama
                    </h2>
                  </div>
                  <Badge className="w-fit rounded-full border border-border/80 bg-background/80 px-3 py-1 text-muted-foreground">
                    2 modul prioritas
                  </Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {quickLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <Card className="group h-full border-border/70 bg-background/80 shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                        <CardContent className="flex h-full flex-col gap-5 p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="rounded-2xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                              <link.icon className="h-5 w-5" />
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{link.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                              {link.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/60 bg-card/80 shadow-[0_16px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
              <CardContent className="space-y-5 p-6">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Highlight Data
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-foreground">
                    Ringkasan cepat publik
                  </h2>
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                    <p className="text-sm text-muted-foreground">OPD dengan jumlah pegawai terbesar</p>
                    <p className="mt-2 font-semibold text-foreground">
                      {opdDetailList.sort((a, b) => b.totalPegawai - a.totalPegawai)[0]?.nama}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                    <p className="text-sm text-muted-foreground">Total dokumen dan laporan</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">
                      {dummyLaporan.length + totalOPD}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                    <p className="text-sm text-muted-foreground">Status transparansi</p>
                    <div className="mt-2 flex items-center gap-2 text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="font-medium">Data aktif tersedia untuk publik</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Organisasi Perangkat Daerah
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                  Ringkasan OPD terpublikasi
                </h2>
              </div>
              <Badge className="w-fit rounded-full border border-border/80 bg-background/80 px-3 py-1 text-muted-foreground">
                Menampilkan {Math.min(8, opdDetailList.length)} OPD
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {opdDetailList.slice(0, 8).map((opd, index) => (
                <Card
                  key={opd.id}
                  className="border-white/60 bg-card/80 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur animate-in fade-in-0 slide-in-from-bottom-3 duration-700"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {opd.kode}
                        </p>
                        <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-foreground">
                          {opd.nama}
                        </h3>
                      </div>
                      <div className="rounded-2xl bg-primary/10 p-2.5 text-primary">
                        <Building2 className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl border border-border/70 bg-background/80 p-3">
                        <p className="text-muted-foreground">Pegawai</p>
                        <p className="mt-1 font-semibold text-foreground">{opd.totalPegawai}</p>
                      </div>
                      <div className="rounded-2xl border border-border/70 bg-background/80 p-3">
                        <p className="text-muted-foreground">Jabatan</p>
                        <p className="mt-1 font-semibold text-foreground">{opd.totalJabatan}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge className={cn("rounded-full border px-3 py-1", getStatusTone(opd.statusAnjab))}>
                        Anjab {opd.statusAnjab}
                      </Badge>
                      <Badge className={cn("rounded-full border px-3 py-1", getStatusTone(opd.statusAbk))}>
                        ABK {opd.statusAbk}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="rounded-4xl bg-slate-950 px-6 py-8 text-slate-50 shadow-2xl shadow-slate-900/20 sm:px-8 sm:py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <Badge className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-slate-100">
                  <FileText className="mr-2 h-4 w-4" />
                  Akses lebih lengkap tersedia setelah login
                </Badge>
                <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
                  Masuk ke sistem untuk pengelolaan kelembagaan yang lebih mendalam.
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                  Area administrator menyediakan pengelolaan data, pembaruan dokumen, serta evaluasi yang tidak ditampilkan di portal publik.
                </p>
              </div>

              <Link href="/publik/login">
                <Button size="lg" className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90">
                  Login Administrator
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
