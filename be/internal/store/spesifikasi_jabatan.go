package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"time"
)

type SpesifikasiJabatan struct {
	ID                   string          `json:"id"`
	JabatanID            string          `json:"jabatan_id"`
	PendidikanFormal     json.RawMessage `json:"pendidikan_formal"`
	Pelatihan            json.RawMessage `json:"pelatihan"`
	Pengalaman           json.RawMessage `json:"pengalaman"`
	KompetensiManajerial json.RawMessage `json:"kompetensi_manajerial"`
	KompetensiTeknis     json.RawMessage `json:"kompetensi_teknis"`
	KondisiFisik         json.RawMessage `json:"kondisi_fisik"`
	CreatedAt            time.Time       `json:"created_at"`
	UpdatedAt            time.Time       `json:"updated_at"`
}

func GetSpesifikasiByJabatan(ctx context.Context, db *sql.DB, jabatanID string) (SpesifikasiJabatan, error) {
	var s SpesifikasiJabatan
	var pf, pl, pg, km, kt, kf sql.NullString
	err := db.QueryRowContext(ctx, `
		SELECT id, jabatan_id, pendidikan_formal, pelatihan, pengalaman,
			kompetensi_manajerial, kompetensi_teknis, kondisi_fisik, created_at, updated_at
		FROM spesifikasi_jabatan WHERE jabatan_id = ? AND deleted_at IS NULL`, jabatanID,
	).Scan(&s.ID, &s.JabatanID, &pf, &pl, &pg, &km, &kt, &kf, &s.CreatedAt, &s.UpdatedAt)
	if err != nil {
		return s, err
	}
	if pf.Valid {
		s.PendidikanFormal = json.RawMessage(pf.String)
	}
	if pl.Valid {
		s.Pelatihan = json.RawMessage(pl.String)
	}
	if pg.Valid {
		s.Pengalaman = json.RawMessage(pg.String)
	}
	if km.Valid {
		s.KompetensiManajerial = json.RawMessage(km.String)
	}
	if kt.Valid {
		s.KompetensiTeknis = json.RawMessage(kt.String)
	}
	if kf.Valid {
		s.KondisiFisik = json.RawMessage(kf.String)
	}
	return s, nil
}

func UpsertSpesifikasi(ctx context.Context, db *sql.DB, jabatanID string, pendidikanFormal, pelatihan, pengalaman, kompetensiManajerial, kompetensiTeknis, kondisiFisik json.RawMessage) (SpesifikasiJabatan, error) {
	now := time.Now().UTC()

	var existingID string
	err := db.QueryRowContext(ctx,
		"SELECT id FROM spesifikasi_jabatan WHERE jabatan_id = ? AND deleted_at IS NULL", jabatanID,
	).Scan(&existingID)

	if err == sql.ErrNoRows {
		id, err := newUUID(ctx, db)
		if err != nil {
			return SpesifikasiJabatan{}, err
		}
		_, err = db.ExecContext(ctx, `
			INSERT INTO spesifikasi_jabatan (id, jabatan_id, pendidikan_formal, pelatihan, pengalaman, kompetensi_manajerial, kompetensi_teknis, kondisi_fisik, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			id, jabatanID, nullJSON(pendidikanFormal), nullJSON(pelatihan), nullJSON(pengalaman),
			nullJSON(kompetensiManajerial), nullJSON(kompetensiTeknis), nullJSON(kondisiFisik), now, now,
		)
		if err != nil {
			return SpesifikasiJabatan{}, err
		}
		return GetSpesifikasiByJabatan(ctx, db, jabatanID)
	}
	if err != nil {
		return SpesifikasiJabatan{}, err
	}

	_, err = db.ExecContext(ctx, `
		UPDATE spesifikasi_jabatan SET pendidikan_formal=?, pelatihan=?, pengalaman=?,
			kompetensi_manajerial=?, kompetensi_teknis=?, kondisi_fisik=?, updated_at=?
		WHERE id=? AND deleted_at IS NULL`,
		nullJSON(pendidikanFormal), nullJSON(pelatihan), nullJSON(pengalaman),
		nullJSON(kompetensiManajerial), nullJSON(kompetensiTeknis), nullJSON(kondisiFisik), now, existingID,
	)
	if err != nil {
		return SpesifikasiJabatan{}, err
	}
	return GetSpesifikasiByJabatan(ctx, db, jabatanID)
}

func nullJSON(data json.RawMessage) sql.NullString {
	if len(data) == 0 || string(data) == "null" {
		return sql.NullString{}
	}
	return sql.NullString{String: string(data), Valid: true}
}
