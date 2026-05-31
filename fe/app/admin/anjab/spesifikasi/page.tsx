"use client";

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
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/data-table-pagination";
import { api, type Jabatan, type OPD, type SpesifikasiJabatan } from "@/lib/api";
import {
    Award,
    Brain,
    Building2,
    ClipboardList,
    Clock,
    Download,
    Edit,
    Eye,
    GraduationCap,
    HeartPulse,
    Loader2,
    Plus,
    Search,
    Shield,
    Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// ----- Type definitions for the structured JSON fields -----
interface PendidikanFormal {
  jenjang: string;
  minimal: string;
  jurusan: string[];
}

interface PelatihanItem {
  nama: string;
  jenis: string;
  wajib: boolean;
}

interface PengalamanItem {
  deskripsi: string;
  wajib: boolean;
}

interface KompetensiItem {
  nama: string;
  level: number;
  maxLevel: number;
}

interface KondisiFisik {
  usia: string;
  kesehatan: string;
  kondisiKhusus: string;
}

interface SpesifikasiParsed {
  pendidikanFormal: PendidikanFormal;
  pelatihan: PelatihanItem[];
  pengalaman: PengalamanItem[];
  kompetensiManajerial: KompetensiItem[];
  kompetensiTeknis: KompetensiItem[];
  kondisiFisik: KondisiFisik;
}

const defaultSpesifikasi: SpesifikasiParsed = {
  pendidikanFormal: { jenjang: "S1", minimal: "D3", jurusan: [] },
  pelatihan: [],
  pengalaman: [],
  kompetensiManajerial: [],
  kompetensiTeknis: [],
  kondisiFisik: { usia: "", kesehatan: "Sehat jasmani dan rohani", kondisiKhusus: "Tidak dipersyaratkan" },
};

function parseSpesifikasi(raw: SpesifikasiJabatan | null): SpesifikasiParsed {
  if (!raw) return defaultSpesifikasi;
  const safeJson = (v: unknown, fallback: unknown) => {
    try { return v ? JSON.parse(JSON.stringify(v)) : fallback; } catch { return fallback; }
  };
  return {
    pendidikanFormal: safeJson(raw.pendidikan_formal, defaultSpesifikasi.pendidikanFormal),
    pelatihan: safeJson(raw.pelatihan, []),
    pengalaman: safeJson(raw.pengalaman, []),
    kompetensiManajerial: safeJson(raw.kompetensi_manajerial, []),
    kompetensiTeknis: safeJson(raw.kompetensi_teknis, []),
    kondisiFisik: safeJson(raw.kondisi_fisik, defaultSpesifikasi.kondisiFisik),
  };
}

export default function SpesifikasiJabatanPage() {
  const [search, setSearch] = useState("");
  const [opdFilter, setOpdFilter] = useState("all");
  const [selectedJabatan, setSelectedJabatan] = useState<Jabatan | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [opdList, setOpdList] = useState<OPD[]>([]);
  const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [spesifikasiMap, setSpesifikasiMap] = useState<Record<string, SpesifikasiJabatan>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [editData, setEditData] = useState<SpesifikasiParsed>(defaultSpesifikasi);

  useEffect(() => {
    api.opd.list({ limit: 0 }).then((r) => setOpdList(r.data));
  }, []);

  const fetchJabatan = useCallback(async () => {
    const result = await api.jabatan.list({
      opd_id: opdFilter !== "all" ? opdFilter : undefined,
      search: search || undefined,
      limit,
      offset,
    });
    setJabatanList(result.data);
    setTotal(result.total);
  }, [opdFilter, search, limit, offset]);

  useEffect(() => { fetchJabatan(); }, [fetchJabatan]);

  const filteredData = jabatanList;

  async function loadSpesifikasi(jabatan: Jabatan): Promise<SpesifikasiJabatan | null> {
    if (spesifikasiMap[jabatan.id]) return spesifikasiMap[jabatan.id];
    setLoadingId(jabatan.id);
    try {
      const data = await api.spesifikasi.get(jabatan.id);
      setSpesifikasiMap((prev) => ({ ...prev, [jabatan.id]: data }));
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
    await loadSpesifikasi(jabatan);
  }

  async function openEdit(jabatan: Jabatan) {
    setSelectedJabatan(jabatan);
    const raw = await loadSpesifikasi(jabatan);
    setEditData(parseSpesifikasi(raw));
    setEditOpen(true);
  }

  async function handleSave() {
    if (!selectedJabatan) return;
    setSaving(true);
    try {
      const payload = {
        pendidikan_formal: editData.pendidikanFormal,
        pelatihan: editData.pelatihan,
        pengalaman: editData.pengalaman,
        kompetensi_manajerial: editData.kompetensiManajerial,
        kompetensi_teknis: editData.kompetensiTeknis,
        kondisi_fisik: editData.kondisiFisik,
      };
      const saved = await api.spesifikasi.upsert(selectedJabatan.id, payload as never);
      setSpesifikasiMap((prev) => ({ ...prev, [selectedJabatan.id]: saved }));
      toast.success("Spesifikasi jabatan berhasil disimpan");
      setEditOpen(false);
    } catch {
      toast.error("Gagal menyimpan spesifikasi jabatan");
    } finally {
      setSaving(false);
    }
  }

  const getSpesifikasiParsed = (jabatanId: string): SpesifikasiParsed =>
    parseSpesifikasi(spesifikasiMap[jabatanId] ?? null);

  const activeFilters = [
    search ? `Pencarian: ${search}` : null,
    opdFilter !== "all"
      ? `OPD: ${opdList.find((opd) => opd.id === opdFilter)?.nama ?? opdFilter}`
      : null,
  ].filter((value): value is string => Boolean(value));

  // ---- Helper: list editor ----
  function StringListEditor({ items, onChange }: { items: string[]; onChange: (v: string[]) => void }) {
    return (
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input value={item} onChange={(e) => { const n = [...items]; n[i] = e.target.value; onChange(n); }} className="flex-1" />
            <Button type="button" variant="ghost" size="icon" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, ""])}>
          <Plus className="mr-1 h-3 w-3" /> Tambah
        </Button>
      </div>
    );
  }

  return (
    <AdminPageShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Spesifikasi jabatan</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">Spesifikasi Jabatan</h1>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl border-border/70 bg-background/80">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Jabatan", value: jabatanList.length, Icon: ClipboardList, color: "bg-primary/10 text-primary" },
          { label: "Rata-rata Pendidikan", value: "S1", Icon: GraduationCap, color: "bg-primary/10 text-primary" },
          { label: "Spesifikasi Terisi", value: Object.keys(spesifikasiMap).length, Icon: Award, color: "bg-accent/30 text-accent-foreground" },
          { label: "Kompetensi Terdaftar", value: Object.values(spesifikasiMap).reduce((acc, s) => {
            const km = parseSpesifikasi(s).kompetensiManajerial.length;
            const kt = parseSpesifikasi(s).kompetensiTeknis.length;
            return acc + km + kt;
          }, 0), Icon: Brain, color: "bg-emerald-100 text-emerald-600" },
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
              <Input placeholder="Cari jabatan..." value={search} onChange={(e) => { setSearch(e.target.value); setOffset(0); }}
                className="h-11 rounded-xl border-border/70 bg-background/80 pl-9" />
            </div>
            <Select value={opdFilter} onValueChange={(v) => { setOpdFilter(v); setOffset(0); }}>
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
              activeFilters.map((filter) => (
                <Badge key={filter} className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-primary">{filter}</Badge>
              ))
            ) : (
              <Badge className="rounded-full border border-border/80 bg-background/80 px-3 py-1 text-muted-foreground">Semua spesifikasi jabatan aktif</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardHeader className="border-b border-border/70">
          <CardTitle className="text-lg">Daftar Spesifikasi Jabatan</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/70 hover:bg-transparent">
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Jabatan</TableHead>
                  <TableHead>OPD</TableHead>
                  <TableHead>Pendidikan</TableHead>
                  <TableHead>Pengalaman</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">Tidak ada jabatan ditemukan</TableCell>
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
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/5">
                        <GraduationCap className="mr-1 h-3 w-3" />
                        {jabatan.kualifikasi_pendidikan?.split(" ")[0] ?? "S1"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">{jabatan.pengalaman}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {loadingId === jabatan.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : (
                          <>
                            <Button variant="ghost" size="icon" title="Lihat detail" onClick={(e) => { e.stopPropagation(); openDetail(jabatan); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Edit spesifikasi" onClick={(e) => { e.stopPropagation(); openEdit(jabatan); }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {total > 0 && (
            <div className="border-t border-border/70">
              <DataTablePagination
                total={total}
                limit={limit}
                offset={offset}
                onPageChange={setOffset}
                onPageSizeChange={(newLimit) => { setLimit(newLimit); setOffset(0); }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Spesifikasi Jabatan
            </DialogTitle>
          </DialogHeader>
          {selectedJabatan && (() => {
            const sp = getSpesifikasiParsed(selectedJabatan.id);
            return (
              <div className="space-y-6 py-4">
                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-3"><Building2 className="h-8 w-8 text-primary" /></div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{selectedJabatan.nama}</h3>
                      <p className="text-muted-foreground">{selectedJabatan.opd_nama} — {selectedJabatan.unit_kerja}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                    <GraduationCap className="h-5 w-5 text-primary" /> Pendidikan Formal
                  </h4>
                  <div className="rounded-lg border p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div><p className="text-sm text-muted-foreground">Jenjang</p><p className="font-semibold">{sp.pendidikanFormal.jenjang || "-"}</p></div>
                      <div><p className="text-sm text-muted-foreground">Minimal</p><p className="font-semibold">{sp.pendidikanFormal.minimal || "-"}</p></div>
                      {sp.pendidikanFormal.jurusan.length > 0 && (
                        <div className="sm:col-span-2">
                          <p className="text-sm text-muted-foreground">Jurusan</p>
                          <div className="mt-1 flex flex-wrap gap-2">{sp.pendidikanFormal.jurusan.map((j, i) => <Badge key={i} variant="outline">{j}</Badge>)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {sp.pelatihan.length > 0 && (
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                      <Award className="h-5 w-5 text-accent-foreground" /> Pelatihan
                    </h4>
                    <div className="space-y-2">
                      {sp.pelatihan.map((p, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                          <div className="flex items-center gap-3">
                            <div className={`h-2 w-2 rounded-full ${p.wajib ? "bg-destructive" : "bg-muted-foreground"}`} />
                            <div><p className="font-medium">{p.nama}</p><p className="text-xs text-muted-foreground capitalize">{p.jenis}</p></div>
                          </div>
                          <Badge variant={p.wajib ? "destructive" : "outline"}>{p.wajib ? "Wajib" : "Diutamakan"}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {sp.pengalaman.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                        <Clock className="h-5 w-5 text-primary" /> Pengalaman Kerja
                      </h4>
                      <ul className="space-y-2">
                        {sp.pengalaman.map((p, i) => (
                          <li key={i} className="flex items-start gap-3 rounded-lg border p-3">
                            <Shield className={`mt-0.5 h-4 w-4 shrink-0 ${p.wajib ? "text-destructive" : "text-muted-foreground"}`} />
                            <p className="flex-1 text-muted-foreground">{p.deskripsi}</p>
                            <Badge variant={p.wajib ? "destructive" : "outline"} className="shrink-0">{p.wajib ? "Wajib" : "Opsional"}</Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {(sp.kompetensiManajerial.length > 0 || sp.kompetensiTeknis.length > 0) && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                        <Brain className="h-5 w-5 text-emerald-600" /> Kompetensi
                      </h4>
                      <div className="grid gap-6 sm:grid-cols-2">
                        {sp.kompetensiManajerial.length > 0 && (
                          <div className="rounded-lg border p-4">
                            <h5 className="mb-3 font-medium">Kompetensi Manajerial</h5>
                            <div className="space-y-3">
                              {sp.kompetensiManajerial.map((k, i) => (
                                <div key={i}>
                                  <div className="mb-1 flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{k.nama}</span>
                                    <span className="font-medium">Level {k.level}</span>
                                  </div>
                                  <Progress value={(k.level / (k.maxLevel || 5)) * 100} className="h-2" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {sp.kompetensiTeknis.length > 0 && (
                          <div className="rounded-lg border p-4">
                            <h5 className="mb-3 font-medium">Kompetensi Teknis</h5>
                            <div className="space-y-3">
                              {sp.kompetensiTeknis.map((k, i) => (
                                <div key={i}>
                                  <div className="mb-1 flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{k.nama}</span>
                                    <span className="font-medium">Level {k.level}</span>
                                  </div>
                                  <Progress value={(k.level / (k.maxLevel || 5)) * 100} className="h-2" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <Separator />
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                    <HeartPulse className="h-5 w-5 text-destructive" /> Kondisi Fisik
                  </h4>
                  <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-3">
                    <div><p className="text-sm text-muted-foreground">Usia</p><p className="font-medium">{sp.kondisiFisik.usia || "-"}</p></div>
                    <div><p className="text-sm text-muted-foreground">Kesehatan</p><p className="font-medium">{sp.kondisiFisik.kesehatan || "-"}</p></div>
                    <div><p className="text-sm text-muted-foreground">Kondisi Khusus</p><p className="font-medium">{sp.kondisiFisik.kondisiKhusus || "-"}</p></div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => { setDetailOpen(false); openEdit(selectedJabatan); }}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Spesifikasi
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              Edit Spesifikasi — {selectedJabatan?.nama}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Pendidikan Formal */}
            <div>
              <h4 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                <GraduationCap className="h-5 w-5 text-primary" /> Pendidikan Formal
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Jenjang Pendidikan</Label>
                  <Select value={editData.pendidikanFormal.jenjang} onValueChange={(v) => setEditData((d) => ({ ...d, pendidikanFormal: { ...d.pendidikanFormal, jenjang: v } }))}>
                    <SelectTrigger><SelectValue placeholder="Pilih jenjang" /></SelectTrigger>
                    <SelectContent>
                      {["SD","SMP","SMA/SMK","D3","S1","S2","S3"].map((j) => <SelectItem key={j} value={j}>{j}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Pendidikan Minimal</Label>
                  <Select value={editData.pendidikanFormal.minimal} onValueChange={(v) => setEditData((d) => ({ ...d, pendidikanFormal: { ...d.pendidikanFormal, minimal: v } }))}>
                    <SelectTrigger><SelectValue placeholder="Pilih minimal" /></SelectTrigger>
                    <SelectContent>
                      {["SD","SMP","SMA/SMK","D3","S1","S2","S3"].map((j) => <SelectItem key={j} value={j}>{j}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label>Jurusan / Program Studi</Label>
                  <StringListEditor items={editData.pendidikanFormal.jurusan} onChange={(v) => setEditData((d) => ({ ...d, pendidikanFormal: { ...d.pendidikanFormal, jurusan: v } }))} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Pelatihan */}
            <div>
              <h4 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                <Award className="h-5 w-5 text-accent-foreground" /> Pelatihan
              </h4>
              <div className="space-y-3">
                {editData.pelatihan.map((p, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 rounded-lg border p-3">
                    <Input placeholder="Nama pelatihan" value={p.nama} onChange={(e) => {
                      const n = [...editData.pelatihan]; n[i] = { ...n[i], nama: e.target.value };
                      setEditData((d) => ({ ...d, pelatihan: n }));
                    }} />
                    <Select value={p.jenis} onValueChange={(v) => {
                      const n = [...editData.pelatihan]; n[i] = { ...n[i], jenis: v };
                      setEditData((d) => ({ ...d, pelatihan: n }));
                    }}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="struktural">Struktural</SelectItem>
                        <SelectItem value="fungsional">Fungsional</SelectItem>
                        <SelectItem value="teknis">Teknis</SelectItem>
                        <SelectItem value="manajerial">Manajerial</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-1 text-sm">
                      <Switch checked={p.wajib} onCheckedChange={(v) => {
                        const n = [...editData.pelatihan]; n[i] = { ...n[i], wajib: v };
                        setEditData((d) => ({ ...d, pelatihan: n }));
                      }} />
                      <span className="text-muted-foreground text-xs">Wajib</span>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setEditData((d) => ({ ...d, pelatihan: d.pelatihan.filter((_, idx) => idx !== i) }))}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setEditData((d) => ({ ...d, pelatihan: [...d.pelatihan, { nama: "", jenis: "teknis", wajib: false }] }))}>
                  <Plus className="mr-1 h-3 w-3" /> Tambah Pelatihan
                </Button>
              </div>
            </div>

            <Separator />

            {/* Pengalaman */}
            <div>
              <h4 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                <Clock className="h-5 w-5 text-primary" /> Pengalaman Kerja
              </h4>
              <div className="space-y-3">
                {editData.pengalaman.map((p, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
                    <Input placeholder="Deskripsi pengalaman" value={p.deskripsi} onChange={(e) => {
                      const n = [...editData.pengalaman]; n[i] = { ...n[i], deskripsi: e.target.value };
                      setEditData((d) => ({ ...d, pengalaman: n }));
                    }} />
                    <div className="flex items-center gap-1 text-sm">
                      <Switch checked={p.wajib} onCheckedChange={(v) => {
                        const n = [...editData.pengalaman]; n[i] = { ...n[i], wajib: v };
                        setEditData((d) => ({ ...d, pengalaman: n }));
                      }} />
                      <span className="text-muted-foreground text-xs">Wajib</span>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setEditData((d) => ({ ...d, pengalaman: d.pengalaman.filter((_, idx) => idx !== i) }))}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setEditData((d) => ({ ...d, pengalaman: [...d.pengalaman, { deskripsi: "", wajib: true }] }))}>
                  <Plus className="mr-1 h-3 w-3" /> Tambah Pengalaman
                </Button>
              </div>
            </div>

            <Separator />

            {/* Kompetensi Manajerial */}
            <div>
              <h4 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                <Brain className="h-5 w-5 text-emerald-600" /> Kompetensi Manajerial
              </h4>
              <div className="space-y-2">
                {editData.kompetensiManajerial.map((k, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2">
                    <Input placeholder="Nama kompetensi" value={k.nama} onChange={(e) => {
                      const n = [...editData.kompetensiManajerial]; n[i] = { ...n[i], nama: e.target.value };
                      setEditData((d) => ({ ...d, kompetensiManajerial: n }));
                    }} />
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Level</span>
                      <Input type="number" min={1} max={5} className="w-16" value={k.level} onChange={(e) => {
                        const n = [...editData.kompetensiManajerial]; n[i] = { ...n[i], level: Number(e.target.value) };
                        setEditData((d) => ({ ...d, kompetensiManajerial: n }));
                      }} />
                      <span className="text-xs text-muted-foreground">/ 5</span>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setEditData((d) => ({ ...d, kompetensiManajerial: d.kompetensiManajerial.filter((_, idx) => idx !== i) }))}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setEditData((d) => ({ ...d, kompetensiManajerial: [...d.kompetensiManajerial, { nama: "", level: 3, maxLevel: 5 }] }))}>
                  <Plus className="mr-1 h-3 w-3" /> Tambah
                </Button>
              </div>
            </div>

            <Separator />

            {/* Kompetensi Teknis */}
            <div>
              <h4 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                <Brain className="h-5 w-5 text-primary" /> Kompetensi Teknis
              </h4>
              <div className="space-y-2">
                {editData.kompetensiTeknis.map((k, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2">
                    <Input placeholder="Nama kompetensi" value={k.nama} onChange={(e) => {
                      const n = [...editData.kompetensiTeknis]; n[i] = { ...n[i], nama: e.target.value };
                      setEditData((d) => ({ ...d, kompetensiTeknis: n }));
                    }} />
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Level</span>
                      <Input type="number" min={1} max={5} className="w-16" value={k.level} onChange={(e) => {
                        const n = [...editData.kompetensiTeknis]; n[i] = { ...n[i], level: Number(e.target.value) };
                        setEditData((d) => ({ ...d, kompetensiTeknis: n }));
                      }} />
                      <span className="text-xs text-muted-foreground">/ 5</span>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setEditData((d) => ({ ...d, kompetensiTeknis: d.kompetensiTeknis.filter((_, idx) => idx !== i) }))}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setEditData((d) => ({ ...d, kompetensiTeknis: [...d.kompetensiTeknis, { nama: "", level: 3, maxLevel: 5 }] }))}>
                  <Plus className="mr-1 h-3 w-3" /> Tambah
                </Button>
              </div>
            </div>

            <Separator />

            {/* Kondisi Fisik */}
            <div>
              <h4 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                <HeartPulse className="h-5 w-5 text-destructive" /> Kondisi Fisik
              </h4>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Usia</Label>
                  <Input placeholder="Contoh: Maks 58 tahun" value={editData.kondisiFisik.usia}
                    onChange={(e) => setEditData((d) => ({ ...d, kondisiFisik: { ...d.kondisiFisik, usia: e.target.value } }))} />
                </div>
                <div className="space-y-2">
                  <Label>Kesehatan</Label>
                  <Input placeholder="Sehat jasmani dan rohani" value={editData.kondisiFisik.kesehatan}
                    onChange={(e) => setEditData((d) => ({ ...d, kondisiFisik: { ...d.kondisiFisik, kesehatan: e.target.value } }))} />
                </div>
                <div className="space-y-2">
                  <Label>Kondisi Khusus</Label>
                  <Input placeholder="Tidak dipersyaratkan" value={editData.kondisiFisik.kondisiKhusus}
                    onChange={(e) => setEditData((d) => ({ ...d, kondisiFisik: { ...d.kondisiFisik, kondisiKhusus: e.target.value } }))} />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={saving}>Batal</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Spesifikasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  );
}
