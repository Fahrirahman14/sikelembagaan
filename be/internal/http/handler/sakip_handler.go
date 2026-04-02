package handler

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"catatan-backend/internal/store"

	"github.com/labstack/echo/v5"
)

type SAKIPHandler struct {
	DB *sql.DB
}

// === Nilai SAKIP ===

type nilaiSAKIPRequest struct {
	OpdID         string          `json:"opd_id"`
	Tahun         int             `json:"tahun"`
	NilaiTotal    float64         `json:"nilai_total"`
	Predikat      string          `json:"predikat"`
	KomponenNilai json.RawMessage `json:"komponen_nilai"`
}

func (h SAKIPHandler) ListNilai(c *echo.Context) error {
	opdID := c.QueryParam("opd_id")
	tahun := 0
	if t := c.QueryParam("tahun"); t != "" {
		tahun, _ = strconv.Atoi(t)
	}
	items, err := store.ListNilaiSAKIP(c.Request().Context(), h.DB, opdID, tahun)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengambil data nilai SAKIP")
	}
	return c.JSON(http.StatusOK, items)
}

func (h SAKIPHandler) UpsertNilai(c *echo.Context) error {
	var req nilaiSAKIPRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	if strings.TrimSpace(req.OpdID) == "" || req.Tahun == 0 {
		return echo.NewHTTPError(http.StatusBadRequest, "opd_id dan tahun wajib diisi")
	}
	item, err := store.UpsertNilaiSAKIP(c.Request().Context(), h.DB,
		req.OpdID, req.Tahun, req.NilaiTotal, req.Predikat, req.KomponenNilai)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal menyimpan nilai SAKIP")
	}
	return c.JSON(http.StatusOK, item)
}

// === Dokumen SAKIP ===

type dokumenSAKIPRequest struct {
	OpdID        string `json:"opd_id"`
	Tahun        int    `json:"tahun"`
	JenisDokumen string `json:"jenis_dokumen"`
	NamaDokumen  string `json:"nama_dokumen"`
	FilePath     string `json:"file_path"`
	UploadedBy   string `json:"uploaded_by"`
}

func (h SAKIPHandler) ListDokumen(c *echo.Context) error {
	opdID := c.QueryParam("opd_id")
	tahun := 0
	if t := c.QueryParam("tahun"); t != "" {
		tahun, _ = strconv.Atoi(t)
	}
	items, err := store.ListDokumenSAKIP(c.Request().Context(), h.DB, opdID, tahun)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengambil data dokumen SAKIP")
	}
	return c.JSON(http.StatusOK, items)
}

func (h SAKIPHandler) CreateDokumen(c *echo.Context) error {
	var req dokumenSAKIPRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	if strings.TrimSpace(req.OpdID) == "" || req.Tahun == 0 || strings.TrimSpace(req.JenisDokumen) == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "opd_id, tahun, jenis_dokumen wajib diisi")
	}
	item, err := store.CreateDokumenSAKIP(c.Request().Context(), h.DB,
		req.OpdID, req.Tahun, req.JenisDokumen, req.NamaDokumen, req.FilePath, req.UploadedBy)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal membuat dokumen SAKIP")
	}
	return c.JSON(http.StatusCreated, item)
}

func (h SAKIPHandler) DeleteDokumen(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	if err := store.SoftDeleteDokumenSAKIP(c.Request().Context(), h.DB, id); err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Dokumen SAKIP tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal menghapus dokumen SAKIP")
	}
	return c.NoContent(http.StatusNoContent)
}
