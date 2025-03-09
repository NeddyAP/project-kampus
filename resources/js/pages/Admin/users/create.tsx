import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    roles: Array<{
        id: number;
        name: string;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Pengguna',
        href: '/admin/users',
    },
    {
        title: 'Tambah Pengguna',
        href: '#',
    },
];

const CreateUser = ({ roles }: Props) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        // Data dosen
        nip: '',
        bidang_keahlian: '',
        // Data mahasiswa
        nim: '',
        program_studi: '',
        angkatan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);

        router.post('/admin/users', formData, {
            onSuccess: () => {
                toast.success('Pengguna berhasil ditambahkan');
            },
            onError: (errors) => {
                setIsSubmitting(false);
                Object.keys(errors).forEach((key) => {
                    toast.error(errors[key]);
                });
            },
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (value: string) => {
        setFormData((prev) => ({ ...prev, role: value }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Pengguna" />

            <div className="container py-8">
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6">
                        {/* Data Umum */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Data Umum</CardTitle>
                                <CardDescription>Informasi dasar pengguna</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select value={formData.role} onValueChange={handleRoleChange} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem key={role.id} value={role.name}>
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Data Dosen */}
                        {formData.role === 'dosen' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Data Dosen</CardTitle>
                                    <CardDescription>Informasi khusus dosen</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="nip">NIP</Label>
                                        <Input id="nip" name="nip" value={formData.nip} onChange={handleChange} required />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="bidang_keahlian">Bidang Keahlian</Label>
                                        <Input
                                            id="bidang_keahlian"
                                            name="bidang_keahlian"
                                            value={formData.bidang_keahlian}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Data Mahasiswa */}
                        {formData.role === 'mahasiswa' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Data Mahasiswa</CardTitle>
                                    <CardDescription>Informasi khusus mahasiswa</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="nim">NIM</Label>
                                        <Input id="nim" name="nim" value={formData.nim} onChange={handleChange} required />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="program_studi">Program Studi</Label>
                                        <Input
                                            id="program_studi"
                                            name="program_studi"
                                            value={formData.program_studi}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="angkatan">Angkatan</Label>
                                        <Input id="angkatan" name="angkatan" value={formData.angkatan} onChange={handleChange} required />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <div className="flex justify-end gap-4">
                            <Button variant="outline" type="button" onClick={() => window.history.back()}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                Simpan
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default CreateUser;
