<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EmailSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'email_notifications_enabled',
        'smtp_host',
        'smtp_port',
        'smtp_username',
        'smtp_password',
        'smtp_encryption',
        'from_email',
        'from_name',
    ];

    protected $casts = [
        'email_notifications_enabled' => 'boolean',
    ];
}
