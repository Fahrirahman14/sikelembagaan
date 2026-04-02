"use client";

import { AktivitasForm, AktivitasFormData } from "@/components/abk/aktivitas-form";
import { AktivitasTable } from "@/components/abk/aktivitas-table";
import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminPageShell } from "@/components/admin-page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Aktivitas, daftarJabatan, dummyAktivitas } from "@/lib/abk-data";
import { ClipboardList, Download, FileSpreadsheet, Upload } from "lucide-react";
import { useState } from "react";

export default function InputAktivitasPage() {
  const [aktivitasList, setAktivitasList] = useState<Aktivitas[]>(dummyAktivitas);

  const handleAddAktivitas = (data: AktivitasFormData) => {
    const jabatan = daftarJabatan.find((j) => j.id === data.jabatanId);
    const newAktivitas: Aktivitas = {
      id: `${Date.now()}`,
      jabatanId: data.jabatanId,
      namaJabatan: jabatan?.nama || "",
      uraianTugas: data.uraianTugas,
      satuan: data.satuan,
      normaWaktu: data.normaWaktu,
      targetKuantitas: data.targetKuantitas,
      frekuensi: data.frekuensi,
      kategori: data.kategori,
    };
    setAktivitasList([...aktivitasList, newAktivitas]);
  };

  const handleDeleteAktivitas = (id: string) => {
    setAktivitasList(aktivitasList.filter((a) => a.id !== id));
  };

  const totalJabatan = new Set(aktivitasList.map((a) => a.jabatanId)).size;

  return (
    <AdminPageShell>
      <AdminPageHeader
        icon={ClipboardList}
        eyebrow="Input aktivitas kerja"
        title="Susun aktivitas kerja sebagai fondasi utama perhitungan ABK yang lebih akurat."
        description="Form dan tabel aktivitas disusun ulang dalam shell admin yang konsisten agar proses input, import, dan review data terasa lebih cepat."
        actions={
          <>
            <Button variant="outline" className="gap-2 rounded-xl border-border/70 bg-background/80">
              <Upload className="h-4 w-4" />
              Import Excel
            </Button>
            <Button className="gap-2 rounded-xl shadow-lg shadow-primary/15">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </>
        }
        aside={
          <>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Total aktivitas
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{aktivitasList.length}</p>
              <p className="mt-1 text-sm text-muted-foreground">aktivitas terdaftar</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Jabatan tercakup
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{totalJabatan}</p>
              <p className="mt-1 text-sm text-muted-foreground">jabatan berbeda</p>
            </div>
          </>
        }
      />

      <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <ClipboardList className="h-4 w-4 text-primary" />
                    Total Aktivitas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{aktivitasList.length}</p>
                  <p className="text-xs text-muted-foreground">aktivitas terdaftar</p>
                </CardContent>
              </Card>

              <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <FileSpreadsheet className="h-4 w-4 text-accent-foreground" />
                    Jabatan Tercakup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {new Set(aktivitasList.map((a) => a.jabatanId)).size}
                  </p>
                  <p className="text-xs text-muted-foreground">jabatan berbeda</p>
                </CardContent>
              </Card>

              <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur sm:col-span-2 lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Aksi Cepat</CardTitle>
                  <CardDescription>Import/Export data aktivitas</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl border-border/70 bg-background/80">
                    <Upload className="h-4 w-4" />
                    Import Excel
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl border-border/70 bg-background/80">
                    <Download className="h-4 w-4" />
                    Export Excel
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl border-border/70 bg-background/80">
                    <Download className="h-4 w-4" />
                    Download Template
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Daftar Aktivitas Kerja</CardTitle>
                  <CardDescription>
                    Data aktivitas akan digunakan untuk menghitung beban kerja per jabatan
                  </CardDescription>
                </div>
                <AktivitasForm onSubmit={handleAddAktivitas} />
              </CardHeader>
              <CardContent>
                <AktivitasTable
                  data={aktivitasList}
                  onDelete={handleDeleteAktivitas}
                />
              </CardContent>
            </Card>

            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-sm font-medium">Panduan Input Aktivitas</CardTitle>
                  <Badge className="rounded-full border border-accent/30 bg-accent/10 text-accent-foreground">
                    4 langkah
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>1. Pilih OPD dan Jabatan</strong> - Tentukan unit kerja dan jabatan yang akan diinput aktivitasnya
                </p>
                <p>
                  <strong>2. Isi Uraian Tugas</strong> - Jelaskan aktivitas kerja secara spesifik dan terukur
                </p>
                <p>
                  <strong>3. Tentukan Norma Waktu</strong> - Waktu rata-rata yang dibutuhkan untuk menyelesaikan 1 satuan aktivitas (dalam menit)
                </p>
                <p>
                  <strong>4. Isi Target dan Frekuensi</strong> - Jumlah output yang harus dicapai dalam periode tertentu
                </p>
              </CardContent>
            </Card>
      </div>
    </AdminPageShell>
  );
}
