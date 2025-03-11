<?php

namespace Database\Factories;

use App\Models\InternshipLog;
use Illuminate\Database\Eloquent\Factories\Factory;

class InternshipLogFactory extends Factory
{
    protected $model = InternshipLog::class;

    public function definition(): array
    {
        $type = $this->faker->randomElement([
            InternshipLog::TYPE_STATUS_CHANGE,
            InternshipLog::TYPE_COMMENT,
            InternshipLog::TYPE_DOCUMENT_UPLOAD,
            InternshipLog::TYPE_ACTIVITY_REPORT,
            InternshipLog::TYPE_SUPERVISION,
        ]);

        $metadata = match ($type) {
            InternshipLog::TYPE_STATUS_CHANGE => [
                'old_status' => $this->faker->randomElement(['DRAFT', 'PENDING']),
                'new_status' => $this->faker->randomElement(['APPROVED', 'REJECTED', 'ONGOING']),
                'notes' => $this->faker->sentence(),
            ],
            InternshipLog::TYPE_DOCUMENT_UPLOAD => [
                'file_path' => 'internships/dummy/document.pdf',
            ],
            default => null,
        };

        return [
            'type' => $type,
            'title' => $this->getLogTitle($type),
            'description' => $this->faker->sentence(),
            'metadata' => $metadata,
            'attachment_path' => $type === InternshipLog::TYPE_DOCUMENT_UPLOAD ? 'internships/dummy/document.pdf' : null,
        ];
    }

    private function getLogTitle(string $type): string
    {
        return match ($type) {
            InternshipLog::TYPE_STATUS_CHANGE => 'Perubahan Status Magang',
            InternshipLog::TYPE_COMMENT => 'Komentar Ditambahkan',
            InternshipLog::TYPE_DOCUMENT_UPLOAD => 'Upload Dokumen',
            InternshipLog::TYPE_ACTIVITY_REPORT => 'Laporan Aktivitas',
            InternshipLog::TYPE_SUPERVISION => 'Bimbingan dengan Dosen',
            default => 'Aktivitas Magang',
        };
    }
}
