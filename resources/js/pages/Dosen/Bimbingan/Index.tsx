import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';

export default function DosenBimbinganIndex() {
    return (
        <AppShell>
            <Head title="Bimbingan Magang" />
            <AppHeader />
            <AppContent>
                <div className="container mx-auto py-10">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Bimbingan Magang</h1>
                        <p className="text-muted-foreground">Kelola jadwal bimbingan dan kehadiran mahasiswa magang</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Jadwal Bimbingan yang Akan Datang</CardTitle>
                                <CardDescription>Lihat dan kelola jadwal bimbingan yang akan datang</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild>
                                    <Link href={route('dosen.bimbingan.upcoming')}>Lihat Jadwal</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Daftar Mahasiswa Bimbingan</CardTitle>
                                <CardDescription>Lihat daftar mahasiswa yang sedang Anda bimbing</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild>
                                    <Link href={route('dosen.bimbingan.list')}>Lihat Daftar</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AppContent>
        </AppShell>
    );
}
