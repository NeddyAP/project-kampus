import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Internship } from '@/types/internship';
import { Link } from '@inertiajs/react';
import { MoreHorizontal } from 'lucide-react';
import { StatusBadge } from './status-badge';

interface InternshipsTableProps {
    internships: Internship[];
}

export const InternshipsTable = ({ internships }: InternshipsTableProps) => {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama Mahasiswa</TableHead>
                        <TableHead>NIM</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tanggal Mulai</TableHead>
                        <TableHead>Tanggal Selesai</TableHead>
                        <TableHead className="w-[60px]">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {internships.map((internship) => (
                        <TableRow key={internship.id}>
                            <TableCell>{internship.mahasiswa?.name}</TableCell>
                            <TableCell>{internship.mahasiswa?.nim}</TableCell>
                            <TableCell>{internship.type}</TableCell>
                            <TableCell>
                                <StatusBadge status={internship.status} />
                            </TableCell>
                            <TableCell>
                                {internship.start_date
                                    ? new Date(internship.start_date).toLocaleDateString('id-ID', {
                                          day: 'numeric',
                                          month: 'long',
                                          year: 'numeric',
                                      })
                                    : '-'}
                            </TableCell>
                            <TableCell>
                                {internship.end_date
                                    ? new Date(internship.end_date).toLocaleDateString('id-ID', {
                                          day: 'numeric',
                                          month: 'long',
                                          year: 'numeric',
                                      })
                                    : '-'}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Buka menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/admin/internships/${internship.id}`} className="cursor-pointer">
                                                Detail
                                            </Link>
                                        </DropdownMenuItem>
                                        {internship.status === 'MENUNGGU' && (
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/internships/${internship.id}/approval`} className="cursor-pointer">
                                                    Persetujuan
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        {internship.status === 'DISETUJUI' && !internship.dosen_id && (
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/internships/${internship.id}/assign`} className="cursor-pointer">
                                                    Assignment Dosen
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                    {internships.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center">
                                Tidak ada data magang
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
