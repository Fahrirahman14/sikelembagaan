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
import { Textarea } from "@/components/ui/textarea";
import { api, type Jabatan, type OPD, type UraianJabatan } from "@/lib/api";
import {
    Briefcase,
    Building2,
    CheckCircle,
    ChevronRight,
    Download,
    Edit,
    Eye,
    FileText,
    Loader2,
    Plus,
    Printer,
    Search,
    Target,
    Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ----- Type definitions -----
interface UraianParsed {
  tugas: string[];
  fungsi: string[];
  wewenang: string[];
  tanggung_jawab: string[];
}

const defaultUraian: UraianParsed = { tugas: [], fungsi: [], wewenang: [], tanggung_jawab: [] };

function parseUraian(raw: UraianJabatan | null): UraianParsed {
  if (!raw) return defaultUraian;
  const safeArr = (v: unknown): string[] => {
    try { const r = v ? JSON.parse(JSON.stringify(v)) : []; return Array.isArray(r) ? r : []; } catch { return []; }
  };
  return {
    tugas: safeArr(raw.tugas),
    fungsi: safeArr(raw.fungsi),
    wewenang: safeArr(raw.wewenang),
    tanggung_jawab: safeArr(raw.tanggung_jawab),
  };
}

function StringListEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Textarea
              value={item}
              rows={2}
              onChange={(e) => { const n = [...items]; n[i] = e.target.value; onChange(n); }}
              className="flex-1 resize-none"
              placeholder={`${label} ke-${i + 1}`}
            />
            <Button type="button" variant="ghost" size="icon" className="self-start mt-1" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, ""])}>
          <Plus className="mr-1 h-3 w-3" /> Tambah {label}
        </Button>
      </div>
    </div>
  );
}

export default function UraianJabatanPage() {
  const [search, setSearch] = useState("");
  const [opdFilter, setOpdFilter] = useState("all");
  const [selectedJabatan, setSelectedJabatan] = useState<Jabatan | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [opdList, setOpdList] = useState<OPD[]>([]);
  const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);
  const [uraianMap, setUraianMap] = useState<Record<string, UraianJabatan>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState<UraianParsed>(defaultUraian);

  useEffect(() => {
    api.opd.list().then(setOpdList);
    api.jabatan.list().then(setJabatanList);
  }, []);

  const filteredData = jabatanList.filter((jabatan) => {
    const matchSearch =
      jabatan.nama.toLowerCase().includes(search.toLowerCase()) ||
      jabatan.kode.includes(search);
    const matchOpd = opdFilter === "all" || jabatan.opd_id === opdFilter;
    return matchSearch && matchOpd;
  });

  async function loadUraian(jabatan: Jabatan): Promise<UraianJabatan | null> {
    if (uraianMap[jabatan.id]) return uraianMap[jabatan.id];
    setLoadingId(jabatan.id);
    try {
      const data = await api.uraian.get(jabatan.id);
      setUraianMap((prev) => ({ ...prev, [jabatan.id]: data }));
      return data;
    } catch {
      return null;
    } finally {
      setLoadingId(null);
    }
  }

  async function openDetail(jabatan: Jabatan) {
    setSelectedJabatan(jabatan);
    setDetailOpen(true);
    await loadUraian(jabatan);
  }

  async function openEdit(jabatan: Jabatan) {
    setSelectedJabatan(jabatan);
    const raw = await loadUraian(jabatan);
    setEditData(parseUraian(raw));
    setEditOpen(true);
  }

  async function handleSave() {
    if (!selectedJabatan) return;
    setSaving(true);
    try {
      const saved = await api.uraian.upsert(selectedJabatan.id, {
        tugas: editData.tugas as never,
        fungsi: editData.fungsi as never,
        wewenang: editData.wewenang as never,
        tanggung_jawab: editData.tanggung_jawab as never,
      });
      setUraianMap((prev) => ({ ...prev, [selectedJabatan.id]: saved }));
      toast.success("Uraian jabatan berhasil disimpan");
      setEditOpen(false);
    } catch {
      toast.error("Gagal menyimpan uraian jabatan");
    } finally {
      setSaving(false);
    }
  }

  const getUraianParsed = (jabatanId: string): UraianParsed =>
    parseUraian(uraianMap[jabatanId] ?? null);

  const activeFilters = [
    search ? `Pencarian: ${search}` : null,
    opdFilter !== "all"
      ? `OPD: ${opdList.find((opd) => opd.id === opdFilter)?.nama ?? opdFilter}`
      : null,
  ].filter((value): value is string => Boolean(value));

  return (
    <AdminPageShell>
      <AdminPageHeader
        icon={FileText}
        eyebrow="Uraian tugas jabatan"
        title="Dokumentasi tugas, fungsi, dan tanggung jawab kini tampil lebih mudah dipindai."
        description="Kelola uraian jabatan: tugas pokok, fungsi, wewenang, dan tanggung jawab untuk setiap jabatan yang terdaftar."
        actions={
          <>
            <Button variant="outline" className="gap-2 rounded-xl border-border/70 bg-background/80">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" className="gap-2 rounded-xl border-border/70 bg-background/80">
              <Printer className="h-4 w-4" />
              Cetak
            </Button>
          </>
        }
        aside={
          <>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Jabatan terdata</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{jabatanList.length}</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Dokumen lengkap</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">
                {jabatanList.filter((j) => j.status_anjab === "disetujui").length}
              </p>
            </div>
          </>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Jabatan", value: jabatanList.length, Icon: FileText, color: "bg-primary/10 text-primary" },
          { label: "Sudah Lengkap", value: jabatanList.filter((j) => j.status_anjab === "disetujui").length, Icon: CheckCircle, color: "bg-emerald-100 text-emerald-600" },
          { label: "Dalam Proses", value: jabatanList.filter((j) => j.status_anjab === "final").length, Icon: Target, color: "bg-accent/30 text-accent-foreground" },
          { label: "Draft", value: jabatanList.filter((j) => j.status_anjab === "draft").length, Icon: Briefcase, color: "bg-muted text-muted-foreground" },
        ].map(({ label, value, Icon, color }) => (
          <Card key={label} className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-3 ${color}`}><Icon className="h-6 w-6" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <Card className="mb-6 border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Cari jabatan..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="h-11 rounded-xl border-border/70 bg-background/80 pl-9" />
            </div>
            <Select value={opdFilter} onValueChange={setOpdFilter}>
              <SelectTrigger className="h-11 w-full rounded-xl border-border/70 bg-background/80 sm:w-64">
                <SelectValue placeholder="Filter OPD" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua OPD</SelectItem>
                {opdList.map((opd) => <SelectItem key={opd.id} value={opd.id}>{opd.nama}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {activeFilters.length > 0 ? (
              activeFilters.map((f) => <Badge key={f} className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-primary">{f}</Badge>)
            ) : (
              <Badge className="rounded-full border border-border/80 bg-background/80 px-3 py-1 text-muted-foreground">Menampilkan seluruh uraian jabatan</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardHeader className="border-b border-border/70">
          <CardTitle className="text-lg">Daftar Uraian Jabatan</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/70 hover:bg-transparent">
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Jabatan</TableHead>
                  <TableHead>OPD</TableHead>
                  <TableHead>Ikhtisar</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">Tidak ada jabatan ditemukan</TableCell>
                  </TableRow>
                ) : filteredData.map((jabatan) => (
                  <TableRow key={jabatan.id} className="cursor-pointer border-border/60 hover:bg-background/80" onClick={() => openDetail(jabatan)}>
                    <TableCell className="font-mono text-sm">{jabatan.kode}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{jabatan.nama}</p>
                        <p className="text-xs text-muted-foreground">{jabatan.unit_kerja}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{jabatan.opd_nama}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">{jabatan.ikhtisar}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {loadingId === jabatan.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : (
                          <>
                            <Button variant="ghost" size="icon" title="Lihat detail" onClick={(e) => { e.stopPropagation(); openDetail(jabatan); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Edit uraian" onClick={(e) => { e.stopPropagation(); openEdit(jabatan); }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <ChevronRight className="h-4 w-4 self-center text-muted-foreground" />
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
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Uraian Jabatan
            </DialogTitle>
          </DialogHeader>
          {selectedJabatan && (() => {
            const u = getUraianParsed(selectedJabatan.id);
            return (
              <div className="space-y-6 py-4">
                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <Building2 className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Nama Jabatan</p>
                        <p className="font-semibold text-foreground">{selectedJabatan.nama}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Briefcase className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Unit Kerja</p>
                        <p className="font-semibold text-foreground">{selectedJabatan.unit_kerja || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedJabatan.ikhtisar && (
                  <div>
                    <h4 className="mb-2 font-semibold text-foreground">Ikhtisar Jabatan</h4>
                    <p className="text-muted-foreground">{selectedJabatan.ikhtisar}</p>
                  </div>
                )}

                <Separator />

                {u.tugas.length > 0 && (
                  <div>
                    <h4 className="mb-3 font-semibold text-foreground">Uraian Tugas</h4>
                    <ul className="space-y-2">
                      {u.tugas.map((tugas, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">{i + 1}</span>
                          <span className="text-muted-foreground">{tugas}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {u.fungsi.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="mb-3 font-semibold text-foreground">Fungsi</h4>
                      <ul className="space-y-2">
                        {u.fungsi.map((fungsi, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            <span className="text-muted-foreground">{fungsi}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {(u.wewenang.length > 0 || u.tanggung_jawab.length > 0) && (
                  <>
                    <Separator />
                    <div className="grid gap-6 sm:grid-cols-2">
                      {u.wewenang.length > 0 && (
                        <div>
                          <h4 className="mb-3 font-semibold text-foreground">Wewenang</h4>
                          <ul className="space-y-2">
                            {u.wewenang.map((w, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <span className="text-muted-foreground">{w}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {u.tanggung_jawab.length > 0 && (
                        <div>
                          <h4 className="mb-3 font-semibold text-foreground">Tanggung Jawab</h4>
                          <ul className="space-y-2">
                            {u.tanggung_jawab.map((t, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <Target className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" />
                                <span className="text-muted-foreground">{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {u.tugas.length === 0 && u.fungsi.length === 0 && (
                  <p className="text-center text-muted-foreground">Belum ada uraian jabatan. Klik Edit untuk mengisi.</p>
                )}

                <div className="flex justify-end">
                  <Button onClick={() => { setDetailOpen(false); openEdit(selectedJabatan); }}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Uraian
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              Edit Uraian — {selectedJabatan?.nama}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <StringListEditor label="Uraian Tugas" items={editData.tugas} onChange={(v) => setEditData((d) => ({ ...d, tugas: v }))} />
            <Separator />
            <StringListEditor label="Fungsi" items={editData.fungsi} onChange={(v) => setEditData((d) => ({ ...d, fungsi: v }))} />
            <Separator />
            <StringListEditor label="Wewenang" items={editData.wewenang} onChange={(v) => setEditData((d) => ({ ...d, wewenang: v }))} />
            <Separator />
            <StringListEditor label="Tanggung Jawab" items={editData.tanggung_jawab} onChange={(v) => setEditData((d) => ({ ...d, tanggung_jawab: v }))} />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={saving}>Batal</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Uraian
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  );
}
