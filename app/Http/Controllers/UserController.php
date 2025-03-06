<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Activity;
use App\Models\AdminProfile;
use App\Models\DosenProfile;
use App\Models\MahasiswaProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct()
    {
        Inertia::share('auth', function () {
            return [
                'user' => auth()->user() ? [
                    'id' => auth()->user()->id,
                    'name' => auth()->user()->name,
                    'email' => auth()->user()->email,
                    'role' => auth()->user()->role,
                ] : null,
            ];
        });
    }

    public function index(Request $request)
    {
        abort_if(!auth()->user()->isSuperAdmin() && $request->has('trashed'), 403);

        $users = User::query()
            ->when($request->search, function($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->when($request->sort, function($query, $sort) {
                [$column, $direction] = explode('.', $sort);
                if (in_array($column, ['name', 'email', 'role', 'created_at'])) {
                    $query->orderBy($column, $direction);
                }
            })
            ->when(auth()->user()->isSuperAdmin() && $request->has('trashed'), function($query) {
                $query->onlyTrashed();
            })
            ->with(['adminProfile', 'dosenProfile', 'mahasiswaProfile'])
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        $recentActivities = Activity::with('causer')
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($activity) {
                return [
                    'time' => $activity->created_at->diffForHumans(),
                    'description' => $activity->description,
                ];
            });

        $stats = [
            'last_activity_time' => $recentActivities->first() ? $recentActivities->first()['time'] : 'Tidak ada',
            'last_activity_description' => $recentActivities->first() ? $recentActivities->first()['description'] : 'Belum ada aktivitas',
            'active_users' => User::where('last_seen_at', '>=', now()->subDay())->count(),
            'recent_activities' => $recentActivities,
        ];

        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => $request->only(['search', 'sort', 'per_page', 'trashed']),
            'roles' => User::ROLES,
            'stats' => $stats,
            'can' => [
                'view_deleted' => auth()->user()->isSuperAdmin(),
            ],
        ]);
    }

    public function create()
    {
        $dosenUsers = User::where('role', 'dosen')->get(['id', 'name']);
        
        return Inertia::render('users/create', [
            'roles' => User::ROLES,
            'dosen_users' => $dosenUsers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'string', Rule::in(array_keys(User::ROLES))],
            // Admin profile fields
            'employee_id' => ['required_if:role,admin', 'nullable', 'string', 'unique:admin_profiles,employee_id'],
            'department' => ['required_if:role,admin', 'nullable', 'string'],
            'position' => ['required_if:role,admin', 'nullable', 'string'],
            'employment_status' => ['required_if:role,admin', 'nullable', Rule::in(['Tetap', 'Kontrak', 'Magang'])],
            'join_date' => ['required_if:role,admin', 'nullable', 'date'],
            'phone_number' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'supervisor_name' => ['nullable', 'string'],
            'work_location' => ['required_if:role,admin', 'nullable', 'string'],
            // Dosen profile fields
            'nip' => ['required_if:role,dosen', 'nullable', 'string', 'unique:dosen_profiles,nip'],
            'bidang_keahlian' => ['required_if:role,dosen', 'nullable', 'string'],
            'pendidikan_terakhir' => ['required_if:role,dosen', 'nullable', 'string'],
            'jabatan_akademik' => ['required_if:role,dosen', 'nullable', 'string'],
            'status_kepegawaian' => ['required_if:role,dosen', 'nullable', Rule::in(['PNS', 'Non-PNS'])],
            'tahun_mulai_mengajar' => ['required_if:role,dosen', 'nullable', 'integer', 'min:1900', 'max:' . date('Y')],
            // Mahasiswa profile fields
            'nim' => ['required_if:role,mahasiswa', 'nullable', 'string', 'unique:mahasiswa_profiles,nim'],
            'program_studi' => ['required_if:role,mahasiswa', 'nullable', 'string'],
            'angkatan' => ['required_if:role,mahasiswa', 'nullable', 'integer', 'min:2000', 'max:' . (date('Y') + 1)],
            'status_akademik' => ['required_if:role,mahasiswa', 'nullable', Rule::in(['Aktif', 'Cuti', 'Lulus'])],
            'semester' => ['required_if:role,mahasiswa', 'nullable', 'integer', 'min:1', 'max:14'],
            'dosen_pembimbing_id' => ['nullable', 'exists:users,id'],
            'ipk' => ['nullable', 'numeric', 'min:0', 'max:4.00'],
        ], [
            'name.required' => 'Nama wajib diisi',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah terdaftar',
            'password.required' => 'Password wajib diisi',
            'password.min' => 'Password minimal 8 karakter',
            'role.required' => 'Role wajib dipilih',
            'role.in' => 'Role tidak valid',
            // Admin validation messages
            'employee_id.required_if' => 'ID Pegawai wajib diisi untuk admin',
            'employee_id.unique' => 'ID Pegawai sudah terdaftar',
            'department.required_if' => 'Departemen wajib diisi untuk admin',
            'position.required_if' => 'Jabatan wajib diisi untuk admin',
            'employment_status.required_if' => 'Status kepegawaian wajib dipilih untuk admin',
            'join_date.required_if' => 'Tanggal bergabung wajib diisi untuk admin',
            'work_location.required_if' => 'Lokasi kerja wajib diisi untuk admin',
            // Dosen validation messages
            'nip.required_if' => 'NIP wajib diisi untuk dosen',
            'nip.unique' => 'NIP sudah terdaftar',
            'bidang_keahlian.required_if' => 'Bidang keahlian wajib diisi untuk dosen',
            'pendidikan_terakhir.required_if' => 'Pendidikan terakhir wajib diisi untuk dosen',
            'jabatan_akademik.required_if' => 'Jabatan akademik wajib diisi untuk dosen',
            'status_kepegawaian.required_if' => 'Status kepegawaian wajib dipilih untuk dosen',
            'tahun_mulai_mengajar.required_if' => 'Tahun mulai mengajar wajib diisi untuk dosen',
            // Mahasiswa validation messages
            'nim.required_if' => 'NIM wajib diisi untuk mahasiswa',
            'nim.unique' => 'NIM sudah terdaftar',
            'program_studi.required_if' => 'Program studi wajib diisi untuk mahasiswa',
            'angkatan.required_if' => 'Angkatan wajib diisi untuk mahasiswa',
            'status_akademik.required_if' => 'Status akademik wajib dipilih untuk mahasiswa',
            'semester.required_if' => 'Semester wajib diisi untuk mahasiswa',
            'ipk.max' => 'IPK maksimal 4.00',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'role' => $validated['role'],
            ]);

            if ($validated['role'] === 'admin' && isset($validated['employee_id'])) {
                AdminProfile::create([
                    'user_id' => $user->id,
                    'employee_id' => $validated['employee_id'],
                    'department' => $validated['department'],
                    'position' => $validated['position'],
                    'employment_status' => $validated['employment_status'],
                    'join_date' => $validated['join_date'],
                    'phone_number' => $validated['phone_number'] ?? null,
                    'address' => $validated['address'] ?? null,
                    'supervisor_name' => $validated['supervisor_name'] ?? null,
                    'work_location' => $validated['work_location'],
                ]);
            } elseif ($validated['role'] === 'dosen' && isset($validated['nip'])) {
                DosenProfile::create([
                    'user_id' => $user->id,
                    'nip' => $validated['nip'],
                    'bidang_keahlian' => $validated['bidang_keahlian'],
                    'pendidikan_terakhir' => $validated['pendidikan_terakhir'],
                    'jabatan_akademik' => $validated['jabatan_akademik'],
                    'status_kepegawaian' => $validated['status_kepegawaian'],
                    'tahun_mulai_mengajar' => $validated['tahun_mulai_mengajar'],
                ]);
            } elseif ($validated['role'] === 'mahasiswa' && isset($validated['nim'])) {
                MahasiswaProfile::create([
                    'user_id' => $user->id,
                    'nim' => $validated['nim'],
                    'program_studi' => $validated['program_studi'],
                    'angkatan' => $validated['angkatan'],
                    'status_akademik' => $validated['status_akademik'],
                    'semester' => $validated['semester'],
                    'dosen_pembimbing_id' => $validated['dosen_pembimbing_id'] ?? null,
                    'ipk' => $validated['ipk'] ?? null,
                ]);
            }

            $user->logActivity('created', "Pengguna {$user->name} telah dibuat");
            DB::commit();

            return redirect()->route('users.index')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Pengguna berhasil ditambahkan'
                ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ]);
        }
    }

    public function edit(User $user)
    {
        $user->load(['adminProfile', 'dosenProfile', 'mahasiswaProfile']);
        $dosenUsers = User::where('role', 'dosen')->get(['id', 'name']);
        
        return Inertia::render('users/edit', [
            'user' => $user,
            'roles' => User::ROLES,
            'dosen_users' => $dosenUsers,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8'],
            'role' => ['required', 'string', Rule::in(array_keys(User::ROLES))],
            // Admin profile fields
            'employee_id' => ['required_if:role,admin', 'nullable', 'string', Rule::unique('admin_profiles', 'employee_id')->ignore($user->adminProfile->id ?? null)],
            'department' => ['required_if:role,admin', 'nullable', 'string'],
            'position' => ['required_if:role,admin', 'nullable', 'string'],
            'employment_status' => ['required_if:role,admin', 'nullable', Rule::in(['Tetap', 'Kontrak', 'Magang'])],
            'join_date' => ['required_if:role,admin', 'nullable', 'date'],
            'phone_number' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'supervisor_name' => ['nullable', 'string'],
            'work_location' => ['required_if:role,admin', 'nullable', 'string'],
            // Dosen profile fields
            'nip' => ['required_if:role,dosen', 'nullable', 'string', Rule::unique('dosen_profiles', 'nip')->ignore($user->dosenProfile->id ?? null)],
            'bidang_keahlian' => ['required_if:role,dosen', 'nullable', 'string'],
            'pendidikan_terakhir' => ['required_if:role,dosen', 'nullable', 'string'],
            'jabatan_akademik' => ['required_if:role,dosen', 'nullable', 'string'],
            'status_kepegawaian' => ['required_if:role,dosen', 'nullable', Rule::in(['PNS', 'Non-PNS'])],
            'tahun_mulai_mengajar' => ['required_if:role,dosen', 'nullable', 'integer', 'min:1900', 'max:' . date('Y')],
            // Mahasiswa profile fields
            'nim' => ['required_if:role,mahasiswa', 'nullable', 'string', Rule::unique('mahasiswa_profiles', 'nim')->ignore($user->mahasiswaProfile->id ?? null)],
            'program_studi' => ['required_if:role,mahasiswa', 'nullable', 'string'],
            'angkatan' => ['required_if:role,mahasiswa', 'nullable', 'integer', 'min:2000', 'max:' . (date('Y') + 1)],
            'status_akademik' => ['required_if:role,mahasiswa', 'nullable', Rule::in(['Aktif', 'Cuti', 'Lulus'])],
            'semester' => ['required_if:role,mahasiswa', 'nullable', 'integer', 'min:1', 'max:14'],
            'dosen_pembimbing_id' => ['nullable', 'exists:users,id'],
            'ipk' => ['nullable', 'numeric', 'min:0', 'max:4.00'],
        ], [
            'name.required' => 'Nama wajib diisi',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah terdaftar',
            'password.min' => 'Password minimal 8 karakter',
            'role.required' => 'Role wajib dipilih',
            'role.in' => 'Role tidak valid',
            // Admin validation messages
            'employee_id.required_if' => 'ID Pegawai wajib diisi untuk admin',
            'employee_id.unique' => 'ID Pegawai sudah terdaftar',
            'department.required_if' => 'Departemen wajib diisi untuk admin',
            'position.required_if' => 'Jabatan wajib diisi untuk admin',
            'employment_status.required_if' => 'Status kepegawaian wajib dipilih untuk admin',
            'join_date.required_if' => 'Tanggal bergabung wajib diisi untuk admin',
            'work_location.required_if' => 'Lokasi kerja wajib diisi untuk admin',
            // Dosen validation messages
            'nip.required_if' => 'NIP wajib diisi untuk dosen',
            'nip.unique' => 'NIP sudah terdaftar',
            'bidang_keahlian.required_if' => 'Bidang keahlian wajib diisi untuk dosen',
            'pendidikan_terakhir.required_if' => 'Pendidikan terakhir wajib diisi untuk dosen',
            'jabatan_akademik.required_if' => 'Jabatan akademik wajib diisi untuk dosen',
            'status_kepegawaian.required_if' => 'Status kepegawaian wajib dipilih untuk dosen',
            'tahun_mulai_mengajar.required_if' => 'Tahun mulai mengajar wajib diisi untuk dosen',
            // Mahasiswa validation messages
            'nim.required_if' => 'NIM wajib diisi untuk mahasiswa',
            'nim.unique' => 'NIM sudah terdaftar',
            'program_studi.required_if' => 'Program studi wajib diisi untuk mahasiswa',
            'angkatan.required_if' => 'Angkatan wajib diisi untuk mahasiswa',
            'status_akademik.required_if' => 'Status akademik wajib dipilih untuk mahasiswa',
            'semester.required_if' => 'Semester wajib diisi untuk mahasiswa',
            'ipk.max' => 'IPK maksimal 4.00',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        DB::beginTransaction();
        try {
            $oldRole = $user->role;
            $newRole = $validated['role'];

            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $validated['role'],
            ]);

            if (isset($validated['password'])) {
                $user->update(['password' => $validated['password']]);
            }

            // Handle role change
            if ($oldRole !== $newRole) {
                // Delete old profile if exists
                if ($oldRole === 'admin' && $user->adminProfile) {
                    $user->adminProfile->delete();
                } elseif ($oldRole === 'dosen' && $user->dosenProfile) {
                    $user->dosenProfile->delete();
                } elseif ($oldRole === 'mahasiswa' && $user->mahasiswaProfile) {
                    $user->mahasiswaProfile->delete();
                }
            }

            // Create or update profile based on role
            if ($newRole === 'admin') {
                $adminProfile = $user->adminProfile ?? new AdminProfile();
                $adminProfile->user_id = $user->id;
                $adminProfile->employee_id = $validated['employee_id'];
                $adminProfile->department = $validated['department'];
                $adminProfile->position = $validated['position'];
                $adminProfile->employment_status = $validated['employment_status'];
                $adminProfile->join_date = $validated['join_date'];
                $adminProfile->phone_number = $validated['phone_number'] ?? null;
                $adminProfile->address = $validated['address'] ?? null;
                $adminProfile->supervisor_name = $validated['supervisor_name'] ?? null;
                $adminProfile->work_location = $validated['work_location'];
                $adminProfile->save();
            } elseif ($newRole === 'dosen') {
                $dosenProfile = $user->dosenProfile ?? new DosenProfile();
                $dosenProfile->user_id = $user->id;
                $dosenProfile->nip = $validated['nip'];
                $dosenProfile->bidang_keahlian = $validated['bidang_keahlian'];
                $dosenProfile->pendidikan_terakhir = $validated['pendidikan_terakhir'];
                $dosenProfile->jabatan_akademik = $validated['jabatan_akademik'];
                $dosenProfile->status_kepegawaian = $validated['status_kepegawaian'];
                $dosenProfile->tahun_mulai_mengajar = $validated['tahun_mulai_mengajar'];
                $dosenProfile->save();
            } elseif ($newRole === 'mahasiswa') {
                $mahasiswaProfile = $user->mahasiswaProfile ?? new MahasiswaProfile();
                $mahasiswaProfile->user_id = $user->id;
                $mahasiswaProfile->nim = $validated['nim'];
                $mahasiswaProfile->program_studi = $validated['program_studi'];
                $mahasiswaProfile->angkatan = $validated['angkatan'];
                $mahasiswaProfile->status_akademik = $validated['status_akademik'];
                $mahasiswaProfile->semester = $validated['semester'];
                $mahasiswaProfile->dosen_pembimbing_id = $validated['dosen_pembimbing_id'] ?? null;
                $mahasiswaProfile->ipk = $validated['ipk'] ?? null;
                $mahasiswaProfile->save();
            }

            $user->logActivity('updated', "Pengguna {$user->name} telah diperbarui");
            DB::commit();

            return redirect()->route('users.index')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Pengguna berhasil diperbarui'
                ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ]);
        }
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Anda tidak dapat menghapus akun Anda sendiri'
            ]);
        }

        $user->logActivity('deleted', "Pengguna {$user->name} telah dihapus");
        $user->delete();

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Pengguna berhasil dihapus'
        ]);
    }
    
    public function restore($id)
    {
        abort_if(!auth()->user()->isSuperAdmin(), 403);

        $user = User::onlyTrashed()->findOrFail($id);
        $user->restore();
        $user->logActivity('restored', "Pengguna {$user->name} telah dipulihkan");

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Pengguna berhasil dipulihkan'
        ]);
    }
}
