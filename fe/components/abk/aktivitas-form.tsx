"use client";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { api, type Jabatan, type OPD } from "@/lib/api";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface AktivitasFormProps {
  onSubmit: (data: AktivitasFormData) => void;
}

export interface AktivitasFormData {
  opdId: string;
  jabatanId: string;
  uraianTugas: string;
  satuan: string;
  normaWaktu: number;
  targetKuantitas: number;
  frekuensi: "harian" | "mingguan" | "bulanan" | "tahunan";
  kategori: "utama" | "tambahan" | "lainnya";
}

const satuanList = [
  "Dokumen",
  "Laporan",
  "Data",
  "Berkas",
  "Surat",
  "Kegiatan",
  "Rapat",
  "Orang",
  "Unit",
  "Paket",
];

export function AktivitasForm({ onSubmit }: AktivitasFormProps) {
  const [open, setOpen] = useState(false);
  const [selectedOPD, setSelectedOPD] = useState("");
  const [opdList, setOpdList] = useState<OPD[]>([]);
  const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);
  const [formData, setFormData] = useState<Partial<AktivitasFormData>>({
    frekuensi: "bulanan",
    kategori: "utama",
  });

  useEffect(() => {
    api.opd.list().then(setOpdList).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedOPD) { setJabatanList([]); return; }
    api.jabatan.list({ opd_id: selectedOPD }).then(setJabatanList).catch(() => {});
  }, [selectedOPD]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.opdId &&
      formData.jabatanId &&
      formData.uraianTugas &&
      formData.satuan &&
      formData.normaWaktu &&
      formData.targetKuantitas &&
      formData.frekuensi &&
      formData.kategori
    ) {
      onSubmit(formData as AktivitasFormData);
      setOpen(false);
      setFormData({ frekuensi: "bulanan", kategori: "utama" });
      setSelectedOPD("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Aktivitas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tambah Aktivitas Kerja</DialogTitle>
          <DialogDescription>
            Masukkan detail aktivitas kerja untuk perhitungan beban kerja
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="opd">OPD</Label>
              <Select
                value={selectedOPD}
                onValueChange={(value) => {
                  setSelectedOPD(value);
                  setFormData({ ...formData, opdId: value, jabatanId: "" });
                }}
              >
                <SelectTrigger id="opd">
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
              <Label htmlFor="jabatan">Jabatan</Label>
              <Select
                value={formData.jabatanId || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, jabatanId: value })
                }
                disabled={!selectedOPD}
              >
                <SelectTrigger id="jabatan">
                  <SelectValue placeholder="Pilih Jabatan" />
                </SelectTrigger>
                <SelectContent>
                  {jabatanList.map((jabatan) => (
                    <SelectItem key={jabatan.id} value={jabatan.id}>
                      {jabatan.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="uraian">Uraian Tugas/Aktivitas</Label>
            <Textarea
              id="uraian"
              placeholder="Jelaskan detail aktivitas kerja..."
              value={formData.uraianTugas || ""}
              onChange={(e) =>
                setFormData({ ...formData, uraianTugas: e.target.value })
              }
              className="min-h-[80px]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="satuan">Satuan Hasil</Label>
              <Select
                value={formData.satuan || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, satuan: value })
                }
              >
                <SelectTrigger id="satuan">
                  <SelectValue placeholder="Pilih Satuan" />
                </SelectTrigger>
                <SelectContent>
                  {satuanList.map((satuan) => (
                    <SelectItem key={satuan} value={satuan}>
                      {satuan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="norma">Norma Waktu (menit)</Label>
              <Input
                id="norma"
                type="number"
                placeholder="Waktu penyelesaian"
                min={1}
                value={formData.normaWaktu || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    normaWaktu: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="target">Target Kuantitas</Label>
              <Input
                id="target"
                type="number"
                placeholder="Jumlah target"
                min={1}
                value={formData.targetKuantitas || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetKuantitas: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frekuensi">Frekuensi</Label>
              <Select
                value={formData.frekuensi}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    frekuensi: value as AktivitasFormData["frekuensi"],
                  })
                }
              >
                <SelectTrigger id="frekuensi">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="harian">Harian</SelectItem>
                  <SelectItem value="mingguan">Mingguan</SelectItem>
                  <SelectItem value="bulanan">Bulanan</SelectItem>
                  <SelectItem value="tahunan">Tahunan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kategori">Kategori</Label>
              <Select
                value={formData.kategori}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    kategori: value as AktivitasFormData["kategori"],
                  })
                }
              >
                <SelectTrigger id="kategori">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utama">Tugas Utama</SelectItem>
                  <SelectItem value="tambahan">Tugas Tambahan</SelectItem>
                  <SelectItem value="lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit">Simpan Aktivitas</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
