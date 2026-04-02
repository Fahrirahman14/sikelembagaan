package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"catatan-backend/internal/config"
	"catatan-backend/internal/http/router"
	"catatan-backend/internal/store"

	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}

	db, err := store.Open(cfg.DBDriver, cfg.DBDSN)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := store.Migrate(db); err != nil {
		log.Fatal("migration failed: ", err)
	}

	if err := store.Seed(db); err != nil {
		log.Println("seed warning (may already exist): ", err)
	}

	e := router.New(cfg, db)
	addr := ":" + cfg.Port
	srv := &http.Server{Addr: addr, Handler: e}
	log.Println("//////////////////////////////////////////")
	log.Println("//                                      //")
	log.Println("//       BE SIKELEMBAGAAN               //")
	log.Printf("//   running on http://localhost%s   //", addr)
	log.Println("//                                      //")
	log.Println("//////////////////////////////////////////")

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	go func() {
		err := srv.ListenAndServe()
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			e.Logger.Error("failed to start server", "error", err)
			stop()
		}
	}()

	<-ctx.Done()
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_ = srv.Shutdown(shutdownCtx)
}
