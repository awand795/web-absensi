<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Log_Absensi;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ExportController extends Controller
{
    public function exportExcel(Request $request)
    {
        $month = $request->query('month', Carbon::now()->month);
        $year = $request->query('year', Carbon::now()->year);

        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Laporan Absensi');

        // Headers
        $headers = ['No', 'Nama', 'ID Karyawan', 'Tanggal', 'Clock In', 'Clock Out', 'Status', 'Lembur (menit)'];
        foreach (range(0, count($headers) - 1) as $col) {
            $sheet->setCellValue(chr(65 + $col) . '1', $headers[$col]);
        }

        // Style headers
        $headerStyle = [
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'startColor' => ['rgb' => 'D45A4A']],
        ];
        $sheet->getStyle('A1:H1')->applyFromArray($headerStyle);

        // Data
        $user = auth()->user();
        $query = Log_Absensi::with('user');

        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        $records = $query->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->orderBy('date', 'asc')
            ->get();

        $row = 2;
        $no = 1;
        foreach ($records as $rec) {
            $sheet->setCellValue('A' . $row, $no);
            $sheet->setCellValue('B' . $row, $rec->user->name ?? '-');
            $sheet->setCellValue('C' . $row, $rec->user->id_karyawan ?? '-');
            $sheet->setCellValue('D' . $row, $rec->date);
            $sheet->setCellValue('E' . $row, $rec->clock_in ? Carbon::parse($rec->clock_in)->format('H:i:s') : '-');
            $sheet->setCellValue('F' . $row, $rec->clock_out ? Carbon::parse($rec->clock_out)->format('H:i:s') : '-');
            $sheet->setCellValue('G' . $row, $rec->status);
            $sheet->setCellValue('H' . $row, $rec->overtime_minutes ?? 0);
            $row++;
            $no++;
        }

        // Auto width
        foreach (range('A', 'H') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $filename = "laporan-absensi-{$month}-{$year}.xlsx";

        ob_start();
        $writer->save('php://output');
        $content = ob_get_clean();

        return response($content)
            ->header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            ->header('Content-Disposition', "attachment; filename=\"$filename\"");
    }

    public function exportCsv(Request $request)
    {
        $month = $request->query('month', Carbon::now()->month);
        $year = $request->query('year', Carbon::now()->year);

        $user = auth()->user();
        $query = Log_Absensi::with('user');

        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        $records = $query->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->orderBy('date', 'asc')
            ->get();

        $headers = ['No', 'Nama', 'ID Karyawan', 'Tanggal', 'Clock In', 'Clock Out', 'Status', 'Lembur (menit)'];
        $filename = "laporan-absensi-{$month}-{$year}.csv";

        $callback = function() use ($headers, $records) {
            $file = fopen('php://output', 'w');
            fputs($file, "\xEF\xBB\xBF"); // BOM for Excel
            fputcsv($file, $headers);
            $no = 1;
            foreach ($records as $rec) {
                fputcsv($file, [
                    $no,
                    $rec->user->name ?? '-',
                    $rec->user->id_karyawan ?? '-',
                    $rec->date,
                    $rec->clock_in ? Carbon::parse($rec->clock_in)->format('H:i:s') : '-',
                    $rec->clock_out ? Carbon::parse($rec->clock_out)->format('H:i:s') : '-',
                    $rec->status,
                    $rec->overtime_minutes ?? 0,
                ]);
                $no++;
            }
            fclose($file);
        };

        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ]);
    }
}
