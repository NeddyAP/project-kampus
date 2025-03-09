import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from '@inertiajs/react';
import { InfoIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import AdminProfileForm from './admin-profile-form';
import DosenProfileForm from './dosen-profile-form';
import MahasiswaProfileForm from './mahasiswa-profile-form';
import { FormData, UserFormProps } from './user-form-types';

export default function UserForm({ user, roles, mode, dosen_users, disabledFields = [] }: UserFormProps) {
    const [activeTab, setActiveTab] = useState('basic');
    const { data, setData, post, put, processing, errors } = useForm<FormData>({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        role: user?.role || '',
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

    // Set default role for create mode if not provided
    useEffect(() => {
        if (mode === 'create' && !data.role) {
            setData('role', Object.keys(roles)[0] || 'mahasiswa');
        }
    }, [mode, data.role, roles, setData]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (mode === 'create') {
            post(route('admin.users.store'));
        } else {
            put(route('admin.users.update', user?.id));
        }
    }

    function handleRoleChange(value: string) {
        setData('role', value);
    }

    function handleNextTab() {
        setActiveTab('profile');
    }

    const isBasicInfoValid = data.name && data.email && (mode === 'edit' || data.password) && data.role;

    return (
        <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Informasi Dasar</TabsTrigger>
                    <TabsTrigger value="profile" disabled={!data.role}>
                        Informasi Profil
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
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
                        <Select value={data.role} onValueChange={handleRoleChange} disabled={disabledFields.includes('role')}>
                            <SelectTrigger disabled={disabledFields.includes('role')}>
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

                    {data.role && (
                        <Alert className="mt-4">
                            <InfoIcon className="h-4 w-4" />
                            <AlertTitle>Informasi Profil</AlertTitle>
                            <AlertDescription>
                                Silakan klik tombol "Lanjutkan" di bawah untuk mengisi data profil{' '}
                                {data.role === 'admin' ? 'administrator' : data.role === 'dosen' ? 'dosen' : 'mahasiswa'}.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="mt-6">
                        <Button type="button" onClick={handleNextTab} disabled={!isBasicInfoValid}>
                            Lanjutkan
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="profile" className="space-y-6">
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

                    {!data.role && (
                        <Alert className="mt-4 border-yellow-500 bg-yellow-50 text-yellow-900 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
                            <InfoIcon className="h-4 w-4" />
                            <AlertTitle>Role Belum Dipilih</AlertTitle>
                            <AlertDescription>
                                Silakan pilih role terlebih dahulu pada tab "Informasi Dasar" untuk menampilkan formulir profil yang sesuai.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="mt-6 flex gap-4">
                        <Button type="button" variant="outline" onClick={() => setActiveTab('basic')}>
                            Kembali
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </form>
    );
}
