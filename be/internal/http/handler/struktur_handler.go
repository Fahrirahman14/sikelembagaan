package handler

import (
	"database/sql"
	"net/http"
	"strings"

	"catatan-backend/internal/store"

	"github.com/labstack/echo/v5"
)

type StrukturHandler struct {
	DB *sql.DB
}

type strukturRequest struct {
	OpdID    string `json:"opd_id"`
	ParentID string `json:"parent_id"`
	Jabatan  string `json:"jabatan"`
	Nama     string `json:"nama"`
	NIP      string `json:"nip"`
	Level    int    `json:"level"`
	Urutan   int    `json:"urutan"`
}

func (h StrukturHandler) ListByOPD(c *echo.Context) error {
	opdID, err := parseID(c, "opdId")
	if err != nil {
		return err
	}
	items, err := store.ListStrukturByOPD(c.Request().Context(), h.DB, opdID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengambil struktur organisasi")
	}
	return c.JSON(http.StatusOK, items)
}

func (h StrukturHandler) Create(c *echo.Context) error {
	var req strukturRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	if strings.TrimSpace(req.OpdID) == "" || strings.TrimSpace(req.Jabatan) == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "opd_id dan jabatan wajib diisi")
	}
	item, err := store.CreateStruktur(c.Request().Context(), h.DB,
		req.OpdID, req.ParentID, req.Jabatan, req.Nama, req.NIP, req.Level, req.Urutan)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal membuat struktur")
	}
	return c.JSON(http.StatusCreated, item)
}

func (h StrukturHandler) Update(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	var req strukturRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	item, err := store.UpdateStruktur(c.Request().Context(), h.DB, id,
		req.ParentID, req.Jabatan, req.Nama, req.NIP, req.Level, req.Urutan)
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Data tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengubah struktur")
	}
	return c.JSON(http.StatusOK, item)
}

func (h StrukturHandler) Delete(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	if err := store.SoftDeleteStruktur(c.Request().Context(), h.DB, id); err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Data tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal menghapus struktur")
	}
	return c.NoContent(http.StatusNoContent)
}
