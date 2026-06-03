package router

import (
	"database/sql"
	"net/http"
	"time"

	"catatan-backend/internal/config"
	"catatan-backend/internal/http/handler"
	appmw "catatan-backend/internal/http/middleware"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func New(cfg config.Config, db *sql.DB) *echo.Echo {
	e := echo.New()

	e.Use(middleware.Recover())
	e.Use(middleware.RequestLogger())

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: cfg.AllowedFrontendOrigins,
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodPatch, http.MethodDelete, http.MethodOptions},
		AllowHeaders: []string{"Accept", "Authorization", "Content-Type", "Origin", "X-Requested-With"},
	}))

	e.GET("/", func(c *echo.Context) error {
		return c.String(http.StatusOK, "OK")
	})

	api := e.Group("/api")

	jwtAuth := appmw.JWTAuth{Secret: cfg.JWTSecret}
	frontendGuard := appmw.NewFrontendGuard(cfg.AllowedFrontendOrigins)

	// === Auth ===
	authGroup := api.Group("/auth")
	authGroup.Use(frontendGuard.RequireFrontend)

	googleAuth := handler.AuthHandler{
		DB:              db,
		JWTSecret:       cfg.JWTSecret,
		GoogleClientID:  cfg.GoogleClientID,
		AccessTokenTTL:  2 * time.Hour,
		RefreshTokenTTL: 24 * time.Hour,
	}
	authGroup.POST("/google", googleAuth.GoogleLogin)
	authGroup.POST("/login", googleAuth.EmailLogin)
	authGroup.POST("/refresh", googleAuth.RefreshToken)

	// === Health ===
	api.GET("/health", func(c *echo.Context) error {
		return c.JSON(http.StatusOK, map[string]any{"ok": true})
	})

	// === Public read-only routes (no JWT required) ===
	public := api.Group("")
	public.Use(frontendGuard.RequireFrontend)

	dashboard := handler.DashboardHandler{DB: db}
	public.GET("/dashboard/summary", dashboard.Summary)

	opd := handler.OPDHandler{DB: db}
	public.GET("/opd", opd.List)
	public.GET("/opd/:id", opd.Get)

	jabatan := handler.JabatanHandler{DB: db}
	public.GET("/jabatan", jabatan.List)
	public.GET("/jabatan/:id", jabatan.Get)

	perhitungan := handler.PerhitunganHandler{DB: db}
	public.GET("/abk/perhitungan", perhitungan.List)
	public.GET("/abk/perhitungan/:id", perhitungan.Get)

	laporanAbk := handler.LaporanABKHandler{DB: db}
	public.GET("/abk/laporan", laporanAbk.List)
	public.GET("/abk/laporan/:id", laporanAbk.Get)

	sakip := handler.SAKIPHandler{DB: db}
	public.GET("/sakip/nilai", sakip.ListNilai)
	public.GET("/sakip/dokumen", sakip.ListDokumen)

	// === Protected routes ===
	protected := api.Group("")
	protected.Use(frontendGuard.RequireFrontend)
	protected.Use(jwtAuth.RequireJWT)

	me := handler.MeHandler{}
	protected.GET("/me", me.Me)

	// --- Dashboard ---
	protected.GET("/laporan/rekap-opd", dashboard.RekapOPD)

	// --- OPD ---
	protected.POST("/opd", opd.Create)
	protected.PUT("/opd/:id", opd.Update)
	protected.DELETE("/opd/:id", opd.Delete)

	// --- Jabatan ---
	protected.POST("/jabatan", jabatan.Create)
	protected.PUT("/jabatan/:id", jabatan.Update)
	protected.DELETE("/jabatan/:id", jabatan.Delete)

	// --- Pejabat ---
	pejabat := handler.PejabatHandler{DB: db}
	protected.GET("/pejabat", pejabat.List)
	protected.GET("/pejabat/:id", pejabat.Get)
	protected.POST("/pejabat", pejabat.Create)
	protected.PUT("/pejabat/:id", pejabat.Update)
	protected.DELETE("/pejabat/:id", pejabat.Delete)

	// --- Struktur Organisasi ---
	struktur := handler.StrukturHandler{DB: db}
	protected.GET("/struktur/:opdId", struktur.ListByOPD)
	protected.POST("/struktur", struktur.Create)
	protected.PUT("/struktur/:id", struktur.Update)
	protected.DELETE("/struktur/:id", struktur.Delete)

	// --- ABK Aktivitas ---
	aktivitas := handler.AktivitasHandler{DB: db}
	protected.GET("/abk/aktivitas", aktivitas.List)
	protected.GET("/abk/aktivitas/:id", aktivitas.Get)
	protected.POST("/abk/aktivitas", aktivitas.Create)
	protected.PUT("/abk/aktivitas/:id", aktivitas.Update)
	protected.DELETE("/abk/aktivitas/:id", aktivitas.Delete)

	// --- ABK Perhitungan (write) ---
	protected.POST("/abk/perhitungan/calc", perhitungan.Calculate)

	// --- ABK Laporan (write) ---
	protected.POST("/abk/laporan", laporanAbk.Create)
	protected.PUT("/abk/laporan/:id", laporanAbk.Update)

	// --- Anjab Dokumen ---
	dokumenAnjab := handler.DokumenAnjabHandler{DB: db}
	protected.GET("/anjab/dokumen", dokumenAnjab.List)
	protected.GET("/anjab/dokumen/:id", dokumenAnjab.Get)
	protected.POST("/anjab/dokumen", dokumenAnjab.Create)
	protected.PUT("/anjab/dokumen/:id", dokumenAnjab.Update)
	protected.DELETE("/anjab/dokumen/:id", dokumenAnjab.Delete)
	protected.POST("/anjab/dokumen/:id/submit", dokumenAnjab.Submit)
	protected.POST("/anjab/dokumen/:id/approve", dokumenAnjab.Approve)

	// --- Anjab Spesifikasi ---
	spesifikasi := handler.SpesifikasiHandler{DB: db}
	protected.GET("/anjab/spesifikasi/export", spesifikasi.Export)
	protected.GET("/anjab/spesifikasi/:jabatanId", spesifikasi.Get)
	protected.PUT("/anjab/spesifikasi/:jabatanId", spesifikasi.Upsert)

	// --- Anjab Uraian ---
	uraian := handler.UraianHandler{DB: db}
	protected.GET("/anjab/uraian/export", uraian.Export)
	protected.GET("/anjab/uraian/:jabatanId", uraian.Get)
	protected.PUT("/anjab/uraian/:jabatanId", uraian.Upsert)

	// --- SAKIP (write) ---
	protected.PUT("/sakip/nilai", sakip.UpsertNilai)
	protected.POST("/sakip/dokumen", sakip.CreateDokumen)
	protected.DELETE("/sakip/dokumen/:id", sakip.DeleteDokumen)

	// --- Admin Roles ---
	admin := handler.AdminHandler{DB: db}
	protected.GET("/admin/roles", admin.ListRoles)
	protected.POST("/admin/roles", admin.CreateRole)
	protected.PUT("/admin/roles/:id", admin.UpdateRole)
	protected.DELETE("/admin/roles/:id", admin.DeleteRole)

	// --- Admin Users ---
	protected.GET("/admin/users", admin.ListUsers)
	protected.POST("/admin/users", admin.CreateUser)
	protected.PUT("/admin/users/:id", admin.UpdateUser)
	protected.DELETE("/admin/users/:id", admin.DeleteUser)

	return e
}
