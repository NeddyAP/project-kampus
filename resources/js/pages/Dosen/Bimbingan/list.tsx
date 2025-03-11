import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { DataTable } from '@/components/data-table/data-table';
import { InternshipData, internshipColumns } from '@/components/data-table/columns';

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
    return (
        <AppShell>
            <Head title="Daftar Mahasiswa Bimbingan" />
            <AppHeader />
            <AppContent>
                <div className="container mx-auto py-10">
                    <Link
                        href={route('dosen.bimbingan.index')}
                        className="mb-4 flex items-center space-x-2 text-sm hover:underline"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Kembali ke Dashboard
                    </Link>

                    {/* Daftar Mahasiswa Bimbingan dengan DataTable */}
                    <div className="rounded-md border p-6">
                        <h2 className="text-2xl font-semibold tracking-tight mb-6">
                            Daftar Mahasiswa Bimbingan
                        </h2>
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
