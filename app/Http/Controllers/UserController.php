<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
        return Inertia::render('users/create', [
            'roles' => User::ROLES,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'string', Rule::in(array_keys(User::ROLES))],
        ], [
            'name.required' => 'Nama wajib diisi',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah terdaftar',
            'password.required' => 'Password wajib diisi',
            'password.min' => 'Password minimal 8 karakter',
            'role.required' => 'Role wajib dipilih',
            'role.in' => 'Role tidak valid',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);
        $user->logActivity('created', "Pengguna {$user->name} telah dibuat");

        return redirect()->route('users.index')
            ->with('flash', [
                'type' => 'success',
                'message' => 'Pengguna berhasil ditambahkan'
            ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('users/edit', [
            'user' => $user,
            'roles' => User::ROLES,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8'],
            'role' => ['required', 'string', Rule::in(array_keys(User::ROLES))],
        ], [
            'name.required' => 'Nama wajib diisi',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah terdaftar',
            'password.min' => 'Password minimal 8 karakter',
            'role.required' => 'Role wajib dipilih',
            'role.in' => 'Role tidak valid',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);
        $user->logActivity('updated', "Pengguna {$user->name} telah diperbarui");

        return redirect()->route('users.index')
            ->with('flash', [
                'type' => 'success',
                'message' => 'Pengguna berhasil diperbarui'
            ]);
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
