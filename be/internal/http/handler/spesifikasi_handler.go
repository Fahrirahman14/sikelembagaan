package handler

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"catatan-backend/internal/store"

	"github.com/labstack/echo/v5"
)

type SpesifikasiHandler struct {
	DB *sql.DB
}

type spesifikasiRequest struct {
	PendidikanFormal     json.RawMessage `json:"pendidikan_formal"`
	Pelatihan            json.RawMessage `json:"pelatihan"`
	Pengalaman           json.RawMessage `json:"pengalaman"`
	KompetensiManajerial json.RawMessage `json:"kompetensi_manajerial"`
	KompetensiTeknis     json.RawMessage `json:"kompetensi_teknis"`
	KondisiFisik         json.RawMessage `json:"kondisi_fisik"`
}

func (h SpesifikasiHandler) Get(c *echo.Context) error {
	jabatanID, err := parseID(c, "jabatanId")
	if err != nil {
		return err
	}
	item, err := store.GetSpesifikasiByJabatan(c.Request().Context(), h.DB, jabatanID)
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Spesifikasi jabatan tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengambil data spesifikasi")
	}
	return c.JSON(http.StatusOK, item)
}

func (h SpesifikasiHandler) Upsert(c *echo.Context) error {
	jabatanID, err := parseID(c, "jabatanId")
	if err != nil {
		return err
	}
	var req spesifikasiRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	item, err := store.UpsertSpesifikasi(c.Request().Context(), h.DB, jabatanID,
		req.PendidikanFormal, req.Pelatihan, req.Pengalaman,
		req.KompetensiManajerial, req.KompetensiTeknis, req.KondisiFisik)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal menyimpan spesifikasi: "+err.Error())
	}
	return c.JSON(http.StatusOK, item)
}
