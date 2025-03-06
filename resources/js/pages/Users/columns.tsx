import { Button } from '@/components/ui/button';
import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

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
        cell: ({ row }) => {
            const user = row.original;

            return (
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            );
        },
    },
];
