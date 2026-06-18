<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ShiftController;
use App\Http\Controllers\Api\LogAbsensi;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\IzinController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ExportController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Forgot password
Route::post('/forgot-password/get-question', [ProfileController::class, 'getSecurityQuestion']);
Route::post('/forgot-password/reset', [ProfileController::class, 'forgotPassword']);

Route::middleware('auth:sanctum')->group(function(){
    Route::get('/users/faces', [UserController::class, 'getAllFaceEmbedings']);
    Route::get('/users/me', [UserController::class, 'me']);
    Route::put('/users/faces', [UserController::class, 'updateFace']);
    Route::get('/shifts', [ShiftController::class, 'index']);
    Route::post('/clock-in', [LogAbsensi::class, 'clockIn']);
    Route::post('/clock-out', [LogAbsensi::class, 'clockOut']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/izin/me', [IzinController::class, 'myIzin']);
    Route::get('/izin', [IzinController::class, 'index']);
    Route::post('/izin', [IzinController::class, 'store']);
    Route::get('/report/dashboard', [ReportController::class, 'dashboardSummary']);
    Route::get('/report/user/{user_id}', [ReportController::class, 'userMonthlyReport']);
    Route::get('/report/global', [ReportController::class, 'globalReport']);
    Route::get('/locations', [LocationController::class, 'index']);
    Route::post('/locations/verify', [LocationController::class, 'verify']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/photo', [ProfileController::class, 'uploadPhoto']);
    Route::put('/profile/password', [ProfileController::class, 'changePassword']);

    // Notifications & Announcements
    Route::get('/notifications', [NotificationController::class, 'myNotifications']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::get('/announcements', [NotificationController::class, 'getAnnouncements']);

    // Export
    Route::get('/export/excel', [ExportController::class, 'exportExcel']);
    Route::get('/export/csv', [ExportController::class, 'exportCsv']);

    // Admin routes
    Route::middleware(\App\Http\Middleware\AdminMiddleware::class)->group(function(){
        Route::get('/admin/users', [UserController::class, 'index']);
        Route::post('/admin/users', [UserController::class, 'store']);
        Route::put('/admin/users/{id}', [UserController::class, 'update']);
        Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);
        Route::post('/admin/shifts', [ShiftController::class, 'store']);
        Route::put('/admin/shifts/{id}', [ShiftController::class, 'update']);
        Route::delete('/admin/shifts/{id}', [ShiftController::class, 'destroy']);
        Route::put('/admin/izin/{id}/approve', [IzinController::class, 'approve']);
        Route::put('/admin/izin/{id}/reject', [IzinController::class, 'reject']);
        Route::post('/admin/locations', [LocationController::class, 'store']);
        Route::put('/admin/locations/{id}', [LocationController::class, 'update']);
        Route::delete('/admin/locations/{id}', [LocationController::class, 'destroy']);

        // Admin: announcements
        Route::post('/admin/announcements', [NotificationController::class, 'storeAnnouncement']);
        Route::delete('/admin/announcements/{id}', [NotificationController::class, 'destroyAnnouncement']);
    });
});
