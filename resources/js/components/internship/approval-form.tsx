import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Internship } from '@/types/internship';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ApprovalFormProps {
    internship: Internship;
}

export function ApprovalForm({ internship }: ApprovalFormProps) {
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [isRejectOpen, setIsRejectOpen] = useState(false);

    const {
        data: approveData,
        setData: setApproveData,
        post: submitApprove,
        processing: approveProcessing,
    } = useForm({
        notes: '',
    });

    const {
        data: rejectData,
        setData: setRejectData,
        post: submitReject,
        processing: rejectProcessing,
    } = useForm({
        reason: '',
    });

    const handleApprove = () => {
        submitApprove(route('admin.magang.approve', internship.id), {
            onSuccess: () => {
                setIsApproveOpen(false);
                toast.success('Pengajuan magang berhasil disetujui');
            },
        });
    };

    const handleReject = () => {
        submitReject(route('admin.magang.reject', internship.id), {
            onSuccess: () => {
                setIsRejectOpen(false);
                toast.success('Pengajuan magang berhasil ditolak');
            },
        });
    };

    if (!internship.canBeApproved()) {
        return null;
    }

    return (
        <div className="flex gap-3">
            {/* Dialog Persetujuan */}
            <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
                <DialogTrigger asChild>
                    <Button>Setujui Pengajuan</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Setujui Pengajuan Magang</DialogTitle>
                        <DialogDescription>Pengajuan magang akan disetujui dan mahasiswa dapat memulai kegiatan magang.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                        <Textarea
                            placeholder="Catatan (opsional)"
                            value={approveData.notes}
                            onChange={(e) => setApproveData('notes', e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsApproveOpen(false)} disabled={approveProcessing}>
                            Batal
                        </Button>
                        <Button onClick={handleApprove} disabled={approveProcessing}>
                            Setujui
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog Penolakan */}
            <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <DialogTrigger asChild>
                    <Button variant="destructive">Tolak Pengajuan</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tolak Pengajuan Magang</DialogTitle>
                        <DialogDescription>Pengajuan magang akan ditolak. Harap berikan alasan penolakan.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                        <Textarea
                            placeholder="Alasan penolakan"
                            value={rejectData.reason}
                            onChange={(e) => setRejectData('reason', e.target.value)}
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectOpen(false)} disabled={rejectProcessing}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleReject} disabled={rejectProcessing || !rejectData.reason}>
                            Tolak
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
