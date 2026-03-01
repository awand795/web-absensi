<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;


class Izin extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'izin';

    protected $fillable = [
        'id_karyawan',
        'jenis_izin',
        'tanggal_mulai',
        'tanggal_selesai',
        'persetujuan',
    ];
    protected $hidden = [];

    protected function casts(): array
    {
        return [
        ];
    }
}
