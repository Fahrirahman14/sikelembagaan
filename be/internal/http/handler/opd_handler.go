package handler

import (
	"database/sql"
	"net/http"
	"strings"

	"catatan-backend/internal/store"

	"github.com/labstack/echo/v5"
)

type OPDHandler struct {
	DB *sql.DB
}

type opdRequest struct {
	Kode        string `json:"kode"`
	Nama        string `json:"nama"`
	Alamat      string `json:"alamat"`
	Telepon     string `json:"telepon"`
	Email       string `json:"email"`
	Kepala      string `json:"kepala"`
	NipKepala   string `json:"nip_kepala"`
	StatusAnjab string `json:"status_anjab"`
	StatusAbk   string `json:"status_abk"`
}

func (h OPDHandler) List(c *echo.Context) error {
	search := c.QueryParam("search")
	items, err := store.ListOPD(c.Request().Context(), h.DB, search)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengambil data OPD")
	}
	return c.JSON(http.StatusOK, items)
}

func (h OPDHandler) Get(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	item, err := store.GetOPDByID(c.Request().Context(), h.DB, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "OPD tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengambil data OPD")
	}
	return c.JSON(http.StatusOK, item)
}

func (h OPDHandler) Create(c *echo.Context) error {
	var req opdRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	if strings.TrimSpace(req.Kode) == "" || strings.TrimSpace(req.Nama) == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "Kode dan nama OPD wajib diisi")
	}
	item, err := store.CreateOPD(c.Request().Context(), h.DB,
		req.Kode, req.Nama, req.Alamat, req.Telepon, req.Email, req.Kepala, req.NipKepala)
	if err != nil {
		if strings.Contains(err.Error(), "Duplicate") {
			return echo.NewHTTPError(http.StatusConflict, "Kode OPD sudah digunakan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal membuat OPD")
	}
	return c.JSON(http.StatusCreated, item)
}

func (h OPDHandler) Update(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	var req opdRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	if req.StatusAnjab == "" {
		req.StatusAnjab = "belum"
	}
	if req.StatusAbk == "" {
		req.StatusAbk = "belum"
	}
	item, err := store.UpdateOPD(c.Request().Context(), h.DB, id,
		req.Kode, req.Nama, req.Alamat, req.Telepon, req.Email, req.Kepala, req.NipKepala, req.StatusAnjab, req.StatusAbk)
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "OPD tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengubah OPD")
	}
	return c.JSON(http.StatusOK, item)
}

func (h OPDHandler) Delete(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	if err := store.SoftDeleteOPD(c.Request().Context(), h.DB, id); err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "OPD tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal menghapus OPD")
	}
	return c.NoContent(http.StatusNoContent)
}
