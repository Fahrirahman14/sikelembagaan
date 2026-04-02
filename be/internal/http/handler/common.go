package handler

import (
	"net/http"
	"strings"

	"github.com/labstack/echo/v5"
)

func parseID(c *echo.Context, param string) (string, error) {
	id := strings.TrimSpace(c.Param(param))
	if id == "" {
		return "", echo.NewHTTPError(http.StatusBadRequest, "ID tidak valid")
	}
	return id, nil
}
