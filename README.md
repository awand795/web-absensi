# Web Absensi - Sistem Absensi Berbasis Pengenalan Wajah

Sistem absensi karyawan berbasis web dengan verifikasi pengenalan wajah dan lokasi GPS. Terdiri dari backend REST API (Laravel) dan frontend SPA (React).

## Fitur Utama

- **Pengenalan Wajah** - Verifikasi identitas karyawan secara real-time via webcam menggunakan face-api.js
- **Verifikasi Lokasi GPS** - Memastikan karyawan berada dalam radius lokasi yang diizinkan saat absensi
- **Peta Interaktif** - Visualisasi posisi user dan lokasi absensi menggunakan Leaflet/OpenStreetMap
- **Clock-in / Clock-out** - Pencatatan waktu masuk dan keluar dengan status otomatis (Tepat Waktu / Terlambat)
- **Manajemen User** - Admin dapat menambah, mengedit, dan menghapus user
- **Manajemen Shift** - Pengaturan shift kerja oleh admin
- **Manajemen Lokasi** - Pengaturan lokasi absensi dengan radius via peta interaktif
- **Pengajuan Izin** - Karyawan mengajukan izin, admin menyetujui/menolak
- **Laporan Absensi** - Riwayat absensi per-user (bulanan) dan laporan global (rentang tanggal)
- **Dashboard Admin** - Ringkasan statistik harian (total karyawan, hadir, izin)

## Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| Backend | PHP 8.2+, Laravel 12, Laravel Sanctum |
| Frontend | React 19, Vite 7, React Router DOM 7 |
| Face Recognition | face-api.js |
| Maps | Leaflet, react-leaflet, OpenStreetMap |
| Database | MySQL / SQLite |
| HTTP Client | Axios |

## Struktur Project

```
Web Absensi/
  absensi-web-app/          # Backend - Laravel REST API
  absensi-wajah-frontend/   # Frontend - React SPA
```

## Instalasi & Menjalankan

### 1. Backend

```bash
cd absensi-web-app

composer install
cp .env.example .env
php artisan key:generate

# Konfigurasi database di .env
php artisan migrate

php artisan serve
```

Backend berjalan di `http://localhost:8000`.

### 2. Frontend

```bash
cd absensi-wajah-frontend

npm install
npm run dev
```

Frontend berjalan di `http://localhost:5173`.

> Pastikan backend sudah berjalan sebelum mengakses frontend. URL API dikonfigurasi di `absensi-wajah-frontend/src/api/axios.js`.

## Alur Penggunaan

### Admin
1. Login sebagai admin
2. Tambah lokasi absensi di **Manajemen Lokasi** (wajib sebelum karyawan bisa absensi)
3. Tambah shift kerja di **Manajemen Shift**
4. Tambah user karyawan di **Manajemen User**
5. Pantau absensi di **Dashboard** dan **Laporan Absensi**
6. Approve/reject pengajuan izin di **Persetujuan Izin**

### Karyawan
1. Login sebagai karyawan
2. Daftarkan wajah di **Daftar Wajah** (wajib sebelum bisa absensi)
3. Lakukan absensi di **Absensi** - sistem akan verifikasi wajah dan lokasi GPS
4. Lihat riwayat di **Riwayat Absensi**
5. Ajukan izin di **Pengajuan Izin** jika diperlukan

## Aturan Bisnis

- Admin **wajib** menyimpan minimal 1 lokasi absensi sebelum karyawan dapat melakukan clock-in/clock-out
- Karyawan **wajib** mendaftarkan wajah sebelum dapat melakukan absensi
- Karyawan harus berada dalam **radius lokasi** yang terdaftar saat absensi
- Clock-in hanya dapat dilakukan **1 kali per hari** per karyawan
- Status absensi ditentukan otomatis: **Tepat Waktu** jika sebelum waktu mulai shift, **Terlambat** jika setelahnya

## Dokumentasi Lanjutan

- [Backend API Documentation](./absensi-web-app/README.md)
- [Frontend Documentation](./absensi-wajah-frontend/README.md)
