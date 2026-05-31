"use client";

import { AdminPageShell } from "@/components/admin-page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { DataTablePagination } from "@/components/data-table-pagination";
import {
    api,
    type DokumenAnjab,
    type JabatanSpesifikasiRow,
    type JabatanUraianRow,
    type OPD,
} from "@/lib/api";
import * as XLSX from "xlsx";
import {
    AlertCircle,
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    Eye,
    FileSpreadsheet,
    FileText,
    FileWarning,
    Filter,
    Loader2,
    Plus,
    Search,
    Send,
    Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// ---- helpers ----

function statusLabel(status: string) {
  const map: Record<string, string> = {
    draft: "Draft",
    review: "Review",
    revisi: "Revisi",
    disetujui: "Disetujui",
  };
  return map[status] ?? status;
}

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ---- Excel: multi-sheet Anjab document ----

async function downloadAnjabExcel(doc: DokumenAnjab) {
  const opdNama = doc.opd_nama ?? doc.nama_opd;
  const [uraianRows, spesifikasiRows] = await Promise.all([
    api.uraian.export({ opd_id: doc.opd_id }),
    api.spesifikasi.export({ opd_id: doc.opd_id }),
  ]);

  const wb = XLSX.utils.book_new();

  // Sheet 1: Info Dokumen
  const wsInfo = XLSX.utils.json_to_sheet([{
    "Nomor Dokumen": doc.nomor_dokumen,
    "OPD": opdNama,
    "Periode": doc.periode,
    "Tanggal Dibuat": formatTanggal(doc.tanggal_dibuat),
    "Status": statusLabel(doc.status),
    "Disetujui Oleh": doc.penyetuju || "-",
    "Total Jabatan": doc.jumlah_jabatan,
  }]);
  wsInfo["!cols"] = [{ wch: 20 }, { wch: 38 }, { wch: 12 }, { wch: 22 }, { wch: 12 }, { wch: 20 }, { wch: 20 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, wsInfo, "Info Dokumen");

  // Sheet 2: Uraian Jabatan
  const joinArr = (arr: string[]) => (arr ?? []).filter(Boolean).join("\n");
  const wsUraian = XLSX.utils.json_to_sheet(
    uraianRows.map((r, i) => ({
      "No": i + 1,
      "Kode": r.kode,
      "Nama Jabatan": r.nama,
      "Jenis": r.jenis,
      "Unit Kerja": r.unit_kerja,
      "Ikhtisar Jabatan": r.ikhtisar,
      "Uraian Tugas": joinArr(r.tugas),
      "Fungsi": joinArr(r.fungsi),
      "Wewenang": joinArr(r.wewenang),
      "Tanggung Jawab": joinArr(r.tanggung_jawab),
    }))
  );
  wsUraian["!cols"] = [
    { wch: 4 }, { wch: 14 }, { wch: 32 }, { wch: 12 }, { wch: 26 },
    { wch: 36 }, { wch: 40 }, { wch: 36 }, { wch: 36 }, { wch: 36 },
  ];
  XLSX.utils.book_append_sheet(wb, wsUraian, "Uraian Jabatan");

  // Sheet 3: Spesifikasi Jabatan
  const wsSpek = XLSX.utils.json_to_sheet(
    spesifikasiRows.map((r, i) => {
      const pf = r.pendidikan_formal ?? {};
      return {
        "No": i + 1,
        "Kode": r.kode,
        "Nama Jabatan": r.nama,
        "Jenis": r.jenis,
        "Unit Kerja": r.unit_kerja,
        "Pend. Jenjang": pf.jenjang ?? "-",
        "Pend. Minimal": pf.minimal ?? "-",
        "Jurusan": (pf.jurusan ?? []).join("; "),
        "Pelatihan Wajib": (r.pelatihan ?? []).filter((p) => p.wajib).map((p) => p.nama).join("; "),
        "Pelatihan Opsional": (r.pelatihan ?? []).filter((p) => !p.wajib).map((p) => p.nama).join("; "),
        "Pengalaman Wajib": (r.pengalaman ?? []).filter((p) => p.wajib).map((p) => p.deskripsi).join("; "),
        "Pengalaman Opsional": (r.pengalaman ?? []).filter((p) => !p.wajib).map((p) => p.deskripsi).join("; "),
        "Komp. Manajerial": (r.kompetensi_manajerial ?? []).map((k) => `${k.nama} (Lv.${k.level})`).join("; "),
        "Komp. Teknis": (r.kompetensi_teknis ?? []).map((k) => `${k.nama} (Lv.${k.level})`).join("; "),
        "Usia": r.kondisi_fisik?.usia ?? "-",
        "Kesehatan": r.kondisi_fisik?.kesehatan ?? "-",
        "Kondisi Khusus": r.kondisi_fisik?.kondisiKhusus ?? "-",
      };
    })
  );
  wsSpek["!cols"] = Array(17).fill({ wch: 22 });
  XLSX.utils.book_append_sheet(wb, wsSpek, "Spesifikasi Jabatan");

  const filename = `Anjab-${opdNama}-${doc.periode}.xlsx`.replace(/[/\\?%*:|"<>]/g, "-");
  XLSX.writeFile(wb, filename);
  return uraianRows.length;
}

// ---- PDF: full Anjab document ----

function buildAnjabPDFHtml(
  doc: DokumenAnjab,
  uraianRows: JabatanUraianRow[],
  spesifikasiRows: JabatanSpesifikasiRow[]
) {
  const opdNama = doc.opd_nama ?? doc.nama_opd;

  // build spesifikasi lookup by kode
  const spekMap: Record<string, JabatanSpesifikasiRow> = {};
  for (const s of spesifikasiRows) spekMap[s.kode] = s;

  const ul = (items: string[]) =>
    items.length === 0
      ? "<p style='color:#888;font-style:italic'>Tidak diisi</p>"
      : `<ol style='padding-left:18px;margin:0'>${items.map((t) => `<li style='margin-bottom:4px'>${t}</li>`).join("")}</ol>`;

  const kvRow = (label: string, value: string) =>
    `<tr><td style='width:38%;padding:5px 8px;color:#555;font-weight:600;vertical-align:top'>${label}</td>` +
    `<td style='padding:5px 8px;vertical-align:top'>${value || "-"}</td></tr>`;

  const jabatanSections = uraianRows.map((r, idx) => {
    const sp = spekMap[r.kode];
    const pf = sp?.pendidikan_formal ?? {};

    const pelWajib = (sp?.pelatihan ?? []).filter((p) => p.wajib).map((p) => p.nama).join(", ") || "-";
    const pelOpsional = (sp?.pelatihan ?? []).filter((p) => !p.wajib).map((p) => p.nama).join(", ") || "-";
    const pengWajib = (sp?.pengalaman ?? []).filter((p) => p.wajib).map((p) => p.deskripsi).join(", ") || "-";
    const km = (sp?.kompetensi_manajerial ?? []).map((k) => `${k.nama} (Level ${k.level})`).join(", ") || "-";
    const kt = (sp?.kompetensi_teknis ?? []).map((k) => `${k.nama} (Level ${k.level})`).join(", ") || "-";

    return `
<div style='${idx > 0 ? "page-break-before:always;padding-top:24px" : ""}'>
  <div style='background:#1e3a5f;color:#fff;padding:10px 16px;border-radius:6px 6px 0 0;display:flex;justify-content:space-between;align-items:center'>
    <span style='font-size:14px;font-weight:bold'>${r.nama}</span>
    <span style='font-size:11px;opacity:0.8'>${r.kode}</span>
  </div>
  <div style='border:1px solid #1e3a5f;border-top:none;border-radius:0 0 6px 6px;padding:16px'>

    <table style='width:100%;border-collapse:collapse;font-size:12px;margin-bottom:14px'>
      ${kvRow("Jenis Jabatan", r.jenis.charAt(0).toUpperCase() + r.jenis.slice(1))}
      ${kvRow("Unit Kerja", r.unit_kerja)}
      ${kvRow("Ikhtisar Jabatan", r.ikhtisar)}
    </table>

    <div style='margin-bottom:12px'>
      <p style='font-weight:bold;font-size:12px;margin-bottom:6px;color:#1e3a5f'>URAIAN TUGAS</p>
      ${ul(r.tugas)}
    </div>

    ${r.fungsi.length > 0 ? `
    <div style='margin-bottom:12px'>
      <p style='font-weight:bold;font-size:12px;margin-bottom:6px;color:#1e3a5f'>FUNGSI</p>
      ${ul(r.fungsi)}
    </div>` : ""}

    ${r.wewenang.length > 0 ? `
    <div style='margin-bottom:12px'>
      <p style='font-weight:bold;font-size:12px;margin-bottom:6px;color:#1e3a5f'>WEWENANG</p>
      ${ul(r.wewenang)}
    </div>` : ""}

    ${r.tanggung_jawab.length > 0 ? `
    <div style='margin-bottom:12px'>
      <p style='font-weight:bold;font-size:12px;margin-bottom:6px;color:#1e3a5f'>TANGGUNG JAWAB</p>
      ${ul(r.tanggung_jawab)}
    </div>` : ""}

    ${sp ? `
    <hr style='border:none;border-top:1px dashed #ccc;margin:14px 0'/>
    <p style='font-weight:bold;font-size:12px;margin-bottom:8px;color:#1e3a5f'>SPESIFIKASI JABATAN</p>
    <table style='width:100%;border-collapse:collapse;font-size:12px'>
      ${kvRow("Pendidikan Jenjang", pf.jenjang ?? "-")}
      ${kvRow("Pendidikan Minimal", pf.minimal ?? "-")}
      ${kvRow("Jurusan", (pf.jurusan ?? []).join(", ") || "-")}
      ${kvRow("Pelatihan Wajib", pelWajib)}
      ${kvRow("Pelatihan Opsional", pelOpsional)}
      ${kvRow("Pengalaman Kerja", pengWajib)}
      ${kvRow("Kompetensi Manajerial", km)}
      ${kvRow("Kompetensi Teknis", kt)}
      ${kvRow("Kondisi Fisik — Usia", sp.kondisi_fisik?.usia ?? "-")}
      ${kvRow("Kondisi Fisik — Kesehatan", sp.kondisi_fisik?.kesehatan ?? "-")}
    </table>` : ""}
  </div>
</div>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <title>Dokumen Anjab – ${opdNama} – ${doc.periode}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 12px; color: #222; background: #fff; padding: 32px 42px; }
    @media print { body { padding: 18px 28px; } }
  </style>
</head>
<body>

  <!-- Cover -->
  <div style='text-align:center;border-bottom:3px double #1e3a5f;padding-bottom:18px;margin-bottom:24px'>
    <div style='font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#555'>Pemerintah Kabupaten – Sistem Informasi Kelembagaan</div>
    <div style='font-size:18px;font-weight:bold;margin:6px 0;color:#1e3a5f'>DOKUMEN ANALISIS JABATAN</div>
    <div style='font-size:13px;color:#333'>${opdNama}</div>
    <div style='font-size:12px;color:#555;margin-top:4px'>Periode ${doc.periode}</div>
  </div>

  <!-- Info Dokumen -->
  <table style='width:100%;border-collapse:collapse;font-size:12px;margin-bottom:24px;border:1px solid #ccc;border-radius:6px'>
    <tr style='background:#f1f5f9'><td colspan='4' style='padding:8px 12px;font-weight:bold;color:#1e3a5f;font-size:12px'>IDENTITAS DOKUMEN</td></tr>
    <tr>
      <td style='padding:6px 12px;color:#555;width:22%'>Nomor Dokumen</td>
      <td style='padding:6px 12px;font-weight:600;width:28%'>${doc.nomor_dokumen}</td>
      <td style='padding:6px 12px;color:#555;width:22%'>Status</td>
      <td style='padding:6px 12px;font-weight:600'>${statusLabel(doc.status)}</td>
    </tr>
    <tr style='background:#f9fafb'>
      <td style='padding:6px 12px;color:#555'>Disetujui Oleh</td>
      <td style='padding:6px 12px;font-weight:600'>${doc.penyetuju || "-"}</td>
    </tr>
    <tr>
      <td style='padding:6px 12px;color:#555'>Tanggal Dibuat</td>
      <td style='padding:6px 12px;font-weight:600'>${formatTanggal(doc.tanggal_dibuat)}</td>
      <td style='padding:6px 12px;color:#555'>Jumlah Jabatan</td>
      <td style='padding:6px 12px;font-weight:600'>${uraianRows.length} jabatan</td>
    </tr>
  </table>

  <!-- Jabatan Sections -->
  ${jabatanSections || "<p style='color:#888;text-align:center;padding:24px'>Belum ada data jabatan untuk OPD ini.</p>"}

  <!-- Footer TTD -->

</body>
</html>`;
}

async function downloadAnjabPDF(doc: DokumenAnjab) {
  const [uraianRows, spesifikasiRows] = await Promise.all([
    api.uraian.export({ opd_id: doc.opd_id }),
    api.spesifikasi.export({ opd_id: doc.opd_id }),
  ]);

  const html = buildAnjabPDFHtml(doc, uraianRows, spesifikasiRows);
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) {
    toast.error("Pop-up diblokir browser. Izinkan pop-up lalu coba lagi.");
    return;
  }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 400);
  return uraianRows.length;
}

// ---- StatusBadge ----

function StatusBadge({ status }: { status: DokumenAnjab["status"] }) {
  const variants: Record<string, { icon: React.ElementType; className: string; label: string }> = {
    draft: { icon: FileWarning, className: "bg-muted text-muted-foreground border-muted", label: "Draft" },
    review: { icon: Clock, className: "bg-accent/30 text-accent-foreground border-accent/40", label: "Review" },
    revisi: { icon: AlertCircle, className: "bg-orange-100 text-orange-700 border-orange-200", label: "Revisi" },
    disetujui: { icon: CheckCircle, className: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Disetujui" },
  };
  const v = variants[status] ?? variants.draft;
  return (
    <Badge variant="outline" className={v.className}>
      <v.icon className="mr-1 h-3 w-3" />
      {v.label}
    </Badge>
  );
}

// ---- DownloadDropdown (per-row) ----

function DownloadDropdown({ doc }: { doc: DokumenAnjab }) {
  const [loading, setLoading] = useState<"excel" | "pdf" | null>(null);

  const handle = async (type: "excel" | "pdf") => {
    setLoading(type);
    try {
      const count = type === "excel"
        ? await downloadAnjabExcel(doc)
        : await downloadAnjabPDF(doc);
      if (count !== undefined) toast.success(`${count} jabatan berhasil diekspor`);
    } catch {
      toast.error("Gagal mengunduh dokumen");
    } finally {
      setLoading(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title="Download" disabled={loading !== null}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Download dokumen Anjab</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handle("excel")} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
          <div>
            <div className="font-medium">Excel (.xlsx)</div>
            <div className="text-xs text-muted-foreground">Uraian + spesifikasi jabatan</div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handle("pdf")} className="gap-2 cursor-pointer">
          <FileText className="h-4 w-4 text-red-500" />
          <div>
            <div className="font-medium">PDF (cetak)</div>
            <div className="text-xs text-muted-foreground">Dokumen Anjab lengkap</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ---- Page ----

export default function DokumenAnjabPage() {
  const [items, setItems] = useState<DokumenAnjab[]>([]);
  const [statsData, setStatsData] = useState<DokumenAnjab[]>([]);
  const [opdList, setOpdList] = useState<OPD[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [selectedDokumen, setSelectedDokumen] = useState<DokumenAnjab | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newOpdId, setNewOpdId] = useState("");
  const [newPeriode, setNewPeriode] = useState("");
  const [newNomor, setNewNomor] = useState("");
  const [dialogDownloading, setDialogDownloading] = useState<"excel" | "pdf" | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const [statsResult, opds] = await Promise.all([
        api.dokumenAnjab.list({ limit: 0 }),
        api.opd.list({ limit: 0 }),
      ]);
      setStatsData(statsResult.data);
      setOpdList(opds.data);
    } catch { /* keep previous */ }
  }, []);

  const fetchTable = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.dokumenAnjab.list({
        search: search || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        limit,
        offset,
      });
      setItems(result.data);
      setTotal(result.total);
    } catch { /* keep previous */ } finally {
      setLoading(false);
    }
  }, [search, statusFilter, limit, offset]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchTable(); }, [fetchTable]);

  const handleCreate = async () => {
    if (!newOpdId || !newPeriode) return;
    const selectedOpd = opdList.find((o) => o.id === newOpdId);
    await api.dokumenAnjab.create({
      opd_id: newOpdId,
      nama_opd: selectedOpd?.nama ?? "",
      periode: newPeriode,
      nomor_dokumen: newNomor,
    });
    setCreateOpen(false);
    setNewOpdId(""); setNewPeriode(""); setNewNomor("");
    fetchTable(); fetchStats();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Hapus dokumen ini?")) return;
    await api.dokumenAnjab.delete(id);
    fetchTable(); fetchStats();
  };

  const handleSubmit = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await api.dokumenAnjab.submit(id);
    fetchTable(); fetchStats();
    if (selectedDokumen?.id === id) setDetailOpen(false);
  };

  const handleApprove = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    await api.dokumenAnjab.approve(id, "Admin");
    fetchTable(); fetchStats();
    if (selectedDokumen?.id === id) setDetailOpen(false);
  };

  const handleDialogDownload = async (type: "excel" | "pdf") => {
    if (!selectedDokumen) return;
    setDialogDownloading(type);
    try {
      const count = type === "excel"
        ? await downloadAnjabExcel(selectedDokumen)
        : await downloadAnjabPDF(selectedDokumen);
      if (count !== undefined) toast.success(`${count} jabatan berhasil diekspor`);
    } catch {
      toast.error("Gagal mengunduh dokumen");
    } finally {
      setDialogDownloading(null);
    }
  };

  // Export daftar dokumen (metadata saja) sebagai Excel
  const handleExportList = async () => {
    setExporting(true);
    try {
      const result = await api.dokumenAnjab.list({
        search: search || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        limit: 0,
      });
      const data = result.data.map((d, i) => ({
        "No": i + 1,
        "Nomor Dokumen": d.nomor_dokumen,
        "OPD": d.opd_nama ?? d.nama_opd,
        "Periode": d.periode,
        "Jumlah Jabatan": d.jumlah_jabatan,
        "Tanggal Dibuat": formatTanggal(d.tanggal_dibuat),
        "Status": statusLabel(d.status),
        "Disetujui Oleh": d.penyetuju || "-",
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      ws["!cols"] = [{ wch: 4 }, { wch: 24 }, { wch: 36 }, { wch: 10 }, { wch: 14 }, { wch: 22 }, { wch: 12 }, { wch: 20 }, { wch: 20 }];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Daftar Dokumen Anjab");
      XLSX.writeFile(wb, "daftar-dokumen-anjab.xlsx");
      toast.success(`${data.length} dokumen berhasil diekspor`);
    } catch {
      toast.error("Gagal mengekspor daftar");
    } finally {
      setExporting(false);
    }
  };

  const stats = {
    total: statsData.length || total,
    draft: statsData.filter((d) => d.status === "draft").length,
    review: statsData.filter((d) => d.status === "review").length,
    disetujui: statsData.filter((d) => d.status === "disetujui").length,
  };

  const activeFilters = [
    search ? `Pencarian: ${search}` : null,
    statusFilter !== "all" ? `Status: ${statusFilter}` : null,
  ].filter((value): value is string => Boolean(value));

  return (
    <AdminPageShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Dokumen Anjab</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">Dokumen Anjab</h1>
        </div>
        <div className="flex gap-2">
          {/* <Button
            variant="outline"
            className="gap-2 rounded-xl border-border/70 bg-background/80"
            onClick={handleExportList}
            disabled={exporting}
          >
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
            {exporting ? "Mengekspor..." : "Export Daftar"}
          </Button> */}
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 rounded-xl shadow-lg shadow-primary/15">
                <Plus className="h-4 w-4" />
                Buat Dokumen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buat Dokumen Anjab Baru</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>OPD</Label>
                  <Select value={newOpdId} onValueChange={setNewOpdId}>
                    <SelectTrigger><SelectValue placeholder="Pilih OPD" /></SelectTrigger>
                    <SelectContent>
                      {opdList.map((opd) => (
                        <SelectItem key={opd.id} value={opd.id}>{opd.nama}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Periode</Label>
                  <Select value={newPeriode} onValueChange={setNewPeriode}>
                    <SelectTrigger><SelectValue placeholder="Pilih periode" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nomor Dokumen</Label>
                  <Input placeholder="DOK/ANJAB/XXX/2024" value={newNomor} onChange={(e) => setNewNomor(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Batal</Button>
                <Button onClick={handleCreate}>Buat Dokumen</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Dokumen", value: stats.total, Icon: FileText, color: "bg-primary/10 text-primary" },
          { label: "Draft", value: stats.draft, Icon: FileWarning, color: "bg-muted text-muted-foreground" },
          { label: "Review", value: stats.review, Icon: Clock, color: "bg-accent/30 text-accent-foreground" },
          { label: "Disetujui", value: stats.disetujui, Icon: CheckCircle, color: "bg-emerald-100 text-emerald-600" },
        ].map(({ label, value, Icon, color }) => (
          <Card key={label} className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-3 ${color}`}><Icon className="h-6 w-6" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardHeader className="border-b border-border/70">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg">Daftar Dokumen</CardTitle>
              <div className="mt-2 flex flex-wrap gap-2">
                {activeFilters.length > 0 ? (
                  activeFilters.map((f) => (
                    <Badge key={f} className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-primary">{f}</Badge>
                  ))
                ) : (
                  <Badge className="rounded-full border border-border/80 bg-background/80 px-3 py-1 text-muted-foreground">
                    Menampilkan seluruh dokumen Anjab
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari dokumen..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setOffset(0); }}
                  className="h-11 rounded-xl border-border/70 bg-background/80 pl-9 sm:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setOffset(0); }}>
                <SelectTrigger className="h-11 w-full rounded-xl border-border/70 bg-background/80 sm:w-44">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="revisi">Revisi</SelectItem>
                  <SelectItem value="disetujui">Disetujui</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/70 hover:bg-transparent">
                  <TableHead>No. Dokumen</TableHead>
                  <TableHead>OPD</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead className="text-center">Jabatan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">Memuat data...</TableCell></TableRow>
                ) : items.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">Tidak ada dokumen</TableCell></TableRow>
                ) : items.map((doc) => (
                  <TableRow key={doc.id} className="cursor-pointer border-border/60 hover:bg-background/80" onClick={() => { setSelectedDokumen(doc); setDetailOpen(true); }}>
                    <TableCell className="font-mono text-sm">{doc.nomor_dokumen}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{doc.opd_nama ?? doc.nama_opd}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{doc.periode}</TableCell>
                    <TableCell className="text-center font-medium">{doc.jumlah_jabatan}</TableCell>
                    <TableCell className="text-muted-foreground">{new Date(doc.tanggal_dibuat).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell><StatusBadge status={doc.status} /></TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" title="Lihat detail" onClick={(e) => { e.stopPropagation(); setSelectedDokumen(doc); setDetailOpen(true); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DownloadDropdown doc={doc} />
                        <Button variant="ghost" size="icon" className="text-destructive" title="Hapus" onClick={(e) => handleDelete(doc.id, e)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {total > 0 && (
            <div className="border-t border-border/70">
              <DataTablePagination
                total={total} limit={limit} offset={offset}
                onPageChange={setOffset}
                onPageSizeChange={(newLimit) => { setLimit(newLimit); setOffset(0); }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Detail Dokumen Anjab
            </DialogTitle>
          </DialogHeader>
          {selectedDokumen && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedDokumen.status} />
              </div>

              <div className="rounded-lg border border-border/60 bg-muted/20 divide-y divide-border/50">
                <div className="flex items-start gap-3 px-4 py-3">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Nomor Dokumen</p>
                    <p className="font-semibold font-mono text-sm break-all">{selectedDokumen.nomor_dokumen}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 px-4 py-3">
                  <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">OPD</p>
                    <p className="font-semibold text-sm">{selectedDokumen.opd_nama ?? selectedDokumen.nama_opd}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-border/50">
                  <div className="flex items-start gap-3 px-4 py-3">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Tanggal Dibuat</p>
                      <p className="font-semibold text-sm">{formatTanggal(selectedDokumen.tanggal_dibuat)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 px-4 py-3">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Periode</p>
                      <p className="font-semibold text-sm">{selectedDokumen.periode}</p>
                    </div>
                  </div>
                </div>
                {selectedDokumen.penyetuju && (
                  <div className="flex items-start gap-3 px-4 py-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Disetujui oleh</p>
                      <p className="font-semibold text-sm">{selectedDokumen.penyetuju}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 rounded-lg bg-primary/5 border border-primary/15 px-4 py-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{selectedDokumen.jumlah_jabatan}</p>
                  <p className="text-xs text-muted-foreground">Total Jabatan</p>
                </div>
                <div className="h-10 w-px bg-border/60" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Dokumen ini mencakup analisis jabatan seluruh jabatan pada OPD <span className="font-medium text-foreground">{selectedDokumen.opd_nama ?? selectedDokumen.nama_opd}</span> periode {selectedDokumen.periode}.
                </p>
              </div>

              {/* Download actions */}
              <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                <p className="mb-3 text-sm font-semibold text-foreground">Download Dokumen Anjab</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => handleDialogDownload("excel")}
                    disabled={dialogDownloading !== null}
                  >
                    {dialogDownloading === "excel"
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <FileSpreadsheet className="h-4 w-4 text-emerald-600" />}
                    {dialogDownloading === "excel" ? "Mengunduh..." : "Download Excel"}
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => handleDialogDownload("pdf")}
                    disabled={dialogDownloading !== null}
                  >
                    {dialogDownloading === "pdf"
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <FileText className="h-4 w-4 text-red-500" />}
                    {dialogDownloading === "pdf" ? "Memproses..." : "Download PDF"}
                  </Button>
                </div>
              </div>

              {/* Workflow actions */}
              <div className="flex flex-wrap gap-2">
                {selectedDokumen.status === "draft" && (
                  <Button className="gap-2" onClick={(e) => handleSubmit(selectedDokumen.id, e as React.MouseEvent)}>
                    <Send className="h-4 w-4" />
                    Ajukan Review
                  </Button>
                )}
                {selectedDokumen.status === "review" && (
                  <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={(e) => handleApprove(selectedDokumen.id, e as React.MouseEvent)}>
                    <CheckCircle className="h-4 w-4" />
                    Setujui
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  );
}
