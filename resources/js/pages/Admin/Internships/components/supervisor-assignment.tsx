import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/types';
import { Internship } from '@/types/internship';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface SupervisorAssignmentProps {
    internship: Internship;
    availableDosen: User[];
}

export function SupervisorAssignment({ internship, availableDosen }: SupervisorAssignmentProps) {
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, post, processing } = useForm({
        dosen_id: '',
    });

    const handleAssign = () => {
        post(route('admin.magang.assign-supervisor', internship.id), {
            onSuccess: () => {
                setIsOpen(false);
                toast.success('Dosen pembimbing berhasil ditugaskan');
            },
        });
    };

    // Jika sudah ada dosen pembimbing dan bukan status PENDING, tidak tampilkan form
    if (internship.dosen_id && internship.status !== 'PENDING') {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">{internship.dosen_id ? 'Ubah Dosen Pembimbing' : 'Pilih Dosen Pembimbing'}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Pilih Dosen Pembimbing</DialogTitle>
                    <DialogDescription>Pilih dosen pembimbing untuk mahasiswa ini.</DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    <Select value={data.dosen_id} onValueChange={(value) => setData('dosen_id', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih dosen pembimbing" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableDosen.map((dosen) => (
                                <SelectItem key={dosen.id} value={String(dosen.id)}>
                                    {dosen.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)} disabled={processing}>
                        Batal
                    </Button>
                    <Button onClick={handleAssign} disabled={processing || !data.dosen_id}>
                        Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
