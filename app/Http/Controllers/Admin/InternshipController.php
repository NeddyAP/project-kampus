<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Internship;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InternshipController extends Controller
{
    public function index(Request $request)
    {
        $query = Internship::with(['mahasiswa:id,name,email,nim', 'dosen:id,name,email,nip']);

        // Apply filters
        if ($request->has('status') && $request->status !== 'ALL') {
            $query->where('status', $request->status);
        }

        if ($request->has('type') && $request->type !== 'ALL') {
            $query->where('type', $request->type);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('mahasiswa', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nim', 'like', "%{$search}%");
            });
        }

        // Apply sorting
        $query->when(
            $request->sort,
            fn($q, $sort) => $q->orderBy($sort, $request->order ?? 'asc'),
            fn($q) => $q->latest()
        );

        // Get paginated results
        $internships = $query->paginate($request->per_page ?? 10)
            ->withQueryString();

        // Get stats for dashboard cards
        $stats = [
            'total' => Internship::count(),
            'menunggu_persetujuan' => Internship::where('status', 'MENUNGGU_PERSETUJUAN')->count(),
            'disetujui' => Internship::where('status', 'DISETUJUI')->count(),
            'ditolak' => Internship::where('status', 'DITOLAK')->count(),
        ];

        // Get recent activities
        $recentActivities = Internship::with('mahasiswa:id,name')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($internship) {
                return [
                    'id' => $internship->id,
                    'mahasiswa_name' => $internship->mahasiswa->name ?? 'Unknown',
                    'type' => $internship->type,
                    'status' => $internship->status,
                    'created_at' => $internship->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('Admin/internships/index', [
            'internships' => $internships,
            'filters' => $request->only(['search', 'status', 'type', 'sort', 'order', 'per_page']),
            'stats' => $stats,
            'recentActivities' => $recentActivities,
        ]);
    }

    public function show(Internship $internship)
    {
        $internship->load(['mahasiswa:id,name,email,nim', 'dosen:id,name,email,nip', 'logs']);

        return Inertia::render('Admin/internships/show', [
            'internship' => $internship
        ]);
    }

    public function approve(Request $request, Internship $internship)
    {
        $request->validate([
            'status' => 'required|in:DISETUJUI,DITOLAK',
            'notes' => 'required|string|max:255'
        ]);

        $internship->update([
            'status' => $request->status
        ]);

        // Catat log persetujuan
        $internship->logs()->create([
            'activity' => $request->status === 'DISETUJUI' ? 'Pengajuan disetujui' : 'Pengajuan ditolak',
            'notes' => $request->notes
        ]);

        return redirect()
            ->route('admin.internships.index')
            ->with('success', 'Status magang berhasil diperbarui');
    }

    public function assign(Request $request, Internship $internship)
    {
        $request->validate([
            'dosen_id' => 'required|exists:users,id',
            'notes' => 'required|string|max:255'
        ]);

        $internship->update([
            'dosen_id' => $request->dosen_id,
            'status' => 'BERJALAN'
        ]);

        // Catat log assignment dosen
        $internship->logs()->create([
            'activity' => 'Dosen pembimbing ditugaskan',
            'notes' => $request->notes
        ]);

        // Buat data supervisi
        $internship->supervision()->create([
            'dosen_id' => $request->dosen_id,
            'notes' => $request->notes
        ]);

        return redirect()
            ->route('admin.internships.index')
            ->with('success', 'Dosen pembimbing berhasil ditugaskan');
    }
}
