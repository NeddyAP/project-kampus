import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { SearchInput } from '@/components/ui/search-input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { columns } from './columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/users',
    },
];

export default function Index({ users, filters }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pengguna" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-4 md:min-h-min">
                    <div className="mb-4 flex items-center justify-between">
                        <SearchInput value={filters.search} />
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
                </div>
            </div>
        </AppLayout>
    );
}
