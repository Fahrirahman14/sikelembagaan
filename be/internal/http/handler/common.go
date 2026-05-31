package handler

import (
	"net/http"
	"strings"

	"catatan-backend/internal/store"

	"github.com/labstack/echo/v5"
)

func parseID(c *echo.Context, param string) (string, error) {
	id := strings.TrimSpace(c.Param(param))
	if id == "" {
		return "", echo.NewHTTPError(http.StatusBadRequest, "ID tidak valid")
	}
	return id, nil
}

func parsePagination(c *echo.Context) (limit, offset int) {
	return store.ParsePagination(c.QueryParam("limit"), c.QueryParam("offset"))
}
