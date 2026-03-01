<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('log_absensi', function (Blueprint $table) {
            $table->decimal('latitude', 10, 7)->nullable()->after('image_path');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            $table->unsignedBigInteger('location_id')->nullable()->after('longitude');

            $table->foreign('location_id')->references('id')->on('locations')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('log_absensi', function (Blueprint $table) {
            $table->dropForeign(['location_id']);
            $table->dropColumn(['latitude', 'longitude', 'location_id']);
        });
    }
};
