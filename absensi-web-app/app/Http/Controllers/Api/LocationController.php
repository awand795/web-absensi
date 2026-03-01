<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Location;

class LocationController extends Controller
{
    public function index(){
        return response()->json(Location::all());
    }

    public function store(Request $request){
        $request->validate([
            'name' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'required|integer|min:10',
        ]);

        $location = Location::create($request->only(['name', 'latitude', 'longitude', 'radius']));

        return response()->json([
            'message' => 'Location created successfully',
            'data' => $location
        ], 201);
    }

    public function update(Request $request, $id){
        $location = Location::findOrFail($id);
        $location->update($request->only(['name', 'latitude', 'longitude', 'radius']));

        return response()->json([
            'message' => 'Location updated successfully',
            'data' => $location
        ]);
    }

    public function destroy($id){
        $location = Location::findOrFail($id);
        $location->delete();

        return response()->json(['message' => 'Location deleted successfully']);
    }

    public function verify(Request $request){
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $userLat = $request->input('latitude');
        $userLng = $request->input('longitude');

        $locations = Location::all();

        foreach ($locations as $loc) {
            $distance = $this->haversine($userLat, $userLng, $loc->latitude, $loc->longitude);
            if ($distance <= $loc->radius) {
                return response()->json([
                    'valid' => true,
                    'location' => $loc,
                    'distance' => round($distance),
                ]);
            }
        }

        return response()->json([
            'valid' => false,
            'message' => 'Anda tidak berada di lokasi yang diizinkan',
        ]);
    }

    private function haversine($lat1, $lng1, $lat2, $lng2){
        $r = 6371000; // meter
        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);
        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLng / 2) * sin($dLng / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $r * $c;
    }
}
