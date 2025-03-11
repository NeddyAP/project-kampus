<?php

namespace App\Services;

use App\Models\InternshipLog;
use App\Models\InternshipSupervision;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class InternshipSupervisionService
{
    /**
     * Create a new guidance schedule
     */
    public function createGuidanceSchedule(array $data, User $dosen): InternshipSupervision
    {
        $attachmentPath = null;
        if (isset($data['attachment'])) {
            $attachmentPath = Storage::disk('public')->put('internship/supervisions', $data['attachment']);
        }

        return InternshipSupervision::create([
            'dosen_id' => $dosen->id,
            'title' => $data['title'],
            'notes' => $data['notes'],
            'scheduled_at' => $data['date'].' '.$data['time'],
            'attachment_path' => $attachmentPath,
        ]);
    }

    /**
     * Get active students for supervision
     */
    public function getActiveStudents(User $dosen): Collection
    {
        return $dosen->internshipBimbingan()
            ->whereIn('status', ['SEDANG_BERJALAN', 'DISETUJUI'])
            ->with('mahasiswa:id,name')
            ->get()
            ->map(function ($internship) {
                return [
                    'id' => $internship->mahasiswa->id,
                    'name' => $internship->mahasiswa->name,
                    'internship_id' => $internship->id,
                ];
            });
    }

    /**
     * Record attendance for students
     */
    public function recordAttendance(array $data, InternshipSupervision $supervision, User $dosen): void
    {
        foreach ($data as $mahasiswaId => $attendance) {
            $internship = $dosen->internshipBimbingan()
                ->whereHas('mahasiswa', function ($query) use ($mahasiswaId) {
                    $query->where('id', $mahasiswaId);
                })
                ->first();

            if ($internship) {
                InternshipLog::create([
                    'internship_id' => $internship->id,
                    'user_id' => $dosen->id,
                    'type' => InternshipLog::TYPE_ATTENDANCE,
                    'title' => match ($attendance['status']) {
                        'HADIR' => 'Hadir',
                        'IZIN' => 'Izin',
                        'SAKIT' => 'Sakit',
                        'TIDAK_HADIR' => 'Tidak Hadir',
                    },
                    'description' => $attendance['notes'] ?? '',
                    'metadata' => [
                        'status' => $attendance['status'],
                        'supervision_id' => $supervision->id,
                        'date' => $supervision->scheduled_at->format('Y-m-d'),
                    ],
                ]);
            }
        }
    }

    /**
     * Get upcoming supervisions for a dosen.
     */
    public function getUpcomingSupervisions(User $dosen, array $filters = []): LengthAwarePaginator
    {
        $query = InternshipSupervision::query()
            ->where('dosen_id', $dosen->id)
            ->whereNotNull('scheduled_at')
            ->where('scheduled_at', '>', now());

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', "%{$filters['search']}%")
                    ->orWhere('notes', 'like', "%{$filters['search']}%");
            });
        }

        if (isset($filters['date'])) {
            $query->whereDate('scheduled_at', $filters['date']);
        }

        return $query->orderBy('scheduled_at', 'asc')
            ->paginate($filters['per_page'] ?? 10);
    }
}
