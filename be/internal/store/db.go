package store

import (
	"context"
	"database/sql"
	"errors"
	"strconv"
	"strings"

	_ "github.com/go-sql-driver/mysql"
)

// PaginatedResult wraps a slice of T with pagination metadata.
type PaginatedResult[T any] struct {
	Data   []T `json:"data"`
	Total  int `json:"total"`
	Limit  int `json:"limit"`
	Offset int `json:"offset"`
}

// ParsePagination extracts limit and offset from raw query-param strings.
// limit=0 means no LIMIT clause (return all). If limitStr is absent or invalid,
// the default of 20 is used.
func ParsePagination(limitStr, offsetStr string) (limit, offset int) {
	if limitStr == "" {
		limit = 20
	} else if v, err := strconv.Atoi(limitStr); err == nil {
		limit = v // 0 = no limit
	} else {
		limit = 20
	}
	if v, err := strconv.Atoi(offsetStr); err == nil && v > 0 {
		offset = v
	}
	return
}

// Open opens a SQL database connection using the given driver and DSN.
func Open(driver string, dsn string) (*sql.DB, error) {
	driver = strings.TrimSpace(driver)
	dsn = strings.TrimSpace(dsn)
	if driver == "" {
		return nil, errors.New("db driver is empty")
	}
	if dsn == "" {
		return nil, errors.New("db dsn is empty")
	}

	db, err := sql.Open(driver, dsn)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		_ = db.Close()
		return nil, err
	}

	return db, nil
}

func newUUID(ctx context.Context, db *sql.DB) (string, error) {
	var id string
	if err := db.QueryRowContext(ctx, "SELECT UUID()").Scan(&id); err != nil {
		return "", err
	}
	if id == "" {
		return "", errors.New("uuid is empty")
	}
	return id, nil
}
