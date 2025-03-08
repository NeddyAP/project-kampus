import Heading from '@/components/heading-small';
import { StatusBadge } from '@/components/internship/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Internship } from '@/types/internship';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    internship: Internship;
    dosen?: Array<{
        id: number;
        name: string;
        nip: string;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Magang',
        href: '/admin/internships',
    },
    {
        title: 'Detail Pengajuan',
        href: '#',
    },
];

const InternshipShow = ({ internship, dosen }: Props) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'DISETUJUI' | 'DITOLAK'>();
    const [dosenId, setDosenId] = useState<number>();
    const [notes, setNotes] = useState('');

    const handleApprove = async () => {
        if (!status || !notes) {
            toast.error('Mohon lengkapi semua field');
            return;
        }

        setIsSubmitting(true);

        router.post(
            `/admin/internships/${internship.id}/approve`,
            {
                status,
                notes,
            },
            {
                onSuccess: () => {
                    toast.success('Status magang berhasil diperbarui');
                },
                onError: () => {
                    toast.error('Terjadi kesalahan');
                    setIsSubmitting(false);
                },
            },
        );
    };

    const handleAssign = async () => {
        if (!dosenId || !notes) {
            toast.error('Mohon lengkapi semua field');
            return;
        }

        setIsSubmitting(true);

        router.post(
            `/admin/internships/${internship.id}/assign`,
            {
                dosen_id: Number(dosenId),
                notes,
            },
            {
                onSuccess: () => {
                    toast.success('Dosen pembimbing berhasil ditugaskan');
                },
                onError: () => {
                    toast.error('Terjadi kesalahan');
                    setIsSubmitting(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Magang" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mb-8">
                    <Heading title="Detail Magang" description="Informasi lengkap pengajuan magang" />
                </div>

                <div className="grid gap-6">
                    {/* Informasi Magang */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Magang</CardTitle>
                            <CardDescription>Detail pengajuan magang mahasiswa</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <div className="text-muted-foreground text-sm">Status</div>
                                <StatusBadge status={internship.status} />
                            </div>

                            <div className="grid gap-2">
                                <div className="text-muted-foreground text-sm">Tipe Magang</div>
                                <div>{internship.type}</div>
                            </div>

                            <div className="grid gap-2">
                                <div className="text-muted-foreground text-sm">Nama Mahasiswa</div>
                                <div>{internship.mahasiswa?.name}</div>
                            </div>

                            <div className="grid gap-2">
                                <div className="text-muted-foreground text-sm">NIM</div>
                                <div>{internship.mahasiswa?.nim}</div>
                            </div>

                            {internship.dosen && (
                                <>
                                    <div className="grid gap-2">
                                        <div className="text-muted-foreground text-sm">Dosen Pembimbing</div>
                                        <div>{internship.dosen.name}</div>
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="text-muted-foreground text-sm">NIP</div>
                                        <div>{internship.dosen.nip}</div>
                                    </div>
                                </>
                            )}

                            <div className="grid gap-2">
                                <div className="text-muted-foreground text-sm">Tanggal Mulai</div>
                                <div>
                                    {internship.start_date
                                        ? new Date(internship.start_date).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })
                                        : '-'}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <div className="text-muted-foreground text-sm">Tanggal Selesai</div>
                                <div>
                                    {internship.end_date
                                        ? new Date(internship.end_date).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })
                                        : '-'}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Form Persetujuan */}
                    {internship.status === 'MENUNGGU_PERSETUJUAN' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Persetujuan Magang</CardTitle>
                                <CardDescription>Berikan persetujuan atau penolakan pengajuan magang</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">Status</div>
                                    <Select value={status} onValueChange={(value) => setStatus(value as 'DISETUJUI' | 'DITOLAK')}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DISETUJUI">Disetujui</SelectItem>
                                            <SelectItem value="DITOLAK">Ditolak</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm font-medium">Catatan</div>
                                    <Textarea placeholder="Tambahkan catatan..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                                </div>

                                <Button onClick={handleApprove} disabled={isSubmitting || !status || !notes}>
                                    Simpan Persetujuan
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Form Assignment Dosen */}
                    {internship.status === 'DISETUJUI' && !internship.dosen_id && dosen && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Assignment Dosen Pembimbing</CardTitle>
                                <CardDescription>Pilih dosen pembimbing untuk mahasiswa</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">Dosen Pembimbing</div>
                                    <Select value={dosenId?.toString()} onValueChange={(value) => setDosenId(Number(value))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih dosen pembimbing" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dosen.map((d) => (
                                                <SelectItem key={d.id} value={d.id.toString()}>
                                                    {d.name} ({d.nip})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm font-medium">Catatan</div>
                                    <Textarea placeholder="Tambahkan catatan..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                                </div>

                                <Button onClick={handleAssign} disabled={isSubmitting || !dosenId || !notes}>
                                    Simpan Assignment
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Timeline Aktivitas */}
                    {internship.logs && internship.logs.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Timeline Aktivitas</CardTitle>
                                <CardDescription>Riwayat aktivitas dan perubahan status magang</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    {internship.logs.map((log) => (
                                        <div key={log.id} className="flex gap-4">
                                            <div className="text-muted-foreground w-14 text-sm">
                                                {new Date(log.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                })}
                                            </div>
                                            <div>
                                                <div className="font-medium">{log.activity}</div>
                                                {log.notes && <div className="text-muted-foreground mt-1 text-sm">{log.notes}</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default InternshipShow;

