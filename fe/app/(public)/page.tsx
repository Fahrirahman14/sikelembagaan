"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { api, type DashboardSummary, type LaporanABK, type OPD } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Award,
  BarChart3,
  Briefcase,
  Building2,
  CheckCircle2,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function getStatusBadge(status: string) {
  if (status === "selesai") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "proses") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-border bg-muted text-muted-foreground";
}

function getStatusBar(status: string) {
  if (status === "selesai") return "bg-emerald-500";
  if (status === "proses") return "bg-amber-400";
  return "bg-border";
}

export default function PublicDashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [opdList, setOpdList] = useState<OPD[]>([]);
  const [laporanList, setLaporanList] = useState<LaporanABK[]>([]);

  useEffect(() => {
    api.dashboard.summary().then(setSummary).catch(() => {});
    api.opd.list({ limit: 0 }).then((r) => setOpdList(r.data)).catch(() => {});
    api.laporanAbk.list({ limit: 0 }).then((r) => setLaporanList(r.data)).catch(() => {});
  }, []);

  const totalOPD = summary?.total_opd ?? 0;
  const totalJabatan = summary?.total_jabatan ?? 0;
  const totalPegawai = summary?.total_pegawai ?? 0;
  const avgEfisiensi =
    laporanList.length > 0
      ? laporanList.reduce((sum, l) => sum + l.efisiensi, 0) / laporanList.length
      : 0;
  const opdSelesaiAnjab = summary?.anjab_selesai ?? 0;
  const topPerformer = [...laporanList].sort((a, b) => b.efisiensi - a.efisiensi)[0];
  const largestOPD = [...opdList].sort((a, b) => b.total_pegawai - a.total_pegawai)[0];

  const anjabSelesai = opdList.filter((o) => o.status_anjab === "selesai").length;
  const abkSelesai = opdList.filter((o) => o.status_abk === "selesai").length;

  const stats = [
    { label: "Total OPD", value: totalOPD, sub: "Perangkat daerah", icon: Building2 },
    { label: "Total Jabatan", value: totalJabatan, sub: "Posisi terpetakan", icon: Briefcase },
    { label: "Total Pegawai", value: totalPegawai, sub: "Aktif lintas OPD", icon: Users },
    {
      label: "Rata-rata Efisiensi",
      value: `${avgEfisiensi.toFixed(1)}%`,
      sub: "Dari laporan ABK",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Portal Publik
              </p>
              <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
                Dashboard Kelembagaan
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Gambaran umum OPD, jabatan, pegawai, dan efisiensi kerja lintas instansi secara terbuka.
              </p>
            </div>
            <div className="flex shrink-0 items-start">
              <Badge className="border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="mr-1.5 h-3 w-3" />
                Data aktif
              </Badge>
            </div>
          </div>

          {/* Stat strip */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
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
                <p className="mt-0.5 text-xs text-muted-foreground">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Progress ringkasan Anjab & ABK */}
          {opdList.length > 0 && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-background px-4 py-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">Anjab selesai</span>
                  <span className="font-semibold text-foreground">
                    {anjabSelesai}/{opdList.length} OPD
                  </span>
                </div>
                <Progress
                  value={opdList.length > 0 ? (anjabSelesai / opdList.length) * 100 : 0}
                  className="mt-2 h-1.5"
                />
              </div>
              <div className="rounded-lg border border-border bg-background px-4 py-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">ABK selesai</span>
                  <span className="font-semibold text-foreground">
                    {abkSelesai}/{opdList.length} OPD
                  </span>
                </div>
                <Progress
                  value={opdList.length > 0 ? (abkSelesai / opdList.length) * 100 : 0}
                  className="mt-2 h-1.5"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Module access */}
            <section>
              <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Akses Modul Utama
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    title: "Capaian SAKIP",
                    description:
                      "Pantau nilai akuntabilitas, predikat, dan dokumen kinerja setiap OPD.",
                    href: "/sakip",
                    icon: Award,
                    meta: "Nilai & Dokumen Kinerja",
                  },
                  {
                    title: "Analisis Jabatan",
                    description:
                      "Jelajahi kebutuhan jabatan, kualifikasi inti, dan kondisi beban kerja.",
                    href: "/anjab",
                    icon: BarChart3,
                    meta: `${totalJabatan} jabatan tercatat`,
                  },
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="block">
                    <div className="group flex h-full gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/20 hover:bg-primary/5">
                      <div className="mt-0.5 h-fit rounded-md bg-muted p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <link.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-foreground">{link.title}</p>
                          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                        </div>
                        <p className="mt-0.5 text-sm leading-5 text-muted-foreground">
                          {link.description}
                        </p>
                        <p className="mt-2 text-xs font-medium text-primary">{link.meta}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* OPD Grid */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Organisasi Perangkat Daerah
                </h2>
                <span className="text-xs text-muted-foreground">
                  {Math.min(8, opdList.length)} dari {opdList.length} OPD
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {opdList.slice(0, 8).map((opd) => (
                  <div
                    key={opd.id}
                    className="overflow-hidden rounded-lg border border-border bg-card"
                  >
                    {/* Dual status bar: Anjab | ABK */}
                    <div className="flex h-1">
                      <div
                        className={cn("flex-1 transition-colors", getStatusBar(opd.status_anjab))}
                        title={`Anjab: ${opd.status_anjab}`}
                      />
                      <div
                        className={cn("flex-1 transition-colors", getStatusBar(opd.status_abk))}
                        title={`ABK: ${opd.status_abk}`}
                      />
                    </div>

                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {opd.kode}
                          </p>
                          <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-tight text-foreground">
                            {opd.nama}
                          </h3>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex gap-3 text-xs">
                          <span className="text-muted-foreground">
                            <span className="font-semibold text-foreground">{opd.total_pegawai}</span>{" "}
                            pegawai
                          </span>
                          <span className="text-muted-foreground">
                            <span className="font-semibold text-foreground">{opd.total_jabatan}</span>{" "}
                            jabatan
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <span
                            className={cn(
                              "rounded border px-1.5 py-0.5 text-[10px] font-semibold",
                              getStatusBadge(opd.status_anjab),
                            )}
                          >
                            Anjab
                          </span>
                          <span
                            className={cn(
                              "rounded border px-1.5 py-0.5 text-[10px] font-semibold",
                              getStatusBadge(opd.status_abk),
                            )}
                          >
                            ABK
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Top performer */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Sorotan Data
              </h2>

              <div className="mt-3 space-y-2">
                <div className="rounded-md border border-border bg-muted/40 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Efisiensi Tertinggi
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-sm font-semibold text-foreground">
                    {topPerformer?.opd_nama ?? "Belum ada data"}
                  </p>
                  {topPerformer && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Efisiensi</span>
                        <span className="font-semibold text-foreground">
                          {topPerformer.efisiensi.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={Math.min(100, topPerformer.efisiensi)} className="h-1.5" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md border border-border bg-muted/40 p-3 text-center">
                    <p className="text-lg font-bold text-foreground">{opdSelesaiAnjab}</p>
                    <p className="text-[10px] text-muted-foreground">Anjab selesai</p>
                  </div>
                  <div className="rounded-md border border-border bg-muted/40 p-3 text-center">
                    <p className="text-lg font-bold text-foreground">{laporanList.length}</p>
                    <p className="text-[10px] text-muted-foreground">Laporan ABK</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick info */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Ringkasan Cepat
              </h2>

              <div className="mt-3 divide-y divide-border">
                <div className="pb-3">
                  <p className="text-[10px] text-muted-foreground">OPD pegawai terbanyak</p>
                  <p className="mt-0.5 line-clamp-2 text-sm font-semibold text-foreground">
                    {largestOPD?.nama ?? "—"}
                  </p>
                  {largestOPD && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {largestOPD.total_pegawai} pegawai aktif
                    </p>
                  )}
                </div>
                <div className="py-3">
                  <p className="text-[10px] text-muted-foreground">Total dokumen & laporan</p>
                  <p className="mt-0.5 text-lg font-bold text-foreground">
                    {laporanList.length + totalOPD}
                  </p>
                </div>
                <div className="pt-3">
                  <p className="text-[10px] text-muted-foreground">Status transparansi</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <p className="text-sm font-medium text-foreground">Data tersedia untuk publik</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-6 flex flex-col gap-4 rounded-lg border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-md bg-muted p-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Area pengelolaan tersedia untuk administrator.
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Pembaruan data, evaluasi, dan pengaturan sistem hanya dapat diakses setelah login.
              </p>
            </div>
          </div>
          <Link href="/login">
            <Button size="sm" className="shrink-0 rounded-lg">
              Login Administrator
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
