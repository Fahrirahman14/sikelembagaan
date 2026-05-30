"use client";

import { LaporanABKComponent } from "@/components/abk/laporan-abk";
import { AdminPageShell } from "@/components/admin-page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Printer } from "lucide-react";

export default function LaporanPage() {
  return (
    <AdminPageShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">ABK - Laporan</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">Laporan ABK</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 rounded-xl border-border/70 bg-background/80">
            <Printer className="h-4 w-4" />
            Cetak semua
          </Button>
          <Button className="gap-2 rounded-xl shadow-lg shadow-primary/15">
            <Download className="h-4 w-4" />
            Export laporan
          </Button>
        </div>
      </div>

      <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardContent className="p-4 sm:p-6">
          <LaporanABKComponent />
        </CardContent>
      </Card>
    </AdminPageShell>
  );
}
