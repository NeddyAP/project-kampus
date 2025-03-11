<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create roles
        $admin = Role::create(['name' => 'admin']);
        $dosen = Role::create(['name' => 'dosen']);
        $mahasiswa = Role::create(['name' => 'mahasiswa']);

        // Create permissions
        $permissions = [
            // Manajemen user
            'view users',
            'create users',
            'edit users',
            'delete users',

            // Manajemen magang
            'view internships',
            'create internships',
            'edit internships',
            'delete internships',
            'approve internships',
            'supervise internships',
            'upload documents',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Assign permissions to roles
        $admin->givePermissionTo([
            'view users',
            'create users',
            'edit users',
            'delete users',
            'view internships',
            'edit internships',
            'delete internships',
            'approve internships',
        ]);

        $dosen->givePermissionTo([
            'view internships',
            'supervise internships',
        ]);

        $mahasiswa->givePermissionTo([
            'view internships',
            'create internships',
            'upload documents',
        ]);
    }
}
