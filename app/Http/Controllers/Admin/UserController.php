<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Services\UserService;
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
    public function __construct(
        protected UserService $userService
    ) {
    }

    public function index(Request $request)
    {
        abort_if(!auth()->user()->isSuperAdmin() && $request->has('trashed'), 403);

        $query = User::with(['roles', 'adminProfile', 'dosenProfile', 'mahasiswaProfile'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->role, function ($query, $role) {
                $query->whereHas('roles', function ($q) use ($role) {
                    $q->where('name', $role);
                });
            })
            ->when(
                $request->sort,
                fn($query, $sort) => $query->orderBy($sort, $request->order ?? 'asc'),
                fn($query) => $query->orderBy('created_at', 'desc')
            )
            ->when(
                $request->trashed,
                fn($query) => $query->onlyTrashed(),
                fn($query) => $query->withoutTrashed()
            );

        // Get paginated results
        $users = $query->paginate($request->per_page ?? 10)
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

        // Get recent activities
        $recentActivities = $this->userService->getRecentActivities();
        
        // Get stats
        $stats = [
            'total' => User::count(),
            'active_users' => User::where('last_seen_at', '>=', now()->subDay())->count(),
            'recent_activities' => $recentActivities,
        ];

        return Inertia::render('Admin/users/index', [
            'users' => $users,
            'filters' => $request->only(['search', 'sort', 'order', 'per_page', 'trashed', 'role']),
            'roles' => User::getRoleNames(),
            'stats' => $stats,
            'can' => [
                'view_deleted' => auth()->user()->isSuperAdmin(),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/users/create', [
            'roles' => User::getRoleNames(),
            'dosen_users' => $this->userService->getDosenUsers(),
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        try {
            $this->userService->createUser($request->validated());

            return redirect()->route('admin.users.index')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Pengguna berhasil ditambahkan'
                ]);
        } catch (\Exception $e) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ]);
        }
    }

    public function edit(User $user)
    {
        $user->load(['adminProfile', 'dosenProfile', 'mahasiswaProfile']);

        // Get user's current role
        $role = $user->roles->first()?->name;
        $user->role = $role;

        return Inertia::render('Admin/users/edit', [
            'user' => $user,
            'roles' => User::getRoleNames(),
            'dosen_users' => $this->userService->getDosenUsers(),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        try {
            $this->userService->updateUser($user, $request->validated());

            return redirect()->route('admin.users.index')
                ->with('flash', [
                    'type' => 'success',
                    'message' => 'Pengguna berhasil diperbarui'
                ]);
        } catch (\Exception $e) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ]);
        }
    }

    public function destroy(User $user)
    {
        try {
            $this->userService->deleteUser($user);

            return back()->with('flash', [
                'type' => 'success',
                'message' => 'Pengguna berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    public function restore($id)
    {
        try {
            $this->userService->restoreUser($id);

            return back()->with('flash', [
                'type' => 'success',
                'message' => 'Pengguna berhasil dipulihkan'
            ]);
        } catch (\Exception $e) {
            return back()->with('flash', [
                'type' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }
}
