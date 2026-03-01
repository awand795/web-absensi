<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Izin as IzinModel;

class IzinController extends Controller
{
    public function store(Request $request){
        $request->validate([
            'jenis_izin' => 'required|string',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
        ]);

        $izin = IzinModel::create([
            'id_karyawan' => auth()->user()->id_karyawan,
            'jenis_izin' => $request->input('jenis_izin'),
            'tanggal_mulai' => $request->input('tanggal_mulai'),
            'tanggal_selesai' => $request->input('tanggal_selesai'),
            'persetujuan' => 'Pending',
        ]);

        return response()->json([
            'message' => 'Izin created successfully',
            'status' => 'success',
            'data' => $izin
        ], 200);
    }

    public function index(){
        $user = auth()->user();
        if ($user->role === 'admin') {
            return response()->json(IzinModel::all());
        }
        return response()->json(IzinModel::where('id_karyawan', $user->id_karyawan)->get());
    }

    public function myIzin(){
        $user = auth()->user();
        return response()->json(IzinModel::where('id_karyawan', $user->id_karyawan)->get());
    }

    public function approve($id){
        $izin = IzinModel::findOrFail($id);
        $izin->update(['persetujuan' => 'Disetujui']);
        return response()->json(['message' => 'Izin disetujui', 'data' => $izin]);
    }

    public function reject($id){
        $izin = IzinModel::findOrFail($id);
        $izin->update(['persetujuan' => 'Ditolak']);
        return response()->json(['message' => 'Izin ditolak', 'data' => $izin]);
    }
}
