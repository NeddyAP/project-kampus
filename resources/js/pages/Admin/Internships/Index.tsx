import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedData } from '@/types';
import { Internship, InternshipStatus, InternshipType } from '@/types/internship';
import { Head, router } from '@inertiajs/react';
import { Activity, Signal, Users } from 'lucide-react';
import { DataTable } from '@/components/data-table/data-table';
import { columns } from './columns';

interface Props {
    internships: PaginatedData<Internship>;
    filters: Record<string, string>;
    stats: {
        total: number;
        menunggu_persetujuan: number;
        disetujui: number;
        ditolak: number;
    };
    recentActivities: {
        id: number;
        mahasiswa_name: string;
        type: string;
        status: string;
        created_at: string;
    }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Magang',
        href: '/admin/internships',
    },
];

const InternshipsIndex = ({ internships, filters, stats, recentActivities }: Props) => {
    const handleStatusChange = (value: InternshipStatus | 'ALL') => {
        updateFilters('status', value);
    };

    const handleTypeChange = (value: InternshipType | 'ALL') => {
        updateFilters('type', value);
    };

    const updateFilters = (key: string, value: string) => {
        const url = new URL(window.location.href);

        // Reset to page 1 when changing filters
        url.searchParams.delete('page');

        if (value && value !== 'ALL') {
            url.searchParams.set(key, value);
        } else {
            url.searchParams.delete(key);
        }

        router.get(url.toString(), {}, { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Magang" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid gap-4 md:grid-cols-12">
                    <Card className="md:col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ringkasan Magang</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-muted-foreground text-xs">Total pengajuan magang</p>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Status Magang</CardTitle>
                            <Signal className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div>
                                    <div className="text-sm">Menunggu Persetujuan</div>
                                    <div className="text-xl font-bold">{stats.menunggu_persetujuan}</div>
                                </div>
                                <div>
                                    <div className="text-sm">Disetujui</div>
                                    <div className="text-xl font-bold">{stats.disetujui}</div>
                                </div>
                                <div>
                                    <div className="text-sm">Ditolak</div>
                                    <div className="text-xl font-bold">{stats.ditolak}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-6">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Aktivitas Terakhir</CardTitle>
                            <Activity className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[125px] px-4">
                                <div className="space-y-4 pr-4">
                                    {recentActivities.map((activity, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <div className="font-medium">{activity.mahasiswa_name}</div>
                                                <div className="text-muted-foreground text-sm">
                                                    {activity.type} - {activity.status.replace(/_/g, ' ')}
                                                </div>
                                            </div>
                                            <div className="text-muted-foreground text-sm">{activity.created_at}</div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col gap-4 md:flex-row">
                    <div className="w-full md:w-1/2">
                        <Select value={filters.status || 'ALL'} onValueChange={(value) => handleStatusChange(value as InternshipStatus | 'ALL')}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status Magang" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Semua Status</SelectItem>
                                <SelectItem value="MENUNGGU_PERSETUJUAN">Menunggu Persetujuan</SelectItem>
                                <SelectItem value="DISETUJUI">Disetujui</SelectItem>
                                <SelectItem value="DITOLAK">Ditolak</SelectItem>
                                <SelectItem value="SEDANG_BERJALAN">Sedang Berjalan</SelectItem>
                                <SelectItem value="SELESAI">Selesai</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full md:w-1/2">
                        <Select value={filters.type || 'ALL'} onValueChange={(value) => handleTypeChange(value as InternshipType | 'ALL')}>
                            <SelectTrigger>
                                <SelectValue placeholder="Tipe Magang" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Semua Tipe</SelectItem>
                                <SelectItem value="KKL">KKL</SelectItem>
                                <SelectItem value="KKN">KKN</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={internships.data}
                    pagination={{
                        current_page: internships.current_page,
                        last_page: internships.last_page,
                        per_page: internships.per_page,
                        total: internships.total,
                        links: internships.links,
                    }}
                    searchable={true}
                    searchPlaceholder="Cari magang..."
                    searchColumn="mahasiswa_name"
                    searchParam="search"
                    filters={filters}
                />
            </div>
        </AppLayout>
    );
};

export default InternshipsIndex;
