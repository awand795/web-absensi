<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserFace;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function me(Request $request){
        return response()->json([
            'data' => $request->user()
        ], 200);
    }

    public function index(){
        return response()->json(User::all());
    }

    public function store(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,karyawan',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'data' => $user
        ], 201);
    }

    public function update(Request $request, $id){
        $user = User::findOrFail($id);
        $user->update($request->only(['name', 'email', 'role', 'status']));

        return response()->json([
            'message' => 'User updated successfully',
            'data' => $user
        ]);
    }

    public function destroy($id){
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function updateFace(Request $request){
        $request->validate([
            'face_embedding' => 'required'
        ]);

        $user = $request->user();

        UserFace::updateOrCreate(
            ['user_id' => $user->id],
            ['face_embedding' => $request->input('face_embedding')]
        );

        return response()->json([
            'message' => 'Face updated successfully',
            'status' => 'success'
        ], 200);
    }

    public function getAllFaceEmbedings(){
        $faces = UserFace::with('user:id,name')->get();

        return response()->json([
            'data' => $faces->map(function ($face) {
                return [
                    'user_id' => $face->user_id,
                    'name' => $face->user->name,
                    'face_embedding' => $face->face_embedding,
                ];
            })
        ], 200);
    }
}
