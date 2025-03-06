import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import UserForm from './components/user-form';

const breadcrumbs = [
    { title: 'User Management', href: '/users' },
    { title: 'Tambah Pengguna', href: '/users/create' },
];

export default function Create({ roles }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Pengguna" />
            <div className="flex flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-semibold">Tambah Pengguna</h1>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 overflow-hidden rounded-xl border p-4">
                    <UserForm roles={roles} mode="create" />
                </div>
            </div>
        </AppLayout>
    );
}
