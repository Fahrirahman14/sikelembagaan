// Types for ABK Module
export interface Aktivitas {
  id: string;
  jabatanId: string;
  namaJabatan: string;
  uraianTugas: string;
  satuan: string;
  normaWaktu: number; // dalam menit
  targetKuantitas: number;
  frekuensi: "harian" | "mingguan" | "bulanan" | "tahunan";
  kategori: "utama" | "tambahan" | "lainnya";
}

export interface HasilPerhitungan {
  jabatanId: string;
  namaJabatan: string;
  opdId: string;
  namaOpd: string;
  totalWaktuKerja: number; // dalam jam per tahun
  waktuKerjaEfektif: number; // 1250 jam per tahun
  bebanKerja: number;
  kebutuhanPegawai: number;
  pegawaiExisting: number;
  selisih: number;
  keterangan: "Kelebihan" | "Kekurangan" | "Sesuai";
}

export interface LaporanABK {
  opdId: string;
  namaOpd: string;
  periode: string;
  tanggalDibuat: string;
  status: "draft" | "final" | "disetujui";
  totalJabatan: number;
  totalKebutuhanPegawai: number;
  totalPegawaiExisting: number;
  efisiensi: number;
}

// Dummy data untuk aktivitas
export const dummyAktivitas: Aktivitas[] = [
  {
    id: "1",
    jabatanId: "J001",
    namaJabatan: "Kepala Bidang Perencanaan",
    uraianTugas: "Menyusun rencana kerja bidang",
    satuan: "Dokumen",
    normaWaktu: 480,
    targetKuantitas: 12,
    frekuensi: "bulanan",
    kategori: "utama",
  },
  {
    id: "2",
    jabatanId: "J001",
    namaJabatan: "Kepala Bidang Perencanaan",
    uraianTugas: "Koordinasi dengan unit kerja terkait",
    satuan: "Kegiatan",
    normaWaktu: 120,
    targetKuantitas: 4,
    frekuensi: "mingguan",
    kategori: "utama",
  },
  {
    id: "3",
    jabatanId: "J002",
    namaJabatan: "Analis Kebijakan",
    uraianTugas: "Menyusun kajian kebijakan",
    satuan: "Dokumen",
    normaWaktu: 960,
    targetKuantitas: 6,
    frekuensi: "bulanan",
    kategori: "utama",
  },
  {
    id: "4",
    jabatanId: "J002",
    namaJabatan: "Analis Kebijakan",
    uraianTugas: "Menganalisis data dan informasi",
    satuan: "Laporan",
    normaWaktu: 240,
    targetKuantitas: 20,
    frekuensi: "bulanan",
    kategori: "utama",
  },
  {
    id: "5",
    jabatanId: "J003",
    namaJabatan: "Pengelola Data",
    uraianTugas: "Input data ke sistem informasi",
    satuan: "Data",
    normaWaktu: 15,
    targetKuantitas: 50,
    frekuensi: "harian",
    kategori: "utama",
  },
  {
    id: "6",
    jabatanId: "J003",
    namaJabatan: "Pengelola Data",
    uraianTugas: "Verifikasi dan validasi data",
    satuan: "Data",
    normaWaktu: 10,
    targetKuantitas: 100,
    frekuensi: "harian",
    kategori: "utama",
  },
  {
    id: "7",
    jabatanId: "J004",
    namaJabatan: "Arsiparis",
    uraianTugas: "Pengarsipan dokumen",
    satuan: "Berkas",
    normaWaktu: 20,
    targetKuantitas: 30,
    frekuensi: "harian",
    kategori: "utama",
  },
  {
    id: "8",
    jabatanId: "J005",
    namaJabatan: "Pengadministrasi Umum",
    uraianTugas: "Mengelola surat masuk dan keluar",
    satuan: "Surat",
    normaWaktu: 10,
    targetKuantitas: 25,
    frekuensi: "harian",
    kategori: "utama",
  },
];

// Dummy data hasil perhitungan
export const dummyHasilPerhitungan: HasilPerhitungan[] = [
  {
    jabatanId: "J001",
    namaJabatan: "Kepala Bidang Perencanaan",
    opdId: "OPD001",
    namaOpd: "Bappeda",
    totalWaktuKerja: 1380,
    waktuKerjaEfektif: 1250,
    bebanKerja: 1.1,
    kebutuhanPegawai: 2,
    pegawaiExisting: 1,
    selisih: -1,
    keterangan: "Kekurangan",
  },
  {
    jabatanId: "J002",
    namaJabatan: "Analis Kebijakan",
    opdId: "OPD001",
    namaOpd: "Bappeda",
    totalWaktuKerja: 1440,
    waktuKerjaEfektif: 1250,
    bebanKerja: 1.15,
    kebutuhanPegawai: 3,
    pegawaiExisting: 2,
    selisih: -1,
    keterangan: "Kekurangan",
  },
  {
    jabatanId: "J003",
    namaJabatan: "Pengelola Data",
    opdId: "OPD002",
    namaOpd: "Diskominfo",
    totalWaktuKerja: 3125,
    waktuKerjaEfektif: 1250,
    bebanKerja: 2.5,
    kebutuhanPegawai: 3,
    pegawaiExisting: 2,
    selisih: -1,
    keterangan: "Kekurangan",
  },
  {
    jabatanId: "J004",
    namaJabatan: "Arsiparis",
    opdId: "OPD003",
    namaOpd: "Dinas Kearsipan",
    totalWaktuKerja: 1500,
    waktuKerjaEfektif: 1250,
    bebanKerja: 1.2,
    kebutuhanPegawai: 2,
    pegawaiExisting: 3,
    selisih: 1,
    keterangan: "Kelebihan",
  },
  {
    jabatanId: "J005",
    namaJabatan: "Pengadministrasi Umum",
    opdId: "OPD004",
    namaOpd: "Sekretariat Daerah",
    totalWaktuKerja: 1250,
    waktuKerjaEfektif: 1250,
    bebanKerja: 1.0,
    kebutuhanPegawai: 5,
    pegawaiExisting: 5,
    selisih: 0,
    keterangan: "Sesuai",
  },
];

// Dummy data laporan
export const dummyLaporan: LaporanABK[] = [
  {
    opdId: "OPD001",
    namaOpd: "Bappeda",
    periode: "2024",
    tanggalDibuat: "2024-01-15",
    status: "disetujui",
    totalJabatan: 25,
    totalKebutuhanPegawai: 45,
    totalPegawaiExisting: 42,
    efisiensi: 93.3,
  },
  {
    opdId: "OPD002",
    namaOpd: "Diskominfo",
    periode: "2024",
    tanggalDibuat: "2024-01-20",
    status: "final",
    totalJabatan: 18,
    totalKebutuhanPegawai: 32,
    totalPegawaiExisting: 28,
    efisiensi: 87.5,
  },
  {
    opdId: "OPD003",
    namaOpd: "Dinas Kearsipan",
    periode: "2024",
    tanggalDibuat: "2024-02-01",
    status: "draft",
    totalJabatan: 12,
    totalKebutuhanPegawai: 20,
    totalPegawaiExisting: 22,
    efisiensi: 110,
  },
  {
    opdId: "OPD004",
    namaOpd: "Sekretariat Daerah",
    periode: "2024",
    tanggalDibuat: "2024-02-10",
    status: "disetujui",
    totalJabatan: 45,
    totalKebutuhanPegawai: 85,
    totalPegawaiExisting: 82,
    efisiensi: 96.5,
  },
  {
    opdId: "OPD005",
    namaOpd: "Dinas Kesehatan",
    periode: "2024",
    tanggalDibuat: "2024-02-15",
    status: "final",
    totalJabatan: 38,
    totalKebutuhanPegawai: 120,
    totalPegawaiExisting: 115,
    efisiensi: 95.8,
  },
];

// Daftar OPD
export const daftarOPD = [
  { id: "OPD001", nama: "Bappeda" },
  { id: "OPD002", nama: "Diskominfo" },
  { id: "OPD003", nama: "Dinas Kearsipan" },
  { id: "OPD004", nama: "Sekretariat Daerah" },
  { id: "OPD005", nama: "Dinas Kesehatan" },
  { id: "OPD006", nama: "Dinas Pendidikan" },
  { id: "OPD007", nama: "BPKAD" },
  { id: "OPD008", nama: "BKD" },
];

// Daftar Jabatan
export const daftarJabatan = [
  { id: "J001", nama: "Kepala Bidang Perencanaan", opdId: "OPD001" },
  { id: "J002", nama: "Analis Kebijakan", opdId: "OPD001" },
  { id: "J003", nama: "Pengelola Data", opdId: "OPD002" },
  { id: "J004", nama: "Arsiparis", opdId: "OPD003" },
  { id: "J005", nama: "Pengadministrasi Umum", opdId: "OPD004" },
  { id: "J006", nama: "Perencana", opdId: "OPD001" },
  { id: "J007", nama: "Pranata Komputer", opdId: "OPD002" },
  { id: "J008", nama: "Bendahara", opdId: "OPD007" },
];

// Extended OPD Data
export interface OPDDetail {
  id: string;
  kode: string;
  nama: string;
  alamat: string;
  telepon: string;
  email: string;
  kepala: string;
  nipKepala: string;
  totalPegawai: number;
  totalJabatan: number;
  statusAnjab: "belum" | "proses" | "selesai";
  statusAbk: "belum" | "proses" | "selesai";
}

export const opdDetailList: OPDDetail[] = [
  {
    id: "OPD001",
    kode: "1.05.01",
    nama: "Badan Perencanaan Pembangunan Daerah",
    alamat: "Jl. Sudirman No. 10",
    telepon: "(0123) 456789",
    email: "bappeda@pemkab.go.id",
    kepala: "Dr. H. Ahmad Fauzi, M.Si",
    nipKepala: "196512101990031001",
    totalPegawai: 42,
    totalJabatan: 25,
    statusAnjab: "selesai",
    statusAbk: "selesai",
  },
  {
    id: "OPD002",
    kode: "2.16.01",
    nama: "Dinas Komunikasi dan Informatika",
    alamat: "Jl. Gatot Subroto No. 25",
    telepon: "(0123) 456790",
    email: "diskominfo@pemkab.go.id",
    kepala: "Ir. Bambang Sutrisno, M.T",
    nipKepala: "197003151995031002",
    totalPegawai: 28,
    totalJabatan: 18,
    statusAnjab: "selesai",
    statusAbk: "proses",
  },
  {
    id: "OPD003",
    kode: "2.18.01",
    nama: "Dinas Kearsipan dan Perpustakaan",
    alamat: "Jl. Diponegoro No. 15",
    telepon: "(0123) 456791",
    email: "arsip@pemkab.go.id",
    kepala: "Dra. Siti Rahayu, M.Hum",
    nipKepala: "196808201993032003",
    totalPegawai: 22,
    totalJabatan: 12,
    statusAnjab: "proses",
    statusAbk: "belum",
  },
  {
    id: "OPD004",
    kode: "4.01.01",
    nama: "Sekretariat Daerah",
    alamat: "Jl. Pahlawan No. 1",
    telepon: "(0123) 456700",
    email: "setda@pemkab.go.id",
    kepala: "H. Muhammad Ridwan, S.H., M.H.",
    nipKepala: "196505101988031001",
    totalPegawai: 82,
    totalJabatan: 45,
    statusAnjab: "selesai",
    statusAbk: "selesai",
  },
  {
    id: "OPD005",
    kode: "1.02.01",
    nama: "Dinas Kesehatan",
    alamat: "Jl. Kesehatan No. 5",
    telepon: "(0123) 456792",
    email: "dinkes@pemkab.go.id",
    kepala: "dr. Hj. Nurul Hidayah, M.Kes",
    nipKepala: "197205151998032004",
    totalPegawai: 115,
    totalJabatan: 38,
    statusAnjab: "selesai",
    statusAbk: "proses",
  },
  {
    id: "OPD006",
    kode: "1.01.01",
    nama: "Dinas Pendidikan",
    alamat: "Jl. Pendidikan No. 20",
    telepon: "(0123) 456793",
    email: "disdik@pemkab.go.id",
    kepala: "Prof. Dr. H. Suparman, M.Pd",
    nipKepala: "196301011985031001",
    totalPegawai: 150,
    totalJabatan: 52,
    statusAnjab: "proses",
    statusAbk: "belum",
  },
  {
    id: "OPD007",
    kode: "5.02.01",
    nama: "Badan Pengelola Keuangan dan Aset Daerah",
    alamat: "Jl. Keuangan No. 8",
    telepon: "(0123) 456794",
    email: "bpkad@pemkab.go.id",
    kepala: "Drs. H. Agus Salim, M.M.",
    nipKepala: "196709121992031005",
    totalPegawai: 65,
    totalJabatan: 30,
    statusAnjab: "selesai",
    statusAbk: "selesai",
  },
  {
    id: "OPD008",
    kode: "5.03.01",
    nama: "Badan Kepegawaian Daerah",
    alamat: "Jl. Kepegawaian No. 12",
    telepon: "(0123) 456795",
    email: "bkd@pemkab.go.id",
    kepala: "Drs. H. Sutarno, M.Si",
    nipKepala: "196811201990031006",
    totalPegawai: 48,
    totalJabatan: 22,
    statusAnjab: "selesai",
    statusAbk: "proses",
  },
];

// Pejabat Data
export interface Pejabat {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  eselon: string;
  opdId: string;
  namaOpd: string;
  pangkat: string;
  golongan: string;
  tmtJabatan: string;
  pendidikan: string;
  foto?: string;
}

export const pejabatList: Pejabat[] = [
  {
    id: "PJ001",
    nip: "196512101990031001",
    nama: "Dr. H. Ahmad Fauzi, M.Si",
    jabatan: "Kepala Badan",
    eselon: "II.b",
    opdId: "OPD001",
    namaOpd: "Bappeda",
    pangkat: "Pembina Utama Muda",
    golongan: "IV/c",
    tmtJabatan: "2020-03-01",
    pendidikan: "S3 Administrasi Publik",
  },
  {
    id: "PJ002",
    nip: "197003151995031002",
    nama: "Ir. Bambang Sutrisno, M.T",
    jabatan: "Kepala Dinas",
    eselon: "II.b",
    opdId: "OPD002",
    namaOpd: "Diskominfo",
    pangkat: "Pembina Utama Muda",
    golongan: "IV/c",
    tmtJabatan: "2021-06-15",
    pendidikan: "S2 Teknik Informatika",
  },
  {
    id: "PJ003",
    nip: "197205101997031003",
    nama: "Drs. H. Sukardi, M.M.",
    jabatan: "Sekretaris",
    eselon: "III.a",
    opdId: "OPD001",
    namaOpd: "Bappeda",
    pangkat: "Pembina",
    golongan: "IV/a",
    tmtJabatan: "2019-08-01",
    pendidikan: "S2 Manajemen",
  },
  {
    id: "PJ004",
    nip: "198001201999032004",
    nama: "Hj. Dewi Sartika, S.E., M.Ak.",
    jabatan: "Kepala Bidang Perencanaan",
    eselon: "III.b",
    opdId: "OPD001",
    namaOpd: "Bappeda",
    pangkat: "Pembina",
    golongan: "IV/a",
    tmtJabatan: "2022-01-10",
    pendidikan: "S2 Akuntansi",
  },
  {
    id: "PJ005",
    nip: "198506152010011005",
    nama: "Muhammad Rizky, S.Kom., M.T.I.",
    jabatan: "Kepala Bidang E-Government",
    eselon: "III.b",
    opdId: "OPD002",
    namaOpd: "Diskominfo",
    pangkat: "Penata Tk. I",
    golongan: "III/d",
    tmtJabatan: "2023-02-20",
    pendidikan: "S2 Teknologi Informasi",
  },
  {
    id: "PJ006",
    nip: "196808201993032003",
    nama: "Dra. Siti Rahayu, M.Hum",
    jabatan: "Kepala Dinas",
    eselon: "II.b",
    opdId: "OPD003",
    namaOpd: "Dinas Kearsipan",
    pangkat: "Pembina Utama Muda",
    golongan: "IV/c",
    tmtJabatan: "2020-05-01",
    pendidikan: "S2 Ilmu Perpustakaan",
  },
  {
    id: "PJ007",
    nip: "196505101988031001",
    nama: "H. Muhammad Ridwan, S.H., M.H.",
    jabatan: "Sekretaris Daerah",
    eselon: "II.a",
    opdId: "OPD004",
    namaOpd: "Sekretariat Daerah",
    pangkat: "Pembina Utama Madya",
    golongan: "IV/d",
    tmtJabatan: "2019-01-15",
    pendidikan: "S2 Ilmu Hukum",
  },
  {
    id: "PJ008",
    nip: "197205151998032004",
    nama: "dr. Hj. Nurul Hidayah, M.Kes",
    jabatan: "Kepala Dinas",
    eselon: "II.b",
    opdId: "OPD005",
    namaOpd: "Dinas Kesehatan",
    pangkat: "Pembina Utama Muda",
    golongan: "IV/c",
    tmtJabatan: "2021-03-01",
    pendidikan: "S2 Kesehatan Masyarakat",
  },
];

// Jabatan Detail untuk Anjab
export interface JabatanDetail {
  id: string;
  kodeJabatan: string;
  namaJabatan: string;
  jenisJabatan: "struktural" | "fungsional" | "pelaksana";
  eselon?: string;
  opdId: string;
  namaOpd: string;
  unitKerja: string;
  ikhtisar: string;
  kualifikasiPendidikan: string;
  pengalaman: string;
  pelatihan: string[];
  statusAnjab: "draft" | "final" | "disetujui";
}

export const jabatanDetailList: JabatanDetail[] = [
  {
    id: "JD001",
    kodeJabatan: "1.05.01.001",
    namaJabatan: "Kepala Badan",
    jenisJabatan: "struktural",
    eselon: "II.b",
    opdId: "OPD001",
    namaOpd: "Bappeda",
    unitKerja: "Bappeda",
    ikhtisar: "Memimpin dan mengoordinasikan pelaksanaan tugas dan fungsi Badan Perencanaan Pembangunan Daerah",
    kualifikasiPendidikan: "S1/S2 Ekonomi/Teknik/Administrasi",
    pengalaman: "Minimal 5 tahun di bidang perencanaan",
    pelatihan: ["Diklatpim II", "Manajemen Strategis", "Perencanaan Pembangunan"],
    statusAnjab: "disetujui",
  },
  {
    id: "JD002",
    kodeJabatan: "1.05.01.002",
    namaJabatan: "Sekretaris",
    jenisJabatan: "struktural",
    eselon: "III.a",
    opdId: "OPD001",
    namaOpd: "Bappeda",
    unitKerja: "Sekretariat",
    ikhtisar: "Mengoordinasikan penyusunan program, pengelolaan keuangan, kepegawaian, dan umum",
    kualifikasiPendidikan: "S1 Administrasi/Manajemen/Ekonomi",
    pengalaman: "Minimal 4 tahun di bidang administrasi",
    pelatihan: ["Diklatpim III", "Manajemen Keuangan", "Administrasi Perkantoran"],
    statusAnjab: "disetujui",
  },
  {
    id: "JD003",
    kodeJabatan: "1.05.01.003",
    namaJabatan: "Kepala Bidang Perencanaan",
    jenisJabatan: "struktural",
    eselon: "III.b",
    opdId: "OPD001",
    namaOpd: "Bappeda",
    unitKerja: "Bidang Perencanaan",
    ikhtisar: "Memimpin dan mengoordinasikan penyusunan dokumen perencanaan daerah",
    kualifikasiPendidikan: "S1/S2 Ekonomi/Perencanaan",
    pengalaman: "Minimal 3 tahun di bidang perencanaan",
    pelatihan: ["Diklatpim III", "Perencanaan Pembangunan", "Analisis Kebijakan"],
    statusAnjab: "disetujui",
  },
  {
    id: "JD004",
    kodeJabatan: "1.05.01.101",
    namaJabatan: "Analis Kebijakan",
    jenisJabatan: "fungsional",
    opdId: "OPD001",
    namaOpd: "Bappeda",
    unitKerja: "Bidang Perencanaan",
    ikhtisar: "Melaksanakan analisis dan evaluasi kebijakan publik",
    kualifikasiPendidikan: "S1 Administrasi Publik/Ekonomi/Hukum",
    pengalaman: "Minimal 2 tahun di bidang analisis kebijakan",
    pelatihan: ["Analisis Kebijakan Publik", "Metode Penelitian", "Evaluasi Program"],
    statusAnjab: "final",
  },
  {
    id: "JD005",
    kodeJabatan: "2.16.01.101",
    namaJabatan: "Pranata Komputer",
    jenisJabatan: "fungsional",
    opdId: "OPD002",
    namaOpd: "Diskominfo",
    unitKerja: "Bidang E-Government",
    ikhtisar: "Melaksanakan kegiatan teknologi informasi berbasis komputer",
    kualifikasiPendidikan: "D3/S1 Teknik Informatika/Sistem Informasi",
    pengalaman: "Minimal 1 tahun di bidang IT",
    pelatihan: ["Pengembangan Sistem", "Database Administrator", "Network Security"],
    statusAnjab: "final",
  },
  {
    id: "JD006",
    kodeJabatan: "2.16.01.201",
    namaJabatan: "Pengelola Data",
    jenisJabatan: "pelaksana",
    opdId: "OPD002",
    namaOpd: "Diskominfo",
    unitKerja: "Bidang Data dan Statistik",
    ikhtisar: "Melaksanakan pengelolaan data dan informasi",
    kualifikasiPendidikan: "D3/S1 Statistik/Informatika",
    pengalaman: "Pengalaman di bidang pengolahan data",
    pelatihan: ["Pengolahan Data", "Microsoft Office", "Database Management"],
    statusAnjab: "draft",
  },
  {
    id: "JD007",
    kodeJabatan: "2.18.01.101",
    namaJabatan: "Arsiparis",
    jenisJabatan: "fungsional",
    opdId: "OPD003",
    namaOpd: "Dinas Kearsipan",
    unitKerja: "Bidang Kearsipan",
    ikhtisar: "Melaksanakan pengelolaan arsip sesuai dengan kaidah kearsipan",
    kualifikasiPendidikan: "D3/S1 Kearsipan/Perpustakaan",
    pengalaman: "Minimal 1 tahun di bidang kearsipan",
    pelatihan: ["Manajemen Kearsipan", "Preservasi Arsip", "Digitalisasi Arsip"],
    statusAnjab: "draft",
  },
  {
    id: "JD008",
    kodeJabatan: "4.01.01.201",
    namaJabatan: "Pengadministrasi Umum",
    jenisJabatan: "pelaksana",
    opdId: "OPD004",
    namaOpd: "Sekretariat Daerah",
    unitKerja: "Bagian Umum",
    ikhtisar: "Melaksanakan administrasi umum dan ketatausahaan",
    kualifikasiPendidikan: "SLTA/D3 Administrasi",
    pengalaman: "Tidak dipersyaratkan",
    pelatihan: ["Administrasi Perkantoran", "Tata Naskah Dinas"],
    statusAnjab: "disetujui",
  },
];

// Dokumen Anjab
export interface DokumenAnjab {
  id: string;
  opdId: string;
  namaOpd: string;
  nomorDokumen: string;
  tanggalDibuat: string;
  tanggalDisetujui?: string;
  periode: string;
  jumlahJabatan: number;
  status: "draft" | "review" | "revisi" | "disetujui";
  pembuat: string;
  penyetuju?: string;
}

export const dokumenAnjabList: DokumenAnjab[] = [
  {
    id: "DOC001",
    opdId: "OPD001",
    namaOpd: "Bappeda",
    nomorDokumen: "DOK/ANJAB/001/2024",
    tanggalDibuat: "2024-01-10",
    tanggalDisetujui: "2024-02-15",
    periode: "2024",
    jumlahJabatan: 25,
    status: "disetujui",
    pembuat: "Admin Bappeda",
    penyetuju: "Kepala BKD",
  },
  {
    id: "DOC002",
    opdId: "OPD002",
    namaOpd: "Diskominfo",
    nomorDokumen: "DOK/ANJAB/002/2024",
    tanggalDibuat: "2024-01-15",
    tanggalDisetujui: "2024-02-20",
    periode: "2024",
    jumlahJabatan: 18,
    status: "disetujui",
    pembuat: "Admin Diskominfo",
    penyetuju: "Kepala BKD",
  },
  {
    id: "DOC003",
    opdId: "OPD003",
    namaOpd: "Dinas Kearsipan",
    nomorDokumen: "DOK/ANJAB/003/2024",
    tanggalDibuat: "2024-02-01",
    periode: "2024",
    jumlahJabatan: 12,
    status: "review",
    pembuat: "Admin Kearsipan",
  },
  {
    id: "DOC004",
    opdId: "OPD004",
    namaOpd: "Sekretariat Daerah",
    nomorDokumen: "DOK/ANJAB/004/2024",
    tanggalDibuat: "2024-01-05",
    tanggalDisetujui: "2024-01-25",
    periode: "2024",
    jumlahJabatan: 45,
    status: "disetujui",
    pembuat: "Admin Setda",
    penyetuju: "Kepala BKD",
  },
  {
    id: "DOC005",
    opdId: "OPD005",
    namaOpd: "Dinas Kesehatan",
    nomorDokumen: "DOK/ANJAB/005/2024",
    tanggalDibuat: "2024-02-10",
    periode: "2024",
    jumlahJabatan: 38,
    status: "revisi",
    pembuat: "Admin Dinkes",
  },
  {
    id: "DOC006",
    opdId: "OPD006",
    namaOpd: "Dinas Pendidikan",
    nomorDokumen: "DOK/ANJAB/006/2024",
    tanggalDibuat: "2024-02-20",
    periode: "2024",
    jumlahJabatan: 52,
    status: "draft",
    pembuat: "Admin Disdik",
  },
];

// Struktur Organisasi
export interface StrukturOrganisasi {
  id: string;
  opdId: string;
  jabatan: string;
  nama?: string;
  nip?: string;
  parentId?: string;
  level: number;
}

export const strukturOrganisasiList: StrukturOrganisasi[] = [
  { id: "SO001", opdId: "OPD001", jabatan: "Kepala Badan", nama: "Dr. H. Ahmad Fauzi, M.Si", nip: "196512101990031001", level: 1 },
  { id: "SO002", opdId: "OPD001", jabatan: "Sekretaris", nama: "Drs. H. Sukardi, M.M.", nip: "197205101997031003", parentId: "SO001", level: 2 },
  { id: "SO003", opdId: "OPD001", jabatan: "Kepala Bidang Perencanaan", nama: "Hj. Dewi Sartika, S.E., M.Ak.", nip: "198001201999032004", parentId: "SO001", level: 2 },
  { id: "SO004", opdId: "OPD001", jabatan: "Kepala Bidang Pengendalian", nama: "Ir. Hendra Wijaya, M.T.", nip: "197508151999031001", parentId: "SO001", level: 2 },
  { id: "SO005", opdId: "OPD001", jabatan: "Kepala Bidang Penelitian", nama: "Dr. Ratna Sari, M.Si", nip: "198003202005012001", parentId: "SO001", level: 2 },
  { id: "SO006", opdId: "OPD001", jabatan: "Kasubag Umum", nama: "Sri Wahyuni, S.E.", nip: "198505102010012002", parentId: "SO002", level: 3 },
  { id: "SO007", opdId: "OPD001", jabatan: "Kasubag Keuangan", nama: "Andi Pratama, S.E., M.Ak.", nip: "198708152012011003", parentId: "SO002", level: 3 },
  { id: "SO008", opdId: "OPD001", jabatan: "Kasubag Program", nama: "Rina Susanti, S.Sos.", nip: "198901202015012001", parentId: "SO002", level: 3 },
];

// SAKIP Data
export interface DokumenSAKIP {
  id: string;
  opdId: string;
  namaOpd: string;
  tahun: number;
  jenisDokumen: "renstra" | "renja" | "lakip" | "iku" | "tapkin" | "lainnya";
  namaDokumen: string;
  linkDokumen?: string;
  filePath?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface NilaiSAKIP {
  id: string;
  opdId: string;
  namaOpd: string;
  tahun: number;
  nilaiPerencanaan: number;
  nilaiPengukuran: number;
  nilaiPelaporan: number;
  nilaiEvaluasi: number;
  nilaiCapaian: number;
  nilaiTotal: number;
  predikat: "AA" | "A" | "BB" | "B" | "CC" | "C" | "D";
  catatan?: string;
  reviewedAt: string;
  reviewedBy: string;
}

export const dokumenSAKIPList: DokumenSAKIP[] = [
  {
    id: "SAK001",
    opdId: "OPD001",
    namaOpd: "Bappeda",
    tahun: 2024,
    jenisDokumen: "lakip",
    namaDokumen: "LAKIP Bappeda Tahun 2023",
    linkDokumen: "https://example.com/lakip-bappeda-2023.pdf",
    uploadedAt: "2024-02-15",
    uploadedBy: "Admin Bappeda",
  },
  {
    id: "SAK002",
    opdId: "OPD001",
    namaOpd: "Bappeda",
    tahun: 2024,
    jenisDokumen: "renstra",
    namaDokumen: "Renstra Bappeda 2021-2026",
    linkDokumen: "https://example.com/renstra-bappeda.pdf",
    uploadedAt: "2024-01-10",
    uploadedBy: "Admin Bappeda",
  },
  {
    id: "SAK003",
    opdId: "OPD002",
    namaOpd: "Diskominfo",
    tahun: 2024,
    jenisDokumen: "lakip",
    namaDokumen: "LAKIP Diskominfo Tahun 2023",
    linkDokumen: "https://example.com/lakip-diskominfo-2023.pdf",
    uploadedAt: "2024-02-10",
    uploadedBy: "Admin Diskominfo",
  },
  {
    id: "SAK004",
    opdId: "OPD004",
    namaOpd: "Sekretariat Daerah",
    tahun: 2024,
    jenisDokumen: "iku",
    namaDokumen: "IKU Setda Tahun 2024",
    linkDokumen: "https://example.com/iku-setda-2024.pdf",
    uploadedAt: "2024-01-20",
    uploadedBy: "Admin Setda",
  },
  {
    id: "SAK005",
    opdId: "OPD005",
    namaOpd: "Dinas Kesehatan",
    tahun: 2024,
    jenisDokumen: "renja",
    namaDokumen: "Renja Dinkes Tahun 2024",
    linkDokumen: "https://example.com/renja-dinkes-2024.pdf",
    uploadedAt: "2024-01-25",
    uploadedBy: "Admin Dinkes",
  },
];

export const nilaiSAKIPList: NilaiSAKIP[] = [
  {
    id: "NS001",
    opdId: "OPD001",
    namaOpd: "Bappeda",
    tahun: 2023,
    nilaiPerencanaan: 28.5,
    nilaiPengukuran: 23.0,
    nilaiPelaporan: 14.5,
    nilaiEvaluasi: 9.0,
    nilaiCapaian: 10.0,
    nilaiTotal: 85.0,
    predikat: "A",
    catatan: "Kinerja sangat baik, perlu peningkatan pada pengukuran kinerja",
    reviewedAt: "2024-03-01",
    reviewedBy: "Tim Inspektorat",
  },
  {
    id: "NS002",
    opdId: "OPD002",
    namaOpd: "Diskominfo",
    tahun: 2023,
    nilaiPerencanaan: 26.0,
    nilaiPengukuran: 22.5,
    nilaiPelaporan: 13.0,
    nilaiEvaluasi: 8.5,
    nilaiCapaian: 9.5,
    nilaiTotal: 79.5,
    predikat: "BB",
    catatan: "Kinerja baik, perlu perbaikan dokumentasi pelaporan",
    reviewedAt: "2024-03-02",
    reviewedBy: "Tim Inspektorat",
  },
  {
    id: "NS003",
    opdId: "OPD003",
    namaOpd: "Dinas Kearsipan",
    tahun: 2023,
    nilaiPerencanaan: 24.0,
    nilaiPengukuran: 20.0,
    nilaiPelaporan: 12.0,
    nilaiEvaluasi: 7.5,
    nilaiCapaian: 8.0,
    nilaiTotal: 71.5,
    predikat: "BB",
    catatan: "Perlu peningkatan pada semua aspek",
    reviewedAt: "2024-03-03",
    reviewedBy: "Tim Inspektorat",
  },
  {
    id: "NS004",
    opdId: "OPD004",
    namaOpd: "Sekretariat Daerah",
    tahun: 2023,
    nilaiPerencanaan: 29.0,
    nilaiPengukuran: 24.0,
    nilaiPelaporan: 14.0,
    nilaiEvaluasi: 9.5,
    nilaiCapaian: 10.5,
    nilaiTotal: 87.0,
    predikat: "A",
    catatan: "Kinerja sangat baik, menjadi contoh bagi OPD lain",
    reviewedAt: "2024-03-01",
    reviewedBy: "Tim Inspektorat",
  },
  {
    id: "NS005",
    opdId: "OPD005",
    namaOpd: "Dinas Kesehatan",
    tahun: 2023,
    nilaiPerencanaan: 27.0,
    nilaiPengukuran: 22.0,
    nilaiPelaporan: 13.5,
    nilaiEvaluasi: 8.0,
    nilaiCapaian: 9.0,
    nilaiTotal: 79.5,
    predikat: "BB",
    catatan: "Kinerja baik, perlu peningkatan evaluasi internal",
    reviewedAt: "2024-03-04",
    reviewedBy: "Tim Inspektorat",
  },
  {
    id: "NS006",
    opdId: "OPD006",
    namaOpd: "Dinas Pendidikan",
    tahun: 2023,
    nilaiPerencanaan: 25.5,
    nilaiPengukuran: 21.0,
    nilaiPelaporan: 12.5,
    nilaiEvaluasi: 7.0,
    nilaiCapaian: 8.5,
    nilaiTotal: 74.5,
    predikat: "BB",
    catatan: "Perlu perbaikan pada evaluasi kinerja",
    reviewedAt: "2024-03-05",
    reviewedBy: "Tim Inspektorat",
  },
  {
    id: "NS007",
    opdId: "OPD007",
    namaOpd: "BPKAD",
    tahun: 2023,
    nilaiPerencanaan: 28.0,
    nilaiPengukuran: 23.5,
    nilaiPelaporan: 14.0,
    nilaiEvaluasi: 9.0,
    nilaiCapaian: 10.0,
    nilaiTotal: 84.5,
    predikat: "A",
    catatan: "Kinerja sangat baik dalam pengelolaan keuangan",
    reviewedAt: "2024-03-02",
    reviewedBy: "Tim Inspektorat",
  },
  {
    id: "NS008",
    opdId: "OPD008",
    namaOpd: "BKD",
    tahun: 2023,
    nilaiPerencanaan: 27.5,
    nilaiPengukuran: 22.5,
    nilaiPelaporan: 13.5,
    nilaiEvaluasi: 8.5,
    nilaiCapaian: 9.5,
    nilaiTotal: 81.5,
    predikat: "A",
    catatan: "Kinerja sangat baik dalam manajemen kepegawaian",
    reviewedAt: "2024-03-03",
    reviewedBy: "Tim Inspektorat",
  },
]; 