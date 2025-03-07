import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Internship } from '@/types/internship';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { StatusBadge } from './status-badge';

interface InternshipsTableProps {
    internships: Internship[];
}

export function InternshipsTable({ internships }: InternshipsTableProps) {
    return (
        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Mahasiswa</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Perusahaan</TableHead>
                        <TableHead>Periode</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Dosen Pembimbing</TableHead>
                        <TableHead>Tanggal Pengajuan</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {internships.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-muted-foreground text-center">
                                Tidak ada data pengajuan magang
                            </TableCell>
                        </TableRow>
                    ) : (
                        internships.map((internship) => (
                            <TableRow key={internship.id}>
                                <TableCell className="font-medium">{internship.mahasiswa?.name}</TableCell>
                                <TableCell>
                                    <span className="font-medium">{internship.category}</span>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <p className="font-medium">{internship.company_name}</p>
                                        <p className="text-muted-foreground text-sm">{internship.supervisor_name}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <p>{format(new Date(internship.start_date), 'dd MMM yyyy', { locale: id })}</p>
                                        <p className="text-muted-foreground text-sm">
                                            s/d {format(new Date(internship.end_date), 'dd MMM yyyy', { locale: id })}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={internship.status} />
                                </TableCell>
                                <TableCell>{internship.dosen?.name ?? <span className="text-muted-foreground">Belum ditugaskan</span>}</TableCell>
                                <TableCell>{format(new Date(internship.created_at), 'dd MMM yyyy HH:mm', { locale: id })}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" asChild className="px-3">
                                        <Link href={route('admin.magang.show', internship.id)}>Detail</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
