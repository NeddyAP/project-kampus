<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\DosenProfile;
use App\Models\MahasiswaProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['roles', 'dosenProfile', 'mahasiswaProfile'])
            ->when(request('search'), function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->roles->first()?->name,
                    'profile' => $user->dosenProfile ?? $user->mahasiswaProfile,
                    'created_at' => $user->created_at,
                ];
            });

        return Inertia::render('Admin/users/index', [
            'users' => $users,
            'filters' => request()->only(['search']),
        ]);
    }

    public function create()
    {
        $roles = Role::all();

        return Inertia::render('Admin/users/create', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|exists:roles,name',
            // Data profil dosen
            'nip' => Rule::requiredIf($request->role === 'dosen'),
            'bidang_keahlian' => Rule::requiredIf($request->role === 'dosen'),
            // Data profil mahasiswa
            'nim' => Rule::requiredIf($request->role === 'mahasiswa'),
            'program_studi' => Rule::requiredIf($request->role === 'mahasiswa'),
            'angkatan' => Rule::requiredIf($request->role === 'mahasiswa'),
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole($request->role);

        // Buat profil berdasarkan role
        if ($request->role === 'dosen') {
            DosenProfile::create([
                'user_id' => $user->id,
                'nip' => $request->nip,
                'bidang_keahlian' => $request->bidang_keahlian,
            ]);
        } elseif ($request->role === 'mahasiswa') {
            MahasiswaProfile::create([
                'user_id' => $user->id,
                'nim' => $request->nim,
                'program_studi' => $request->program_studi,
                'angkatan' => $request->angkatan,
            ]);
        }

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'Pengguna berhasil ditambahkan');
    }

    public function edit(User $user)
    {
        $user->load(['roles', 'dosenProfile', 'mahasiswaProfile']);
        $roles = Role::all();

        return Inertia::render('Admin/users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->first()?->name,
                'profile' => $user->dosenProfile ?? $user->mahasiswaProfile,
            ],
            'roles' => $roles,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8',
            'role' => 'required|exists:roles,name',
            // Data profil dosen
            'nip' => Rule::requiredIf($request->role === 'dosen'),
            'bidang_keahlian' => Rule::requiredIf($request->role === 'dosen'),
            // Data profil mahasiswa
            'nim' => Rule::requiredIf($request->role === 'mahasiswa'),
            'program_studi' => Rule::requiredIf($request->role === 'mahasiswa'),
            'angkatan' => Rule::requiredIf($request->role === 'mahasiswa'),
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        if ($request->password) {
            $user->update(['password' => Hash::make($request->password)]);
        }

        // Update role jika berbeda
        if ($user->roles->first()?->name !== $request->role) {
            $user->syncRoles($request->role);
        }

        // Update atau buat profil berdasarkan role
        if ($request->role === 'dosen') {
            $user->dosenProfile()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'nip' => $request->nip,
                    'bidang_keahlian' => $request->bidang_keahlian,
                ]
            );
        } elseif ($request->role === 'mahasiswa') {
            $user->mahasiswaProfile()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'nim' => $request->nim,
                    'program_studi' => $request->program_studi,
                    'angkatan' => $request->angkatan,
                ]
            );
        }

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'Pengguna berhasil diperbarui');
    }

    public function destroy(User $user)
    {
        // Hapus profil terkait
        $user->dosenProfile?->delete();
        $user->mahasiswaProfile?->delete();
        
        // Hapus user
        $user->delete();

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'Pengguna berhasil dihapus');
    }
}