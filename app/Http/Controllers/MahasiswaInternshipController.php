<?php

namespace App\Http\Controllers;

use App\Http\Requests\Internship\StoreInternshipRequest;
use App\Models\Internship;
use App\Models\User;
use App\Services\InternshipService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MahasiswaInternshipController extends Controller
{
    public function __construct(
        private InternshipService $internshipService
    ) {}

    public function index()
    {
        $user = Auth::user();
        $internships = $user->internships()
            ->with(['dosen:id,name', 'logs'])
            ->latest()
            ->get();

        return Inertia::render('mahasiswa/magang/index', [
            'internships' => $internships,
        ]);
    }

    public function create()
    {
        $dosen = User::role('dosen')->get(['id', 'name']);

        return Inertia::render('mahasiswa/magang/create', [
            'dosen' => $dosen,
            'categories' => [
                Internship::CATEGORY_KKL => 'Kuliah Kerja Lapangan (KKL)',
                Internship::CATEGORY_KKN => 'Kuliah Kerja Nyata (KKN)',
            ],
        ]);
    }

    public function store(StoreInternshipRequest $request)
    {
        try {
            $this->internshipService->store(
                $request->validated(),
                $request->file('cover_letter')
            );

            return redirect()->route('mahasiswa.magang.index')
                ->with('message', 'Pengajuan magang berhasil dibuat dan sedang menunggu persetujuan.');
        } catch (\Exception $e) {
            return back()->withErrors([
                'cover_letter' => 'Gagal mengunggah file. Pastikan ukuran file tidak melebihi 2MB.',
            ])->withInput();
        }
    }

    public function edit(Internship $internship)
    {
        // Ensure the internship belongs to the authenticated user
        if ($internship->mahasiswa_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        // Ensure the internship can be edited (only if status is MENUNGGU_PERSETUJUAN)
        if ($internship->status !== Internship::STATUS_MENUNGGU) {
            return redirect()->route('mahasiswa.magang.show', $internship)
                ->with('error', 'Hanya pengajuan magang yang belum diproses yang dapat diubah.');
        }

        $dosen = User::role('dosen')->get(['id', 'name']);

        return Inertia::render('mahasiswa/magang/edit', [
            'internship' => $internship,
            'dosen' => $dosen,
            'categories' => [
                Internship::CATEGORY_KKL => 'Kuliah Kerja Lapangan (KKL)',
                Internship::CATEGORY_KKN => 'Kuliah Kerja Nyata (KKN)',
            ],
        ]);
    }

    public function update(StoreInternshipRequest $request, Internship $internship)
    {
        if ($internship->mahasiswa_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if ($internship->status !== Internship::STATUS_MENUNGGU) {
            return redirect()->route('mahasiswa.magang.show', $internship)
                ->with('error', 'Hanya pengajuan magang yang belum diproses yang dapat diubah.');
        }

        $this->internshipService->update(
            $internship,
            $request->validated(),
            $request->file('cover_letter')
        );

        return redirect()->route('mahasiswa.magang.show', $internship)
            ->with('message', 'Pengajuan magang berhasil diperbarui.');
    }

    public function show(Internship $internship)
    {
        // Ensure the internship belongs to the authenticated user
        if ($internship->mahasiswa_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $internship->load(['dosen:id,name', 'logs.user:id,name', 'supervisions.dosen:id,name']);

        return Inertia::render('mahasiswa/magang/show', [
            'internship' => $internship,
        ]);
    }

    public function storeLog(Request $request, Internship $internship)
    {
        if ($internship->mahasiswa_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        if (! $internship->isActive()) {
            return back()->with('error', 'Hanya magang yang aktif yang dapat menambahkan log aktivitas.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'attachment' => 'nullable|file|max:5120',
        ]);

        $this->internshipService->storeLog(
            $internship,
            $validated,
            $request->file('attachment')
        );

        return back()->with('message', 'Log aktivitas berhasil ditambahkan.');
    }
}
