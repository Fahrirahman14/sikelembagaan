"use client";

import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminPageShell } from "@/components/admin-page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
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
    adminAuthMethods,
    adminImplementationNotes,
    adminSessionPolicy,
    filterAdminLoginUsers,
    getAdminRoleById,
    getAdminUserStats,
    getAuthMethodById,
    type AdminAuthMethod,
    type AdminUserStatus
} from "@/lib/admin-access-data";
import {
    BadgeCheck,
    Clock3,
    KeyRound,
    Mail,
    Plus,
    Save,
    Search,
    Settings2,
    ShieldCheck,
    Smartphone,
    UserCog,
} from "lucide-react";
import { useMemo, useState } from "react";

function StatusBadge({ status }: { status: AdminUserStatus }) {
  const tone = {
    aktif: "bg-emerald-100 text-emerald-700 border-emerald-200",
    undangan: "bg-amber-100 text-amber-700 border-amber-200",
    nonaktif: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Badge variant="outline" className={tone[status]}>
      {status === "aktif" ? "Aktif" : status === "undangan" ? "Undangan" : "Nonaktif"}
    </Badge>
  );
}

function LoginMethodCard({
  method,
  checked,
  onCheckedChange,
}: {
  method: AdminAuthMethod;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  const Icon =
    method.id === "email-password"
      ? Mail
      : method.id === "email-otp"
        ? Smartphone
        : KeyRound;

  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-2xl border bg-background/70 p-4 ${
        method.stage === "planned"
          ? "border-dashed border-border/70"
          : "border-border/70"
      }`}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <p className="font-medium text-foreground">{method.nama}</p>
          {method.stage === "planned" ? (
            <Badge className="rounded-full bg-amber-100 text-amber-700">Tahap Berikutnya</Badge>
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">{method.deskripsi}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export default function PengaturanUserPage() {
  const [search, setSearch] = useState("");
  const [authMethods, setAuthMethods] = useState(adminAuthMethods);

  const filteredUsers = useMemo(() => {
    return filterAdminLoginUsers(search);
  }, [search]);

  const baseStats = getAdminUserStats();
  const readiness = Math.min(
    100,
    Math.round((authMethods.filter((method) => method.enabled).length / authMethods.length) * 100) + 7,
  );
  const stats = {
    ...baseStats,
    readiness,
  };

  const setMethodEnabled = (methodId: AdminAuthMethod["id"], enabled: boolean) => {
    setAuthMethods((currentMethods) =>
      currentMethods.map((method) =>
        method.id === methodId ? { ...method, enabled } : method,
      ),
    );
  };

  return (
    <AdminPageShell>
      <AdminPageHeader
        icon={UserCog}
        eyebrow="Pengaturan user login"
        title="Siapkan fondasi akun admin untuk alur login yang nanti akan dipakai di sistem."
        description="Halaman ini dipakai untuk menyiapkan metode login, keamanan akses, dan daftar akun admin yang akan digunakan saat modul autentikasi diaktifkan penuh."
        actions={
          <>
            <Button variant="outline" className="gap-2 rounded-xl border-border/70 bg-background/80">
              <Plus className="h-4 w-4" />
              Tambah User
            </Button>
            <Button className="gap-2 rounded-xl shadow-lg shadow-primary/15">
              <Save className="h-4 w-4" />
              Simpan Pengaturan
            </Button>
          </>
        }
        aside={
          <>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Akun admin
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{stats.total}</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Kesiapan login
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{stats.readiness}%</p>
            </div>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <UserCog className="h-6 w-6 text-primary" />
              </div>
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
              <div className="rounded-lg bg-emerald-100 p-3">
                <BadgeCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">User Aktif</p>
                <p className="text-2xl font-bold text-foreground">{stats.aktif}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-accent/30 p-3">
                <ShieldCheck className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">MFA Aktif</p>
                <p className="text-2xl font-bold text-foreground">{stats.mfa}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Settings2 className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">Progress Setup</p>
                <p className="mb-2 text-2xl font-bold text-foreground">{stats.readiness}%</p>
                <Progress value={stats.readiness} className="h-2.5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardHeader className="border-b border-border/70">
              <CardTitle className="text-lg">Metode Login yang Disiapkan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              {authMethods
                .filter((method) => method.id !== "invitation")
                .map((method) => (
                  <LoginMethodCard
                    key={method.id}
                    method={method}
                    checked={method.enabled}
                    onCheckedChange={(checked) => setMethodEnabled(method.id, checked)}
                  />
                ))}
            </CardContent>
          </Card>

          <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardHeader className="border-b border-border/70">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg">Daftar User Admin</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    User yang akan dipakai untuk login admin saat modul autentikasi diaktifkan.
                  </p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Cari nama, email, role..."
                    className="h-11 rounded-xl border-border/70 bg-background/80 pl-9 sm:w-72"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/70 hover:bg-transparent">
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Metode</TableHead>
                      <TableHead>MFA</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Login Terakhir</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-border/60 hover:bg-background/80">
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{user.nama}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getAdminRoleById(user.roleId)?.nama ?? "Tanpa role"}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {getAuthMethodById(user.authMethodId)?.nama ?? "Belum diatur"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={user.mfa ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-muted text-muted-foreground"}>
                            {user.mfa ? "Aktif" : "Belum"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={user.status} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.loginTerakhir}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardHeader className="border-b border-border/70">
              <CardTitle className="text-lg">Kebijakan Sesi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-primary" />
                  <p className="font-medium text-foreground">Timeout Session Admin</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Session otomatis berakhir setelah {adminSessionPolicy.sessionTimeoutHours} jam tanpa aktivitas.
                </p>
                <Badge className="mt-3 rounded-full border border-primary/15 bg-primary/10 text-primary">
                  {adminSessionPolicy.sessionTimeoutHours} Jam
                </Badge>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <p className="font-medium text-foreground">Whitelisted Domain</p>
                </div>
                <p className="text-sm text-muted-foreground">Registrasi user admin dibatasi pada domain resmi pemerintah daerah.</p>
                <Badge className="mt-3 rounded-full border border-border/80 bg-background/80 text-muted-foreground">
                  @{adminSessionPolicy.whitelistedDomains[0]}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
            <CardHeader className="border-b border-border/70">
              <CardTitle className="text-lg">Catatan Implementasi</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Textarea
                className="min-h-40 rounded-2xl border-border/70 bg-background/80"
                defaultValue={adminImplementationNotes.map((note, index) => `${index + 1}. ${note}`).join("\n")}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminPageShell>
  );
}