<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use \Exception;

class AuthController extends Controller
{
    public function login(Request $request){
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
            'device_name' => 'required'
        ]);

        $user = User::where('email', $request->input('email'))->first();

        if (!$user || ! Hash::check($request->input('password'), $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password',
                'status' => 'error'
            ], 401);
        }

        $token = $user->createToken($request->input('device_name'))->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'status' => 'success',
            'token' => $token
        ], 200);
    }

    public function register(Request $request){
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|min:6',
                'id_karyawan' => 'required|string|unique:users,id_karyawan',
            ]);

            $user = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => $request->input('password'),
                'role' => $request->input('role', 'karyawan'),
                'status' => $request->input('status', 'active'),
                'id_karyawan' => $request->input('id_karyawan'),
            ]);

            return response()->json([
                'message' => 'Register successful',
                'status' => 'success',
                'data' => $user
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'status' => 'error',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Internal server error',
                'status' => 'error'
            ], 500);
        }
    }

    public function logout(Request $request){
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Logout successful',
                'status' => 'success'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Internal server error',
                'status' => 'error'
            ], 500);
        }
    }
}
