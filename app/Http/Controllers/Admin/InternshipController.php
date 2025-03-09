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

        if ($request->has('category') && $request->category !== 'ALL') {
            $query->where('category', $request->category);
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
            'category_count' => Internship::select('category')
                ->groupBy('category')
                ->selectRaw('count(*) as count')
                ->pluck('count'),
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
                    'category' => $internship->category,
                    'status' => $internship->status,
                    'created_at' => $internship->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('Admin/internships/index', [
            'internships' => $internships,
            'filters' => $request->only(['search', 'status', 'category', 'sort', 'order', 'per_page']),
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

        $oldStatus = $internship->status;
        $internship->update([
            'status' => $request->status,
            'rejection_reason' => $request->status === 'DITOLAK' ? $request->notes : null,
        ]);

        // Catat log persetujuan
        $internship->logs()->create([
            'user_id' => auth()->id(),
            'type' => 'STATUS_CHANGE',
            'title' => $request->status === 'DISETUJUI' ? 'Pengajuan disetujui' : 'Pengajuan ditolak',
            'description' => $request->notes,
            'metadata' => [
                'old_status' => $oldStatus,
                'new_status' => $request->status,
                'notes' => $request->notes
            ]
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
            'status' => 'SEDANG_BERJALAN'
        ]);

        // Catat log assignment dosen
        $internship->logs()->create([
            'user_id' => auth()->id(),
            'type' => 'STATUS_CHANGE',
            'title' => 'Dosen pembimbing ditugaskan',
            'description' => $request->notes,
            'metadata' => [
                'old_status' => 'DISETUJUI',
                'new_status' => 'SEDANG_BERJALAN',
                'notes' => $request->notes
            ]
        ]);

        // Buat data supervisi awal
        $internship->supervisions()->create([
            'dosen_id' => $request->dosen_id,
            'supervision_date' => now(),
            'supervision_type' => 'ONLINE',
            'supervisor_notes' => $request->notes
        ]);

        return redirect()
            ->route('admin.internships.index')
            ->with('success', 'Dosen pembimbing berhasil ditugaskan');
    }
}
