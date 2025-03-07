import Heading from '@/components/heading';
import { ActivityTimeline } from '@/components/internship/activity-timeline';
import { ApprovalForm } from '@/components/internship/approval-form';
import { StatusBadge } from '@/components/internship/status-badge';
import { SupervisorAssignment } from '@/components/internship/supervisor-assignment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User } from '@/types';
import { Internship } from '@/types/internship';
import { PageProps } from '@inertiajs/core';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { FileText } from 'lucide-react';

interface InternshipShowProps extends PageProps {
    internship: Internship;
    availableDosen: User[];
}

export default function InternshipShow({ internship, availableDosen }: InternshipShowProps) {
    return (
        <>
            <Head title={`Detail Magang - ${internship.mahasiswa?.name}`} />

            <div className="container space-y-6 py-8">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <Heading>Detail Pengajuan Magang</Heading>
                        <p className="text-muted-foreground">{internship.mahasiswa?.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <SupervisorAssignment internship={internship} availableDosen={availableDosen} />
                        <ApprovalForm internship={internship} />
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Informasi Utama */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Pengajuan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm">Status</p>
                                <StatusBadge status={internship.status} />
                            </div>

                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm">Kategori</p>
                                <p className="font-medium">{internship.category}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm">Periode Magang</p>
                                <div className="font-medium">
                                    {format(new Date(internship.start_date), 'dd MMMM yyyy', {
                                        locale: id,
                                    })}{' '}
                                    s/d{' '}
                                    {format(new Date(internship.end_date), 'dd MMMM yyyy', {
                                        locale: id,
                                    })}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm">Dosen Pembimbing</p>
                                <p className="font-medium">{internship.dosen?.name ?? 'Belum ditugaskan'}</p>
                            </div>

                            {internship.approved_by && (
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-sm">Disetujui Oleh</p>
                                    <p className="font-medium">{internship.approver?.name}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Informasi Perusahaan */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Tempat Magang</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm">Nama Perusahaan</p>
                                <p className="font-medium">{internship.company_name}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm">Alamat Perusahaan</p>
                                <p className="font-medium">{internship.company_address}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm">Nomor Telepon</p>
                                <p className="font-medium">{internship.company_phone}</p>
                            </div>

                            <Separator />

                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm">Pembimbing Lapangan</p>
                                <p className="font-medium">{internship.supervisor_name}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm">Kontak Pembimbing</p>
                                <p className="font-medium">{internship.supervisor_phone}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Dokumen */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dokumen</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Surat Pengantar</p>
                                <p className="text-muted-foreground text-sm">Surat pengantar dari mahasiswa</p>
                            </div>
                            {internship.cover_letter_path ? (
                                <Button variant="outline" size="sm" asChild>
                                    <a href={`/storage/${internship.cover_letter_path}`} target="_blank" className="inline-flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Lihat Dokumen
                                    </a>
                                </Button>
                            ) : (
                                <p className="text-muted-foreground text-sm">Belum diupload</p>
                            )}
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Surat Persetujuan</p>
                                <p className="text-muted-foreground text-sm">Surat persetujuan dari kampus</p>
                            </div>
                            {internship.approval_letter_path ? (
                                <Button variant="outline" size="sm" asChild>
                                    <a
                                        href={`/storage/${internship.approval_letter_path}`}
                                        target="_blank"
                                        className="inline-flex items-center gap-2"
                                    >
                                        <FileText className="h-4 w-4" />
                                        Lihat Dokumen
                                    </a>
                                </Button>
                            ) : (
                                <p className="text-muted-foreground text-sm">Belum diupload</p>
                            )}
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Laporan Akhir</p>
                                <p className="text-muted-foreground text-sm">Laporan akhir kegiatan magang</p>
                            </div>
                            {internship.report_file_path ? (
                                <Button variant="outline" size="sm" asChild>
                                    <a href={`/storage/${internship.report_file_path}`} target="_blank" className="inline-flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Lihat Dokumen
                                    </a>
                                </Button>
                            ) : (
                                <p className="text-muted-foreground text-sm">Belum diupload</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Timeline Aktivitas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Riwayat Aktivitas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ActivityTimeline logs={internship.logs || []} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

// Menandai bahwa ini adalah layout admin
InternshipShow.layout = 'admin';
