import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SearchInput } from '@/components/ui/search-input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Activity, Plus, Signal, Users } from 'lucide-react';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

export default function UserIndex({ users, filters, stats }) {
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
                            <div className="text-2xl font-bold">{users.total}</div>
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
                                            <div
                                                key={index}
                                                className="border-border/50 flex items-start justify-between gap-4 border-b pb-4 text-sm last:border-0 last:pb-0"
                                            >
                                                <span className="flex-1">{activity.description}</span>
                                                <span className="text-muted-foreground whitespace-nowrap">{activity.time}</span>
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
                        <div className="mb-4 flex items-center justify-between">
                            <SearchInput value={filters.search} route={route('users.index')} params={{}} placeholder="Cari pengguna..." />
                            <Button asChild>
                                <Link href="/users/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Pengguna
                                </Link>
                            </Button>
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
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
