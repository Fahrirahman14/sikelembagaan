export type AdminUserStatus = "aktif" | "undangan" | "nonaktif";
export type AdminRoleLevel = "inti" | "operasional" | "review";
export type AuthMethodId = "email-password" | "email-otp" | "magic-link" | "invitation";

export interface AdminAuthMethod {
  id: AuthMethodId;
  nama: string;
  deskripsi: string;
  enabled: boolean;
  stage: "active" | "planned";
}

export interface AdminSessionPolicy {
  sessionTimeoutHours: number;
  whitelistedDomains: string[];
}

export interface AdminRole {
  id: string;
  kode: string;
  nama: string;
  deskripsi: string;
  coverage: number;
  level: AdminRoleLevel;
}

export interface AdminLoginUser {
  id: string;
  nama: string;
  email: string;
  roleId: string;
  status: AdminUserStatus;
  loginTerakhir: string;
  mfa: boolean;
  authMethodId: AuthMethodId;
}

export interface PermissionMatrixRow {
  modul: string;
  permissions: Record<string, boolean>;
}

export const adminRoles: AdminRole[] = [
  {
    id: "super-admin",
    kode: "ROLE-001",
    nama: "Super Admin",
    deskripsi: "Akses penuh ke seluruh modul dan kebijakan sistem.",
    coverage: 100,
    level: "inti",
  },
  {
    id: "admin-opd",
    kode: "ROLE-002",
    nama: "Admin OPD",
    deskripsi: "Mengelola data OPD, pejabat, dan monitoring progres perangkat daerah.",
    coverage: 72,
    level: "operasional",
  },
  {
    id: "admin-sakip",
    kode: "ROLE-003",
    nama: "Admin SAKIP",
    deskripsi: "Fokus pada dokumen, review, dan tindak lanjut capaian SAKIP.",
    coverage: 64,
    level: "review",
  },
  {
    id: "admin-anjab-abk",
    kode: "ROLE-004",
    nama: "Admin Anjab/ABK",
    deskripsi: "Menangani input jabatan, spesifikasi, aktivitas, dan perhitungan ABK.",
    coverage: 81,
    level: "operasional",
  },
];

export const adminAuthMethods: AdminAuthMethod[] = [
  {
    id: "email-password",
    nama: "Login Email dan Password",
    deskripsi: "Metode dasar untuk admin pusat dan operator OPD saat modul autentikasi aktif.",
    enabled: true,
    stage: "active",
  },
  {
    id: "email-otp",
    nama: "OTP Verifikasi",
    deskripsi: "Tambahan lapisan verifikasi untuk role sensitif seperti super admin dan reviewer.",
    enabled: true,
    stage: "active",
  },
  {
    id: "magic-link",
    nama: "Magic Link",
    deskripsi: "Disiapkan untuk opsi login tanpa password jika nanti dibutuhkan untuk admin tertentu.",
    enabled: false,
    stage: "planned",
  },
  {
    id: "invitation",
    nama: "Undangan Email",
    deskripsi: "Akun admin baru dikirim melalui undangan ke email resmi instansi.",
    enabled: true,
    stage: "active",
  },
];

export const adminLoginUsers: AdminLoginUser[] = [
  {
    id: "USR-001",
    nama: "Admin Daerah",
    email: "admin@pemkab.go.id",
    roleId: "super-admin",
    status: "aktif",
    loginTerakhir: "2 jam lalu",
    mfa: true,
    authMethodId: "email-password",
  },
  {
    id: "USR-002",
    nama: "Operator SAKIP",
    email: "sakip@pemkab.go.id",
    roleId: "admin-sakip",
    status: "aktif",
    loginTerakhir: "Hari ini, 08:14",
    mfa: true,
    authMethodId: "email-otp",
  },
  {
    id: "USR-003",
    nama: "Operator Kepegawaian",
    email: "kepegawaian@pemkab.go.id",
    roleId: "admin-anjab-abk",
    status: "undangan",
    loginTerakhir: "Belum pernah",
    mfa: false,
    authMethodId: "invitation",
  },
  {
    id: "USR-004",
    nama: "Admin OPD Bappeda",
    email: "bappeda.admin@pemkab.go.id",
    roleId: "admin-opd",
    status: "nonaktif",
    loginTerakhir: "14 hari lalu",
    mfa: false,
    authMethodId: "email-password",
  },
];

export const adminSessionPolicy: AdminSessionPolicy = {
  sessionTimeoutHours: 8,
  whitelistedDomains: ["pemkab.go.id"],
};

export const adminImplementationNotes = [
  "Hubungkan akun admin ke data role.",
  "Aktifkan audit login dan histori perangkat.",
  "Tambahkan reset password via email resmi instansi.",
  "Siapkan integrasi OTP sebelum go-live autentikasi.",
];

export const adminPermissionMatrix: PermissionMatrixRow[] = [
  {
    modul: "Dashboard dan ringkasan",
    permissions: {
      "super-admin": true,
      "admin-opd": true,
      "admin-sakip": true,
      "admin-anjab-abk": true,
    },
  },
  {
    modul: "Manajemen OPD dan pejabat",
    permissions: {
      "super-admin": true,
      "admin-opd": true,
      "admin-sakip": false,
      "admin-anjab-abk": false,
    },
  },
  {
    modul: "Anjab dan dokumen jabatan",
    permissions: {
      "super-admin": true,
      "admin-opd": false,
      "admin-sakip": false,
      "admin-anjab-abk": true,
    },
  },
  {
    modul: "ABK dan perhitungan beban kerja",
    permissions: {
      "super-admin": true,
      "admin-opd": false,
      "admin-sakip": false,
      "admin-anjab-abk": true,
    },
  },
  {
    modul: "Capaian SAKIP",
    permissions: {
      "super-admin": true,
      "admin-opd": false,
      "admin-sakip": true,
      "admin-anjab-abk": false,
    },
  },
  {
    modul: "Pengaturan sistem",
    permissions: {
      "super-admin": true,
      "admin-opd": false,
      "admin-sakip": false,
      "admin-anjab-abk": false,
    },
  },
];

export function getAdminRoleById(roleId: string) {
  return adminRoles.find((role) => role.id === roleId);
}

export function getAuthMethodById(methodId: AuthMethodId) {
  return adminAuthMethods.find((method) => method.id === methodId);
}

export function filterAdminLoginUsers(keyword: string) {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) {
    return adminLoginUsers;
  }

  return adminLoginUsers.filter((user) => {
    const roleName = getAdminRoleById(user.roleId)?.nama.toLowerCase() ?? "";
    const methodName = getAuthMethodById(user.authMethodId)?.nama.toLowerCase() ?? "";

    return (
      user.nama.toLowerCase().includes(normalizedKeyword) ||
      user.email.toLowerCase().includes(normalizedKeyword) ||
      roleName.includes(normalizedKeyword) ||
      methodName.includes(normalizedKeyword)
    );
  });
}

export function getAdminUserStats() {
  const activeMethods = adminAuthMethods.filter((method) => method.enabled).length;

  return {
    total: adminLoginUsers.length,
    aktif: adminLoginUsers.filter((user) => user.status === "aktif").length,
    mfa: adminLoginUsers.filter((user) => user.mfa).length,
    readiness: Math.round((activeMethods / adminAuthMethods.length) * 100) + 7,
  };
}

export function getAdminRoleMemberCount(roleId: string) {
  return adminLoginUsers.filter((user) => user.roleId === roleId).length;
}

export function getAdminRoleStats() {
  const totalAdmins = adminLoginUsers.length;
  const averageCoverage = Math.round(
    adminRoles.reduce((sum, role) => sum + role.coverage, 0) / adminRoles.length,
  );

  return {
    totalRoles: adminRoles.length,
    totalAdmins,
    averageCoverage,
  };
}