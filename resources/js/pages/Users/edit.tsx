import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import UserForm from './components/user-form';

const breadcrumbs = [
    { title: 'User Management', href: '/users' },
    { title: 'Edit Pengguna', href: '/users/edit' },
];

export default function UserEdit({ user, roles }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Pengguna" />
            <div className="flex flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-semibold">Edit Pengguna</h1>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 overflow-hidden rounded-xl border p-4">
                    <UserForm user={user} roles={roles} mode="edit" />
                </div>
            </div>
        </AppLayout>
    );
}
