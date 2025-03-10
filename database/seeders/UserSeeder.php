<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create default admin
        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('a'),
            'email_verified_at' => now(),
        ])->assignRole('admin');

        User::create([
            'name' => 'Mahasiswa',
            'email' => 'mahasiswa@gmail.com',
            'password' => Hash::make('a'),
            'email_verified_at' => now(),
        ])->assignRole('mahasiswa');

        User::create([
            'name' => 'Dosen',
            'email' => 'dosen@gmail.com',
            'password' => Hash::make('a'),
            'email_verified_at' => now(),
        ])->assignRole('dosen');

        // Create 10 dosen
        User::factory()
            ->count(10)
            ->create()
            ->each(function ($user) {
                $user->assignRole('dosen');
                $user->dosenProfile()->create([
                    'nip' => fake()->unique()->numerify('##########'),
                    'bidang_keahlian' => fake()->randomElement([
                        'Pemrograman',
                        'Basis Data',
                        'Jaringan Komputer',
                        'Kecerdasan Buatan',
                        'Keamanan Sistem'
                    ]),
                    'pendidikan_terakhir' => fake()->randomElement([
                        'S2',
                        'S3'
                    ]),
                    'jabatan_akademik' => fake()->randomElement([
                        'Asisten Ahli',
                        'Lektor',
                        'Lektor Kepala',
                        'Profesor'
                    ]),
                    'status_kepegawaian' => fake()->randomElement(['PNS', 'Non-PNS']),
                    'tahun_mulai_mengajar' => fake()->numberBetween(2010, 2020)
                ]);
            });

        // Create 30 mahasiswa
        User::factory()
            ->count(30)
            ->create()
            ->each(function ($user) {
                $user->assignRole('mahasiswa');
                $user->mahasiswaProfile()->create([
                    'nim' => fake()->unique()->numerify('#########'),
                    'program_studi' => fake()->randomElement([
                        'Teknik Informatika',
                        'Sistem Informasi',
                        'Ilmu Komputer'
                    ]),
                    'angkatan' => fake()->numberBetween(2020, 2023),
                    'status_akademik' => 'Aktif',
                    'semester' => fake()->numberBetween(1, 8),
                    'ipk' => fake()->randomFloat(2, 2.5, 4.0)
                ]);
            });
    }
}
