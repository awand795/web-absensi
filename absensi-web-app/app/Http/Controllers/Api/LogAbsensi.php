<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Log_Absensi;
use App\Models\Location;
use App\Models\UserFace;
use Carbon\Carbon;
use App\Models\Shift;
use App\Models\Notification;

class LogAbsensi extends Controller
{
    public function clockIn(Request $request){
        $request->validate([
            'shift_id' => 'required|exists:shift,id',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $user = auth()->user();

        // Cek apakah user sudah daftarkan wajah
        $hasFace = UserFace::where('user_id', $user->id)->exists();
        if (!$hasFace) {
            return response()->json([
                'message' => 'Anda belum mendaftarkan wajah. Silakan daftar wajah terlebih dahulu.',
                'status' => 'error'
            ], 400);
        }

        // Cek apakah ada lokasi yang terdaftar
        $locations = Location::all();
        if ($locations->count() === 0) {
            return response()->json([
                'message' => 'Admin belum menyimpan lokasi absensi. Hubungi admin.',
                'status' => 'error'
            ], 400);
        }

        $now = Carbon::now();
        $today = $now->toDateString();

        $existing = Log_Absensi::where('user_id', $user->id)->where('date', $today)->first();
        if ($existing) {
            return response()->json([
                'message' => 'Already clocked in today',
                'status' => 'error',
                'data' => $existing
            ], 400);
        }

        // Verifikasi lokasi
        $locationId = null;
        $matched = null;
        foreach ($locations as $loc) {
            $distance = $this->haversine(
                $request->input('latitude'), $request->input('longitude'),
                $loc->latitude, $loc->longitude
            );
            if ($distance <= $loc->radius) {
                $matched = $loc;
                break;
            }
        }
        if (!$matched) {
            return response()->json([
                'message' => 'Anda tidak berada di lokasi yang diizinkan',
                'status' => 'error'
            ], 400);
        }
        $locationId = $matched->id;

        $shift = Shift::findOrFail($request->input('shift_id'));
        $status = $now->toTimeString() > $shift->start_time ? 'Terlambat' : 'Tepat Waktu';

        $logabsen = Log_Absensi::create([
            'user_id' => $user->id,
            'shift_id' => $shift->id,
            'date' => $today,
            'clock_in' => $now->toDateTimeString(),
            'status' => $status,
            'image_path' => $request->input('image_path'),
            'latitude' => $request->input('latitude'),
            'longitude' => $request->input('longitude'),
            'location_id' => $locationId,
        ]);

        // Send notification
        Notification::create([
            'user_id' => $user->id,
            'type' => 'success',
            'title' => 'Clock-in Berhasil',
            'message' => "Anda berhasil clock-in pada {$now->format('H:i')} dengan status {$status}.",
            'link' => '/history',
        ]);

        return response()->json([
            'message' => 'Clock in successful',
            'status' => 'success',
            'data' => $logabsen
        ], 200);
    }

    public function clockOut(Request $request){
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $user = auth()->user();

        // Cek apakah user sudah daftarkan wajah
        $hasFace = UserFace::where('user_id', $user->id)->exists();
        if (!$hasFace) {
            return response()->json([
                'message' => 'Anda belum mendaftarkan wajah. Silakan daftar wajah terlebih dahulu.',
                'status' => 'error'
            ], 400);
        }

        // Cek apakah ada lokasi yang terdaftar
        $locations = Location::all();
        if ($locations->count() === 0) {
            return response()->json([
                'message' => 'Admin belum menyimpan lokasi absensi. Hubungi admin.',
                'status' => 'error'
            ], 400);
        }

        $today = Carbon::now()->toDateString();

        $logabsen = Log_Absensi::where('user_id', $user->id)->where('date', $today)->first();

        if (!$logabsen) {
            return response()->json([
                'message' => 'No clock in today',
                'status' => 'error'
            ], 400);
        }

        if ($logabsen->clock_out) {
            return response()->json([
                'message' => 'Already clocked out today',
                'status' => 'error'
            ], 400);
        }

        // Verifikasi lokasi
        $matched = false;
        foreach ($locations as $loc) {
            $distance = $this->haversine(
                $request->input('latitude'), $request->input('longitude'),
                $loc->latitude, $loc->longitude
            );
            if ($distance <= $loc->radius) {
                $matched = true;
                break;
            }
        }
        if (!$matched) {
            return response()->json([
                'message' => 'Anda tidak berada di lokasi yang diizinkan',
                'status' => 'error'
            ], 400);
        }

        $now = Carbon::now();
        $logabsen->clock_out = $now->toDateTimeString();

        // Calculate overtime
        $shift = $logabsen->shift;
        if ($shift) {
            $shiftEnd = Carbon::parse($logabsen->date . ' ' . $shift->end_time);
            // Handle overnight shifts (end_time < start_time)
            if ($shift->end_time < $shift->start_time) {
                $shiftEnd->addDay();
            }
            $clockOutTime = Carbon::parse($logabsen->clock_out);
            if ($clockOutTime > $shiftEnd) {
                $overtimeMinutes = $clockOutTime->diffInMinutes($shiftEnd);
                $logabsen->overtime_minutes = $overtimeMinutes;
            }
        }

        $logabsen->save();

        // Send notification
        $overtimeMsg = $logabsen->overtime_minutes > 0 ? " dengan lembur " . floor($logabsen->overtime_minutes / 60) . "j " . ($logabsen->overtime_minutes % 60) . "m." : ".";
        Notification::create([
            'user_id' => $user->id,
            'type' => 'success',
            'title' => 'Clock-out Berhasil',
            'message' => "Anda berhasil clock-out pada {$now->format('H:i')}{$overtimeMsg}",
            'link' => '/history',
        ]);

        return response()->json([
            'message' => 'Clock out successful',
            'status' => 'success',
            'data' => $logabsen
        ], 200);
    }

    private function haversine($lat1, $lng1, $lat2, $lng2){
        $r = 6371000;
        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);
        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLng / 2) * sin($dLng / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $r * $c;
    }
}
