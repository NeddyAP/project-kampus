<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Internship;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Statistik pengguna
        $totalUsers = User::count();
        $totalDosen = User::role('dosen')->count();
        $totalMahasiswa = User::role('mahasiswa')->count();

        // Statistik magang
        $totalMagang = Internship::count();
        $magangMenunggu = Internship::where('status', 'MENUNGGU_PERSETUJUAN')->count();
        $magangBerjalan = Internship::where('status', 'BERJALAN')->count();
        $magangSelesai = Internship::where('status', 'SELESAI')->count();

        // Aktivitas terbaru
        $recentActivities = Activity::with(['causer:id,name'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'description' => $activity->description,
                    'causer_name' => $activity->causer?->name,
                    'created_at' => $activity->created_at,
                ];
            });

        // Magang terbaru
        $recentInternships = Internship::with(['mahasiswa:id,name', 'dosen:id,name'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($internship) {
                return [
                    'id' => $internship->id,
                    'mahasiswa_name' => $internship->mahasiswa?->name,
                    'dosen_name' => $internship->dosen?->name,
                    'type' => $internship->type,
                    'status' => $internship->status,
                    'created_at' => $internship->created_at,
                ];
            });

        return Inertia::render('Admin/dashboard', [
            'stats' => [
                'users' => [
                    'total' => $totalUsers,
                    'dosen' => $totalDosen,
                    'mahasiswa' => $totalMahasiswa,
                ],
                'internships' => [
                    'total' => $totalMagang,
                    'menunggu' => $magangMenunggu,
                    'berjalan' => $magangBerjalan,
                    'selesai' => $magangSelesai,
                ],
            ],
            'recentActivities' => $recentActivities,
            'recentInternships' => $recentInternships,
        ]);
    }
}
