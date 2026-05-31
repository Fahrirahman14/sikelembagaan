"use client";

import { AdminPageShell } from "@/components/admin-page-shell";
import { DataTablePagination } from "@/components/data-table-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
import { api, type DashboardSummary, type DokumenAnjab, type LaporanABK, type RekapOPD } from "@/lib/api";
import {
    BarChart3,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Download,
    Eye,
    FileEdit,
    FileText,
    Filter,
    Minus,
    Printer,
    TrendingDown,
    TrendingUp,
    Users
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// ── helpers ──────────────────────────────────────────────────────────────────

function exportCSV(rows: Record<string, unknown>[], filename: string) {
  if (!rows.length) { toast.error("Tidak ada data untuk diekspor"); return; }
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(","),
    ...rows.map((r) =>
      keys.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function statusAnjabClass(status: string) {
  if (status === "selesai") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (status === "proses") return "bg-accent/30 text-accent-foreground border-accent/40";
  return "bg-muted text-muted-foreground";
}
function statusAnjabLabel(status: string) {
  if (status === "selesai") return "Selesai";
  if (status === "proses") return "Proses";
  return "Belum";
}
function dokumenStatusClass(status: string) {
  if (status === "disetujui") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (status === "review") return "bg-accent/30 text-accent-foreground border-accent/40";
  if (status === "revisi") return "bg-orange-100 text-orange-700 border-orange-200";
  return "bg-muted text-muted-foreground";
}
function dokumenStatusLabel(status: string) {
  const map: Record<string, string> = { disetujui: "Disetujui", review: "Review", revisi: "Revisi", draft: "Draft" };
  return map[status] ?? status;
}
function efisiensiClass(e: number) {
  if (e >= 95) return "text-emerald-600 font-semibold";
  if (e >= 85) return "text-accent-foreground font-semibold";
  return "text-destructive font-semibold";
}

// ── component ─────────────────────────────────────────────────────────────────

export default function LaporanPage() {
  // filter state
  const [periode, setPeriode] = useState("all");
  const [reportType, setReportType] = useState("all");
  const [activeTab, setActiveTab] = useState("rekap-opd");

  // data state
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [rekapList, setRekapList] = useState<RekapOPD[]>([]);

  const [dokumenList, setDokumenList] = useState<DokumenAnjab[]>([]);
  const [dokumenTotal, setDokumenTotal] = useState(0);
  const [dokumenLimit, setDokumenLimit] = useState(10);
  const [dokumenOffset, setDokumenOffset] = useState(0);

  const [laporanList, setLaporanList] = useState<LaporanABK[]>([]);
  const [laporanTotal, setLaporanTotal] = useState(0);
  const [laporanLimit, setLaporanLimit] = useState(10);
  const [laporanOffset, setLaporanOffset] = useState(0);
  const [allLaporan, setAllLaporan] = useState<LaporanABK[]>([]);

  // dialog state
  const [selectedRekap, setSelectedRekap] = useState<RekapOPD | null>(null);
  const [selectedDokumen, setSelectedDokumen] = useState<DokumenAnjab | null>(null);
  const [selectedLaporan, setSelectedLaporan] = useState<LaporanABK | null>(null);

  // ── fetches ──
  const fetchDokumen = useCallback(async () => {
    const result = await api.dokumenAnjab.list({ limit: dokumenLimit, offset: dokumenOffset });
    setDokumenList(result.data);
    setDokumenTotal(result.total);
  }, [dokumenLimit, dokumenOffset]);

  const fetchLaporan = useCallback(async () => {
    const [paged, all] = await Promise.all([
      api.laporanAbk.list({ limit: laporanLimit, offset: laporanOffset }),
      api.laporanAbk.list({ limit: 0 }),
    ]);
    setLaporanList(paged.data);
    setLaporanTotal(paged.total);
    setAllLaporan(all.data);
  }, [laporanLimit, laporanOffset]);

  useEffect(() => {
    api.dashboard.summary().then(setSummary);
    api.dashboard.rekapOpd().then(setRekapList);
  }, []);
  useEffect(() => { fetchDokumen(); }, [fetchDokumen]);
  useEffect(() => { fetchLaporan(); }, [fetchLaporan]);

  // ── filter reportType → tab ──
  useEffect(() => {
    if (reportType === "anjab") setActiveTab("dokumen-anjab");
    else if (reportType === "abk") setActiveTab("laporan-abk");
    else setActiveTab("rekap-opd");
  }, [reportType]);

  // ── client-side period filter ──
  const filteredRekap = rekapList; // rekap has no period
  const filteredDokumen = periode === "all"
    ? dokumenList
    : dokumenList.filter((d) => d.periode.includes(periode));
  const filteredLaporan = periode === "all"
    ? laporanList
    : laporanList.filter((l) => l.periode.includes(periode));

  // ── stats ──
  const kebutuhanTotal = allLaporan.reduce((s, l) => s + l.total_kebutuhan_pegawai, 0);
  const existingTotal  = allLaporan.reduce((s, l) => s + l.total_pegawai_existing, 0);
  const selisihPegawai = existingTotal - kebutuhanTotal;
  const persentaseAnjab = summary ? (summary.anjab_selesai / (summary.total_opd || 1)) * 100 : 0;
  const persentaseAbk   = summary ? (summary.abk_selesai  / (summary.total_opd || 1)) * 100 : 0;

  // ── actions ──
  function handleCetak() { window.print(); }

  function handleExportPDF() {
    toast.info("Membuka dialog cetak/ekspor PDF…");
    setTimeout(() => window.print(), 300);
  }

  function handleDownloadRekap() {
    exportCSV(
      filteredRekap.map((o, i) => ({
        No: i + 1,
        "Nama OPD": o.nama,
        Jabatan: o.total_jabatan,
        Pegawai: o.total_pegawai,
        "Status Anjab": statusAnjabLabel(o.status_anjab),
        "Status ABK": statusAnjabLabel(o.status_abk),
      })),
      `rekap-opd-${periode}.csv`
    );
  }

  function handleDownloadDokumen() {
    exportCSV(
      filteredDokumen.map((d, i) => ({
        No: i + 1,
        "No. Dokumen": d.nomor_dokumen,
        OPD: d.opd_nama ?? d.nama_opd,
        Periode: d.periode,
        "Jumlah Jabatan": d.jumlah_jabatan,
        Status: dokumenStatusLabel(d.status),
        Pembuat: d.pembuat,
        Penyetuju: d.penyetuju,
      })),
      `dokumen-anjab-${periode}.csv`
    );
  }

  function handleDownloadLaporan() {
    exportCSV(
      filteredLaporan.map((l, i) => ({
        No: i + 1,
        OPD: l.opd_nama,
        Periode: l.periode,
        "Total Jabatan": l.total_jabatan,
        "Kebutuhan Pegawai": l.total_kebutuhan_pegawai,
        "Pegawai Existing": l.total_pegawai_existing,
        "Efisiensi (%)": l.efisiensi.toFixed(1),
        Status: l.status,
      })),
      `laporan-abk-${periode}.csv`
    );
  }

  function handleRowDownloadDokumen(doc: DokumenAnjab) {
    if (doc.pembuat) {
      exportCSV([{
        "No. Dokumen": doc.nomor_dokumen,
        OPD: doc.opd_nama ?? doc.nama_opd,
        Periode: doc.periode,
        "Jumlah Jabatan": doc.jumlah_jabatan,
        Status: dokumenStatusLabel(doc.status),
        Pembuat: doc.pembuat,
        Penyetuju: doc.penyetuju,
      }], `dokumen-${doc.nomor_dokumen}.csv`);
    } else {
      toast.info("Dokumen belum tersedia untuk diunduh");
    }
  }

  function handleRowDownloadLaporan(lap: LaporanABK) {
    exportCSV([{
      OPD: lap.opd_nama,
      Periode: lap.periode,
      "Total Jabatan": lap.total_jabatan,
      "Kebutuhan Pegawai": lap.total_kebutuhan_pegawai,
      "Pegawai Existing": lap.total_pegawai_existing,
      "Efisiensi (%)": lap.efisiensi.toFixed(1),
      Status: lap.status,
    }], `laporan-abk-${lap.opd_nama}-${lap.periode}.csv`);
  }

  const CARD_CLASS = "border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur";

  return (
    <AdminPageShell>
      {/* ── Header ── */}
      <div className="mb-6 flex items-center justify-between print:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Pusat laporan</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">Laporan &amp; Rekap</h1>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline" className="gap-2 rounded-xl border-border/70 bg-background/80" onClick={handleCetak}>
            <Printer className="h-4 w-4" />
            Cetak
          </Button> */}
          <Button className="gap-2 rounded-xl shadow-lg shadow-primary/15" onClick={handleExportPDF}>
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <Card className={`mb-6 ${CARD_CLASS} print:hidden`}>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Periode</span>
              <Select value={periode} onValueChange={setPeriode}>
                <SelectTrigger className="h-9 w-28 rounded-lg border-border/70 bg-background/80 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Tampilkan</span>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="h-9 w-44 rounded-lg border-border/70 bg-background/80 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Rekap per OPD</SelectItem>
                  <SelectItem value="anjab">Dokumen Anjab</SelectItem>
                  <SelectItem value="abk">Laporan ABK</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {periode !== "all" && (
              <>
                <Separator orientation="vertical" className="h-6" />
                <Badge className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
                  <Calendar className="mr-1.5 h-3 w-3" />
                  Periode {periode}
                </Badge>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Stat Cards ── */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total OPD",       value: summary?.total_opd     ?? 0, Icon: Building2, bg: "bg-primary/10",     ic: "text-primary" },
          { label: "Total Jabatan",   value: summary?.total_jabatan ?? 0, Icon: FileText,  bg: "bg-sky-100",        ic: "text-sky-600" },
          { label: "Total Pegawai",   value: summary?.total_pegawai ?? 0, Icon: Users,     bg: "bg-violet-100",     ic: "text-violet-600" },
          {
            label: "Selisih Pegawai",
            value: selisihPegawai > 0 ? `+${selisihPegawai}` : selisihPegawai,
            Icon: selisihPegawai < 0 ? TrendingDown : selisihPegawai > 0 ? TrendingUp : Minus,
            bg: selisihPegawai < 0 ? "bg-destructive/10" : selisihPegawai > 0 ? "bg-emerald-100" : "bg-muted",
            ic: selisihPegawai < 0 ? "text-destructive" : selisihPegawai > 0 ? "text-emerald-600" : "text-muted-foreground",
          },
        ].map(({ label, value, Icon, bg, ic }) => (
          <Card key={label} className={CARD_CLASS}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-3 ${bg}`}>
                  <Icon className={`h-5 w-5 ${ic}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className={`text-2xl font-bold ${typeof value === "string" && value.startsWith("+") ? "text-emerald-600" : value === 0 || value === "0" ? "text-foreground" : "text-foreground"}`}>
                    {value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Progress Cards ── */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {[
          {
            title: "Progress Anjab", Icon: FileText, iconColor: "text-primary",
            selesai: summary?.anjab_selesai ?? 0, proses: summary?.anjab_proses ?? 0,
            total: summary?.total_opd ?? 0, pct: persentaseAnjab, pctColor: "text-primary",
            desc: "Kelengkapan dokumen analisis jabatan",
          },
          {
            title: "Progress ABK", Icon: BarChart3, iconColor: "text-accent-foreground",
            selesai: summary?.abk_selesai ?? 0, proses: summary?.abk_proses ?? 0,
            total: summary?.total_opd ?? 0, pct: persentaseAbk, pctColor: "text-accent-foreground",
            desc: "Kelengkapan analisis beban kerja",
          },
        ].map(({ title, Icon, iconColor, selesai, proses, total, pct, pctColor, desc }) => (
          <Card key={title} className={CARD_CLASS}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Icon className={`h-5 w-5 ${iconColor}`} />
                {title}
              </CardTitle>
              <CardDescription>{desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {selesai} dari {total} OPD
                  </span>
                  <span className={`text-lg font-bold ${pctColor}`}>{pct.toFixed(0)}%</span>
                </div>
                <Progress value={pct} className="h-2.5" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    Selesai: {selesai}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    Proses: {proses}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                    Belum: {total - selesai - proses}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Tabs ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between print:hidden">
          <TabsList className="rounded-xl border border-border/60 bg-muted/40 p-1">
            <TabsTrigger value="rekap-opd" className="gap-2 rounded-lg px-4 py-1.5 text-sm">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Rekap per OPD</span>
              <span className="sm:hidden">OPD</span>
            </TabsTrigger>
            <TabsTrigger value="dokumen-anjab" className="gap-2 rounded-lg px-4 py-1.5 text-sm">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Dokumen Anjab</span>
              <span className="sm:hidden">Anjab</span>
            </TabsTrigger>
            <TabsTrigger value="laporan-abk" className="gap-2 rounded-lg px-4 py-1.5 text-sm">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Laporan ABK</span>
              <span className="sm:hidden">ABK</span>
            </TabsTrigger>
          </TabsList>

          {/* Per-tab download button */}
          {activeTab === "rekap-opd" && (
            <Button variant="outline" size="sm" className="gap-2 rounded-lg print:hidden" onClick={handleDownloadRekap}>
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
          )}
          {activeTab === "dokumen-anjab" && (
            <Button variant="outline" size="sm" className="gap-2 rounded-lg print:hidden" onClick={handleDownloadDokumen}>
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
          )}
          {activeTab === "laporan-abk" && (
            <Button variant="outline" size="sm" className="gap-2 rounded-lg print:hidden" onClick={handleDownloadLaporan}>
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
          )}
        </div>

        {/* ── Tab: Rekap per OPD ── */}
        <TabsContent value="rekap-opd">
          <Card className={CARD_CLASS}>
            <CardHeader className="border-b border-border/70">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Rekapitulasi per OPD</CardTitle>
                  <CardDescription className="mt-0.5">{filteredRekap.length} OPD terdaftar</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/70 hover:bg-transparent">
                      <TableHead className="w-12 text-center">No</TableHead>
                      <TableHead>Nama OPD</TableHead>
                      <TableHead className="text-center">Jabatan</TableHead>
                      <TableHead className="text-center">Pegawai</TableHead>
                      <TableHead className="text-center">Anjab</TableHead>
                      <TableHead className="text-center">ABK</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRekap.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                          <Building2 className="mx-auto mb-2 h-8 w-8 opacity-30" />
                          Belum ada data rekapitulasi
                        </TableCell>
                      </TableRow>
                    ) : filteredRekap.map((opd, i) => (
                      <TableRow key={opd.id} className="border-border/60 hover:bg-muted/30">
                        <TableCell className="text-center text-muted-foreground">{i + 1}</TableCell>
                        <TableCell className="font-medium text-foreground">{opd.nama}</TableCell>
                        <TableCell className="text-center">{opd.total_jabatan}</TableCell>
                        <TableCell className="text-center">{opd.total_pegawai}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={statusAnjabClass(opd.status_anjab)}>
                            {statusAnjabLabel(opd.status_anjab)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={statusAnjabClass(opd.status_abk)}>
                            {statusAnjabLabel(opd.status_abk)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost" size="icon" className="h-8 w-8"
                            title="Lihat detail"
                            onClick={() => setSelectedRekap(opd)}
                          >
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

        {/* ── Tab: Dokumen Anjab ── */}
        <TabsContent value="dokumen-anjab">
          <Card className={CARD_CLASS}>
            <CardHeader className="border-b border-border/70">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Daftar Dokumen Anjab</CardTitle>
                  <CardDescription className="mt-0.5">
                    {dokumenTotal} dokumen total{periode !== "all" ? `, filter periode ${periode}` : ""}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/70 hover:bg-transparent">
                      <TableHead className="w-12 text-center">No</TableHead>
                      <TableHead>No. Dokumen</TableHead>
                      <TableHead>OPD</TableHead>
                      <TableHead className="text-center">Periode</TableHead>
                      <TableHead className="text-center">Jabatan</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDokumen.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                          <FileText className="mx-auto mb-2 h-8 w-8 opacity-30" />
                          Belum ada dokumen Anjab
                        </TableCell>
                      </TableRow>
                    ) : filteredDokumen.map((doc, i) => (
                      <TableRow key={doc.id} className="border-border/60 hover:bg-muted/30">
                        <TableCell className="text-center text-muted-foreground">{dokumenOffset + i + 1}</TableCell>
                        <TableCell className="font-mono text-sm text-foreground">{doc.nomor_dokumen || "—"}</TableCell>
                        <TableCell className="font-medium text-foreground">{doc.opd_nama ?? doc.nama_opd}</TableCell>
                        <TableCell className="text-center">{doc.periode}</TableCell>
                        <TableCell className="text-center">{doc.jumlah_jabatan}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={dokumenStatusClass(doc.status)}>
                            {dokumenStatusLabel(doc.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Lihat detail"
                              onClick={() => setSelectedDokumen(doc)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Unduh dokumen"
                              onClick={() => handleRowDownloadDokumen(doc)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {dokumenTotal > 0 && (
                <div className="border-t border-border/70">
                  <DataTablePagination
                    total={dokumenTotal}
                    limit={dokumenLimit}
                    offset={dokumenOffset}
                    onPageChange={setDokumenOffset}
                    onPageSizeChange={(nl) => { setDokumenLimit(nl); setDokumenOffset(0); }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab: Laporan ABK ── */}
        <TabsContent value="laporan-abk">
          <Card className={CARD_CLASS}>
            <CardHeader className="border-b border-border/70">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Laporan ABK per OPD</CardTitle>
                  <CardDescription className="mt-0.5">
                    {laporanTotal} laporan total{periode !== "all" ? `, filter periode ${periode}` : ""}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/70 hover:bg-transparent">
                      <TableHead className="w-12 text-center">No</TableHead>
                      <TableHead>OPD</TableHead>
                      <TableHead className="text-center">Periode</TableHead>
                      <TableHead className="text-center">Jabatan</TableHead>
                      <TableHead className="text-center">Kebutuhan</TableHead>
                      <TableHead className="text-center">Existing</TableHead>
                      <TableHead className="text-center">Efisiensi</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLaporan.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="py-12 text-center text-muted-foreground">
                          <BarChart3 className="mx-auto mb-2 h-8 w-8 opacity-30" />
                          Belum ada laporan ABK
                        </TableCell>
                      </TableRow>
                    ) : filteredLaporan.map((lap, i) => (
                      <TableRow key={lap.id} className="border-border/60 hover:bg-muted/30">
                        <TableCell className="text-center text-muted-foreground">{laporanOffset + i + 1}</TableCell>
                        <TableCell className="font-medium text-foreground">{lap.opd_nama}</TableCell>
                        <TableCell className="text-center">{lap.periode}</TableCell>
                        <TableCell className="text-center">{lap.total_jabatan}</TableCell>
                        <TableCell className="text-center">{lap.total_kebutuhan_pegawai}</TableCell>
                        <TableCell className="text-center">{lap.total_pegawai_existing}</TableCell>
                        <TableCell className="text-center">
                          <span className={efisiensiClass(lap.efisiensi)}>{lap.efisiensi.toFixed(1)}%</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={
                            lap.status === "disetujui" ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : lap.status === "final" ? "bg-accent/30 text-accent-foreground border-accent/40"
                            : "bg-muted text-muted-foreground"
                          }>
                            {lap.status === "disetujui" ? "Disetujui" : lap.status === "final" ? "Final" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Lihat detail"
                              onClick={() => setSelectedLaporan(lap)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Unduh laporan"
                              onClick={() => handleRowDownloadLaporan(lap)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {laporanTotal > 0 && (
                <div className="border-t border-border/70">
                  <DataTablePagination
                    total={laporanTotal}
                    limit={laporanLimit}
                    offset={laporanOffset}
                    onPageChange={setLaporanOffset}
                    onPageSizeChange={(nl) => { setLaporanLimit(nl); setLaporanOffset(0); }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Detail Dialog: Rekap OPD ── */}
      <Dialog open={!!selectedRekap} onOpenChange={() => setSelectedRekap(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Detail OPD
            </DialogTitle>
          </DialogHeader>
          {selectedRekap && (
            <div className="space-y-4 py-2">
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">Nama OPD</p>
                <p className="mt-0.5 font-semibold text-foreground">{selectedRekap.nama}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-2xl font-bold text-primary">{selectedRekap.total_jabatan}</p>
                  <p className="text-xs text-muted-foreground">Total Jabatan</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">{selectedRekap.total_pegawai}</p>
                  <p className="text-xs text-muted-foreground">Total Pegawai</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3">
                  <p className="mb-2 text-xs text-muted-foreground">Status Anjab</p>
                  <Badge variant="outline" className={statusAnjabClass(selectedRekap.status_anjab)}>
                    {statusAnjabLabel(selectedRekap.status_anjab)}
                  </Badge>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="mb-2 text-xs text-muted-foreground">Status ABK</p>
                  <Badge variant="outline" className={statusAnjabClass(selectedRekap.status_abk)}>
                    {statusAnjabLabel(selectedRekap.status_abk)}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Detail Dialog: Dokumen Anjab ── */}
      <Dialog open={!!selectedDokumen} onOpenChange={() => setSelectedDokumen(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Detail Dokumen Anjab
            </DialogTitle>
          </DialogHeader>
          {selectedDokumen && (
            <div className="space-y-4 py-2">
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">No. Dokumen</span>
                  <span className="font-mono text-sm font-medium">{selectedDokumen.nomor_dokumen || "—"}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">OPD</span>
                  <span className="text-sm font-medium text-right max-w-[60%]">{selectedDokumen.opd_nama ?? selectedDokumen.nama_opd}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Periode</span>
                  <span className="text-sm font-medium">{selectedDokumen.periode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Jumlah Jabatan</span>
                  <span className="text-sm font-medium">{selectedDokumen.jumlah_jabatan}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tanggal Dibuat</span>
                  <span className="text-sm font-medium">
                    {selectedDokumen.tanggal_dibuat
                      ? new Date(selectedDokumen.tanggal_dibuat).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                      : "—"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant="outline" className={`mt-1.5 ${dokumenStatusClass(selectedDokumen.status)}`}>
                    {dokumenStatusLabel(selectedDokumen.status)}
                  </Badge>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Pembuat</p>
                  <p className="mt-0.5 text-sm font-medium">{selectedDokumen.pembuat || "—"}</p>
                </div>
              </div>
              {selectedDokumen.penyetuju && (
                <div className="rounded-lg border p-3 flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Disetujui oleh</p>
                    <p className="text-sm font-medium">{selectedDokumen.penyetuju}</p>
                  </div>
                </div>
              )}
              <Button className="w-full gap-2" variant="outline" onClick={() => handleRowDownloadDokumen(selectedDokumen)}>
                <Download className="h-4 w-4" />
                Unduh Data Dokumen
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Detail Dialog: Laporan ABK ── */}
      <Dialog open={!!selectedLaporan} onOpenChange={() => setSelectedLaporan(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Detail Laporan ABK
            </DialogTitle>
          </DialogHeader>
          {selectedLaporan && (
            <div className="space-y-4 py-2">
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">OPD</p>
                <p className="mt-0.5 font-semibold text-foreground">{selectedLaporan.opd_nama}</p>
                <p className="mt-1 text-sm text-muted-foreground">Periode {selectedLaporan.periode}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-xl font-bold text-foreground">{selectedLaporan.total_jabatan}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Jabatan</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-xl font-bold text-foreground">{selectedLaporan.total_kebutuhan_pegawai}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Kebutuhan</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-xl font-bold text-foreground">{selectedLaporan.total_pegawai_existing}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Existing</p>
                </div>
              </div>
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Efisiensi</span>
                  <span className={`text-lg font-bold ${efisiensiClass(selectedLaporan.efisiensi)}`}>
                    {selectedLaporan.efisiensi.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={Math.min(selectedLaporan.efisiensi, 120)}
                  className="h-2.5"
                />
                <p className="text-xs text-muted-foreground">Target efisiensi: 85–105%</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  {selectedLaporan.status === "disetujui" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : selectedLaporan.status === "final" ? (
                    <Clock className="h-4 w-4 text-accent-foreground" />
                  ) : (
                    <FileEdit className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm text-muted-foreground">Status</span>
                </div>
                <Badge variant="outline" className={
                  selectedLaporan.status === "disetujui" ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                  : selectedLaporan.status === "final" ? "bg-accent/30 text-accent-foreground border-accent/40"
                  : "bg-muted text-muted-foreground"
                }>
                  {selectedLaporan.status === "disetujui" ? "Disetujui" : selectedLaporan.status === "final" ? "Final" : "Draft"}
                </Badge>
              </div>
              <Button className="w-full gap-2" variant="outline" onClick={() => handleRowDownloadLaporan(selectedLaporan)}>
                <Download className="h-4 w-4" />
                Unduh Data Laporan
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  );
}
