<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $roles = [];

        if ($user) {
            $roles = [
                'isAdmin' => $user->hasRole('admin'),
                'isDosen' => $user->hasRole('dosen'),
                'isMahasiswa' => $user->hasRole('mahasiswa'),
            ];
        }

        return Inertia::render('welcome', [
            'auth' => [
                'user' => $user,
                'roles' => $roles
            ],
        ]);
    }
}
