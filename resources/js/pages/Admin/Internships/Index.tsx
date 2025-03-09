import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Internship, InternshipStatus, InternshipType } from '@/types/internship';
import { Head } from '@inertiajs/react';
import { Activity, Signal, Users } from 'lucide-react';
import { useState } from 'react';
import { FilterForm } from './components/filter-form';
import { InternshipsTable } from './components/internships-table';

interface Props {
    internships: Internship[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Magang',
        href: '/admin/internships',
    },
];

const InternshipsIndex = ({ internships: initialInternships }: Props) => {
    const [status, setStatus] = useState<InternshipStatus | 'ALL'>('ALL');
    const [type, setType] = useState<InternshipType | 'ALL'>('ALL');

    // Filter internships berdasarkan search, status, dan type
    const filteredInternships = initialInternships.filter((internship) => {
        const matchStatus = status === 'ALL' ? true : internship.status === status;
        const matchType = type === 'ALL' ? true : internship.type === type;

        return matchStatus && matchType;
    });

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
                            <div className="text-2xl font-bold">{initialInternships.length}</div>
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
                                    <div className="text-xl font-bold">
                                        {initialInternships.filter((i) => i.status === 'MENUNGGU_PERSETUJUAN').length}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm">Disetujui</div>
                                    <div className="text-xl font-bold">{initialInternships.filter((i) => i.status === 'DISETUJUI').length}</div>
                                </div>
                                <div>
                                    <div className="text-sm">Ditolak</div>
                                    <div className="text-xl font-bold">{initialInternships.filter((i) => i.status === 'DITOLAK').length}</div>
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
                                    {initialInternships.slice(0, 5).map((internship) => (
                                        <div key={internship.id} className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <div className="font-medium">{internship.mahasiswa?.name}</div>
                                                <div className="text-muted-foreground text-sm">
                                                    {internship.type} - {internship.status.replace(/_/g, ' ')}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                <FilterForm status={status} type={type} onStatusChange={setStatus} onTypeChange={setType} />

                <InternshipsTable internships={filteredInternships} />
            </div>
        </AppLayout>
    );
};

export default InternshipsIndex;
