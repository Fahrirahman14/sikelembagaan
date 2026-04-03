-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 02, 2026 at 11:59 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.26

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
('50a38153-2ee8-11f1-a657-d493904ffa0b', 'ADM', 'Administrator', 'inti', 'Akses penuh ke seluruh sistem', '2026-04-03 06:04:34', '2026-04-03 06:04:34', NULL),
('50a39416-2ee8-11f1-a657-d493904ffa0b', 'OPR', 'Operator', 'operasional', 'Mengelola data OPD dan input data', '2026-04-03 06:04:34', '2026-04-03 06:04:34', NULL),
('50a395a7-2ee8-11f1-a657-d493904ffa0b', 'REV', 'Reviewer', 'review', 'Review dan persetujuan dokumen', '2026-04-03 06:04:34', '2026-04-03 06:04:34', NULL);

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
('9f214918-2eeb-11f1-a657-d493904ffa0b', 'admin@admin', 'Super Administrator', '$2a$10$y6T4CZ6Tj/r/MdATlxGhiOpzPtYy0XBIeleUcbn2g6FI/SpN3i2US', '50a38153-2ee8-11f1-a657-d493904ffa0b', NULL, NULL, 0, 'aktif', '2026-04-03 06:47:53', '2026-04-03 06:28:14', '2026-04-03 06:47:53', NULL);

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
