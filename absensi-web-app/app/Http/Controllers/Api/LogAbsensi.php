<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Log_Absensi;
use App\Models\Location;
use App\Models\UserFace;
use Carbon\Carbon;
use App\Models\Shift;

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

        $logabsen->clock_out = Carbon::now()->toDateTimeString();
        $logabsen->save();

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
