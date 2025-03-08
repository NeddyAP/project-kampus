import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, School2, GraduationCap, UserCog, ArrowUp, ArrowDown } from 'lucide-react';
import { createActionColumn } from '@/components/data-table/columns';
import { formatDate } from '@/lib/utils';
import { PaginatedData } from '@/types';

interface UserProfile {
    nim?: string;
    nip?: string;
    program_studi?: string;
    bidang_keahlian?: string;
    angkatan?: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    profile: UserProfile;
    created_at: string;
}

interface Props {
    users: PaginatedData<User>;
    filters: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Pengguna',
        href: '/admin/users',
    },
];

const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className="-ml-4"
            >
                Nama
                {column.getIsSorted() === 'asc' ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                ) : column.getIsSorted() === 'desc' ? (
                    <ArrowDown className="ml-2 h-4 w-4" />
                ) : null}
            </Button>
        ),
    },
    {
        accessorKey: 'email',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className="-ml-4"
            >
                Email
                {column.getIsSorted() === 'asc' ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                ) : column.getIsSorted() === 'desc' ? (
                    <ArrowDown className="ml-2 h-4 w-4" />
                ) : null}
            </Button>
        ),
    },
    {
        accessorKey: 'role',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className="-ml-4"
            >
                Role
                {column.getIsSorted() === 'asc' ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                ) : column.getIsSorted() === 'desc' ? (
                    <ArrowDown className="ml-2 h-4 w-4" />
                ) : null}
            </Button>
        ),
        cell: ({ row }) => (
            <span className="capitalize">{row.getValue('role')}</span>
        ),
    },
    {
        id: 'identifier',
        header: 'NIM/NIP',
        cell: ({ row }) => {
            const profile = row.original.profile;
            return profile?.nim || profile?.nip || '-';
        },
    },
    {
        id: 'program',
        header: 'Program/Bidang',
        cell: ({ row }) => {
            const profile = row.original.profile;
            return profile?.program_studi || profile?.bidang_keahlian || '-';
        },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className="-ml-4"
            >
                Tanggal Daftar
                {column.getIsSorted() === 'asc' ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                ) : column.getIsSorted() === 'desc' ? (
                    <ArrowDown className="ml-2 h-4 w-4" />
                ) : null}
            </Button>
        ),
        cell: ({ row }) => formatDate(row.getValue('created_at')),
    },
    createActionColumn<User>({
        editUrl: (user) => `/admin/users/${user.id}/edit`,
        deleteUrl: (user) => `/admin/users/${user.id}`,
    }),
];

const UsersIndex = ({ users, filters }: Props) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pengguna" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                            <UserCog className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{users.total}</div>
                            <p className="text-muted-foreground text-xs">Pengguna terdaftar</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Dosen</CardTitle>
                            <School2 className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {users.data.filter((u) => u.role === 'dosen').length}
                            </div>
                            <p className="text-muted-foreground text-xs">Dosen terdaftar</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Mahasiswa</CardTitle>
                            <GraduationCap className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {users.data.filter((u) => u.role === 'mahasiswa').length}
                            </div>
                            <p className="text-muted-foreground text-xs">Mahasiswa terdaftar</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <DataTable
                            columns={columns}
                            data={users.data}
                            pagination={{
                                current_page: users.current_page,
                                last_page: users.last_page,
                                per_page: users.per_page,
                                total: users.total,
                                links: users.links,
                            }}
                            searchable
                            searchParam="search"
                            searchPlaceholder="Cari berdasarkan nama atau email..."
                            filters={filters}
                            createButton={{
                                href: '/admin/users/create',
                                text: 'Tambah Pengguna',
                                icon: <Plus className="mr-2 h-4 w-4" />,
                                show: true,
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default UsersIndex;