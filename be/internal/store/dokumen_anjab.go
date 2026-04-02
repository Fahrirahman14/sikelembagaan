package store

import (
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"
)

type DokumenAnjab struct {
	ID            string     `json:"id"`
	OpdID         string     `json:"opd_id"`
	OpdNama       string     `json:"opd_nama,omitempty"`
	NomorDokumen  string     `json:"nomor_dokumen"`
	NamaOpd       string     `json:"nama_opd"`
	Periode       string     `json:"periode"`
	JumlahJabatan int        `json:"jumlah_jabatan"`
	TanggalDibuat time.Time  `json:"tanggal_dibuat"`
	Status        string     `json:"status"`
	Pembuat       string     `json:"pembuat"`
	Penyetuju     string     `json:"penyetuju"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
	DeletedAt     *time.Time `json:"deleted_at,omitempty"`
}

func ListDokumenAnjab(ctx context.Context, db *sql.DB, opdID, status, search string) ([]DokumenAnjab, error) {
	query := `
		SELECT d.id, d.opd_id, COALESCE(o.nama,''), COALESCE(d.nomor_dokumen,''), d.nama_opd, d.periode,
			d.jumlah_jabatan, d.tanggal_dibuat, d.status, COALESCE(d.pembuat,''), COALESCE(d.penyetuju,''),
			d.created_at, d.updated_at
		FROM dokumen_anjab d LEFT JOIN opd o ON o.id = d.opd_id
		WHERE d.deleted_at IS NULL`
	args := make([]any, 0)
	if opdID != "" {
		query += " AND d.opd_id = ?"
		args = append(args, opdID)
	}
	if status != "" {
		query += " AND d.status = ?"
		args = append(args, status)
	}
	if search != "" {
		query += " AND (d.nama_opd LIKE ? OR d.nomor_dokumen LIKE ?)"
		s := "%" + search + "%"
		args = append(args, s, s)
	}
	query += " ORDER BY d.tanggal_dibuat DESC"

	rows, err := db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]DokumenAnjab, 0)
	for rows.Next() {
		var d DokumenAnjab
		if err := rows.Scan(&d.ID, &d.OpdID, &d.OpdNama, &d.NomorDokumen, &d.NamaOpd, &d.Periode,
			&d.JumlahJabatan, &d.TanggalDibuat, &d.Status, &d.Pembuat, &d.Penyetuju,
			&d.CreatedAt, &d.UpdatedAt); err != nil {
			return nil, err
		}
		out = append(out, d)
	}
	return out, rows.Err()
}

func GetDokumenAnjabByID(ctx context.Context, db *sql.DB, id string) (DokumenAnjab, error) {
	var d DokumenAnjab
	err := db.QueryRowContext(ctx, `
		SELECT d.id, d.opd_id, COALESCE(o.nama,''), COALESCE(d.nomor_dokumen,''), d.nama_opd, d.periode,
			d.jumlah_jabatan, d.tanggal_dibuat, d.status, COALESCE(d.pembuat,''), COALESCE(d.penyetuju,''),
			d.created_at, d.updated_at
		FROM dokumen_anjab d LEFT JOIN opd o ON o.id = d.opd_id
		WHERE d.id = ? AND d.deleted_at IS NULL`, id,
	).Scan(&d.ID, &d.OpdID, &d.OpdNama, &d.NomorDokumen, &d.NamaOpd, &d.Periode,
		&d.JumlahJabatan, &d.TanggalDibuat, &d.Status, &d.Pembuat, &d.Penyetuju,
		&d.CreatedAt, &d.UpdatedAt)
	return d, err
}

func CreateDokumenAnjab(ctx context.Context, db *sql.DB, opdID, nomorDokumen, namaOpd, periode string, jumlahJabatan int, tanggalDibuat time.Time, pembuat string) (DokumenAnjab, error) {
	opdID = strings.TrimSpace(opdID)
	namaOpd = strings.TrimSpace(namaOpd)
	if opdID == "" || namaOpd == "" || periode == "" {
		return DokumenAnjab{}, errors.New("opd_id, nama_opd, periode wajib diisi")
	}
	id, err := newUUID(ctx, db)
	if err != nil {
		return DokumenAnjab{}, err
	}
	now := time.Now().UTC()
	_, err = db.ExecContext(ctx, `
		INSERT INTO dokumen_anjab (id, opd_id, nomor_dokumen, nama_opd, periode, jumlah_jabatan, tanggal_dibuat, status, pembuat, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?)`,
		id, opdID, nomorDokumen, namaOpd, periode, jumlahJabatan, tanggalDibuat, pembuat, now, now,
	)
	if err != nil {
		return DokumenAnjab{}, err
	}
	return GetDokumenAnjabByID(ctx, db, id)
}

func UpdateDokumenAnjab(ctx context.Context, db *sql.DB, id, nomorDokumen, namaOpd, periode string, jumlahJabatan int, status, pembuat, penyetuju string) (DokumenAnjab, error) {
	now := time.Now().UTC()
	res, err := db.ExecContext(ctx, `
		UPDATE dokumen_anjab SET nomor_dokumen=?, nama_opd=?, periode=?, jumlah_jabatan=?, status=?, pembuat=?, penyetuju=?, updated_at=?
		WHERE id=? AND deleted_at IS NULL`,
		nomorDokumen, namaOpd, periode, jumlahJabatan, status, pembuat, penyetuju, now, id,
	)
	if err != nil {
		return DokumenAnjab{}, err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return DokumenAnjab{}, sql.ErrNoRows
	}
	return GetDokumenAnjabByID(ctx, db, id)
}

func UpdateDokumenAnjabStatus(ctx context.Context, db *sql.DB, id, status, penyetuju string) (DokumenAnjab, error) {
	now := time.Now().UTC()
	res, err := db.ExecContext(ctx, `
		UPDATE dokumen_anjab SET status=?, penyetuju=?, updated_at=? WHERE id=? AND deleted_at IS NULL`,
		status, penyetuju, now, id,
	)
	if err != nil {
		return DokumenAnjab{}, err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return DokumenAnjab{}, sql.ErrNoRows
	}
	return GetDokumenAnjabByID(ctx, db, id)
}

func SoftDeleteDokumenAnjab(ctx context.Context, db *sql.DB, id string) error {
	now := time.Now().UTC()
	res, err := db.ExecContext(ctx,
		"UPDATE dokumen_anjab SET deleted_at=?, updated_at=? WHERE id=? AND deleted_at IS NULL", now, now, id,
	)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return sql.ErrNoRows
	}
	return nil
}
