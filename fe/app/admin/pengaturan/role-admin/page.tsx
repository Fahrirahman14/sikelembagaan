"use client";

import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminPageShell } from "@/components/admin-page-shell";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
    adminPermissionMatrix,
    adminRoles,
    type AdminRole,
} from "@/lib/admin-access-data";
import { api, type Role as ApiRole } from "@/lib/api";
import {
    CheckCheck,
    Edit,
    KeyRound,
    Layers3,
    Loader2,
    LockKeyhole,
    Plus,
    Settings,
    Shield,
    ShieldCheck,
    Trash2,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function LevelBadge({ level }: { level: string }) {
  const tone: Record<string, string> = {
    inti: "bg-primary text-primary-foreground",
    operasional: "bg-accent text-accent-foreground",
    review: "bg-emerald-100 text-emerald-700",
  };
  const label: Record<string, string> = { inti: "Inti", operasional: "Operasional", review: "Review" };
  return <Badge className={tone[level] ?? "bg-muted text-muted-foreground"}>{label[level] ?? level}</Badge>;
}

function PermissionBadge({ allowed }: { allowed: boolean }) {
  return allowed ? (
    <Badge className="bg-emerald-100 text-emerald-700"><CheckCheck className="mr-1 h-3.5 w-3.5" />Diizinkan</Badge>
  ) : (
    <Badge variant="outline" className="bg-muted text-muted-foreground"><LockKeyhole className="mr-1 h-3.5 w-3.5" />Dibatasi</Badge>
  );
}

interface RoleForm {
  kode: string;
  nama: string;
  level: string;
  deskripsi: string;
}

const emptyForm: RoleForm = { kode: "", nama: "", level: "operasional", deskripsi: "" };

export default function RoleAdminPage() {
  const [roles, setRoles] = useState<ApiRole[]>([]);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<ApiRole | null>(null);
  const [deletingRole, setDeletingRole] = useState<ApiRole | null>(null);
  const [form, setForm] = useState<RoleForm>(emptyForm);

  useEffect(() => {
    api.roles.list().then(setRoles);
    api.adminUsers.list().then((users) => setTotalAdmins(users.length));
  }, []);

  function openCreate() {
    setEditingRole(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(role: ApiRole) {
    setEditingRole(role);
    setForm({ kode: role.kode, nama: role.nama, level: role.level, deskripsi: role.deskripsi });
    setDialogOpen(true);
  }

  async function handleSubmit() {
    if (!form.kode || !form.nama) { toast.error("Kode dan nama role wajib diisi"); return; }
    setLoading(true);
    try {
      if (editingRole) {
        const updated = await api.roles.update(editingRole.id, { nama: form.nama, level: form.level, deskripsi: form.deskripsi });
        setRoles((prev) => prev.map((r) => r.id === updated.id ? updated : r));
        toast.success("Role berhasil diperbarui");
      } else {
        const created = await api.roles.create({ kode: form.kode, nama: form.nama, level: form.level, deskripsi: form.deskripsi });
        setRoles((prev) => [...prev, created]);
        toast.success("Role berhasil dibuat");
      }
      setDialogOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      toast.error(`Gagal menyimpan role: ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deletingRole) return;
    setLoading(true);
    try {
      await api.roles.delete(deletingRole.id);
      setRoles((prev) => prev.filter((r) => r.id !== deletingRole.id));
      toast.success("Role berhasil dihapus");
      setDeleteDialogOpen(false);
    } catch {
      toast.error("Gagal menghapus role. Pastikan tidak ada user yang menggunakan role ini.");
    } finally {
      setLoading(false);
    }
  }

  const totalRoles = roles.length;

  return (
    <AdminPageShell>
      <AdminPageHeader
        icon={Shield}
        eyebrow="Manajemen role admin"
        title="Atur pembagian hak akses admin supaya setiap modul punya kontrol yang jelas."
        description="Role admin dipisahkan berdasarkan area kerja agar akses ke OPD, Anjab, ABK, SAKIP, dan pengaturan sistem tetap terukur dan mudah diaudit."
        actions={
          <>
            <Button variant="outline" className="gap-2 rounded-xl border-border/70 bg-background/80">
              <KeyRound className="h-4 w-4" />
              Audit Izin
            </Button>
            <Button className="gap-2 rounded-xl shadow-lg shadow-primary/15" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Tambah Role
            </Button>
          </>
        }
        aside={
          <>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Total role</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{totalRoles}</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Admin terikat role</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{totalAdmins}</p>
            </div>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Role Aktif", value: totalRoles, Icon: ShieldCheck, color: "bg-primary/10 text-primary" },
          { label: "Total Admin", value: totalAdmins, Icon: Users, color: "bg-accent/30 text-accent-foreground" },
          { label: "Cakupan Izin Rata-rata", value: "—", Icon: Layers3, color: "bg-emerald-100 text-emerald-600" },
          { label: "Kesiapan Matrix", value: "91%", Icon: Settings, color: "bg-primary/10 text-primary", progress: 91 },
        ].map(({ label, value, Icon, color, progress }) => (
          <Card key={label} className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-3 ${color}`}><Icon className="h-6 w-6" /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mb-1 text-2xl font-bold text-foreground">{value}</p>
                  {progress !== undefined && <Progress value={progress} className="h-2.5" />}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        {/* Role cards */}
        <div className="grid gap-6 xl:grid-cols-2">
          {roles.map((role) => (
            <Card key={role.id} className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold text-foreground">{role.nama}</p>
                      <LevelBadge level={role.level as AdminRole["level"]} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{role.deskripsi}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Badge className="rounded-full border border-border/70 bg-background/80 text-muted-foreground">{role.kode}</Badge>
                    <Button variant="ghost" size="icon" title="Edit role" onClick={() => openEdit(role)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" title="Hapus role"
                      onClick={() => { setDeletingRole(role); setDeleteDialogOpen(true); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p className="mt-2 text-lg font-semibold capitalize text-foreground">{role.level}</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <p className="text-sm text-muted-foreground">Dibuat</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">{new Date(role.created_at).toLocaleDateString("id-ID")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Permission matrix */}
        <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
          <CardHeader className="border-b border-border/70">
            <CardTitle className="text-lg">Matrix Hak Akses</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/70 hover:bg-transparent">
                    <TableHead>Modul</TableHead>
                    {adminRoles.map((role) => <TableHead key={role.id}>{role.nama}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminPermissionMatrix.map((row) => (
                    <TableRow key={row.modul} className="border-border/60 hover:bg-background/80">
                      <TableCell className="font-medium text-foreground">{row.modul}</TableCell>
                      {adminRoles.map((role) => (
                        <TableCell key={`${row.modul}-${role.id}`}>
                          <PermissionBadge allowed={row.permissions[role.id] ?? false} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingRole ? "Edit Role" : "Tambah Role Baru"}</DialogTitle>
            <DialogDescription>{editingRole ? "Perbarui informasi role admin." : "Buat role baru untuk mengatur hak akses admin."}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Kode Role *</Label>
              <Input placeholder="Contoh: ADM, OPR" value={form.kode} disabled={!!editingRole}
                onChange={(e) => setForm((f) => ({ ...f, kode: e.target.value.toUpperCase() }))} />
              {!editingRole && <p className="text-xs text-muted-foreground">Kode unik 3 huruf kapital. Tidak dapat diubah setelah dibuat.</p>}
            </div>
            <div className="space-y-2">
              <Label>Nama Role *</Label>
              <Input placeholder="Nama role" value={form.nama} onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Level *</Label>
              <Select value={form.level} onValueChange={(v) => setForm((f) => ({ ...f, level: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="inti">Inti — akses penuh</SelectItem>
                  <SelectItem value="operasional">Operasional — input data</SelectItem>
                  <SelectItem value="review">Review — persetujuan dokumen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea placeholder="Deskripsi singkat hak akses..." value={form.deskripsi}
                onChange={(e) => setForm((f) => ({ ...f, deskripsi: e.target.value }))} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={loading}>Batal</Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingRole ? "Simpan Perubahan" : "Buat Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Role</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus role <strong>{deletingRole?.nama}</strong>?
              User yang menggunakan role ini akan kehilangan rolenya.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={loading}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  );
}
