// ===========================
// API Client - Sikelembagaan
// ===========================

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1323";

// ---- Token helpers ----
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser) {
  localStorage.setItem("user", JSON.stringify(user));
}

// ---- Types ----
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
}

export interface OPD {
  id: string;
  kode: string;
  nama: string;
  alamat: string;
  telepon: string;
  email: string;
  kepala: string;
  nip_kepala: string;
  status_anjab: "belum" | "proses" | "selesai";
  status_abk: "belum" | "proses" | "selesai";
  total_pegawai: number;
  total_jabatan: number;
  created_at: string;
  updated_at: string;
}

export interface Jabatan {
  id: string;
  opd_id: string;
  opd_nama?: string;
  kode: string;
  nama: string;
  jenis: string;
  eselon: string;
  unit_kerja: string;
  ikhtisar: string;
  kualifikasi_pendidikan: string;
  pengalaman: string;
  status_anjab: string;
  created_at: string;
  updated_at: string;
}

export interface Pejabat {
  id: string;
  opd_id: string;
  opd_nama?: string;
  nip: string;
  nama: string;
  jabatan: string;
  eselon: string;
  pangkat: string;
  golongan: string;
  tmt_jabatan?: string;
  pendidikan: string;
  created_at: string;
  updated_at: string;
}

export interface StrukturOrganisasi {
  id: string;
  opd_id: string;
  parent_id?: string;
  jabatan: string;
  nama: string;
  nip: string;
  level: number;
  urutan: number;
  children?: StrukturOrganisasi[];
}

export interface Aktivitas {
  id: string;
  jabatan_id: string;
  jabatan_nama?: string;
  uraian_tugas: string;
  satuan: string;
  norma_waktu: number;
  target_kuantitas: number;
  frekuensi: "harian" | "mingguan" | "bulanan" | "tahunan";
  kategori: string;
  created_at: string;
  updated_at: string;
}

export interface PerhitunganABK {
  id: string;
  jabatan_id: string;
  jabatan_nama?: string;
  total_waktu_kerja: number;
  waktu_kerja_efektif: number;
  beban_kerja: number;
  kebutuhan_pegawai: number;
  pegawai_existing: number;
  selisih: number;
  keterangan: string;
  created_at: string;
  updated_at: string;
}

export interface LaporanABK {
  id: string;
  opd_id: string;
  opd_nama?: string;
  periode: string;
  tanggal_dibuat: string;
  status: string;
  total_jabatan: number;
  total_kebutuhan_pegawai: number;
  total_pegawai_existing: number;
  efisiensi: number;
  created_at: string;
  updated_at: string;
}

export interface DokumenAnjab {
  id: string;
  opd_id: string;
  opd_nama?: string;
  nomor_dokumen: string;
  nama_opd: string;
  periode: string;
  jumlah_jabatan: number;
  tanggal_dibuat: string;
  status: "draft" | "review" | "disetujui";
  pembuat: string;
  penyetuju: string;
  created_at: string;
  updated_at: string;
}

export interface SpesifikasiJabatan {
  id: string;
  jabatan_id: string;
  pendidikan_formal: unknown;
  pelatihan: unknown;
  pengalaman: unknown;
  kompetensi_manajerial: unknown;
  kompetensi_teknis: unknown;
  kondisi_fisik: unknown;
  created_at: string;
  updated_at: string;
}

export interface UraianJabatan {
  id: string;
  jabatan_id: string;
  tugas: unknown;
  fungsi: unknown;
  wewenang: unknown;
  tanggung_jawab: unknown;
  created_at: string;
  updated_at: string;
}

export interface NilaiSAKIP {
  id: string;
  opd_id: string;
  opd_nama?: string;
  tahun: number;
  nilai_total: number;
  predikat: string;
  komponen_nilai: unknown;
  created_at: string;
  updated_at: string;
}

export interface DokumenSAKIP {
  id: string;
  opd_id: string;
  opd_nama?: string;
  tahun: number;
  jenis_dokumen: string;
  nama_dokumen: string;
  file_path: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  kode: string;
  nama: string;
  level: string;
  deskripsi: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  nama: string;
  role_id?: string;
  role_nama?: string;
  picture?: string;
  google_id?: string;
  mfa_enabled: boolean;
  status: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardSummary {
  total_opd: number;
  total_jabatan: number;
  total_pegawai: number;
  total_dokumen_anjab: number;
  anjab_selesai: number;
  anjab_proses: number;
  abk_selesai: number;
  abk_proses: number;
  rata_rata_nilai_sakip: number;
}

export interface RekapOPD {
  id: string;
  kode: string;
  nama: string;
  status_anjab: string;
  status_abk: string;
  total_pegawai: number;
  total_jabatan: number;
}

// ---- Core request helper ----
async function request<T>(
  path: string,
  options: RequestInit = {},
  withAuth = true,
): Promise<T> {
  const url = `${BASE_URL}/api${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Origin:
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000",
    ...(options.headers as Record<string, string>),
  };

  if (withAuth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    const err = new Error(body?.message ?? `HTTP ${res.status}`) as Error & {
      status: number;
    };
    err.status = res.status;
    throw err;
  }

  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// ---- Auth ----
export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<LoginResponse>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        },
        false,
      ),

    loginGoogle: (credential: string) =>
      request<LoginResponse>(
        "/auth/google",
        {
          method: "POST",
          body: JSON.stringify({ credential }),
        },
        false,
      ),

    refresh: (refreshToken: string) =>
      request<LoginResponse>(
        "/auth/refresh",
        {
          method: "POST",
          body: JSON.stringify({ refresh_token: refreshToken }),
        },
        false,
      ),

    me: () => request<AuthUser>("/me"),
    health: () => request<{ ok: boolean }>("/health", {}, false),
  },

  // ---- Dashboard ----
  dashboard: {
    summary: () => request<DashboardSummary>("/dashboard/summary"),
    rekapOpd: () => request<RekapOPD[]>("/laporan/rekap-opd"),
  },

  // ---- OPD ----
  opd: {
    list: (search?: string) =>
      request<OPD[]>(
        `/opd${search ? `?search=${encodeURIComponent(search)}` : ""}`,
      ),
    get: (id: string) => request<OPD>(`/opd/${id}`),
    create: (data: Partial<OPD>) =>
      request<OPD>("/opd", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<OPD>) =>
      request<OPD>(`/opd/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/opd/${id}`, { method: "DELETE" }),
  },

  // ---- Jabatan ----
  jabatan: {
    list: (params?: { opd_id?: string; jenis?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.opd_id) q.set("opd_id", params.opd_id);
      if (params?.jenis) q.set("jenis", params.jenis);
      if (params?.search) q.set("search", params.search);
      return request<Jabatan[]>(`/jabatan${q.toString() ? `?${q}` : ""}`);
    },
    get: (id: string) => request<Jabatan>(`/jabatan/${id}`),
    create: (data: Partial<Jabatan>) =>
      request<Jabatan>("/jabatan", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Jabatan>) =>
      request<Jabatan>(`/jabatan/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/jabatan/${id}`, { method: "DELETE" }),
  },

  // ---- Pejabat ----
  pejabat: {
    list: (params?: { opd_id?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.opd_id) q.set("opd_id", params.opd_id);
      if (params?.search) q.set("search", params.search);
      return request<Pejabat[]>(`/pejabat${q.toString() ? `?${q}` : ""}`);
    },
    get: (id: string) => request<Pejabat>(`/pejabat/${id}`),
    create: (data: Partial<Pejabat>) =>
      request<Pejabat>("/pejabat", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Pejabat>) =>
      request<Pejabat>(`/pejabat/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/pejabat/${id}`, { method: "DELETE" }),
  },

  // ---- Struktur Organisasi ----
  struktur: {
    listByOpd: (opdId: string) =>
      request<StrukturOrganisasi[]>(`/struktur/${opdId}`),
    create: (data: Partial<StrukturOrganisasi>) =>
      request<StrukturOrganisasi>("/struktur", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<StrukturOrganisasi>) =>
      request<StrukturOrganisasi>(`/struktur/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/struktur/${id}`, { method: "DELETE" }),
  },

  // ---- ABK Aktivitas ----
  aktivitas: {
    list: (params?: {
      jabatan_id?: string;
      kategori?: string;
      search?: string;
    }) => {
      const q = new URLSearchParams();
      if (params?.jabatan_id) q.set("jabatan_id", params.jabatan_id);
      if (params?.kategori) q.set("kategori", params.kategori);
      if (params?.search) q.set("search", params.search);
      return request<Aktivitas[]>(
        `/abk/aktivitas${q.toString() ? `?${q}` : ""}`,
      );
    },
    get: (id: string) => request<Aktivitas>(`/abk/aktivitas/${id}`),
    create: (data: Partial<Aktivitas>) =>
      request<Aktivitas>("/abk/aktivitas", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Aktivitas>) =>
      request<Aktivitas>(`/abk/aktivitas/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/abk/aktivitas/${id}`, { method: "DELETE" }),
  },

  // ---- ABK Perhitungan ----
  perhitungan: {
    list: (jabatanId?: string) =>
      request<PerhitunganABK[]>(
        `/abk/perhitungan${jabatanId ? `?jabatan_id=${jabatanId}` : ""}`,
      ),
    get: (id: string) => request<PerhitunganABK>(`/abk/perhitungan/${id}`),
    calculate: (
      jabatanId: string,
      pegawaiExisting: number,
      waktuKerjaEfektif?: number,
    ) =>
      request<PerhitunganABK>("/abk/perhitungan/calc", {
        method: "POST",
        body: JSON.stringify({
          jabatan_id: jabatanId,
          pegawai_existing: pegawaiExisting,
          waktu_kerja_efektif: waktuKerjaEfektif ?? 1250,
        }),
      }),
  },

  // ---- ABK Laporan ----
  laporanAbk: {
    list: (opdId?: string) =>
      request<LaporanABK[]>(`/abk/laporan${opdId ? `?opd_id=${opdId}` : ""}`),
    get: (id: string) => request<LaporanABK>(`/abk/laporan/${id}`),
    create: (data: Partial<LaporanABK>) =>
      request<LaporanABK>("/abk/laporan", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<LaporanABK>) =>
      request<LaporanABK>(`/abk/laporan/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  // ---- ANJAB Dokumen ----
  dokumenAnjab: {
    list: (params?: { opd_id?: string; status?: string; search?: string }) => {
      const q = new URLSearchParams();
      if (params?.opd_id) q.set("opd_id", params.opd_id);
      if (params?.status) q.set("status", params.status);
      if (params?.search) q.set("search", params.search);
      return request<DokumenAnjab[]>(
        `/anjab/dokumen${q.toString() ? `?${q}` : ""}`,
      );
    },
    get: (id: string) => request<DokumenAnjab>(`/anjab/dokumen/${id}`),
    create: (data: Partial<DokumenAnjab>) =>
      request<DokumenAnjab>("/anjab/dokumen", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<DokumenAnjab>) =>
      request<DokumenAnjab>(`/anjab/dokumen/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/anjab/dokumen/${id}`, { method: "DELETE" }),
    submit: (id: string) =>
      request<DokumenAnjab>(`/anjab/dokumen/${id}/submit`, { method: "POST" }),
    approve: (id: string, penyetuju: string) =>
      request<DokumenAnjab>(`/anjab/dokumen/${id}/approve`, {
        method: "POST",
        body: JSON.stringify({ penyetuju }),
      }),
  },

  // ---- ANJAB Spesifikasi ----
  spesifikasi: {
    get: (jabatanId: string) =>
      request<SpesifikasiJabatan>(`/anjab/spesifikasi/${jabatanId}`),
    upsert: (jabatanId: string, data: Partial<SpesifikasiJabatan>) =>
      request<SpesifikasiJabatan>(`/anjab/spesifikasi/${jabatanId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  // ---- ANJAB Uraian ----
  uraian: {
    get: (jabatanId: string) =>
      request<UraianJabatan>(`/anjab/uraian/${jabatanId}`),
    upsert: (jabatanId: string, data: Partial<UraianJabatan>) =>
      request<UraianJabatan>(`/anjab/uraian/${jabatanId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  // ---- SAKIP Nilai ----
  nilaiSakip: {
    list: (params?: { opd_id?: string; tahun?: number }) => {
      const q = new URLSearchParams();
      if (params?.opd_id) q.set("opd_id", params.opd_id);
      if (params?.tahun) q.set("tahun", String(params.tahun));
      return request<NilaiSAKIP[]>(
        `/sakip/nilai${q.toString() ? `?${q}` : ""}`,
      );
    },
    upsert: (data: Partial<NilaiSAKIP>) =>
      request<NilaiSAKIP>("/sakip/nilai", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  // ---- SAKIP Dokumen ----
  dokumenSakip: {
    list: (params?: { opd_id?: string; tahun?: number }) => {
      const q = new URLSearchParams();
      if (params?.opd_id) q.set("opd_id", params.opd_id);
      if (params?.tahun) q.set("tahun", String(params.tahun));
      return request<DokumenSAKIP[]>(
        `/sakip/dokumen${q.toString() ? `?${q}` : ""}`,
      );
    },
    create: (data: Partial<DokumenSAKIP>) =>
      request<DokumenSAKIP>("/sakip/dokumen", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/sakip/dokumen/${id}`, { method: "DELETE" }),
  },

  // ---- Admin Roles ----
  roles: {
    list: () => request<Role[]>("/admin/roles"),
    create: (data: Partial<Role>) =>
      request<Role>("/admin/roles", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Role>) =>
      request<Role>(`/admin/roles/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/admin/roles/${id}`, { method: "DELETE" }),
  },

  // ---- Admin Users ----
  adminUsers: {
    list: () => request<AdminUser[]>("/admin/users"),
    create: (data: {
      email: string;
      nama: string;
      password?: string;
      role_id?: string;
    }) =>
      request<AdminUser>("/admin/users", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<AdminUser> & { password?: string }) =>
      request<AdminUser>(`/admin/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/admin/users/${id}`, { method: "DELETE" }),
  },
};
