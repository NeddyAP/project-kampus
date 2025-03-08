<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Internship;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InternshipController extends Controller
{
    public function index()
    {
        $internships = Internship::with(['mahasiswa:id,name,email,nim', 'dosen:id,name,email,nip'])
            ->latest()
            ->get();

        return Inertia::render('Admin/internships/index', [
            'internships' => $internships
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
