<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserFace extends Model
{
    use HasFactory;

    protected $table = 'user_faces';

    protected $fillable = [
        'user_id',
        'face_embedding',
        'image_path',
    ];

    protected function casts(): array
    {
        return [
            'face_embedding' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
