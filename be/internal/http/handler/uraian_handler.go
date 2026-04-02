package handler

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"catatan-backend/internal/store"

	"github.com/labstack/echo/v5"
)

type UraianHandler struct {
	DB *sql.DB
}

type uraianRequest struct {
	Tugas         json.RawMessage `json:"tugas"`
	Fungsi        json.RawMessage `json:"fungsi"`
	Wewenang      json.RawMessage `json:"wewenang"`
	TanggungJawab json.RawMessage `json:"tanggung_jawab"`
}

func (h UraianHandler) Get(c *echo.Context) error {
	jabatanID, err := parseID(c, "jabatanId")
	if err != nil {
		return err
	}
	item, err := store.GetUraianByJabatan(c.Request().Context(), h.DB, jabatanID)
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Uraian jabatan tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengambil data uraian")
	}
	return c.JSON(http.StatusOK, item)
}

func (h UraianHandler) Upsert(c *echo.Context) error {
	jabatanID, err := parseID(c, "jabatanId")
	if err != nil {
		return err
	}
	var req uraianRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	item, err := store.UpsertUraian(c.Request().Context(), h.DB, jabatanID,
		req.Tugas, req.Fungsi, req.Wewenang, req.TanggungJawab)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal menyimpan uraian: "+err.Error())
	}
	return c.JSON(http.StatusOK, item)
}
