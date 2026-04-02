"use client";

import { LaporanABKComponent } from "@/components/abk/laporan-abk";
import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminPageShell } from "@/components/admin-page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { dummyLaporan } from "@/lib/abk-data";
import { Download, FileText, Printer, ShieldCheck } from "lucide-react";

export default function LaporanPage() {
  const avgEfisiensi =
    dummyLaporan.reduce((total, item) => total + item.efisiensi, 0) / dummyLaporan.length;
  const laporanDisetujui = dummyLaporan.filter((item) => item.status === "disetujui").length;

  return (
    <AdminPageShell>
      <AdminPageHeader
        icon={FileText}
        eyebrow="Laporan ABK"
        title="Kelola, tinjau, dan cetak laporan ABK dari tampilan yang lebih modern."
        description="Jalur laporan ABK sekarang mengikuti shell admin baru supaya proses review dan distribusi hasil analisis beban kerja lebih konsisten dengan modul lain."
        actions={
          <>
            <Button variant="outline" className="gap-2 rounded-xl border-border/70 bg-background/80">
              <Printer className="h-4 w-4" />
              Cetak semua
            </Button>
            <Button className="gap-2 rounded-xl shadow-lg shadow-primary/15">
              <Download className="h-4 w-4" />
              Export laporan
            </Button>
          </>
        }
        aside={
          <>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Efisiensi rata-rata
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">
                {avgEfisiensi.toFixed(1)}%
              </p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Laporan disetujui
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-foreground">{laporanDisetujui}</p>
                </div>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
            </div>
          </>
        }
      />

      <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardContent className="p-4 sm:p-6">
          <LaporanABKComponent />
        </CardContent>
      </Card>
    </AdminPageShell>
  );
}
