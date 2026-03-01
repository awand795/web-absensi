<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Shift;
use App\Models\Log_Absensi;
use App\Models\Izin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create([
            'name' => 'Budi Santoso',
            'id_karyawan' => 'KPW-001',
            'email' => 'budi@example.com',
            'role' => 'admin',
            'password' => 'budi1234',
            'status' => 'aktif'
        ]);

        User::create([
            'name' => 'Siti Aminah',
            'id_karyawan' => 'KPW-002',
            'email' => 'siti@example.com',
            'role' => 'karyawan',
            'password' => 'siti1234',
            'status' => 'aktif'
        ]);

        User::create([
            'name' => 'Andi Wijaya',
            'id_karyawan' => 'KPW-003',
            'email' => 'andi@example.com',
            'role' => 'karyawan',
            'password' => 'andi1234',
            'status' => 'aktif'
        ]);

        Shift::create([
            'id_shift' => 'SFT-001',
            'name' => 'Pagi',
            'start_time' => '08:00:00',
            'end_time' => '16:00:00'
        ]);

        Shift::create([
            'id_shift' => 'SFT-002',
            'name' => 'Siang',
            'start_time' => '13:00:00',
            'end_time' => '21:00:00'
        ]);

        Shift::create([
            'id_shift' => 'SFT-003',
            'name' => 'Malam',
            'start_time' => '20:00:00',
            'end_time' => '04:00:00'
        ]);

        Log_Absensi::create([
            'user_id' => 1,
            'shift_id' => 1,
            'date' => '2023-03-01',
            'clock_in' => '2023-03-01 08:00:00',
            'clock_out' => '2023-03-01 16:00:00',
            'status' => 'Hadir',
        ]);

        Log_Absensi::create([
            'user_id' => 2,
            'shift_id' => 2,
            'date' => '2023-03-01',
            'clock_in' => '2023-03-01 13:00:00',
            'clock_out' => '2023-03-01 21:00:00',
            'status' => 'Hadir',
        ]);

        Log_Absensi::create([
            'user_id' => 3,
            'shift_id' => 3,
            'date' => '2023-03-01',
            'clock_in' => '2023-03-01 20:00:00',
            'clock_out' => '2023-03-02 04:00:00',
            'status' => 'Hadir',
        ]);

        Izin::create([
            'id_karyawan' => 'KPW-001',
            'jenis_izin' => 'Cuti',
            'tanggal_mulai' => '2023-03-01',
            'tanggal_selesai' => '2023-03-02',
            'persetujuan' => 'Disetujui'
        ]);

        Izin::create([
            'id_karyawan' => 'KPW-002',
            'jenis_izin' => 'Sakit',
            'tanggal_mulai' => '2023-03-01',
            'tanggal_selesai' => '2023-03-01',
            'persetujuan' => 'Disetujui'
        ]);
    }
}
