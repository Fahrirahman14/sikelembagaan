package handler

import (
	"database/sql"
	"net/http"

	"catatan-backend/internal/store"

	"github.com/labstack/echo/v5"
)

type DashboardHandler struct {
	DB *sql.DB
}

func (h DashboardHandler) Summary(c *echo.Context) error {
	summary, err := store.GetDashboardSummary(c.Request().Context(), h.DB)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengambil data dashboard")
	}
	return c.JSON(http.StatusOK, summary)
}

func (h DashboardHandler) RekapOPD(c *echo.Context) error {
	items, err := store.GetRekapOPD(c.Request().Context(), h.DB)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengambil rekap OPD")
	}
	return c.JSON(http.StatusOK, items)
}
