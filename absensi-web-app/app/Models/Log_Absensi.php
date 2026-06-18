<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;


class Log_Absensi extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'log_absensi';

    protected $fillable = [
        'user_id',
        'shift_id',
        'date',
        'clock_in',
        'clock_out',
        'status',
        'image_path',
        'latitude',
        'longitude',
        'location_id',
    ];

    protected $hidden = [];

    protected function casts(): array
    {
        return [
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function shift()
    {
        return $this->belongsTo(Shift::class, 'shift_id');
    }
}
