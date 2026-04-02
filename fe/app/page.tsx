import { AppSidebar } from "@/components/app-sidebar";
import { RecentActivity } from "@/components/recent-activity";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkloadChart } from "@/components/workload-chart";
import { Award, BarChart3, Building2, FileText, Sparkles, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { DashboardClient } from "./dashboard-client";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />

      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(39,81,191,0.1),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(232,183,35,0.16),transparent_20%)] lg:pl-72">
        <div className="absolute left-0 top-10 -z-10 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <header className="sticky top-0 z-30 border-b border-white/50 bg-background/70 backdrop-blur-xl supports-backdrop-filter:bg-background/55">
          <div className="flex h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Ringkasan utama pengelolaan kelembagaan daerah
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1.5 sm:flex">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Tahun 2026
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          <DashboardClient />
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  const totalPegawai = opdDetailList.reduce((total, opd) => total + opd.totalPegawai, 0);
  const avgEfisiensi =
    dummyLaporan.reduce((total, laporan) => total + laporan.efisiensi, 0) /
    dummyLaporan.length;

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />

      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(39,81,191,0.1),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(232,183,35,0.16),transparent_20%)] lg:pl-72">
        <div className="absolute left-0 top-10 -z-10 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <header className="sticky top-0 z-30 border-b border-white/50 bg-background/70 backdrop-blur-xl supports-backdrop-filter:bg-background/55">
          <div className="flex h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Ringkasan utama pengelolaan kelembagaan daerah
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1.5 sm:flex">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Tahun 2026
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          <section className="overflow-hidden rounded-4xl border border-white/60 bg-card/85 p-6 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.25fr_0.9fr] lg:items-center">
              <div className="space-y-6 animate-in fade-in-0 slide-in-from-top-4 duration-700">
                <Badge className="inline-flex rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Panel admin yang lebih modern dan terfokus
                </Badge>

                <div className="max-w-3xl space-y-4">
                  <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    Kendalikan OPD, Anjab, ABK, laporan, dan SAKIP dari satu dashboard yang lebih rapi.
                  </h2>
                  <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                    Tampilan admin sekarang lebih kuat secara visual, lebih cepat dipindai, dan lebih cocok untuk pekerjaan operasional harian.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link href="/sakip">
                    <Button className="rounded-xl shadow-lg shadow-primary/15">
                      Buka SAKIP
                      <Award className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/laporan">
                    <Button variant="outline" className="rounded-xl border-border/70 bg-background/80">
                      Lihat laporan
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 animate-in fade-in-0 slide-in-from-right-6 duration-700">
                <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Ringkasan Cepat
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-foreground">{opdDetailList.length}</p>
                  <p className="mt-1 text-sm text-muted-foreground">OPD aktif terdaftar</p>
                </div>
                <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Efisiensi Rata-rata
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-foreground">{avgEfisiensi.toFixed(1)}%</p>
                  <p className="mt-1 text-sm text-muted-foreground">Berbasis laporan ABK</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total OPD"
              value={opdDetailList.length}
              description="Organisasi Perangkat Daerah"
              icon={Building2}
              variant="primary"
            />
            <StatCard
              title="Total Jabatan"
              value={jabatanDetailList.length}
              description="Jabatan terdata"
              icon={Users}
              trend={{ value: 5.2, isPositive: true }}
            />
            <StatCard
              title="Total Pegawai"
              value={totalPegawai}
              description="Pegawai aktif lintas OPD"
              icon={FileText}
              trend={{ value: 12.5, isPositive: true }}
            />
            <StatCard
              title="Capaian SAKIP"
              value={`${avgEfisiensi.toFixed(1)}%`}
              description="Rata-rata capaian kerja"
              icon={BarChart3}
              trend={{ value: 8.3, isPositive: true }}
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <WorkloadChart />
            <RecentActivity />
          </div>

          <div className="mt-6">
            <OrgStructure />
          </div>

          <div className="mt-6">
            <OPDTable />
          </div>
        </div>
      </main>
    </div>
  );
}
