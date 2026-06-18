<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'data' => $user
        ], 200);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'security_question' => 'sometimes|string|nullable',
            'security_answer' => 'sometimes|string|nullable',
        ]);

        $user->update($request->only(['name', 'email', 'security_question', 'security_answer']));

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'data' => $user->fresh()
        ], 200);
    }

    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = $request->user();

        // Delete old photo
        if ($user->photo) {
            Storage::disk('public')->delete($user->photo);
        }

        $path = $request->file('photo')->store('photos', 'public');
        $user->update(['photo' => $path]);

        return response()->json([
            'message' => 'Foto berhasil diupload',
            'data' => ['photo_url' => Storage::url($path)]
        ], 200);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->input('current_password'), $user->password)) {
            return response()->json([
                'message' => 'Password saat ini tidak sesuai',
                'status' => 'error'
            ], 400);
        }

        $user->update(['password' => Hash::make($request->input('new_password'))]);

        return response()->json([
            'message' => 'Password berhasil diubah',
            'status' => 'success'
        ], 200);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'security_answer' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = \App\Models\User::where('email', $request->input('email'))->first();

        if (!$user->security_question || !$user->security_answer) {
            return response()->json([
                'message' => 'Akun ini belum mengatur pertanyaan keamanan',
                'status' => 'error'
            ], 400);
        }

        if (!Hash::check(strtolower($request->input('security_answer')), Hash::make(strtolower($user->security_answer)))) {
            // Compare with simple check since we stored plain text for simplicity
            if (strtolower($request->input('security_answer')) !== strtolower($user->security_answer)) {
                return response()->json([
                    'message' => 'Jawaban keamanan tidak sesuai',
                    'status' => 'error'
                ], 400);
            }
        }

        $user->update(['password' => Hash::make($request->input('new_password'))]);

        return response()->json([
            'message' => 'Password berhasil direset. Silakan login dengan password baru.',
            'status' => 'success'
        ], 200);
    }

    public function getSecurityQuestion(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = \App\Models\User::where('email', $request->input('email'))->first();

        if (!$user->security_question) {
            return response()->json([
                'has_question' => false,
                'message' => 'Akun ini belum mengatur pertanyaan keamanan'
            ], 200);
        }

        return response()->json([
            'has_question' => true,
            'question' => $user->security_question,
        ], 200);
    }
}
