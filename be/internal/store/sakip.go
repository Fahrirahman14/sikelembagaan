package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"time"
)

type NilaiSAKIP struct {
	ID            string          `json:"id"`
	OpdID         string          `json:"opd_id"`
	OpdNama       string          `json:"opd_nama,omitempty"`
	Tahun         int             `json:"tahun"`
	NilaiTotal    float64         `json:"nilai_total"`
	Predikat      string          `json:"predikat"`
	KomponenNilai json.RawMessage `json:"komponen_nilai"`
	CreatedAt     time.Time       `json:"created_at"`
	UpdatedAt     time.Time       `json:"updated_at"`
}

type DokumenSAKIP struct {
	ID           string     `json:"id"`
	OpdID        string     `json:"opd_id"`
	OpdNama      string     `json:"opd_nama,omitempty"`
	Tahun        int        `json:"tahun"`
	JenisDokumen string     `json:"jenis_dokumen"`
	NamaDokumen  string     `json:"nama_dokumen"`
	FilePath     string     `json:"file_path"`
	UploadedBy   string     `json:"uploaded_by"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
	DeletedAt    *time.Time `json:"deleted_at,omitempty"`
}

// === Nilai SAKIP ===

func ListNilaiSAKIP(ctx context.Context, db *sql.DB, opdID string, tahun, limit, offset int) (PaginatedResult[NilaiSAKIP], error) {
	base := `
		SELECT n.id, n.opd_id, COALESCE(o.nama,''), n.tahun, n.nilai_total, COALESCE(n.predikat,''),
			n.komponen_nilai, n.created_at, n.updated_at
		FROM nilai_sakip n LEFT JOIN opd o ON o.id = n.opd_id
		WHERE n.deleted_at IS NULL`
	cnt := `SELECT COUNT(*) FROM nilai_sakip n WHERE n.deleted_at IS NULL`
	args := make([]any, 0)
	if opdID != "" {
		cond := " AND n.opd_id = ?"
		base += cond
		cnt += cond
		args = append(args, opdID)
	}
	if tahun > 0 {
		cond := " AND n.tahun = ?"
		base += cond
		cnt += cond
		args = append(args, tahun)
	}

	var total int
	if err := db.QueryRowContext(ctx, cnt, args...).Scan(&total); err != nil {
		return PaginatedResult[NilaiSAKIP]{}, err
	}

	base += " ORDER BY n.tahun DESC, o.nama ASC"
	pageArgs := append([]any{}, args...)
	if limit > 0 {
		base += " LIMIT ? OFFSET ?"
		pageArgs = append(pageArgs, limit, offset)
	}

	rows, err := db.QueryContext(ctx, base, pageArgs...)
	if err != nil {
		return PaginatedResult[NilaiSAKIP]{}, err
	}
	defer rows.Close()

	out := make([]NilaiSAKIP, 0)
	for rows.Next() {
		var n NilaiSAKIP
		var kn sql.NullString
		if err := rows.Scan(&n.ID, &n.OpdID, &n.OpdNama, &n.Tahun, &n.NilaiTotal, &n.Predikat,
			&kn, &n.CreatedAt, &n.UpdatedAt); err != nil {
			return PaginatedResult[NilaiSAKIP]{}, err
		}
		if kn.Valid {
			n.KomponenNilai = json.RawMessage(kn.String)
		}
		out = append(out, n)
	}
	if err := rows.Err(); err != nil {
		return PaginatedResult[NilaiSAKIP]{}, err
	}
	return PaginatedResult[NilaiSAKIP]{Data: out, Total: total, Limit: limit, Offset: offset}, nil
}

func UpsertNilaiSAKIP(ctx context.Context, db *sql.DB, opdID string, tahun int, nilaiTotal float64, predikat string, komponenNilai json.RawMessage) (NilaiSAKIP, error) {
	now := time.Now().UTC()

	var existingID string
	err := db.QueryRowContext(ctx,
		"SELECT id FROM nilai_sakip WHERE opd_id = ? AND tahun = ? AND deleted_at IS NULL", opdID, tahun,
	).Scan(&existingID)

	if err == sql.ErrNoRows {
		id, err := newUUID(ctx, db)
		if err != nil {
			return NilaiSAKIP{}, err
		}
		_, err = db.ExecContext(ctx, `
			INSERT INTO nilai_sakip (id, opd_id, tahun, nilai_total, predikat, komponen_nilai, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			id, opdID, tahun, nilaiTotal, predikat, nullJSON(komponenNilai), now, now,
		)
		if err != nil {
			return NilaiSAKIP{}, err
		}
		existingID = id
	} else if err != nil {
		return NilaiSAKIP{}, err
	} else {
		_, err = db.ExecContext(ctx, `
			UPDATE nilai_sakip SET nilai_total=?, predikat=?, komponen_nilai=?, updated_at=?
			WHERE id=? AND deleted_at IS NULL`,
			nilaiTotal, predikat, nullJSON(komponenNilai), now, existingID,
		)
		if err != nil {
			return NilaiSAKIP{}, err
		}
	}

	var n NilaiSAKIP
	var kn sql.NullString
	err = db.QueryRowContext(ctx, `
		SELECT n.id, n.opd_id, COALESCE(o.nama,''), n.tahun, n.nilai_total, COALESCE(n.predikat,''),
			n.komponen_nilai, n.created_at, n.updated_at
		FROM nilai_sakip n LEFT JOIN opd o ON o.id = n.opd_id
		WHERE n.id = ? AND n.deleted_at IS NULL`, existingID,
	).Scan(&n.ID, &n.OpdID, &n.OpdNama, &n.Tahun, &n.NilaiTotal, &n.Predikat,
		&kn, &n.CreatedAt, &n.UpdatedAt)
	if kn.Valid {
		n.KomponenNilai = json.RawMessage(kn.String)
	}
	return n, err
}

// === Dokumen SAKIP ===

func ListDokumenSAKIP(ctx context.Context, db *sql.DB, opdID string, tahun, limit, offset int) (PaginatedResult[DokumenSAKIP], error) {
	base := `
		SELECT d.id, d.opd_id, COALESCE(o.nama,''), d.tahun, d.jenis_dokumen, d.nama_dokumen,
			COALESCE(d.file_path,''), COALESCE(d.uploaded_by,''), d.created_at, d.updated_at
		FROM dokumen_sakip d LEFT JOIN opd o ON o.id = d.opd_id
		WHERE d.deleted_at IS NULL`
	cnt := `SELECT COUNT(*) FROM dokumen_sakip d WHERE d.deleted_at IS NULL`
	args := make([]any, 0)
	if opdID != "" {
		cond := " AND d.opd_id = ?"
		base += cond
		cnt += cond
		args = append(args, opdID)
	}
	if tahun > 0 {
		cond := " AND d.tahun = ?"
		base += cond
		cnt += cond
		args = append(args, tahun)
	}

	var total int
	if err := db.QueryRowContext(ctx, cnt, args...).Scan(&total); err != nil {
		return PaginatedResult[DokumenSAKIP]{}, err
	}

	base += " ORDER BY d.tahun DESC, d.jenis_dokumen ASC"
	pageArgs := append([]any{}, args...)
	if limit > 0 {
		base += " LIMIT ? OFFSET ?"
		pageArgs = append(pageArgs, limit, offset)
	}

	rows, err := db.QueryContext(ctx, base, pageArgs...)
	if err != nil {
		return PaginatedResult[DokumenSAKIP]{}, err
	}
	defer rows.Close()

	out := make([]DokumenSAKIP, 0)
	for rows.Next() {
		var d DokumenSAKIP
		if err := rows.Scan(&d.ID, &d.OpdID, &d.OpdNama, &d.Tahun, &d.JenisDokumen, &d.NamaDokumen,
			&d.FilePath, &d.UploadedBy, &d.CreatedAt, &d.UpdatedAt); err != nil {
			return PaginatedResult[DokumenSAKIP]{}, err
		}
		out = append(out, d)
	}
	if err := rows.Err(); err != nil {
		return PaginatedResult[DokumenSAKIP]{}, err
	}
	return PaginatedResult[DokumenSAKIP]{Data: out, Total: total, Limit: limit, Offset: offset}, nil
}

func CreateDokumenSAKIP(ctx context.Context, db *sql.DB, opdID string, tahun int, jenisDokumen, namaDokumen, filePath, uploadedBy string) (DokumenSAKIP, error) {
	id, err := newUUID(ctx, db)
	if err != nil {
		return DokumenSAKIP{}, err
	}
	now := time.Now().UTC()
	_, err = db.ExecContext(ctx, `
		INSERT INTO dokumen_sakip (id, opd_id, tahun, jenis_dokumen, nama_dokumen, file_path, uploaded_by, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		id, opdID, tahun, jenisDokumen, namaDokumen, filePath, uploadedBy, now, now,
	)
	if err != nil {
		return DokumenSAKIP{}, err
	}

	var d DokumenSAKIP
	err = db.QueryRowContext(ctx, `
		SELECT d.id, d.opd_id, COALESCE(o.nama,''), d.tahun, d.jenis_dokumen, d.nama_dokumen,
			COALESCE(d.file_path,''), COALESCE(d.uploaded_by,''), d.created_at, d.updated_at
		FROM dokumen_sakip d LEFT JOIN opd o ON o.id = d.opd_id
		WHERE d.id = ? AND d.deleted_at IS NULL`, id,
	).Scan(&d.ID, &d.OpdID, &d.OpdNama, &d.Tahun, &d.JenisDokumen, &d.NamaDokumen,
		&d.FilePath, &d.UploadedBy, &d.CreatedAt, &d.UpdatedAt)
	return d, err
}

func SoftDeleteDokumenSAKIP(ctx context.Context, db *sql.DB, id string) error {
	now := time.Now().UTC()
	res, err := db.ExecContext(ctx,
		"UPDATE dokumen_sakip SET deleted_at=?, updated_at=? WHERE id=? AND deleted_at IS NULL", now, now, id,
	)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return sql.ErrNoRows
	}
	return nil
}
