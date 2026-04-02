"use client";

import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminPageShell } from "@/components/admin-page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    adminPermissionMatrix,
    adminRoles,
    type AdminRole,
} from "@/lib/admin-access-data";
import { api, type Role as ApiRole } from "@/lib/api";
import {
    CheckCheck,
    KeyRound,
    Layers3,
    LockKeyhole,
    Plus,
    Settings,
    Shield,
    ShieldCheck,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";

function LevelBadge({ level }: { level: AdminRole["level"] }) {
  const tone = {
    inti: "bg-primary text-primary-foreground",
    operasional: "bg-accent text-accent-foreground",
    review: "bg-emerald-100 text-emerald-700",
  };

  return <Badge className={tone[level]}>{level === "inti" ? "Inti" : level === "operasional" ? "Operasional" : "Review"}</Badge>;
}

function PermissionBadge({ allowed }: { allowed: boolean }) {
  return allowed ? (
    <Badge className="bg-emerald-100 text-emerald-700">
      <CheckCheck className="mr-1 h-3.5 w-3.5" />
      Diizinkan
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-muted text-muted-foreground">
      <LockKeyhole className="mr-1 h-3.5 w-3.5" />
      Dibatasi
    </Badge>
  );
}

export default function RoleAdminPage() {
  const [roles, setRoles] = useState<ApiRole[]>([]);
  const [totalAdmins, setTotalAdmins] = useState(0);

  useEffect(() => {
    api.roles.list().then(setRoles);
    api.adminUsers.list().then((users) => setTotalAdmins(users.length));
  }, []);

  const totalRoles = roles.length;
  const averageCoverage = 0;

  return (
    <AdminPageShell>
      <AdminPageHeader
        icon={Shield}
        eyebrow="Manajemen role admin"
        title="Atur pembagian hak akses admin supaya setiap modul punya kontrol yang jelas."
        description="Role admin dipisahkan berdasarkan area kerja agar akses ke OPD, Anjab, ABK, SAKIP, dan pengaturan sistem tetap terukur dan mudah diaudit saat login diaktifkan nanti."
        actions={
          <>
            <Button variant="outline" className="gap-2 rounded-xl border-border/70 bg-background/80">
              <KeyRound className="h-4 w-4" />
              Audit Izin
            </Button>
            <Button className="gap-2 rounded-xl shadow-lg shadow-primary/15">
              <Plus className="h-4 w-4" />
              Tambah Role
            </Button>
          </>
        }
        aside={
          <>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Total role
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{totalRoles}</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Admin terikat role
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{totalAdmins}</p>
            </div>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role Aktif</p>
                <p className="text-2xl font-bold text-foreground">{totalRoles}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-accent/30 p-3">
                <Users className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Admin</p>
                <p className="text-2xl font-bold text-foreground">{totalAdmins}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-emerald-100 p-3">
                <Layers3 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cakupan Izin Rata-rata</p>
                <p className="text-2xl font-bold text-foreground">{averageCoverage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/60 bg-card/85 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.45)] backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">Kesiapan Matrix</p>
                <p className="mb-2 text-2xl font-bold text-foreground">91%</p>
                <Progress value={91} className="h-2.5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

        <div className="space-y-6">
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
                  <Badge className="rounded-full border border-border/70 bg-background/80 text-muted-foreground">
                    {role.kode}
                  </Badge>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <p className="text-sm text-muted-foreground">Jumlah Anggota</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">
                      {totalAdmins}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <p className="text-sm text-muted-foreground">Cakupan Hak Akses</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">-</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
                    {adminRoles.map((role) => (
                      <TableHead key={role.id}>{role.nama}</TableHead>
                    ))}
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
    </AdminPageShell>
  );
}