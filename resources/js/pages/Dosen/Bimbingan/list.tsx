import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Head, InertiaLinkProps, Link } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { ChevronLeft } from 'lucide-react';

type BadgeVariants = NonNullable<Parameters<typeof badgeVariants>[0]>['variant'];

interface InternshipLog {
    id: number;
    type: string;
    notes: string | null;
    user: {
        id: number;
        name: string;
    };
}

interface Internship {
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
    logs: InternshipLog[];
}

interface Props {
    internships: {
        data: Internship[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: InertiaLinkProps[];
    };
}

export default function DaftarMahasiswaBimbingan({ internships }: Props) {
    // Function to calculate progress percentage
    const calculateProgress = (internship: Internship) => {
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

    // Function to get status badge color
    const getStatusBadgeVariant = (status: string): BadgeVariants => {
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

    // Function to get status display text
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

    // Function to get category display text
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

    return (
        <AppShell>
            <Head title="Daftar Mahasiswa Bimbingan" />
            <AppHeader />
            <AppContent>
                <div className="container mx-auto py-10">
                    <Link href={route('dosen.bimbingan.index')} className="mb-4 flex items-center space-x-2 text-sm hover:underline">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Kembali ke Dashboard
                    </Link>
                    {/* Daftar Mahasiswa Bimbingan */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Mahasiswa Bimbingan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Mahasiswa</TableHead>
                                        <TableHead>Perusahaan</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Progress</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {internships.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center">
                                                Belum ada mahasiswa bimbingan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        internships.data.map((internship) => (
                                            <TableRow key={internship.id}>
                                                <TableCell>{internship.mahasiswa.name}</TableCell>
                                                <TableCell>{internship.company_name}</TableCell>
                                                <TableCell>{getCategoryDisplay(internship.category)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusBadgeVariant(internship.status)}>
                                                        {getStatusDisplay(internship.status)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="w-[100px]">
                                                        <div className="mb-1 flex items-center justify-between text-sm">
                                                            <span>{Math.round(calculateProgress(internship))}%</span>
                                                        </div>
                                                        <Progress value={calculateProgress(internship)} className="h-2" />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="outline" size="sm" asChild className="w-[100px]">
                                                        <Link href={route('dosen.bimbingan.show', internship.id)}>Detail</Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </AppContent>
        </AppShell>
    );
}
