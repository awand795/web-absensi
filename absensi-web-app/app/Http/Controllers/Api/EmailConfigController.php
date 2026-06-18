<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EmailSetting;

class EmailConfigController extends Controller
{
    public function show()
    {
        $setting = EmailSetting::first();
        return response()->json($setting ?? ['email_notifications_enabled' => false]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'email_notifications_enabled' => 'boolean',
            'smtp_host' => 'nullable|string',
            'smtp_port' => 'nullable|string',
            'smtp_username' => 'nullable|string',
            'smtp_password' => 'nullable|string',
            'smtp_encryption' => 'nullable|string|in:tls,ssl,null',
            'from_email' => 'nullable|email',
            'from_name' => 'nullable|string',
        ]);

        $setting = EmailSetting::first();
        if (!$setting) {
            $setting = new EmailSetting();
        }

        $setting->fill($request->only([
            'email_notifications_enabled', 'smtp_host', 'smtp_port',
            'smtp_username', 'smtp_password', 'smtp_encryption',
            'from_email', 'from_name'
        ]));
        $setting->save();

        // Apply SMTP config to runtime
        if ($setting->email_notifications_enabled && $setting->smtp_host) {
            config([
                'mail.mailers.smtp.host' => $setting->smtp_host,
                'mail.mailers.smtp.port' => $setting->smtp_port,
                'mail.mailers.smtp.username' => $setting->smtp_username,
                'mail.mailers.smtp.password' => $setting->smtp_password,
                'mail.mailers.smtp.encryption' => $setting->smtp_encryption === 'null' ? null : $setting->smtp_encryption,
                'mail.from.address' => $setting->from_email,
                'mail.from.name' => $setting->from_name,
            ]);
        }

        return response()->json(['message' => 'Pengaturan email berhasil disimpan', 'data' => $setting]);
    }
}
