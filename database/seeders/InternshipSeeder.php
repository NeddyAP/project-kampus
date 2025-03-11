<?php

namespace Database\Seeders;

use App\Models\Internship;
use App\Models\User;
use Illuminate\Database\Seeder;

class InternshipSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil semua mahasiswa
        $mahasiswa = User::role('mahasiswa')->get();
        
        // Ambil semua dosen
        $dosen = User::role('dosen')->get();

        // Buat 50 data magang
        Internship::factory()
            ->count(50)
            ->sequence(fn ($sequence) => [
                'mahasiswa_id' => $mahasiswa->random()->id,
                'dosen_id' => $dosen->random()->id,
            ])
            ->create()
            ->each(function (Internship $internship) {
                // Buat 3-8 log untuk setiap magang
                $internship->logs()->saveMany(
                    \App\Models\InternshipLog::factory()
                        ->count(random_int(3, 8))
                        ->make([
                            'user_id' => $internship->mahasiswa_id
                        ])
                );

                // Jika status ongoing atau approved, buat data bimbingan
                if (in_array($internship->status, [
                    Internship::STATUS_BERJALAN,
                    Internship::STATUS_DISETUJUI
                ])) {
                    // Buat 2-5 data bimbingan biasa
                    $supervisions = \App\Models\InternshipSupervision::factory()
                        ->count(random_int(2, 5))
                        ->make([
                            'dosen_id' => $internship->dosen_id
                        ]);

                    // Jika sedang berjalan, tambahkan 1-3 jadwal bimbingan yang akan datang
                    if ($internship->status === Internship::STATUS_BERJALAN) {
                        $supervisions->push(...\App\Models\InternshipSupervision::factory()
                            ->count(random_int(1, 3))
                            ->scheduled()
                            ->make(['dosen_id' => $internship->dosen_id])
                        );
                    }

                    $internship->supervisions()->saveMany($supervisions);
                }
            });
    }
}