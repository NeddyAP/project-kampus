<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InternshipLog extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'internship_id',
        'user_id',
        'type',
        'title',
        'description',
        'metadata',
        'attachment_path',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    // Log types
    const TYPE_STATUS_CHANGE = 'STATUS_CHANGE';
    const TYPE_COMMENT = 'COMMENT';
    const TYPE_DOCUMENT_UPLOAD = 'DOCUMENT_UPLOAD';
    const TYPE_ACTIVITY_REPORT = 'ACTIVITY_REPORT';
    const TYPE_SUPERVISION = 'SUPERVISION';
    const TYPE_ATTENDANCE = 'ATTENDANCE';

    // Relationships
    public function internship(): BelongsTo
    {
        return $this->belongsTo(Internship::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByInternship($query, $internshipId)
    {
        return $query->where('internship_id', $internshipId);
    }

    // Helper methods
    public function getFormattedMetadata(): array
    {
        return $this->metadata ?? [];
    }

    public function hasAttachment(): bool
    {
        return !is_null($this->attachment_path);
    }
}
