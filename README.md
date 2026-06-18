# Web Absensi — Sistem Absensi Berbasis Pengenalan Wajah

Sistem absensi karyawan berbasis web dengan **pengenalan wajah (face recognition)** dan **verifikasi lokasi GPS**. Backend menggunakan Laravel 12, frontend React 19. Dirancang untuk akurasi, efisiensi, dan transparansi dalam manajemen kehadiran.

---

## 🚀 Demo

| Akun | Role | Email | Password |
|------|------|-------|----------|
| **Budi Santoso** | Admin | `budi@example.com` | `budi1234` |
| **Siti Aminah** | Karyawan | `siti@example.com` | `siti1234` |
| **Andi Wijaya** | Karyawan | `andi@example.com` | `andi1234` |

Di halaman login, klik tombol **"Admin"** atau **"Karyawan"** untuk auto-fill email & password.

---

## ✨ Fitur Lengkap

### 🔐 Autentikasi & Keamanan
- Login dengan token Sanctum
- Registrasi (dengan role & ID karyawan)
- Lupa password dengan pertanyaan keamanan
- Ubah profil & password
- Upload foto profil

### 📸 Absensi dengan Face Recognition
- Clock-in & clock-out dengan **verifikasi wajah** via webcam (face-api.js)
- Verifikasi **lokasi GPS** (harus dalam radius lokasi yang ditentukan)
- Peta interaktif Leaflet — posisi user (biru) vs lokasi absensi (merah + radius)
- Hanya 1x clock-in per hari per user
- Status otomatis: **Tepat Waktu** / **Terlambat** berdasarkan shift

### 👥 Manajemen Karyawan & Role
- **Admin** — akses penuh ke semua fitur manajemen
- **Karyawan** — absensi, izin, riwayat, swap shift
- CRUD user oleh admin
- Setiap user memiliki ID karyawan unik

### 🕐 Manajemen Shift
- CRUD shift (Pagi `08:00-16:00`, Siang `13:00-21:00`, Malam `20:00-04:00`)
- Karyawan memilih shift saat clock-in
- **Swap Shift** — tukar jadwal dengan karyawan lain, perlu persetujuan

### 📍 Manajemen Lokasi
- Admin menambahkan lokasi absensi dengan **koordinat GPS** via peta interaktif
- Atur **radius** lokasi (meter)
- Bisa pakai GPS otomatis atau klik peta
- Wajib ada minimal 1 lokasi agar karyawan bisa absensi

### 📋 Pengajuan Izin
- Izin: Cuti, Sakit, atau alasan lain
- Approval flow: admin setujui / tolak
- Riwayat pengajuan per user

### ⏰ Lembur (Overtime)
- Clock-out otomatis mendeteksi durasi lembur
- Admin approve / reject lembur
- Tracking durasi lembur per hari

### 🛑 Break Tracking
- Clock-in setelah clock-in (istirahat)
- Admin bisa pantau durasi break

### 📊 Laporan & Dashboard
- Dashboard admin: total karyawan, hadir hari ini, izin, grafik
- Laporan per-user (bulanan) — filter bulan & tahun
- Laporan global (rentang tanggal)
- **Ekspor** ke Excel (.xlsx) dan CSV
- **Kalender absensi** — lihat kehadiran dalam tampilan kalender per bulan
- Statistik: Hadir, Terlambat, Tidak Hadir

### 🔔 Notifikasi & Pengumuman
- Notifikasi real-time: izin baru, approval, lembur, dll.
- Tandai sudah dibaca / semua dibaca
- **Pengumuman** dari admin (dengan prioritas: Biasa / Normal / Penting / Urgent)

### 📧 Pengaturan Email (SMTP)
- Konfigurasi SMTP dari panel admin
- Kirim notifikasi email untuk izin, approval, dll.

### 📱 Profil & Akun
- Edit nama & email
- Ubah password
- Upload foto profil
- Atur **pertanyaan keamanan** untuk reset password
- Lihat info akun (ID karyawan, status, tanggal bergabung)

### 🔄 Export Data
- Ekspor laporan ke **Excel** (.xlsx)
- Ekspor laporan ke **CSV**

---

## 🛠️ Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| **Backend** | PHP 8.2+, Laravel 12, Laravel Sanctum |
| **Frontend** | React 19, Vite 7, React Router DOM 7 |
| **Face Recognition** | face-api.js (SSD Mobilenet + Face Landmark + Face Recognition) |
| **Maps** | Leaflet, react-leaflet, OpenStreetMap |
| **Database** | MySQL / PostgreSQL / SQLite |
| **HTTP Client** | Axios |
| **Icons** | react-icons (Feather) |
| **CSS** | Tailwind CSS via CDN / utility classes |

---

## 📁 Struktur Project

```
web-absensi/
├── absensi-web-app/           # Backend — Laravel REST API
│   ├── api/index.php          # Entry point Vercel serverless
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   ├── LogAbsensi.php       # Clock-in/out, overtime
│   │   │   ├── UserController.php
│   │   │   ├── ShiftController.php
│   │   │   ├── LocationController.php
│   │   │   ├── IzinController.php
│   │   │   ├── ReportController.php
│   │   │   ├── ProfileController.php
│   │   │   ├── NotificationController.php
│   │   │   ├── BreakController.php
│   │   │   ├── ShiftSwapController.php
│   │   │   ├── ExportController.php
│   │   │   └── EmailConfigController.php
│   │   ├── Middleware/AdminMiddleware.php
│   │   └── Models/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   │       └── DatabaseSeeder.php   # Akun demo & data awal
│   ├── routes/api.php
│   └── composer.json
│
├── absensi-wajah-frontend/    # Frontend — React SPA
│   ├── src/
│   │   ├── App.jsx            # Router utama
│   │   ├── api/axios.js       # Axios instance + interceptor
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── Toast.jsx
│   │   ├── lib/
│   │   │   ├── faceModels.js
│   │   │   ├── leafletSetup.js
│   │   │   └── ThemeContext.jsx
│   │   └── pages/
│   │       ├── login.jsx           # + tombol akun demo
│   │       ├── Attendance.jsx      # Absensi + peta
│   │       ├── AttendanceHistory.jsx
│   │       ├── AttendanceCalendar.jsx
│   │       ├── FaceRegister.jsx
│   │       ├── LeaveRequest.jsx
│   │       ├── ShiftSwap.jsx
│   │       ├── Profile.jsx
│   │       ├── Notifications.jsx
│   │       ├── ForgotPassword.jsx
│   │       ├── Landing.jsx
│   │       ├── Tentang.jsx
│   │       └── admin/
│   │           ├── Dashboard.jsx
│   │           ├── UserManagement.jsx
│   │           ├── ShiftManagement.jsx
│   │           ├── LocationManagement.jsx
│   │           ├── LeaveApproval.jsx
│   │           ├── AttendanceReport.jsx
│   │           ├── OvertimeApproval.jsx
│   │           └── EmailSettings.jsx
│   └── public/models/         # face-api.js model files
│
└── README.md
```

---

## 📄 Halaman & Route

### Landing & Publik (tanpa login)

| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/` | Landing | Beranda dengan fitur, cara kerja, CTA |
| `/login` | Login | Form login + tombol akun demo |
| `/tentang` | Tentang | Informasi tentang aplikasi |
| `/forgot-password` | Lupa Password | Reset password via pertanyaan keamanan |

### Karyawan (role: `karyawan`)

| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/attendance` | Absensi | Clock-in/out + verifikasi wajah + GPS + peta interaktif |
| `/face-register` | Daftar Wajah | Registrasi embedding wajah via webcam (wajib sekali) |
| `/history` | Riwayat Absensi | Riwayat bulanan — filter bulan & tahun |
| `/calendar` | Kalender Absensi | Tampilan kalender kehadiran per bulan |
| `/leave` | Pengajuan Izin | Ajukan cuti, sakit, atau izin lain |
| `/shift-swaps` | Swap Shift | Tukar shift dengan karyawan lain |
| `/notifications` | Notifikasi | Notifikasi & pengumuman dari admin |
| `/profile` | Profil | Edit profil, upload foto, ubah password, atur pertanyaan keamanan |

### Admin (role: `admin`)

| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/admin/dashboard` | Dashboard | Statistik: total karyawan, hadir hari ini, izin, grafik |
| `/admin/users` | Manajemen User | CRUD user (tambah, edit, hapus) |
| `/admin/shifts` | Manajemen Shift | CRUD shift kerja |
| `/admin/locations` | Manajemen Lokasi | CRUD lokasi + radius + peta interaktif (klik untuk pilih koordinat) |
| `/admin/leave` | Persetujuan Izin | Approve / reject pengajuan izin |
| `/admin/report` | Laporan Absensi | Laporan global + filter tanggal + ekspor Excel/CSV |
| `/admin/overtime` | Persetujuan Lembur | Approve / reject lembur karyawan |
| `/admin/email` | Pengaturan Email | Konfigurasi SMTP untuk notifikasi email |

---

## 🧪 Instalasi & Menjalankan

### Prasyarat
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL / PostgreSQL / SQLite

### 1. Backend (Laravel)

```bash
cd absensi-web-app

# Install dependencies
composer install

# Copy environment
cp .env.example .env

# Generate app key
php artisan key:generate

# Konfigurasi database di .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=absensi
DB_USERNAME=root
DB_PASSWORD=

# Jalankan migrasi + seeder (untuk akun demo & data awal)
php artisan migrate --seed

# (Opsional) Buat storage link
php artisan storage:link

# Jalankan development server
php artisan serve
```

Backend berjalan di `http://localhost:8000`.

### 2. Frontend (React)

```bash
cd absensi-wajah-frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Frontend berjalan di `http://localhost:5173`.

> **Catatan:** URL API backend dikonfigurasi di `absensi-wajah-frontend/src/api/axios.js`. Default: `http://localhost:8000/api`.

---

## ☁️ Deployment di Vercel

### Backend (api/index.php)

Project sudah dikonfigurasi untuk Vercel serverless PHP (`vercel-php@0.7.1`).

```bash
cd absensi-web-app

# Pastikan sudah push ke GitHub
git add .
git commit -m "deskripsi perubahan"
git push

# Hubungkan repo ke Vercel dan deploy
# Framework preset: Other
# Root directory: absensi-web-app
```

**Environment variables yang perlu di-set di Vercel:**
- `APP_KEY` — hasil dari `php artisan key:generate`
- `APP_ENV` — `production`
- `APP_DEBUG` — `false`
- `DB_CONNECTION` — sesuaikan dengan database (contoh: `d1_database` untuk Cloudflare D1, atau gunakan layanan eksternal seperti Turso/PlanetScale)
- `APP_PACKAGES_CACHE` — `/tmp/bootstrap/cache/packages.php` (alternatif jika `useBootstrapPath` belum bekerja)

### Frontend

```bash
cd absensi-wajah-frontend

# Build production
npm run build

# Deploy ke Vercel
# Root directory: absensi-wajah-frontend
# Framework preset: Vite
```

**Environment variables:**
- `VITE_API_URL` — URL backend API (contoh: `https://absensi-api.vercel.app/api`)

---

## 🔄 Alur Penggunaan

### Admin — Setup Awal
1. Login sebagai admin (`budi@example.com` / `budi1234`)
2. **Manajemen Lokasi** → tambah lokasi absensi dengan radius (wajib!)
3. **Manajemen Shift** → tambah shift kerja (Pagi, Siang, Malam)
4. **Manajemen User** → tambah user karyawan
5. Pantau absensi di **Dashboard** & **Laporan Absensi**

### Karyawan — Absensi Harian
1. Login sebagai karyawan (`siti@example.com` / `siti1234`)
2. **Daftar Wajah** → registrasi wajah via webcam (cukup 1x)
3. **Absensi** → clock-in: verifikasi wajah + GPS otomatis
4. **Riwayat Absensi** / **Kalender** → lihat riwayat kehadiran
5. **Pengajuan Izin** → jika absen karena sakit/cuti

### Fitur Lainnya
- **Swap Shift**: Karyawan bisa mengajukan tukar shift dengan rekan kerja, perlu persetujuan
- **Lembur**: Sistem otomatis mendeteksi lembur, admin approve via panel
- **Notifikasi**: Notifikasi untuk izin baru, approval, dll.
- **Export**: Admin bisa export laporan ke Excel/CSV

---

## 📋 Aturan Bisnis

| Aturan | Keterangan |
|--------|-----------|
| **Lokasi wajib** | Admin harus menyimpan ≥ 1 lokasi absensi sebelum karyawan bisa clock-in/out |
| **Registrasi wajah** | Karyawan harus daftarkan wajah sebelum absensi |
| **Verifikasi GPS** | Karyawan harus berada dalam radius lokasi terdaftar |
| **1x per hari** | Clock-in hanya 1x per hari per user |
| **Status otomatis** | **Tepat Waktu** jika clock-in ≤ start_time shift, **Terlambat** jika > start_time |
| **Lembur otomatis** | Clock-out setelah end_time shift otomatis dihitung sebagai lembur |
| **Break** | Hanya bisa mulai break setelah clock-in |

---

## 📡 API Endpoints

### Public

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/login` | Login (body: email, password, device_name) |
| POST | `/api/register` | Register |
| POST | `/api/forgot-password/get-question` | Ambil pertanyaan keamanan |
| POST | `/api/forgot-password/reset` | Reset password dengan jawaban keamanan |

### Authenticated (Bearer Token)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/users/me` | Data user login |
| GET | `/api/users/faces` | Semua face embedding |
| PUT | `/api/users/faces` | Update face embedding |
| GET | `/api/shifts` | Daftar shift |
| POST | `/api/clock-in` | Clock in (latitude, longitude, shift_id) |
| POST | `/api/clock-out` | Clock out (latitude, longitude) |
| POST | `/api/logout` | Logout |
| GET | `/api/izin/me` | Izin milik user |
| GET | `/api/izin` | Semua izin |
| POST | `/api/izin` | Ajukan izin |
| GET | `/api/report/dashboard` | Summary dashboard |
| GET | `/api/report/user/{id}` | Laporan bulanan user (`?month=&year=`) |
| GET | `/api/report/global` | Laporan global (`?start_date=&end_date=`) |
| GET | `/api/report/charts` | Data grafik dashboard |
| GET | `/api/locations` | Daftar lokasi absensi |
| POST | `/api/locations/verify` | Verifikasi lokasi (body: latitude, longitude) |
| GET | `/api/profile` | Profil detail |
| PUT | `/api/profile` | Update profil |
| POST | `/api/profile/photo` | Upload foto profil |
| PUT | `/api/profile/password` | Ubah password |
| GET | `/api/notifications` | Notifikasi user |
| PUT | `/api/notifications/{id}/read` | Tandai dibaca |
| PUT | `/api/notifications/read-all` | Tandai semua dibaca |
| GET | `/api/announcements` | Daftar pengumuman |
| GET | `/api/export/excel` | Export Excel |
| GET | `/api/export/csv` | Export CSV |
| POST | `/api/break/start` | Mulai break |
| POST | `/api/break/end` | Akhiri break |
| GET | `/api/break/status` | Status break |
| GET | `/api/shift-swaps` | Daftar swap shift |
| POST | `/api/shift-swaps` | Ajukan swap shift |
| PUT | `/api/shift-swaps/{id}/approve` | Setujui swap |
| POST | `/api/shift-swaps/{id}/reject` | Tolak swap |
| DELETE | `/api/shift-swaps/{id}` | Hapus permintaan swap |

### Admin Only

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/admin/users` | Daftar semua user |
| POST | `/api/admin/users` | Tambah user |
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
| POST | `/api/admin/announcements` | Buat pengumuman |
| DELETE | `/api/admin/announcements/{id}` | Hapus pengumuman |
| GET | `/api/admin/overtime/pending` | Lembur pending |
| PUT | `/api/admin/overtime/{id}/approve` | Approve lembur |
| PUT | `/api/admin/overtime/{id}/reject` | Reject lembur |
| GET | `/api/admin/email-settings` | Lihat pengaturan email |
| PUT | `/api/admin/email-settings` | Update pengaturan email |

---

## 📦 Data Awal (Seeder)

Menjalankan `php artisan migrate --seed` akan membuat:

- **3 user** (1 admin, 2 karyawan) — lihat tabel akun di atas
- **3 shift** (Pagi `08:00-16:00`, Siang `13:00-21:00`, Malam `20:00-04:00`)
- **3 log absensi** sample untuk tanggal 2023-03-01
- **2 izin** sample (Cuti disetujui, Sakit disetujui)
