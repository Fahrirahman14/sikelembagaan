package store

import (
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"
)

type OPD struct {
	ID           string     `json:"id"`
	Kode         string     `json:"kode"`
	Nama         string     `json:"nama"`
	Alamat       string     `json:"alamat"`
	Telepon      string     `json:"telepon"`
	Email        string     `json:"email"`
	Kepala       string     `json:"kepala"`
	NipKepala    string     `json:"nip_kepala"`
	StatusAnjab  string     `json:"status_anjab"`
	StatusAbk    string     `json:"status_abk"`
	TotalPegawai int        `json:"total_pegawai"`
	TotalJabatan int        `json:"total_jabatan"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
	DeletedAt    *time.Time `json:"deleted_at,omitempty"`
}

func ListOPD(ctx context.Context, db *sql.DB, search string) ([]OPD, error) {
	query := `
		SELECT o.id, o.kode, o.nama, COALESCE(o.alamat,''), COALESCE(o.telepon,''), COALESCE(o.email,''),
			COALESCE(o.kepala,''), COALESCE(o.nip_kepala,''), o.status_anjab, o.status_abk,
			(SELECT COUNT(*) FROM pejabat p WHERE p.opd_id = o.id AND p.deleted_at IS NULL) as total_pegawai,
			(SELECT COUNT(*) FROM jabatan j WHERE j.opd_id = o.id AND j.deleted_at IS NULL) as total_jabatan,
			o.created_at, o.updated_at
		FROM opd o WHERE o.deleted_at IS NULL`

	args := make([]any, 0)
	if search != "" {
		query += " AND (o.nama LIKE ? OR o.kode LIKE ?)"
		s := "%" + search + "%"
		args = append(args, s, s)
	}
	query += " ORDER BY o.nama ASC"

	rows, err := db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]OPD, 0)
	for rows.Next() {
		var o OPD
		if err := rows.Scan(&o.ID, &o.Kode, &o.Nama, &o.Alamat, &o.Telepon, &o.Email,
			&o.Kepala, &o.NipKepala, &o.StatusAnjab, &o.StatusAbk,
			&o.TotalPegawai, &o.TotalJabatan, &o.CreatedAt, &o.UpdatedAt); err != nil {
			return nil, err
		}
		out = append(out, o)
	}
	return out, rows.Err()
}

func GetOPDByID(ctx context.Context, db *sql.DB, id string) (OPD, error) {
	var o OPD
	err := db.QueryRowContext(ctx, `
		SELECT o.id, o.kode, o.nama, COALESCE(o.alamat,''), COALESCE(o.telepon,''), COALESCE(o.email,''),
			COALESCE(o.kepala,''), COALESCE(o.nip_kepala,''), o.status_anjab, o.status_abk,
			(SELECT COUNT(*) FROM pejabat p WHERE p.opd_id = o.id AND p.deleted_at IS NULL),
			(SELECT COUNT(*) FROM jabatan j WHERE j.opd_id = o.id AND j.deleted_at IS NULL),
			o.created_at, o.updated_at
		FROM opd o WHERE o.id = ? AND o.deleted_at IS NULL`, id,
	).Scan(&o.ID, &o.Kode, &o.Nama, &o.Alamat, &o.Telepon, &o.Email,
		&o.Kepala, &o.NipKepala, &o.StatusAnjab, &o.StatusAbk,
		&o.TotalPegawai, &o.TotalJabatan, &o.CreatedAt, &o.UpdatedAt)
	return o, err
}

func CreateOPD(ctx context.Context, db *sql.DB, kode, nama, alamat, telepon, email, kepala, nipKepala string) (OPD, error) {
	kode = strings.TrimSpace(kode)
	nama = strings.TrimSpace(nama)
	if kode == "" || nama == "" {
		return OPD{}, errors.New("kode dan nama wajib diisi")
	}
	id, err := newUUID(ctx, db)
	if err != nil {
		return OPD{}, err
	}
	now := time.Now().UTC()
	_, err = db.ExecContext(ctx, `
		INSERT INTO opd (id, kode, nama, alamat, telepon, email, kepala, nip_kepala, status_anjab, status_abk, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'belum', 'belum', ?, ?)`,
		id, kode, nama, alamat, telepon, email, kepala, nipKepala, now, now,
	)
	if err != nil {
		return OPD{}, err
	}
	return GetOPDByID(ctx, db, id)
}

func UpdateOPD(ctx context.Context, db *sql.DB, id, kode, nama, alamat, telepon, email, kepala, nipKepala, statusAnjab, statusAbk string) (OPD, error) {
	now := time.Now().UTC()
	res, err := db.ExecContext(ctx, `
		UPDATE opd SET kode=?, nama=?, alamat=?, telepon=?, email=?, kepala=?, nip_kepala=?,
			status_anjab=?, status_abk=?, updated_at=? WHERE id=? AND deleted_at IS NULL`,
		kode, nama, alamat, telepon, email, kepala, nipKepala, statusAnjab, statusAbk, now, id,
	)
	if err != nil {
		return OPD{}, err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return OPD{}, sql.ErrNoRows
	}
	return GetOPDByID(ctx, db, id)
}

func SoftDeleteOPD(ctx context.Context, db *sql.DB, id string) error {
	now := time.Now().UTC()
	res, err := db.ExecContext(ctx,
		"UPDATE opd SET deleted_at=?, updated_at=? WHERE id=? AND deleted_at IS NULL", now, now, id,
	)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return sql.ErrNoRows
	}
	return nil
}
