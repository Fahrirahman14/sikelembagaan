package store

import (
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"
)

type Aktivitas struct {
	ID              string     `json:"id"`
	JabatanID       string     `json:"jabatan_id"`
	JabatanNama     string     `json:"jabatan_nama,omitempty"`
	UraianTugas     string     `json:"uraian_tugas"`
	Satuan          string     `json:"satuan"`
	NormaWaktu      float64    `json:"norma_waktu"`
	TargetKuantitas float64    `json:"target_kuantitas"`
	Frekuensi       string     `json:"frekuensi"`
	Kategori        string     `json:"kategori"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
	DeletedAt       *time.Time `json:"deleted_at,omitempty"`
}

func ListAktivitas(ctx context.Context, db *sql.DB, jabatanID, kategori, search string) ([]Aktivitas, error) {
	query := `
		SELECT a.id, a.jabatan_id, COALESCE(j.nama,''), a.uraian_tugas, a.satuan, a.norma_waktu,
			a.target_kuantitas, a.frekuensi, a.kategori, a.created_at, a.updated_at
		FROM aktivitas a LEFT JOIN jabatan j ON j.id = a.jabatan_id
		WHERE a.deleted_at IS NULL`
	args := make([]any, 0)
	if jabatanID != "" {
		query += " AND a.jabatan_id = ?"
		args = append(args, jabatanID)
	}
	if kategori != "" {
		query += " AND a.kategori = ?"
		args = append(args, kategori)
	}
	if search != "" {
		query += " AND a.uraian_tugas LIKE ?"
		args = append(args, "%"+search+"%")
	}
	query += " ORDER BY a.created_at ASC"

	rows, err := db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]Aktivitas, 0)
	for rows.Next() {
		var a Aktivitas
		if err := rows.Scan(&a.ID, &a.JabatanID, &a.JabatanNama, &a.UraianTugas, &a.Satuan,
			&a.NormaWaktu, &a.TargetKuantitas, &a.Frekuensi, &a.Kategori,
			&a.CreatedAt, &a.UpdatedAt); err != nil {
			return nil, err
		}
		out = append(out, a)
	}
	return out, rows.Err()
}

func GetAktivitasByID(ctx context.Context, db *sql.DB, id string) (Aktivitas, error) {
	var a Aktivitas
	err := db.QueryRowContext(ctx, `
		SELECT a.id, a.jabatan_id, COALESCE(j.nama,''), a.uraian_tugas, a.satuan, a.norma_waktu,
			a.target_kuantitas, a.frekuensi, a.kategori, a.created_at, a.updated_at
		FROM aktivitas a LEFT JOIN jabatan j ON j.id = a.jabatan_id
		WHERE a.id = ? AND a.deleted_at IS NULL`, id,
	).Scan(&a.ID, &a.JabatanID, &a.JabatanNama, &a.UraianTugas, &a.Satuan,
		&a.NormaWaktu, &a.TargetKuantitas, &a.Frekuensi, &a.Kategori,
		&a.CreatedAt, &a.UpdatedAt)
	return a, err
}

func CreateAktivitas(ctx context.Context, db *sql.DB, jabatanID, uraianTugas, satuan string, normaWaktu, targetKuantitas float64, frekuensi, kategori string) (Aktivitas, error) {
	jabatanID = strings.TrimSpace(jabatanID)
	uraianTugas = strings.TrimSpace(uraianTugas)
	if jabatanID == "" || uraianTugas == "" || satuan == "" {
		return Aktivitas{}, errors.New("jabatan_id, uraian_tugas, satuan wajib diisi")
	}
	id, err := newUUID(ctx, db)
	if err != nil {
		return Aktivitas{}, err
	}
	now := time.Now().UTC()
	_, err = db.ExecContext(ctx, `
		INSERT INTO aktivitas (id, jabatan_id, uraian_tugas, satuan, norma_waktu, target_kuantitas, frekuensi, kategori, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		id, jabatanID, uraianTugas, satuan, normaWaktu, targetKuantitas, frekuensi, kategori, now, now,
	)
	if err != nil {
		return Aktivitas{}, err
	}
	return GetAktivitasByID(ctx, db, id)
}

func UpdateAktivitas(ctx context.Context, db *sql.DB, id, jabatanID, uraianTugas, satuan string, normaWaktu, targetKuantitas float64, frekuensi, kategori string) (Aktivitas, error) {
	now := time.Now().UTC()
	res, err := db.ExecContext(ctx, `
		UPDATE aktivitas SET jabatan_id=?, uraian_tugas=?, satuan=?, norma_waktu=?, target_kuantitas=?, frekuensi=?, kategori=?, updated_at=?
		WHERE id=? AND deleted_at IS NULL`,
		jabatanID, uraianTugas, satuan, normaWaktu, targetKuantitas, frekuensi, kategori, now, id,
	)
	if err != nil {
		return Aktivitas{}, err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return Aktivitas{}, sql.ErrNoRows
	}
	return GetAktivitasByID(ctx, db, id)
}

func SoftDeleteAktivitas(ctx context.Context, db *sql.DB, id string) error {
	now := time.Now().UTC()
	res, err := db.ExecContext(ctx,
		"UPDATE aktivitas SET deleted_at=?, updated_at=? WHERE id=? AND deleted_at IS NULL", now, now, id,
	)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return sql.ErrNoRows
	}
	return nil
}
