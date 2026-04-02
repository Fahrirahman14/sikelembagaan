package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"time"
)

type UraianJabatan struct {
	ID            string          `json:"id"`
	JabatanID     string          `json:"jabatan_id"`
	Tugas         json.RawMessage `json:"tugas"`
	Fungsi        json.RawMessage `json:"fungsi"`
	Wewenang      json.RawMessage `json:"wewenang"`
	TanggungJawab json.RawMessage `json:"tanggung_jawab"`
	CreatedAt     time.Time       `json:"created_at"`
	UpdatedAt     time.Time       `json:"updated_at"`
}

func GetUraianByJabatan(ctx context.Context, db *sql.DB, jabatanID string) (UraianJabatan, error) {
	var u UraianJabatan
	var tg, fn, ww, tj sql.NullString
	err := db.QueryRowContext(ctx, `
		SELECT id, jabatan_id, tugas, fungsi, wewenang, tanggung_jawab, created_at, updated_at
		FROM uraian_jabatan WHERE jabatan_id = ? AND deleted_at IS NULL`, jabatanID,
	).Scan(&u.ID, &u.JabatanID, &tg, &fn, &ww, &tj, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		return u, err
	}
	if tg.Valid {
		u.Tugas = json.RawMessage(tg.String)
	}
	if fn.Valid {
		u.Fungsi = json.RawMessage(fn.String)
	}
	if ww.Valid {
		u.Wewenang = json.RawMessage(ww.String)
	}
	if tj.Valid {
		u.TanggungJawab = json.RawMessage(tj.String)
	}
	return u, nil
}

func UpsertUraian(ctx context.Context, db *sql.DB, jabatanID string, tugas, fungsi, wewenang, tanggungJawab json.RawMessage) (UraianJabatan, error) {
	now := time.Now().UTC()

	var existingID string
	err := db.QueryRowContext(ctx,
		"SELECT id FROM uraian_jabatan WHERE jabatan_id = ? AND deleted_at IS NULL", jabatanID,
	).Scan(&existingID)

	if err == sql.ErrNoRows {
		id, err := newUUID(ctx, db)
		if err != nil {
			return UraianJabatan{}, err
		}
		_, err = db.ExecContext(ctx, `
			INSERT INTO uraian_jabatan (id, jabatan_id, tugas, fungsi, wewenang, tanggung_jawab, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			id, jabatanID, nullJSON(tugas), nullJSON(fungsi), nullJSON(wewenang), nullJSON(tanggungJawab), now, now,
		)
		if err != nil {
			return UraianJabatan{}, err
		}
		return GetUraianByJabatan(ctx, db, jabatanID)
	}
	if err != nil {
		return UraianJabatan{}, err
	}

	_, err = db.ExecContext(ctx, `
		UPDATE uraian_jabatan SET tugas=?, fungsi=?, wewenang=?, tanggung_jawab=?, updated_at=?
		WHERE id=? AND deleted_at IS NULL`,
		nullJSON(tugas), nullJSON(fungsi), nullJSON(wewenang), nullJSON(tanggungJawab), now, existingID,
	)
	if err != nil {
		return UraianJabatan{}, err
	}
	return GetUraianByJabatan(ctx, db, jabatanID)
}
