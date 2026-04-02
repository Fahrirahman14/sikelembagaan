package handler

import (
	"database/sql"
	"net/http"
	"strings"
	"time"

	"catatan-backend/internal/store"

	"github.com/labstack/echo/v5"
)

type PejabatHandler struct {
	DB *sql.DB
}

type pejabatRequest struct {
	OpdID      string `json:"opd_id"`
	NIP        string `json:"nip"`
	Nama       string `json:"nama"`
	Jabatan    string `json:"jabatan"`
	Eselon     string `json:"eselon"`
	Pangkat    string `json:"pangkat"`
	Golongan   string `json:"golongan"`
	TmtJabatan string `json:"tmt_jabatan"` // format: 2006-01-02
	Pendidikan string `json:"pendidikan"`
}

func (h PejabatHandler) List(c *echo.Context) error {
	opdID := c.QueryParam("opd_id")
	search := c.QueryParam("search")
	items, err := store.ListPejabat(c.Request().Context(), h.DB, opdID, search)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengambil data pejabat")
	}
	return c.JSON(http.StatusOK, items)
}

func (h PejabatHandler) Get(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	item, err := store.GetPejabatByID(c.Request().Context(), h.DB, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Pejabat tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengambil data pejabat")
	}
	return c.JSON(http.StatusOK, item)
}

func (h PejabatHandler) Create(c *echo.Context) error {
	var req pejabatRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	if strings.TrimSpace(req.OpdID) == "" || strings.TrimSpace(req.NIP) == "" || strings.TrimSpace(req.Nama) == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "opd_id, nip, nama wajib diisi")
	}
	var tmt *time.Time
	if req.TmtJabatan != "" {
		t, err := time.Parse("2006-01-02", req.TmtJabatan)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "Format tmt_jabatan tidak valid (gunakan YYYY-MM-DD)")
		}
		tmt = &t
	}
	item, err := store.CreatePejabat(c.Request().Context(), h.DB,
		req.OpdID, req.NIP, req.Nama, req.Jabatan, req.Eselon, req.Pangkat, req.Golongan, tmt, req.Pendidikan)
	if err != nil {
		if strings.Contains(err.Error(), "Duplicate") {
			return echo.NewHTTPError(http.StatusConflict, "NIP sudah terdaftar")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal membuat pejabat")
	}
	return c.JSON(http.StatusCreated, item)
}

func (h PejabatHandler) Update(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	var req pejabatRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	var tmt *time.Time
	if req.TmtJabatan != "" {
		t, err := time.Parse("2006-01-02", req.TmtJabatan)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "Format tmt_jabatan tidak valid (gunakan YYYY-MM-DD)")
		}
		tmt = &t
	}
	item, err := store.UpdatePejabat(c.Request().Context(), h.DB, id,
		req.OpdID, req.NIP, req.Nama, req.Jabatan, req.Eselon, req.Pangkat, req.Golongan, tmt, req.Pendidikan)
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Pejabat tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengubah pejabat")
	}
	return c.JSON(http.StatusOK, item)
}

func (h PejabatHandler) Delete(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	if err := store.SoftDeletePejabat(c.Request().Context(), h.DB, id); err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Pejabat tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal menghapus pejabat")
	}
	return c.NoContent(http.StatusNoContent)
}
