import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs = [
    { title: 'User Management', href: '/users' },
    { title: 'Edit Pengguna', href: '/users/edit' },
];

export default function Edit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(route('users.update', user.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Pengguna" />
            <div className="rounded-xl border p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        <Label htmlFor="password">Password (Opsional)</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Masukkan password baru..."
                        />
                        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
