<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('log_absensi', function (Blueprint $table) {
            $table->enum('overtime_status', ['pending', 'approved', 'rejected'])->nullable()->after('overtime_minutes');
            $table->foreignId('overtime_approved_by')->nullable()->constrained('users')->onDelete('set null')->after('overtime_status');
            $table->timestamp('overtime_approved_at')->nullable()->after('overtime_approved_by');
            $table->time('break_start')->nullable()->after('overtime_approved_at');
            $table->time('break_end')->nullable()->after('break_start');
            $table->integer('break_minutes')->default(0)->after('break_end');
        });
    }

    public function down(): void
    {
        Schema::table('log_absensi', function (Blueprint $table) {
            $table->dropColumn(['overtime_status', 'overtime_approved_by', 'overtime_approved_at', 'break_start', 'break_end', 'break_minutes']);
        });
    }
};
