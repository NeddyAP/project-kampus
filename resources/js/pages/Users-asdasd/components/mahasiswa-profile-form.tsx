import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/types';

interface MahasiswaProfileFormProps {
    data: {
        nim: string;
        program_studi: string;
        angkatan: number;
        status_akademik: 'Aktif' | 'Cuti' | 'Lulus';
        semester: number;
        dosen_pembimbing_id: string;
        ipk: string;
    };
    setData: (key: string, value: string | number) => void;
    errors: Record<string, string>;
    dosen_users: Pick<User, 'id' | 'name'>[];
}

export default function MahasiswaProfileForm({ data, setData, errors, dosen_users }: MahasiswaProfileFormProps) {
    return (
        <div className="space-y-6 rounded-lg border p-4">
            <h2 className="text-lg font-semibold">Informasi Mahasiswa</h2>

            <div className="space-y-2">
                <Label htmlFor="nim">NIM</Label>
                <Input id="nim" value={data.nim} onChange={(e) => setData('nim', e.target.value)} placeholder="Masukkan NIM..." />
                {errors.nim && <p className="text-sm text-red-500">{errors.nim}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="program_studi">Program Studi</Label>
                <Input
                    id="program_studi"
                    value={data.program_studi}
                    onChange={(e) => setData('program_studi', e.target.value)}
                    placeholder="Masukkan program studi..."
                />
                {errors.program_studi && <p className="text-sm text-red-500">{errors.program_studi}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="angkatan">Angkatan</Label>
                <Input
                    id="angkatan"
                    type="number"
                    min={2000}
                    max={new Date().getFullYear() + 1}
                    value={data.angkatan}
                    onChange={(e) => setData('angkatan', parseInt(e.target.value))}
                    placeholder="Masukkan tahun angkatan..."
                />
                {errors.angkatan && <p className="text-sm text-red-500">{errors.angkatan}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="status_akademik">Status Akademik</Label>
                <Select value={data.status_akademik} onValueChange={(value: 'Aktif' | 'Cuti' | 'Lulus') => setData('status_akademik', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih status akademik" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Aktif">Aktif</SelectItem>
                        <SelectItem value="Cuti">Cuti</SelectItem>
                        <SelectItem value="Lulus">Lulus</SelectItem>
                    </SelectContent>
                </Select>
                {errors.status_akademik && <p className="text-sm text-red-500">{errors.status_akademik}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input
                    id="semester"
                    type="number"
                    min={1}
                    max={14}
                    value={data.semester}
                    onChange={(e) => setData('semester', parseInt(e.target.value))}
                    placeholder="Masukkan semester..."
                />
                {errors.semester && <p className="text-sm text-red-500">{errors.semester}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="dosen_pembimbing_id">Dosen Pembimbing</Label>
                <Select value={data.dosen_pembimbing_id || '0'} onValueChange={(value) => setData('dosen_pembimbing_id', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih dosen pembimbing" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0">Tidak Ada</SelectItem>
                        {dosen_users.map((dosen) => (
                            <SelectItem key={dosen.id} value={String(dosen.id)}>
                                {dosen.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.dosen_pembimbing_id && <p className="text-sm text-red-500">{errors.dosen_pembimbing_id}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="ipk">IPK</Label>
                <Input
                    id="ipk"
                    type="number"
                    step="0.01"
                    min={0}
                    max={4}
                    value={data.ipk}
                    onChange={(e) => setData('ipk', e.target.value)}
                    placeholder="Masukkan IPK..."
                />
                {errors.ipk && <p className="text-sm text-red-500">{errors.ipk}</p>}
            </div>
        </div>
    );
}
