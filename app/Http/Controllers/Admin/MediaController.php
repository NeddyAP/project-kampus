<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Internship;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MediaController extends Controller
{
    public function index()
    {
        // Ambil semua media dari internships dengan relasi mahasiswa
        $media = Internship::with('mahasiswa:id,name')
            ->whereNotNull('document_path')
            ->get()
            ->map(function ($internship) {
                return [
                    'id' => $internship->id,
                    'filename' => basename($internship->document_path),
                    'url' => asset('storage/' . $internship->document_path),
                    'mime_type' => mime_content_type(storage_path('app/public/' . $internship->document_path)),
                    'size' => filesize(storage_path('app/public/' . $internship->document_path)),
                    'created_at' => $internship->created_at,
                    'internship' => [
                        'id' => $internship->id,
                        'mahasiswa' => [
                            'name' => $internship->mahasiswa->name,
                        ],
                    ],
                ];
            });

        return Inertia::render('Admin/media/index', [
            'media' => $media,
        ]);
    }
}