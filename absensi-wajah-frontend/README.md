# Absensi Wajah - Frontend

Aplikasi frontend sistem absensi berbasis pengenalan wajah, dibangun dengan React 19 dan Vite.

## Tech Stack

- **React** 19 + **Vite** 7
- **React Router DOM** 7 - Routing SPA
- **face-api.js** - Deteksi dan pengenalan wajah di browser
- **react-webcam** - Akses kamera
- **Leaflet** + **react-leaflet** - Visualisasi peta lokasi absensi
- **Axios** - HTTP client

## Instalasi

```bash
cd absensi-wajah-frontend

# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

Dev server berjalan di `http://localhost:5173`.

## Build Production

```bash
npm run build
npm run preview
```

## Halaman

### Karyawan

| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/` | Login | Halaman login |
| `/attendance` | Absensi | Clock-in/clock-out dengan verifikasi wajah, GPS, dan tampilan peta |
| `/face-register` | Daftar Wajah | Registrasi embedding wajah via webcam |
| `/history` | Riwayat Absensi | Riwayat absensi bulanan user |
| `/leave` | Pengajuan Izin | Form pengajuan izin |

### Admin

| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/admin/dashboard` | Dashboard | Summary statistik (total karyawan, hadir, izin) |
| `/admin/users` | Manajemen User | Tambah, edit, hapus user |
| `/admin/shifts` | Manajemen Shift | CRUD shift kerja |
| `/admin/locations` | Manajemen Lokasi | CRUD lokasi dengan peta interaktif (klik untuk pilih koordinat) |
| `/admin/leave` | Persetujuan Izin | Approve/reject pengajuan izin |
| `/admin/report` | Laporan Absensi | Laporan global berdasarkan rentang tanggal |

## Fitur Utama

### Absensi (`/attendance`)
- Verifikasi wajah real-time via webcam menggunakan face-api.js
- Verifikasi lokasi GPS (harus dalam radius lokasi yang diizinkan)
- Peta Leaflet menampilkan posisi user (marker biru) dan lokasi absensi (marker merah + radius)
- Blokir absensi jika admin belum menyimpan lokasi

### Manajemen Lokasi (`/admin/locations`)
- Peta interaktif untuk memilih koordinat (klik pada peta)
- Preview radius lokasi baru (hijau) dan lokasi tersimpan (merah)
- Tombol "Gunakan Lokasi Saat Ini" untuk GPS otomatis
- Center peta ke lokasi saat edit

## Struktur Direktori

```
src/
  api/
    axios.js              - Konfigurasi Axios instance
  components/
    Navbar.jsx            - Navigasi utama
    PrivateRoute.jsx      - Route guard (auth + admin check)
  lib/
    faceModels.js         - Load & detect face-api.js models
    leafletSetup.js       - Setup Leaflet icon fix untuk Vite
  pages/
    login.jsx             - Halaman login
    Attendance.jsx        - Halaman absensi + peta
    AttendanceHistory.jsx - Riwayat absensi
    FaceRegister.jsx      - Registrasi wajah
    LeaveRequest.jsx      - Pengajuan izin
    admin/
      Dashboard.jsx         - Dashboard admin
      UserManagement.jsx    - CRUD user
      ShiftManagement.jsx   - CRUD shift
      LocationManagement.jsx - CRUD lokasi + peta
      LeaveApproval.jsx     - Approve/reject izin
      AttendanceReport.jsx  - Laporan global
  App.jsx                 - Router & layout
  main.jsx                - Entry point
```

## Konfigurasi

Backend API URL dikonfigurasi di `src/api/axios.js`. Default: `http://localhost:8000/api`.
