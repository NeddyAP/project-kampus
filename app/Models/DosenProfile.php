<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DosenProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nip',
        'bidang_keahlian',
        'pendidikan_terakhir',
        'jabatan_akademik',
        'status_kepegawaian',
        'tahun_mulai_mengajar',
    ];

    protected $casts = [
        'tahun_mulai_mengajar' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function mahasiswaBimbingan()
    {
        return $this->hasMany(MahasiswaProfile::class, 'dosen_pembimbing_id', 'user_id');
    }
}
