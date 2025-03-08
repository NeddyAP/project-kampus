import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InternshipStatus, InternshipType } from '@/types/internship';

interface FilterFormProps {
    search: string;
    status: InternshipStatus | 'ALL';
    type: InternshipType | 'ALL';
    onSearchChange: (value: string) => void;
    onStatusChange: (value: InternshipStatus | 'ALL') => void;
    onTypeChange: (value: InternshipType | 'ALL') => void;
}

export const FilterForm = ({ search, status, type, onSearchChange, onStatusChange, onTypeChange }: FilterFormProps) => {
    return (
        <div className="flex flex-col gap-4 md:flex-row">
            <div className="w-full md:w-1/3">
                <Input placeholder="Cari berdasarkan nama mahasiswa..." value={search} onChange={(e) => onSearchChange(e.target.value)} />
            </div>

            <div className="w-full md:w-1/4">
                <Select value={status} onValueChange={(value) => onStatusChange(value as InternshipStatus | 'ALL')}>
                    <SelectTrigger>
                        <SelectValue placeholder="Status Magang" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Semua Status</SelectItem>
                        <SelectItem value="MENUNGGU_PERSETUJUAN">Menunggu Persetujuan</SelectItem>
                        <SelectItem value="DISETUJUI">Disetujui</SelectItem>
                        <SelectItem value="DITOLAK">Ditolak</SelectItem>
                        <SelectItem value="SEDANG_BERJALAN">Sedang Berjalan</SelectItem>
                        <SelectItem value="SELESAI">Selesai</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full md:w-1/4">
                <Select value={type} onValueChange={(value) => onTypeChange(value as InternshipType | 'ALL')}>
                    <SelectTrigger>
                        <SelectValue placeholder="Tipe Magang" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Semua Tipe</SelectItem>
                        <SelectItem value="KKL">KKL</SelectItem>
                        <SelectItem value="KKN">KKN</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
