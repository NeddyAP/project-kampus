import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Link, router } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';

export type User = {
    id: number;
    name: string;
    email: string;
    created_at: string;
};

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'name',
        header: 'Nama',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'created_at',
        header: 'Tanggal Dibuat',
        cell: ({ row }) => {
            return new Date(row.getValue('created_at')).toLocaleDateString('id-ID');
        },
    },
    {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
            const user = row.original;
            const [showDeleteDialog, setShowDeleteDialog] = useState(false);

            const handleDelete = () => {
                router.delete(`/users/${user.id}`);
            };

            return (
                <div className="flex items-center gap-2">
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
                </div>
            );
        },
    },
];
