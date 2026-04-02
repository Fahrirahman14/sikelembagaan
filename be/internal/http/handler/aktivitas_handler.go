package handler

import (
	"database/sql"
	"net/http"
	"strings"

	"catatan-backend/internal/store"

	"github.com/labstack/echo/v5"
)

type AktivitasHandler struct {
	DB *sql.DB
}

type aktivitasRequest struct {
	JabatanID       string  `json:"jabatan_id"`
	UraianTugas     string  `json:"uraian_tugas"`
	Satuan          string  `json:"satuan"`
	NormaWaktu      float64 `json:"norma_waktu"`
	TargetKuantitas float64 `json:"target_kuantitas"`
	Frekuensi       string  `json:"frekuensi"`
	Kategori        string  `json:"kategori"`
}

func (h AktivitasHandler) List(c *echo.Context) error {
	jabatanID := c.QueryParam("jabatan_id")
	kategori := c.QueryParam("kategori")
	search := c.QueryParam("search")
	items, err := store.ListAktivitas(c.Request().Context(), h.DB, jabatanID, kategori, search)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengambil data aktivitas")
	}
	return c.JSON(http.StatusOK, items)
}

func (h AktivitasHandler) Get(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	item, err := store.GetAktivitasByID(c.Request().Context(), h.DB, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Aktivitas tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengambil data aktivitas")
	}
	return c.JSON(http.StatusOK, item)
}

func (h AktivitasHandler) Create(c *echo.Context) error {
	var req aktivitasRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	if strings.TrimSpace(req.JabatanID) == "" || strings.TrimSpace(req.UraianTugas) == "" || strings.TrimSpace(req.Satuan) == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "jabatan_id, uraian_tugas, satuan wajib diisi")
	}
	if req.Kategori == "" {
		req.Kategori = "utama"
	}
	item, err := store.CreateAktivitas(c.Request().Context(), h.DB,
		req.JabatanID, req.UraianTugas, req.Satuan, req.NormaWaktu, req.TargetKuantitas, req.Frekuensi, req.Kategori)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal membuat aktivitas")
	}
	return c.JSON(http.StatusCreated, item)
}

func (h AktivitasHandler) Update(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	var req aktivitasRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	item, err := store.UpdateAktivitas(c.Request().Context(), h.DB, id,
		req.JabatanID, req.UraianTugas, req.Satuan, req.NormaWaktu, req.TargetKuantitas, req.Frekuensi, req.Kategori)
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Aktivitas tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengubah aktivitas")
	}
	return c.JSON(http.StatusOK, item)
}

func (h AktivitasHandler) Delete(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	if err := store.SoftDeleteAktivitas(c.Request().Context(), h.DB, id); err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Aktivitas tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal menghapus aktivitas")
	}
	return c.NoContent(http.StatusNoContent)
}
