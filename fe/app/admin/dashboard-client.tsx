"use client";

import { OPDTable } from "@/components/opd-table";
import { OrgStructure } from "@/components/org-structure";
import { RecentActivity } from "@/components/recent-activity";
import { StatCard } from "@/components/stat-card";
import { WorkloadChart } from "@/components/workload-chart";
import { api, DashboardSummary } from "@/lib/api";
import { Award, BarChart3, Building2, FileText } from "lucide-react";
import { useEffect, useState } from "react";

export function DashboardClient() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.dashboard.summary()
      .then(setSummary)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const s = summary;

  return (
    <>
      {/* <section className="overflow-hidden rounded-4xl border border-white/60 bg-card/85 p-6 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8">
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
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Ringkasan Cepat</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">
                {loading ? "—" : s?.total_opd ?? 0}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">OPD aktif terdaftar</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Nilai SAKIP</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">
                {loading ? "—" : (s?.rata_rata_nilai_sakip ?? 0).toFixed(1)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Rata-rata nilai SAKIP</p>
            </div>
          </div>
        </div>
      </section> */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total OPD"
          value={loading ? "—" : s?.total_opd ?? 0}
          description="Organisasi Perangkat Daerah"
          icon={Building2}
          variant="primary"
        />
        <StatCard
          title="Total Jabatan"
          value={loading ? "—" : s?.total_jabatan ?? 0}
          description="Jabatan terdata"
          icon={FileText}
        />
        <StatCard
          title="Total Pegawai"
          value={loading ? "—" : s?.total_pegawai ?? 0}
          description="Pegawai aktif lintas OPD"
          icon={BarChart3}
        />
        <StatCard
          title="Nilai SAKIP"
          value={loading ? "—" : `${(s?.rata_rata_nilai_sakip ?? 0).toFixed(1)}`}
          description="Rata-rata capaian SAKIP"
          icon={Award}
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
    </>
  );
}
