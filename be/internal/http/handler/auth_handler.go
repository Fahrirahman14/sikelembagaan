package handler

import (
	"database/sql"
	"net/http"
	"time"

	"catatan-backend/internal/googleauth"
	jwtutil "catatan-backend/internal/jwt"
	"catatan-backend/internal/model"
	"catatan-backend/internal/store"

	"golang.org/x/crypto/bcrypt"

	"github.com/labstack/echo/v5"
)

type AuthHandler struct {
	DB              *sql.DB
	JWTSecret       string
	GoogleClientID  string
	AccessTokenTTL  time.Duration
	RefreshTokenTTL time.Duration
}

type googleLoginRequest struct {
	Credential string `json:"credential"`
}

type googleLoginResponse struct {
	Token            string     `json:"token"`
	AccessToken      string     `json:"access_token"`
	RefreshToken     string     `json:"refresh_token"`
	TokenType        string     `json:"token_type"`
	ExpiresIn        int64      `json:"expires_in"`
	RefreshExpiresIn int64      `json:"refresh_expires_in"`
	User             model.User `json:"user"`
}

type refreshTokenRequest struct {
	RefreshToken string `json:"refresh_token"`
}

func (h AuthHandler) accessTokenTTL() time.Duration {
	if h.AccessTokenTTL > 0 {
		return h.AccessTokenTTL
	}
	return 2 * time.Hour
}

func (h AuthHandler) refreshTokenTTL() time.Duration {
	if h.RefreshTokenTTL > 0 {
		return h.RefreshTokenTTL
	}
	return 24 * time.Hour
}

func (h AuthHandler) issueTokenPair(user model.User) (googleLoginResponse, error) {
	accessTTL := h.accessTokenTTL()
	refreshTTL := h.refreshTokenTTL()

	accessToken, err := jwtutil.NewAccessToken(h.JWTSecret, user, accessTTL)
	if err != nil {
		return googleLoginResponse{}, err
	}

	refreshToken, err := jwtutil.NewRefreshToken(h.JWTSecret, user, refreshTTL)
	if err != nil {
		return googleLoginResponse{}, err
	}

	return googleLoginResponse{
		Token:            accessToken,
		AccessToken:      accessToken,
		RefreshToken:     refreshToken,
		TokenType:        "Bearer",
		ExpiresIn:        int64(accessTTL / time.Second),
		RefreshExpiresIn: int64(refreshTTL / time.Second),
		User:             user,
	}, nil
}

func (h AuthHandler) GoogleLogin(c *echo.Context) error {
	var req googleLoginRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}

	user, err := googleauth.VerifyCredential(c.Request().Context(), req.Credential, h.GoogleClientID)
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, err.Error())
	}

	// Upsert user in database
	if h.DB != nil {
		dbUser, _ := store.UpsertGoogleUser(c.Request().Context(), h.DB, user.Email, user.Name, user.Picture, user.ID)
		if dbUser.ID != "" {
			user.ID = dbUser.ID
		}
	}

	resp, err := h.issueTokenPair(user)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal membuat JWT")
	}

	return c.JSON(http.StatusOK, resp)
}

type emailLoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h AuthHandler) EmailLogin(c *echo.Context) error {
	var req emailLoginRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}
	if req.Email == "" || req.Password == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "Email dan password wajib diisi")
	}

	dbUser, err := store.GetAdminUserByEmail(c.Request().Context(), h.DB, req.Email)
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, "Email atau password salah")
	}
	if dbUser.Status != "aktif" {
		return echo.NewHTTPError(http.StatusForbidden, "Akun tidak aktif")
	}
	if dbUser.PasswordHash == "" {
		return echo.NewHTTPError(http.StatusUnauthorized, "Akun ini menggunakan login Google")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(dbUser.PasswordHash), []byte(req.Password)); err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, "Email atau password salah")
	}

	_ = store.UpdateUserLastLogin(c.Request().Context(), h.DB, dbUser.ID)

	user := model.User{
		ID:      dbUser.ID,
		Email:   dbUser.Email,
		Name:    dbUser.Nama,
		Picture: dbUser.Picture,
	}

	resp, err := h.issueTokenPair(user)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal membuat JWT")
	}
	return c.JSON(http.StatusOK, resp)
}

func (h AuthHandler) RefreshToken(c *echo.Context) error {
	var req refreshTokenRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Body tidak valid")
	}

	refreshToken := req.RefreshToken
	if refreshToken == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "Refresh token diperlukan")
	}

	claims, err := jwtutil.ParseToken(h.JWTSecret, refreshToken, jwtutil.TokenTypeRefresh)
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, "Refresh token tidak valid")
	}

	resp, err := h.issueTokenPair(claims.User)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal membuat JWT baru")
	}

	return c.JSON(http.StatusOK, resp)
}
