"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { DataTablePagination } from "@/components/data-table-pagination";
import { api, type LaporanABK, type OPD } from "@/lib/api";
import {
    Building2,
    CheckCircle2,
    Clock,
    Download,
    Eye,
    FileEdit,
    FileText,
    Loader2,
    MoreHorizontal,
    Plus,
    Printer,
    Search,
    TrendingUp,
    Users
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface CreateForm {
  opd_id: string;
  periode: string;
  tanggal_dibuat: string;
  total_jabatan: number;
  total_kebutuhan_pegawai: number;
  total_pegawai_existing: number;
  efisiensi: number;
}

const emptyForm: CreateForm = {
  opd_id: "", periode: "", tanggal_dibuat: new Date().toISOString().split("T")[0],
  total_jabatan: 0, total_kebutuhan_pegawai: 0, total_pegawai_existing: 0, efisiensi: 0,
};

export function LaporanABKComponent() {
  const [data, setData] = useState<LaporanABK[]>([]);
  const [statsData, setStatsData] = useState<LaporanABK[]>([]);
  const [opdList, setOpdList] = useState<OPD[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [selectedLaporan, setSelectedLaporan] = useState<LaporanABK | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<CreateForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const [statsResult, opds] = await Promise.all([
        api.laporanAbk.list({ limit: 0 }),
        api.opd.list({ limit: 0 }),
      ]);
      setStatsData(statsResult.data);
      setOpdList(opds.data);
    } catch { /* keep */ }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const result = await api.laporanAbk.list({ limit, offset });
      setData(result.data);
      setTotal(result.total);
    } catch { /* keep empty */ }
  }, [limit, offset]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredData = data.filter((item) => {
    const matchSearch = !search ||
      (item.opd_nama ?? "").toLowerCase().includes(search.toLowerCase()) ||
      item.periode.includes(search);
    const matchStatus = filterStatus === "all" || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalLaporan = total || statsData.length;
  const laporanDisetujui = statsData.filter((d) => d.status === "disetujui").length;
  const laporanFinal = statsData.filter((d) => d.status === "final").length;
  const avgEfisiensi = statsData.length ? statsData.reduce((sum, item) => sum + item.efisiensi, 0) / statsData.length : 0;

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "outline"; icon: React.ReactNode; label: string }> = {
      draft: { variant: "outline", icon: <FileEdit className="mr-1 h-3 w-3" />, label: "Draft" },
      final: { variant: "secondary", icon: <Clock className="mr-1 h-3 w-3" />, label: "Final" },
      disetujui: { variant: "default", icon: <CheckCircle2 className="mr-1 h-3 w-3" />, label: "Disetujui" },
    };
    const { variant, icon, label } = config[status] || config.draft;
    return <Badge variant={variant} className="flex items-center">{icon}{label}</Badge>;
  };

  const getEfisiensiColor = (efisiensi: number) => {
    if (efisiensi < 85) return "text-destructive";
    if (efisiensi > 105) return "text-yellow-600";
    return "text-green-600";
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  async function handleCreate() {
    if (!form.opd_id || !form.periode) { toast.error("OPD dan periode wajib diisi"); return; }
    setSaving(true);
    try {
      await api.laporanAbk.create({
        opd_id: form.opd_id, periode: form.periode,
        tanggal_dibuat: form.tanggal_dibuat,
        total_jabatan: form.total_jabatan,
        total_kebutuhan_pegawai: form.total_kebutuhan_pegawai,
        total_pegawai_existing: form.total_pegawai_existing,
        efisiensi: form.efisiensi,
      });
      await fetchData(); await fetchStats();
      toast.success("Laporan ABK berhasil dibuat");
      setCreateOpen(false);
      setForm(emptyForm);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      toast.error(`Gagal membuat laporan: ${msg}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateStatus(id: string, newStatus: string) {
    setUpdatingId(id);
    try {
      const updated = await api.laporanAbk.update(id, { status: newStatus });
      setData((prev) => prev.map((d) => d.id === updated.id ? updated : d));
      if (selectedLaporan?.id === id) setSelectedLaporan(updated);
      toast.success(`Status berubah ke ${newStatus === "final" ? "Final" : "Disetujui"}`);
    } catch {
      toast.error("Gagal memperbarui status laporan");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Laporan", value: totalLaporan, sub: "Semua periode", Icon: FileText, color: "text-muted-foreground" },
          { title: "Disetujui", value: laporanDisetujui, sub: <Progress value={(laporanDisetujui / Math.max(totalLaporan, 1)) * 100} className="mt-2 h-2" />, Icon: CheckCircle2, color: "text-green-600" },
          { title: "Menunggu Persetujuan", value: laporanFinal, sub: `${totalLaporan - laporanDisetujui - laporanFinal} masih draft`, Icon: Clock, color: "text-yellow-600" },
          { title: "Rata-rata Efisiensi", value: `${avgEfisiensi.toFixed(1)}%`, sub: "Target: 85-105%", Icon: TrendingUp, color: getEfisiensiColor(avgEfisiensi) },
        ].map(({ title, value, sub, Icon, color }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
              <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              {typeof sub === "string" ? <p className="text-xs text-muted-foreground">{sub}</p> : sub}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Cari OPD atau periode..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="final">Final</SelectItem>
              <SelectItem value="disetujui">Disetujui</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Buat Laporan Baru
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>OPD</TableHead>
              <TableHead className="text-center">Periode</TableHead>
              <TableHead className="text-center">Tanggal</TableHead>
              <TableHead className="text-center">Jabatan</TableHead>
              <TableHead className="text-center">Kebutuhan</TableHead>
              <TableHead className="text-center">Existing</TableHead>
              <TableHead className="text-center">Efisiensi</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="w-[80px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  <p className="text-muted-foreground">Tidak ada data laporan. Klik &quot;Buat Laporan Baru&quot; untuk memulai.</p>
                </TableCell>
              </TableRow>
            ) : filteredData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{item.opd_nama}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">{item.periode}</TableCell>
                <TableCell className="text-center text-muted-foreground">{formatDate(item.tanggal_dibuat)}</TableCell>
                <TableCell className="text-center">{item.total_jabatan}</TableCell>
                <TableCell className="text-center font-medium">{item.total_kebutuhan_pegawai}</TableCell>
                <TableCell className="text-center">{item.total_pegawai_existing}</TableCell>
                <TableCell className="text-center">
                  <span className={`font-semibold ${getEfisiensiColor(item.efisiensi)}`}>{item.efisiensi.toFixed(1)}%</span>
                </TableCell>
                <TableCell className="text-center">{getStatusBadge(item.status)}</TableCell>
                <TableCell>
                  {updatingId === item.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedLaporan(item)}>
                          <Eye className="mr-2 h-4 w-4" /> Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" /> Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="mr-2 h-4 w-4" /> Cetak
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {item.status === "draft" && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(item.id, "final")}>
                            <Clock className="mr-2 h-4 w-4 text-yellow-600" /> Finalisasi
                          </DropdownMenuItem>
                        )}
                        {item.status === "final" && (
                          <DropdownMenuItem className="text-green-600" onClick={() => handleUpdateStatus(item.id, "disetujui")}>
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Setujui
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {total > 0 && (
          <div className="border-t">
            <DataTablePagination
              total={total}
              limit={limit}
              offset={offset}
              onPageChange={setOffset}
              onPageSizeChange={(newLimit) => { setLimit(newLimit); setOffset(0); }}
            />
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedLaporan} onOpenChange={() => setSelectedLaporan(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Laporan ABK — {selectedLaporan?.opd_nama}
            </DialogTitle>
            <DialogDescription>
              Periode {selectedLaporan?.periode} | Dibuat: {selectedLaporan && formatDate(selectedLaporan.tanggal_dibuat)}
            </DialogDescription>
          </DialogHeader>
          {selectedLaporan && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status Laporan</span>
                {getStatusBadge(selectedLaporan.status)}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Jabatan</p>
                      <p className="text-xl font-bold">{selectedLaporan.total_jabatan}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/50">
                      <TrendingUp className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Efisiensi</p>
                      <p className={`text-xl font-bold ${getEfisiensiColor(selectedLaporan.efisiensi)}`}>
                        {selectedLaporan.efisiensi.toFixed(1)}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Perbandingan Kebutuhan vs Existing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Kebutuhan Pegawai</span>
                    <span className="font-semibold">{selectedLaporan.total_kebutuhan_pegawai}</span>
                  </div>
                  <Progress value={100} className="h-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pegawai Existing</span>
                    <span className="font-semibold">{selectedLaporan.total_pegawai_existing}</span>
                  </div>
                  <Progress value={(selectedLaporan.total_pegawai_existing / Math.max(selectedLaporan.total_kebutuhan_pegawai, 1)) * 100} className="h-3" />
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-sm font-medium">Selisih</span>
                    <span className={`font-bold ${selectedLaporan.total_pegawai_existing - selectedLaporan.total_kebutuhan_pegawai < 0 ? "text-destructive" : "text-green-600"}`}>
                      {selectedLaporan.total_pegawai_existing - selectedLaporan.total_kebutuhan_pegawai > 0 ? "+" : ""}
                      {selectedLaporan.total_pegawai_existing - selectedLaporan.total_kebutuhan_pegawai} orang
                    </span>
                  </div>
                </CardContent>
              </Card>
              <div className="flex flex-wrap justify-end gap-2">
                {selectedLaporan.status === "draft" && (
                  <Button variant="outline" className="gap-2 text-yellow-600" onClick={() => handleUpdateStatus(selectedLaporan.id, "final")} disabled={!!updatingId}>
                    {updatingId === selectedLaporan.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />}
                    Finalisasi
                  </Button>
                )}
                {selectedLaporan.status === "final" && (
                  <Button variant="outline" className="gap-2 text-green-600" onClick={() => handleUpdateStatus(selectedLaporan.id, "disetujui")} disabled={!!updatingId}>
                    {updatingId === selectedLaporan.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    Setujui
                  </Button>
                )}
                <Button variant="outline" className="gap-2"><Printer className="h-4 w-4" />Cetak</Button>
                <Button className="gap-2"><Download className="h-4 w-4" />Download PDF</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Buat Laporan ABK Baru</DialogTitle>
            <DialogDescription>Buat laporan Analisis Beban Kerja untuk satu OPD.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>OPD *</Label>
              <Select value={form.opd_id} onValueChange={(v) => setForm((f) => ({ ...f, opd_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Pilih OPD" /></SelectTrigger>
                <SelectContent>{opdList.map((opd) => <SelectItem key={opd.id} value={opd.id}>{opd.nama}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Periode *</Label>
                <Input placeholder="Contoh: 2024" value={form.periode} onChange={(e) => setForm((f) => ({ ...f, periode: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Tanggal Dibuat *</Label>
                <Input type="date" value={form.tanggal_dibuat} onChange={(e) => setForm((f) => ({ ...f, tanggal_dibuat: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Total Jabatan</Label>
                <Input type="number" min={0} value={form.total_jabatan} onChange={(e) => setForm((f) => ({ ...f, total_jabatan: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="space-y-2">
                <Label>Kebutuhan Pegawai</Label>
                <Input type="number" min={0} value={form.total_kebutuhan_pegawai} onChange={(e) => setForm((f) => ({ ...f, total_kebutuhan_pegawai: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="space-y-2">
                <Label>Pegawai Existing</Label>
                <Input type="number" min={0} value={form.total_pegawai_existing} onChange={(e) => setForm((f) => ({ ...f, total_pegawai_existing: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Efisiensi (%)</Label>
              <Input type="number" min={0} step={0.1} value={form.efisiensi} onChange={(e) => setForm((f) => ({ ...f, efisiensi: parseFloat(e.target.value) || 0 }))} />
              <p className="text-xs text-muted-foreground">Target: 85–105%. Kosongkan jika belum dihitung.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={saving}>Batal</Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Buat Laporan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
