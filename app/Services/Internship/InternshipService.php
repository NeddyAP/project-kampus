<?php

namespace App\Services\Internship;

use App\Models\Internship;
use App\Models\InternshipLog;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class InternshipService
{
    /**
     * Membuat pengajuan magang baru
     */
    public function create(array $data, User $mahasiswa): Internship
    {
        return DB::transaction(function () use ($data, $mahasiswa) {
            // Upload surat pengantar jika ada
            if (isset($data['cover_letter'])) {
                $data['cover_letter_path'] = $data['cover_letter']->store('internships/cover-letters');
            }

            // Buat pengajuan magang
            $internship = Internship::create([
                'mahasiswa_id' => $mahasiswa->id,
                'dosen_id' => $data['dosen_id'] ?? null,
                'category' => $data['category'],
                'company_name' => $data['company_name'],
                'company_address' => $data['company_address'],
                'company_phone' => $data['company_phone'],
                'supervisor_name' => $data['supervisor_name'],
                'supervisor_phone' => $data['supervisor_phone'],
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
                'status' => Internship::STATUS_PENDING,
            ]);

            // Buat log pengajuan
            $this->createLog($internship, $mahasiswa, InternshipLog::TYPE_STATUS_CHANGE, 'Pengajuan Magang Dibuat', [
                'old_status' => null,
                'new_status' => Internship::STATUS_PENDING,
            ]);

            return $internship;
        });
    }

    /**
     * Menyetujui pengajuan magang
     */
    public function approve(Internship $internship, User $approver, ?string $notes = null): Internship
    {
        return DB::transaction(function () use ($internship, $approver, $notes) {
            if (! $internship->canBeApproved()) {
                throw new \Exception('Pengajuan magang tidak dapat disetujui');
            }

            // Update status
            $internship->update([
                'status' => Internship::STATUS_APPROVED,
                'approved_by' => $approver->id,
                'notes' => $notes,
            ]);

            // Buat log persetujuan
            $this->createLog($internship, $approver, InternshipLog::TYPE_STATUS_CHANGE, 'Pengajuan Magang Disetujui', [
                'old_status' => Internship::STATUS_PENDING,
                'new_status' => Internship::STATUS_APPROVED,
                'notes' => $notes,
            ]);

            return $internship;
        });
    }

    /**
     * Menolak pengajuan magang
     */
    public function reject(Internship $internship, User $approver, string $reason): Internship
    {
        return DB::transaction(function () use ($internship, $approver, $reason) {
            if (! $internship->canBeRejected()) {
                throw new \Exception('Pengajuan magang tidak dapat ditolak');
            }

            // Update status
            $internship->update([
                'status' => Internship::STATUS_REJECTED,
                'approved_by' => $approver->id,
                'rejection_reason' => $reason,
            ]);

            // Buat log penolakan
            $this->createLog($internship, $approver, InternshipLog::TYPE_STATUS_CHANGE, 'Pengajuan Magang Ditolak', [
                'old_status' => Internship::STATUS_PENDING,
                'new_status' => Internship::STATUS_REJECTED,
                'reason' => $reason,
            ]);

            return $internship;
        });
    }

    /**
     * Menandai magang sebagai selesai
     */
    public function complete(Internship $internship, User $user): Internship
    {
        return DB::transaction(function () use ($internship, $user) {
            if (! $internship->canBeCompleted()) {
                throw new \Exception('Magang tidak dapat ditandai selesai');
            }

            // Update status
            $internship->update([
                'status' => Internship::STATUS_COMPLETED,
            ]);

            // Buat log penyelesaian
            $this->createLog($internship, $user, InternshipLog::TYPE_STATUS_CHANGE, 'Magang Selesai', [
                'old_status' => Internship::STATUS_ONGOING,
                'new_status' => Internship::STATUS_COMPLETED,
            ]);

            return $internship;
        });
    }

    /**
     * Upload dokumen terkait magang
     */
    public function uploadDocument(Internship $internship, string $type, $file): string
    {
        $path = $file->store("internships/{$internship->id}");

        switch ($type) {
            case 'cover_letter':
                $internship->update(['cover_letter_path' => $path]);
                $title = 'Upload Surat Pengantar';
                break;
            case 'approval_letter':
                $internship->update(['approval_letter_path' => $path]);
                $title = 'Upload Surat Persetujuan';
                break;
            case 'report':
                $internship->update(['report_file_path' => $path]);
                $title = 'Upload Laporan Akhir';
                break;
            default:
                throw new \Exception('Tipe dokumen tidak valid');
        }

        // Buat log upload dokumen
        $this->createLog(
            $internship,
            auth()->user(),
            InternshipLog::TYPE_DOCUMENT_UPLOAD,
            $title,
            ['file_path' => $path]
        );

        return $path;
    }

    /**
     * Membuat log aktivitas magang
     */
    private function createLog(
        Internship $internship,
        User $user,
        string $type,
        string $title,
        ?array $metadata = null
    ): InternshipLog {
        return InternshipLog::create([
            'internship_id' => $internship->id,
            'user_id' => $user->id,
            'type' => $type,
            'title' => $title,
            'metadata' => $metadata,
        ]);
    }
}
