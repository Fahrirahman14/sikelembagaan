"use client";

import { AdminPageHeader } from "@/components/admin-page-header";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { daftarOPD, dokumenAnjabList, type DokumenAnjab } from "@/lib/abk-data";
import {
    AlertCircle,
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    Edit,
    Eye,
    FileText,
    FileWarning,
    Filter,
    Plus,
    Printer,
    Search,
    Send,
    Trash2,
    User,
} from "lucide-react";
import { useState } from "react";

function StatusBadge({ status }: { status: DokumenAnjab["status"] }) {
  const variants = {
    draft: { icon: FileWarning, className: "bg-muted text-muted-foreground border-muted", label: "Draft" },
    review: { icon: Clock, className: "bg-accent/30 text-accent-foreground border-accent/40", label: "Review" },
    revisi: { icon: AlertCircle, className: "bg-orange-100 text-orange-700 border-orange-200", label: "Revisi" },
    disetujui: { icon: CheckCircle, className: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Disetujui" },
  };
  const { icon: Icon, className, label } = variants[status];
  return (
    <Badge variant="outline" className={className}>
      <Icon className="mr-1 h-3 w-3" />
      {label}
    </Badge>
  );
}

export default function DokumenAnjabPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDokumen, setSelectedDokumen] = useState<DokumenAnjab | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const filteredData = dokumenAnjabList.filter((doc) => {
    const matchSearch =
      doc.namaOpd.toLowerCase().includes(search.toLowerCase()) ||
      doc.nomorDokumen.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || doc.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: dokumenAnjabList.length,
    draft: dokumenAnjabList.filter((d) => d.status === "draft").length,
    review: dokumenAnjabList.filter((d) => d.status === "review").length,
    disetujui: dokumenAnjabList.filter((d) => d.status === "disetujui").length,
  };

  const openDetail = (doc: DokumenAnjab) => {
    setSelectedDokumen(doc);
    setDetailOpen(true);
  };
  const activeFilters = [
    search ? `Pencarian: ${search}` : null,
    statusFilter !== "all" ? `Status: ${statusFilter}` : null,
  ].filter((value): value is string => Boolean(value));

  return (
    <AdminPageShell>
      <AdminPageHeader
        icon={FileText}
        eyebrow="Dokumen analisis jabatan"
        title="Kelola siklus dokumen Anjab dengan tampilan yang lebih modern dan terarah."
        description="Area dokumen sekarang memakai shell admin baru, lengkap dengan status yang lebih mudah dipindai, filter yang lebih nyaman, dan aksi pembuatan dokumen yang lebih menonjol."
        actions={
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
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih OPD" />
                    </SelectTrigger>
                    <SelectContent>
                      {daftarOPD.map((opd) => (
                        <SelectItem key={opd.id} value={opd.id}>
                          {opd.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Periode</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih periode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nomor Dokumen</Label>
                  <Input placeholder="DOK/ANJAB/XXX/2024" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Batal</Button>
                <Button onClick={() => setCreateOpen(false)}>Buat Dokumen</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
        aside={
          <>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Total dokumen
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{stats.total}</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Siap disahkan
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{stats.review + stats.disetujui}</p>
            </div>
          </>
        }
      />

          {/* Stats */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Dokumen</p>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-muted p-3">
                    <FileWarning className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Draft</p>
                    <p className="text-2xl font-bold text-foreground">{stats.draft}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-accent/30 p-3">
                    <Clock className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Review</p>
                    <p className="text-2xl font-bold text-foreground">{stats.review}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-emerald-100 p-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Disetujui</p>
                    <p className="text-2xl font-bold text-foreground">{stats.disetujui}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardHeader className="border-b border-border/70">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg">Daftar Dokumen</CardTitle>
                  <div className="mt-2 flex flex-wrap gap-2">
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
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-11 rounded-xl border-border/70 bg-background/80 pl-9 sm:w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                    {filteredData.map((doc) => (
                      <TableRow key={doc.id} className="cursor-pointer border-border/60 hover:bg-background/80" onClick={() => openDetail(doc)}>
                        <TableCell className="font-mono text-sm">{doc.nomorDokumen}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">{doc.namaOpd}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{doc.periode}</TableCell>
                        <TableCell className="text-center font-medium">{doc.jumlahJabatan}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(doc.tanggalDibuat).toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={doc.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openDetail(doc); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={(e) => e.stopPropagation()}>
                              <Trash2 className="h-4 w-4" />
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

          {/* Detail Dialog */}
          <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Detail Dokumen Anjab
                </DialogTitle>
              </DialogHeader>
              {selectedDokumen && (
                <div className="space-y-6 py-4">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <StatusBadge status={selectedDokumen.status} />
                    <span className="text-sm text-muted-foreground">ID: {selectedDokumen.id}</span>
                  </div>

                  <Separator />

                  {/* Info Grid */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <FileText className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Nomor Dokumen</p>
                        <p className="font-semibold">{selectedDokumen.nomorDokumen}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Building2 className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">OPD</p>
                        <p className="font-semibold">{selectedDokumen.namaOpd}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Tanggal Dibuat</p>
                        <p className="font-semibold">
                          {new Date(selectedDokumen.tanggalDibuat).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Periode</p>
                        <p className="font-semibold">{selectedDokumen.periode}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Pembuat</p>
                        <p className="font-semibold">{selectedDokumen.pembuat}</p>
                      </div>
                    </div>
                    {selectedDokumen.penyetuju && (
                      <div className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 text-emerald-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Disetujui oleh</p>
                          <p className="font-semibold">{selectedDokumen.penyetuju}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Summary */}
                  <div className="rounded-lg bg-muted/30 p-4">
                    <h4 className="mb-3 font-semibold text-foreground">Ringkasan</h4>
                    <div className="flex items-center justify-center gap-8">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-primary">{selectedDokumen.jumlahJabatan}</p>
                        <p className="text-sm text-muted-foreground">Total Jabatan</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Printer className="h-4 w-4" />
                      Cetak
                    </Button>
                    {selectedDokumen.status === "draft" && (
                      <Button className="gap-2">
                        <Send className="h-4 w-4" />
                        Ajukan Review
                      </Button>
                    )}
                    {selectedDokumen.status === "review" && (
                      <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
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
