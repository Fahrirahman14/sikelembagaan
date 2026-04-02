package handler

import (
	"database/sql"
	"net/http"
	"strings"
	"time"

	"catatan-backend/internal/store"

	"github.com/labstack/echo/v5"
)

type LaporanABKHandler struct {
	DB *sql.DB
}

type laporanABKRequest struct {
	OpdID                 string  `json:"opd_id"`
	Periode               string  `json:"periode"`
	TanggalDibuat         string  `json:"tanggal_dibuat"`
	Status                string  `json:"status"`
	TotalJabatan          int     `json:"total_jabatan"`
	TotalKebutuhanPegawai int     `json:"total_kebutuhan_pegawai"`
	TotalPegawaiExisting  int     `json:"total_pegawai_existing"`
	Efisiensi             float64 `json:"efisiensi"`
}

func (h LaporanABKHandler) List(c *echo.Context) error {
	opdID := c.QueryParam("opd_id")
	items, err := store.ListLaporanABK(c.Request().Context(), h.DB, opdID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengambil data laporan ABK")
	}
	return c.JSON(http.StatusOK, items)
}

func (h LaporanABKHandler) Get(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	item, err := store.GetLaporanABKByID(c.Request().Context(), h.DB, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Laporan ABK tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengambil data laporan ABK")
	}
	return c.JSON(http.StatusOK, item)
}

func (h LaporanABKHandler) Create(c *echo.Context) error {
	var req laporanABKRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	if strings.TrimSpace(req.OpdID) == "" || strings.TrimSpace(req.Periode) == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "opd_id dan periode wajib diisi")
	}
	tanggal := time.Now()
	if req.TanggalDibuat != "" {
		t, err := time.Parse("2006-01-02", req.TanggalDibuat)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "Format tanggal_dibuat tidak valid")
		}
		tanggal = t
	}
	item, err := store.CreateLaporanABK(c.Request().Context(), h.DB,
		req.OpdID, req.Periode, tanggal, req.TotalJabatan, req.TotalKebutuhanPegawai, req.TotalPegawaiExisting, req.Efisiensi)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal membuat laporan ABK")
	}
	return c.JSON(http.StatusCreated, item)
}

func (h LaporanABKHandler) Update(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	var req laporanABKRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	if req.Status == "" {
		req.Status = "draft"
	}
	item, err := store.UpdateLaporanABK(c.Request().Context(), h.DB, id,
		req.Status, req.TotalJabatan, req.TotalKebutuhanPegawai, req.TotalPegawaiExisting, req.Efisiensi)
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Laporan ABK tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengubah laporan ABK")
	}
	return c.JSON(http.StatusOK, item)
}
