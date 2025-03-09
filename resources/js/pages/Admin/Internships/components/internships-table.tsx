import { createActionColumn } from '@/components/data-table/columns';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { PaginationLink } from '@/types';
import { Internship } from '@/types/internship';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { StatusBadge } from './status-badge';

interface InternshipsTableProps {
    internships: Internship[];
    pagination?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: PaginationLink[];
    };
    filters?: Record<string, string>;
}

const columns: ColumnDef<Internship>[] = [
    {
        id: 'mahasiswa.name',
        accessorFn: (row) => row.mahasiswa?.name,
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-4">
                Nama Mahasiswa
                {column.getIsSorted() === 'asc' ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                ) : column.getIsSorted() === 'desc' ? (
                    <ArrowDown className="ml-2 h-4 w-4" />
                ) : null}
            </Button>
        ),
    },
    {
        id: 'mahasiswa.nim',
        accessorFn: (row) => row.mahasiswa?.nim,
        header: 'NIM',
    },
    {
        accessorKey: 'type',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-4">
                Tipe
                {column.getIsSorted() === 'asc' ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                ) : column.getIsSorted() === 'desc' ? (
                    <ArrowDown className="ml-2 h-4 w-4" />
                ) : null}
            </Button>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
    },
    {
        accessorKey: 'start_date',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-4">
                Tanggal Mulai
                {column.getIsSorted() === 'asc' ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                ) : column.getIsSorted() === 'desc' ? (
                    <ArrowDown className="ml-2 h-4 w-4" />
                ) : null}
            </Button>
        ),
        cell: ({ row }) => {
            const date = row.getValue('start_date');
            return date ? formatDate(date as string) : '-';
        },
    },
    {
        accessorKey: 'end_date',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-4">
                Tanggal Selesai
                {column.getIsSorted() === 'asc' ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                ) : column.getIsSorted() === 'desc' ? (
                    <ArrowDown className="ml-2 h-4 w-4" />
                ) : null}
            </Button>
        ),
        cell: ({ row }) => {
            const date = row.getValue('end_date');
            return date ? formatDate(date as string) : '-';
        },
    },
    createActionColumn<Internship>({
        viewUrl: (internship) => `/admin/internships/${internship.id}`,
        additionalMenuItems: (internship) =>
            [
                internship.status === 'MENUNGGU_PERSETUJUAN' && {
                    label: 'Persetujuan',
                    href: `/admin/internships/${internship.id}/approval`,
                },
                internship.status === 'DISETUJUI' &&
                    !internship.dosen_id && {
                        label: 'Assignment Dosen',
                        href: `/admin/internships/${internship.id}/assign`,
                    },
            ].filter(Boolean),
    }),
];

export function InternshipsTable({ internships, pagination, filters }: InternshipsTableProps) {
    return (
        <DataTable
            columns={columns}
            data={internships}
            pagination={pagination}
            searchable={true}
            searchPlaceholder="Cari berdasarkan nama mahasiswa..."
            searchColumn="mahasiswa.name"
            searchParam="search"
            filters={filters}
        />
    );
}
