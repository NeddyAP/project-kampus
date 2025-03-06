<?php

namespace App\Services;

use App\Models\User;
use App\Models\Activity;
use App\Models\AdminProfile;
use App\Models\DosenProfile;
use App\Models\MahasiswaProfile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class UserService
{
    public function getFilteredUsers(Request $request): LengthAwarePaginator
    {
        return User::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->when($request->sort, function ($query, $sort) {
                [$column, $direction] = explode('.', $sort);
                if (in_array($column, ['name', 'email', 'role', 'created_at'])) {
                    $query->orderBy($column, $direction);
                }
            })
            ->when(auth()->user()->isSuperAdmin() && $request->has('trashed'), function ($query) {
                $query->onlyTrashed();
            })
            ->with(['adminProfile', 'dosenProfile', 'mahasiswaProfile'])
            ->paginate($request->input('per_page', 10))
            ->withQueryString();
    }

    public function getRecentActivities()
    {
        return Activity::with('causer')
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($activity) {
                return [
                    'time' => $activity->created_at->diffForHumans(),
                    'description' => $activity->description,
                ];
            });
    }

    public function createUser(array $data): User
    {
        DB::beginTransaction();
        try {
            $data['password'] = Hash::make($data['password']);

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'role' => $data['role'],
            ]);

            $this->createUserProfile($user, $data);
            $user->logActivity('created', "Pengguna {$user->name} telah dibuat");

            DB::commit();
            return $user;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function updateUser(User $user, array $data): User
    {
        DB::beginTransaction();
        try {
            if (!empty($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }

            $user->update(array_filter([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'] ?? null,
            ]));

            $this->createUserProfile($user, array_merge($data, ['role' => $user->role]));
            $user->logActivity('updated', "Pengguna {$user->name} telah diperbarui");

            DB::commit();
            return $user;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    private function deleteOldProfile(User $user, string $oldRole): void
    {
        match ($oldRole) {
            'admin' => $user->adminProfile?->delete(),
            'dosen' => $user->dosenProfile?->delete(),
            'mahasiswa' => $user->mahasiswaProfile?->delete(),
            default => null
        };
    }

    private function createUserProfile(User $user, array $data): void
    {
        match ($data['role']) {
            'admin' => $this->createOrUpdateAdminProfile($user, $data),
            'dosen' => $this->createOrUpdateDosenProfile($user, $data),
            'mahasiswa' => $this->createOrUpdateMahasiswaProfile($user, $data),
            default => null
        };
    }

    private function createOrUpdateAdminProfile(User $user, array $data): void
    {
        $adminProfile = $user->adminProfile ?? new AdminProfile();
        $adminProfile->fill([
            'user_id' => $user->id,
            'employee_id' => $data['employee_id'],
            'department' => $data['department'],
            'position' => $data['position'],
            'employment_status' => $data['employment_status'],
            'join_date' => $data['join_date'],
            'phone_number' => $data['phone_number'] ?? null,
            'address' => $data['address'] ?? null,
            'supervisor_name' => $data['supervisor_name'] ?? null,
            'work_location' => $data['work_location'],
        ])->save();
    }

    private function createOrUpdateDosenProfile(User $user, array $data): void
    {
        $dosenProfile = $user->dosenProfile ?? new DosenProfile();
        $dosenProfile->fill([
            'user_id' => $user->id,
            'nip' => $data['nip'],
            'bidang_keahlian' => $data['bidang_keahlian'],
            'pendidikan_terakhir' => $data['pendidikan_terakhir'],
            'jabatan_akademik' => $data['jabatan_akademik'],
            'status_kepegawaian' => $data['status_kepegawaian'],
            'tahun_mulai_mengajar' => $data['tahun_mulai_mengajar'],
        ])->save();
    }

    private function createOrUpdateMahasiswaProfile(User $user, array $data): void
    {
        $mahasiswaProfile = $user->mahasiswaProfile ?? new MahasiswaProfile();
        $mahasiswaProfile->fill([
            'user_id' => $user->id,
            'nim' => $data['nim'],
            'program_studi' => $data['program_studi'],
            'angkatan' => $data['angkatan'],
            'status_akademik' => $data['status_akademik'],
            'semester' => $data['semester'],
            'dosen_pembimbing_id' => $data['dosen_pembimbing_id'] ?? null,
            'ipk' => $data['ipk'] ?? null,
        ])->save();
    }

    public function getStats($recentActivities): array
    {
        return [
            'last_activity_time' => $recentActivities->first() ? $recentActivities->first()['time'] : 'Tidak ada',
            'last_activity_description' => $recentActivities->first() ? $recentActivities->first()['description'] : 'Belum ada aktivitas',
            'active_users' => User::where('last_seen_at', '>=', now()->subDay())->count(),
            'recent_activities' => $recentActivities,
        ];
    }

    public function getDosenUsers()
    {
        return User::where('role', 'dosen')->get(['id', 'name']);
    }

    public function deleteUser(User $user): void
    {
        if ($user->id === auth()->id()) {
            throw new \Exception('Anda tidak dapat menghapus akun Anda sendiri');
        }

        $user->logActivity('deleted', "Pengguna {$user->name} telah dihapus");
        $user->delete();
    }

    public function restoreUser($id): void
    {
        if (!auth()->user()->isSuperAdmin()) {
            throw new \Exception('Unauthorized');
        }

        $user = User::onlyTrashed()->findOrFail($id);
        $user->restore();
        $user->logActivity('restored', "Pengguna {$user->name} telah dipulihkan");
    }
}
