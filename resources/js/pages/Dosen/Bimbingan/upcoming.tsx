import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Head, InertiaLinkProps, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import TextLink from '@/components/text-link';
import { ChevronLeft } from 'lucide-react';

interface Supervision {
    id: number;
    title: string;
    notes: string;
    scheduled_at: string;
    attachment_path: string | null;
    internship: {
        id: number;
        mahasiswa: {
            name: string;
        };
    };
}

interface Props {
    upcomingSupervisions: {
        data: Supervision[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: InertiaLinkProps[];
    };
}

export default function JadwalBimbinganAkanDatang({ upcomingSupervisions }: Props) {
    const [selectedSupervision, setSelectedSupervision] = useState<number | null>(null);

    // Form untuk absensi
    const {
        data: attendanceData,
        setData: setAttendanceData,
        post: postAttendance,
        processing: attendanceProcessing,
        reset: resetAttendance,
    } = useForm({
        is_present: 'true',
        notes: '',
    });

    // Format datetime
    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Handle attendance form submission
    const handleAttendanceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSupervision) return;

        postAttendance(route('dosen.bimbingan.attendance.store', { supervision: selectedSupervision }), {
            onSuccess: () => {
                resetAttendance();
                setSelectedSupervision(null);
            },
        });
    };

    return (
        <AppShell>
            <Head title="Jadwal Bimbingan yang Akan Datang" />
            <AppHeader />
            <AppContent>
                <div className="container mx-auto py-10">

                    <Link href={route('dosen.bimbingan.index')} className="mb-4 flex items-center space-x-2 text-sm hover:underline">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Kembali ke Dashboard
                    </Link>

                    <Card className='mb-6'>
                        <CardHeader>
                            <CardTitle>Buat Jadwal Bimbingan</CardTitle>
                            <CardDescription>Buat jadwal bimbingan untuk semua mahasiswa yang dibimbing</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <Link href={route('dosen.bimbingan.create')}>Buat Jadwal</Link>
                            </Button>
                        </CardContent>
                    </Card>
                    {/* Jadwal Bimbingan yang Akan Datang */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Jadwal Bimbingan yang Akan Datang</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tanggal & Waktu</TableHead>
                                        <TableHead>Judul</TableHead>
                                        <TableHead>Catatan</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {upcomingSupervisions.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center">
                                                Belum ada jadwal bimbingan yang akan datang
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        upcomingSupervisions.data.map((supervision) => (
                                            <TableRow key={supervision.id}>
                                                <TableCell>{formatDateTime(supervision.scheduled_at)}</TableCell>
                                                <TableCell>{supervision.title}</TableCell>
                                                <TableCell className="max-w-md truncate">{supervision.notes}</TableCell>
                                                <TableCell>
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={route('dosen.bimbingan.attendance.form', { supervision: supervision.id })}>
                                                            Isi Kehadiran
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Form Isi Kehadiran (muncul ketika jadwal dipilih) */}
                    {selectedSupervision && (
                        <div>
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle>Isi Kehadiran Mahasiswa</CardTitle>
                                    <CardDescription>Catat kehadiran mahasiswa dalam sesi bimbingan</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleAttendanceSubmit}>
                                        <div className="mb-4">
                                            <label className="mb-2 block text-sm font-medium">Status Kehadiran</label>
                                            <RadioGroup
                                                value={attendanceData.is_present}
                                                onValueChange={(value) => setAttendanceData('is_present', value)}
                                                className="flex gap-4"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="true" id="present" />
                                                    <Label htmlFor="present">Hadir</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="false" id="absent" />
                                                    <Label htmlFor="absent">Tidak Hadir</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="attendance_notes" className="mb-2 block text-sm font-medium">
                                                Catatan
                                            </label>
                                            <Textarea
                                                id="attendance_notes"
                                                value={attendanceData.notes}
                                                onChange={(e) => setAttendanceData('notes', e.target.value)}
                                                placeholder="Tambahkan catatan terkait sesi bimbingan"
                                                rows={4}
                                                className="w-full"
                                                required
                                            />
                                        </div>

                                        <div className="space-x-4">
                                            <Button type="submit" disabled={attendanceProcessing}>
                                                Simpan Kehadiran
                                            </Button>
                                            <Button type="button" variant="outline" onClick={() => setSelectedSupervision(null)}>
                                                Batal
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                            <div className="mt-4">
                                <TextLink href={route('dosen.bimbingan.index')}>Kembali ke Dashboard</TextLink>
                            </div>
                        </div>
                    )}
                </div>
            </AppContent>
        </AppShell>
    );
}

