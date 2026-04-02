package handler

import (
	"database/sql"
	"net/http"

	"catatan-backend/internal/store"

	"github.com/labstack/echo/v5"
)

type PerhitunganHandler struct {
	DB *sql.DB
}

type calculateRequest struct {
	JabatanID         string  `json:"jabatan_id"`
	PegawaiExisting   int     `json:"pegawai_existing"`
	WaktuKerjaEfektif float64 `json:"waktu_kerja_efektif"`
}

func (h PerhitunganHandler) List(c *echo.Context) error {
	jabatanID := c.QueryParam("jabatan_id")
	items, err := store.ListPerhitunganABK(c.Request().Context(), h.DB, jabatanID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengambil data perhitungan")
	}
	return c.JSON(http.StatusOK, items)
}

func (h PerhitunganHandler) Get(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	item, err := store.GetPerhitunganByID(c.Request().Context(), h.DB, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Perhitungan tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengambil data perhitungan")
	}
	return c.JSON(http.StatusOK, item)
}

func (h PerhitunganHandler) Calculate(c *echo.Context) error {
	var req calculateRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	if req.JabatanID == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "jabatan_id wajib diisi")
	}
	item, err := store.CalculateABK(c.Request().Context(), h.DB,
		req.JabatanID, req.PegawaiExisting, req.WaktuKerjaEfektif)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal menghitung beban kerja: "+err.Error())
	}
	return c.JSON(http.StatusOK, item)
}
