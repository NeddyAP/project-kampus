import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link, router, usePage } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { Edit2, MoreHorizontal, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';

export type User = {
    id: number;
    name: string;
    email: string;
    created_at: string;
    deleted_at?: string;
};

function UserActionsCell({ row }) {
    const { auth } = usePage().props;
    const user = row.original;
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const isSuperAdmin = auth.user.role === 'superadmin';

    const handleDelete = () => {
        router.delete(`/users/${user.id}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {user.deleted_at ? (
                    isSuperAdmin && (
                        <DropdownMenuItem asChild>
                            <Link href={route('users.restore', user.id)} method="post" as="button" className="w-full">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Pulihkan
                            </Link>
                        </DropdownMenuItem>
                    )
                ) : (
                    <>
                        <Button variant="outline" size="icon" asChild>
                            <Link href={`/users/${user.id}/edit`}>
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
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

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
