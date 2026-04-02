package store

import (
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"
)

type Role struct {
	ID        string     `json:"id"`
	Kode      string     `json:"kode"`
	Nama      string     `json:"nama"`
	Level     string     `json:"level"`
	Deskripsi string     `json:"deskripsi"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at,omitempty"`
}

func ListRoles(ctx context.Context, db *sql.DB) ([]Role, error) {
	rows, err := db.QueryContext(ctx,
		"SELECT id, kode, nama, level, COALESCE(deskripsi,''), created_at, updated_at FROM roles WHERE deleted_at IS NULL ORDER BY kode ASC",
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]Role, 0)
	for rows.Next() {
		var r Role
		if err := rows.Scan(&r.ID, &r.Kode, &r.Nama, &r.Level, &r.Deskripsi, &r.CreatedAt, &r.UpdatedAt); err != nil {
			return nil, err
		}
		out = append(out, r)
	}
	return out, rows.Err()
}

func GetRoleByID(ctx context.Context, db *sql.DB, id string) (Role, error) {
	var r Role
	err := db.QueryRowContext(ctx,
		"SELECT id, kode, nama, level, COALESCE(deskripsi,''), created_at, updated_at FROM roles WHERE id = ? AND deleted_at IS NULL",
		id,
	).Scan(&r.ID, &r.Kode, &r.Nama, &r.Level, &r.Deskripsi, &r.CreatedAt, &r.UpdatedAt)
	return r, err
}

func CreateRole(ctx context.Context, db *sql.DB, kode, nama, level, deskripsi string) (Role, error) {
	kode = strings.TrimSpace(kode)
	nama = strings.TrimSpace(nama)
	if kode == "" || nama == "" {
		return Role{}, errors.New("kode dan nama wajib diisi")
	}

	id, err := newUUID(ctx, db)
	if err != nil {
		return Role{}, err
	}
	now := time.Now().UTC()
	_, err = db.ExecContext(ctx,
		"INSERT INTO roles (id, kode, nama, level, deskripsi, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
		id, kode, nama, level, deskripsi, now, now,
	)
	if err != nil {
		return Role{}, err
	}
	return Role{ID: id, Kode: kode, Nama: nama, Level: level, Deskripsi: deskripsi, CreatedAt: now, UpdatedAt: now}, nil
}

func UpdateRole(ctx context.Context, db *sql.DB, id, kode, nama, level, deskripsi string) (Role, error) {
	now := time.Now().UTC()
	res, err := db.ExecContext(ctx,
		"UPDATE roles SET kode=?, nama=?, level=?, deskripsi=?, updated_at=? WHERE id=? AND deleted_at IS NULL",
		kode, nama, level, deskripsi, now, id,
	)
	if err != nil {
		return Role{}, err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return Role{}, sql.ErrNoRows
	}
	return GetRoleByID(ctx, db, id)
}

func SoftDeleteRole(ctx context.Context, db *sql.DB, id string) error {
	now := time.Now().UTC()
	res, err := db.ExecContext(ctx,
		"UPDATE roles SET deleted_at=?, updated_at=? WHERE id=? AND deleted_at IS NULL", now, now, id,
	)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return sql.ErrNoRows
	}
	return nil
}
