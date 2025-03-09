import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Link, router, usePage } from '@inertiajs/react';
import { type ColumnDef, Row } from '@tanstack/react-table';
import { Edit2, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    deleted_at?: string;
};

interface UserActionsCellProps {
    row: Row<User>;
}

function UserActionsCell({ row }: UserActionsCellProps) {
    const { auth } = usePage().props;
    const user = row.original;
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const isSuperAdmin = auth.user?.roles?.includes('admin');

    const handleDelete = () => {
        router.delete(`/users/${user.id}`);
    };

    return (
        <div className="flex justify-end gap-2">
            {user.deleted_at ? (
                isSuperAdmin && (
                    <Button variant="outline" size="icon" onClick={() => router.post(route('admin.users.restore', user.id))}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                )
            ) : (
                <>
                    <Button variant="outline" size="icon" asChild>
                        <Link href={route('admin.users.edit', user.id)}>
                            <Edit2 className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => setShowDeleteDialog(true)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>

                    <ConfirmDialog
                        open={showDeleteDialog}
                        onOpenChange={setShowDeleteDialog}
                        onConfirm={handleDelete}
                        title="Hapus Pengguna"
                        description={`Apakah Anda yakin ingin menghapus pengguna ${user.name}?`}
                    />
                </>
            )}
        </div>
    );
}

const roleColors = {
    admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    dosen: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    mahasiswa: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
} as const;

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'name',
        header: 'Nama',
        sortingFn: 'text',
        enableSorting: true,
    },
    {
        accessorKey: 'email',
        header: 'Email',
        sortingFn: 'text',
        enableSorting: true,
    },
    {
        accessorKey: 'role',
        header: 'Role',
        sortingFn: 'text',
        enableSorting: true,
        cell: ({ row }) => {
            const role = row.getValue('role') as keyof typeof roleColors;
            return (
                <Badge variant="secondary" className={roleColors[role]}>
                    {role === 'admin' ? 'Administrator' : role === 'dosen' ? 'Dosen' : 'Mahasiswa'}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Tanggal Dibuat',
        sortingFn: 'datetime',
        enableSorting: true,
        cell: ({ row }) => {
            return new Date(row.getValue('created_at')).toLocaleDateString('id-ID');
        },
    },
    {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => <UserActionsCell row={row} />,
    },
];
