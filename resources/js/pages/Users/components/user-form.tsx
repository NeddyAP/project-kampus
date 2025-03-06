import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/types';
import { useForm } from '@inertiajs/react';

interface UserFormProps {
    user?: User;
    roles: Record<string, string>;
    mode: 'create' | 'edit';
}

export default function UserForm({ user, roles, mode }: UserFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        role: user?.role || 'mahasiswa',
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

            <Button type="submit" disabled={processing}>
                {processing ? 'Menyimpan...' : 'Simpan'}
            </Button>
        </form>
    );
}
