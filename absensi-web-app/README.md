# Absensi Web App - Backend API

REST API backend untuk sistem absensi berbasis pengenalan wajah, dibangun dengan Laravel 12.

## Tech Stack

- **PHP** >= 8.2
- **Laravel** 12
- **Laravel Sanctum** - Autentikasi token-based
- **MySQL / SQLite** - Database

## Instalasi

```bash
cd absensi-web-app

# Install dependencies
composer install

# Copy file environment
cp .env.example .env

# Generate app key
php artisan key:generate

# Konfigurasi database di .env, lalu jalankan migrasi
php artisan migrate

# Jalankan server
php artisan serve
```

Server berjalan di `http://localhost:8000`.

## Fitur

- **Autentikasi** - Login, register, logout (Sanctum token)
- **Absensi** - Clock-in/clock-out dengan verifikasi lokasi GPS dan pengenalan wajah
- **Manajemen Lokasi** - CRUD lokasi absensi dengan radius (wajib ada minimal 1 lokasi untuk absensi)
- **Manajemen User** - CRUD user oleh admin (tambah, edit, hapus)
- **Manajemen Shift** - CRUD shift kerja
- **Pengajuan Izin** - Karyawan ajukan izin, admin approve/reject
- **Laporan** - Laporan absensi per-user (bulanan) dan global (rentang tanggal)
- **Face Embedding** - Simpan dan ambil data embedding wajah untuk verifikasi

## API Endpoints

### Public

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/login` | Login |
| POST | `/api/register` | Register |

### Authenticated (Bearer Token)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/users/me` | Data user yang login |
| GET | `/api/users/faces` | Semua face embedding |
| PUT | `/api/users/faces` | Update face embedding user |
| GET | `/api/shifts` | Daftar shift |
| POST | `/api/clock-in` | Clock in (wajib latitude, longitude, shift_id) |
| POST | `/api/clock-out` | Clock out (wajib latitude, longitude) |
| POST | `/api/logout` | Logout |
| GET | `/api/izin/me` | Izin milik user |
| GET | `/api/izin` | Semua izin |
| POST | `/api/izin` | Ajukan izin |
| GET | `/api/report/dashboard` | Summary dashboard |
| GET | `/api/report/user/{id}` | Laporan bulanan user (`?month=&year=`) |
| GET | `/api/report/global` | Laporan global (`?start_date=&end_date=`) |
| GET | `/api/locations` | Daftar lokasi absensi |

### Admin Only

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/admin/users` | Daftar semua user |
| POST | `/api/admin/users` | Tambah user baru |
| PUT | `/api/admin/users/{id}` | Edit user |
| DELETE | `/api/admin/users/{id}` | Hapus user |
| POST | `/api/admin/shifts` | Tambah shift |
| PUT | `/api/admin/shifts/{id}` | Edit shift |
| DELETE | `/api/admin/shifts/{id}` | Hapus shift |
| PUT | `/api/admin/izin/{id}/approve` | Approve izin |
| PUT | `/api/admin/izin/{id}/reject` | Reject izin |
| POST | `/api/admin/locations` | Tambah lokasi |
| PUT | `/api/admin/locations/{id}` | Edit lokasi |
| DELETE | `/api/admin/locations/{id}` | Hapus lokasi |

## Aturan Bisnis

- **Lokasi wajib** - Clock-in/clock-out gagal jika admin belum menyimpan lokasi absensi
- **Verifikasi GPS** - User harus berada dalam radius lokasi yang terdaftar
- **Wajah wajib** - User harus sudah mendaftarkan wajah sebelum absensi
- **1x per hari** - Clock-in hanya bisa 1x per hari per user
- **Status otomatis** - Tepat Waktu / Terlambat berdasarkan waktu shift

## Struktur Direktori

```
app/Http/Controllers/Api/
  AuthController.php      - Login, register, logout
  LogAbsensi.php          - Clock-in, clock-out
  UserController.php      - CRUD user, face embedding
  ShiftController.php     - CRUD shift
  LocationController.php  - CRUD lokasi
  IzinController.php      - CRUD izin, approve/reject
  ReportController.php    - Laporan dashboard, user, global
```
