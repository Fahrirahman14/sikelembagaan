"use client";

import { useState } from "react";
import {
  Pencil,
  Trash2,
  Search,
  Filter,
  MoreHorizontal,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Aktivitas, daftarOPD } from "@/lib/abk-data";

interface AktivitasTableProps {
  data: Aktivitas[];
  onEdit?: (aktivitas: Aktivitas) => void;
  onDelete?: (id: string) => void;
}

export function AktivitasTable({ data, onEdit, onDelete }: AktivitasTableProps) {
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState<string>("all");
  const [filterFrekuensi, setFilterFrekuensi] = useState<string>("all");

  const filteredData = data.filter((item) => {
    const matchSearch =
      item.namaJabatan.toLowerCase().includes(search.toLowerCase()) ||
      item.uraianTugas.toLowerCase().includes(search.toLowerCase());
    const matchKategori =
      filterKategori === "all" || item.kategori === filterKategori;
    const matchFrekuensi =
      filterFrekuensi === "all" || item.frekuensi === filterFrekuensi;
    return matchSearch && matchKategori && matchFrekuensi;
  });

  const getKategoriBadge = (kategori: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      utama: "default",
      tambahan: "secondary",
      lainnya: "outline",
    };
    return (
      <Badge variant={variants[kategori] || "outline"} className="capitalize">
        {kategori}
      </Badge>
    );
  };

  const getFrekuensiBadge = (frekuensi: string) => {
    return (
      <Badge variant="outline" className="capitalize">
        {frekuensi}
      </Badge>
    );
  };

  // Hitung waktu per tahun
  const hitungWaktuTahunan = (aktivitas: Aktivitas) => {
    const multiplier = {
      harian: 250, // hari kerja per tahun
      mingguan: 52,
      bulanan: 12,
      tahunan: 1,
    };
    return (
      (aktivitas.normaWaktu *
        aktivitas.targetKuantitas *
        multiplier[aktivitas.frekuensi]) /
      60
    ); // konversi ke jam
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari jabatan atau aktivitas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterKategori} onValueChange={setFilterKategori}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="utama">Utama</SelectItem>
              <SelectItem value="tambahan">Tambahan</SelectItem>
              <SelectItem value="lainnya">Lainnya</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterFrekuensi} onValueChange={setFilterFrekuensi}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Frekuensi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Frekuensi</SelectItem>
              <SelectItem value="harian">Harian</SelectItem>
              <SelectItem value="mingguan">Mingguan</SelectItem>
              <SelectItem value="bulanan">Bulanan</SelectItem>
              <SelectItem value="tahunan">Tahunan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Jabatan
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="min-w-[200px]">Uraian Tugas</TableHead>
              <TableHead className="text-center">Satuan</TableHead>
              <TableHead className="text-center">Norma Waktu</TableHead>
              <TableHead className="text-center">Target</TableHead>
              <TableHead className="text-center">Frekuensi</TableHead>
              <TableHead className="text-center">Kategori</TableHead>
              <TableHead className="text-right">Jam/Tahun</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  <p className="text-muted-foreground">
                    Tidak ada data aktivitas
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {item.namaJabatan}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.uraianTugas}
                  </TableCell>
                  <TableCell className="text-center">{item.satuan}</TableCell>
                  <TableCell className="text-center">
                    {item.normaWaktu} menit
                  </TableCell>
                  <TableCell className="text-center">
                    {item.targetKuantitas}
                  </TableCell>
                  <TableCell className="text-center">
                    {getFrekuensiBadge(item.frekuensi)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getKategoriBadge(item.kategori)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {hitungWaktuTahunan(item).toLocaleString("id-ID", {
                      maximumFractionDigits: 1,
                    })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(item)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete?.(item.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
        <p className="text-sm text-muted-foreground">
          Menampilkan {filteredData.length} dari {data.length} aktivitas
        </p>
        <p className="text-sm font-medium">
          Total Jam/Tahun:{" "}
          <span className="text-primary">
            {filteredData
              .reduce((sum, item) => sum + hitungWaktuTahunan(item), 0)
              .toLocaleString("id-ID", { maximumFractionDigits: 1 })}{" "}
            jam
          </span>
        </p>
      </div>
    </div>
  );
}
