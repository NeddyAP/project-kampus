import { Badge } from '@/components/ui/badge';
import { InternshipStatus } from '@/types/internship';

interface StatusBadgeProps {
    status: InternshipStatus;
}

const getStatusColor = (status: InternshipStatus) => {
    switch (status) {
        case 'MENUNGGU':
            return 'bg-yellow-500';
        case 'DISETUJUI':
            return 'bg-blue-500';
        case 'DITOLAK':
            return 'bg-red-500';
        case 'BERJALAN':
            return 'bg-green-500';
        case 'SELESAI':
            return 'bg-gray-500';
        default:
            return 'bg-gray-500';
    }
};

const getStatusText = (status: InternshipStatus) => {
    switch (status) {
        case 'MENUNGGU':
            return 'Menunggu';
        case 'DISETUJUI':
            return 'Disetujui';
        case 'DITOLAK':
            return 'Ditolak';
        case 'BERJALAN':
            return 'Sedang Berjalan';
        case 'SELESAI':
            return 'Selesai';
        default:
            return status;
    }
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    return <Badge className={`${getStatusColor(status)}`}>{getStatusText(status)}</Badge>;
};
