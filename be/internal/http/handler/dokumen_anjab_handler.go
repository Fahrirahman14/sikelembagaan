package handler

import (
	"database/sql"
	"net/http"
	"strings"
	"time"

	"catatan-backend/internal/store"

	"github.com/labstack/echo/v5"
)

type DokumenAnjabHandler struct {
	DB *sql.DB
}

type dokumenAnjabRequest struct {
	OpdID         string `json:"opd_id"`
	NomorDokumen  string `json:"nomor_dokumen"`
	NamaOpd       string `json:"nama_opd"`
	Periode       string `json:"periode"`
	JumlahJabatan int    `json:"jumlah_jabatan"`
	TanggalDibuat string `json:"tanggal_dibuat"`
	Status        string `json:"status"`
	Pembuat       string `json:"pembuat"`
	Penyetuju     string `json:"penyetuju"`
}

func (h DokumenAnjabHandler) List(c *echo.Context) error {
	opdID := c.QueryParam("opd_id")
	status := c.QueryParam("status")
	search := c.QueryParam("search")
	items, err := store.ListDokumenAnjab(c.Request().Context(), h.DB, opdID, status, search)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengambil data dokumen anjab")
	}
	return c.JSON(http.StatusOK, items)
}

func (h DokumenAnjabHandler) Get(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	item, err := store.GetDokumenAnjabByID(c.Request().Context(), h.DB, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Dokumen anjab tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengambil data dokumen anjab")
	}
	return c.JSON(http.StatusOK, item)
}

func (h DokumenAnjabHandler) Create(c *echo.Context) error {
	var req dokumenAnjabRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	if strings.TrimSpace(req.OpdID) == "" || strings.TrimSpace(req.NamaOpd) == "" || strings.TrimSpace(req.Periode) == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "opd_id, nama_opd, periode wajib diisi")
	}
	tanggal := time.Now()
	if req.TanggalDibuat != "" {
		t, err := time.Parse("2006-01-02", req.TanggalDibuat)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "Format tanggal_dibuat tidak valid")
		}
		tanggal = t
	}
	item, err := store.CreateDokumenAnjab(c.Request().Context(), h.DB,
		req.OpdID, req.NomorDokumen, req.NamaOpd, req.Periode, req.JumlahJabatan, tanggal, req.Pembuat)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal membuat dokumen anjab")
	}
	return c.JSON(http.StatusCreated, item)
}

func (h DokumenAnjabHandler) Update(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	var req dokumenAnjabRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	if req.Status == "" {
		req.Status = "draft"
	}
	item, err := store.UpdateDokumenAnjab(c.Request().Context(), h.DB, id,
		req.NomorDokumen, req.NamaOpd, req.Periode, req.JumlahJabatan, req.Status, req.Pembuat, req.Penyetuju)
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Dokumen anjab tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengubah dokumen anjab")
	}
	return c.JSON(http.StatusOK, item)
}

func (h DokumenAnjabHandler) Delete(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	if err := store.SoftDeleteDokumenAnjab(c.Request().Context(), h.DB, id); err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Dokumen anjab tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal menghapus dokumen anjab")
	}
	return c.NoContent(http.StatusNoContent)
}

type statusRequest struct {
	Status    string `json:"status"`
	Penyetuju string `json:"penyetuju"`
}

func (h DokumenAnjabHandler) Submit(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	item, err := store.UpdateDokumenAnjabStatus(c.Request().Context(), h.DB, id, "review", "")
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Dokumen anjab tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengajukan dokumen")
	}
	return c.JSON(http.StatusOK, item)
}

func (h DokumenAnjabHandler) Approve(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	var req statusRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	item, err := store.UpdateDokumenAnjabStatus(c.Request().Context(), h.DB, id, "disetujui", req.Penyetuju)
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Dokumen anjab tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal menyetujui dokumen")
	}
	return c.JSON(http.StatusOK, item)
}
