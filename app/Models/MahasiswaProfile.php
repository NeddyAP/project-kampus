<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MahasiswaProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nim',
        'program_studi',
        'angkatan',
        'status_akademik',
        'semester',
        'dosen_pembimbing_id',
        'ipk',
    ];

    protected $casts = [
        'angkatan' => 'integer',
        'semester' => 'integer',
        'ipk' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function dosenPembimbing()
    {
        return $this->belongsTo(User::class, 'dosen_pembimbing_id');
    }
}
