<?php

use App\Http\Controllers\Admin\InternshipController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])->group(function () {
    // Manajemen Magang
    Route::get('/internships', [InternshipController::class, 'index'])
        ->name('admin.internships.index');
        
    Route::get('/internships/{internship}', [InternshipController::class, 'show'])
        ->name('admin.internships.show');
        
    Route::post('/internships/{internship}/approve', [InternshipController::class, 'approve'])
        ->name('admin.internships.approve');
        
    Route::post('/internships/{internship}/assign', [InternshipController::class, 'assign'])
        ->name('admin.internships.assign');
});
