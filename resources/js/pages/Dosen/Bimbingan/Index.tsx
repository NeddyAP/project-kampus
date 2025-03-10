import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Head, Link } from '@inertiajs/react';

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
    logs: any[];
}

interface Props {
    internships: Internship[];
}

export default function DosenBimbinganIndex({ internships }: Props) {
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
    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'SELESAI':
                return 'success';
            case 'SEDANG_BERJALAN':
                return 'info';
            case 'DISETUJUI':
                return 'success';
            case 'MENUNGGU_PERSETUJUAN':
                return 'warning';
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
            <Head title="Bimbingan Magang" />
            <AppHeader />
            <AppContent>
                <div className="container mx-auto py-10">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Bimbingan Magang</h1>
                        <p className="text-muted-foreground">Daftar mahasiswa yang Anda bimbing dalam kegiatan magang</p>
                    </div>

                    {internships.length === 0 ? (
                        <Card className="mx-auto max-w-3xl">
                            <CardHeader>
                                <CardTitle>Belum Ada Bimbingan</CardTitle>
                                <CardDescription>
                                    Anda belum memiliki mahasiswa bimbingan magang. Mahasiswa akan muncul di sini setelah mereka memilih Anda sebagai
                                    pembimbing.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {internships.map((internship) => (
                                <Card key={internship.id} className="overflow-hidden">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <Badge variant={getStatusBadgeVariant(internship.status) as any}>
                                                {getStatusDisplay(internship.status)}
                                            </Badge>
                                            <Badge variant="outline">{getCategoryDisplay(internship.category)}</Badge>
                                        </div>
                                        <CardTitle className="mt-2">{internship.company_name}</CardTitle>
                                        <CardDescription>Mahasiswa: {internship.mahasiswa.name}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pb-2">
                                        <div className="mb-4">
                                            <div className="mb-1 flex items-center justify-between text-sm">
                                                <span>Progres</span>
                                                <span>{Math.round(calculateProgress(internship))}%</span>
                                            </div>
                                            <Progress value={calculateProgress(internship)} className="h-2" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">Tanggal Mulai</p>
                                                <p>{new Date(internship.start_date).toLocaleDateString('id-ID')}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Tanggal Selesai</p>
                                                <p>{new Date(internship.end_date).toLocaleDateString('id-ID')}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Link href={route('dosen.bimbingan.show', internship.id)} className="w-full">
                                            <Button variant="outline" className="w-full">
                                                Lihat Detail
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </AppContent>
        </AppShell>
    );
}
