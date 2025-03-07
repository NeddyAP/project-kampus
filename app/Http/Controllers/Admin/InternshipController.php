<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Internship;
use App\Models\InternshipLog;
use App\Models\User;
use App\Services\Internship\InternshipService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InternshipController extends Controller
{
    protected $internshipService;

    public function __construct(InternshipService $internshipService)
    {
        $this->internshipService = $internshipService;
    }

    /**
     * Menampilkan daftar pengajuan magang
     */
    public function index(Request $request)
    {
        // Query dasar dengan relasi
        $query = Internship::with(['mahasiswa', 'dosen', 'approver'])
            ->when($request->status, fn($q, $status) => $q->status($status))
            ->when($request->category, fn($q, $category) => $q->category($category))
            ->when($request->search, function($q, $search) {
                $q->whereHas('mahasiswa', function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })->orWhere('company_name', 'like', "%{$search}%");
            });

        // Ambil data magang dengan pagination
        $internships = $query->latest()
            ->paginate(10)
            ->withQueryString();

        // Statistik magang
        $stats = [
            'pending_count' => Internship::status(Internship::STATUS_PENDING)->count(),
            'approved_count' => Internship::whereIn('status', [
                Internship::STATUS_APPROVED,
                Internship::STATUS_ONGOING
            ])->count(),
            'rejected_count' => Internship::status(Internship::STATUS_REJECTED)->count(),
            'recent_activities' => InternshipLog::with('user')
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($log) {
                    $log->created_at = $log->created_at->diffForHumans();
                    return $log;
                }),
        ];

        return Inertia::render('Admin/Internships/Index', [
            'internships' => $internships,
            'filters' => [
                'status' => $request->status,
                'category' => $request->category,
                'search' => $request->search,
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Menampilkan detail pengajuan magang
     */
    public function show(Internship $internship)
    {
        $internship->load([
            'mahasiswa', 
            'dosen', 
            'approver',
            'logs' => fn($q) => $q->with('user')->latest(),
            'supervisions' => fn($q) => $q->with('dosen')->latest()
        ]);

        $availableDosen = User::role('dosen')
            ->select('id', 'name')
            ->whereDoesntHave('internshipBimbingan', function($q) {
                $q->whereIn('status', [
                    Internship::STATUS_APPROVED,
                    Internship::STATUS_ONGOING
                ]);
            })
            ->get();

        return Inertia::render('Admin/Internships/Show', [
            'internship' => $internship,
            'availableDosen' => $availableDosen,
        ]);
    }

    /**
     * Menyetujui pengajuan magang
     */
    public function approve(Request $request, Internship $internship)
    {
        $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            $this->internshipService->approve($internship, auth()->user(), $request->notes);
            return back()->with('success', 'Pengajuan magang berhasil disetujui');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Menolak pengajuan magang
     */
    public function reject(Request $request, Internship $internship)
    {
        $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        try {
            $this->internshipService->reject($internship, auth()->user(), $request->reason);
            return back()->with('success', 'Pengajuan magang berhasil ditolak');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Upload surat persetujuan
     */
    public function uploadApprovalLetter(Request $request, Internship $internship)
    {
        $request->validate([
            'approval_letter' => 'required|file|mimes:pdf|max:2048',
        ]);

        try {
            $this->internshipService->uploadDocument($internship, 'approval_letter', $request->file('approval_letter'));
            return back()->with('success', 'Surat persetujuan berhasil diupload');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Mengassign dosen pembimbing
     */
    public function assignSupervisor(Request $request, Internship $internship)
    {
        $request->validate([
            'dosen_id' => 'required|exists:users,id',
        ]);

        $internship->update(['dosen_id' => $request->dosen_id]);

        return back()->with('success', 'Dosen pembimbing berhasil ditugaskan');
    }
}
