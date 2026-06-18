<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ShiftSwap;
use App\Models\Notification;

class ShiftSwapController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if ($user->role === 'admin') {
            return response()->json(ShiftSwap::with(['requester:id,name', 'target:id,name', 'shift:id,name,start_time,end_time'])->orderBy('created_at', 'desc')->get());
        }
        return response()->json(ShiftSwap::with(['requester:id,name', 'target:id,name', 'shift:id,name,start_time,end_time'])
            ->where('requester_id', $user->id)
            ->orWhere('target_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'target_id' => 'required|exists:users,id|different:requester_id',
            'shift_id' => 'required|exists:shift,id',
            'swap_date' => 'required|date|after_or_equal:today',
            'reason' => 'nullable|string|max:500',
        ]);

        $existing = ShiftSwap::where('requester_id', auth()->id())
            ->where('swap_date', $request->swap_date)
            ->whereIn('status', ['pending'])
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Anda sudah memiliki permintaan swap untuk tanggal ini'], 400);
        }

        $swap = ShiftSwap::create([
            'requester_id' => auth()->id(),
            'target_id' => $request->target_id,
            'shift_id' => $request->shift_id,
            'swap_date' => $request->swap_date,
            'reason' => $request->reason,
        ]);

        // Notify target
        $requester = auth()->user();
        Notification::create([
            'user_id' => $request->target_id,
            'type' => 'info',
            'title' => 'Permintaan Swap Shift',
            'message' => "{$requester->name} ingin swap shift dengan Anda pada {$request->swap_date}.",
            'link' => '/shift-swaps',
        ]);

        return response()->json(['message' => 'Permintaan swap shift berhasil dikirim', 'data' => $swap], 201);
    }

    public function approve($id)
    {
        $swap = ShiftSwap::with(['requester', 'shift'])->findOrFail($id);
        if ($swap->target_id !== auth()->id() && auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if ($swap->status !== 'pending') {
            return response()->json(['message' => 'Permintaan sudah diproses'], 400);
        }

        $swap->update(['status' => 'approved', 'approved_at' => now()]);

        Notification::create([
            'user_id' => $swap->requester_id,
            'type' => 'success',
            'title' => 'Swap Shift Disetujui',
            'message' => "Permintaan swap shift Anda dengan {$swap->target->name} pada {$swap->swap_date} telah disetujui.",
            'link' => '/shift-swaps',
        ]);

        return response()->json(['message' => 'Swap shift disetujui', 'data' => $swap]);
    }

    public function reject(Request $request, $id)
    {
        $swap = ShiftSwap::with(['requester', 'shift'])->findOrFail($id);
        if ($swap->target_id !== auth()->id() && auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if ($swap->status !== 'pending') {
            return response()->json(['message' => 'Permintaan sudah diproses'], 400);
        }

        $request->validate(['reason' => 'nullable|string|max:500']);
        $swap->update(['status' => 'rejected']);

        Notification::create([
            'user_id' => $swap->requester_id,
            'type' => 'error',
            'title' => 'Swap Shift Ditolak',
            'message' => "Permintaan swap shift Anda dengan {$swap->target->name} pada {$swap->swap_date} ditolak." . ($request->reason ? " Alasan: {$request->reason}" : ''),
            'link' => '/shift-swaps',
        ]);

        return response()->json(['message' => 'Swap shift ditolak', 'data' => $swap]);
    }

    public function destroy($id)
    {
        $swap = ShiftSwap::findOrFail($id);
        if ($swap->requester_id !== auth()->id() && auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $swap->delete();
        return response()->json(['message' => 'Permintaan swap shift dihapus']);
    }
}
