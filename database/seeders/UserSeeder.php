<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('a'),
            'email_verified_at' => now(),
            'role' => 'superadmin',
        ]);

        // Create 49 more users
        User::factory()
            ->count(49)
            ->create();
    }
}
