import { Button } from '@/components/ui/button';
import { Internship } from '@/types/internship';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Eye } from 'lucide-react';
import { StatusBadge } from './components/status-badge';

export const columns: ColumnDef<Internship>[] = [
    {
        accessorKey: 'mahasiswa.name',
        header: 'Mahasiswa',
        cell: ({ row }) => <div className="font-medium">{row.original.mahasiswa?.name}</div>,
    },
    {
        accessorKey: 'category',
        header: 'Kategori',
    },
    {
        accessorKey: 'company_name',
        header: 'Perusahaan',
        cell: ({ row }) => (
            <div className="space-y-1">
                <div className="font-medium">{row.original.company_name}</div>
                <div className="text-muted-foreground text-sm">{row.original.supervisor_name}</div>
            </div>
        ),
    },
    {
        accessorKey: 'start_date',
        header: 'Periode',
        cell: ({ row }) => (
            <div className="space-y-1">
                <div>{format(new Date(row.original.start_date), 'dd MMM yyyy', { locale: id })}</div>
                <div className="text-muted-foreground text-sm">s/d {format(new Date(row.original.end_date), 'dd MMM yyyy', { locale: id })}</div>
            </div>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
        accessorKey: 'dosen.name',
        header: 'Dosen Pembimbing',
        cell: ({ row }) => <div>{row.original.dosen?.name ?? <span className="text-muted-foreground">Belum ditugaskan</span>}</div>,
    },
    {
        accessorKey: 'created_at',
        header: 'Tanggal Pengajuan',
        cell: ({ row }) => format(new Date(row.getValue('created_at')), 'dd MMM yyyy HH:mm', { locale: id }),
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <div className="flex justify-end">
                <Button variant="ghost" size="icon" asChild className="hover:bg-background">
                    <Link href={route('admin.magang.show', row.original.id)}>
                        <Eye className="h-4 w-4" />
                    </Link>
                </Button>
            </div>
        ),
    },
];
