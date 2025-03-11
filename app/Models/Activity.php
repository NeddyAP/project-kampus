<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'causer_id',
        'action',
        'subject_type',
        'subject_id',
        'description',
    ];

    /**
     * Get the user that caused the activity.
     */
    public function causer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'causer_id');
    }

    /**
     * Get the subject of the activity.
     */
    public function subject(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Create a new activity log
     */
    public static function log(string $action, Model $subject, ?User $causer = null, ?string $description = null): self
    {
        return static::create([
            'causer_id' => $causer?->id,
            'action' => $action,
            'subject_type' => get_class($subject),
            'subject_id' => $subject->id,
            'description' => $description ?? sprintf(
                '%s %s %s',
                $causer?->name ?? 'System',
                $action,
                class_basename($subject)
            ),
        ]);
    }
}
