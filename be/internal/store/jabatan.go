package store

import (
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"
)

type Jabatan struct {
	ID                    string     `json:"id"`
	OpdID                 string     `json:"opd_id"`
	OpdNama               string     `json:"opd_nama,omitempty"`
	Kode                  string     `json:"kode"`
	Nama                  string     `json:"nama"`
	Jenis                 string     `json:"jenis"`
	Eselon                string     `json:"eselon"`
	UnitKerja             string     `json:"unit_kerja"`
	Ikhtisar              string     `json:"ikhtisar"`
	KualifikasiPendidikan string     `json:"kualifikasi_pendidikan"`
	Pengalaman            string     `json:"pengalaman"`
	StatusAnjab           string     `json:"status_anjab"`
	CreatedAt             time.Time  `json:"created_at"`
	UpdatedAt             time.Time  `json:"updated_at"`
	DeletedAt             *time.Time `json:"deleted_at,omitempty"`
}

func ListJabatan(ctx context.Context, db *sql.DB, opdID, jenis, search string) ([]Jabatan, error) {
	query := `
		SELECT j.id, j.opd_id, COALESCE(o.nama,''), j.kode, j.nama, j.jenis, COALESCE(j.eselon,''),
			COALESCE(j.unit_kerja,''), COALESCE(j.ikhtisar,''), COALESCE(j.kualifikasi_pendidikan,''),
			COALESCE(j.pengalaman,''), j.status_anjab, j.created_at, j.updated_at
		FROM jabatan j
		LEFT JOIN opd o ON o.id = j.opd_id
		WHERE j.deleted_at IS NULL`
	args := make([]any, 0)
	if opdID != "" {
		query += " AND j.opd_id = ?"
		args = append(args, opdID)
	}
	if jenis != "" {
		query += " AND j.jenis = ?"
		args = append(args, jenis)
	}
	if search != "" {
		query += " AND (j.nama LIKE ? OR j.kode LIKE ?)"
		s := "%" + search + "%"
		args = append(args, s, s)
	}
	query += " ORDER BY j.nama ASC"

	rows, err := db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]Jabatan, 0)
	for rows.Next() {
		var j Jabatan
		if err := rows.Scan(&j.ID, &j.OpdID, &j.OpdNama, &j.Kode, &j.Nama, &j.Jenis, &j.Eselon,
			&j.UnitKerja, &j.Ikhtisar, &j.KualifikasiPendidikan, &j.Pengalaman,
			&j.StatusAnjab, &j.CreatedAt, &j.UpdatedAt); err != nil {
			return nil, err
		}
		out = append(out, j)
	}
	return out, rows.Err()
}

func GetJabatanByID(ctx context.Context, db *sql.DB, id string) (Jabatan, error) {
	var j Jabatan
	err := db.QueryRowContext(ctx, `
		SELECT j.id, j.opd_id, COALESCE(o.nama,''), j.kode, j.nama, j.jenis, COALESCE(j.eselon,''),
			COALESCE(j.unit_kerja,''), COALESCE(j.ikhtisar,''), COALESCE(j.kualifikasi_pendidikan,''),
			COALESCE(j.pengalaman,''), j.status_anjab, j.created_at, j.updated_at
		FROM jabatan j LEFT JOIN opd o ON o.id = j.opd_id
		WHERE j.id = ? AND j.deleted_at IS NULL`, id,
	).Scan(&j.ID, &j.OpdID, &j.OpdNama, &j.Kode, &j.Nama, &j.Jenis, &j.Eselon,
		&j.UnitKerja, &j.Ikhtisar, &j.KualifikasiPendidikan, &j.Pengalaman,
		&j.StatusAnjab, &j.CreatedAt, &j.UpdatedAt)
	return j, err
}

func CreateJabatan(ctx context.Context, db *sql.DB, opdID, kode, nama, jenis, eselon, unitKerja, ikhtisar, kualifikasi, pengalaman string) (Jabatan, error) {
	opdID = strings.TrimSpace(opdID)
	kode = strings.TrimSpace(kode)
	nama = strings.TrimSpace(nama)
	if opdID == "" || kode == "" || nama == "" || jenis == "" {
		return Jabatan{}, errors.New("opd_id, kode, nama, jenis wajib diisi")
	}
	id, err := newUUID(ctx, db)
	if err != nil {
		return Jabatan{}, err
	}
	now := time.Now().UTC()
	_, err = db.ExecContext(ctx, `
		INSERT INTO jabatan (id, opd_id, kode, nama, jenis, eselon, unit_kerja, ikhtisar, kualifikasi_pendidikan, pengalaman, status_anjab, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)`,
		id, opdID, kode, nama, jenis, eselon, unitKerja, ikhtisar, kualifikasi, pengalaman, now, now,
	)
	if err != nil {
		return Jabatan{}, err
	}
	return GetJabatanByID(ctx, db, id)
}

func UpdateJabatan(ctx context.Context, db *sql.DB, id, opdID, kode, nama, jenis, eselon, unitKerja, ikhtisar, kualifikasi, pengalaman, statusAnjab string) (Jabatan, error) {
	now := time.Now().UTC()
	res, err := db.ExecContext(ctx, `
		UPDATE jabatan SET opd_id=?, kode=?, nama=?, jenis=?, eselon=?, unit_kerja=?, ikhtisar=?,
			kualifikasi_pendidikan=?, pengalaman=?, status_anjab=?, updated_at=?
		WHERE id=? AND deleted_at IS NULL`,
		opdID, kode, nama, jenis, eselon, unitKerja, ikhtisar, kualifikasi, pengalaman, statusAnjab, now, id,
	)
	if err != nil {
		return Jabatan{}, err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return Jabatan{}, sql.ErrNoRows
	}
	return GetJabatanByID(ctx, db, id)
}

func SoftDeleteJabatan(ctx context.Context, db *sql.DB, id string) error {
	now := time.Now().UTC()
	res, err := db.ExecContext(ctx,
		"UPDATE jabatan SET deleted_at=?, updated_at=? WHERE id=? AND deleted_at IS NULL", now, now, id,
	)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return sql.ErrNoRows
	}
	return nil
}
