package store

import (
	"context"
	"database/sql"
)

type DashboardSummary struct {
	TotalOPD           int     `json:"total_opd"`
	TotalJabatan       int     `json:"total_jabatan"`
	TotalPegawai       int     `json:"total_pegawai"`
	TotalDokumenAnjab  int     `json:"total_dokumen_anjab"`
	AnjabSelesai       int     `json:"anjab_selesai"`
	AnjabProses        int     `json:"anjab_proses"`
	AbkSelesai         int     `json:"abk_selesai"`
	AbkProses          int     `json:"abk_proses"`
	RataRataNilaiSAKIP float64 `json:"rata_rata_nilai_sakip"`
}

func GetDashboardSummary(ctx context.Context, db *sql.DB) (DashboardSummary, error) {
	var s DashboardSummary

	_ = db.QueryRowContext(ctx,
		"SELECT COUNT(*) FROM opd WHERE deleted_at IS NULL",
	).Scan(&s.TotalOPD)

	_ = db.QueryRowContext(ctx,
		"SELECT COUNT(*) FROM jabatan WHERE deleted_at IS NULL",
	).Scan(&s.TotalJabatan)

	_ = db.QueryRowContext(ctx,
		"SELECT COUNT(*) FROM pejabat WHERE deleted_at IS NULL",
	).Scan(&s.TotalPegawai)

	_ = db.QueryRowContext(ctx,
		"SELECT COUNT(*) FROM dokumen_anjab WHERE deleted_at IS NULL",
	).Scan(&s.TotalDokumenAnjab)

	_ = db.QueryRowContext(ctx,
		"SELECT COUNT(*) FROM opd WHERE status_anjab = 'selesai' AND deleted_at IS NULL",
	).Scan(&s.AnjabSelesai)

	_ = db.QueryRowContext(ctx,
		"SELECT COUNT(*) FROM opd WHERE status_anjab = 'proses' AND deleted_at IS NULL",
	).Scan(&s.AnjabProses)

	_ = db.QueryRowContext(ctx,
		"SELECT COUNT(*) FROM opd WHERE status_abk = 'selesai' AND deleted_at IS NULL",
	).Scan(&s.AbkSelesai)

	_ = db.QueryRowContext(ctx,
		"SELECT COUNT(*) FROM opd WHERE status_abk = 'proses' AND deleted_at IS NULL",
	).Scan(&s.AbkProses)

	var avg sql.NullFloat64
	_ = db.QueryRowContext(ctx,
		"SELECT AVG(nilai_total) FROM nilai_sakip WHERE deleted_at IS NULL",
	).Scan(&avg)
	if avg.Valid {
		s.RataRataNilaiSAKIP = avg.Float64
	}

	return s, nil
}

type RekapOPD struct {
	ID           string `json:"id"`
	Kode         string `json:"kode"`
	Nama         string `json:"nama"`
	StatusAnjab  string `json:"status_anjab"`
	StatusAbk    string `json:"status_abk"`
	TotalPegawai int    `json:"total_pegawai"`
	TotalJabatan int    `json:"total_jabatan"`
}

func GetRekapOPD(ctx context.Context, db *sql.DB) ([]RekapOPD, error) {
	rows, err := db.QueryContext(ctx, `
		SELECT o.id, o.kode, o.nama, o.status_anjab, o.status_abk,
			(SELECT COUNT(*) FROM pejabat p WHERE p.opd_id = o.id AND p.deleted_at IS NULL),
			(SELECT COUNT(*) FROM jabatan j WHERE j.opd_id = o.id AND j.deleted_at IS NULL)
		FROM opd o WHERE o.deleted_at IS NULL ORDER BY o.nama ASC`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]RekapOPD, 0)
	for rows.Next() {
		var r RekapOPD
		if err := rows.Scan(&r.ID, &r.Kode, &r.Nama, &r.StatusAnjab, &r.StatusAbk, &r.TotalPegawai, &r.TotalJabatan); err != nil {
			return nil, err
		}
		out = append(out, r)
	}
	return out, rows.Err()
}
