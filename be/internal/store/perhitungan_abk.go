package store

import (
	"context"
	"database/sql"
	"math"
	"time"
)

type PerhitunganABK struct {
	ID                string     `json:"id"`
	JabatanID         string     `json:"jabatan_id"`
	JabatanNama       string     `json:"jabatan_nama,omitempty"`
	TotalWaktuKerja   float64    `json:"total_waktu_kerja"`
	WaktuKerjaEfektif float64    `json:"waktu_kerja_efektif"`
	BebanKerja        float64    `json:"beban_kerja"`
	KebutuhanPegawai  int        `json:"kebutuhan_pegawai"`
	PegawaiExisting   int        `json:"pegawai_existing"`
	Selisih           int        `json:"selisih"`
	Keterangan        string     `json:"keterangan"`
	CreatedAt         time.Time  `json:"created_at"`
	UpdatedAt         time.Time  `json:"updated_at"`
	DeletedAt         *time.Time `json:"deleted_at,omitempty"`
}

func ListPerhitunganABK(ctx context.Context, db *sql.DB, jabatanID string) ([]PerhitunganABK, error) {
	query := `
		SELECT p.id, p.jabatan_id, COALESCE(j.nama,''), p.total_waktu_kerja, p.waktu_kerja_efektif,
			p.beban_kerja, p.kebutuhan_pegawai, p.pegawai_existing, p.selisih, COALESCE(p.keterangan,''),
			p.created_at, p.updated_at
		FROM perhitungan_abk p LEFT JOIN jabatan j ON j.id = p.jabatan_id
		WHERE p.deleted_at IS NULL`
	args := make([]any, 0)
	if jabatanID != "" {
		query += " AND p.jabatan_id = ?"
		args = append(args, jabatanID)
	}
	query += " ORDER BY j.nama ASC"

	rows, err := db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]PerhitunganABK, 0)
	for rows.Next() {
		var p PerhitunganABK
		if err := rows.Scan(&p.ID, &p.JabatanID, &p.JabatanNama, &p.TotalWaktuKerja, &p.WaktuKerjaEfektif,
			&p.BebanKerja, &p.KebutuhanPegawai, &p.PegawaiExisting, &p.Selisih, &p.Keterangan,
			&p.CreatedAt, &p.UpdatedAt); err != nil {
			return nil, err
		}
		out = append(out, p)
	}
	return out, rows.Err()
}

func GetPerhitunganByID(ctx context.Context, db *sql.DB, id string) (PerhitunganABK, error) {
	var p PerhitunganABK
	err := db.QueryRowContext(ctx, `
		SELECT p.id, p.jabatan_id, COALESCE(j.nama,''), p.total_waktu_kerja, p.waktu_kerja_efektif,
			p.beban_kerja, p.kebutuhan_pegawai, p.pegawai_existing, p.selisih, COALESCE(p.keterangan,''),
			p.created_at, p.updated_at
		FROM perhitungan_abk p LEFT JOIN jabatan j ON j.id = p.jabatan_id
		WHERE p.id = ? AND p.deleted_at IS NULL`, id,
	).Scan(&p.ID, &p.JabatanID, &p.JabatanNama, &p.TotalWaktuKerja, &p.WaktuKerjaEfektif,
		&p.BebanKerja, &p.KebutuhanPegawai, &p.PegawaiExisting, &p.Selisih, &p.Keterangan,
		&p.CreatedAt, &p.UpdatedAt)
	return p, err
}

// CalculateABK menghitung beban kerja untuk jabatan tertentu berdasarkan aktivitas
func CalculateABK(ctx context.Context, db *sql.DB, jabatanID string, pegawaiExisting int, waktuKerjaEfektif float64) (PerhitunganABK, error) {
	if waktuKerjaEfektif <= 0 {
		waktuKerjaEfektif = 1250 // default jam/tahun
	}

	// Hitung total waktu kerja dari aktivitas
	var totalWaktu sql.NullFloat64
	err := db.QueryRowContext(ctx, `
		SELECT SUM(
			CASE frekuensi
				WHEN 'harian' THEN (norma_waktu / 60) * target_kuantitas * 235
				WHEN 'mingguan' THEN (norma_waktu / 60) * target_kuantitas * 47
				WHEN 'bulanan' THEN (norma_waktu / 60) * target_kuantitas * 12
				WHEN 'tahunan' THEN (norma_waktu / 60) * target_kuantitas * 1
				ELSE 0
			END
		) FROM aktivitas WHERE jabatan_id = ? AND deleted_at IS NULL`, jabatanID,
	).Scan(&totalWaktu)
	if err != nil {
		return PerhitunganABK{}, err
	}

	totalWaktuKerja := 0.0
	if totalWaktu.Valid {
		totalWaktuKerja = totalWaktu.Float64
	}

	bebanKerja := totalWaktuKerja / waktuKerjaEfektif
	kebutuhanPegawai := int(math.Ceil(bebanKerja))
	selisih := pegawaiExisting - kebutuhanPegawai

	keterangan := "Sesuai"
	if selisih > 0 {
		keterangan = "Kelebihan"
	} else if selisih < 0 {
		keterangan = "Kekurangan"
	}

	now := time.Now().UTC()

	// Upsert perhitungan
	var existingID string
	err = db.QueryRowContext(ctx,
		"SELECT id FROM perhitungan_abk WHERE jabatan_id = ? AND deleted_at IS NULL", jabatanID,
	).Scan(&existingID)

	if err == sql.ErrNoRows {
		id, err := newUUID(ctx, db)
		if err != nil {
			return PerhitunganABK{}, err
		}
		_, err = db.ExecContext(ctx, `
			INSERT INTO perhitungan_abk (id, jabatan_id, total_waktu_kerja, waktu_kerja_efektif, beban_kerja, kebutuhan_pegawai, pegawai_existing, selisih, keterangan, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			id, jabatanID, totalWaktuKerja, waktuKerjaEfektif, bebanKerja, kebutuhanPegawai, pegawaiExisting, selisih, keterangan, now, now,
		)
		if err != nil {
			return PerhitunganABK{}, err
		}
		return GetPerhitunganByID(ctx, db, id)
	}
	if err != nil {
		return PerhitunganABK{}, err
	}

	_, err = db.ExecContext(ctx, `
		UPDATE perhitungan_abk SET total_waktu_kerja=?, waktu_kerja_efektif=?, beban_kerja=?, kebutuhan_pegawai=?, pegawai_existing=?, selisih=?, keterangan=?, updated_at=?
		WHERE id=? AND deleted_at IS NULL`,
		totalWaktuKerja, waktuKerjaEfektif, bebanKerja, kebutuhanPegawai, pegawaiExisting, selisih, keterangan, now, existingID,
	)
	if err != nil {
		return PerhitunganABK{}, err
	}
	return GetPerhitunganByID(ctx, db, existingID)
}
