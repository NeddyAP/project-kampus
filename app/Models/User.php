<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'last_seen_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'last_seen_at' => 'datetime',
    ];

    // Helper methods
    public function isSuperAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    // Profiles
    public function adminProfile(): HasOne
    {
        return $this->hasOne(AdminProfile::class);
    }

    public function dosenProfile(): HasOne
    {
        return $this->hasOne(DosenProfile::class);
    }

    public function mahasiswaProfile(): HasOne
    {
        return $this->hasOne(MahasiswaProfile::class);
    }

    public function getProfileAttribute()
    {
        if ($this->hasRole('admin')) {
            return $this->adminProfile;
        } elseif ($this->hasRole('dosen')) {
            return $this->dosenProfile;
        } elseif ($this->hasRole('mahasiswa')) {
            return $this->mahasiswaProfile;
        }
        return null;
    }

    // Relationships for internship
    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class);
    }

    public function internshipBimbingan(): HasMany
    {
        return $this->hasMany(Internship::class, 'dosen_id');
    }

    public function internships(): HasMany
    {
        return $this->hasMany(Internship::class, 'mahasiswa_id');
    }

    // Helper method to get role display names
    public static function getRoleNames(): array
    {
        return [
            'admin' => 'Administrator',
            'dosen' => 'Dosen',
            'mahasiswa' => 'Mahasiswa',
        ];
    }
}
