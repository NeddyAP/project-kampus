<?php

use App\Http\Controllers\DosenInternshipController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MahasiswaInternshipController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

// Mahasiswa Internship Routes
Route::middleware(['auth', 'role:mahasiswa'])->prefix('mahasiswa')->group(function () {
    Route::get('/magang', [MahasiswaInternshipController::class, 'index'])->name('mahasiswa.magang.index');
    Route::get('/magang/create', [MahasiswaInternshipController::class, 'create'])->name('mahasiswa.magang.create');
    Route::post('/magang', [MahasiswaInternshipController::class, 'store'])->name('mahasiswa.magang.store');
    Route::get('/magang/{internship}', [MahasiswaInternshipController::class, 'show'])->name('mahasiswa.magang.show');
    Route::post('/magang/{internship}/log', [MahasiswaInternshipController::class, 'storeLog'])->name('mahasiswa.magang.log.store');
});

// Dosen Internship Routes
Route::middleware(['auth', 'role:dosen'])->prefix('dosen')->group(function () {
    Route::get('/bimbingan', [DosenInternshipController::class, 'index'])->name('dosen.bimbingan.index');
    Route::get('/bimbingan/create', [DosenInternshipController::class, 'create'])->name('dosen.bimbingan.create');
    Route::get('/bimbingan/upcoming', [DosenInternshipController::class, 'upcoming'])->name('dosen.bimbingan.upcoming');
    Route::get('/bimbingan/list', [DosenInternshipController::class, 'list'])->name('dosen.bimbingan.list');
    Route::get('/bimbingan/{internship}', [DosenInternshipController::class, 'show'])->name('dosen.bimbingan.show');
    Route::post('/bimbingan/schedule', [DosenInternshipController::class, 'createGuidanceSchedule'])->name('dosen.bimbingan.schedule.create');
    Route::get('/bimbingan/supervision/{supervision}/attendance', [DosenInternshipController::class, 'showAttendanceForm'])->name('dosen.bimbingan.attendance.form');
    Route::post('/bimbingan/supervision/{supervision}/attendance', [DosenInternshipController::class, 'recordAttendance'])->name('dosen.bimbingan.attendance.store');
});

require __DIR__.'/admin.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
