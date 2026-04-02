"use client";

import { PerhitunganABK } from "@/components/abk/perhitungan-abk";
import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminPageShell } from "@/components/admin-page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { dummyHasilPerhitungan } from "@/lib/abk-data";
import { BarChart3, Gauge } from "lucide-react";

export default function PerhitunganPage() {
  const avgBeban =
    dummyHasilPerhitungan.reduce((total, item) => total + item.bebanKerja, 0) /
    dummyHasilPerhitungan.length;
  const totalKebutuhan = dummyHasilPerhitungan.reduce(
    (total, item) => total + item.kebutuhanPegawai,
    0,
  );
  const posisiKekurangan = dummyHasilPerhitungan.filter(
    (item) => item.keterangan === "Kekurangan",
  ).length;

  return (
    <AdminPageShell>
      <AdminPageHeader
        icon={BarChart3}
        eyebrow="Analisis beban kerja"
        title="Pantau kebutuhan pegawai dan indeks beban kerja dalam satu tampilan yang lebih jelas."
        description="Halaman ini merangkum kondisi perhitungan ABK agar tim dapat membaca prioritas kebutuhan pegawai dengan lebih cepat dan nyaman."
        actions={
          <>
            <Button className="rounded-xl shadow-lg shadow-primary/15">Perbarui Perhitungan</Button>
            <Badge className="rounded-full border border-border/80 bg-background/80 px-3 py-2 text-muted-foreground">
              Data simulasi aktif
            </Badge>
          </>
        }
        aside={
          <>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Rata-rata beban
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-foreground">
                    {avgBeban.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Gauge className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Kebutuhan pegawai
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-foreground">{totalKebutuhan}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Posisi kurang SDM
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-foreground">{posisiKekurangan}</p>
                </div>
              </div>
            </div>
          </>
        }
      />

      <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardContent className="p-4 sm:p-6">
          <PerhitunganABK />
        </CardContent>
      </Card>
    </AdminPageShell>
  );
}
