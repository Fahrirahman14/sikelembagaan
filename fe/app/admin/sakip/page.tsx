"use client";

import { AdminPageShell } from "@/components/admin-page-shell";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DataTablePagination } from "@/components/data-table-pagination";
import {
    api,
    type DokumenSAKIP,
    type NilaiSAKIP,
    type OPD,
} from "@/lib/api";
import {
    AlertCircle,
    Award,
    CheckCircle,
    Edit,
    FileText,
    Link as LinkIcon,
    Loader2,
    Plus,
    Search,
    ShieldCheck,
    Star,
    Trash2,
    Upload,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const PREDIKAT_OPTIONS = ["AA", "A", "BB", "B", "CC", "C", "D"];

function predikatColor(predikat: string) {
  if (predikat === "AA") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (predikat === "A") return "bg-green-100 text-green-700 border-green-200";
  if (predikat === "BB") return "bg-blue-100 text-blue-700 border-blue-200";
  if (predikat === "B") return "bg-sky-100 text-sky-700 border-sky-200";
  if (predikat === "CC") return "bg-yellow-100 text-yellow-700 border-yellow-200";
  return "bg-red-100 text-red-700 border-red-200";
}

export default function AdminSAKIPPage() {
  const [activeTab, setActiveTab] = useState("dokumen");

  // OPD list
  const [opdList, setOpdList] = useState<OPD[]>([]);

  // Dokumen SAKIP state
  const [dokumenList, setDokumenList] = useState<DokumenSAKIP[]>([]);
  const [dokumenSearch, setDokumenSearch] = useState("");
  const [dokumenOpdFilter, setDokumenOpdFilter] = useState("all");
  const [dokumenJenisFilter, setDokumenJenisFilter] = useState("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    opdId: "", namaDokumen: "", jenisDokumen: "renstra" as string,
    linkDokumen: "", tahun: new Date().getFullYear(),
  });

  const [dokumenTotal, setDokumenTotal] = useState(0);
  const [dokumenLimit, setDokumenLimit] = useState(10);
  const [dokumenOffset, setDokumenOffset] = useState(0);

  // Nilai SAKIP state
  const [nilaiList, setNilaiList] = useState<NilaiSAKIP[]>([]);
  const [nilaiSearch, setNilaiSearch] = useState("");
  const [nilaiTahunFilter, setNilaiTahunFilter] = useState("all");
  const [nilaiDialogOpen, setNilaiDialogOpen] = useState(false);
  const [nilaiLoading, setNilaiLoading] = useState(false);
  const [selectedNilai, setSelectedNilai] = useState<NilaiSAKIP | null>(null);
  const [nilaiForm, setNilaiForm] = useState({
    opdId: "", tahun: new Date().getFullYear(),
    nilaiTotal: 0, predikat: "B" as string, catatan: "",
  });
  const [nilaiTotal, setNilaiTotal] = useState(0);
  const [nilaiLimit, setNilaiLimit] = useState(10);
  const [nilaiOffset, setNilaiOffset] = useState(0);

  const fetchDokumen = useCallback(async () => {
    const result = await api.dokumenSakip.list({
      opd_id: dokumenOpdFilter !== "all" ? dokumenOpdFilter : undefined,
      limit: dokumenLimit,
      offset: dokumenOffset,
    });
    setDokumenList(result.data);
    setDokumenTotal(result.total);
  }, [dokumenOpdFilter, dokumenLimit, dokumenOffset]);

  const fetchNilai = useCallback(async () => {
    const result = await api.nilaiSakip.list({
      limit: nilaiLimit,
      offset: nilaiOffset,
    });
    setNilaiList(result.data);
    setNilaiTotal(result.total);
  }, [nilaiLimit, nilaiOffset]);

  useEffect(() => {
    api.opd.list({ limit: 0 }).then((r) => setOpdList(r.data));
  }, []);
  useEffect(() => { fetchDokumen(); }, [fetchDokumen]);
  useEffect(() => { fetchNilai(); }, [fetchNilai]);

  // ---- Dokumen SAKIP handlers ----
  const filteredDokumen = dokumenList.filter((doc) => {
    const matchSearch = !dokumenSearch ||
      doc.nama_dokumen.toLowerCase().includes(dokumenSearch.toLowerCase()) ||
      (doc.opd_nama ?? "").toLowerCase().includes(dokumenSearch.toLowerCase());
    const matchJenis = dokumenJenisFilter === "all" || doc.jenis_dokumen === dokumenJenisFilter;
    return matchSearch && matchJenis;
  });

  async function handleUploadSubmit() {
    if (!uploadForm.opdId || !uploadForm.namaDokumen) {
      toast.error("Mohon isi OPD dan nama dokumen");
      return;
    }
    setUploadLoading(true);
    try {
      await api.dokumenSakip.create({
        opd_id: uploadForm.opdId,
        nama_dokumen: uploadForm.namaDokumen,
        jenis_dokumen: uploadForm.jenisDokumen,
        tahun: uploadForm.tahun,
        file_path: uploadForm.linkDokumen || "",
        uploaded_by: "Admin",
      });
      await fetchDokumen();
      toast.success("Dokumen SAKIP berhasil diupload");
      setUploadDialogOpen(false);
      setUploadForm({ opdId: "", namaDokumen: "", jenisDokumen: "renstra", linkDokumen: "", tahun: new Date().getFullYear() });
    } catch {
      toast.error("Gagal mengupload dokumen");
    } finally {
      setUploadLoading(false);
    }
  }

  async function handleDeleteDokumen(id: string) {
    try {
      await api.dokumenSakip.delete(id);
      await fetchDokumen();
      toast.success("Dokumen dihapus");
    } catch {
      toast.error("Gagal menghapus dokumen");
    }
  }

  // ---- Nilai SAKIP handlers ----
  const availableTahun = [...new Set(nilaiList.map((n) => n.tahun))].sort((a, b) => b - a);

  const filteredNilai = nilaiList.filter((n) => {
    const matchSearch = !nilaiSearch ||
      (n.opd_nama ?? "").toLowerCase().includes(nilaiSearch.toLowerCase());
    const matchTahun = nilaiTahunFilter === "all" || String(n.tahun) === nilaiTahunFilter;
    return matchSearch && matchTahun;
  });

  function openCreateNilai() {
    setSelectedNilai(null);
    setNilaiForm({ opdId: "", tahun: new Date().getFullYear(), nilaiTotal: 0, predikat: "B", catatan: "" });
    setNilaiDialogOpen(true);
  }

  function openEditNilai(n: NilaiSAKIP) {
    setSelectedNilai(n);
    setNilaiForm({ opdId: n.opd_id, tahun: n.tahun, nilaiTotal: n.nilai_total, predikat: n.predikat || "B", catatan: "" });
    setNilaiDialogOpen(true);
  }

  async function handleSaveNilai() {
    if (!nilaiForm.opdId || !nilaiForm.tahun) {
      toast.error("OPD dan tahun wajib diisi");
      return;
    }
    setNilaiLoading(true);
    try {
      await api.nilaiSakip.upsert({
        opd_id: nilaiForm.opdId,
        tahun: nilaiForm.tahun,
        nilai_total: nilaiForm.nilaiTotal,
        predikat: nilaiForm.predikat,
        komponen_nilai: undefined,
      });
      await fetchNilai();
      toast.success(selectedNilai ? "Nilai SAKIP diperbarui" : "Nilai SAKIP berhasil disimpan");
      setNilaiDialogOpen(false);
    } catch {
      toast.error("Gagal menyimpan nilai SAKIP");
    } finally {
      setNilaiLoading(false);
    }
  }

  const avgNilai = nilaiList.length
    ? nilaiList.reduce((sum, n) => sum + n.nilai_total, 0) / nilaiList.length
    : 0;

  return (
    <AdminPageShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">SAKIP</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">Manajemen SAKIP</h1>
        </div>
        {activeTab === "dokumen" ? (
          <Button className="gap-2 rounded-xl shadow-lg shadow-primary/15" onClick={() => setUploadDialogOpen(true)}>
            <Upload className="h-4 w-4" />
            Upload Dokumen
          </Button>
        ) : (
          <Button className="gap-2 rounded-xl shadow-lg shadow-primary/15" onClick={openCreateNilai}>
            <Plus className="h-4 w-4" />
            Tambah Nilai SAKIP
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Dokumen", value: dokumenList.length, Icon: FileText, color: "bg-primary text-primary-foreground" },
          { label: "OPD Terdata Nilai", value: nilaiList.length, Icon: CheckCircle, color: "bg-green-500 text-white" },
          { label: "Belum Ada Nilai", value: Math.max(0, opdList.length - nilaiList.length), Icon: AlertCircle, color: "bg-yellow-500 text-white" },
          { label: "Rata-rata Nilai", value: avgNilai ? avgNilai.toFixed(1) : "—", Icon: ShieldCheck, color: "bg-accent text-accent-foreground" },
        ].map(({ label, value, Icon, color }) => (
          <Card key={label} className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 rounded-xl border border-border/70 bg-background/80">
          <TabsTrigger value="dokumen" className="rounded-lg">
            <FileText className="mr-2 h-4 w-4" /> Dokumen SAKIP
          </TabsTrigger>
          <TabsTrigger value="nilai" className="rounded-lg">
            <Award className="mr-2 h-4 w-4" /> Nilai SAKIP
          </TabsTrigger>
        </TabsList>

        {/* ===== TAB DOKUMEN ===== */}
        <TabsContent value="dokumen">
          {/* Filter Dokumen */}
          <Card className="mb-6 border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Cari dokumen..." value={dokumenSearch} onChange={(e) => setDokumenSearch(e.target.value)}
                    className="h-11 rounded-xl border-border/70 bg-background/80 pl-10" />
                </div>
                <Select value={dokumenOpdFilter} onValueChange={(v) => { setDokumenOpdFilter(v); setDokumenOffset(0); }}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-border/70 bg-background/80 sm:w-48">
                    <SelectValue placeholder="Filter OPD" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua OPD</SelectItem>
                    {opdList.map((opd) => <SelectItem key={opd.id} value={opd.id}>{opd.nama}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={dokumenJenisFilter} onValueChange={setDokumenJenisFilter}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-border/70 bg-background/80 sm:w-40">
                    <SelectValue placeholder="Filter Jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenis</SelectItem>
                    <SelectItem value="renstra">Renstra</SelectItem>
                    <SelectItem value="renja">Renja</SelectItem>
                    <SelectItem value="lakip">LAKIP</SelectItem>
                    <SelectItem value="iku">IKU</SelectItem>
                    <SelectItem value="tapkin">Tapkin</SelectItem>
                    <SelectItem value="lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="h-11 rounded-xl border-border/70" onClick={() => { setDokumenSearch(""); setDokumenOpdFilter("all"); setDokumenJenisFilter("all"); }}>Reset</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardHeader className="border-b border-border/70">
              <CardTitle className="text-lg">Daftar Dokumen SAKIP ({filteredDokumen.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Dokumen</TableHead>
                      <TableHead>OPD</TableHead>
                      <TableHead>Jenis</TableHead>
                      <TableHead className="text-center">Tahun</TableHead>
                      <TableHead>Upload Oleh</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDokumen.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">Tidak ada dokumen ditemukan</TableCell>
                      </TableRow>
                    ) : filteredDokumen.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{doc.nama_dokumen}</p>
                            <p className="text-xs text-muted-foreground">{new Date(doc.created_at).toLocaleDateString("id-ID")}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{doc.opd_nama}</TableCell>
                        <TableCell><Badge variant="outline">{doc.jenis_dokumen.toUpperCase()}</Badge></TableCell>
                        <TableCell className="text-center">{doc.tahun}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{doc.uploaded_by}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {doc.file_path && (
                              <Button variant="ghost" size="icon" title="Buka link" asChild>
                                <a href={doc.file_path} target="_blank" rel="noopener noreferrer">
                                  <LinkIcon className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" className="text-destructive" title="Hapus" onClick={() => handleDeleteDokumen(doc.id)}>
                              <Trash2 className="h-4 w-4" />
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

        {/* ===== TAB NILAI ===== */}
        <TabsContent value="nilai">
          {/* Filter Nilai */}
          <Card className="mb-6 border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Cari OPD..." value={nilaiSearch} onChange={(e) => setNilaiSearch(e.target.value)}
                    className="h-11 rounded-xl border-border/70 bg-background/80 pl-10" />
                </div>
                <Select value={nilaiTahunFilter} onValueChange={setNilaiTahunFilter}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-border/70 bg-background/80 sm:w-40">
                    <SelectValue placeholder="Filter Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tahun</SelectItem>
                    {availableTahun.map((t) => <SelectItem key={t} value={String(t)}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button variant="outline" className="h-11 rounded-xl border-border/70" onClick={() => { setNilaiSearch(""); setNilaiTahunFilter("all"); }}>Reset</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardHeader className="border-b border-border/70">
              <CardTitle className="text-lg">Nilai SAKIP per OPD ({filteredNilai.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>OPD</TableHead>
                      <TableHead className="text-center">Tahun</TableHead>
                      <TableHead className="text-center">Nilai Total</TableHead>
                      <TableHead className="text-center">Predikat</TableHead>
                      <TableHead>Diperbarui</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNilai.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                          Belum ada nilai SAKIP. Klik &quot;Tambah Nilai SAKIP&quot; untuk menambahkan.
                        </TableCell>
                      </TableRow>
                    ) : filteredNilai.map((n) => (
                      <TableRow key={n.id}>
                        <TableCell className="font-medium text-foreground">{n.opd_nama}</TableCell>
                        <TableCell className="text-center">{n.tahun}</TableCell>
                        <TableCell className="text-center">
                          <span className="text-lg font-bold text-foreground">{n.nilai_total.toFixed(2)}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          {n.predikat ? (
                            <Badge className={`rounded-full border px-3 py-1 ${predikatColor(n.predikat)}`}>
                              <Star className="mr-1 h-3 w-3" />
                              {n.predikat}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(n.updated_at).toLocaleDateString("id-ID")}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" title="Edit nilai" onClick={() => openEditNilai(n)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {nilaiTotal > 0 && (
                <div className="border-t border-border/70">
                  <DataTablePagination
                    total={nilaiTotal}
                    limit={nilaiLimit}
                    offset={nilaiOffset}
                    onPageChange={setNilaiOffset}
                    onPageSizeChange={(nl) => { setNilaiLimit(nl); setNilaiOffset(0); }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ===== Dialog Upload Dokumen ===== */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Dokumen SAKIP</DialogTitle>
            <DialogDescription>Upload dokumen SAKIP atau link eksternal ke file SAKIP</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>OPD *</Label>
              <Select value={uploadForm.opdId} onValueChange={(v) => setUploadForm((f) => ({ ...f, opdId: v }))}>
                <SelectTrigger><SelectValue placeholder="Pilih OPD" /></SelectTrigger>
                <SelectContent>{opdList.map((opd) => <SelectItem key={opd.id} value={opd.id}>{opd.nama}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nama Dokumen *</Label>
              <Input placeholder="Contoh: Renstra 2024-2028" value={uploadForm.namaDokumen}
                onChange={(e) => setUploadForm((f) => ({ ...f, namaDokumen: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Jenis Dokumen *</Label>
                <Select value={uploadForm.jenisDokumen} onValueChange={(v) => setUploadForm((f) => ({ ...f, jenisDokumen: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["renstra","renja","lakip","iku","tapkin","lainnya"].map((j) => <SelectItem key={j} value={j}>{j.toUpperCase()}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tahun *</Label>
                <Input type="number" value={uploadForm.tahun} onChange={(e) => setUploadForm((f) => ({ ...f, tahun: parseInt(e.target.value) }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Link Dokumen (opsional)</Label>
              <Input placeholder="https://..." value={uploadForm.linkDokumen}
                onChange={(e) => setUploadForm((f) => ({ ...f, linkDokumen: e.target.value }))} />
              <p className="text-xs text-muted-foreground">Jika dokumen sudah tersimpan di website lain</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)} disabled={uploadLoading}>Batal</Button>
            <Button onClick={handleUploadSubmit} disabled={uploadLoading}>
              {uploadLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Dialog Nilai SAKIP ===== */}
      <Dialog open={nilaiDialogOpen} onOpenChange={setNilaiDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedNilai ? "Edit Nilai SAKIP" : "Tambah Nilai SAKIP"}</DialogTitle>
            <DialogDescription>Catat hasil evaluasi SAKIP untuk satu OPD dalam satu tahun.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>OPD *</Label>
              <Select value={nilaiForm.opdId} onValueChange={(v) => setNilaiForm((f) => ({ ...f, opdId: v }))} disabled={!!selectedNilai}>
                <SelectTrigger><SelectValue placeholder="Pilih OPD" /></SelectTrigger>
                <SelectContent>{opdList.map((opd) => <SelectItem key={opd.id} value={opd.id}>{opd.nama}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tahun *</Label>
                <Input type="number" value={nilaiForm.tahun} disabled={!!selectedNilai}
                  onChange={(e) => setNilaiForm((f) => ({ ...f, tahun: parseInt(e.target.value) }))} />
              </div>
              <div className="space-y-2">
                <Label>Predikat *</Label>
                <Select value={nilaiForm.predikat} onValueChange={(v) => setNilaiForm((f) => ({ ...f, predikat: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{PREDIKAT_OPTIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Nilai Total (0–100) *</Label>
              <Input type="number" min={0} max={100} step={0.01} value={nilaiForm.nilaiTotal}
                onChange={(e) => setNilaiForm((f) => ({ ...f, nilaiTotal: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div className="space-y-2">
              <Label>Catatan (opsional)</Label>
              <Textarea placeholder="Catatan evaluasi..." value={nilaiForm.catatan}
                onChange={(e) => setNilaiForm((f) => ({ ...f, catatan: e.target.value }))} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNilaiDialogOpen(false)} disabled={nilaiLoading}>Batal</Button>
            <Button onClick={handleSaveNilai} disabled={nilaiLoading}>
              {nilaiLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  );
}
