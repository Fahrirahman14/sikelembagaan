package store

import (
	"context"
	"database/sql"
	"errors"
	"strings"
	"time"
)

type AdminUser struct {
	ID           string     `json:"id"`
	Email        string     `json:"email"`
	Nama         string     `json:"nama"`
	PasswordHash string     `json:"-"`
	RoleID       *string    `json:"role_id,omitempty"`
	RoleNama     string     `json:"role_nama,omitempty"`
	Picture      string     `json:"picture,omitempty"`
	GoogleID     string     `json:"google_id,omitempty"`
	MfaEnabled   bool       `json:"mfa_enabled"`
	Status       string     `json:"status"`
	LastLoginAt  *time.Time `json:"last_login_at,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
	DeletedAt    *time.Time `json:"deleted_at,omitempty"`
}

func ListAdminUsers(ctx context.Context, db *sql.DB) ([]AdminUser, error) {
	rows, err := db.QueryContext(ctx, `
		SELECT u.id, u.email, u.nama, u.role_id, COALESCE(r.nama,''), u.picture, COALESCE(u.google_id,''),
			u.mfa_enabled, u.status, u.last_login_at, u.created_at, u.updated_at
		FROM users u
		LEFT JOIN roles r ON r.id = u.role_id AND r.deleted_at IS NULL
		WHERE u.deleted_at IS NULL
		ORDER BY u.nama ASC`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]AdminUser, 0)
	for rows.Next() {
		var u AdminUser
		var roleID sql.NullString
		var lastLogin sql.NullTime
		var picture sql.NullString
		if err := rows.Scan(&u.ID, &u.Email, &u.Nama, &roleID, &u.RoleNama, &picture, &u.GoogleID,
			&u.MfaEnabled, &u.Status, &lastLogin, &u.CreatedAt, &u.UpdatedAt); err != nil {
			return nil, err
		}
		if roleID.Valid {
			u.RoleID = &roleID.String
		}
		if lastLogin.Valid {
			u.LastLoginAt = &lastLogin.Time
		}
		if picture.Valid {
			u.Picture = picture.String
		}
		out = append(out, u)
	}
	return out, rows.Err()
}

func GetAdminUserByID(ctx context.Context, db *sql.DB, id string) (AdminUser, error) {
	var u AdminUser
	var roleID sql.NullString
	var lastLogin sql.NullTime
	var picture sql.NullString
	err := db.QueryRowContext(ctx, `
		SELECT u.id, u.email, u.nama, u.password_hash, u.role_id, COALESCE(r.nama,''), COALESCE(u.picture,''), COALESCE(u.google_id,''),
			u.mfa_enabled, u.status, u.last_login_at, u.created_at, u.updated_at
		FROM users u
		LEFT JOIN roles r ON r.id = u.role_id AND r.deleted_at IS NULL
		WHERE u.id = ? AND u.deleted_at IS NULL`, id,
	).Scan(&u.ID, &u.Email, &u.Nama, &u.PasswordHash, &roleID, &u.RoleNama, &picture, &u.GoogleID,
		&u.MfaEnabled, &u.Status, &lastLogin, &u.CreatedAt, &u.UpdatedAt)
	if roleID.Valid {
		u.RoleID = &roleID.String
	}
	if lastLogin.Valid {
		u.LastLoginAt = &lastLogin.Time
	}
	if picture.Valid {
		u.Picture = picture.String
	}
	return u, err
}

func GetAdminUserByEmail(ctx context.Context, db *sql.DB, email string) (AdminUser, error) {
	var u AdminUser
	var roleID sql.NullString
	var lastLogin sql.NullTime
	var picture sql.NullString
	err := db.QueryRowContext(ctx, `
		SELECT u.id, u.email, u.nama, COALESCE(u.password_hash,''), u.role_id, COALESCE(r.nama,''), COALESCE(u.picture,''), COALESCE(u.google_id,''),
			u.mfa_enabled, u.status, u.last_login_at, u.created_at, u.updated_at
		FROM users u
		LEFT JOIN roles r ON r.id = u.role_id AND r.deleted_at IS NULL
		WHERE u.email = ? AND u.deleted_at IS NULL`, email,
	).Scan(&u.ID, &u.Email, &u.Nama, &u.PasswordHash, &roleID, &u.RoleNama, &picture, &u.GoogleID,
		&u.MfaEnabled, &u.Status, &lastLogin, &u.CreatedAt, &u.UpdatedAt)
	if roleID.Valid {
		u.RoleID = &roleID.String
	}
	if lastLogin.Valid {
		u.LastLoginAt = &lastLogin.Time
	}
	if picture.Valid {
		u.Picture = picture.String
	}
	return u, err
}

func CreateAdminUser(ctx context.Context, db *sql.DB, email, nama, passwordHash string, roleID *string, picture, googleID string) (AdminUser, error) {
	email = strings.TrimSpace(email)
	nama = strings.TrimSpace(nama)
	if email == "" || nama == "" {
		return AdminUser{}, errors.New("email dan nama wajib diisi")
	}

	id, err := newUUID(ctx, db)
	if err != nil {
		return AdminUser{}, err
	}
	now := time.Now().UTC()

	var pwHash sql.NullString
	if passwordHash != "" {
		pwHash = sql.NullString{String: passwordHash, Valid: true}
	}
	var rID sql.NullString
	if roleID != nil {
		rID = sql.NullString{String: *roleID, Valid: true}
	}

	_, err = db.ExecContext(ctx, `
		INSERT INTO users (id, email, nama, password_hash, role_id, picture, google_id, status, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, 'aktif', ?, ?)`,
		id, email, nama, pwHash, rID, picture, googleID, now, now,
	)
	if err != nil {
		return AdminUser{}, err
	}
	return GetAdminUserByID(ctx, db, id)
}

func UpdateAdminUser(ctx context.Context, db *sql.DB, id, email, nama string, roleID *string, status string) (AdminUser, error) {
	now := time.Now().UTC()
	var rID sql.NullString
	if roleID != nil {
		rID = sql.NullString{String: *roleID, Valid: true}
	}
	res, err := db.ExecContext(ctx, `
		UPDATE users SET email=?, nama=?, role_id=?, status=?, updated_at=? WHERE id=? AND deleted_at IS NULL`,
		email, nama, rID, status, now, id,
	)
	if err != nil {
		return AdminUser{}, err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return AdminUser{}, sql.ErrNoRows
	}
	return GetAdminUserByID(ctx, db, id)
}

func UpdateUserPassword(ctx context.Context, db *sql.DB, id, passwordHash string) error {
	now := time.Now().UTC()
	res, err := db.ExecContext(ctx,
		"UPDATE users SET password_hash=?, updated_at=? WHERE id=? AND deleted_at IS NULL",
		passwordHash, now, id,
	)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func UpdateUserLastLogin(ctx context.Context, db *sql.DB, id string) error {
	now := time.Now().UTC()
	_, err := db.ExecContext(ctx,
		"UPDATE users SET last_login_at=?, updated_at=? WHERE id=? AND deleted_at IS NULL",
		now, now, id,
	)
	return err
}

func UpsertGoogleUser(ctx context.Context, db *sql.DB, email, nama, picture, googleID string) (AdminUser, error) {
	u, err := GetAdminUserByEmail(ctx, db, email)
	if err == sql.ErrNoRows {
		return CreateAdminUser(ctx, db, email, nama, "", nil, picture, googleID)
	}
	if err != nil {
		return AdminUser{}, err
	}
	// Update google_id and picture if needed
	now := time.Now().UTC()
	_, _ = db.ExecContext(ctx,
		"UPDATE users SET google_id=?, picture=?, last_login_at=?, updated_at=? WHERE id=? AND deleted_at IS NULL",
		googleID, picture, now, now, u.ID,
	)
	u.GoogleID = googleID
	u.Picture = picture
	u.LastLoginAt = &now
	return u, nil
}

func SoftDeleteAdminUser(ctx context.Context, db *sql.DB, id string) error {
	now := time.Now().UTC()
	res, err := db.ExecContext(ctx,
		"UPDATE users SET deleted_at=?, updated_at=? WHERE id=? AND deleted_at IS NULL", now, now, id,
	)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return sql.ErrNoRows
	}
	return nil
}
