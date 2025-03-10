<?php

namespace App\Services;

use App\Models\Internship;
use App\Models\InternshipLog;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class InternshipService
{
    public function store(array $validated, UploadedFile $coverLetter): Internship
    {
        $coverLetterPath = $coverLetter->store('internship/cover_letters', 'public');

        $internship = Internship::create([
            'mahasiswa_id' => Auth::id(),
            'dosen_id' => $validated['dosen_id'],
            'category' => $validated['category'],
            'company_name' => $validated['company_name'],
            'company_address' => $validated['company_address'],
            'company_phone' => $validated['company_phone'],
            'supervisor_name' => $validated['supervisor_name'],
            'supervisor_phone' => $validated['supervisor_phone'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'cover_letter_path' => $coverLetterPath,
            'status' => Internship::STATUS_MENUNGGU,
        ]);

        $this->createStatusLog($internship, 'Pengajuan Magang Dibuat', 'Pengajuan magang telah dibuat dan menunggu persetujuan.');

        return $internship;
    }

    public function update(Internship $internship, array $validated, ?UploadedFile $coverLetter = null): Internship
    {
        if ($coverLetter) {
            if ($internship->cover_letter_path) {
                Storage::disk('public')->delete($internship->cover_letter_path);
            }
            $internship->cover_letter_path = $coverLetter->store('internship/cover_letters', 'public');
        }

        $internship->update([
            'dosen_id' => $validated['dosen_id'],
            'category' => $validated['category'],
            'company_name' => $validated['company_name'],
            'company_address' => $validated['company_address'],
            'company_phone' => $validated['company_phone'],
            'supervisor_name' => $validated['supervisor_name'],
            'supervisor_phone' => $validated['supervisor_phone'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
        ]);

        $this->createStatusLog($internship, 'Pengajuan Magang Diperbarui', 'Detail pengajuan magang telah diperbarui.');

        return $internship;
    }

    public function storeLog(Internship $internship, array $validated, ?UploadedFile $attachment = null): InternshipLog
    {
        $attachmentPath = null;
        if ($attachment) {
            $attachmentPath = $attachment->store('internship/logs', 'public');
        }

        return InternshipLog::create([
            'internship_id' => $internship->id,
            'user_id' => Auth::id(),
            'type' => InternshipLog::TYPE_ACTIVITY_REPORT,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'attachment_path' => $attachmentPath,
        ]);
    }

    private function createStatusLog(Internship $internship, string $title, string $description): void
    {
        InternshipLog::create([
            'internship_id' => $internship->id,
            'user_id' => Auth::id(),
            'type' => InternshipLog::TYPE_STATUS_CHANGE,
            'title' => $title,
            'description' => $description,
            'metadata' => [
                'status' => $internship->status,
                'category' => $internship->category,
            ],
        ]);
    }
}
