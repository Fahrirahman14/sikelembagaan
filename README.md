# SIKELEMBAGAAN

**Sistem Informasi Kelembagaan Pemerintah Daerah**

Aplikasi web full-stack untuk pengelolaan data kelembagaan pemerintah daerah, mencakup modul **Analisis Jabatan (Anjab)**, **Analisis Beban Kerja (ABK)**, **SAKIP**, serta manajemen OPD dan struktur organisasi.

---

## Fitur Utama

| Modul                   | Deskripsi                                               |
| ----------------------- | ------------------------------------------------------- |
| **OPD**                 | Manajemen data Organisasi Perangkat Daerah              |
| **Jabatan & Pejabat**   | Pengelolaan data jabatan dan pejabat                    |
| **Struktur Organisasi** | Visualisasi hierarki organisasi per OPD                 |
| **Anjab**               | Analisis Jabatan (dokumen, spesifikasi, uraian jabatan) |
| **ABK**                 | Analisis Beban Kerja (aktivitas, perhitungan, laporan)  |
| **SAKIP**               | Penilaian dan dokumen SAKIP                             |
| **Dashboard**           | Ringkasan statistik dan rekap per OPD                   |
| **Admin**               | Manajemen pengguna, roles, dan akses                    |

---

## Teknologi

### Backend (`be/`)

- **Go 1.25** dengan framework [Echo v5](https://echo.labstack.com/)
- **MySQL** sebagai database
- **JWT** untuk autentikasi (access + refresh token)
- **Google OAuth** (Sign in with Google)
- **Docker** untuk deployment
- Auto-migrate dan seed database saat startup

### Frontend (`fe/`)

- **Next.js 16** + **React 19** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix UI)
- **Recharts** untuk visualisasi data
- **React Hook Form** + **Zod** untuk validasi form

---

## Prasyarat

- **Go** >= 1.25
- **Node.js** >= 20 & **npm** / **pnpm**
- **MySQL** >= 8.0
- (Opsional) Docker & Docker Compose

---

## Struktur Project

```
sikelembagaan/
├── be/                          # Backend (Go)
│   ├── main.go
│   ├── Dockerfile
│   ├── go.mod
│   └── internal/
│       ├── config/              # Konfigurasi & env vars
│       ├── googleauth/          # Verifikasi Google ID token
│       ├── http/
│       │   ├── handler/         # HTTP handlers per resource
│       │   ├── middleware/      # JWT auth, frontend guard
│       │   └── router/          # Definisi routes
│       ├── jwt/                 # Utilitas JWT
│       ├── model/               # Struct domain
│       └── store/               # Query SQL (per resource)
└── fe/                          # Frontend (Next.js)
    ├── app/
    │   ├── (public)/            # Halaman publik (login, anjab, sakip)
    │   └── admin/               # Halaman admin (protected)
    ├── components/              # Komponen React
    ├── context/                 # Auth context
    ├── hooks/                   # Custom hooks
    └── lib/                     # Utilitas & API client
```

---

## Setup & Menjalankan Lokal

### 1. Clone Repository

```bash
git clone <url-repo>
cd sikelembagaan
```

### 2. Setup Backend

**Buat file `.env` di folder `be/`:**

```env
# Server
PORT=1323

# JWT (wajib, gunakan string acak yang kuat)
JWT_SECRET=your-super-secret-jwt-key

# Enkripsi (wajib, harus 16, 24, atau 32 karakter)
NOTES_ENCRYPT_KEY=your-32-char-encrypt-key-here!!!

# Google OAuth (opsional — jika tidak diisi, Sign in with Google tidak berfungsi)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Database MySQL
DB_DRIVER=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=sikelembagaan
DB_USER=root
DB_PASSWORD=your-db-password

# CORS — pisahkan dengan koma jika lebih dari satu origin
ALLOWED_FRONTEND_ORIGINS=http://localhost:3000
```

**Jalankan backend:**

```bash
cd be
go mod download
go run main.go
```

Server berjalan di `http://localhost:1323`. Migrasi dan seed database dijalankan otomatis saat startup.

### 3. Setup Frontend

**Buat file `.env.local` di folder `fe/`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:1323
```

**Jalankan frontend:**

```bash
cd fe
npm install
npm run dev
```

Aplikasi berjalan di `http://localhost:3000`.

---

## API Endpoints

Semua endpoint berada di bawah prefix `/api`. Endpoint yang membutuhkan autentikasi memerlukan header:

```
Authorization: Bearer <access_token>
```

### Auth (publik)

| Method | Path                | Deskripsi                     |
| ------ | ------------------- | ----------------------------- |
| `POST` | `/api/auth/google`  | Login dengan Google ID token  |
| `POST` | `/api/auth/login`   | Login dengan email & password |
| `POST` | `/api/auth/refresh` | Perbarui access token         |

### Protected (butuh JWT)

| Resource          | Endpoints                                                                            |
| ----------------- | ------------------------------------------------------------------------------------ |
| Me                | `GET /api/me`                                                                        |
| OPD               | `GET/POST /api/opd`, `GET/PUT/DELETE /api/opd/:id`                                   |
| Jabatan           | `GET/POST /api/jabatan`, `GET/PUT/DELETE /api/jabatan/:id`                           |
| Pejabat           | `GET/POST /api/pejabat`, `GET/PUT/DELETE /api/pejabat/:id`                           |
| Struktur          | `GET /api/struktur/:opdId`, `POST/PUT/DELETE /api/struktur`                          |
| ABK Aktivitas     | `GET/POST /api/abk/aktivitas`, `GET/PUT/DELETE /api/abk/aktivitas/:id`               |
| ABK Perhitungan   | `GET /api/abk/perhitungan`, `POST /api/abk/perhitungan/calc`                         |
| ABK Laporan       | `GET/POST /api/abk/laporan`, `GET/PUT /api/abk/laporan/:id`                          |
| Anjab Dokumen     | `GET/POST /api/anjab/dokumen`, `PUT/DELETE /api/anjab/dokumen/:id`, submit & approve |
| Anjab Spesifikasi | `GET/PUT /api/anjab/spesifikasi/:jabatanId`                                          |
| Anjab Uraian      | `GET/PUT /api/anjab/uraian/:jabatanId`                                               |
| SAKIP             | `GET/PUT /api/sakip/nilai`, `GET/POST/DELETE /api/sakip/dokumen`                     |
| Dashboard         | `GET /api/dashboard/summary`, `GET /api/laporan/rekap-opd`                           |
| Admin             | Manajemen users & roles                                                              |

---

## Deployment dengan Docker

### Build & Run Backend

```bash
cd be
docker build -t sikelembagaan-be .
docker run -d \
  --name sikelembagaan-be \
  -p 1323:1323 \
  --env-file .env \
  sikelembagaan-be
```

### Build Frontend (Production)

```bash
cd fe
npm run build
npm start
```

---

## Panduan Kontribusi

1. **Fork** repository ini
2. Buat branch fitur baru: `git checkout -b feat/nama-fitur`
3. Commit perubahan: `git commit -m "feat: deskripsi singkat"`
4. Push ke branch: `git push origin feat/nama-fitur`
5. Buat **Pull Request** ke branch `main`

### Konvensi Commit

Gunakan format [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: menambahkan ekspor laporan ABK ke PDF
fix: perbaikan validasi form spesifikasi jabatan
refactor: reorganisasi store query jabatan
docs: update README setup instructions
```

### Struktur Branch

| Branch   | Deskripsi               |
| -------- | ----------------------- |
| `main`   | Production-ready code   |
| `dev`    | Development & integrasi |
| `feat/*` | Fitur baru              |
| `fix/*`  | Bug fix                 |

---

## Variabel Lingkungan — Referensi Lengkap

### Backend (`be/.env`)

| Variabel                   | Wajib | Default                                    | Deskripsi                                   |
| -------------------------- | ----- | ------------------------------------------ | ------------------------------------------- |
| `PORT`                     | —     | `1323`                                     | Port server HTTP                            |
| `JWT_SECRET`               | ✅    | —                                          | Secret key untuk signing JWT                |
| `NOTES_ENCRYPT_KEY`        | ✅    | —                                          | Kunci enkripsi data sensitif                |
| `GOOGLE_CLIENT_ID`         | —     | —                                          | Client ID Google OAuth                      |
| `DB_DRIVER`                | —     | `mysql`                                    | Driver database                             |
| `DB_HOST`                  | —     | `127.0.0.1`                                | Host MySQL                                  |
| `DB_PORT`                  | —     | `3306`                                     | Port MySQL                                  |
| `DB_NAME`                  | ✅    | —                                          | Nama database                               |
| `DB_USER`                  | ✅    | —                                          | Username database                           |
| `DB_PASSWORD`              | —     | —                                          | Password database                           |
| `DB_PARAMS`                | —     | `parseTime=true&charset=utf8mb4&loc=Local` | Parameter koneksi MySQL                     |
| `DB_DSN`                   | ✅\*  | —                                          | DSN lengkap (hanya untuk non-MySQL driver)  |
| `ALLOWED_FRONTEND_ORIGINS` | —     | `http://localhost:4321`                    | Origin yang diizinkan CORS (koma-separated) |

### Frontend (`fe/.env.local`)

| Variabel              | Wajib | Deskripsi            |
| --------------------- | ----- | -------------------- |
| `NEXT_PUBLIC_API_URL` | ✅    | Base URL backend API |

---

## Lisensi

Proyek ini dikembangkan untuk keperluan internal pemerintah daerah.
