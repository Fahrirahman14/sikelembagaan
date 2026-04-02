"use client";

import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminPageShell } from "@/components/admin-page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
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
import { opdDetailList, type OPDDetail } from "@/lib/abk-data";
import {
    Building2,
    Clock,
    Edit,
    Eye,
    FileCheck,
    FileX,
    Filter,
    Plus,
    Search,
    Trash2
} from "lucide-react";
import { useState } from "react";

function StatusBadge({ status }: { status: "belum" | "proses" | "selesai" }) {
  const variants = {
    belum: { icon: FileX, className: "bg-destructive/10 text-destructive border-destructive/20" },
    proses: { icon: Clock, className: "bg-accent/30 text-accent-foreground border-accent/40" },
    selesai: { icon: FileCheck, className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  };
  const { icon: Icon, className } = variants[status];
  return (
    <Badge variant="outline" className={className}>
      <Icon className="mr-1 h-3 w-3" />
      {status === "belum" ? "Belum" : status === "proses" ? "Proses" : "Selesai"}
    </Badge>
  );
}

export default function DaftarOPDPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOpd, setSelectedOpd] = useState<OPDDetail | null>(null);

  const filteredData = opdDetailList.filter((opd) => {
    const matchSearch =
      opd.nama.toLowerCase().includes(search.toLowerCase()) ||
      opd.kode.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" ||
      opd.statusAnjab === statusFilter ||
      opd.statusAbk === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: opdDetailList.length,
    anjabSelesai: opdDetailList.filter((o) => o.statusAnjab === "selesai").length,
    abkSelesai: opdDetailList.filter((o) => o.statusAbk === "selesai").length,
    totalPegawai: opdDetailList.reduce((sum, o) => sum + o.totalPegawai, 0),
  };
  const activeFilters = [
    search ? `Pencarian: ${search}` : null,
    statusFilter !== "all" ? `Status: ${statusFilter}` : null,
  ].filter((value): value is string => Boolean(value));

  return (
    <AdminPageShell>
      <AdminPageHeader
        icon={Building2}
        eyebrow="Manajemen data OPD"
        title="Kelola organisasi perangkat daerah dalam tampilan yang lebih rapi dan mudah dipindai."
        description="Halaman daftar OPD kini mengikuti gaya admin baru, dengan ringkasan yang lebih jelas, filter yang lebih nyaman, dan area tabel yang terasa lebih modern."
        actions={
          <Button className="gap-2 rounded-xl shadow-lg shadow-primary/15">
            <Plus className="h-4 w-4" />
            Tambah OPD
          </Button>
        }
        aside={
          <>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                OPD aktif
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{stats.total}</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Pegawai terdata
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{stats.totalPegawai}</p>
            </div>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total OPD</p>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-emerald-100 p-3">
                    <FileCheck className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Anjab Selesai</p>
                    <p className="text-2xl font-bold text-foreground">{stats.anjabSelesai}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-accent/30 p-3">
                    <FileCheck className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ABK Selesai</p>
                    <p className="text-2xl font-bold text-foreground">{stats.abkSelesai}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pegawai</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalPegawai}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardHeader className="border-b border-border/70">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg">Data OPD</CardTitle>
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
                        Semua OPD aktif
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Cari OPD..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-11 rounded-xl border-border/70 bg-background/80 pl-9 sm:w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-11 w-full rounded-xl border-border/70 bg-background/80 sm:w-40">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="selesai">Selesai</SelectItem>
                      <SelectItem value="proses">Proses</SelectItem>
                      <SelectItem value="belum">Belum</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    className="h-11 rounded-xl border-border/70"
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("all");
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kode</TableHead>
                      <TableHead>Nama OPD</TableHead>
                      <TableHead>Kepala</TableHead>
                      <TableHead className="text-center">Pegawai</TableHead>
                      <TableHead className="text-center">Jabatan</TableHead>
                      <TableHead className="text-center">Anjab</TableHead>
                      <TableHead className="text-center">ABK</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((opd) => (
                      <TableRow key={opd.id} className="transition-colors hover:bg-muted/30">
                        <TableCell className="font-mono text-sm">{opd.kode}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{opd.nama}</p>
                            <p className="text-xs text-muted-foreground">{opd.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm text-foreground">{opd.kepala}</p>
                            <p className="text-xs text-muted-foreground">NIP: {opd.nipKepala}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium">{opd.totalPegawai}</TableCell>
                        <TableCell className="text-center font-medium">{opd.totalJabatan}</TableCell>
                        <TableCell className="text-center">
                          <StatusBadge status={opd.statusAnjab} />
                        </TableCell>
                        <TableCell className="text-center">
                          <StatusBadge status={opd.statusAbk} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedOpd(opd)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Detail OPD</DialogTitle>
                                </DialogHeader>
                                {selectedOpd && (
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-muted-foreground">Kode OPD</Label>
                                        <p className="font-medium">{selectedOpd.kode}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Nama OPD</Label>
                                        <p className="font-medium">{selectedOpd.nama}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Alamat</Label>
                                        <p className="font-medium">{selectedOpd.alamat}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Telepon</Label>
                                        <p className="font-medium">{selectedOpd.telepon}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Email</Label>
                                        <p className="font-medium">{selectedOpd.email}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Kepala</Label>
                                        <p className="font-medium">{selectedOpd.kepala}</p>
                                        <p className="text-sm text-muted-foreground">NIP: {selectedOpd.nipKepala}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Total Pegawai</Label>
                                        <p className="font-medium">{selectedOpd.totalPegawai}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Total Jabatan</Label>
                                        <p className="font-medium">{selectedOpd.totalJabatan}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Status Anjab</Label>
                                        <div className="mt-1">
                                          <StatusBadge status={selectedOpd.statusAnjab} />
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Status ABK</Label>
                                        <div className="mt-1">
                                          <StatusBadge status={selectedOpd.statusAbk} />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
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
    </AdminPageShell>
  );
}
