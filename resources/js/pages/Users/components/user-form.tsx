import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/types';
import { useForm } from '@inertiajs/react';
import AdminProfileForm from './admin-profile-form';
import DosenProfileForm from './dosen-profile-form';
import MahasiswaProfileForm from './mahasiswa-profile-form';

interface UserFormProps {
    user?: User;
    roles: Record<string, string>;
    mode: 'create' | 'edit';
    dosen_users: Pick<User, 'id' | 'name'>[];
}

type FormData = {
    name: string;
    email: string;
    password: string;
    role: string;
    // Admin profile fields
    employee_id: string;
    department: string;
    position: string;
    employment_status: 'Tetap' | 'Kontrak' | 'Magang';
    join_date: string;
    phone_number: string;
    address: string;
    supervisor_name: string;
    work_location: string;
    // Dosen profile fields
    nip: string;
    bidang_keahlian: string;
    pendidikan_terakhir: string;
    jabatan_akademik: string;
    status_kepegawaian: 'PNS' | 'Non-PNS';
    tahun_mulai_mengajar: number;
    // Mahasiswa profile fields
    nim: string;
    program_studi: string;
    angkatan: number;
    status_akademik: 'Aktif' | 'Cuti' | 'Lulus';
    semester: number;
    dosen_pembimbing_id: string;
    ipk: string;
};

export default function UserForm({ user, roles, mode, dosen_users }: UserFormProps) {
    const { data, setData, post, put, processing, errors } = useForm<FormData>({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        role: user?.role || 'mahasiswa',
        // Admin profile fields
        employee_id: user?.admin_profile?.employee_id || '',
        department: user?.admin_profile?.department || '',
        position: user?.admin_profile?.position || '',
        employment_status: user?.admin_profile?.employment_status || 'Tetap',
        join_date: user?.admin_profile?.join_date || '',
        phone_number: user?.admin_profile?.phone_number || '',
        address: user?.admin_profile?.address || '',
        supervisor_name: user?.admin_profile?.supervisor_name || '',
        work_location: user?.admin_profile?.work_location || '',
        // Dosen profile fields
        nip: user?.dosen_profile?.nip || '',
        bidang_keahlian: user?.dosen_profile?.bidang_keahlian || '',
        pendidikan_terakhir: user?.dosen_profile?.pendidikan_terakhir || '',
        jabatan_akademik: user?.dosen_profile?.jabatan_akademik || '',
        status_kepegawaian: user?.dosen_profile?.status_kepegawaian || 'Non-PNS',
        tahun_mulai_mengajar: user?.dosen_profile?.tahun_mulai_mengajar || new Date().getFullYear(),
        // Mahasiswa profile fields
        nim: user?.mahasiswa_profile?.nim || '',
        program_studi: user?.mahasiswa_profile?.program_studi || '',
        angkatan: user?.mahasiswa_profile?.angkatan || new Date().getFullYear(),
        status_akademik: user?.mahasiswa_profile?.status_akademik || 'Aktif',
        semester: user?.mahasiswa_profile?.semester || 1,
        dosen_pembimbing_id: user?.mahasiswa_profile?.dosen_pembimbing_id?.toString() || '0',
        ipk: user?.mahasiswa_profile?.ipk?.toString() || '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (mode === 'create') {
            post(route('users.store'));
        } else {
            put(route('users.update', user?.id));
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic User Information */}
            <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Masukkan nama..." />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="Masukkan email..."
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password {mode === 'edit' && '(Opsional)'}</Label>
                <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="Masukkan password..."
                    required={mode === 'create'}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(roles).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
            </div>

            {/* Role-specific Profile Forms */}
            {data.role === 'admin' && (
                <AdminProfileForm
                    data={{
                        employee_id: data.employee_id,
                        department: data.department,
                        position: data.position,
                        employment_status: data.employment_status,
                        join_date: data.join_date,
                        phone_number: data.phone_number,
                        address: data.address,
                        supervisor_name: data.supervisor_name,
                        work_location: data.work_location,
                    }}
                    setData={setData}
                    errors={errors}
                />
            )}

            {data.role === 'dosen' && (
                <DosenProfileForm
                    data={{
                        nip: data.nip,
                        bidang_keahlian: data.bidang_keahlian,
                        pendidikan_terakhir: data.pendidikan_terakhir,
                        jabatan_akademik: data.jabatan_akademik,
                        status_kepegawaian: data.status_kepegawaian,
                        tahun_mulai_mengajar: data.tahun_mulai_mengajar,
                    }}
                    setData={setData}
                    errors={errors}
                />
            )}

            {data.role === 'mahasiswa' && (
                <MahasiswaProfileForm
                    data={{
                        nim: data.nim,
                        program_studi: data.program_studi,
                        angkatan: data.angkatan,
                        status_akademik: data.status_akademik,
                        semester: data.semester,
                        dosen_pembimbing_id: data.dosen_pembimbing_id,
                        ipk: data.ipk,
                    }}
                    setData={setData}
                    errors={errors}
                    dosen_users={dosen_users}
                />
            )}

            <Button type="submit" disabled={processing}>
                {processing ? 'Menyimpan...' : 'Simpan'}
            </Button>
        </form>
    );
}
