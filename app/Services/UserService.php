<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function getFilteredUsers(Request $request)
    {
        return User::with(['roles', 'adminProfile', 'dosenProfile', 'mahasiswaProfile'])
            ->when($request->search, function (Builder $query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when(
                $request->sort,
                fn ($query, $sort) => $query->orderBy($sort, $request->order ?? 'asc'),
                fn ($query) => $query->orderBy('created_at', 'desc')
            )
            ->when(
                $request->trashed,
                fn ($query) => $query->onlyTrashed(),
                fn ($query) => $query->withoutTrashed()
            )
            ->paginate($request->per_page ?? 10)
            ->withQueryString()
            ->through(function ($user) {
                $role = $user->roles->first()?->name;
                $user->role = $role;

                // Get the appropriate profile based on role
                switch ($role) {
                    case 'admin':
                        $user->profile_data = $user->adminProfile;
                        break;
                    case 'dosen':
                        $user->profile_data = $user->dosenProfile;
                        break;
                    case 'mahasiswa':
                        $user->profile_data = $user->mahasiswaProfile;
                        break;
                }

                return $user;
            });
    }

    public function getDosenUsers()
    {
        return User::role('dosen')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();
    }

    public function createUser(array $data)
    {
        return DB::transaction(function () use ($data) {
            // Create user
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);

            // Assign role
            $user->assignRole($data['role']);

            // Create profile based on role
            switch ($data['role']) {
                case 'admin':
                    $user->adminProfile()->create([
                        'employee_id' => $data['employee_id'] ?? null,
                        'department' => $data['department'] ?? null,
                        'position' => $data['position'] ?? null,
                        'employment_status' => $data['employment_status'] ?? 'Tetap',
                        'join_date' => $data['join_date'] ?? null,
                        'phone_number' => $data['phone_number'] ?? null,
                        'address' => $data['address'] ?? null,
                        'supervisor_name' => $data['supervisor_name'] ?? null,
                        'work_location' => $data['work_location'] ?? null,
                    ]);
                    break;

                case 'dosen':
                    $user->dosenProfile()->create([
                        'nip' => $data['nip'],
                        'bidang_keahlian' => $data['bidang_keahlian'],
                        'pendidikan_terakhir' => $data['pendidikan_terakhir'],
                        'jabatan_akademik' => $data['jabatan_akademik'],
                        'status_kepegawaian' => $data['status_kepegawaian'],
                        'tahun_mulai_mengajar' => $data['tahun_mulai_mengajar'],
                    ]);
                    break;

                case 'mahasiswa':
                    $user->mahasiswaProfile()->create([
                        'nim' => $data['nim'],
                        'program_studi' => $data['program_studi'],
                        'angkatan' => $data['angkatan'],
                        'semester' => $data['semester'],
                        'ipk' => $data['ipk'],
                        'dosen_pembimbing_id' => $data['dosen_pembimbing_id'],
                    ]);
                    break;
            }

            return $user;
        });
    }

    public function updateUser(User $user, array $data)
    {
        return DB::transaction(function () use ($user, $data) {
            // Update user data
            $user->update([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => isset($data['password']) ? Hash::make($data['password']) : $user->password,
            ]);

            // Update profile based on role
            $role = $user->roles->first()?->name;
            switch ($role) {
                case 'admin':
                    $user->adminProfile()->update([
                        'employee_id' => $data['employee_id'] ?? null,
                        'department' => $data['department'] ?? null,
                        'position' => $data['position'] ?? null,
                        'employment_status' => $data['employment_status'] ?? 'Tetap',
                        'join_date' => $data['join_date'] ?? null,
                        'phone_number' => $data['phone_number'] ?? null,
                        'address' => $data['address'] ?? null,
                        'supervisor_name' => $data['supervisor_name'] ?? null,
                        'work_location' => $data['work_location'] ?? null,
                    ]);
                    break;

                case 'dosen':
                    $user->dosenProfile()->update([
                        'nip' => $data['nip'],
                        'bidang_keahlian' => $data['bidang_keahlian'],
                        'pendidikan_terakhir' => $data['pendidikan_terakhir'],
                        'jabatan_akademik' => $data['jabatan_akademik'],
                        'status_kepegawaian' => $data['status_kepegawaian'],
                        'tahun_mulai_mengajar' => $data['tahun_mulai_mengajar'],
                    ]);
                    break;

                case 'mahasiswa':
                    $user->mahasiswaProfile()->update([
                        'nim' => $data['nim'],
                        'program_studi' => $data['program_studi'],
                        'angkatan' => $data['angkatan'],
                        'semester' => $data['semester'],
                        'ipk' => $data['ipk'],
                        'dosen_pembimbing_id' => $data['dosen_pembimbing_id'],
                    ]);
                    break;
            }

            return $user;
        });
    }

    public function deleteUser(User $user)
    {
        return DB::transaction(function () use ($user) {
            $role = $user->roles->first()?->name;

            // Delete specific profile first
            switch ($role) {
                case 'admin':
                    $user->adminProfile?->delete();
                    break;
                case 'dosen':
                    $user->dosenProfile?->delete();
                    break;
                case 'mahasiswa':
                    $user->mahasiswaProfile?->delete();
                    break;
            }

            // Then delete user
            return $user->delete();
        });
    }

    public function restoreUser($id)
    {
        return DB::transaction(function () use ($id) {
            $user = User::onlyTrashed()->findOrFail($id);
            $role = $user->roles->first()?->name;

            // Restore specific profile first
            switch ($role) {
                case 'admin':
                    $user->adminProfile()->restore();
                    break;
                case 'dosen':
                    $user->dosenProfile()->restore();
                    break;
                case 'mahasiswa':
                    $user->mahasiswaProfile()->restore();
                    break;
            }

            // Then restore user
            return $user->restore();
        });
    }

    public function getRecentActivities()
    {
        return DB::table('activities')
            ->join('users', 'activities.causer_id', '=', 'users.id')
            ->select('activities.*', 'users.name as user_name')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($activity) {
                return [
                    'description' => $activity->description,
                    'time' => Carbon::parse($activity->created_at)->diffForHumans(),
                ];
            });
    }

    public function getStats($recentActivities)
    {
        $lastDay = Carbon::now()->subDay();

        return [
            'active_users' => User::where('last_seen_at', '>=', $lastDay)->count(),
            'recent_activities' => $recentActivities,
        ];
    }
}
