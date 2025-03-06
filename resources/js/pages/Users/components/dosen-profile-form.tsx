import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DosenProfileFormProps {
    data: {
        nip: string;
        bidang_keahlian: string;
        pendidikan_terakhir: string;
        jabatan_akademik: string;
        status_kepegawaian: 'PNS' | 'Non-PNS';
        tahun_mulai_mengajar: number;
    };
    setData: (key: string, value: string | number) => void;
    errors: Record<string, string>;
}

export default function DosenProfileForm({ data, setData, errors }: DosenProfileFormProps) {
    return (
        <div className="space-y-6 rounded-lg border p-4">
            <h2 className="text-lg font-semibold">Informasi Dosen</h2>

            <div className="space-y-2">
                <Label htmlFor="nip">NIP</Label>
                <Input id="nip" value={data.nip} onChange={(e) => setData('nip', e.target.value)} placeholder="Masukkan NIP..." />
                {errors.nip && <p className="text-sm text-red-500">{errors.nip}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="bidang_keahlian">Bidang Keahlian</Label>
                <Input
                    id="bidang_keahlian"
                    value={data.bidang_keahlian}
                    onChange={(e) => setData('bidang_keahlian', e.target.value)}
                    placeholder="Masukkan bidang keahlian..."
                />
                {errors.bidang_keahlian && <p className="text-sm text-red-500">{errors.bidang_keahlian}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="pendidikan_terakhir">Pendidikan Terakhir</Label>
                <Input
                    id="pendidikan_terakhir"
                    value={data.pendidikan_terakhir}
                    onChange={(e) => setData('pendidikan_terakhir', e.target.value)}
                    placeholder="Masukkan pendidikan terakhir..."
                />
                {errors.pendidikan_terakhir && <p className="text-sm text-red-500">{errors.pendidikan_terakhir}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="jabatan_akademik">Jabatan Akademik</Label>
                <Input
                    id="jabatan_akademik"
                    value={data.jabatan_akademik}
                    onChange={(e) => setData('jabatan_akademik', e.target.value)}
                    placeholder="Masukkan jabatan akademik..."
                />
                {errors.jabatan_akademik && <p className="text-sm text-red-500">{errors.jabatan_akademik}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="status_kepegawaian">Status Kepegawaian</Label>
                <Select value={data.status_kepegawaian} onValueChange={(value: 'PNS' | 'Non-PNS') => setData('status_kepegawaian', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih status kepegawaian" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PNS">PNS</SelectItem>
                        <SelectItem value="Non-PNS">Non-PNS</SelectItem>
                    </SelectContent>
                </Select>
                {errors.status_kepegawaian && <p className="text-sm text-red-500">{errors.status_kepegawaian}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="tahun_mulai_mengajar">Tahun Mulai Mengajar</Label>
                <Input
                    id="tahun_mulai_mengajar"
                    type="number"
                    min={1900}
                    max={new Date().getFullYear()}
                    value={data.tahun_mulai_mengajar}
                    onChange={(e) => setData('tahun_mulai_mengajar', parseInt(e.target.value))}
                    placeholder="Masukkan tahun mulai mengajar..."
                />
                {errors.tahun_mulai_mengajar && <p className="text-sm text-red-500">{errors.tahun_mulai_mengajar}</p>}
            </div>
        </div>
    );
}
