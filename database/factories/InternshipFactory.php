<?php

namespace Database\Factories;

use App\Models\Internship;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class InternshipFactory extends Factory
{
    protected $model = Internship::class;

    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('now', '+2 months');
        $endDate = $this->faker->dateTimeBetween($startDate, '+6 months');
        
        $status = $this->faker->randomElement([
            Internship::STATUS_DRAFT,
            Internship::STATUS_MENUNGGU,
            Internship::STATUS_DISETUJUI,
            Internship::STATUS_DITOLAK,
            Internship::STATUS_BERJALAN,
            Internship::STATUS_SELESAI,
        ]);

        return [
            'category' => $this->faker->randomElement(['KKL', 'KKN']),
            'company_name' => $this->faker->company(),
            'company_address' => $this->faker->address(),
            'company_phone' => $this->faker->phoneNumber(),
            'supervisor_name' => $this->faker->name(),
            'supervisor_phone' => $this->faker->phoneNumber(),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => $status,
            'notes' => $status === Internship::STATUS_DISETUJUI ? $this->faker->sentence() : null,
            'rejection_reason' => $status === Internship::STATUS_DITOLAK ? $this->faker->sentence() : null,
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Internship $internship) {
            // Jika status approved atau completed, set approved_by
            if (in_array($internship->status, [
                Internship::STATUS_DISETUJUI,
                Internship::STATUS_SELESAI
            ])) {
                $internship->approved_by = User::role('admin')->inRandomOrder()->first()->id;
                $internship->save();
            }
        });
    }
}