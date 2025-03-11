import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from '@inertiajs/react';
import { MoreHorizontal } from 'lucide-react';
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Interfaces untuk data tabel
export interface UpcomingSupervision {
    id: number;
    title: string;
    notes: string;
    scheduled_at: string;
    attachment_path: string | null;
    internship: {
        id: number;
        mahasiswa: {
            name: string;
        };
    };
}

export interface InternshipData {
    id: number;
    category: string;
    company_name: string;
    start_date: string;
    end_date: string;
    status: string;
    mahasiswa: {
        id: number;
        name: string;
    };
}

// Helper function untuk membuat kolom aksi
export const createActionColumn = <TData extends { id: number }>({ 
    view = true,
    edit = true,
    remove = true,
    viewRoute = '',
    editRoute = '',
    deleteRoute = '',
    onDelete,
}: {
    view?: boolean;
    edit?: boolean;
    remove?: boolean;
    viewRoute?: string;
    editRoute?: string;
    deleteRoute?: string;
    onDelete?: (id: number) => void;
}): ColumnDef<TData, any> => ({
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }) => {
        const id = row.original.id;

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Buka menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    {view && viewRoute && (
                        <DropdownMenuItem asChild>
                            <Link href={route(viewRoute, id)}>Lihat Detail</Link>
                        </DropdownMenuItem>
                    )}
                    {edit && editRoute && (
                        <DropdownMenuItem asChild>
                            <Link href={route(editRoute, id)}>Edit</Link>
                        </DropdownMenuItem>
                    )}
                    {remove && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => onDelete && onDelete(id)}
                            >
                                Hapus
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    },
});

// Fungsi utilitas
const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getCategoryDisplay = (category: string) => {
    switch (category) {
        case 'KKL':
            return 'Kuliah Kerja Lapangan (KKL)';
        case 'KKN':
            return 'Kuliah Kerja Nyata (KKN)';
        default:
            return category;
    }
};

const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
        case 'SELESAI':
            return 'default';
        case 'SEDANG_BERJALAN':
            return 'secondary';
        case 'DISETUJUI':
            return 'default';
        case 'MENUNGGU_PERSETUJUAN':
            return 'outline';
        case 'DITOLAK':
            return 'destructive';
        default:
            return 'secondary';
    }
};

const getStatusDisplay = (status: string) => {
    switch (status) {
        case 'SELESAI':
            return 'Selesai';
        case 'SEDANG_BERJALAN':
            return 'Sedang Berjalan';
        case 'DISETUJUI':
            return 'Disetujui';
        case 'MENUNGGU_PERSETUJUAN':
            return 'Menunggu Persetujuan';
        case 'DITOLAK':
            return 'Ditolak';
        default:
            return status;
    }
};

const calculateProgress = (internship: InternshipData) => {
    if (internship.status === 'SELESAI') return 100;
    if (internship.status === 'DITOLAK') return 0;
    if (internship.status === 'MENUNGGU_PERSETUJUAN') return 10;
    if (internship.status === 'DISETUJUI') return 30;

    if (internship.status === 'SEDANG_BERJALAN') {
        const startDate = new Date(internship.start_date);
        const endDate = new Date(internship.end_date);
        const today = new Date();

        if (today < startDate) return 30;
        if (today > endDate) return 90;

        const totalDuration = endDate.getTime() - startDate.getTime();
        const elapsedDuration = today.getTime() - startDate.getTime();
        const progressPercentage = (elapsedDuration / totalDuration) * 60 + 30;

        return Math.min(90, Math.max(30, progressPercentage));
    }

    return 0;
};

// Definisi kolom untuk tabel jadwal bimbingan yang akan datang
export const upcomingColumns: ColumnDef<UpcomingSupervision>[] = [
    {
        accessorKey: 'scheduled_at',
        header: 'Tanggal & Waktu',
        cell: ({ row }) => formatDateTime(row.original.scheduled_at),
        enableSorting: true,
    },
    {
        accessorKey: 'title',
        header: 'Judul',
        enableSorting: true,
        enableColumnFilter: true,
    },
    {
        accessorKey: 'notes',
        header: 'Catatan',
        cell: ({ row }) => (
            <div className="max-w-md truncate">{row.original.notes}</div>
        ),
        enableSorting: false,
    },
    {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => (
            <Button variant="outline" size="sm" asChild>
                <Link
                    href={route('dosen.bimbingan.attendance.form', {
                        supervision: row.original.id,
                    })}
                >
                    Isi Kehadiran
                </Link>
            </Button>
        ),
        enableSorting: false,
        enableColumnFilter: false,
    },
];

// Definisi kolom untuk tabel daftar mahasiswa bimbingan
export const internshipColumns: ColumnDef<InternshipData>[] = [
    {
        id: 'mahasiswa_name',
        accessorKey: 'mahasiswa.name',
        header: 'Nama Mahasiswa',
        enableSorting: true,
        enableColumnFilter: true,
    },
    {
        accessorKey: 'company_name',
        header: 'Perusahaan',
        enableSorting: true,
        enableColumnFilter: true,
    },
    {
        accessorKey: 'category',
        header: 'Kategori',
        cell: ({ row }) => getCategoryDisplay(row.original.category),
        enableSorting: true,
        enableColumnFilter: true,
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <Badge variant={getStatusBadgeVariant(row.original.status)}>
                {getStatusDisplay(row.original.status)}
            </Badge>
        ),
        enableSorting: true,
        enableColumnFilter: true,
    },
    {
        id: 'progress',
        header: 'Progress',
        cell: ({ row }) => {
            const progress = calculateProgress(row.original);
            return (
                <div className="w-[100px]">
                    <div className="mb-1 flex items-center justify-between text-sm">
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
            );
        },
        enableSorting: false,
        enableColumnFilter: false,
    },
    {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => (
            <Button variant="outline" size="sm" asChild className="w-[100px]">
                <Link href={route('dosen.bimbingan.show', row.original.id)}>
                    Detail
                </Link>
            </Button>
        ),
        enableSorting: false,
        enableColumnFilter: false,
    },
];
