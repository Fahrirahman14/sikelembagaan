"use client";

import { useState } from "react";
import {
  Calculator,
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Clock,
  BarChart3,
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
import { HasilPerhitungan, daftarOPD, dummyHasilPerhitungan } from "@/lib/abk-data";

export function PerhitunganABK() {
  const [data] = useState<HasilPerhitungan[]>(dummyHasilPerhitungan);
  const [search, setSearch] = useState("");
  const [filterOPD, setFilterOPD] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredData = data.filter((item) => {
    const matchSearch =
      item.namaJabatan.toLowerCase().includes(search.toLowerCase()) ||
      item.namaOpd.toLowerCase().includes(search.toLowerCase());
    const matchOPD = filterOPD === "all" || item.opdId === filterOPD;
    const matchStatus = filterStatus === "all" || item.keterangan === filterStatus;
    return matchSearch && matchOPD && matchStatus;
  });

  // Ringkasan statistik
  const totalKebutuhan = filteredData.reduce(
    (sum, item) => sum + item.kebutuhanPegawai,
    0
  );
  const totalExisting = filteredData.reduce(
    (sum, item) => sum + item.pegawaiExisting,
    0
  );
  const totalSelisih = filteredData.reduce((sum, item) => sum + item.selisih, 0);
  const avgBebanKerja =
    filteredData.length > 0
      ? filteredData.reduce((sum, item) => sum + item.bebanKerja, 0) /
        filteredData.length
      : 0;

  const getStatusBadge = (keterangan: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
      Kelebihan: {
        variant: "secondary",
        icon: <TrendingUp className="mr-1 h-3 w-3" />,
      },
      Kekurangan: {
        variant: "destructive",
        icon: <TrendingDown className="mr-1 h-3 w-3" />,
      },
      Sesuai: {
        variant: "default",
        icon: <Minus className="mr-1 h-3 w-3" />,
      },
    };
    const config = variants[keterangan] || variants.Sesuai;
    return (
      <Badge variant={config.variant} className="flex items-center">
        {config.icon}
        {keterangan}
      </Badge>
    );
  };

  const getBebanKerjaColor = (beban: number) => {
    if (beban < 0.8) return "text-yellow-600";
    if (beban > 1.2) return "text-red-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Kebutuhan Pegawai
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalKebutuhan}</div>
            <p className="text-xs text-muted-foreground">
              Dari {filteredData.length} jabatan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pegawai Existing
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExisting}</div>
            <Progress
              value={(totalExisting / totalKebutuhan) * 100}
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Selisih
            </CardTitle>
            {totalSelisih < 0 ? (
              <TrendingDown className="h-4 w-4 text-destructive" />
            ) : (
              <TrendingUp className="h-4 w-4 text-green-600" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalSelisih < 0 ? "text-destructive" : "text-green-600"
              }`}
            >
              {totalSelisih > 0 ? "+" : ""}
              {totalSelisih}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalSelisih < 0 ? "Kekurangan pegawai" : "Kelebihan pegawai"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rata-rata Beban Kerja
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getBebanKerjaColor(avgBebanKerja)}`}>
              {avgBebanKerja.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Standar: 1.0 (efisien)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari jabatan atau OPD..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={filterOPD} onValueChange={setFilterOPD}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Pilih OPD" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua OPD</SelectItem>
              {daftarOPD.map((opd) => (
                <SelectItem key={opd.id} value={opd.id}>
                  {opd.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Kekurangan">Kekurangan</SelectItem>
              <SelectItem value="Kelebihan">Kelebihan</SelectItem>
              <SelectItem value="Sesuai">Sesuai</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Calculator className="h-4 w-4" />
            Hitung Ulang
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead>OPD</TableHead>
              <TableHead className="text-center">Waktu Kerja (jam/th)</TableHead>
              <TableHead className="text-center">Beban Kerja</TableHead>
              <TableHead className="text-center">Kebutuhan</TableHead>
              <TableHead className="text-center">Existing</TableHead>
              <TableHead className="text-center">Selisih</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  <p className="text-muted-foreground">
                    Tidak ada data perhitungan
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => (
                <TableRow key={item.jabatanId}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {item.namaJabatan}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.namaOpd}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {item.totalWaktuKerja.toLocaleString("id-ID")}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`font-semibold ${getBebanKerjaColor(item.bebanKerja)}`}>
                      {item.bebanKerja.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {item.kebutuhanPegawai}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.pegawaiExisting}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`font-semibold ${
                        item.selisih < 0
                          ? "text-destructive"
                          : item.selisih > 0
                          ? "text-green-600"
                          : ""
                      }`}
                    >
                      {item.selisih > 0 ? "+" : ""}
                      {item.selisih}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(item.keterangan)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Formula Info */}
      <Card className="border-accent/50 bg-accent/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Rumus Perhitungan ABK</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Beban Kerja</strong> = Total Waktu Kerja / Waktu Kerja Efektif (1.250 jam/tahun)
          </p>
          <p>
            <strong>Kebutuhan Pegawai</strong> = Pembulatan ke atas dari Beban Kerja
          </p>
          <p>
            <strong>Selisih</strong> = Pegawai Existing - Kebutuhan Pegawai
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
