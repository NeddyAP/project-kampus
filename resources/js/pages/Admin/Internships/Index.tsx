import Heading from '@/components/heading-small';
import { FilterForm } from '@/components/internship/filter-form';
import { InternshipsTable } from '@/components/internship/internships-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Internship, InternshipStatus, InternshipType } from '@/types/internship';
import { Head } from '@inertiajs/react';
import { Activity, Signal, Users } from 'lucide-react';
import { useState } from 'react';

interface Props {
    internships: Internship[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Magang',
        href: '/internships',
    },
];


const InternshipsIndex = ({ internships: initialInternships }: Props) => {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<InternshipStatus | 'ALL'>('ALL');
    const [type, setType] = useState<InternshipType | 'ALL'>('ALL');

    // Filter internships berdasarkan search, status, dan type
    const filteredInternships = initialInternships.filter((internship) => {
        const matchSearch = internship.mahasiswa?.name.toLowerCase().includes(search.toLowerCase());
        const matchStatus = status === 'ALL' ? true : internship.status === status;
        const matchType = type === 'ALL' ? true : internship.type === type;

        return matchSearch && matchStatus && matchType;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Magang" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid gap-4 md:grid-cols-12">
                    <Card className="md:col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold"></div>
                            <p className="text-muted-foreground text-xs">Terdaftar dalam sistem</p>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pengguna Aktif</CardTitle>
                            <Signal className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold"></div>
                            <p className="text-muted-foreground text-xs">Online dalam 24 jam terakhir</p>
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

                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                <FilterForm
                    search={search}
                    status={status}
                    type={type}
                    onSearchChange={setSearch}
                    onStatusChange={setStatus}
                    onTypeChange={setType}
                />

                <InternshipsTable internships={filteredInternships} />
            </div>
        </AppLayout >
    );
};

export default InternshipsIndex;
