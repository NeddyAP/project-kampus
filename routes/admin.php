<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InternshipController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('admin.dashboard');

    // Manajemen Magang
    Route::get('/internships', [InternshipController::class, 'index'])
        ->name('admin.internships.index');
    Route::get('/internships/{internship}', [InternshipController::class, 'show'])
        ->name('admin.internships.show');
    Route::post('/internships/{internship}/approve', [InternshipController::class, 'approve'])
        ->name('admin.internships.approve');
    Route::post('/internships/{internship}/assign', [InternshipController::class, 'assign'])
        ->name('admin.internships.assign');

    // User Management
    Route::get('/users', [UserController::class, 'index'])
        ->name('admin.users.index');
    Route::get('/users/create', [UserController::class, 'create'])
        ->name('admin.users.create');
    Route::post('/users', [UserController::class, 'store'])
        ->name('admin.users.store');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])
        ->name('admin.users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])
        ->name('admin.users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])
        ->name('admin.users.destroy');

    // Media Manager
    Route::get('/media', [MediaController::class, 'index'])
        ->name('admin.media.index');
});
