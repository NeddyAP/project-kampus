import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PaginatedData } from '@/types';
import { Internship, InternshipLog } from '@/types/internship';
import { Head } from '@inertiajs/react';
import { Activity, Briefcase, FileCheck } from 'lucide-react';
import { columns } from './columns';

interface Props {
    internships: PaginatedData<Internship>;
    filters: Record<string, string>;
    stats: {
        pending_count: number;
        approved_count: number;
        rejected_count: number;
        recent_activities: InternshipLog[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Magang',
        href: route('admin.magang.index'),
    },
];

export default function InternshipsIndex({ internships, filters, stats }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Magang" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid gap-4 md:grid-cols-12">
                    <Card className="md:col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Menunggu Persetujuan</CardTitle>
                            <FileCheck className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_count}</div>
                            <p className="text-muted-foreground text-xs">Pengajuan baru</p>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Magang Aktif</CardTitle>
                            <Briefcase className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.approved_count}</div>
                            <p className="text-muted-foreground text-xs">Sedang berlangsung</p>
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
                                    {stats.recent_activities.length > 0 ? (
                                        stats.recent_activities.map((activity) => (
                                            <div
                                                key={activity.id}
                                                className="border-border/50 flex items-start justify-between gap-4 border-b pb-4 text-sm last:border-0 last:pb-0"
                                            >
                                                <span className="flex-1">{activity.title}</span>
                                                <span className="text-muted-foreground whitespace-nowrap">{activity.created_at}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted-foreground text-sm">Belum ada aktivitas</p>
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                <Card className="flex-1">
                    <CardContent className="p-4">
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
                            searchPlaceholder="Cari mahasiswa atau perusahaan..."
                            searchParam="search"
                            filters={filters}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

InternshipsIndex.layout = 'admin';
