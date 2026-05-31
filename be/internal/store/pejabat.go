package store

import (
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"
)

type Pejabat struct {
	ID         string     `json:"id"`
	OpdID      string     `json:"opd_id"`
	OpdNama    string     `json:"opd_nama,omitempty"`
	NIP        string     `json:"nip"`
	Nama       string     `json:"nama"`
	Jabatan    string     `json:"jabatan"`
	Eselon     string     `json:"eselon"`
	Pangkat    string     `json:"pangkat"`
	Golongan   string     `json:"golongan"`
	TmtJabatan *time.Time `json:"tmt_jabatan,omitempty"`
	Pendidikan string     `json:"pendidikan"`
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`
	DeletedAt  *time.Time `json:"deleted_at,omitempty"`
}

func ListPejabat(ctx context.Context, db *sql.DB, opdID, search string, limit, offset int) (PaginatedResult[Pejabat], error) {
	base := `
		SELECT p.id, p.opd_id, COALESCE(o.nama,''), p.nip, p.nama, COALESCE(p.jabatan,''), COALESCE(p.eselon,''),
			COALESCE(p.pangkat,''), COALESCE(p.golongan,''), p.tmt_jabatan, COALESCE(p.pendidikan,''),
			p.created_at, p.updated_at
		FROM pejabat p LEFT JOIN opd o ON o.id = p.opd_id
		WHERE p.deleted_at IS NULL`
	cnt := `SELECT COUNT(*) FROM pejabat p WHERE p.deleted_at IS NULL`
	args := make([]any, 0)
	if opdID != "" {
		cond := " AND p.opd_id = ?"
		base += cond
		cnt += cond
		args = append(args, opdID)
	}
	if search != "" {
		base += " AND (p.nama LIKE ? OR p.nip LIKE ?)"
		cnt += " AND (p.nama LIKE ? OR p.nip LIKE ?)"
		s := "%" + search + "%"
		args = append(args, s, s)
	}

	var total int
	if err := db.QueryRowContext(ctx, cnt, args...).Scan(&total); err != nil {
		return PaginatedResult[Pejabat]{}, err
	}

	base += " ORDER BY p.nama ASC"
	pageArgs := append([]any{}, args...)
	if limit > 0 {
		base += " LIMIT ? OFFSET ?"
		pageArgs = append(pageArgs, limit, offset)
	}

	rows, err := db.QueryContext(ctx, base, pageArgs...)
	if err != nil {
		return PaginatedResult[Pejabat]{}, err
	}
	defer rows.Close()

	out := make([]Pejabat, 0)
	for rows.Next() {
		var p Pejabat
		var tmt sql.NullTime
		if err := rows.Scan(&p.ID, &p.OpdID, &p.OpdNama, &p.NIP, &p.Nama, &p.Jabatan, &p.Eselon,
			&p.Pangkat, &p.Golongan, &tmt, &p.Pendidikan, &p.CreatedAt, &p.UpdatedAt); err != nil {
			return PaginatedResult[Pejabat]{}, err
		}
		if tmt.Valid {
			p.TmtJabatan = &tmt.Time
		}
		out = append(out, p)
	}
	if err := rows.Err(); err != nil {
		return PaginatedResult[Pejabat]{}, err
	}
	return PaginatedResult[Pejabat]{Data: out, Total: total, Limit: limit, Offset: offset}, nil
}

func GetPejabatByID(ctx context.Context, db *sql.DB, id string) (Pejabat, error) {
	var p Pejabat
	var tmt sql.NullTime
	err := db.QueryRowContext(ctx, `
		SELECT p.id, p.opd_id, COALESCE(o.nama,''), p.nip, p.nama, COALESCE(p.jabatan,''), COALESCE(p.eselon,''),
			COALESCE(p.pangkat,''), COALESCE(p.golongan,''), p.tmt_jabatan, COALESCE(p.pendidikan,''),
			p.created_at, p.updated_at
		FROM pejabat p LEFT JOIN opd o ON o.id = p.opd_id
		WHERE p.id = ? AND p.deleted_at IS NULL`, id,
	).Scan(&p.ID, &p.OpdID, &p.OpdNama, &p.NIP, &p.Nama, &p.Jabatan, &p.Eselon,
		&p.Pangkat, &p.Golongan, &tmt, &p.Pendidikan, &p.CreatedAt, &p.UpdatedAt)
	if tmt.Valid {
		p.TmtJabatan = &tmt.Time
	}
	return p, err
}

func CreatePejabat(ctx context.Context, db *sql.DB, opdID, nip, nama, jabatan, eselon, pangkat, golongan string, tmtJabatan *time.Time, pendidikan string) (Pejabat, error) {
	opdID = strings.TrimSpace(opdID)
	nip = strings.TrimSpace(nip)
	nama = strings.TrimSpace(nama)
	if opdID == "" || nip == "" || nama == "" {
		return Pejabat{}, errors.New("opd_id, nip, nama wajib diisi")
	}
	id, err := newUUID(ctx, db)
	if err != nil {
		return Pejabat{}, err
	}
	now := time.Now().UTC()
	var tmt sql.NullTime
	if tmtJabatan != nil {
		tmt = sql.NullTime{Time: *tmtJabatan, Valid: true}
	}
	_, err = db.ExecContext(ctx, `
		INSERT INTO pejabat (id, opd_id, nip, nama, jabatan, eselon, pangkat, golongan, tmt_jabatan, pendidikan, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		id, opdID, nip, nama, jabatan, eselon, pangkat, golongan, tmt, pendidikan, now, now,
	)
	if err != nil {
		return Pejabat{}, err
	}
	return GetPejabatByID(ctx, db, id)
}

func UpdatePejabat(ctx context.Context, db *sql.DB, id, opdID, nip, nama, jabatan, eselon, pangkat, golongan string, tmtJabatan *time.Time, pendidikan string) (Pejabat, error) {
	now := time.Now().UTC()
	var tmt sql.NullTime
	if tmtJabatan != nil {
		tmt = sql.NullTime{Time: *tmtJabatan, Valid: true}
	}
	res, err := db.ExecContext(ctx, `
		UPDATE pejabat SET opd_id=?, nip=?, nama=?, jabatan=?, eselon=?, pangkat=?, golongan=?, tmt_jabatan=?, pendidikan=?, updated_at=?
		WHERE id=? AND deleted_at IS NULL`,
		opdID, nip, nama, jabatan, eselon, pangkat, golongan, tmt, pendidikan, now, id,
	)
	if err != nil {
		return Pejabat{}, err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return Pejabat{}, sql.ErrNoRows
	}
	return GetPejabatByID(ctx, db, id)
}

func SoftDeletePejabat(ctx context.Context, db *sql.DB, id string) error {
	now := time.Now().UTC()
	res, err := db.ExecContext(ctx,
		"UPDATE pejabat SET deleted_at=?, updated_at=? WHERE id=? AND deleted_at IS NULL", now, now, id,
	)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return sql.ErrNoRows
	}
	return nil
}
