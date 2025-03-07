<?php

namespace Database\Seeders;

use App\Models\Activity;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // First, create roles and permissions
        $this->call([
            RoleSeeder::class,      // First because roles are needed by users
            UserSeeder::class,      // Second because users are needed by internships
            InternshipSeeder::class // Third because internships need users
        ]);

        // Finally, create some activity logs
        Activity::factory()
            ->count(20)
            ->create([
                'causer_id' => function () {
                    return \App\Models\User::inRandomOrder()->first()->id;
                }
            ]);
    }
}
