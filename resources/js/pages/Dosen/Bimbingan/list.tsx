import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { InternshipData, internshipColumns } from '@/components/data-table/columns';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, Filter } from 'lucide-react';
import { useState } from 'react';

interface Props {
    internships: {
        data: InternshipData[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters?: {
        search?: string;
        status?: string;
        category?: string;
        sort_field?: string;
        sort_order?: 'asc' | 'desc';
        per_page?: number;
    };
}

export default function DaftarMahasiswaBimbingan({ internships, filters }: Props) {
    const [category, setCategory] = useState<string>(filters?.category || '');
    const [status, setStatus] = useState<string>(filters?.status || '');

    const handleCategoryChange = (value: string) => {
        setCategory(value);
        router.get(
            route('dosen.bimbingan.list'),
            {
                ...filters,
                category: value,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        router.get(
            route('dosen.bimbingan.list'),
            {
                ...filters,
                status: value,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleResetFilter = () => {
        setCategory('');
        setStatus('');
        router.get(
            route('dosen.bimbingan.list'),
            {
                ...filters,
                category: '',
                status: '',
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const isFiltersActive = category || status;

    return (
        <AppShell>
            <Head title="Daftar Mahasiswa Bimbingan" />
            <AppHeader />
            <AppContent>
                <div className="container mx-auto py-10">
                    <Link href={route('dosen.bimbingan.index')} className="mb-4 flex items-center space-x-2 text-sm hover:underline">
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Kembali ke Dashboard
                    </Link>

                    {/* Daftar Mahasiswa Bimbingan dengan DataTable */}
                    <div className="rounded-md border p-6">
                        <h2 className="mb-6 text-2xl font-semibold tracking-tight">Daftar Mahasiswa Bimbingan</h2>

                        {/* Filter Kategori dan Status */}
                        <div className="mb-6 flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                <span className="text-sm font-medium">Filter:</span>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                {/* Filter Kategori */}
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground text-sm">Kategori:</span>
                                    <div className="w-[180px]">
                                        <Select value={category} onValueChange={handleCategoryChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Kategori" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="KKL">KKL</SelectItem>
                                                    <SelectItem value="KKN">KKN</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Filter Status */}
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground text-sm">Status:</span>
                                    <div className="w-[200px]">
                                        <Select value={status} onValueChange={handleStatusChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                                    <SelectItem value="MENUNGGU_PERSETUJUAN">Menunggu Persetujuan</SelectItem>
                                                    <SelectItem value="DISETUJUI">Disetujui</SelectItem>
                                                    <SelectItem value="DITOLAK">Ditolak</SelectItem>
                                                    <SelectItem value="SEDANG_BERJALAN">Sedang Berjalan</SelectItem>
                                                    <SelectItem value="SELESAI">Selesai</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {isFiltersActive && (
                                <div className="ml-auto">
                                    <Button variant="outline" size="sm" onClick={handleResetFilter}>
                                        Reset Filter
                                    </Button>
                                </div>
                            )}

                            {/* Filter Tags */}
                            {isFiltersActive && (
                                <div className="mt-2 flex w-full flex-wrap gap-2">
                                    {category && <Badge variant="outline">Kategori: {category}</Badge>}
                                    {status && (
                                        <Badge variant="outline">
                                            Status:{' '}
                                            {status === 'pending'
                                                ? 'Pending'
                                                : status === 'active'
                                                  ? 'Aktif'
                                                  : status === 'completed'
                                                    ? 'Selesai'
                                                    : 'Ditolak'}
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </div>

                        <DataTable
                            columns={internshipColumns}
                            data={internships.data}
                            searchPlaceholder="Cari berdasarkan nama mahasiswa..."
                            searchColumn="mahasiswa_name"
                        />
                    </div>
                </div>
            </AppContent>
        </AppShell>
    );
}
