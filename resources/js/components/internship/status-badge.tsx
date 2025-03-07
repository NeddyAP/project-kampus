import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { InternshipStatus } from '@/types/internship';

interface StatusBadgeProps {
    status: InternshipStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const getStatusConfig = (status: InternshipStatus) => {
        switch (status) {
            case 'DRAFT':
                return {
                    label: 'Draft',
                    variant: 'secondary',
                };
            case 'PENDING':
                return {
                    label: 'Menunggu Persetujuan',
                    variant: 'warning',
                };
            case 'APPROVED':
                return {
                    label: 'Disetujui',
                    variant: 'success',
                };
            case 'REJECTED':
                return {
                    label: 'Ditolak',
                    variant: 'destructive',
                };
            case 'ONGOING':
                return {
                    label: 'Sedang Berlangsung',
                    variant: 'info',
                };
            case 'COMPLETED':
                return {
                    label: 'Selesai',
                    variant: 'success',
                };
            case 'CANCELLED':
                return {
                    label: 'Dibatalkan',
                    variant: 'destructive',
                };
            default:
                return {
                    label: status,
                    variant: 'secondary',
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <Badge
            variant={config.variant as any}
            className={cn(
                'min-w-24 justify-center',
                status === 'PENDING' && 'bg-yellow-500 hover:bg-yellow-600',
                status === 'ONGOING' && 'bg-blue-500 hover:bg-blue-600',
            )}
        >
            {config.label}
        </Badge>
    );
}
