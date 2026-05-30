"use client";

import { PerhitunganABK } from "@/components/abk/perhitungan-abk";
import { AdminPageShell } from "@/components/admin-page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PerhitunganPage() {

  return (
    <AdminPageShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">ABK - Perhitungan</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">Perhitungan ABK</h1>
        </div>
        <Button className="rounded-xl shadow-lg shadow-primary/15">Perbarui Perhitungan</Button>
      </div>


      <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardContent className="p-4 sm:p-6">
          <PerhitunganABK />
        </CardContent>
      </Card>
    </AdminPageShell>
  );
}
