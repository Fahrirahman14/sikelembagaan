"use client";

import { AppSidebar } from "@/components/app-sidebar";
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
    DialogTrigger,
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
import { Textarea } from "@/components/ui/textarea";
import { api, type DokumenSAKIP, type OPD } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    AlertCircle,
    Award,
    CheckCircle,
    Edit,
    FileText,
    Link as LinkIcon,
    Search,
    ShieldCheck,
    Sparkles,
    Trash2,
    Upload,
} from "lucide-react";
import { useEffect, useState } from "react";



interface ReviewScore {
  id: string;
  dokumentId: string;
  nilaiReview: number;
  catatan: string;
  reviewedBy: string;
  reviewedAt: string;
}

function getReviewTone(score?: number) {
  if (typeof score !== "number") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (score >= 85) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (score >= 70) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-red-200 bg-red-50 text-red-700";
}

export default function AdminSAKIPPage() {
  const [search, setSearch] = useState("");
  const [opdFilter, setOpdFilter] = useState("all");
  const [jenisFilter, setJenisFilter] = useState("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DokumenSAKIP | null>(null);
  
  // Form states
  const [uploadForm, setUploadForm] = useState<{
    opdId: string;
    namaDokumen: string;
    jenisDokumen: "renstra" | "renja" | "lakip" | "iku" | "tapkin" | "lainnya";
    linkDokumen: string;
    filePath: string;
    tahun: number;
  }>({
    opdId: "",
    namaDokumen: "",
    jenisDokumen: "renstra",
    linkDokumen: "",
    filePath: "",
    tahun: new Date().getFullYear(),
  });

  const [reviewForm, setReviewForm] = useState({
    nilaiReview: 0,
    catatan: "",
  });

  const [opdList, setOpdList] = useState<OPD[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<DokumenSAKIP[]>([]);
  const [reviewScores, setReviewScores] = useState<ReviewScore[]>([]);

  useEffect(() => {
    api.opd.list().then(setOpdList);
    api.dokumenSakip.list().then(setUploadedDocuments);
  }, []);

  const filteredDocuments = uploadedDocuments.filter((doc) => {
    const matchSearch =
      doc.nama_dokumen.toLowerCase().includes(search.toLowerCase()) ||
      (doc.opd_nama ?? "").toLowerCase().includes(search.toLowerCase());
    const matchOpd = opdFilter === "all" || doc.opd_id === opdFilter;
    const matchJenis = jenisFilter === "all" || doc.jenis_dokumen === jenisFilter;
    return matchSearch && matchOpd && matchJenis;
  });

  const handleUploadSubmit = async () => {
    if (!uploadForm.opdId || !uploadForm.namaDokumen) {
      alert("Mohon isi semua field yang diperlukan");
      return;
    }
    await api.dokumenSakip.create({
      opd_id: uploadForm.opdId,
      nama_dokumen: uploadForm.namaDokumen,
      jenis_dokumen: uploadForm.jenisDokumen,
      tahun: uploadForm.tahun,
      file_path: uploadForm.linkDokumen || uploadForm.filePath || "",
      uploaded_by: "Admin",
    });
    const updated = await api.dokumenSakip.list();
    setUploadedDocuments(updated);
    setUploadForm({
      opdId: "",
      namaDokumen: "",
      jenisDokumen: "renstra",
      linkDokumen: "",
      filePath: "",
      tahun: new Date().getFullYear(),
    });
    setUploadDialogOpen(false);
  };

  const handleReviewSubmit = () => {
    if (!selectedDocument || reviewForm.nilaiReview < 0 || reviewForm.nilaiReview > 100) {
      alert("Nilai harus antara 0-100");
      return;
    }

    const newReview: ReviewScore = {
      id: `REV${Date.now()}`,
      dokumentId: selectedDocument.id,
      nilaiReview: reviewForm.nilaiReview,
      catatan: reviewForm.catatan,
      reviewedBy: "Admin",
      reviewedAt: new Date().toISOString().split("T")[0],
    };

    setReviewScores([...reviewScores, newReview]);
    setReviewForm({ nilaiReview: 0, catatan: "" });
    setReviewDialogOpen(false);
    setSelectedDocument(null);
  };

  const handleDeleteDocument = async (id: string) => {
    await api.dokumenSakip.delete(id);
    setUploadedDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const getReviewForDocument = (docId: string) => {
    return reviewScores.find((rev) => rev.dokumentId === docId);
  };

  const stats = {
    totalDokumen: uploadedDocuments.length,
    sudahDireview: reviewScores.length,
    belumDireview: uploadedDocuments.length - reviewScores.length,
  };
  const avgReview = reviewScores.length
    ? reviewScores.reduce((total, item) => total + item.nilaiReview, 0) / reviewScores.length
    : 0;
  const latestDocument = [...uploadedDocuments].sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
  const activeFilters = [
    search ? `Pencarian: ${search}` : null,
    opdFilter !== "all"
      ? `OPD: ${opdList.find((opd) => opd.id === opdFilter)?.nama ?? opdFilter}`
      : null,
    jenisFilter !== "all" ? `Jenis: ${jenisFilter.toUpperCase()}` : null,
  ].filter((value): value is string => Boolean(value));

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(39,81,191,0.1),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(232,183,35,0.16),transparent_20%)] lg:pl-72">
        <div className="absolute left-0 top-10 -z-10 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <div className="p-6 lg:p-8">
          <section className="mb-8 overflow-hidden rounded-4xl border border-white/60 bg-card/85 p-6 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr] lg:items-center">
              <div className="space-y-6 animate-in fade-in-0 slide-in-from-top-4 duration-700">
                <Badge className="inline-flex rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Manajemen dokumen dan review SAKIP
                </Badge>

                <div className="space-y-4">
                  <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    Kelola dokumen, review, dan progres SAKIP dari workspace admin yang lebih rapi.
                  </h1>
                  <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                    Halaman ini memusatkan unggahan dokumen, penilaian review, dan penyaringan data supaya tim bisa bekerja lebih cepat tanpa kehilangan konteks.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 animate-in fade-in-0 slide-in-from-right-6 duration-700">
                <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        Nilai review rata-rata
                      </p>
                      <p className="mt-3 text-3xl font-semibold text-foreground">
                        {avgReview ? avgReview.toFixed(1) : "0.0"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <Award className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        Dokumen terbaru
                      </p>
                      <p className="mt-3 font-semibold text-foreground">
                        {latestDocument?.nama_dokumen ?? "Belum ada dokumen"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {latestDocument?.opd_nama ?? "-"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-accent p-3 text-accent-foreground">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Capaian SAKIP</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Kelola dokumen dan nilai review SAKIP dengan tampilan kerja yang lebih nyaman.
              </p>
            </div>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 rounded-xl shadow-lg shadow-primary/15">
                  <Upload className="h-4 w-4" />
                  Upload Dokumen SAKIP
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Upload Dokumen SAKIP</DialogTitle>
                  <DialogDescription>
                    Upload dokumen SAKIP atau link eksternal ke file SAKIP
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="opd">Organisasi Perangkat Daerah (OPD) *</Label>
                    <Select value={uploadForm.opdId} onValueChange={(value) => setUploadForm({ ...uploadForm, opdId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih OPD" />
                      </SelectTrigger>
                      <SelectContent>
                        {opdList.map((opd) => (
                          <SelectItem key={opd.id} value={opd.id}>
                            {opd.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nama-dokumen">Nama Dokumen *</Label>
                    <Input
                      id="nama-dokumen"
                      placeholder="Contoh: Renstra 2024-2028"
                      value={uploadForm.namaDokumen}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, namaDokumen: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jenis">Jenis Dokumen *</Label>
                      <Select
                        value={uploadForm.jenisDokumen}
                        onValueChange={(value) =>
                          setUploadForm({
                            ...uploadForm,
                            jenisDokumen: value as "renstra" | "renja" | "lakip" | "iku" | "tapkin" | "lainnya",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="renstra">Renstra</SelectItem>
                          <SelectItem value="renja">Renja</SelectItem>
                          <SelectItem value="lakip">LAKIP</SelectItem>
                          <SelectItem value="iku">IKU</SelectItem>
                          <SelectItem value="tapkin">Tapkin</SelectItem>
                          <SelectItem value="lainnya">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tahun">Tahun *</Label>
                      <Input
                        id="tahun"
                        type="number"
                        value={uploadForm.tahun}
                        onChange={(e) =>
                          setUploadForm({ ...uploadForm, tahun: parseInt(e.target.value) })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="link">Link Eksternal (Opsional)</Label>
                    <Input
                      id="link"
                      placeholder="https://..."
                      value={uploadForm.linkDokumen}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, linkDokumen: e.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Jika dokumen sudah tersimpan di website lain
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file">Upload File (Opsional)</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,.doc,.docx,.xlsx"
                      onChange={(e) => {
                        // In a real app, this would handle file upload
                        if (e.target.files?.[0]) {
                          setUploadForm({
                            ...uploadForm,
                            filePath: `/uploads/${e.target.files[0].name}`,
                          });
                        }
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Format: PDF, DOC, DOCX, XLSX. Max 10MB
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleUploadSubmit}>Upload</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary">
                  <FileText className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalDokumen}</p>
                  <p className="text-sm text-muted-foreground">Total Dokumen</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.sudahDireview}</p>
                  <p className="text-sm text-muted-foreground">Sudah Direview</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-500">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.belumDireview}</p>
                  <p className="text-sm text-muted-foreground">Belum Direview</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent">
                  <ShieldCheck className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{avgReview ? avgReview.toFixed(1) : "0.0"}</p>
                  <p className="text-sm text-muted-foreground">Rata-rata Review</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6 border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardContent className="pt-6">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Panel filter
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {filteredDocuments.length} dokumen tampil dari {uploadedDocuments.length} total data.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.length > 0 ? (
                    activeFilters.map((filter) => (
                      <Badge
                        key={filter}
                        className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-primary"
                      >
                        {filter}
                      </Badge>
                    ))
                  ) : (
                    <Badge className="rounded-full border border-border/80 bg-background/80 px-3 py-1 text-muted-foreground">
                      Semua data aktif
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Cari dokumen..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-11 rounded-xl border-border/70 bg-background/80 pl-10"
                    />
                  </div>
                </div>
                <Select value={opdFilter} onValueChange={setOpdFilter}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-border/70 bg-background/80 sm:w-48">
                    <SelectValue placeholder="Filter OPD" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua OPD</SelectItem>
                    {opdList.map((opd) => (
                      <SelectItem key={opd.id} value={opd.id}>
                        {opd.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={jenisFilter} onValueChange={setJenisFilter}>
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
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  className="h-11 rounded-xl border-border/70"
                  onClick={() => {
                    setSearch("");
                    setOpdFilter("all");
                    setJenisFilter("all");
                  }}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardHeader className="border-b border-border/70">
              <CardTitle className="text-lg">Daftar Dokumen SAKIP</CardTitle>
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
                      <TableHead>Nilai Review</TableHead>
                      <TableHead>Upload Oleh</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                          Tidak ada dokumen ditemukan
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDocuments.map((doc) => {
                        const review = getReviewForDocument(doc.id);
                        return (
                          <TableRow key={doc.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium text-foreground">{doc.nama_dokumen}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(doc.created_at).toLocaleDateString("id-ID")}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{doc.opd_nama}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{doc.jenis_dokumen.toUpperCase()}</Badge>
                            </TableCell>
                            <TableCell className="text-center">{doc.tahun}</TableCell>
                            <TableCell>
                              {review ? (
                                <Badge className={cn("rounded-full border px-3 py-1", getReviewTone(review.nilaiReview))}>
                                  {review.nilaiReview}
                                </Badge>
                              ) : (
                                <Badge className={cn("rounded-full border px-3 py-1", getReviewTone())}>
                                  Belum Review
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {doc.uploaded_by}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                {doc.file_path && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    asChild
                                    title="Buka link dokumen"
                                  >
                                    <a
                                      href={doc.file_path}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <LinkIcon className="h-4 w-4" />
                                    </a>
                                  </Button>
                                )}
                                <Dialog open={reviewDialogOpen && selectedDocument?.id === doc.id} onOpenChange={(open) => {
                                  if (open) {
                                    setSelectedDocument(doc);
                                  }
                                  setReviewDialogOpen(open);
                                }}>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        setSelectedDocument(doc);
                                        setReviewDialogOpen(true);
                                      }}
                                      title="Review dokumen"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                  onClick={() => handleDeleteDocument(doc.id)}
                                  title="Hapus dokumen"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Dokumen SAKIP</DialogTitle>
            <DialogDescription>
              {selectedDocument?.opd_nama} - {selectedDocument?.nama_dokumen}
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4 py-4">
              <div className="rounded-2xl border border-border/70 bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Dokumen</p>
                <p className="font-medium text-foreground">{selectedDocument.nama_dokumen}</p>
                <div className="mt-2 grid gap-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">OPD:</span>{" "}
                    <span className="font-medium">{selectedDocument.opd_nama}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Jenis:</span>{" "}
                    <span className="font-medium">{selectedDocument.jenis_dokumen.toUpperCase()}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Tahun:</span>{" "}
                    <span className="font-medium">{selectedDocument.tahun}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nilai">Nilai Review (0-100) *</Label>
                <Input
                  id="nilai"
                  type="number"
                  min="0"
                  max="100"
                  value={reviewForm.nilaiReview}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, nilaiReview: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="catatan">Catatan Review</Label>
                <Textarea
                  id="catatan"
                  placeholder="Masukkan catatan atau feedback..."
                  value={reviewForm.catatan}
                  onChange={(e) => setReviewForm({ ...reviewForm, catatan: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setReviewDialogOpen(false);
                setSelectedDocument(null);
                setReviewForm({ nilaiReview: 0, catatan: "" });
              }}
            >
              Batal
            </Button>
            <Button onClick={handleReviewSubmit}>Simpan Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
