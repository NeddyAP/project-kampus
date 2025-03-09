import { DataTable } from '@/components/data-table/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Activity, Plus, Signal, Users } from 'lucide-react';
import { columns } from './columns';

// Define the User type with the required properties
interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    profile_data?: Record<string, unknown>;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

interface Props {
    users: PaginatedData<User>;
    filters: Record<string, string>;
    stats: {
        total: number;
        active_users: number;
        recent_activities: { description: string; time: string }[];
    };
    roles: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Pengguna',
        href: '/admin/users',
    },
];

export default function UserIndex({ users, filters, stats, roles }: Props) {
    const handleRoleChange = (value: string) => {
        const url = new URL(window.location.href);

        // Reset to page 1 when changing role
        url.searchParams.delete('page');

        if (value && value !== 'ALL') {
            url.searchParams.set('role', value);
        } else {
            url.searchParams.delete('role');
        }

        router.get(url.toString(), {}, { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pengguna" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid gap-4 md:grid-cols-12">
                    <Card className="md:col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-muted-foreground text-xs">Terdaftar dalam sistem</p>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pengguna Aktif</CardTitle>
                            <Signal className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_users}</div>
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
                                    {stats.recent_activities.length > 0 ? (
                                        stats.recent_activities.map((activity, index) => (
                                            <div key={index} className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <div className="text-muted-foreground text-sm">{activity.description}</div>
                                                </div>
                                                <div className="text-muted-foreground text-sm">{activity.time}</div>
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

                <div className="flex flex-col gap-4 md:flex-row">
                    <div className="w-full md:w-1/2">
                        <Select value={filters.role || 'ALL'} onValueChange={handleRoleChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter berdasarkan Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Semua Role</SelectItem>
                                {Object.entries(roles).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={users.data}
                    pagination={{
                        current_page: users.current_page,
                        last_page: users.last_page,
                        per_page: users.per_page,
                        total: users.total,
                        links: users.links,
                    }}
                    searchable={true}
                    searchPlaceholder="Cari pengguna..."
                    searchColumn="name"
                    searchParam="search"
                    filters={filters}
                    createButton={{
                        href: '/admin/users/create',
                        text: 'Tambah Pengguna',
                        icon: <Plus className="mr-2 h-4 w-4" />,
                        show: true,
                    }}
                />
            </div>
        </AppLayout>
    );
}
