<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Sentry\Laravel\Integration;

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
        if (app()->environment('production')) {
            Integration::boot();

            $this->app->singleton('Sentry\ClientBuilder', function () {
                return \Sentry\ClientBuilder::create([
                    'dsn' => config('sentry.dsn'),
                    'traces_sample_rate' => config('sentry.traces_sample_rate'),
                    'release' => config('sentry.release'),
                    'environment' => config('sentry.environment'),
                ]);
            });
        }
    }
}
