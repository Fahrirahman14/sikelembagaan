package store

import (
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"
)

type StrukturOrganisasi struct {
	ID        string               `json:"id"`
	OpdID     string               `json:"opd_id"`
	ParentID  string               `json:"parent_id,omitempty"`
	Jabatan   string               `json:"jabatan"`
	Nama      string               `json:"nama"`
	NIP       string               `json:"nip"`
	Level     int                  `json:"level"`
	Urutan    int                  `json:"urutan"`
	CreatedAt time.Time            `json:"created_at"`
	UpdatedAt time.Time            `json:"updated_at"`
	DeletedAt *time.Time           `json:"deleted_at,omitempty"`
	Children  []StrukturOrganisasi `json:"children,omitempty"`
}

func ListStrukturByOPD(ctx context.Context, db *sql.DB, opdID string) ([]StrukturOrganisasi, error) {
	rows, err := db.QueryContext(ctx, `
		SELECT id, opd_id, COALESCE(parent_id,''), jabatan, COALESCE(nama,''), COALESCE(nip,''),
			level, urutan, created_at, updated_at
		FROM struktur_organisasi WHERE opd_id = ? AND deleted_at IS NULL
		ORDER BY level ASC, urutan ASC`, opdID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	all := make([]StrukturOrganisasi, 0)
	for rows.Next() {
		var s StrukturOrganisasi
		if err := rows.Scan(&s.ID, &s.OpdID, &s.ParentID, &s.Jabatan, &s.Nama, &s.NIP,
			&s.Level, &s.Urutan, &s.CreatedAt, &s.UpdatedAt); err != nil {
			return nil, err
		}
		all = append(all, s)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	// Build tree structure
	byID := make(map[string]*StrukturOrganisasi)
	for i := range all {
		all[i].Children = make([]StrukturOrganisasi, 0)
		byID[all[i].ID] = &all[i]
	}
	roots := make([]StrukturOrganisasi, 0)
	for i := range all {
		if all[i].ParentID == "" {
			roots = append(roots, all[i])
		} else if parent, ok := byID[all[i].ParentID]; ok {
			parent.Children = append(parent.Children, all[i])
		} else {
			roots = append(roots, all[i])
		}
	}
	return roots, nil
}

func GetStrukturByID(ctx context.Context, db *sql.DB, id string) (StrukturOrganisasi, error) {
	var s StrukturOrganisasi
	err := db.QueryRowContext(ctx, `
		SELECT id, opd_id, COALESCE(parent_id,''), jabatan, COALESCE(nama,''), COALESCE(nip,''),
			level, urutan, created_at, updated_at
		FROM struktur_organisasi WHERE id = ? AND deleted_at IS NULL`, id,
	).Scan(&s.ID, &s.OpdID, &s.ParentID, &s.Jabatan, &s.Nama, &s.NIP,
		&s.Level, &s.Urutan, &s.CreatedAt, &s.UpdatedAt)
	return s, err
}

func CreateStruktur(ctx context.Context, db *sql.DB, opdID, parentID, jabatan, nama, nip string, level, urutan int) (StrukturOrganisasi, error) {
	opdID = strings.TrimSpace(opdID)
	jabatan = strings.TrimSpace(jabatan)
	if opdID == "" || jabatan == "" {
		return StrukturOrganisasi{}, errors.New("opd_id dan jabatan wajib diisi")
	}
	id, err := newUUID(ctx, db)
	if err != nil {
		return StrukturOrganisasi{}, err
	}
	now := time.Now().UTC()
	var pID sql.NullString
	if parentID != "" {
		pID = sql.NullString{String: parentID, Valid: true}
	}
	_, err = db.ExecContext(ctx, `
		INSERT INTO struktur_organisasi (id, opd_id, parent_id, jabatan, nama, nip, level, urutan, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		id, opdID, pID, jabatan, nama, nip, level, urutan, now, now,
	)
	if err != nil {
		return StrukturOrganisasi{}, err
	}
	return GetStrukturByID(ctx, db, id)
}

func UpdateStruktur(ctx context.Context, db *sql.DB, id, parentID, jabatan, nama, nip string, level, urutan int) (StrukturOrganisasi, error) {
	now := time.Now().UTC()
	var pID sql.NullString
	if parentID != "" {
		pID = sql.NullString{String: parentID, Valid: true}
	}
	res, err := db.ExecContext(ctx, `
		UPDATE struktur_organisasi SET parent_id=?, jabatan=?, nama=?, nip=?, level=?, urutan=?, updated_at=?
		WHERE id=? AND deleted_at IS NULL`,
		pID, jabatan, nama, nip, level, urutan, now, id,
	)
	if err != nil {
		return StrukturOrganisasi{}, err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return StrukturOrganisasi{}, sql.ErrNoRows
	}
	return GetStrukturByID(ctx, db, id)
}

func SoftDeleteStruktur(ctx context.Context, db *sql.DB, id string) error {
	now := time.Now().UTC()
	res, err := db.ExecContext(ctx,
		"UPDATE struktur_organisasi SET deleted_at=?, updated_at=? WHERE id=? AND deleted_at IS NULL", now, now, id,
	)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return sql.ErrNoRows
	}
	return nil
}
