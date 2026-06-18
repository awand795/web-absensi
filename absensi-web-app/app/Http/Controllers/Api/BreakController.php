<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Log_Absensi;
use Carbon\Carbon;

class BreakController extends Controller
{
    public function startBreak()
    {
        $user = auth()->user();
        $today = Carbon::now()->toDateString();

        $log = Log_Absensi::where('user_id', $user->id)
            ->where('date', $today)
            ->whereNotNull('clock_in')
            ->first();

        if (!$log) {
            return response()->json(['message' => 'Belum clock-in hari ini'], 400);
        }

        if ($log->break_start && !$log->break_end) {
            return response()->json(['message' => 'Anda sudah memulai istirahat'], 400);
        }

        $log->update(['break_start' => Carbon::now()->toTimeString(), 'break_end' => null]);

        return response()->json(['message' => 'Istirahat dimulai', 'data' => $log]);
    }

    public function endBreak()
    {
        $user = auth()->user();
        $today = Carbon::now()->toDateString();

        $log = Log_Absensi::where('user_id', $user->id)
            ->where('date', $today)
            ->whereNotNull('clock_in')
            ->first();

        if (!$log) {
            return response()->json(['message' => 'Belum clock-in hari ini'], 400);
        }

        if (!$log->break_start) {
            return response()->json(['message' => 'Belum memulai istirahat'], 400);
        }

        if ($log->break_end) {
            return response()->json(['message' => 'Istirahat sudah berakhir'], 400);
        }

        $breakEnd = Carbon::now();
        $breakStart = Carbon::parse($log->break_start);
        $breakMinutes = $breakStart->diffInMinutes($breakEnd);

        $log->update([
            'break_end' => $breakEnd->toTimeString(),
            'break_minutes' => ($log->break_minutes ?? 0) + $breakMinutes,
        ]);

        return response()->json([
            'message' => "Istirahat selesai. Durasi: {$breakMinutes} menit",
            'data' => $log
        ]);
    }

    public function status()
    {
        $user = auth()->user();
        $today = Carbon::now()->toDateString();

        $log = Log_Absensi::where('user_id', $user->id)
            ->where('date', $today)
            ->whereNotNull('clock_in')
            ->first();

        if (!$log) {
            return response()->json(['is_on_break' => false, 'break_minutes' => 0]);
        }

        return response()->json([
            'is_on_break' => $log->break_start && !$log->break_end,
            'break_start' => $log->break_start,
            'break_end' => $log->break_end,
            'break_minutes' => $log->break_minutes ?? 0,
        ]);
    }
}
