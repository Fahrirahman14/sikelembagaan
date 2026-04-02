package store

import (
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"
)

type LaporanABK struct {
	ID                    string     `json:"id"`
	OpdID                 string     `json:"opd_id"`
	OpdNama               string     `json:"opd_nama,omitempty"`
	Periode               string     `json:"periode"`
	TanggalDibuat         time.Time  `json:"tanggal_dibuat"`
	Status                string     `json:"status"`
	TotalJabatan          int        `json:"total_jabatan"`
	TotalKebutuhanPegawai int        `json:"total_kebutuhan_pegawai"`
	TotalPegawaiExisting  int        `json:"total_pegawai_existing"`
	Efisiensi             float64    `json:"efisiensi"`
	CreatedAt             time.Time  `json:"created_at"`
	UpdatedAt             time.Time  `json:"updated_at"`
	DeletedAt             *time.Time `json:"deleted_at,omitempty"`
}

func ListLaporanABK(ctx context.Context, db *sql.DB, opdID string) ([]LaporanABK, error) {
	query := `
		SELECT l.id, l.opd_id, COALESCE(o.nama,''), l.periode, l.tanggal_dibuat, l.status,
			l.total_jabatan, l.total_kebutuhan_pegawai, l.total_pegawai_existing, l.efisiensi,
			l.created_at, l.updated_at
		FROM laporan_abk l LEFT JOIN opd o ON o.id = l.opd_id
		WHERE l.deleted_at IS NULL`
	args := make([]any, 0)
	if opdID != "" {
		query += " AND l.opd_id = ?"
		args = append(args, opdID)
	}
	query += " ORDER BY l.tanggal_dibuat DESC"

	rows, err := db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]LaporanABK, 0)
	for rows.Next() {
		var l LaporanABK
		if err := rows.Scan(&l.ID, &l.OpdID, &l.OpdNama, &l.Periode, &l.TanggalDibuat, &l.Status,
			&l.TotalJabatan, &l.TotalKebutuhanPegawai, &l.TotalPegawaiExisting, &l.Efisiensi,
			&l.CreatedAt, &l.UpdatedAt); err != nil {
			return nil, err
		}
		out = append(out, l)
	}
	return out, rows.Err()
}

func GetLaporanABKByID(ctx context.Context, db *sql.DB, id string) (LaporanABK, error) {
	var l LaporanABK
	err := db.QueryRowContext(ctx, `
		SELECT l.id, l.opd_id, COALESCE(o.nama,''), l.periode, l.tanggal_dibuat, l.status,
			l.total_jabatan, l.total_kebutuhan_pegawai, l.total_pegawai_existing, l.efisiensi,
			l.created_at, l.updated_at
		FROM laporan_abk l LEFT JOIN opd o ON o.id = l.opd_id
		WHERE l.id = ? AND l.deleted_at IS NULL`, id,
	).Scan(&l.ID, &l.OpdID, &l.OpdNama, &l.Periode, &l.TanggalDibuat, &l.Status,
		&l.TotalJabatan, &l.TotalKebutuhanPegawai, &l.TotalPegawaiExisting, &l.Efisiensi,
		&l.CreatedAt, &l.UpdatedAt)
	return l, err
}

func CreateLaporanABK(ctx context.Context, db *sql.DB, opdID, periode string, tanggalDibuat time.Time,
	totalJabatan, totalKebutuhanPegawai, totalPegawaiExisting int, efisiensi float64) (LaporanABK, error) {
	opdID = strings.TrimSpace(opdID)
	periode = strings.TrimSpace(periode)
	if opdID == "" || periode == "" {
		return LaporanABK{}, errors.New("opd_id dan periode wajib diisi")
	}
	id, err := newUUID(ctx, db)
	if err != nil {
		return LaporanABK{}, err
	}
	now := time.Now().UTC()
	_, err = db.ExecContext(ctx, `
		INSERT INTO laporan_abk (id, opd_id, periode, tanggal_dibuat, status, total_jabatan, total_kebutuhan_pegawai, total_pegawai_existing, efisiensi, created_at, updated_at)
		VALUES (?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?)`,
		id, opdID, periode, tanggalDibuat, totalJabatan, totalKebutuhanPegawai, totalPegawaiExisting, efisiensi, now, now,
	)
	if err != nil {
		return LaporanABK{}, err
	}
	return GetLaporanABKByID(ctx, db, id)
}

func UpdateLaporanABK(ctx context.Context, db *sql.DB, id, status string, totalJabatan, totalKebutuhanPegawai, totalPegawaiExisting int, efisiensi float64) (LaporanABK, error) {
	now := time.Now().UTC()
	res, err := db.ExecContext(ctx, `
		UPDATE laporan_abk SET status=?, total_jabatan=?, total_kebutuhan_pegawai=?, total_pegawai_existing=?, efisiensi=?, updated_at=?
		WHERE id=? AND deleted_at IS NULL`,
		status, totalJabatan, totalKebutuhanPegawai, totalPegawaiExisting, efisiensi, now, id,
	)
	if err != nil {
		return LaporanABK{}, err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return LaporanABK{}, sql.ErrNoRows
	}
	return GetLaporanABKByID(ctx, db, id)
}
