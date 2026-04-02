"use client";

import { useState } from "react";
import {
  FileText,
  Search,
  Download,
  Eye,
  Printer,
  Calendar,
  CheckCircle2,
  Clock,
  FileEdit,
  Building2,
  Users,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LaporanABK, dummyLaporan } from "@/lib/abk-data";

export function LaporanABKComponent() {
  const [data] = useState<LaporanABK[]>(dummyLaporan);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedLaporan, setSelectedLaporan] = useState<LaporanABK | null>(null);

  const filteredData = data.filter((item) => {
    const matchSearch = item.namaOpd.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Statistik
  const totalLaporan = data.length;
  const laporanDisetujui = data.filter((d) => d.status === "disetujui").length;
  const laporanFinal = data.filter((d) => d.status === "final").length;
  const avgEfisiensi =
    data.reduce((sum, item) => sum + item.efisiensi, 0) / data.length;

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "outline"; icon: React.ReactNode; label: string }> = {
      draft: {
        variant: "outline",
        icon: <FileEdit className="mr-1 h-3 w-3" />,
        label: "Draft",
      },
      final: {
        variant: "secondary",
        icon: <Clock className="mr-1 h-3 w-3" />,
        label: "Final",
      },
      disetujui: {
        variant: "default",
        icon: <CheckCircle2 className="mr-1 h-3 w-3" />,
        label: "Disetujui",
      },
    };
    const { variant, icon, label } = config[status] || config.draft;
    return (
      <Badge variant={variant} className="flex items-center">
        {icon}
        {label}
      </Badge>
    );
  };

  const getEfisiensiColor = (efisiensi: number) => {
    if (efisiensi < 85) return "text-destructive";
    if (efisiensi > 105) return "text-yellow-600";
    return "text-green-600";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Laporan
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLaporan}</div>
            <p className="text-xs text-muted-foreground">Periode 2024</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Disetujui
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {laporanDisetujui}
            </div>
            <Progress
              value={(laporanDisetujui / totalLaporan) * 100}
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Menunggu Persetujuan
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {laporanFinal}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalLaporan - laporanDisetujui - laporanFinal} masih draft
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rata-rata Efisiensi
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getEfisiensiColor(avgEfisiensi)}`}>
              {avgEfisiensi.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Target: 85-105%</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari OPD..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="final">Final</SelectItem>
              <SelectItem value="disetujui">Disetujui</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            Buat Laporan Baru
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
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
                  <p className="text-muted-foreground">Tidak ada data laporan</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => (
                <TableRow key={item.opdId}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{item.namaOpd}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{item.periode}</TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {formatDate(item.tanggalDibuat)}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.totalJabatan}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {item.totalKebutuhanPegawai}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.totalPegawaiExisting}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`font-semibold ${getEfisiensiColor(item.efisiensi)}`}>
                      {item.efisiensi.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(item.status)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedLaporan(item)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="mr-2 h-4 w-4" />
                          Cetak
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {item.status === "draft" && (
                          <DropdownMenuItem>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Finalisasi
                          </DropdownMenuItem>
                        )}
                        {item.status === "final" && (
                          <DropdownMenuItem className="text-green-600">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Setujui
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedLaporan} onOpenChange={() => setSelectedLaporan(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Laporan ABK - {selectedLaporan?.namaOpd}
            </DialogTitle>
            <DialogDescription>
              Periode {selectedLaporan?.periode} | Dibuat: {selectedLaporan && formatDate(selectedLaporan.tanggalDibuat)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedLaporan && (
            <div className="space-y-6 py-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status Laporan</span>
                {getStatusBadge(selectedLaporan.status)}
              </div>

              {/* Summary Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Jabatan</p>
                      <p className="text-xl font-bold">{selectedLaporan.totalJabatan}</p>
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

              {/* Pegawai Comparison */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Perbandingan Kebutuhan vs Existing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Kebutuhan Pegawai</span>
                    <span className="font-semibold">{selectedLaporan.totalKebutuhanPegawai}</span>
                  </div>
                  <Progress 
                    value={100} 
                    className="h-3" 
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pegawai Existing</span>
                    <span className="font-semibold">{selectedLaporan.totalPegawaiExisting}</span>
                  </div>
                  <Progress 
                    value={(selectedLaporan.totalPegawaiExisting / selectedLaporan.totalKebutuhanPegawai) * 100} 
                    className="h-3" 
                  />
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-sm font-medium">Selisih</span>
                    <span className={`font-bold ${
                      selectedLaporan.totalPegawaiExisting - selectedLaporan.totalKebutuhanPegawai < 0
                        ? "text-destructive"
                        : "text-green-600"
                    }`}>
                      {selectedLaporan.totalPegawaiExisting - selectedLaporan.totalKebutuhanPegawai > 0 ? "+" : ""}
                      {selectedLaporan.totalPegawaiExisting - selectedLaporan.totalKebutuhanPegawai} orang
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" className="gap-2">
                  <Printer className="h-4 w-4" />
                  Cetak
                </Button>
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
