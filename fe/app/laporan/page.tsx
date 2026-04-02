"use client";

import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminPageShell } from "@/components/admin-page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dokumenAnjabList, dummyLaporan, opdDetailList } from "@/lib/abk-data";
import {
    BarChart3,
    Building2,
    Calendar,
    Download,
    Eye,
    FileText,
    Filter,
    Minus,
    Printer,
    Sparkles,
    TrendingDown,
    TrendingUp,
    Users
} from "lucide-react";
import { useState } from "react";

// Summary stats
const summaryStats = {
  totalOPD: opdDetailList.length,
  totalJabatan: opdDetailList.reduce((sum, o) => sum + o.totalJabatan, 0),
  totalPegawai: opdDetailList.reduce((sum, o) => sum + o.totalPegawai, 0),
  anjabSelesai: opdDetailList.filter((o) => o.statusAnjab === "selesai").length,
  abkSelesai: opdDetailList.filter((o) => o.statusAbk === "selesai").length,
  kebutuhanTotal: dummyLaporan.reduce((sum, l) => sum + l.totalKebutuhanPegawai, 0),
  existingTotal: dummyLaporan.reduce((sum, l) => sum + l.totalPegawaiExisting, 0),
};

const rekapPerOPD = opdDetailList.map((opd) => {
  const laporan = dummyLaporan.find((l) => l.opdId === opd.id);
  return {
    ...opd,
    kebutuhanPegawai: laporan?.totalKebutuhanPegawai || 0,
    efisiensi: laporan?.efisiensi || 0,
  };
});

export default function LaporanPage() {
  const [periode, setPeriode] = useState("2024");
  const [reportType, setReportType] = useState("all");

  const selisihPegawai = summaryStats.kebutuhanTotal - summaryStats.existingTotal;
  const persentaseAnjab = (summaryStats.anjabSelesai / summaryStats.totalOPD) * 100;
  const persentaseAbk = (summaryStats.abkSelesai / summaryStats.totalOPD) * 100;

  return (
    <AdminPageShell>
      <AdminPageHeader
        icon={FileText}
        eyebrow="Pusat laporan dan rekap"
        title="Pantau ringkasan Anjab dan ABK dengan tampilan laporan admin yang lebih matang."
        description="Filter, progres, dan tab laporan kini berada dalam bahasa visual yang sama dengan dashboard admin, sehingga pembacaan rekap menjadi lebih nyaman."
        actions={
          <>
            <Button variant="outline" className="gap-2 rounded-xl border-border/70 bg-background/80">
              <Printer className="h-4 w-4" />
              Cetak
            </Button>
            <Button className="gap-2 rounded-xl shadow-lg shadow-primary/15">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </>
        }
        aside={
          <>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Kebutuhan total
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{summaryStats.kebutuhanTotal}</p>
              <p className="mt-1 text-sm text-muted-foreground">kebutuhan pegawai</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Selisih pegawai
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">
                {selisihPegawai > 0 ? `+${selisihPegawai}` : selisihPegawai}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">dibanding kebutuhan</p>
            </div>
          </>
        }
      />

      <Card className="mb-6 border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Periode:</span>
                  <Select value={periode} onValueChange={setPeriode}>
                    <SelectTrigger className="h-11 w-32 rounded-xl border-border/70 bg-background/80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Jenis Laporan:</span>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="h-11 w-48 rounded-xl border-border/70 bg-background/80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Laporan</SelectItem>
                      <SelectItem value="anjab">Anjab</SelectItem>
                      <SelectItem value="abk">ABK</SelectItem>
                      <SelectItem value="summary">Ringkasan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Badge className="w-fit rounded-full border border-primary/15 bg-primary/10 px-3 py-2 text-primary">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Periode aktif {periode}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total OPD</p>
                    <p className="text-2xl font-bold text-foreground">{summaryStats.totalOPD}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Jabatan</p>
                    <p className="text-2xl font-bold text-foreground">{summaryStats.totalJabatan}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-accent/30 p-3">
                    <Users className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pegawai</p>
                    <p className="text-2xl font-bold text-foreground">{summaryStats.totalPegawai}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`rounded-lg p-3 ${selisihPegawai < 0 ? "bg-destructive/10" : selisihPegawai > 0 ? "bg-emerald-100" : "bg-muted"}`}>
                    {selisihPegawai < 0 ? (
                      <TrendingDown className="h-6 w-6 text-destructive" />
                    ) : selisihPegawai > 0 ? (
                      <TrendingUp className="h-6 w-6 text-emerald-600" />
                    ) : (
                      <Minus className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Selisih Pegawai</p>
                    <p className={`text-2xl font-bold ${selisihPegawai < 0 ? "text-destructive" : selisihPegawai > 0 ? "text-emerald-600" : "text-foreground"}`}>
                      {selisihPegawai > 0 ? `+${selisihPegawai}` : selisihPegawai}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  Progress Anjab
                </CardTitle>
                <CardDescription>Kelengkapan dokumen analisis jabatan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {summaryStats.anjabSelesai} dari {summaryStats.totalOPD} OPD
                    </span>
                    <span className="text-lg font-bold text-primary">{persentaseAnjab.toFixed(0)}%</span>
                  </div>
                  <Progress value={persentaseAnjab} className="h-3" />
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-500" />
                      <span>Selesai: {summaryStats.anjabSelesai}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-accent" />
                      <span>Proses: {opdDetailList.filter((o) => o.statusAnjab === "proses").length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-muted" />
                      <span>Belum: {opdDetailList.filter((o) => o.statusAnjab === "belum").length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-accent-foreground" />
                  Progress ABK
                </CardTitle>
                <CardDescription>Kelengkapan analisis beban kerja</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {summaryStats.abkSelesai} dari {summaryStats.totalOPD} OPD
                    </span>
                    <span className="text-lg font-bold text-accent-foreground">{persentaseAbk.toFixed(0)}%</span>
                  </div>
                  <Progress value={persentaseAbk} className="h-3" />
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-500" />
                      <span>Selesai: {summaryStats.abkSelesai}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-accent" />
                      <span>Proses: {opdDetailList.filter((o) => o.statusAbk === "proses").length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-muted" />
                      <span>Belum: {opdDetailList.filter((o) => o.statusAbk === "belum").length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="rekap-opd" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none">
              <TabsTrigger value="rekap-opd" className="gap-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Rekap per OPD</span>
                <span className="sm:hidden">OPD</span>
              </TabsTrigger>
              <TabsTrigger value="dokumen-anjab" className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Dokumen Anjab</span>
                <span className="sm:hidden">Anjab</span>
              </TabsTrigger>
              <TabsTrigger value="laporan-abk" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Laporan ABK</span>
                <span className="sm:hidden">ABK</span>
              </TabsTrigger>
            </TabsList>

            {/* Rekap per OPD */}
            <TabsContent value="rekap-opd">
              <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
                <CardHeader className="border-b border-border/70">
                  <CardTitle className="text-lg">Rekapitulasi per OPD</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>No</TableHead>
                          <TableHead>Nama OPD</TableHead>
                          <TableHead className="text-center">Jabatan</TableHead>
                          <TableHead className="text-center">Pegawai</TableHead>
                          <TableHead className="text-center">Kebutuhan</TableHead>
                          <TableHead className="text-center">Anjab</TableHead>
                          <TableHead className="text-center">ABK</TableHead>
                          <TableHead className="text-center">Efisiensi</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rekapPerOPD.map((opd, index) => (
                          <TableRow key={opd.id} className="transition-colors hover:bg-muted/30">
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">{opd.nama}</TableCell>
                            <TableCell className="text-center">{opd.totalJabatan}</TableCell>
                            <TableCell className="text-center">{opd.totalPegawai}</TableCell>
                            <TableCell className="text-center">{opd.kebutuhanPegawai || "-"}</TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant="outline"
                                className={
                                  opd.statusAnjab === "selesai"
                                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                    : opd.statusAnjab === "proses"
                                    ? "bg-accent/30 text-accent-foreground border-accent/40"
                                    : "bg-muted text-muted-foreground"
                                }
                              >
                                {opd.statusAnjab === "selesai" ? "Selesai" : opd.statusAnjab === "proses" ? "Proses" : "Belum"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant="outline"
                                className={
                                  opd.statusAbk === "selesai"
                                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                    : opd.statusAbk === "proses"
                                    ? "bg-accent/30 text-accent-foreground border-accent/40"
                                    : "bg-muted text-muted-foreground"
                                }
                              >
                                {opd.statusAbk === "selesai" ? "Selesai" : opd.statusAbk === "proses" ? "Proses" : "Belum"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              {opd.efisiensi > 0 ? (
                                <span className={opd.efisiensi >= 90 ? "text-emerald-600 font-medium" : "text-accent-foreground"}>
                                  {opd.efisiensi.toFixed(1)}%
                                </span>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dokumen Anjab */}
            <TabsContent value="dokumen-anjab">
              <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
                <CardHeader className="border-b border-border/70">
                  <CardTitle className="text-lg">Daftar Dokumen Anjab</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>No</TableHead>
                          <TableHead>No. Dokumen</TableHead>
                          <TableHead>OPD</TableHead>
                          <TableHead>Periode</TableHead>
                          <TableHead className="text-center">Jabatan</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dokumenAnjabList.map((doc, index) => (
                          <TableRow key={doc.id} className="transition-colors hover:bg-muted/30">
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-mono text-sm">{doc.nomorDokumen}</TableCell>
                            <TableCell className="font-medium">{doc.namaOpd}</TableCell>
                            <TableCell>{doc.periode}</TableCell>
                            <TableCell className="text-center">{doc.jumlahJabatan}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  doc.status === "disetujui"
                                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                    : doc.status === "review"
                                    ? "bg-accent/30 text-accent-foreground border-accent/40"
                                    : doc.status === "revisi"
                                    ? "bg-orange-100 text-orange-700 border-orange-200"
                                    : "bg-muted text-muted-foreground"
                                }
                              >
                                {doc.status === "disetujui" ? "Disetujui" : doc.status === "review" ? "Review" : doc.status === "revisi" ? "Revisi" : "Draft"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Laporan ABK */}
            <TabsContent value="laporan-abk">
              <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
                <CardHeader className="border-b border-border/70">
                  <CardTitle className="text-lg">Laporan ABK per OPD</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>No</TableHead>
                          <TableHead>OPD</TableHead>
                          <TableHead>Periode</TableHead>
                          <TableHead className="text-center">Jabatan</TableHead>
                          <TableHead className="text-center">Kebutuhan</TableHead>
                          <TableHead className="text-center">Existing</TableHead>
                          <TableHead className="text-center">Efisiensi</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dummyLaporan.map((lap, index) => (
                          <TableRow key={lap.opdId} className="transition-colors hover:bg-muted/30">
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">{lap.namaOpd}</TableCell>
                            <TableCell>{lap.periode}</TableCell>
                            <TableCell className="text-center">{lap.totalJabatan}</TableCell>
                            <TableCell className="text-center">{lap.totalKebutuhanPegawai}</TableCell>
                            <TableCell className="text-center">{lap.totalPegawaiExisting}</TableCell>
                            <TableCell className="text-center">
                              <span className={lap.efisiensi >= 95 ? "text-emerald-600 font-medium" : lap.efisiensi >= 85 ? "text-accent-foreground" : "text-destructive"}>
                                {lap.efisiensi.toFixed(1)}%
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  lap.status === "disetujui"
                                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                    : lap.status === "final"
                                    ? "bg-accent/30 text-accent-foreground border-accent/40"
                                    : "bg-muted text-muted-foreground"
                                }
                              >
                                {lap.status === "disetujui" ? "Disetujui" : lap.status === "final" ? "Final" : "Draft"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
    </AdminPageShell>
  );
}
