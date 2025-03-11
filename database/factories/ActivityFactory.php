<?php

namespace Database\Factories;

use App\Models\Activity;
use App\Models\Internship;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActivityFactory extends Factory
{
    protected $model = Activity::class;

    public function definition(): array
    {
        // Randomly select subject type
        $subjectTypes = [
            Internship::class,
            User::class,
        ];
        $subjectClass = $this->faker->randomElement($subjectTypes);

        // Get random existing record ID
        $subjectId = match ($subjectClass) {
            Internship::class => Internship::inRandomOrder()->first()?->id,
            User::class => User::inRandomOrder()->first()?->id,
            default => null
        };

        $actions = [
            'created' => 'created new',
            'updated' => 'updated',
            'deleted' => 'deleted',
            'restored' => 'restored',
            'approved' => 'approved',
            'rejected' => 'rejected',
            'completed' => 'completed',
        ];

        $action = $this->faker->randomElement(array_keys($actions));
        $actionText = $actions[$action];

        return [
            'causer_id' => User::role('admin')->inRandomOrder()->first()?->id,
            'action' => $action,
            'subject_type' => $subjectClass,
            'subject_id' => $subjectId,
            'description' => function (array $attrs) use ($actionText) {
                $causer = User::find($attrs['causer_id']);
                $subjectType = class_basename($attrs['subject_type']);

                return "{$causer->name} {$actionText} {$subjectType}";
            },
        ];
    }

    /**
     * Configure the model factory.
     */
    public function configure()
    {
        return $this->afterMaking(function (Activity $activity) {
            //
        })->afterCreating(function (Activity $activity) {
            //
        });
    }
}
