<?php

namespace Database\Factories;

use App\Models\InternshipSupervision;
use Illuminate\Database\Eloquent\Factories\Factory;

class InternshipSupervisionFactory extends Factory
{
    protected $model = InternshipSupervision::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'notes' => $this->faker->paragraph(2),
            'attachment_path' => $this->faker->boolean(30) ? 'internships/dummy/supervision.pdf' : null,
            'scheduled_at' => $this->faker->optional(0.7)->dateTimeBetween('now', '+1 month'),
        ];
    }

    /**
     * Factory state untuk bimbingan terjadwal
     */
    public function scheduled()
    {
        return $this->state(function (array $attributes) {
            return [
                'title' => 'Bimbingan: '.$this->faker->sentence(),
                'notes' => $this->faker->paragraph(),
                'scheduled_at' => $this->faker->dateTimeBetween('now', '+2 weeks'),
            ];
        });
    }
}
