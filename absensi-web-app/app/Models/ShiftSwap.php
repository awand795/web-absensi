<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ShiftSwap extends Model
{
    use HasFactory;

    protected $fillable = [
        'requester_id',
        'target_id',
        'shift_id',
        'swap_date',
        'status',
        'reason',
        'approved_at',
    ];

    protected $casts = [
        'swap_date' => 'date',
        'approved_at' => 'datetime',
    ];

    public function requester()
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function target()
    {
        return $this->belongsTo(User::class, 'target_id');
    }

    public function shift()
    {
        return $this->belongsTo(Shift::class, 'shift_id');
    }
}
