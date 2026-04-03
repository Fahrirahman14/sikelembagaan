"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, MoreHorizontal, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

type OpdData = {
  id: number;
  nama: string;
  jenis: string;
  pejabat: string;
  jumlahPegawai: number;
  statusAnjab: "Selesai" | "Proses" | "Belum";
  statusAbk: "Selesai" | "Proses" | "Belum";
};

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, "default" | "secondary" | "outline"> = {
    Selesai: "default",
    Proses: "secondary",
    Belum: "outline",
  };

  return (
    <Badge
      variant={variants[status] || "outline"}
      className={
        status === "Selesai"
          ? "bg-green-100 text-green-800 hover:bg-green-100"
          : status === "Proses"
            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
      }
    >
      {status}
    </Badge>
  );
}

export function OPDTable() {
  const [opdData, setOpdData] = useState<OpdData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // TODO: Ganti dengan endpoint API Anda, contoh:
      // const response = await fetch('/api/opd');
      // const apiData = await response.json();
      // setOpdData(apiData);

      // Simulasi pemanggilan API dengan mock data
      const mockApiData: OpdData[] = [
        { id: 1, nama: "Dinas Pendidikan", jenis: "Dinas", pejabat: "Dr. Ahmad Suryadi, M.Pd", jumlahPegawai: 245, statusAnjab: "Selesai", statusAbk: "Selesai" },
        { id: 2, nama: "Dinas Kesehatan", jenis: "Dinas", pejabat: "dr. Siti Rahayu, Sp.PD", jumlahPegawai: 312, statusAnjab: "Selesai", statusAbk: "Proses" },
        { id: 3, nama: "Badan Kepegawaian Daerah", jenis: "Badan", pejabat: "Ir. Budi Santoso, MM", jumlahPegawai: 78, statusAnjab: "Proses", statusAbk: "Belum" },
        { id: 4, nama: "Dinas Pekerjaan Umum", jenis: "Dinas", pejabat: "Ir. Hendra Wijaya, MT", jumlahPegawai: 189, statusAnjab: "Selesai", statusAbk: "Selesai" },
        { id: 5, nama: "Sekretariat Daerah", jenis: "Sekretariat", pejabat: "Drs. Agus Prasetyo, M.Si", jumlahPegawai: 156, statusAnjab: "Selesai", statusAbk: "Proses" },
      ];

      // Simulasi network delay
      setTimeout(() => {
        setOpdData(mockApiData);
      }, 500);
    };

    fetchData();
  }, []);
  return (
    <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
      <CardHeader className="border-b border-border/70">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Daftar OPD</CardTitle>
            <CardDescription>
              Data Organisasi Perangkat Daerah dan status kelengkapan dokumen
            </CardDescription>
          </div> 
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama OPD</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead className="hidden md:table-cell">Kepala</TableHead>
                <TableHead className="hidden sm:table-cell">Pegawai</TableHead>
                <TableHead>Anjab</TableHead>
                <TableHead>ABK</TableHead>
                <TableHead className="w-12.5"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opdData.map((opd) => (
                <TableRow
                  key={opd.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <TableCell className="font-medium">{opd.nama}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-full">
                      {opd.jenis}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {opd.pejabat}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {opd.jumlahPegawai}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={opd.statusAnjab} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={opd.statusAbk} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
