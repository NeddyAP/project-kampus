import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { Badge, type VariantProps, badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import type { LinkProps } from '@inertiajs/react';
import { Head, Link, useForm } from '@inertiajs/react';
import { CalendarIcon, Clock } from 'lucide-react';
import { useState } from 'react';

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

// Update the Props interface to account for paginated data
interface Props {
    internships: {
        data: Internship[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: LinkProps[];
    };
    upcomingSupervisions: {
        data: Supervision[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: LinkProps[];
    };
    guidances: unknown[];
    attendances: unknown[];
    filters: Record<string, unknown>;
}

export default function DosenBimbinganIndex({ internships, upcomingSupervisions }: Props) {
    const [selectedSupervision, setSelectedSupervision] = useState<number | null>(null);

    // Form untuk membuat jadwal bimbingan
    const {
        data: scheduleData,
        setData: setScheduleData,
        post: postSchedule,
        processing: scheduleProcessing,
        reset: resetSchedule,
    } = useForm({
        title: '',
        notes: '',
        date: '',
        time: '',
        category: 'KKL',
        attachment: null as File | null,
    });

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
    const getStatusBadgeVariant = (status: string): VariantProps<typeof badgeVariants>['variant'] => {
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

    // Format date

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

    // Handle schedule form submission
    const handleScheduleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postSchedule(route('dosen.bimbingan.schedule.create'), {
            onSuccess: () => {
                resetSchedule();
            },
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

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setScheduleData('attachment', e.target.files[0]);
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
                        <p className="text-muted-foreground">Kelola jadwal bimbingan dan kehadiran mahasiswa magang</p>
                    </div>

                    {/* Form Buat Jadwal Bimbingan */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Buat Jadwal Bimbingan</CardTitle>
                            <CardDescription>Buat jadwal bimbingan untuk semua mahasiswa yang dibimbing</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleScheduleSubmit}>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Kategori Bimbingan</label>
                                            <RadioGroup
                                                value={scheduleData.category}
                                                onValueChange={(value) => setScheduleData('category', value)}
                                                className="flex gap-4"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="KKL" id="kkl" />
                                                    <Label htmlFor="kkl">Kuliah Kerja Lapangan (KKL)</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="KKN" id="kkn" />
                                                    <Label htmlFor="kkn">Kuliah Kerja Nyata (KKN)</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>

                                        <div>
                                            <label htmlFor="title" className="mb-2 block text-sm font-medium">
                                                Judul Bimbingan
                                            </label>
                                            <Input
                                                id="title"
                                                value={scheduleData.title}
                                                onChange={(e) => setScheduleData('title', e.target.value)}
                                                placeholder="Contoh: Bimbingan Mingguan"
                                                className="w-full"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="notes" className="mb-2 block text-sm font-medium">
                                                Catatan Bimbingan
                                            </label>
                                            <Textarea
                                                id="notes"
                                                value={scheduleData.notes}
                                                onChange={(e) => setScheduleData('notes', e.target.value)}
                                                placeholder="Masukkan agenda atau catatan untuk bimbingan"
                                                rows={4}
                                                className="w-full"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="date" className="mb-2 block text-sm font-medium">
                                                Tanggal
                                            </label>
                                            <div className="relative">
                                                <Input
                                                    id="date"
                                                    type="date"
                                                    value={scheduleData.date}
                                                    onChange={(e) => setScheduleData('date', e.target.value)}
                                                    className="w-full"
                                                    min={new Date().toISOString().split('T')[0]}
                                                    required
                                                />
                                                <CalendarIcon className="text-muted-foreground absolute top-2.5 right-3 h-4 w-4" />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="time" className="mb-2 block text-sm font-medium">
                                                Waktu
                                            </label>
                                            <div className="relative">
                                                <Input
                                                    id="time"
                                                    type="time"
                                                    value={scheduleData.time}
                                                    onChange={(e) => setScheduleData('time', e.target.value)}
                                                    className="w-full"
                                                    required
                                                />
                                                <Clock className="text-muted-foreground absolute top-2.5 right-3 h-4 w-4" />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="attachment" className="mb-2 block text-sm font-medium">
                                                Lampiran (Opsional)
                                            </label>
                                            <Input id="attachment" type="file" onChange={handleFileChange} className="w-full" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Button type="submit" disabled={scheduleProcessing}>
                                        Buat Jadwal Bimbingan
                                    </Button>
                                </div>
                            </form>
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
                                    {/* Fix the map function to use upcomingSupervisions.data */}
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
                    )}

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
                                                        <a href={route('dosen.bimbingan.show', internship.id)}>Detail</a>
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
