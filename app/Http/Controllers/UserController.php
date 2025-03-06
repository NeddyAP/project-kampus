<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService
    ) {
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

        $users = $this->userService->getFilteredUsers($request);
        $recentActivities = $this->userService->getRecentActivities();
        $stats = $this->userService->getStats($recentActivities);

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
            'dosen_users' => $this->userService->getDosenUsers(),
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        try {
            $this->userService->createUser($request->validated());

            return redirect()->route('users.index')
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

        return Inertia::render('users/edit', [
            'user' => $user,
            'roles' => User::ROLES,
            'dosen_users' => $this->userService->getDosenUsers(),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        try {
            $this->userService->updateUser($user, $request->validated());

            return redirect()->route('users.index')
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
