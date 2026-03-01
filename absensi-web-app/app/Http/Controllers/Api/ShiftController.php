<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Shift;

class ShiftController extends Controller
{
    public function index(){
        return response()->json(Shift::all());
    }

    public function store(Request $request){
        $request->validate([
            'name' => 'required|string',
            'start_time' => 'required',
            'end_time' => 'required',
        ]);

        $shift = Shift::create($request->only(['name', 'start_time', 'end_time']));

        return response()->json([
            'message' => 'Shift created successfully',
            'data' => $shift
        ], 201);
    }

    public function update(Request $request, $id){
        $shift = Shift::findOrFail($id);
        $shift->update($request->only(['name', 'start_time', 'end_time']));

        return response()->json([
            'message' => 'Shift updated successfully',
            'data' => $shift
        ]);
    }

    public function destroy($id){
        $shift = Shift::findOrFail($id);
        $shift->delete();

        return response()->json(['message' => 'Shift deleted successfully']);
    }
}
