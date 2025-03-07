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
            'supervision_date' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'supervision_type' => $this->faker->randomElement(['ONLINE', 'OFFLINE', 'HYBRID']),
            'supervision_location' => $this->faker->randomElement([
                'Google Meet',
                'Zoom Meeting',
                'Ruang Dosen',
                'Lab Komputer',
                null
            ]),
            'progress_notes' => $this->faker->paragraph(),
            'improvements_needed' => $this->faker->boolean(70) ? $this->faker->sentence() : null,
            'progress_score' => $this->faker->numberBetween(60, 100),
            'final_evaluation' => null,
            'final_score' => null,
            'supervisor_notes' => $this->faker->boolean(70) ? $this->faker->sentence() : null,
            'attachment_path' => $this->faker->boolean(30) ? 'internships/dummy/supervision.pdf' : null,
        ];
    }

    /**
     * Factory state untuk bimbingan akhir
     */
    public function finalEvaluation()
    {
        return $this->state(function (array $attributes) {
            return [
                'final_evaluation' => [
                    'attendance' => $this->faker->numberBetween(70, 100),
                    'task_completion' => $this->faker->numberBetween(70, 100),
                    'innovation' => $this->faker->numberBetween(70, 100),
                    'teamwork' => $this->faker->numberBetween(70, 100),
                    'communication' => $this->faker->numberBetween(70, 100),
                ],
                'final_score' => $this->faker->numberBetween(70, 100),
                'supervisor_notes' => 'Evaluasi akhir magang: ' . $this->faker->sentence(),
            ];
        });
    }
}