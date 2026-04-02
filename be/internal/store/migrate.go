package store

import "database/sql"

func Migrate(db *sql.DB) error {
	statements := []string{
		`CREATE TABLE IF NOT EXISTS roles (
			id VARCHAR(36) NOT NULL,
			kode VARCHAR(32) NOT NULL,
			nama VARCHAR(100) NOT NULL,
			level VARCHAR(32) NOT NULL DEFAULT 'operasional',
			deskripsi TEXT,
			created_at DATETIME NOT NULL,
			updated_at DATETIME NOT NULL,
			deleted_at DATETIME NULL,
			PRIMARY KEY (id),
			UNIQUE KEY uq_roles_kode (kode)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

		`CREATE TABLE IF NOT EXISTS users (
			id VARCHAR(36) NOT NULL,
			email VARCHAR(255) NOT NULL,
			nama VARCHAR(255) NOT NULL,
			password_hash VARCHAR(255) NULL,
			role_id VARCHAR(36) NULL,
			picture VARCHAR(512),
			google_id VARCHAR(128),
			mfa_enabled TINYINT(1) NOT NULL DEFAULT 0,
			status VARCHAR(16) NOT NULL DEFAULT 'aktif',
			last_login_at DATETIME NULL,
			created_at DATETIME NOT NULL,
			updated_at DATETIME NOT NULL,
			deleted_at DATETIME NULL,
			PRIMARY KEY (id),
			UNIQUE KEY uq_users_email (email),
			INDEX idx_users_role (role_id),
			CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

		`CREATE TABLE IF NOT EXISTS opd (
			id VARCHAR(36) NOT NULL,
			kode VARCHAR(32) NOT NULL,
			nama VARCHAR(255) NOT NULL,
			alamat TEXT,
			telepon VARCHAR(32),
			email VARCHAR(255),
			kepala VARCHAR(255),
			nip_kepala VARCHAR(32),
			status_anjab VARCHAR(16) NOT NULL DEFAULT 'belum',
			status_abk VARCHAR(16) NOT NULL DEFAULT 'belum',
			created_at DATETIME NOT NULL,
			updated_at DATETIME NOT NULL,
			deleted_at DATETIME NULL,
			PRIMARY KEY (id),
			UNIQUE KEY uq_opd_kode (kode)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

		`CREATE TABLE IF NOT EXISTS jabatan (
			id VARCHAR(36) NOT NULL,
			opd_id VARCHAR(36) NOT NULL,
			kode VARCHAR(32) NOT NULL,
			nama VARCHAR(255) NOT NULL,
			jenis VARCHAR(32) NOT NULL,
			eselon VARCHAR(8),
			unit_kerja VARCHAR(255),
			ikhtisar TEXT,
			kualifikasi_pendidikan TEXT,
			pengalaman TEXT,
			status_anjab VARCHAR(16) NOT NULL DEFAULT 'draft',
			created_at DATETIME NOT NULL,
			updated_at DATETIME NOT NULL,
			deleted_at DATETIME NULL,
			PRIMARY KEY (id),
			INDEX idx_jabatan_opd (opd_id),
			CONSTRAINT fk_jabatan_opd FOREIGN KEY (opd_id) REFERENCES opd(id) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

		`CREATE TABLE IF NOT EXISTS pejabat (
			id VARCHAR(36) NOT NULL,
			opd_id VARCHAR(36) NOT NULL,
			nip VARCHAR(32) NOT NULL,
			nama VARCHAR(255) NOT NULL,
			jabatan VARCHAR(255),
			eselon VARCHAR(8),
			pangkat VARCHAR(64),
			golongan VARCHAR(16),
			tmt_jabatan DATE NULL,
			pendidikan VARCHAR(255),
			created_at DATETIME NOT NULL,
			updated_at DATETIME NOT NULL,
			deleted_at DATETIME NULL,
			PRIMARY KEY (id),
			UNIQUE KEY uq_pejabat_nip (nip),
			INDEX idx_pejabat_opd (opd_id),
			CONSTRAINT fk_pejabat_opd FOREIGN KEY (opd_id) REFERENCES opd(id) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

		`CREATE TABLE IF NOT EXISTS struktur_organisasi (
			id VARCHAR(36) NOT NULL,
			opd_id VARCHAR(36) NOT NULL,
			parent_id VARCHAR(36) NULL,
			jabatan VARCHAR(255) NOT NULL,
			nama VARCHAR(255),
			nip VARCHAR(32),
			level INT NOT NULL DEFAULT 1,
			urutan INT NOT NULL DEFAULT 0,
			created_at DATETIME NOT NULL,
			updated_at DATETIME NOT NULL,
			deleted_at DATETIME NULL,
			PRIMARY KEY (id),
			INDEX idx_struktur_opd (opd_id),
			INDEX idx_struktur_parent (parent_id),
			CONSTRAINT fk_struktur_opd FOREIGN KEY (opd_id) REFERENCES opd(id) ON DELETE CASCADE,
			CONSTRAINT fk_struktur_parent FOREIGN KEY (parent_id) REFERENCES struktur_organisasi(id) ON DELETE SET NULL
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

		`CREATE TABLE IF NOT EXISTS aktivitas (
			id VARCHAR(36) NOT NULL,
			jabatan_id VARCHAR(36) NOT NULL,
			uraian_tugas TEXT NOT NULL,
			satuan VARCHAR(64) NOT NULL,
			norma_waktu DOUBLE NOT NULL,
			target_kuantitas DOUBLE NOT NULL,
			frekuensi VARCHAR(16) NOT NULL,
			kategori VARCHAR(16) NOT NULL DEFAULT 'utama',
			created_at DATETIME NOT NULL,
			updated_at DATETIME NOT NULL,
			deleted_at DATETIME NULL,
			PRIMARY KEY (id),
			INDEX idx_aktivitas_jabatan (jabatan_id),
			CONSTRAINT fk_aktivitas_jabatan FOREIGN KEY (jabatan_id) REFERENCES jabatan(id) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

		`CREATE TABLE IF NOT EXISTS perhitungan_abk (
			id VARCHAR(36) NOT NULL,
			jabatan_id VARCHAR(36) NOT NULL,
			total_waktu_kerja DOUBLE NOT NULL DEFAULT 0,
			waktu_kerja_efektif DOUBLE NOT NULL DEFAULT 1250,
			beban_kerja DOUBLE NOT NULL DEFAULT 0,
			kebutuhan_pegawai INT NOT NULL DEFAULT 0,
			pegawai_existing INT NOT NULL DEFAULT 0,
			selisih INT NOT NULL DEFAULT 0,
			keterangan VARCHAR(32),
			created_at DATETIME NOT NULL,
			updated_at DATETIME NOT NULL,
			deleted_at DATETIME NULL,
			PRIMARY KEY (id),
			INDEX idx_perhitungan_jabatan (jabatan_id),
			CONSTRAINT fk_perhitungan_jabatan FOREIGN KEY (jabatan_id) REFERENCES jabatan(id) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

		`CREATE TABLE IF NOT EXISTS laporan_abk (
			id VARCHAR(36) NOT NULL,
			opd_id VARCHAR(36) NOT NULL,
			periode VARCHAR(16) NOT NULL,
			tanggal_dibuat DATE NOT NULL,
			status VARCHAR(16) NOT NULL DEFAULT 'draft',
			total_jabatan INT NOT NULL DEFAULT 0,
			total_kebutuhan_pegawai INT NOT NULL DEFAULT 0,
			total_pegawai_existing INT NOT NULL DEFAULT 0,
			efisiensi DOUBLE NOT NULL DEFAULT 0,
			created_at DATETIME NOT NULL,
			updated_at DATETIME NOT NULL,
			deleted_at DATETIME NULL,
			PRIMARY KEY (id),
			INDEX idx_laporan_abk_opd (opd_id),
			CONSTRAINT fk_laporan_abk_opd FOREIGN KEY (opd_id) REFERENCES opd(id) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

		`CREATE TABLE IF NOT EXISTS dokumen_anjab (
			id VARCHAR(36) NOT NULL,
			opd_id VARCHAR(36) NOT NULL,
			nomor_dokumen VARCHAR(64),
			nama_opd VARCHAR(255) NOT NULL,
			periode VARCHAR(16) NOT NULL,
			jumlah_jabatan INT NOT NULL DEFAULT 0,
			tanggal_dibuat DATE NOT NULL,
			status VARCHAR(16) NOT NULL DEFAULT 'draft',
			pembuat VARCHAR(255),
			penyetuju VARCHAR(255),
			created_at DATETIME NOT NULL,
			updated_at DATETIME NOT NULL,
			deleted_at DATETIME NULL,
			PRIMARY KEY (id),
			INDEX idx_dokumen_anjab_opd (opd_id),
			CONSTRAINT fk_dokumen_anjab_opd FOREIGN KEY (opd_id) REFERENCES opd(id) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

		`CREATE TABLE IF NOT EXISTS spesifikasi_jabatan (
			id VARCHAR(36) NOT NULL,
			jabatan_id VARCHAR(36) NOT NULL,
			pendidikan_formal JSON,
			pelatihan JSON,
			pengalaman JSON,
			kompetensi_manajerial JSON,
			kompetensi_teknis JSON,
			kondisi_fisik JSON,
			created_at DATETIME NOT NULL,
			updated_at DATETIME NOT NULL,
			deleted_at DATETIME NULL,
			PRIMARY KEY (id),
			UNIQUE KEY uq_spesifikasi_jabatan (jabatan_id),
			CONSTRAINT fk_spesifikasi_jabatan FOREIGN KEY (jabatan_id) REFERENCES jabatan(id) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

		`CREATE TABLE IF NOT EXISTS uraian_jabatan (
			id VARCHAR(36) NOT NULL,
			jabatan_id VARCHAR(36) NOT NULL,
			tugas JSON,
			fungsi JSON,
			wewenang JSON,
			tanggung_jawab JSON,
			created_at DATETIME NOT NULL,
			updated_at DATETIME NOT NULL,
			deleted_at DATETIME NULL,
			PRIMARY KEY (id),
			UNIQUE KEY uq_uraian_jabatan (jabatan_id),
			CONSTRAINT fk_uraian_jabatan FOREIGN KEY (jabatan_id) REFERENCES jabatan(id) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

		`CREATE TABLE IF NOT EXISTS nilai_sakip (
			id VARCHAR(36) NOT NULL,
			opd_id VARCHAR(36) NOT NULL,
			tahun INT NOT NULL,
			nilai_total DOUBLE NOT NULL DEFAULT 0,
			predikat VARCHAR(4),
			komponen_nilai JSON,
			created_at DATETIME NOT NULL,
			updated_at DATETIME NOT NULL,
			deleted_at DATETIME NULL,
			PRIMARY KEY (id),
			INDEX idx_nilai_sakip_opd (opd_id),
			UNIQUE KEY uq_nilai_sakip_opd_tahun (opd_id, tahun),
			CONSTRAINT fk_nilai_sakip_opd FOREIGN KEY (opd_id) REFERENCES opd(id) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

		`CREATE TABLE IF NOT EXISTS dokumen_sakip (
			id VARCHAR(36) NOT NULL,
			opd_id VARCHAR(36) NOT NULL,
			tahun INT NOT NULL,
			jenis_dokumen VARCHAR(32) NOT NULL,
			nama_dokumen VARCHAR(255) NOT NULL,
			file_path VARCHAR(512),
			uploaded_by VARCHAR(255),
			created_at DATETIME NOT NULL,
			updated_at DATETIME NOT NULL,
			deleted_at DATETIME NULL,
			PRIMARY KEY (id),
			INDEX idx_dokumen_sakip_opd (opd_id),
			CONSTRAINT fk_dokumen_sakip_opd FOREIGN KEY (opd_id) REFERENCES opd(id) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
	}

	for _, stmt := range statements {
		if _, err := db.Exec(stmt); err != nil {
			return err
		}
	}
	return nil
}

func Seed(db *sql.DB) error {
	const seedSQL = `
	INSERT IGNORE INTO roles (id, kode, nama, level, deskripsi, created_at, updated_at)
	VALUES
		(UUID(), 'ADM', 'Administrator', 'inti', 'Akses penuh ke seluruh sistem', NOW(), NOW()),
		(UUID(), 'OPR', 'Operator', 'operasional', 'Mengelola data OPD dan input data', NOW(), NOW()),
		(UUID(), 'REV', 'Reviewer', 'review', 'Review dan persetujuan dokumen', NOW(), NOW());
	`
	_, err := db.Exec(seedSQL)
	return err
}
