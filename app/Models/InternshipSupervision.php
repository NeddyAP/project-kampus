<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InternshipSupervision extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'internship_id',
        'dosen_id',
        'supervision_date',
        'supervision_type',
        'supervision_location',
        'progress_notes',
        'improvements_needed',
        'progress_score',
        'final_evaluation',
        'final_score',
        'supervisor_notes',
        'attachment_path',
    ];

    protected $casts = [
        'supervision_date' => 'date',
        'final_evaluation' => 'array',
        'progress_score' => 'integer',
        'final_score' => 'integer',
    ];

    // Supervision types
    const TYPE_ONLINE = 'ONLINE';
    const TYPE_OFFLINE = 'OFFLINE';
    const TYPE_HYBRID = 'HYBRID';

    // Relationships
    public function internship(): BelongsTo
    {
        return $this->belongsTo(Internship::class);
    }

    public function dosen(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dosen_id');
    }

    // Scopes
    public function scopeByInternship($query, $internshipId)
    {
        return $query->where('internship_id', $internshipId);
    }

    public function scopeByDosen($query, $dosenId)
    {
        return $query->where('dosen_id', $dosenId);
    }

    // Helper methods
    public function hasAttachment(): bool
    {
        return !is_null($this->attachment_path);
    }

    public function hasFinalEvaluation(): bool
    {
        return !is_null($this->final_evaluation);
    }

    public function getProgressStatus(): string
    {
        if ($this->progress_score >= 85) return 'Sangat Baik';
        if ($this->progress_score >= 75) return 'Baik';
        if ($this->progress_score >= 65) return 'Cukup';
        return 'Perlu Perbaikan';
    }

    public function getFinalStatus(): string
    {
        if (is_null($this->final_score)) return 'Belum Ada Nilai';
        if ($this->final_score >= 85) return 'A';
        if ($this->final_score >= 75) return 'B';
        if ($this->final_score >= 65) return 'C';
        return 'D';
    }
}
