<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InternshipSupervision extends Model
{
    use HasFactory;

    protected $fillable = [
        'internship_id',
        'dosen_id',
        'title',
        'notes',
        'attachment_path',
        'scheduled_at',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
    ];

    public function internship(): BelongsTo
    {
        return $this->belongsTo(Internship::class)->withDefault();
    }

    public function dosen(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dosen_id');
    }

    public function scopeUpcoming($query)
    {
        return $query->whereNotNull('scheduled_at')
            ->where('scheduled_at', '>', now());
    }
}
