-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 30, 2026 at 11:23 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `si-kelembagaan`
--

-- --------------------------------------------------------

--
-- Table structure for table `aktivitas`
--

CREATE TABLE `aktivitas` (
  `id` varchar(36) NOT NULL,
  `jabatan_id` varchar(36) NOT NULL,
  `uraian_tugas` text NOT NULL,
  `satuan` varchar(64) NOT NULL,
  `norma_waktu` double NOT NULL,
  `target_kuantitas` double NOT NULL,
  `frekuensi` varchar(16) NOT NULL,
  `kategori` varchar(16) NOT NULL DEFAULT 'utama',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `aktivitas`
--

INSERT INTO `aktivitas` (`id`, `jabatan_id`, `uraian_tugas`, `satuan`, `norma_waktu`, `target_kuantitas`, `frekuensi`, `kategori`, `created_at`, `updated_at`, `deleted_at`) VALUES
('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Memimpin rapat koordinasi pelaksanaan program pendidikan', 'kegiatan', 120, 12, 'bulanan', 'utama', '2026-01-15 08:00:00', '2026-01-15 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Menandatangani dokumen kebijakan dan surat keputusan dinas', 'dokumen', 30, 50, 'bulanan', 'utama', '2026-01-15 08:00:00', '2026-01-15 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', 'Menyusun laporan bulanan pelaksanaan program dan kegiatan dinas', 'laporan', 240, 12, 'bulanan', 'utama', '2026-01-15 08:00:00', '2026-01-15 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002', 'Mengkoordinasikan penyusunan RKA dan DPA Dinas Pendidikan', 'dokumen', 480, 2, 'tahunan', 'utama', '2026-01-15 08:00:00', '2026-01-15 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000003', 'Melaksanakan monitoring dan evaluasi pelaksanaan kurikulum SD', 'kegiatan', 180, 12, 'bulanan', 'utama', '2026-01-15 08:00:00', '2026-01-15 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000003', 'Menyusun laporan pembinaan dan pengawasan sekolah dasar', 'laporan', 240, 4, 'triwulanan', 'utama', '2026-01-15 08:00:00', '2026-01-15 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000004', 'Memimpin rapat evaluasi program kesehatan bulanan', 'kegiatan', 120, 12, 'bulanan', 'utama', '2026-02-01 08:00:00', '2026-02-01 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000004', 'Menandatangani laporan kinerja bidang kesehatan masyarakat', 'laporan', 60, 4, 'triwulanan', 'utama', '2026-02-01 08:00:00', '2026-02-01 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000005', 'Menyusun program kerja dan rencana anggaran Dinas Kesehatan', 'dokumen', 480, 1, 'tahunan', 'utama', '2026-02-01 08:00:00', '2026-02-01 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000005', 'Mengelola administrasi kepegawaian Dinas Kesehatan', 'kegiatan', 120, 12, 'bulanan', 'utama', '2026-02-01 08:00:00', '2026-02-01 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000006', 'Melaksanakan pemeriksaan dan pengobatan pasien rawat jalan', 'pasien', 30, 400, 'bulanan', 'utama', '2026-02-01 08:00:00', '2026-02-01 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000006', 'Melaksanakan konsultasi dan rujukan pasien ke spesialis', 'kegiatan', 20, 50, 'bulanan', 'utama', '2026-02-01 08:00:00', '2026-02-01 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000007', 'Memimpin rapat koordinasi pembangunan infrastruktur daerah', 'kegiatan', 120, 12, 'bulanan', 'utama', '2026-01-20 08:00:00', '2026-01-20 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000007', 'Melakukan inspeksi lapangan pelaksanaan proyek infrastruktur', 'kegiatan', 240, 24, 'bulanan', 'utama', '2026-01-20 08:00:00', '2026-01-20 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000008', 'Menyusun program penanganan dan pemeliharaan jalan kabupaten', 'dokumen', 480, 2, 'tahunan', 'utama', '2026-01-20 08:00:00', '2026-01-20 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000008', 'Melakukan pengawasan pelaksanaan pekerjaan jalan dan jembatan', 'kegiatan', 240, 24, 'bulanan', 'utama', '2026-01-20 08:00:00', '2026-01-20 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000009', 'Menyusun dokumen rencana tata ruang wilayah', 'dokumen', 960, 1, 'tahunan', 'utama', '2026-01-20 08:00:00', '2026-01-20 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000009', 'Melaksanakan kajian teknis penataan ruang', 'laporan', 480, 4, 'triwulanan', 'utama', '2026-01-20 08:00:00', '2026-01-20 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000010', 'Memimpin penyusunan RPJMD dan RKPD', 'dokumen', 960, 1, 'tahunan', 'utama', '2026-03-05 08:00:00', '2026-03-05 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000010', 'Mengkoordinasikan musyawarah perencanaan pembangunan (Musrenbang)', 'kegiatan', 480, 2, 'tahunan', 'utama', '2026-03-05 08:00:00', '2026-03-05 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000021', 'c0000000-0000-0000-0000-000000000011', 'Menyusun laporan kinerja dan akuntabilitas Bappeda', 'laporan', 480, 1, 'tahunan', 'utama', '2026-03-05 08:00:00', '2026-03-05 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-000000000011', 'Mengelola keuangan dan administrasi umum Bappeda', 'kegiatan', 120, 12, 'bulanan', 'utama', '2026-03-05 08:00:00', '2026-03-05 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000023', 'c0000000-0000-0000-0000-000000000012', 'Melaksanakan analisis data dan indikator pembangunan daerah', 'laporan', 240, 12, 'bulanan', 'utama', '2026-03-05 08:00:00', '2026-03-05 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000024', 'c0000000-0000-0000-0000-000000000012', 'Menyusun bahan paparan dan naskah perencanaan pembangunan', 'dokumen', 180, 12, 'bulanan', 'utama', '2026-03-05 08:00:00', '2026-03-05 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000025', 'c0000000-0000-0000-0000-000000000013', 'Memimpin rapat koordinasi antar perangkat daerah', 'kegiatan', 120, 12, 'bulanan', 'utama', '2026-01-25 08:00:00', '2026-01-25 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000026', 'c0000000-0000-0000-0000-000000000013', 'Menandatangani dokumen kebijakan daerah dan surat keputusan Bupati', 'dokumen', 30, 100, 'bulanan', 'utama', '2026-01-25 08:00:00', '2026-01-25 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000027', 'c0000000-0000-0000-0000-000000000014', 'Mengkoordinasikan penyelenggaraan pemerintahan umum daerah', 'kegiatan', 180, 12, 'bulanan', 'utama', '2026-01-25 08:00:00', '2026-01-25 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000028', 'c0000000-0000-0000-0000-000000000014', 'Menyusun laporan penyelenggaraan pemerintahan daerah (LPPD)', 'laporan', 960, 1, 'tahunan', 'utama', '2026-01-25 08:00:00', '2026-01-25 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000029', 'c0000000-0000-0000-0000-000000000015', 'Menyusun dan menelaah Peraturan Daerah dan Peraturan Bupati', 'dokumen', 480, 12, 'bulanan', 'utama', '2026-01-25 08:00:00', '2026-01-25 08:00:00', NULL),
('e0000000-0000-0000-0000-000000000030', 'c0000000-0000-0000-0000-000000000015', 'Memberikan pendapat hukum dan konsultasi hukum pemerintah daerah', 'kegiatan', 120, 24, 'bulanan', 'utama', '2026-01-25 08:00:00', '2026-01-25 08:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `dokumen_anjab`
--

CREATE TABLE `dokumen_anjab` (
  `id` varchar(36) NOT NULL,
  `opd_id` varchar(36) NOT NULL,
  `nomor_dokumen` varchar(64) DEFAULT NULL,
  `nama_opd` varchar(255) NOT NULL,
  `periode` varchar(16) NOT NULL,
  `jumlah_jabatan` int NOT NULL DEFAULT '0',
  `tanggal_dibuat` date NOT NULL,
  `status` varchar(16) NOT NULL DEFAULT 'draft',
  `pembuat` varchar(255) DEFAULT NULL,
  `penyetuju` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dokumen_anjab`
--

INSERT INTO `dokumen_anjab` (`id`, `opd_id`, `nomor_dokumen`, `nama_opd`, `periode`, `jumlah_jabatan`, `tanggal_dibuat`, `status`, `pembuat`, `penyetuju`, `created_at`, `updated_at`, `deleted_at`) VALUES
('aa000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'DOK/ANJAB/DISDIK/2025/001', 'Dinas Pendidikan dan Kebudayaan', '2025', 3, '2026-01-15', 'disetujui', 'Dra. Hj. Siti Aminah, M.Pd', 'Dr. H. Budi Santoso, M.Pd', '2026-01-15 09:00:00', '2026-03-01 14:00:00', NULL),
('aa000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'DOK/ANJAB/DINKES/2025/001', 'Dinas Kesehatan', '2025', 3, '2026-02-10', 'review', 'drg. H. Andi Pratama, M.Kes', NULL, '2026-02-10 09:00:00', '2026-02-20 10:00:00', NULL),
('aa000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'DOK/ANJAB/DPUPR/2025/001', 'Dinas Pekerjaan Umum dan Penataan Ruang', '2025', 3, '2026-01-20', 'disetujui', 'Drs. Hendra Kusuma, M.T', 'Ir. Ahmad Fauzi, M.T', '2026-01-20 09:00:00', '2026-03-20 14:00:00', NULL),
('aa000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 'DOK/ANJAB/BAPPEDA/2025/001', 'Badan Perencanaan Pembangunan Daerah', '2025', 3, '2026-03-05', 'draft', 'Dra. Maya Sari, M.Si', NULL, '2026-03-05 09:00:00', '2026-03-05 09:00:00', NULL),
('aa000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', 'DOK/ANJAB/SETDA/2025/001', 'Sekretariat Daerah', '2025', 3, '2026-01-25', 'review', 'Andi Kurniawan, S.H, M.Hum', NULL, '2026-01-25 09:00:00', '2026-04-01 11:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `dokumen_sakip`
--

CREATE TABLE `dokumen_sakip` (
  `id` varchar(36) NOT NULL,
  `opd_id` varchar(36) NOT NULL,
  `tahun` int NOT NULL,
  `jenis_dokumen` varchar(32) NOT NULL,
  `nama_dokumen` varchar(255) NOT NULL,
  `file_path` varchar(512) DEFAULT NULL,
  `uploaded_by` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dokumen_sakip`
--

INSERT INTO `dokumen_sakip` (`id`, `opd_id`, `tahun`, `jenis_dokumen`, `nama_dokumen`, `file_path`, `uploaded_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
('cc000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 2025, 'renstra', 'Renstra Dinas Pendidikan 2021-2026', '/dokumen/disdik/renstra-2021-2026.pdf', 'Dra. Hj. Siti Aminah, M.Pd', '2026-01-10 09:00:00', '2026-01-10 09:00:00', NULL),
('cc000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 2025, 'lkjip', 'LKJIP Dinas Pendidikan Tahun 2025', '/dokumen/disdik/lkjip-2025.pdf', 'Dra. Hj. Siti Aminah, M.Pd', '2026-02-01 09:00:00', '2026-02-01 09:00:00', NULL),
('cc000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 2025, 'renstra', 'Renstra Dinas Kesehatan 2021-2026', '/dokumen/dinkes/renstra-2021-2026.pdf', 'drg. H. Andi Pratama, M.Kes', '2026-01-15 09:00:00', '2026-01-15 09:00:00', NULL),
('cc000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 2025, 'renja', 'Renja Dinas Kesehatan Tahun 2025', '/dokumen/dinkes/renja-2025.pdf', 'drg. H. Andi Pratama, M.Kes', '2026-01-20 09:00:00', '2026-01-20 09:00:00', NULL),
('cc000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003', 2025, 'renstra', 'Renstra Dinas PU 2021-2026', '/dokumen/dpupr/renstra-2021-2026.pdf', 'Drs. Hendra Kusuma, M.T', '2026-01-18 09:00:00', '2026-01-18 09:00:00', NULL),
('cc000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000003', 2025, 'perjanjian_kinerja', 'Perjanjian Kinerja Kepala Dinas PU 2025', '/dokumen/dpupr/pk-2025.pdf', 'Drs. Hendra Kusuma, M.T', '2026-01-25 09:00:00', '2026-01-25 09:00:00', NULL),
('cc000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000004', 2025, 'renstra', 'Renstra Bappeda 2021-2026', '/dokumen/bappeda/renstra-2021-2026.pdf', 'Dra. Maya Sari, M.Si', '2026-03-10 09:00:00', '2026-03-10 09:00:00', NULL),
('cc000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000004', 2025, 'renja', 'Renja Bappeda Tahun 2025', '/dokumen/bappeda/renja-2025.pdf', 'Dra. Maya Sari, M.Si', '2026-03-15 09:00:00', '2026-03-15 09:00:00', NULL),
('cc000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000005', 2025, 'renstra', 'Renstra Setda 2021-2026', '/dokumen/setda/renstra-2021-2026.pdf', 'Andi Kurniawan, S.H, M.Hum', '2026-01-22 09:00:00', '2026-01-22 09:00:00', NULL),
('cc000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000005', 2025, 'lkjip', 'LKJIP Sekretariat Daerah Tahun 2025', '/dokumen/setda/lkjip-2025.pdf', 'Andi Kurniawan, S.H, M.Hum', '2026-02-05 09:00:00', '2026-02-05 09:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `jabatan`
--

CREATE TABLE `jabatan` (
  `id` varchar(36) NOT NULL,
  `opd_id` varchar(36) NOT NULL,
  `kode` varchar(32) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `jenis` varchar(32) NOT NULL,
  `eselon` varchar(8) DEFAULT NULL,
  `unit_kerja` varchar(255) DEFAULT NULL,
  `ikhtisar` text,
  `kualifikasi_pendidikan` text,
  `pengalaman` text,
  `status_anjab` varchar(16) NOT NULL DEFAULT 'draft',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `jabatan`
--

INSERT INTO `jabatan` (`id`, `opd_id`, `kode`, `nama`, `jenis`, `eselon`, `unit_kerja`, `ikhtisar`, `kualifikasi_pendidikan`, `pengalaman`, `status_anjab`, `created_at`, `updated_at`, `deleted_at`) VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'DISDIK-001', 'Kepala Dinas Pendidikan dan Kebudayaan', 'struktural', 'II.a', 'Dinas Pendidikan dan Kebudayaan', 'Memimpin, merumuskan, mengkoordinasikan, membina dan mengendalikan pelaksanaan urusan pemerintahan bidang pendidikan dan kebudayaan', 'S2 Manajemen Pendidikan / Administrasi Publik', '5 tahun di bidang pendidikan atau pemerintahan', 'disetujui', '2026-01-10 08:00:00', '2026-03-01 10:00:00', NULL),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'DISDIK-002', 'Sekretaris Dinas Pendidikan', 'struktural', 'III.a', 'Sekretariat Dinas Pendidikan', 'Melaksanakan koordinasi pelaksanaan tugas, pembinaan dan pemberian dukungan administrasi kepada seluruh unit organisasi', 'S1 Administrasi Publik / Manajemen', '3 tahun di jabatan struktural eselon IV', 'disetujui', '2026-01-10 08:00:00', '2026-03-01 10:00:00', NULL),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'DISDIK-003', 'Kepala Bidang Pembinaan SD', 'struktural', 'III.b', 'Bidang Pembinaan SD', 'Melaksanakan penyusunan bahan perumusan dan pelaksanaan kebijakan di bidang pembinaan sekolah dasar', 'S1 Kependidikan / Administrasi Pendidikan', '2 tahun di bidang pendidikan dasar', 'final', '2026-01-10 08:00:00', '2026-02-20 10:00:00', NULL),
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 'DINKES-001', 'Kepala Dinas Kesehatan', 'struktural', 'II.a', 'Dinas Kesehatan', 'Memimpin, merumuskan, mengkoordinasikan, membina dan mengendalikan pelaksanaan urusan pemerintahan bidang kesehatan', 'S2 Kesehatan Masyarakat / Kedokteran', '5 tahun di bidang kesehatan', 'draft', '2026-02-01 08:00:00', '2026-02-01 08:00:00', NULL),
('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000002', 'DINKES-002', 'Sekretaris Dinas Kesehatan', 'struktural', 'III.a', 'Sekretariat Dinas Kesehatan', 'Melaksanakan koordinasi pelaksanaan tugas dan pembinaan administrasi Dinas Kesehatan', 'S1 Administrasi / Kesehatan Masyarakat', '3 tahun di jabatan struktural', 'draft', '2026-02-01 08:00:00', '2026-02-01 08:00:00', NULL),
('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000002', 'DINKES-003', 'Dokter Madya', 'fungsional', '', 'Bidang Pelayanan Kesehatan', 'Melaksanakan pelayanan medis umum, konsultasi, dan tindakan medis sesuai kompetensi profesi dokter', 'S1 Kedokteran (Profesi Dokter)', '2 tahun sebagai Dokter Pertama/Muda', 'draft', '2026-02-01 08:00:00', '2026-02-01 08:00:00', NULL),
('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000003', 'DPUPR-001', 'Kepala Dinas PU dan Penataan Ruang', 'struktural', 'II.a', 'Dinas PU dan Penataan Ruang', 'Memimpin, merumuskan, mengkoordinasikan dan mengendalikan pelaksanaan urusan pekerjaan umum dan penataan ruang', 'S2 Teknik Sipil / Arsitektur / Perencanaan Wilayah', '5 tahun di bidang infrastruktur', 'disetujui', '2026-01-15 08:00:00', '2026-03-20 10:00:00', NULL),
('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000003', 'DPUPR-002', 'Kepala Bidang Bina Marga', 'struktural', 'III.b', 'Bidang Bina Marga', 'Melaksanakan penyusunan bahan kebijakan dan pelaksanaan pembangunan, peningkatan dan pemeliharaan jalan dan jembatan', 'S1 Teknik Sipil', '3 tahun di bidang infrastruktur jalan', 'final', '2026-01-15 08:00:00', '2026-03-10 10:00:00', NULL),
('c0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000003', 'DPUPR-003', 'Perencana Madya', 'fungsional', '', 'Bidang Penataan Ruang', 'Melaksanakan kegiatan perencanaan pembangunan daerah bidang infrastruktur dan tata ruang', 'S2 Perencanaan Wilayah dan Kota / Teknik Sipil', '3 tahun sebagai Perencana Muda', 'disetujui', '2026-01-15 08:00:00', '2026-03-20 10:00:00', NULL),
('c0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000004', 'BAPPEDA-001', 'Kepala Bappeda', 'struktural', 'II.a', 'Badan Perencanaan Pembangunan Daerah', 'Memimpin dan mengkoordinasikan pelaksanaan fungsi penunjang urusan pemerintahan bidang perencanaan pembangunan daerah', 'S2 Perencanaan Pembangunan / Administrasi Publik', '5 tahun di bidang perencanaan pembangunan', 'draft', '2026-03-01 08:00:00', '2026-03-01 08:00:00', NULL),
('c0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000004', 'BAPPEDA-002', 'Sekretaris Bappeda', 'struktural', 'III.a', 'Sekretariat Bappeda', 'Melaksanakan koordinasi pelaksanaan tugas dan pembinaan administrasi Bappeda', 'S1 Administrasi Publik / Manajemen / Ekonomi', '3 tahun di jabatan struktural', 'draft', '2026-03-01 08:00:00', '2026-03-01 08:00:00', NULL),
('c0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000004', 'BAPPEDA-003', 'Perencana Muda', 'fungsional', '', 'Bidang Perencanaan Ekonomi', 'Melaksanakan kegiatan fungsional perencanaan pembangunan daerah bidang ekonomi', 'S1 Perencanaan / Teknik / Ekonomi', '1 tahun sebagai Perencana Pertama', 'draft', '2026-03-01 08:00:00', '2026-03-01 08:00:00', NULL),
('c0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000005', 'SETDA-001', 'Sekretaris Daerah', 'struktural', 'II.a', 'Sekretariat Daerah', 'Memimpin Sekretariat Daerah dalam penyelenggaraan urusan pemerintahan umum dan koordinasi antar perangkat daerah', 'S2 Administrasi Publik / Manajemen', '5 tahun di jabatan struktural eselon II', 'final', '2026-01-20 08:00:00', '2026-04-01 10:00:00', NULL),
('c0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000005', 'SETDA-002', 'Asisten Pemerintahan', 'struktural', 'II.b', 'Sekretariat Daerah', 'Membantu Sekretaris Daerah dalam mengkoordinasikan penyelenggaraan pemerintahan dan kesejahteraan rakyat', 'S2 Administrasi / Pemerintahan', '3 tahun di jabatan struktural eselon III', 'final', '2026-01-20 08:00:00', '2026-04-01 10:00:00', NULL),
('c0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000005', 'SETDA-003', 'Kepala Bagian Hukum', 'struktural', 'III.a', 'Bagian Hukum Setda', 'Melaksanakan penyusunan produk hukum daerah, penelaahan hukum, bantuan hukum dan dokumentasi hukum', 'S1 Hukum / Ilmu Hukum', '2 tahun di bidang hukum pemerintahan', 'final', '2026-01-20 08:00:00', '2026-04-01 10:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `laporan_abk`
--

CREATE TABLE `laporan_abk` (
  `id` varchar(36) NOT NULL,
  `opd_id` varchar(36) NOT NULL,
  `periode` varchar(16) NOT NULL,
  `tanggal_dibuat` date NOT NULL,
  `status` varchar(16) NOT NULL DEFAULT 'draft',
  `total_jabatan` int NOT NULL DEFAULT '0',
  `total_kebutuhan_pegawai` int NOT NULL DEFAULT '0',
  `total_pegawai_existing` int NOT NULL DEFAULT '0',
  `efisiensi` double NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `laporan_abk`
--

INSERT INTO `laporan_abk` (`id`, `opd_id`, `periode`, `tanggal_dibuat`, `status`, `total_jabatan`, `total_kebutuhan_pegawai`, `total_pegawai_existing`, `efisiensi`, `created_at`, `updated_at`, `deleted_at`) VALUES
('bb000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', '2025', '2026-02-01', 'disetujui', 3, 4, 3, 78.5, '2026-02-01 10:00:00', '2026-03-10 14:00:00', NULL),
('bb000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', '2025', '2026-03-01', 'draft', 3, 4, 3, 75, '2026-03-01 10:00:00', '2026-03-01 10:00:00', NULL),
('bb000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', '2025', '2026-02-10', 'final', 3, 4, 3, 82.3, '2026-02-10 10:00:00', '2026-04-05 14:00:00', NULL),
('bb000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', '2025', '2026-03-15', 'draft', 3, 4, 3, 76, '2026-03-15 10:00:00', '2026-03-15 10:00:00', NULL),
('bb000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', '2025', '2026-02-05', 'final', 3, 4, 3, 80, '2026-02-05 10:00:00', '2026-04-10 14:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `nilai_sakip`
--

CREATE TABLE `nilai_sakip` (
  `id` varchar(36) NOT NULL,
  `opd_id` varchar(36) NOT NULL,
  `tahun` int NOT NULL,
  `nilai_total` double NOT NULL DEFAULT '0',
  `predikat` varchar(4) DEFAULT NULL,
  `komponen_nilai` json DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `nilai_sakip`
--

INSERT INTO `nilai_sakip` (`id`, `opd_id`, `tahun`, `nilai_total`, `predikat`, `komponen_nilai`, `created_at`, `updated_at`, `deleted_at`) VALUES
('dd000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 2025, 78.45, 'BB', '{\"capaian\": 16.45, \"evaluasi\": 12.5, \"pelaporan\": 14.2, \"pengukuran\": 16.8, \"perencanaan\": 18.5}', '2026-03-01 10:00:00', '2026-03-01 10:00:00', NULL),
('dd000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 2025, 72.3, 'B', '{\"capaian\": 15.3, \"evaluasi\": 11.5, \"pelaporan\": 13.0, \"pengukuran\": 15.5, \"perencanaan\": 17.0}', '2026-03-05 10:00:00', '2026-03-05 10:00:00', NULL),
('dd000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 2025, 81.2, 'A', '{\"capaian\": 16.5, \"evaluasi\": 13.0, \"pelaporan\": 15.0, \"pengukuran\": 17.2, \"perencanaan\": 19.5}', '2026-03-10 10:00:00', '2026-03-10 10:00:00', NULL),
('dd000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 2025, 65.8, 'CC', '{\"capaian\": 15.8, \"evaluasi\": 10.0, \"pelaporan\": 11.5, \"pengukuran\": 13.5, \"perencanaan\": 15.0}', '2026-03-12 10:00:00', '2026-03-12 10:00:00', NULL),
('dd000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', 2025, 76.9, 'BB', '{\"capaian\": 16.4, \"evaluasi\": 12.0, \"pelaporan\": 14.0, \"pengukuran\": 16.5, \"perencanaan\": 18.0}', '2026-03-08 10:00:00', '2026-03-08 10:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `opd`
--

CREATE TABLE `opd` (
  `id` varchar(36) NOT NULL,
  `kode` varchar(32) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `alamat` text,
  `telepon` varchar(32) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `kepala` varchar(255) DEFAULT NULL,
  `nip_kepala` varchar(32) DEFAULT NULL,
  `status_anjab` varchar(16) NOT NULL DEFAULT 'belum',
  `status_abk` varchar(16) NOT NULL DEFAULT 'belum',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `opd`
--

INSERT INTO `opd` (`id`, `kode`, `nama`, `alamat`, `telepon`, `email`, `kepala`, `nip_kepala`, `status_anjab`, `status_abk`, `created_at`, `updated_at`, `deleted_at`) VALUES
('a0000000-0000-0000-0000-000000000001', 'DISDIK', 'Dinas Pendidikan dan Kebudayaan', 'Jl. Sudirman No. 10', '0411-123456', 'disdik@pemda.go.id', 'Dr. H. Budi Santoso, M.Pd', '196501011990031001', 'selesai', 'selesai', '2026-01-01 08:00:00', '2026-03-15 10:00:00', NULL),
('a0000000-0000-0000-0000-000000000002', 'DINKES', 'Dinas Kesehatan', 'Jl. Kartini No. 5', '0411-234567', 'dinkes@pemda.go.id', 'dr. Hj. Sri Rahayu, M.Kes', '196803151993032002', 'proses', 'belum', '2026-01-01 08:00:00', '2026-03-20 10:00:00', NULL),
('a0000000-0000-0000-0000-000000000003', 'DPUPR', 'Dinas Pekerjaan Umum dan Penataan Ruang', 'Jl. Veteran No. 20', '0411-345678', 'dpupr@pemda.go.id', 'Ir. Ahmad Fauzi, M.T', '196706201992031003', 'selesai', 'proses', '2026-01-01 08:00:00', '2026-04-01 09:00:00', NULL),
('a0000000-0000-0000-0000-000000000004', 'BAPPEDA', 'Badan Perencanaan Pembangunan Daerah', 'Jl. Diponegoro No. 15', '0411-456789', 'bappeda@pemda.go.id', 'Drs. Slamet Riyadi, M.Si', '196904221995031001', 'belum', 'belum', '2026-01-01 08:00:00', '2026-01-10 08:00:00', NULL),
('a0000000-0000-0000-0000-000000000005', 'SETDA', 'Sekretariat Daerah', 'Jl. A. Yani No. 1', '0411-567890', 'setda@pemda.go.id', 'Drs. H. Wahyu Hidayat, M.M', '196502181989031002', 'proses', 'belum', '2026-01-01 08:00:00', '2026-04-10 11:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pejabat`
--

CREATE TABLE `pejabat` (
  `id` varchar(36) NOT NULL,
  `opd_id` varchar(36) NOT NULL,
  `nip` varchar(32) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `jabatan` varchar(255) DEFAULT NULL,
  `eselon` varchar(8) DEFAULT NULL,
  `pangkat` varchar(64) DEFAULT NULL,
  `golongan` varchar(16) DEFAULT NULL,
  `tmt_jabatan` date DEFAULT NULL,
  `pendidikan` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pejabat`
--

INSERT INTO `pejabat` (`id`, `opd_id`, `nip`, `nama`, `jabatan`, `eselon`, `pangkat`, `golongan`, `tmt_jabatan`, `pendidikan`, `created_at`, `updated_at`, `deleted_at`) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', '196501011990031001', 'Dr. H. Budi Santoso, M.Pd', 'Kepala Dinas Pendidikan dan Kebudayaan', 'II.a', 'Pembina Utama Muda', 'IV/c', '2020-01-01', 'S3', '2026-01-01 08:00:00', '2026-01-01 08:00:00', NULL),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', '197203101998031002', 'Dra. Hj. Siti Aminah, M.Pd', 'Sekretaris Dinas Pendidikan', 'III.a', 'Pembina', 'IV/a', '2021-04-01', 'S2', '2026-01-01 08:00:00', '2026-01-01 08:00:00', NULL),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', '198005152006041001', 'Agus Wibowo, S.Pd, M.Si', 'Kepala Bidang Pembinaan SD', 'III.b', 'Pembina', 'IV/a', '2022-10-01', 'S2', '2026-01-01 08:00:00', '2026-01-01 08:00:00', NULL),
('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', '196803151993032002', 'dr. Hj. Sri Rahayu, M.Kes', 'Kepala Dinas Kesehatan', 'II.a', 'Pembina Utama Muda', 'IV/c', '2019-06-01', 'S2', '2026-01-01 08:00:00', '2026-01-01 08:00:00', NULL),
('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000002', '197508202000121003', 'drg. H. Andi Pratama, M.Kes', 'Sekretaris Dinas Kesehatan', 'III.a', 'Pembina', 'IV/a', '2021-01-01', 'S2', '2026-01-01 08:00:00', '2026-01-01 08:00:00', NULL),
('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000002', '198310122009042001', 'dr. Dewi Sulistyowati', 'Dokter Madya', '', 'Penata Tk. I', 'III/d', '2020-04-01', 'S1', '2026-01-01 08:00:00', '2026-01-01 08:00:00', NULL),
('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000003', '196706201992031003', 'Ir. Ahmad Fauzi, M.T', 'Kepala Dinas PU dan Penataan Ruang', 'II.a', 'Pembina Utama Muda', 'IV/c', '2021-03-01', 'S2', '2026-01-01 08:00:00', '2026-01-01 08:00:00', NULL),
('b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000003', '197110051999031001', 'Drs. Hendra Kusuma, M.T', 'Kepala Bidang Bina Marga', 'III.b', 'Pembina', 'IV/a', '2020-07-01', 'S2', '2026-01-01 08:00:00', '2026-01-01 08:00:00', NULL),
('b0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000003', '198703182012121002', 'Rini Kartika, S.T, M.T', 'Perencana Madya', '', 'Penata', 'III/c', '2019-01-01', 'S2', '2026-01-01 08:00:00', '2026-01-01 08:00:00', NULL),
('b0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000004', '196904221995031001', 'Drs. Slamet Riyadi, M.Si', 'Kepala Bappeda', 'II.a', 'Pembina Utama Muda', 'IV/c', '2022-01-01', 'S2', '2026-01-01 08:00:00', '2026-01-01 08:00:00', NULL),
('b0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000004', '197611132001121001', 'Dra. Maya Sari, M.Si', 'Sekretaris Bappeda', 'III.a', 'Pembina', 'IV/a', '2020-01-01', 'S2', '2026-01-01 08:00:00', '2026-01-01 08:00:00', NULL),
('b0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000004', '199001142015041001', 'Rizky Firmansyah, S.T, M.Sc', 'Perencana Muda', '', 'Penata', 'III/c', '2020-01-01', 'S2', '2026-01-01 08:00:00', '2026-01-01 08:00:00', NULL),
('b0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000005', '196502181989031002', 'Drs. H. Wahyu Hidayat, M.M', 'Sekretaris Daerah', 'II.a', 'Pembina Utama', 'IV/e', '2018-01-01', 'S2', '2026-01-01 08:00:00', '2026-01-01 08:00:00', NULL),
('b0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000005', '196708111992031001', 'Drs. H. Bambang Eko, M.Si', 'Asisten Pemerintahan', 'II.b', 'Pembina Utama Muda', 'IV/c', '2021-01-01', 'S2', '2026-01-01 08:00:00', '2026-01-01 08:00:00', NULL),
('b0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000005', '198006262004121001', 'Andi Kurniawan, S.H, M.Hum', 'Kepala Bagian Hukum', 'III.a', 'Pembina', 'IV/a', '2022-04-01', 'S2', '2026-01-01 08:00:00', '2026-01-01 08:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `perhitungan_abk`
--

CREATE TABLE `perhitungan_abk` (
  `id` varchar(36) NOT NULL,
  `jabatan_id` varchar(36) NOT NULL,
  `total_waktu_kerja` double NOT NULL DEFAULT '0',
  `waktu_kerja_efektif` double NOT NULL DEFAULT '1250',
  `beban_kerja` double NOT NULL DEFAULT '0',
  `kebutuhan_pegawai` int NOT NULL DEFAULT '0',
  `pegawai_existing` int NOT NULL DEFAULT '0',
  `selisih` int NOT NULL DEFAULT '0',
  `keterangan` varchar(32) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `perhitungan_abk`
--

INSERT INTO `perhitungan_abk` (`id`, `jabatan_id`, `total_waktu_kerja`, `waktu_kerja_efektif`, `beban_kerja`, `kebutuhan_pegawai`, `pegawai_existing`, `selisih`, `keterangan`, `created_at`, `updated_at`, `deleted_at`) VALUES
('f0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 1200, 1250, 0.96, 1, 1, 0, 'Sesuai', '2026-02-01 08:00:00', '2026-02-01 08:00:00', NULL),
('f0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 1180, 1250, 0.94, 1, 1, 0, 'Sesuai', '2026-02-01 08:00:00', '2026-02-01 08:00:00', NULL),
('f0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 1360, 1250, 1.09, 2, 1, -1, 'Kekurangan', '2026-02-01 08:00:00', '2026-02-01 08:00:00', NULL),
('f0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004', 1100, 1250, 0.88, 1, 1, 0, 'Sesuai', '2026-02-15 08:00:00', '2026-02-15 08:00:00', NULL),
('f0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000005', 1050, 1250, 0.84, 1, 1, 0, 'Sesuai', '2026-02-15 08:00:00', '2026-02-15 08:00:00', NULL),
('f0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000006', 1875, 1250, 1.5, 2, 1, -1, 'Kekurangan', '2026-02-15 08:00:00', '2026-02-15 08:00:00', NULL),
('f0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000007', 1250, 1250, 1, 1, 1, 0, 'Sesuai', '2026-02-01 08:00:00', '2026-02-01 08:00:00', NULL),
('f0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000008', 1500, 1250, 1.2, 2, 1, -1, 'Kekurangan', '2026-02-01 08:00:00', '2026-02-01 08:00:00', NULL),
('f0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000009', 1100, 1250, 0.88, 1, 1, 0, 'Sesuai', '2026-02-01 08:00:00', '2026-02-01 08:00:00', NULL),
('f0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000010', 1200, 1250, 0.96, 1, 1, 0, 'Sesuai', '2026-03-10 08:00:00', '2026-03-10 08:00:00', NULL),
('f0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000011', 1000, 1250, 0.8, 1, 1, 0, 'Sesuai', '2026-03-10 08:00:00', '2026-03-10 08:00:00', NULL),
('f0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000012', 1400, 1250, 1.12, 2, 1, -1, 'Kekurangan', '2026-03-10 08:00:00', '2026-03-10 08:00:00', NULL),
('f0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000013', 1300, 1250, 1.04, 2, 1, -1, 'Kekurangan', '2026-02-01 08:00:00', '2026-02-01 08:00:00', NULL),
('f0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000014', 1150, 1250, 0.92, 1, 1, 0, 'Sesuai', '2026-02-01 08:00:00', '2026-02-01 08:00:00', NULL),
('f0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000015', 1250, 1250, 1, 1, 1, 0, 'Sesuai', '2026-02-01 08:00:00', '2026-02-01 08:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` varchar(36) NOT NULL,
  `kode` varchar(32) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `level` varchar(32) NOT NULL DEFAULT 'operasional',
  `deskripsi` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `kode`, `nama`, `level`, `deskripsi`, `created_at`, `updated_at`, `deleted_at`) VALUES
('50a38153-2ee8-11f1-a657-d493904ffa0b', 'ADM', 'Administrator', 'inti', 'Akses penuh ke seluruh sistem', '2026-04-03 06:04:34', '2026-04-03 06:04:34', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `spesifikasi_jabatan`
--

CREATE TABLE `spesifikasi_jabatan` (
  `id` varchar(36) NOT NULL,
  `jabatan_id` varchar(36) NOT NULL,
  `pendidikan_formal` json DEFAULT NULL,
  `pelatihan` json DEFAULT NULL,
  `pengalaman` json DEFAULT NULL,
  `kompetensi_manajerial` json DEFAULT NULL,
  `kompetensi_teknis` json DEFAULT NULL,
  `kondisi_fisik` json DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `spesifikasi_jabatan`
--

INSERT INTO `spesifikasi_jabatan` (`id`, `jabatan_id`, `pendidikan_formal`, `pelatihan`, `pengalaman`, `kompetensi_manajerial`, `kompetensi_teknis`, `kondisi_fisik`, `created_at`, `updated_at`, `deleted_at`) VALUES
('ff000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', '{\"jenjang\": \"S2\", \"jurusan\": [\"Manajemen Pendidikan\", \"Administrasi Publik\", \"Ilmu Pendidikan\"], \"minimal\": \"S1\"}', '[{\"nama\": \"Diklat Kepemimpinan Tingkat II\", \"jenis\": \"struktural\", \"wajib\": true}, {\"nama\": \"Diklat Manajemen Pendidikan\", \"jenis\": \"teknis\", \"wajib\": true}, {\"nama\": \"Diklat Penyusunan RPJMD\", \"jenis\": \"teknis\", \"wajib\": false}]', '[{\"wajib\": true, \"deskripsi\": \"Minimal 5 tahun pengalaman di bidang pendidikan atau pemerintahan\"}, {\"wajib\": true, \"deskripsi\": \"Pernah menduduki jabatan struktural eselon III\"}]', '[{\"nama\": \"Integritas\", \"level\": 4, \"maxLevel\": 5}, {\"nama\": \"Kerjasama\", \"level\": 4, \"maxLevel\": 5}, {\"nama\": \"Komunikasi\", \"level\": 4, \"maxLevel\": 5}, {\"nama\": \"Orientasi pada Hasil\", \"level\": 4, \"maxLevel\": 5}, {\"nama\": \"Pengembangan Diri dan Orang Lain\", \"level\": 4, \"maxLevel\": 5}]', '[{\"nama\": \"Manajemen Pendidikan\", \"level\": 4, \"maxLevel\": 5}, {\"nama\": \"Perencanaan Program\", \"level\": 4, \"maxLevel\": 5}, {\"nama\": \"Kebijakan Publik\", \"level\": 3, \"maxLevel\": 5}]', '{\"usia\": \"Maks 58 tahun\", \"kesehatan\": \"Sehat jasmani dan rohani\", \"kondisiKhusus\": \"Tidak dipersyaratkan\"}', '2026-01-22 09:00:00', '2026-03-01 10:00:00', NULL),
('ff000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', '{\"jenjang\": \"S2\", \"jurusan\": [\"Administrasi Publik\", \"Manajemen\", \"Ilmu Pemerintahan\"], \"minimal\": \"S1\"}', '[{\"nama\": \"Diklat Kepemimpinan Tingkat III\", \"jenis\": \"struktural\", \"wajib\": true}, {\"nama\": \"Diklat Pengelolaan Keuangan Daerah\", \"jenis\": \"teknis\", \"wajib\": true}]', '[{\"wajib\": true, \"deskripsi\": \"Minimal 3 tahun pengalaman di jabatan struktural eselon IV\"}]', '[{\"nama\": \"Integritas\", \"level\": 3, \"maxLevel\": 5}, {\"nama\": \"Kerjasama\", \"level\": 3, \"maxLevel\": 5}, {\"nama\": \"Komunikasi\", \"level\": 3, \"maxLevel\": 5}, {\"nama\": \"Mengelola Perubahan\", \"level\": 3, \"maxLevel\": 5}]', '[{\"nama\": \"Administrasi Keuangan Daerah\", \"level\": 4, \"maxLevel\": 5}, {\"nama\": \"Manajemen SDM\", \"level\": 3, \"maxLevel\": 5}, {\"nama\": \"Penyusunan Laporan\", \"level\": 4, \"maxLevel\": 5}]', '{\"usia\": \"Maks 58 tahun\", \"kesehatan\": \"Sehat jasmani dan rohani\", \"kondisiKhusus\": \"Tidak dipersyaratkan\"}', '2026-01-22 09:00:00', '2026-03-01 10:00:00', NULL),
('ff000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000007', '{\"jenjang\": \"S2\", \"jurusan\": [\"Teknik Sipil\", \"Teknik Arsitektur\", \"Perencanaan Wilayah dan Kota\"], \"minimal\": \"S1\"}', '[{\"nama\": \"Diklat Kepemimpinan Tingkat II\", \"jenis\": \"struktural\", \"wajib\": true}, {\"nama\": \"Diklat Manajemen Konstruksi\", \"jenis\": \"teknis\", \"wajib\": true}, {\"nama\": \"Diklat Penataan Ruang\", \"jenis\": \"teknis\", \"wajib\": false}]', '[{\"wajib\": true, \"deskripsi\": \"Minimal 5 tahun pengalaman di bidang infrastruktur atau pekerjaan umum\"}, {\"wajib\": false, \"deskripsi\": \"Memiliki sertifikasi keahlian teknik sipil atau konstruksi\"}]', '[{\"nama\": \"Integritas\", \"level\": 4, \"maxLevel\": 5}, {\"nama\": \"Kerjasama\", \"level\": 4, \"maxLevel\": 5}, {\"nama\": \"Komunikasi\", \"level\": 4, \"maxLevel\": 5}, {\"nama\": \"Pengambilan Keputusan\", \"level\": 4, \"maxLevel\": 5}]', '[{\"nama\": \"Manajemen Proyek Infrastruktur\", \"level\": 4, \"maxLevel\": 5}, {\"nama\": \"Penataan Ruang\", \"level\": 3, \"maxLevel\": 5}, {\"nama\": \"Pengadaan Barang/Jasa Pemerintah\", \"level\": 4, \"maxLevel\": 5}]', '{\"usia\": \"Maks 58 tahun\", \"kesehatan\": \"Sehat jasmani dan rohani\", \"kondisiKhusus\": \"Tidak dipersyaratkan\"}', '2026-01-25 09:00:00', '2026-03-20 10:00:00', NULL),
('ff000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000013', '{\"jenjang\": \"S2\", \"jurusan\": [\"Administrasi Publik\", \"Manajemen\", \"Ilmu Pemerintahan\", \"Hukum\"], \"minimal\": \"S2\"}', '[{\"nama\": \"Diklat Kepemimpinan Tingkat I\", \"jenis\": \"struktural\", \"wajib\": true}, {\"nama\": \"Diklat Kebijakan Publik\", \"jenis\": \"teknis\", \"wajib\": true}, {\"nama\": \"Diklat Manajemen Pemerintahan Daerah\", \"jenis\": \"teknis\", \"wajib\": true}]', '[{\"wajib\": true, \"deskripsi\": \"Minimal 5 tahun menduduki jabatan struktural eselon II\"}, {\"wajib\": true, \"deskripsi\": \"Memiliki rekam jejak kepemimpinan yang baik\"}]', '[{\"nama\": \"Integritas\", \"level\": 5, \"maxLevel\": 5}, {\"nama\": \"Kerjasama\", \"level\": 5, \"maxLevel\": 5}, {\"nama\": \"Komunikasi\", \"level\": 5, \"maxLevel\": 5}, {\"nama\": \"Orientasi pada Hasil\", \"level\": 5, \"maxLevel\": 5}, {\"nama\": \"Pelayanan Publik\", \"level\": 5, \"maxLevel\": 5}]', '[{\"nama\": \"Kebijakan Pemerintahan Daerah\", \"level\": 5, \"maxLevel\": 5}, {\"nama\": \"Manajemen Pemerintahan\", \"level\": 5, \"maxLevel\": 5}, {\"nama\": \"Hukum Pemerintahan\", \"level\": 4, \"maxLevel\": 5}]', '{\"usia\": \"Maks 60 tahun\", \"kesehatan\": \"Sehat jasmani dan rohani\", \"kondisiKhusus\": \"Tidak dipersyaratkan\"}', '2026-01-28 09:00:00', '2026-04-01 10:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `struktur_organisasi`
--

CREATE TABLE `struktur_organisasi` (
  `id` varchar(36) NOT NULL,
  `opd_id` varchar(36) NOT NULL,
  `parent_id` varchar(36) DEFAULT NULL,
  `jabatan` varchar(255) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `nip` varchar(32) DEFAULT NULL,
  `level` int NOT NULL DEFAULT '1',
  `urutan` int NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `struktur_organisasi`
--

INSERT INTO `struktur_organisasi` (`id`, `opd_id`, `parent_id`, `jabatan`, `nama`, `nip`, `level`, `urutan`, `created_at`, `updated_at`, `deleted_at`) VALUES
('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', NULL, 'Kepala Dinas Pendidikan dan Kebudayaan', 'Dr. H. Budi Santoso, M.Pd', '196501011990031001', 1, 1, '2026-01-10 08:00:00', '2026-01-10 08:00:00', NULL),
('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Sekretaris Dinas Pendidikan', 'Dra. Hj. Siti Aminah, M.Pd', '197203101998031002', 2, 1, '2026-01-10 08:00:00', '2026-01-10 08:00:00', NULL),
('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Kepala Bidang Pembinaan SD', 'Agus Wibowo, S.Pd, M.Si', '198005152006041001', 2, 2, '2026-01-10 08:00:00', '2026-01-10 08:00:00', NULL),
('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', NULL, 'Kepala Dinas Kesehatan', 'dr. Hj. Sri Rahayu, M.Kes', '196803151993032002', 1, 1, '2026-02-01 08:00:00', '2026-02-01 08:00:00', NULL),
('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000004', 'Sekretaris Dinas Kesehatan', 'drg. H. Andi Pratama, M.Kes', '197508202000121003', 2, 1, '2026-02-01 08:00:00', '2026-02-01 08:00:00', NULL),
('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000004', 'Dokter Madya', 'dr. Dewi Sulistyowati', '198310122009042001', 2, 2, '2026-02-01 08:00:00', '2026-02-01 08:00:00', NULL),
('d0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000003', NULL, 'Kepala Dinas PU dan Penataan Ruang', 'Ir. Ahmad Fauzi, M.T', '196706201992031003', 1, 1, '2026-01-15 08:00:00', '2026-01-15 08:00:00', NULL),
('d0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000007', 'Kepala Bidang Bina Marga', 'Drs. Hendra Kusuma, M.T', '197110051999031001', 2, 1, '2026-01-15 08:00:00', '2026-01-15 08:00:00', NULL),
('d0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000007', 'Perencana Madya', 'Rini Kartika, S.T, M.T', '198703182012121002', 2, 2, '2026-01-15 08:00:00', '2026-01-15 08:00:00', NULL),
('d0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000004', NULL, 'Kepala Bappeda', 'Drs. Slamet Riyadi, M.Si', '196904221995031001', 1, 1, '2026-03-01 08:00:00', '2026-03-01 08:00:00', NULL),
('d0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000010', 'Sekretaris Bappeda', 'Dra. Maya Sari, M.Si', '197611132001121001', 2, 1, '2026-03-01 08:00:00', '2026-03-01 08:00:00', NULL),
('d0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000010', 'Perencana Muda', 'Rizky Firmansyah, S.T, M.Sc', '199001142015041001', 2, 2, '2026-03-01 08:00:00', '2026-03-01 08:00:00', NULL),
('d0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000005', NULL, 'Sekretaris Daerah', 'Drs. H. Wahyu Hidayat, M.M', '196502181989031002', 1, 1, '2026-01-20 08:00:00', '2026-01-20 08:00:00', NULL),
('d0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000013', 'Asisten Pemerintahan', 'Drs. H. Bambang Eko, M.Si', '196708111992031001', 2, 1, '2026-01-20 08:00:00', '2026-01-20 08:00:00', NULL),
('d0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000013', 'Kepala Bagian Hukum', 'Andi Kurniawan, S.H, M.Hum', '198006262004121001', 2, 2, '2026-01-20 08:00:00', '2026-01-20 08:00:00', NULL),
('db588c06-5c19-11f1-ad48-d493904ffa0b', 'a0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000004', 'Dokter Madya', 'dr. Dewi Sulistyowati', '198310122009042001', 2, 1, '2026-05-30 18:22:35', '2026-05-30 18:22:35', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `uraian_jabatan`
--

CREATE TABLE `uraian_jabatan` (
  `id` varchar(36) NOT NULL,
  `jabatan_id` varchar(36) NOT NULL,
  `tugas` json DEFAULT NULL,
  `fungsi` json DEFAULT NULL,
  `wewenang` json DEFAULT NULL,
  `tanggung_jawab` json DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `uraian_jabatan`
--

INSERT INTO `uraian_jabatan` (`id`, `jabatan_id`, `tugas`, `fungsi`, `wewenang`, `tanggung_jawab`, `created_at`, `updated_at`, `deleted_at`) VALUES
('ee000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', '[\"Merumuskan kebijakan teknis bidang pendidikan dan kebudayaan berdasarkan peraturan perundang-undangan\", \"Mengkoordinasikan penyusunan rencana program dan kegiatan Dinas Pendidikan\", \"Membina, mengawasi, dan mengendalikan pelaksanaan program pendidikan di daerah\", \"Menyusun dan menyampaikan laporan kinerja Dinas Pendidikan kepada Bupati\", \"Melakukan evaluasi atas pelaksanaan program dan kegiatan pendidikan\"]', '[\"Perumusan kebijakan teknis di bidang pendidikan dan kebudayaan\", \"Pelaksanaan kebijakan bidang pendidikan dan kebudayaan\", \"Pengkoordinasian antar unit kerja di lingkungan dinas\", \"Pembinaan dan pengawasan terhadap pelaksanaan tugas bawahan\"]', '[\"Menandatangani naskah dinas dan dokumen resmi dinas\", \"Menetapkan program dan kegiatan prioritas Dinas Pendidikan\", \"Memberikan persetujuan atas usulan kebutuhan anggaran\", \"Menilai kinerja pejabat dan staf di lingkungan dinas\"]', '[\"Keberhasilan pelaksanaan program pendidikan di daerah\", \"Kelancaran administrasi dan keuangan Dinas Pendidikan\", \"Terwujudnya visi dan misi dinas sesuai RPJMD\", \"Pembinaan dan pengembangan SDM di lingkungan dinas\"]', '2026-01-20 09:00:00', '2026-03-01 10:00:00', NULL),
('ee000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', '[\"Mengkoordinasikan penyusunan rencana kerja dan anggaran Dinas Pendidikan\", \"Mengelola administrasi keuangan, kepegawaian, dan umum dinas\", \"Menyusun laporan bulanan, triwulanan, dan tahunan pelaksanaan program\", \"Memfasilitasi kebutuhan sarana dan prasarana operasional dinas\", \"Mengkoordinasikan pelaksanaan monitoring dan evaluasi program\"]', '[\"Penyelenggaraan urusan administrasi umum dinas\", \"Pengelolaan keuangan dan aset dinas\", \"Pembinaan kepegawaian di lingkungan dinas\", \"Pengkoordinasian penyusunan laporan kinerja dinas\"]', '[\"Menandatangani dokumen administrasi internal\", \"Mengusulkan kebutuhan anggaran kegiatan kesekretariatan\", \"Memberikan persetujuan perjalanan dinas staf\"]', '[\"Kelancaran administrasi dan tata usaha dinas\", \"Akurasi laporan keuangan dan pelaporan kinerja\", \"Keteraturan pengelolaan kepegawaian dinas\"]', '2026-01-20 09:00:00', '2026-03-01 10:00:00', NULL),
('ee000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000007', '[\"Merumuskan kebijakan teknis bidang pekerjaan umum dan penataan ruang\", \"Memimpin dan mengkoordinasikan seluruh kegiatan dinas\", \"Melakukan pembinaan dan pengawasan pelaksanaan proyek infrastruktur\", \"Menyampaikan laporan kinerja kepada Bupati secara berkala\", \"Menjalin koordinasi dengan instansi terkait di bidang infrastruktur\"]', '[\"Perumusan kebijakan teknis pekerjaan umum dan penataan ruang\", \"Pengkoordinasian pelaksanaan tugas dinas\", \"Pembinaan aparatur dan pengawasan kinerja dinas\", \"Evaluasi dan pelaporan pelaksanaan program\"]', '[\"Menetapkan kebijakan teknis pembangunan infrastruktur daerah\", \"Menandatangani kontrak dan dokumen proyek infrastruktur\", \"Menilai kinerja seluruh pejabat di lingkungan dinas\"]', '[\"Keberhasilan program pembangunan infrastruktur daerah\", \"Terpenuhinya target pembangunan jalan dan jembatan\", \"Kelancaran administrasi dan keuangan dinas\", \"Ketepatan pemanfaatan ruang sesuai RTRW\"]', '2026-01-25 09:00:00', '2026-03-20 10:00:00', NULL),
('ee000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000013', '[\"Memimpin, mengkoordinasikan, dan mengendalikan pelaksanaan tugas Sekretariat Daerah\", \"Mengkoordinasikan kebijakan pemerintahan daerah lintas perangkat daerah\", \"Menyelenggarakan administrasi pemerintahan daerah\", \"Memfasilitasi hubungan kerja antara pemerintah daerah dan DPRD\", \"Menyusun laporan penyelenggaraan pemerintahan daerah (LPPD)\"]', '[\"Koordinasi perumusan kebijakan pemerintahan daerah\", \"Penyelenggaraan administrasi umum pemerintahan daerah\", \"Fasilitasi pelaksanaan tugas Kepala Daerah\", \"Pembinaan dan pengawasan penyelenggaraan pemerintahan daerah\"]', '[\"Mewakili Bupati dalam forum koordinasi antar daerah\", \"Menandatangani keputusan yang didelegasikan Bupati\", \"Menentukan kebijakan administrasi internal pemerintahan daerah\"]', '[\"Kelancaran penyelenggaraan pemerintahan daerah\", \"Keterpaduan kebijakan antar perangkat daerah\", \"Akurasi dan ketepatan waktu pelaporan penyelenggaraan pemerintahan\"]', '2026-01-28 09:00:00', '2026-04-01 10:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `role_id` varchar(36) DEFAULT NULL,
  `picture` varchar(512) DEFAULT NULL,
  `google_id` varchar(128) DEFAULT NULL,
  `mfa_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `status` varchar(16) NOT NULL DEFAULT 'aktif',
  `last_login_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `nama`, `password_hash`, `role_id`, `picture`, `google_id`, `mfa_enabled`, `status`, `last_login_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
('3d93d227-5c0f-11f1-ad48-d493904ffa0b', 'hafiddwih@gmail.com', 'Hafid Dwi Hibatullah', '$2a$10$Cr2PJ3nvLL5V.L5453z1nOWSPgmC0dP9ZnV347YMcAw6/AKgY81Fq', '50a38153-2ee8-11f1-a657-d493904ffa0b', '', '', 0, 'aktif', NULL, '2026-05-30 17:06:35', '2026-05-30 17:06:45', NULL),
('9f214918-2eeb-11f1-a657-d493904ffa0b', 'admin@admin', 'Super Administrator', '$2a$10$y6T4CZ6Tj/r/MdATlxGhiOpzPtYy0XBIeleUcbn2g6FI/SpN3i2US', '50a38153-2ee8-11f1-a657-d493904ffa0b', NULL, NULL, 0, 'aktif', '2026-05-30 16:22:51', '2026-04-03 06:28:14', '2026-05-30 16:22:51', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aktivitas`
--
ALTER TABLE `aktivitas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_aktivitas_jabatan` (`jabatan_id`);

--
-- Indexes for table `dokumen_anjab`
--
ALTER TABLE `dokumen_anjab`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_dokumen_anjab_opd` (`opd_id`);

--
-- Indexes for table `dokumen_sakip`
--
ALTER TABLE `dokumen_sakip`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_dokumen_sakip_opd` (`opd_id`);

--
-- Indexes for table `jabatan`
--
ALTER TABLE `jabatan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_jabatan_opd` (`opd_id`);

--
-- Indexes for table `laporan_abk`
--
ALTER TABLE `laporan_abk`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_laporan_abk_opd` (`opd_id`);

--
-- Indexes for table `nilai_sakip`
--
ALTER TABLE `nilai_sakip`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_nilai_sakip_opd_tahun` (`opd_id`,`tahun`),
  ADD KEY `idx_nilai_sakip_opd` (`opd_id`);

--
-- Indexes for table `opd`
--
ALTER TABLE `opd`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_opd_kode` (`kode`);

--
-- Indexes for table `pejabat`
--
ALTER TABLE `pejabat`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_pejabat_nip` (`nip`),
  ADD KEY `idx_pejabat_opd` (`opd_id`);

--
-- Indexes for table `perhitungan_abk`
--
ALTER TABLE `perhitungan_abk`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_perhitungan_jabatan` (`jabatan_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_roles_kode` (`kode`);

--
-- Indexes for table `spesifikasi_jabatan`
--
ALTER TABLE `spesifikasi_jabatan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_spesifikasi_jabatan` (`jabatan_id`);

--
-- Indexes for table `struktur_organisasi`
--
ALTER TABLE `struktur_organisasi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_struktur_opd` (`opd_id`),
  ADD KEY `idx_struktur_parent` (`parent_id`);

--
-- Indexes for table `uraian_jabatan`
--
ALTER TABLE `uraian_jabatan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_uraian_jabatan` (`jabatan_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_users_email` (`email`),
  ADD KEY `idx_users_role` (`role_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `aktivitas`
--
ALTER TABLE `aktivitas`
  ADD CONSTRAINT `fk_aktivitas_jabatan` FOREIGN KEY (`jabatan_id`) REFERENCES `jabatan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `dokumen_anjab`
--
ALTER TABLE `dokumen_anjab`
  ADD CONSTRAINT `fk_dokumen_anjab_opd` FOREIGN KEY (`opd_id`) REFERENCES `opd` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `dokumen_sakip`
--
ALTER TABLE `dokumen_sakip`
  ADD CONSTRAINT `fk_dokumen_sakip_opd` FOREIGN KEY (`opd_id`) REFERENCES `opd` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `jabatan`
--
ALTER TABLE `jabatan`
  ADD CONSTRAINT `fk_jabatan_opd` FOREIGN KEY (`opd_id`) REFERENCES `opd` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `laporan_abk`
--
ALTER TABLE `laporan_abk`
  ADD CONSTRAINT `fk_laporan_abk_opd` FOREIGN KEY (`opd_id`) REFERENCES `opd` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `nilai_sakip`
--
ALTER TABLE `nilai_sakip`
  ADD CONSTRAINT `fk_nilai_sakip_opd` FOREIGN KEY (`opd_id`) REFERENCES `opd` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pejabat`
--
ALTER TABLE `pejabat`
  ADD CONSTRAINT `fk_pejabat_opd` FOREIGN KEY (`opd_id`) REFERENCES `opd` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `perhitungan_abk`
--
ALTER TABLE `perhitungan_abk`
  ADD CONSTRAINT `fk_perhitungan_jabatan` FOREIGN KEY (`jabatan_id`) REFERENCES `jabatan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `spesifikasi_jabatan`
--
ALTER TABLE `spesifikasi_jabatan`
  ADD CONSTRAINT `fk_spesifikasi_jabatan` FOREIGN KEY (`jabatan_id`) REFERENCES `jabatan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `struktur_organisasi`
--
ALTER TABLE `struktur_organisasi`
  ADD CONSTRAINT `fk_struktur_opd` FOREIGN KEY (`opd_id`) REFERENCES `opd` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_struktur_parent` FOREIGN KEY (`parent_id`) REFERENCES `struktur_organisasi` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `uraian_jabatan`
--
ALTER TABLE `uraian_jabatan`
  ADD CONSTRAINT `fk_uraian_jabatan` FOREIGN KEY (`jabatan_id`) REFERENCES `jabatan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
