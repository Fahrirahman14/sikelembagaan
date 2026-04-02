package handler

import (
	"database/sql"
	"net/http"
	"strings"

	"catatan-backend/internal/store"

	"github.com/labstack/echo/v5"
)

type JabatanHandler struct {
	DB *sql.DB
}

type jabatanRequest struct {
	OpdID                 string `json:"opd_id"`
	Kode                  string `json:"kode"`
	Nama                  string `json:"nama"`
	Jenis                 string `json:"jenis"`
	Eselon                string `json:"eselon"`
	UnitKerja             string `json:"unit_kerja"`
	Ikhtisar              string `json:"ikhtisar"`
	KualifikasiPendidikan string `json:"kualifikasi_pendidikan"`
	Pengalaman            string `json:"pengalaman"`
	StatusAnjab           string `json:"status_anjab"`
}

func (h JabatanHandler) List(c *echo.Context) error {
	opdID := c.QueryParam("opd_id")
	jenis := c.QueryParam("jenis")
	search := c.QueryParam("search")
	items, err := store.ListJabatan(c.Request().Context(), h.DB, opdID, jenis, search)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengambil data jabatan")
	}
	return c.JSON(http.StatusOK, items)
}

func (h JabatanHandler) Get(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	item, err := store.GetJabatanByID(c.Request().Context(), h.DB, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Jabatan tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengambil data jabatan")
	}
	return c.JSON(http.StatusOK, item)
}

func (h JabatanHandler) Create(c *echo.Context) error {
	var req jabatanRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	if strings.TrimSpace(req.OpdID) == "" || strings.TrimSpace(req.Kode) == "" ||
		strings.TrimSpace(req.Nama) == "" || strings.TrimSpace(req.Jenis) == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "opd_id, kode, nama, jenis wajib diisi")
	}
	item, err := store.CreateJabatan(c.Request().Context(), h.DB,
		req.OpdID, req.Kode, req.Nama, req.Jenis, req.Eselon, req.UnitKerja,
		req.Ikhtisar, req.KualifikasiPendidikan, req.Pengalaman)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal membuat jabatan")
	}
	return c.JSON(http.StatusCreated, item)
}

func (h JabatanHandler) Update(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	var req jabatanRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	if req.StatusAnjab == "" {
		req.StatusAnjab = "draft"
	}
	item, err := store.UpdateJabatan(c.Request().Context(), h.DB, id,
		req.OpdID, req.Kode, req.Nama, req.Jenis, req.Eselon, req.UnitKerja,
		req.Ikhtisar, req.KualifikasiPendidikan, req.Pengalaman, req.StatusAnjab)
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Jabatan tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengubah jabatan")
	}
	return c.JSON(http.StatusOK, item)
}

func (h JabatanHandler) Delete(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	if err := store.SoftDeleteJabatan(c.Request().Context(), h.DB, id); err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Jabatan tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal menghapus jabatan")
	}
	return c.NoContent(http.StatusNoContent)
}
