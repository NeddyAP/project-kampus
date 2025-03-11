import { AppContent } from '@/components/app-content';
import { Badge } from '@/components/ui/badge';
 
import { Card } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import DosenLayout from '@/layouts/dosen-layout';
interface Guidance {
    id: number;
    title: string;
    notes: string;
    created_at: string;
    internship: {
        id: number;
        category: string;
        company_name: string;
        status: string;
        mahasiswa: {
            id: number;
            name: string;
        };
    };
}

interface Attendance {
    id: number;
    date: string;
    is_present: boolean;
    notes: string;
    created_at: string;
    internship: {
        id: number;
        category: string;
        company_name: string;
        status: string;
        mahasiswa: {
            id: number;
            name: string;
        };
    };
}

interface Props {
    guidances: Guidance[];
    attendances: Attendance[];
}

export default function DosenGuidanceIndex({ guidances, attendances }: Props) {
    const [activeTab, setActiveTab] = useState<'guidances' | 'attendances'>('guidances');

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
        <DosenLayout>
            <Head title="Riwayat Bimbingan" />
            <AppContent>
                <div className="container mx-auto py-10">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Riwayat Bimbingan</h1>
                        <p className="text-muted-foreground">
                            Catatan bimbingan dan kehadiran mahasiswa dalam kegiatan magang
                        </p>
                    </div>

                    <div className="mb-6 flex space-x-4 border-b">
                        <button
                            className={`border-b-2 px-4 py-2 ${activeTab === 'guidances' ? 'border-primary text-primary font-medium' : 'text-muted-foreground border-transparent'
                                }`}
                            onClick={() => setActiveTab('guidances')}
                        >
                            Catatan Bimbingan
                        </button>
                        <button
                            className={`border-b-2 px-4 py-2 ${activeTab === 'attendances' ? 'border-primary text-primary font-medium' : 'text-muted-foreground border-transparent'
                                }`}
                            onClick={() => setActiveTab('attendances')}
                        >
                            Kehadiran Bimbingan
                        </button>
                    </div>

                    <Card>
                        {activeTab === 'guidances' ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Nama Mahasiswa</TableHead>
                                        <TableHead>Perusahaan</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Judul</TableHead>
                                        <TableHead>Catatan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {guidances.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center">
                                                Belum ada catatan bimbingan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        guidances.map((guidance) => (
                                            <TableRow key={guidance.id}>
                                                <TableCell>{formatDateTime(guidance.created_at)}</TableCell>
                                                <TableCell>{guidance.internship.mahasiswa.name}</TableCell>
                                                <TableCell>{guidance.internship.company_name}</TableCell>
                                                <TableCell>
                                                    {getCategoryDisplay(guidance.internship.category)}
                                                </TableCell>
                                                <TableCell>{guidance.title}</TableCell>
                                                <TableCell className="max-w-md truncate">
                                                    {guidance.notes}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Nama Mahasiswa</TableHead>
                                        <TableHead>Perusahaan</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Catatan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attendances.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center">
                                                Belum ada catatan kehadiran
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        attendances.map((attendance) => (
                                            <TableRow key={attendance.id}>
                                                <TableCell>{formatDate(attendance.date)}</TableCell>
                                                <TableCell>
                                                    {attendance.internship.mahasiswa.name}
                                                </TableCell>
                                                <TableCell>{attendance.internship.company_name}</TableCell>
                                                <TableCell>
                                                    {getCategoryDisplay(attendance.internship.category)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            attendance.is_present
 
                                                                ? 'default'
                                                                : 'destructive'
                                                        }
                                                    >
                                                        {attendance.is_present ? 'Hadir' : 'Tidak Hadir'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="max-w-md truncate">
                                                    {attendance.notes}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </Card>
                </div>
            </AppContent>
        </DosenLayout>
    );
}