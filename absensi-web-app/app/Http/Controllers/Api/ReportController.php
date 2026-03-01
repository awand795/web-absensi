<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Log_Absensi;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Izin;

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
}
