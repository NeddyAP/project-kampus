<?php

use App\Http\Controllers\Admin\InternshipController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->group(function () {


    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('users', UserController::class);
    Route::post('/users/{user}/restore', [UserController::class, 'restore'])->name('users.restore');

    // Internship Management Routes
    Route::prefix('magang')->group(function () {
        Route::get('/', [InternshipController::class, 'index'])->name('admin.magang.index');
        Route::get('/{internship}', [InternshipController::class, 'show'])->name('admin.magang.show');
        Route::post('/{internship}/approve', [InternshipController::class, 'approve'])->name('admin.magang.approve');
        Route::post('/{internship}/reject', [InternshipController::class, 'reject'])->name('admin.magang.reject');
        Route::post('/{internship}/upload-approval', [InternshipController::class, 'uploadApprovalLetter'])->name('admin.magang.upload-approval');
        Route::post('/{internship}/assign-supervisor', [InternshipController::class, 'assignSupervisor'])->name('admin.magang.assign-supervisor');
    });
});
