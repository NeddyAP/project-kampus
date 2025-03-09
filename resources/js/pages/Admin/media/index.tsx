import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { MediaGrid } from '@/pages/Admin/media/components/media-grid';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { FileBox } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Media {
    id: number;
    filename: string;
    url: string;
    mime_type: string;
    size: number;
    created_at: string;
    internship: {
        id: number;
        mahasiswa: {
            name: string;
        };
    };
}

interface Props {
    media: Media[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Media Manager',
        href: '/admin/media',
    },
];

const MediaIndex = ({ media: initialMedia }: Props) => {
    const [search, setSearch] = useState('');
    const [type, setType] = useState<'ALL' | 'IMAGE' | 'DOCUMENT'>('ALL');

    // Filter media berdasarkan pencarian dan tipe
    const filteredMedia = initialMedia.filter((item) => {
        const matchSearch = item.filename.toLowerCase().includes(search.toLowerCase());
        const matchType =
            type === 'ALL'
                ? true
                : type === 'IMAGE'
                  ? item.mime_type.startsWith('image/')
                  : type === 'DOCUMENT'
                    ? item.mime_type.includes('pdf') || item.mime_type.includes('document')
                    : true;

        return matchSearch && matchType;
    });

    const handleDownload = (media: Media) => {
        window.open(media.url, '_blank');
    };

    const handlePreview = (media: Media) => {
        if (media.mime_type.startsWith('image/')) {
            // Preview gambar dalam tab baru
            window.open(media.url, '_blank');
        } else if (media.mime_type === 'application/pdf') {
            // Preview PDF dalam tab baru
            window.open(media.url, '_blank');
        } else {
            toast.error('Format file tidak didukung untuk pratinjau');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Media Manager" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="md:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total File</CardTitle>
                            <FileBox className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{initialMedia.length}</div>
                            <p className="text-muted-foreground text-xs">File yang telah diunggah</p>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ukuran Total</CardTitle>
                            <FileBox className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {/* Hitung total ukuran file */}
                                {initialMedia.reduce((acc, curr) => acc + curr.size, 0)}
                            </div>
                            <p className="text-muted-foreground text-xs">Total ukuran file</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-4 md:flex-row">
                            <div className="flex-1">
                                <Input placeholder="Cari berdasarkan nama file..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            </div>

                            <div className="w-full md:w-48">
                                <Select value={type} onValueChange={(value) => setType(value as typeof type)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter tipe file" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">Semua File</SelectItem>
                                        <SelectItem value="IMAGE">Gambar</SelectItem>
                                        <SelectItem value="DOCUMENT">Dokumen</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Grid Media */}
                <MediaGrid media={filteredMedia} onDownload={handleDownload} onPreview={handlePreview} />
            </div>
        </AppLayout>
    );
};

export default MediaIndex;
