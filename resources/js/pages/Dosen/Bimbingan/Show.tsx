import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface InternshipLog {
    id: number;
    type: string;
    title: string;
    description: string;
    attachment_path: string | null;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
}

interface InternshipSupervision {
    id: number;
    title: string;
    notes: string;
    attachment_path: string | null;
    created_at: string;
    dosen: {
        id: number;
        name: string;
    };
}

interface Internship {
    id: number;
    category: string;
    company_name: string;
    company_address: string;
    company_phone: string;
    supervisor_name: string;
    supervisor_phone: string;
    start_date: string;
    end_date: string;
    status: string;
    cover_letter_path: string;
    approval_letter_path: string | null;
    report_file_path: string | null;
    rejection_reason: string | null;
    notes: string | null;
    mahasiswa: {
        id: number;
        name: string;
    };
    logs: InternshipLog[];
    supervisions: InternshipSupervision[];
}

interface Props {
    internship: Internship;
}

export default function DosenBimbinganShow({ internship }: Props) {
    const [activeTab, setActiveTab] = useState('detail');

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        notes: '',
        attachment: null as File | null,
    });

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

    // Function to handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('attachment', e.target.files[0]);
        }
    };

    // Function to handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dosen.bimbingan.supervision.store', internship.id), {
            onSuccess: () => {
                reset('title', 'notes', 'attachment');
            },
        });
    };

    // Function to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    // Function to format datetime
    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppShell>
            <Head title={`Bimbingan - ${internship.mahasiswa.name}`} />
            <AppHeader />
            <AppContent>
                <div className="container mx-auto py-10">
                    <div className="mb-6">
                        <Link href={route('dosen.bimbingan.index')} className="text-muted-foreground hover:text-primary text-sm">
                            &larr; Kembali ke Daftar Bimbingan
                        </Link>
                    </div>

                    <div className="mb-8">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold">{internship.company_name}</h1>
                                <p className="text-muted-foreground">
                                    Mahasiswa: {internship.mahasiswa.name} - {getCategoryDisplay(internship.category)}
                                </p>
                            </div>
                            <Badge variant={getStatusBadgeVariant(internship.status) as any} className="text-base">
                                {getStatusDisplay(internship.status)}
                            </Badge>
                        </div>
                    </div>

                    <Card className="mb-8">
                        <CardHeader className="pb-2">
                            <CardTitle>Progres Magang</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-2 flex items-center justify-between text-sm">
                                <span>Status: {getStatusDisplay(internship.status)}</span>
                                <span>{Math.round(calculateProgress(internship))}%</span>
                            </div>
                            <Progress value={calculateProgress(internship)} className="h-3" />

                            <div className="mt-6 grid gap-6 md:grid-cols-2">
                                <div>
                                    <h3 className="mb-2 font-medium">Informasi Magang</h3>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Tanggal Mulai:</span>
                                            <span>{formatDate(internship.start_date)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Tanggal Selesai:</span>
                                            <span>{formatDate(internship.end_date)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Mahasiswa:</span>
                                            <span>{internship.mahasiswa.name}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-2 font-medium">Informasi Perusahaan</h3>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Alamat:</span>
                                            <span className="text-right">{internship.company_address}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Telepon:</span>
                                            <span>{internship.company_phone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Supervisor:</span>
                                            <span>{internship.supervisor_name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mb-4 flex space-x-4 border-b">
                        <button
                            className={`border-b-2 px-4 py-2 ${
                                activeTab === 'detail' ? 'border-primary text-primary font-medium' : 'text-muted-foreground border-transparent'
                            }`}
                            onClick={() => setActiveTab('detail')}
                        >
                            Detail
                        </button>
                        <button
                            className={`border-b-2 px-4 py-2 ${
                                activeTab === 'logs' ? 'border-primary text-primary font-medium' : 'text-muted-foreground border-transparent'
                            }`}
                            onClick={() => setActiveTab('logs')}
                        >
                            Log Aktivitas
                        </button>
                        <button
                            className={`border-b-2 px-4 py-2 ${
                                activeTab === 'supervisions' ? 'border-primary text-primary font-medium' : 'text-muted-foreground border-transparent'
                            }`}
                            onClick={() => setActiveTab('supervisions')}
                        >
                            Bimbingan
                        </button>
                    </div>

                    {activeTab === 'detail' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail Magang</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="mb-2 font-medium">Informasi Perusahaan</h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <p className="text-muted-foreground text-sm">Nama Perusahaan</p>
                                            <p>{internship.company_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-sm">Alamat Perusahaan</p>
                                            <p>{internship.company_address}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-sm">Telepon Perusahaan</p>
                                            <p>{internship.company_phone}</p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="mb-2 font-medium">Informasi Supervisor</h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <p className="text-muted-foreground text-sm">Nama Supervisor</p>
                                            <p>{internship.supervisor_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-sm">Telepon Supervisor</p>
                                            <p>{internship.supervisor_phone}</p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="mb-2 font-medium">Dokumen</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-muted-foreground text-sm">Surat Pengantar</p>
                                            <a
                                                href={`/storage/${internship.cover_letter_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline"
                                            >
                                                Lihat Dokumen
                                            </a>
                                        </div>
                                        {internship.approval_letter_path && (
                                            <div>
                                                <p className="text-muted-foreground text-sm">Surat Persetujuan</p>
                                                <a
                                                    href={`/storage/${internship.approval_letter_path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline"
                                                >
                                                    Lihat Dokumen
                                                </a>
                                            </div>
                                        )}
                                        {internship.report_file_path && (
                                            <div>
                                                <p className="text-muted-foreground text-sm">Laporan Akhir</p>
                                                <a
                                                    href={`/storage/${internship.report_file_path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline"
                                                >
                                                    Lihat Dokumen
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {internship.notes && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="mb-2 font-medium">Catatan</h3>
                                            <p>{internship.notes}</p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'logs' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Log Aktivitas Mahasiswa</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {internship.logs.filter((log) => log.type === 'ACTIVITY_REPORT').length === 0 ? (
                                    <p className="text-muted-foreground text-center">Belum ada log aktivitas dari mahasiswa</p>
                                ) : (
                                    <div className="space-y-6">
                                        {internship.logs
                                            .filter((log) => log.type === 'ACTIVITY_REPORT')
                                            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                            .map((log) => (
                                                <div key={log.id} className="rounded-lg border p-4">
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <h3 className="font-medium">{log.title}</h3>
                                                        <span className="text-muted-foreground text-sm">{formatDateTime(log.created_at)}</span>
                                                    </div>
                                                    <p className="mb-2 text-sm whitespace-pre-wrap">{log.description}</p>
                                                    {log.attachment_path && (
                                                        <a
                                                            href={`/storage/${log.attachment_path}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary text-sm hover:underline"
                                                        >
                                                            Lihat Lampiran
                                                        </a>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'supervisions' && (
                        <div className="space-y-6">
                            {internship.status === 'SEDANG_BERJALAN' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Tambah Catatan Bimbingan</CardTitle>
                                        <CardDescription>Berikan catatan bimbingan untuk mahasiswa</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-4">
                                                <label htmlFor="title" className="mb-2 block text-sm font-medium">
                                                    Judul Bimbingan
                                                </label>
                                                <Input
                                                    id="title"
                                                    value={data.title}
                                                    onChange={(e) => setData('title', e.target.value)}
                                                    placeholder="Contoh: Evaluasi Minggu Pertama"
                                                    className="w-full"
                                                />
                                                {errors.title && <p className="text-destructive mt-1 text-sm">{errors.title}</p>}
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="notes" className="mb-2 block text-sm font-medium">
                                                    Catatan Bimbingan
                                                </label>
                                                <Textarea
                                                    id="notes"
                                                    value={data.notes}
                                                    onChange={(e) => setData('notes', e.target.value)}
                                                    placeholder="Berikan catatan, masukan, atau arahan untuk mahasiswa"
                                                    rows={4}
                                                    className="w-full"
                                                />
                                                {errors.notes && <p className="text-destructive mt-1 text-sm">{errors.notes}</p>}
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="attachment" className="mb-2 block text-sm font-medium">
                                                    Lampiran (Opsional)
                                                </label>
                                                <Input id="attachment" type="file" onChange={handleFileChange} className="w-full" />
                                                {errors.attachment && <p className="text-destructive mt-1 text-sm">{errors.attachment}</p>}
                                            </div>

                                            <Button type="submit" disabled={processing}>
                                                Simpan Catatan Bimbingan
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}

                            <Card>
                                <CardHeader>
                                    <CardTitle>Riwayat Bimbingan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {internship.supervisions.length === 0 ? (
                                        <p className="text-muted-foreground text-center">Belum ada catatan bimbingan</p>
                                    ) : (
                                        <div className="space-y-6">
                                            {internship.supervisions
                                                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                                .map((supervision) => (
                                                    <div key={supervision.id} className="rounded-lg border p-4">
                                                        <div className="mb-2 flex items-center justify-between">
                                                            <h3 className="font-medium">{supervision.title}</h3>
                                                            <span className="text-muted-foreground text-sm">
                                                                {formatDateTime(supervision.created_at)}
                                                            </span>
                                                        </div>
                                                        <p className="mb-2 text-sm whitespace-pre-wrap">{supervision.notes}</p>
                                                        {supervision.attachment_path && (
                                                            <a
                                                                href={`/storage/${supervision.attachment_path}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-primary text-sm hover:underline"
                                                            >
                                                                Lihat Lampiran
                                                            </a>
                                                        )}
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </AppContent>
        </AppShell>
    );
}
