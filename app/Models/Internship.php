<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Internship extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'mahasiswa_id',
        'dosen_id',
        'approved_by',
        'category',
        'company_name',
        'company_address',
        'company_phone',
        'supervisor_name',
        'supervisor_phone',
        'start_date',
        'end_date',
        'cover_letter_path',
        'approval_letter_path',
        'report_file_path',
        'status',
        'rejection_reason',
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // Status constants
    const STATUS_DRAFT = 'DRAFT';

    const STATUS_MENUNGGU = 'MENUNGGU_PERSETUJUAN';

    const STATUS_DISETUJUI = 'DISETUJUI';

    const STATUS_DITOLAK = 'DITOLAK';

    const STATUS_BERJALAN = 'SEDANG_BERJALAN';

    const STATUS_SELESAI = 'SELESAI';

    // Category constants
    const CATEGORY_KKL = 'KKL';

    const CATEGORY_KKN = 'KKN';

    // Relationships
    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mahasiswa_id');
    }

    public function dosen(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dosen_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(InternshipLog::class);
    }

    public function supervisions(): HasMany
    {
        return $this->hasMany(InternshipSupervision::class);
    }

    // Scopes
    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    // Helper methods
    public function isActive(): bool
    {
        return in_array($this->status, [
            self::STATUS_DISETUJUI,
            self::STATUS_BERJALAN,
        ]);
    }

    public function canBeApproved(): bool
    {
        return $this->status === self::STATUS_MENUNGGU;
    }

    public function canBeRejected(): bool
    {
        return $this->status === self::STATUS_MENUNGGU;
    }

    public function canBeCompleted(): bool
    {
        return $this->status === self::STATUS_BERJALAN;
    }
}
