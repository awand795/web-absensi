<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Log_Absensi;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Izin;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function dashboardSummary(){
        $today = Carbon::now()->toDateString();

        return response()->json([
            'total_karyawan' => User::count(),
            'hadir_hari_ini' => Log_Absensi::where('date', $today)->count(),
            'izin_hari_ini' => Izin::where('tanggal_mulai', '<=', $today)
                                    ->where('tanggal_selesai', '>=', $today)
                                    ->count(),
        ], 200);
    }

    public function userMonthlyReport(Request $request, $user_id){
        $month = $request->query('month', Carbon::now()->month);
        $year = $request->query('year', Carbon::now()->year);

        $reports = Log_Absensi::where('user_id', $user_id)
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->orderBy('date', 'asc')
            ->get();

        return response()->json([
            'user' => User::find($user_id),
            'reports' => $reports,
            'month' => $month,
            'year' => $year
        ], 200);
    }

    public function globalReport(Request $request){
        $startDate = $request->query('start_date', Carbon::now()->toDateString());
        $endDate = $request->query('end_date', Carbon::now()->toDateString());

        $reports = User::with(['logAbsensi' => function($query) use ($startDate, $endDate){
            $query->whereBetween('date', [$startDate, $endDate]);
        }])->get();

        return response()->json([
            'reports' => $reports
        ], 200);
    }

    public function chartsData(Request $request)
    {
        $year = $request->query('year', Carbon::now()->year);

        // Monthly attendance count for the year
        $monthlyAttendance = Log_Absensi::select(
            DB::raw('MONTH(date) as month'),
            DB::raw('COUNT(*) as total'),
            DB::raw("SUM(CASE WHEN status = 'Tepat Waktu' THEN 1 ELSE 0 END) as tepat_waktu"),
            DB::raw("SUM(CASE WHEN status = 'Terlambat' THEN 1 ELSE 0 END) as terlambat")
        )
        ->whereYear('date', $year)
        ->groupBy(DB::raw('MONTH(date)'))
        ->orderBy(DB::raw('MONTH(date)'))
        ->get();

        // Today's status distribution
        $today = Carbon::now()->toDateString();
        $todayStatus = Log_Absensi::select('status', DB::raw('COUNT(*) as total'))
            ->where('date', $today)
            ->groupBy('status')
            ->get();

        // Employee with most attendance this month
        $month = Carbon::now()->month;
        $topEmployees = Log_Absensi::select('user_id', DB::raw('COUNT(*) as total'))
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->groupBy('user_id')
            ->orderBy('total', 'desc')
            ->take(5)
            ->with('user:id,name')
            ->get()
            ->map(fn($item) => [
                'name' => optional($item->user)->name ?? 'Unknown',
                'total' => $item->total,
            ]);

        // Shift distribution
        $shiftDistribution = Log_Absensi::select('shift_id', DB::raw('COUNT(*) as total'))
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->groupBy('shift_id')
            ->with('shift:id,name')
            ->get()
            ->map(fn($item) => [
                'name' => optional($item->shift)->name ?? 'Unknown',
                'total' => $item->total,
            ]);

        return response()->json([
            'monthly_attendance' => $monthlyAttendance,
            'today_status' => $todayStatus,
            'top_employees' => $topEmployees,
            'shift_distribution' => $shiftDistribution,
        ]);
    }
}
