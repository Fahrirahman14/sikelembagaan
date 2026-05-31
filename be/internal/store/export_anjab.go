package store

import (
	"context"
	"database/sql"
	"encoding/json"
)

type JabatanUraianRow struct {
	Kode          string          `json:"kode"`
	Nama          string          `json:"nama"`
	Jenis         string          `json:"jenis"`
	OpdNama       string          `json:"opd_nama"`
	UnitKerja     string          `json:"unit_kerja"`
	Ikhtisar      string          `json:"ikhtisar"`
	StatusAnjab   string          `json:"status_anjab"`
	Tugas         json.RawMessage `json:"tugas"`
	Fungsi        json.RawMessage `json:"fungsi"`
	Wewenang      json.RawMessage `json:"wewenang"`
	TanggungJawab json.RawMessage `json:"tanggung_jawab"`
}

type JabatanSpesifikasiRow struct {
	Kode                 string          `json:"kode"`
	Nama                 string          `json:"nama"`
	Jenis                string          `json:"jenis"`
	OpdNama              string          `json:"opd_nama"`
	UnitKerja            string          `json:"unit_kerja"`
	StatusAnjab          string          `json:"status_anjab"`
	PendidikanFormal     json.RawMessage `json:"pendidikan_formal"`
	Pelatihan            json.RawMessage `json:"pelatihan"`
	Pengalaman           json.RawMessage `json:"pengalaman"`
	KompetensiManajerial json.RawMessage `json:"kompetensi_manajerial"`
	KompetensiTeknis     json.RawMessage `json:"kompetensi_teknis"`
	KondisiFisik         json.RawMessage `json:"kondisi_fisik"`
}

func ExportUraian(ctx context.Context, db *sql.DB, opdID, search string) ([]JabatanUraianRow, error) {
	q := `
		SELECT j.kode, j.nama, j.jenis, COALESCE(o.nama,''), COALESCE(j.unit_kerja,''),
			COALESCE(j.ikhtisar,''), j.status_anjab,
			u.tugas, u.fungsi, u.wewenang, u.tanggung_jawab
		FROM jabatan j
		LEFT JOIN opd o ON o.id = j.opd_id
		LEFT JOIN uraian_jabatan u ON u.jabatan_id = j.id AND u.deleted_at IS NULL
		WHERE j.deleted_at IS NULL`
	args := make([]any, 0)
	if opdID != "" {
		q += " AND j.opd_id = ?"
		args = append(args, opdID)
	}
	if search != "" {
		q += " AND (j.nama LIKE ? OR j.kode LIKE ?)"
		s := "%" + search + "%"
		args = append(args, s, s)
	}
	q += " ORDER BY o.nama ASC, j.nama ASC"

	rows, err := db.QueryContext(ctx, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]JabatanUraianRow, 0)
	for rows.Next() {
		var r JabatanUraianRow
		var tg, fn, ww, tj sql.NullString
		if err := rows.Scan(
			&r.Kode, &r.Nama, &r.Jenis, &r.OpdNama, &r.UnitKerja, &r.Ikhtisar, &r.StatusAnjab,
			&tg, &fn, &ww, &tj,
		); err != nil {
			return nil, err
		}
		if tg.Valid {
			r.Tugas = json.RawMessage(tg.String)
		} else {
			r.Tugas = json.RawMessage("[]")
		}
		if fn.Valid {
			r.Fungsi = json.RawMessage(fn.String)
		} else {
			r.Fungsi = json.RawMessage("[]")
		}
		if ww.Valid {
			r.Wewenang = json.RawMessage(ww.String)
		} else {
			r.Wewenang = json.RawMessage("[]")
		}
		if tj.Valid {
			r.TanggungJawab = json.RawMessage(tj.String)
		} else {
			r.TanggungJawab = json.RawMessage("[]")
		}
		out = append(out, r)
	}
	return out, rows.Err()
}

func ExportSpesifikasi(ctx context.Context, db *sql.DB, opdID, search string) ([]JabatanSpesifikasiRow, error) {
	q := `
		SELECT j.kode, j.nama, j.jenis, COALESCE(o.nama,''), COALESCE(j.unit_kerja,''), j.status_anjab,
			s.pendidikan_formal, s.pelatihan, s.pengalaman,
			s.kompetensi_manajerial, s.kompetensi_teknis, s.kondisi_fisik
		FROM jabatan j
		LEFT JOIN opd o ON o.id = j.opd_id
		LEFT JOIN spesifikasi_jabatan s ON s.jabatan_id = j.id AND s.deleted_at IS NULL
		WHERE j.deleted_at IS NULL`
	args := make([]any, 0)
	if opdID != "" {
		q += " AND j.opd_id = ?"
		args = append(args, opdID)
	}
	if search != "" {
		q += " AND (j.nama LIKE ? OR j.kode LIKE ?)"
		s := "%" + search + "%"
		args = append(args, s, s)
	}
	q += " ORDER BY o.nama ASC, j.nama ASC"

	rows, err := db.QueryContext(ctx, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]JabatanSpesifikasiRow, 0)
	for rows.Next() {
		var r JabatanSpesifikasiRow
		var pf, pl, pg, km, kt, kf sql.NullString
		if err := rows.Scan(
			&r.Kode, &r.Nama, &r.Jenis, &r.OpdNama, &r.UnitKerja, &r.StatusAnjab,
			&pf, &pl, &pg, &km, &kt, &kf,
		); err != nil {
			return nil, err
		}
		if pf.Valid {
			r.PendidikanFormal = json.RawMessage(pf.String)
		} else {
			r.PendidikanFormal = json.RawMessage("{}")
		}
		if pl.Valid {
			r.Pelatihan = json.RawMessage(pl.String)
		} else {
			r.Pelatihan = json.RawMessage("[]")
		}
		if pg.Valid {
			r.Pengalaman = json.RawMessage(pg.String)
		} else {
			r.Pengalaman = json.RawMessage("[]")
		}
		if km.Valid {
			r.KompetensiManajerial = json.RawMessage(km.String)
		} else {
			r.KompetensiManajerial = json.RawMessage("[]")
		}
		if kt.Valid {
			r.KompetensiTeknis = json.RawMessage(kt.String)
		} else {
			r.KompetensiTeknis = json.RawMessage("[]")
		}
		if kf.Valid {
			r.KondisiFisik = json.RawMessage(kf.String)
		} else {
			r.KondisiFisik = json.RawMessage("{}")
		}
		out = append(out, r)
	}
	return out, rows.Err()
}
