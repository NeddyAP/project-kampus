<?php

namespace App\Http\Controllers;

use App\Models\Internship;
use App\Models\InternshipLog;
use App\Models\InternshipSupervision;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DosenInternshipController extends Controller
{
    /**
     * Display a listing of the internships supervised by the authenticated dosen.
     */
    public function index()
    {
        $user = Auth::user();
        $internships = $user->internshipBimbingan()
            ->with(['mahasiswa:id,name', 'logs'])
            ->latest()
            ->get();

        return Inertia::render('Dosen/Bimbingan/Index', [
            'internships' => $internships,
        ]);
    }

    /**
     * Display the specified internship.
     */
    public function show(Internship $internship)
    {
        // Ensure the internship is supervised by the authenticated dosen
        if ($internship->dosen_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $internship->load(['mahasiswa:id,name', 'logs.user:id,name', 'supervisions.dosen:id,name']);

        return Inertia::render('Dosen/Bimbingan/Show', [
            'internship' => $internship,
        ]);
    }

    /**
     * Store a new supervision entry for the internship.
     */
    public function storeSupervision(Request $request, Internship $internship)
    {
        // Ensure the internship is supervised by the authenticated dosen
        if ($internship->dosen_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        // Ensure the internship is active
        if (!$internship->isActive()) {
            return back()->with('error', 'Hanya magang yang aktif yang dapat ditambahkan bimbingan.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'notes' => 'required|string',
            'attachment' => 'nullable|file|max:5120', // 5MB max
        ]);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('internship/supervisions', 'public');
        }

        // Create supervision record
        $supervision = InternshipSupervision::create([
            'internship_id' => $internship->id,
            'dosen_id' => Auth::id(),
            'title' => $validated['title'],
            'notes' => $validated['notes'],
            'attachment_path' => $attachmentPath,
        ]);

        // Create log entry
        InternshipLog::create([
            'internship_id' => $internship->id,
            'user_id' => Auth::id(),
            'type' => InternshipLog::TYPE_SUPERVISION,
            'title' => 'Bimbingan: ' . $validated['title'],
            'description' => $validated['notes'],
            'attachment_path' => $attachmentPath,
            'metadata' => [
                'supervision_id' => $supervision->id,
            ],
        ]);

        return back()->with('message', 'Catatan bimbingan berhasil ditambahkan.');
    }
} 