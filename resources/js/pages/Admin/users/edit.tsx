import AppLayout from '@/layouts/app-layout';
import { User } from '@/types';
import { Head } from '@inertiajs/react';
import UserForm from './components/user-form';

interface Props {
    user: User;
    roles: Record<string, string>;
    dosen_users: Pick<User, 'id' | 'name'>[];
}

const breadcrumbs = [
    { title: 'User Management', href: '/admin/users' },
    { title: 'Edit Pengguna', href: '/admin/users/edit' },
];

export default function UserEdit({ user, roles, dosen_users }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Pengguna" />
            <div className="flex flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-semibold">Edit Pengguna</h1>
                <div className="relative flex-1 overflow-hidden rounded-xl border p-4">
                    <UserForm user={user} roles={roles} mode="edit" dosen_users={dosen_users} disabledFields={['role']} />
                </div>
            </div>
        </AppLayout>
    );
}
