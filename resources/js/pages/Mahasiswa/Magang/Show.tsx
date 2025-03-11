import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Head, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon, PencilIcon } from 'lucide-react';
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
    dosen: {
        id: number;
        name: string;
    };
    logs: InternshipLog[];
    supervisions: InternshipSupervision[];
}

interface Props {
    internship: Internship;
    dosen?: { id: number; name: string }[];
    categories?: Record<string, string>;
}

export default function MahasiswaMagangShow({ internship, dosen, categories }: Props) {
    const [activeTab, setActiveTab] = useState('detail');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        attachment: null as File | null,
    });

    const editForm = useForm({
        dosen_id: internship.dosen.id,
        category: internship.category,
        company_name: internship.company_name,
        company_address: internship.company_address,
        company_phone: internship.company_phone,
        supervisor_name: internship.supervisor_name,
        supervisor_phone: internship.supervisor_phone,
        start_date: new Date(internship.start_date),
        end_date: new Date(internship.end_date),
        cover_letter: null as File | null,
    });

    // Function to handle edit form submission
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.post(route('mahasiswa.magang.update', internship.id), {
            forceFormData: true,
            onSuccess: () => {
                setIsEditDialogOpen(false);
            },
        });
    };

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
        post(route('mahasiswa.magang.log.store', internship.id), {
            onSuccess: () => {
                reset('title', 'description', 'attachment');
            },
        });
    };

    // Function to format date
    const formatDate = (dateString: string | Date) => {
        return format(new Date(dateString), 'dd MMMM yyyy', { locale: id });
    };

    // Function to format datetime
    const formatDateTime = (dateString: string) => {
        return format(new Date(dateString), 'dd MMMM yyyy HH:mm', { locale: id });
    };

    const canEdit = internship.status === 'MENUNGGU_PERSETUJUAN';

    return (
        <AppShell>
            <Head title={`Magang - ${internship.company_name}`} />
            <AppHeader />
            <AppContent>
                <div className="container mx-auto py-10">
                    <div className="mb-6">
                        <Link href={route('mahasiswa.magang.index')} className="text-muted-foreground hover:text-primary text-sm">
                            &larr; Kembali ke Daftar Magang
                        </Link>
                    </div>

                    <div className="mb-8">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold">{internship.company_name}</h1>
                                <p className="text-muted-foreground">{getCategoryDisplay(internship.category)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={getStatusBadgeVariant(internship.status) as any} className="text-base">
                                    {getStatusDisplay(internship.status)}
                                </Badge>
                                {canEdit && (
                                    <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)} className="flex items-center gap-1">
                                        <PencilIcon className="h-4 w-4" />
                                        Edit
                                    </Button>
                                )}
                            </div>
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
                                            <span className="text-muted-foreground">Dosen Pembimbing:</span>
                                            <span>{internship.dosen.name}</span>
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

                                {internship.rejection_reason && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="text-destructive mb-2 font-medium">Alasan Penolakan</h3>
                                            <p>{internship.rejection_reason}</p>
                                        </div>
                                    </>
                                )}

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
                        <div className="space-y-6">
                            {internship.status === 'SEDANG_BERJALAN' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Tambah Log Aktivitas</CardTitle>
                                        <CardDescription>Catat aktivitas harian yang Anda lakukan selama magang</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-4">
                                                <label htmlFor="title" className="mb-2 block text-sm font-medium">
                                                    Judul Aktivitas
                                                </label>
                                                <Input
                                                    id="title"
                                                    value={data.title}
                                                    onChange={(e) => setData('title', e.target.value)}
                                                    placeholder="Contoh: Meeting dengan tim marketing"
                                                    className="w-full"
                                                />
                                                {errors.title && <p className="text-destructive mt-1 text-sm">{errors.title}</p>}
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="description" className="mb-2 block text-sm font-medium">
                                                    Deskripsi Aktivitas
                                                </label>
                                                <Textarea
                                                    id="description"
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    placeholder="Jelaskan secara detail aktivitas yang Anda lakukan"
                                                    rows={4}
                                                    className="w-full"
                                                />
                                                {errors.description && <p className="text-destructive mt-1 text-sm">{errors.description}</p>}
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="attachment" className="mb-2 block text-sm font-medium">
                                                    Lampiran (Opsional)
                                                </label>
                                                <Input id="attachment" type="file" onChange={handleFileChange} className="w-full" />
                                                {errors.attachment && <p className="text-destructive mt-1 text-sm">{errors.attachment}</p>}
                                            </div>

                                            <Button type="submit" disabled={processing}>
                                                Simpan Log Aktivitas
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}

                            <Card>
                                <CardHeader>
                                    <CardTitle>Riwayat Aktivitas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {internship.logs.length === 0 ? (
                                        <p className="text-muted-foreground text-center">Belum ada log aktivitas</p>
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
                        </div>
                    )}

                    {activeTab === 'supervisions' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Bimbingan Dosen</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {internship.supervisions.length === 0 ? (
                                    <p className="text-muted-foreground text-center">Belum ada catatan bimbingan dari dosen</p>
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
                                                    <p className="text-muted-foreground mb-1 text-sm">Dosen: {supervision.dosen.name}</p>
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
                    )}

                    {/* Edit Dialog */}
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Edit Pengajuan Magang</DialogTitle>
                                <DialogDescription>Perbarui informasi pengajuan magang Anda.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleEditSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="category">Kategori Magang</Label>
                                        <Select value={editForm.data.category} onValueChange={(value) => editForm.setData('category', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kategori magang" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories &&
                                                    Object.entries(categories).map(([value, label]) => (
                                                        <SelectItem key={value} value={value}>
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                        {editForm.errors.category && <p className="text-destructive mt-1 text-sm">{editForm.errors.category}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="dosen_id">Dosen Pembimbing</Label>
                                        <Select
                                            value={editForm.data.dosen_id?.toString()}
                                            onValueChange={(value) => editForm.setData('dosen_id', parseInt(value))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih dosen pembimbing" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {dosen &&
                                                    dosen.map((d) => (
                                                        <SelectItem key={d.id} value={d.id.toString()}>
                                                            {d.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                        {editForm.errors.dosen_id && <p className="text-destructive mt-1 text-sm">{editForm.errors.dosen_id}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="company_name">Nama Perusahaan</Label>
                                        <Input
                                            id="company_name"
                                            value={editForm.data.company_name}
                                            onChange={(e) => editForm.setData('company_name', e.target.value)}
                                        />
                                        {editForm.errors.company_name && (
                                            <p className="text-destructive mt-1 text-sm">{editForm.errors.company_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="company_address">Alamat Perusahaan</Label>
                                        <Textarea
                                            id="company_address"
                                            value={editForm.data.company_address}
                                            onChange={(e) => editForm.setData('company_address', e.target.value)}
                                        />
                                        {editForm.errors.company_address && (
                                            <p className="text-destructive mt-1 text-sm">{editForm.errors.company_address}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="company_phone">Telepon Perusahaan</Label>
                                        <Input
                                            id="company_phone"
                                            value={editForm.data.company_phone}
                                            onChange={(e) => editForm.setData('company_phone', e.target.value)}
                                        />
                                        {editForm.errors.company_phone && (
                                            <p className="text-destructive mt-1 text-sm">{editForm.errors.company_phone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="supervisor_name">Nama Supervisor</Label>
                                        <Input
                                            id="supervisor_name"
                                            value={editForm.data.supervisor_name}
                                            onChange={(e) => editForm.setData('supervisor_name', e.target.value)}
                                        />
                                        {editForm.errors.supervisor_name && (
                                            <p className="text-destructive mt-1 text-sm">{editForm.errors.supervisor_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="supervisor_phone">Telepon Supervisor</Label>
                                        <Input
                                            id="supervisor_phone"
                                            value={editForm.data.supervisor_phone}
                                            onChange={(e) => editForm.setData('supervisor_phone', e.target.value)}
                                        />
                                        {editForm.errors.supervisor_phone && (
                                            <p className="text-destructive mt-1 text-sm">{editForm.errors.supervisor_phone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Tanggal Mulai</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-full justify-start text-left font-normal',
                                                        !editForm.data.start_date && 'text-muted-foreground',
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {editForm.data.start_date ? formatDate(editForm.data.start_date) : <span>Pilih tanggal</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={editForm.data.start_date}
                                                    onSelect={(date) => date && editForm.setData('start_date', date)}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {editForm.errors.start_date && <p className="text-destructive mt-1 text-sm">{editForm.errors.start_date}</p>}
                                    </div>

                                    <div>
                                        <Label>Tanggal Selesai</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-full justify-start text-left font-normal',
                                                        !editForm.data.end_date && 'text-muted-foreground',
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {editForm.data.end_date ? formatDate(editForm.data.end_date) : <span>Pilih tanggal</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={editForm.data.end_date}
                                                    onSelect={(date) => date && editForm.setData('end_date', date)}
                                                    initialFocus
                                                    fromDate={editForm.data.start_date}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {editForm.errors.end_date && <p className="text-destructive mt-1 text-sm">{editForm.errors.end_date}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="cover_letter">Surat Pengantar (PDF)</Label>
                                        <div className="mt-1">
                                            <Input
                                                id="cover_letter"
                                                type="file"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        editForm.setData('cover_letter', e.target.files[0]);
                                                    }
                                                }}
                                            />
                                            <p className="text-muted-foreground mt-1 text-sm">Kosongkan jika tidak ingin mengubah dokumen yang ada</p>
                                        </div>
                                        {editForm.errors.cover_letter && (
                                            <p className="text-destructive mt-1 text-sm">{editForm.errors.cover_letter}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                                        Batal
                                    </Button>
                                    <Button type="submit" disabled={editForm.processing}>
                                        Simpan Perubahan
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </AppContent>
        </AppShell>
    );
}
