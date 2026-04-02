package handler

import (
	"database/sql"
	"net/http"
	"strings"

	"catatan-backend/internal/store"

	"golang.org/x/crypto/bcrypt"

	"github.com/labstack/echo/v5"
)

type AdminHandler struct {
	DB *sql.DB
}

// === Roles ===

type roleRequest struct {
	Kode      string `json:"kode"`
	Nama      string `json:"nama"`
	Level     string `json:"level"`
	Deskripsi string `json:"deskripsi"`
}

func (h AdminHandler) ListRoles(c *echo.Context) error {
	items, err := store.ListRoles(c.Request().Context(), h.DB)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengambil data role")
	}
	return c.JSON(http.StatusOK, items)
}

func (h AdminHandler) CreateRole(c *echo.Context) error {
	var req roleRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	if strings.TrimSpace(req.Kode) == "" || strings.TrimSpace(req.Nama) == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "Kode dan nama wajib diisi")
	}
	if req.Level == "" {
		req.Level = "operasional"
	}
	item, err := store.CreateRole(c.Request().Context(), h.DB, req.Kode, req.Nama, req.Level, req.Deskripsi)
	if err != nil {
		if strings.Contains(err.Error(), "Duplicate") {
			return echo.NewHTTPError(http.StatusConflict, "Kode role sudah digunakan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal membuat role")
	}
	return c.JSON(http.StatusCreated, item)
}

func (h AdminHandler) UpdateRole(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	var req roleRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	item, err := store.UpdateRole(c.Request().Context(), h.DB, id, req.Kode, req.Nama, req.Level, req.Deskripsi)
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Role tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengubah role")
	}
	return c.JSON(http.StatusOK, item)
}

func (h AdminHandler) DeleteRole(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	if err := store.SoftDeleteRole(c.Request().Context(), h.DB, id); err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "Role tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal menghapus role")
	}
	return c.NoContent(http.StatusNoContent)
}

// === Users ===

type adminUserRequest struct {
	Email    string  `json:"email"`
	Nama     string  `json:"nama"`
	Password string  `json:"password"`
	RoleID   *string `json:"role_id"`
	Status   string  `json:"status"`
}

func (h AdminHandler) ListUsers(c *echo.Context) error {
	items, err := store.ListAdminUsers(c.Request().Context(), h.DB)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengambil data user")
	}
	return c.JSON(http.StatusOK, items)
}

func (h AdminHandler) CreateUser(c *echo.Context) error {
	var req adminUserRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	if strings.TrimSpace(req.Email) == "" || strings.TrimSpace(req.Nama) == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "Email dan nama wajib diisi")
	}
	var passwordHash string
	if req.Password != "" {
		hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "Gagal memproses password")
		}
		passwordHash = string(hash)
	}
	item, err := store.CreateAdminUser(c.Request().Context(), h.DB,
		req.Email, req.Nama, passwordHash, req.RoleID, "", "")
	if err != nil {
		if strings.Contains(err.Error(), "Duplicate") {
			return echo.NewHTTPError(http.StatusConflict, "Email sudah terdaftar")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal membuat user")
	}
	return c.JSON(http.StatusCreated, item)
}

func (h AdminHandler) UpdateUser(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	var req adminUserRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	if req.Status == "" {
		req.Status = "aktif"
	}
	item, err := store.UpdateAdminUser(c.Request().Context(), h.DB, id, req.Email, req.Nama, req.RoleID, req.Status)
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "User tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal mengubah user")
	}
	// Update password if provided
	if req.Password != "" {
		hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "Gagal memproses password")
		}
		_ = store.UpdateUserPassword(c.Request().Context(), h.DB, id, string(hash))
	}
	return c.JSON(http.StatusOK, item)
}

func (h AdminHandler) DeleteUser(c *echo.Context) error {
	id, err := parseID(c, "id")
	if err != nil {
		return err
	}
	if err := store.SoftDeleteAdminUser(c.Request().Context(), h.DB, id); err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "User tidak ditemukan")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal menghapus user")
	}
	return c.NoContent(http.StatusNoContent)
}
