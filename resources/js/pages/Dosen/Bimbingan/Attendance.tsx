import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Mahasiswa {
    id: number;
    name: string;
    internship_id: number;
}

interface Supervision {
    id: number;
    title: string;
    notes: string;
    scheduled_at: string;
}

interface Props {
    supervision: Supervision;
    mahasiswa: Mahasiswa[];
}

type AttendanceStatus = 'HADIR' | 'IZIN' | 'SAKIT' | 'TIDAK_HADIR';

interface AttendanceData {
    [key: number]: {
        status: AttendanceStatus;
        notes: string;
    };
}

export default function DosenBimbinganAttendance({ supervision, mahasiswa }: Props) {
    const [attendanceData, setAttendanceData] = useState<AttendanceData>({});

    const { post, processing } = useForm({});

    const handleStatusChange = (mahasiswaId: number, status: AttendanceStatus) => {
        setAttendanceData((prev) => ({
            ...prev,
            [mahasiswaId]: {
                ...prev[mahasiswaId],
                status,
            },
        }));
    };

    const handleNotesChange = (mahasiswaId: number, notes: string) => {
        setAttendanceData((prev) => ({
            ...prev,
            [mahasiswaId]: {
                ...prev[mahasiswaId],
                notes,
            },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dosen.bimbingan.attendance.store', { supervision: supervision.id }), {
            data: attendanceData,
        });
    };

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

    return (
        <AppShell>
            <Head title="Isi Kehadiran Bimbingan" />
            <AppHeader />
            <AppContent>
                <div className="container mx-auto py-10">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Isi Kehadiran Bimbingan</h1>
                        <p className="text-muted-foreground">Catat kehadiran mahasiswa untuk sesi bimbingan</p>
                    </div>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Detail Bimbingan</CardTitle>
                            <CardDescription>
                                {supervision.title} - {formatDateTime(supervision.scheduled_at)}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">{supervision.notes}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Kehadiran Mahasiswa</CardTitle>
                            <CardDescription>Pilih status kehadiran dan tambahkan catatan untuk setiap mahasiswa</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nama Mahasiswa</TableHead>
                                            <TableHead>Status Kehadiran</TableHead>
                                            <TableHead>Catatan</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mahasiswa.map((mhs) => (
                                            <TableRow key={mhs.id}>
                                                <TableCell>{mhs.name}</TableCell>
                                                <TableCell>
                                                    <RadioGroup
                                                        value={attendanceData[mhs.id]?.status || ''}
                                                        onValueChange={(value) => handleStatusChange(mhs.id, value as AttendanceStatus)}
                                                        className="flex flex-row space-y-1"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="HADIR" id={`hadir-${mhs.id}`} />
                                                            <Label htmlFor={`hadir-${mhs.id}`}>Hadir</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="IZIN" id={`izin-${mhs.id}`} />
                                                            <Label htmlFor={`izin-${mhs.id}`}>Izin</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="SAKIT" id={`sakit-${mhs.id}`} />
                                                            <Label htmlFor={`sakit-${mhs.id}`}>Sakit</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="TIDAK_HADIR" id={`tidak-hadir-${mhs.id}`} />
                                                            <Label htmlFor={`tidak-hadir-${mhs.id}`}>Tidak Hadir</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </TableCell>
                                                <TableCell>
                                                    <Textarea
                                                        value={attendanceData[mhs.id]?.notes || ''}
                                                        onChange={(e) => handleNotesChange(mhs.id, e.target.value)}
                                                        placeholder="Tambahkan catatan (opsional)"
                                                        className="w-full"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <div className="mt-6 flex justify-end space-x-4">
                                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                        Kembali
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Simpan Kehadiran
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </AppContent>
        </AppShell>
    );
}
