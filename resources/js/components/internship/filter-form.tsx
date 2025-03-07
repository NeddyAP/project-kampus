import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InternshipFilters, InternshipStatus } from '@/types/internship';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface FilterFormProps {
    filters: InternshipFilters;
}

type FilterFormData = {
    status: InternshipStatus | '';
    category: 'KKL' | 'KKN' | '';
    search: string;
    [key: string]: string; // Index signature untuk Inertia Form
};

export function FilterForm({ filters }: FilterFormProps) {
    const { data, setData, get, processing } = useForm<FilterFormData>({
        status: filters.status || '',
        category: filters.category || '',
        search: filters.search || '',
    });

    // Submit form when filters change
    useEffect(() => {
        const timeout = setTimeout(() => {
            get(route('admin.magang.index'), {
                preserveState: true,
                preserveScroll: true,
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [data]);

    const handleReset = () => {
        setData({
            status: '',
            category: '',
            search: '',
        });
    };

    return (
        <Card className="p-4">
            <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                    <Input placeholder="Cari mahasiswa atau perusahaan..." value={data.search} onChange={(e) => setData('search', e.target.value)} />
                </div>

                <Select value={data.status} onValueChange={(value: InternshipStatus | '') => setData('status', value)}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Semua Status</SelectItem>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PENDING">Menunggu Persetujuan</SelectItem>
                        <SelectItem value="APPROVED">Disetujui</SelectItem>
                        <SelectItem value="REJECTED">Ditolak</SelectItem>
                        <SelectItem value="ONGOING">Sedang Berlangsung</SelectItem>
                        <SelectItem value="COMPLETED">Selesai</SelectItem>
                        <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={data.category} onValueChange={(value: 'KKL' | 'KKN' | '') => setData('category', value)}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Semua Kategori</SelectItem>
                        <SelectItem value="KKL">KKL</SelectItem>
                        <SelectItem value="KKN">KKN</SelectItem>
                    </SelectContent>
                </Select>

                <Button variant="outline" disabled={processing} onClick={handleReset}>
                    Reset Filter
                </Button>
            </div>
        </Card>
    );
}
