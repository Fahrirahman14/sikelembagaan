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
import { type AdminUserStatus } from "@/lib/admin-access-data";
import { api, type AdminUser, type Role } from "@/lib/api";
import {
    BadgeCheck,
    Edit,
    Loader2,
    Plus,
    Search,
    Trash2,
    UserCog,
    Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

function StatusBadge({ status }: { status: AdminUserStatus }) {
  const tone: Record<string, string> = {
    aktif: "bg-emerald-100 text-emerald-700 border-emerald-200",
    undangan: "bg-amber-100 text-amber-700 border-amber-200",
    nonaktif: "bg-muted text-muted-foreground border-border",
  };
  const label: Record<string, string> = { aktif: "Aktif", undangan: "Undangan", nonaktif: "Nonaktif" };
  return (
    <Badge variant="outline" className={tone[status] ?? tone.nonaktif}>
      {label[status] ?? status}
    </Badge>
  );
}

interface UserForm {
  email: string;
  nama: string;
  password: string;
  role_id: string;
  status: string;
}

const emptyForm: UserForm = { email: "", nama: "", password: "", role_id: "none", status: "aktif" };

export default function PengaturanUserPage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<UserForm>(emptyForm);

  useEffect(() => {
    api.adminUsers.list().then(setUsers);
    api.roles.list().then(setRoles);
  }, []);

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    const lc = search.toLowerCase();
    return users.filter(
      (u) => u.nama.toLowerCase().includes(lc) || u.email.toLowerCase().includes(lc) || (u.role_nama ?? "").toLowerCase().includes(lc),
    );
  }, [users, search]);

  const stats = useMemo(() => ({
    total: users.length,
    aktif: users.filter((u) => u.status === "aktif").length,
  }), [users]);

  function openCreate() {
    setEditingUser(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(user: AdminUser) {
    setEditingUser(user);
    setForm({ email: user.email, nama: user.nama, password: "", role_id: user.role_id ?? "none", status: user.status });
    setDialogOpen(true);
  }

  async function handleSubmit() {
    if (!form.email || !form.nama) { toast.error("Email dan nama wajib diisi"); return; }
    if (!editingUser && !form.password) { toast.error("Password wajib diisi untuk user baru"); return; }
    setLoading(true);
    try {
      if (editingUser) {
        const updated = await api.adminUsers.update(editingUser.id, {
          email: editingUser.email,
          nama: form.nama,
          role_id: (form.role_id && form.role_id !== "none") ? form.role_id : undefined,
          status: form.status,
          ...(form.password ? { password: form.password } : {}),
        });
        setUsers((prev) => prev.map((u) => u.id === updated.id ? updated : u));
        toast.success("User berhasil diperbarui");
      } else {
        const roleId = (form.role_id && form.role_id !== "none") ? form.role_id : undefined;
        const created = await api.adminUsers.create({ email: form.email, nama: form.nama, password: form.password, role_id: roleId });
        setUsers((prev) => [...prev, created]);
        toast.success("User berhasil dibuat");
      }
      setDialogOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      toast.error(`Gagal menyimpan user: ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deletingUser) return;
    setLoading(true);
    try {
      await api.adminUsers.delete(deletingUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      toast.success("User berhasil dihapus");
      setDeleteDialogOpen(false);
    } catch {
      toast.error("Gagal menghapus user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminPageShell>
      <AdminPageHeader
        icon={UserCog}
        eyebrow="Pengaturan user admin"
        title="Kelola akun admin yang dapat mengakses sistem."
        description="Tambah, edit, dan hapus akun admin. Setiap akun dapat diberikan role yang menentukan hak aksesnya di seluruh modul."
        actions={
          <Button className="gap-2 rounded-xl shadow-lg shadow-primary/15" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Tambah User
          </Button>
        }
        aside={
          <>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Total akun</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{stats.total}</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Akun aktif</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{stats.aktif}</p>
            </div>
          </>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3"><UserCog className="h-6 w-6 text-primary" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Total User</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-emerald-100 p-3"><BadgeCheck className="h-6 w-6 text-emerald-600" /></div>
              <div>
                <p className="text-sm text-muted-foreground">User Aktif</p>
                <p className="text-2xl font-bold text-foreground">{stats.aktif}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Table */}
      <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardHeader className="border-b border-border/70 px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Daftar User Admin</CardTitle>
                <p className="mt-0.5 text-sm text-muted-foreground">{filteredUsers.length} dari {users.length} user</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama, email, role..."
                className="h-10 rounded-xl border-border/70 bg-background/80 pl-9 sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/70 hover:bg-transparent">
                  <TableHead className="px-6 py-3">User</TableHead>
                  <TableHead className="px-4 py-3">Role</TableHead>
                  <TableHead className="px-4 py-3">Status</TableHead>
                  <TableHead className="px-4 py-3">Login Terakhir</TableHead>
                  <TableHead className="px-6 py-3 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                      <UserCog className="mx-auto mb-3 h-8 w-8 opacity-30" />
                      <p>Tidak ada user ditemukan</p>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-border/60 hover:bg-background/80">
                    <TableCell className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{user.nama}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      {user.role_nama
                        ? <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">{user.role_nama}</Badge>
                        : <span className="text-sm text-muted-foreground">Tanpa role</span>
                      }
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <StatusBadge status={user.status as AdminUserStatus} />
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                      {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit user" onClick={() => openEdit(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" title="Hapus user"
                          onClick={() => { setDeletingUser(user); setDeleteDialogOpen(true); }}>
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User Admin" : "Tambah User Admin"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Perbarui informasi user admin." : "Buat akun admin baru untuk sistem."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input placeholder="email@domain.com" value={form.email} disabled={!!editingUser}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Nama Lengkap *</Label>
              <Input placeholder="Nama lengkap" value={form.nama}
                onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>{editingUser ? "Password Baru (kosongkan jika tidak diubah)" : "Password *"}</Label>
              <Input type="password" placeholder="Password" value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={form.role_id} onValueChange={(v) => setForm((f) => ({ ...f, role_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Pilih role (opsional)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tanpa role</SelectItem>
                  {roles.map((r) => <SelectItem key={r.id} value={r.id}>{r.nama}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {editingUser && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="nonaktif">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={loading}>Batal</Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingUser ? "Simpan Perubahan" : "Buat User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus User</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus user <strong>{deletingUser?.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
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
