<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (env('VERCEL')) {
            // Force configurations for Serverless environment
            config([
                'view.compiled' => '/tmp/storage/framework/views',
                'session.driver' => 'cookie',
                'cache.default' => 'array',
                'logging.default' => 'stderr',
            ]);
            
            // Fix for trusted proxies on Vercel
            $this->app->make(\Illuminate\Http\Request::class)->headers->set('X-Forwarded-Proto', 'https');
        }
    }
}
