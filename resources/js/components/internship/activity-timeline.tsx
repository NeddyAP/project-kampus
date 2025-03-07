import { InternshipLog } from '@/types/internship';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Clock, FileText, GraduationCap, History, MessageSquare, UserCheck } from 'lucide-react';

interface ActivityTimelineProps {
    logs: InternshipLog[];
}

export function ActivityTimeline({ logs }: ActivityTimelineProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'STATUS_CHANGE':
                return <History className="h-4 w-4" />;
            case 'COMMENT':
                return <MessageSquare className="h-4 w-4" />;
            case 'DOCUMENT_UPLOAD':
                return <FileText className="h-4 w-4" />;
            case 'ACTIVITY_REPORT':
                return <Clock className="h-4 w-4" />;
            case 'SUPERVISION':
                return <GraduationCap className="h-4 w-4" />;
            default:
                return <UserCheck className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-8">
            {logs.map((log) => (
                <div key={log.id} className="flex gap-4">
                    <div className="mt-1">
                        <div className="bg-background flex h-8 w-8 items-center justify-center rounded-full border">{getIcon(log.type)}</div>
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-sm leading-none font-medium">{log.title}</p>
                            <time dateTime={log.created_at} className="text-muted-foreground text-sm">
                                {format(new Date(log.created_at), 'dd MMM yyyy HH:mm', { locale: id })}
                            </time>
                        </div>
                        {log.user && <p className="text-muted-foreground text-sm">oleh {log.user.name}</p>}
                        {log.description && <p className="text-sm">{log.description}</p>}
                        {log.metadata && (
                            <div className="mt-2 text-sm">
                                {log.type === 'STATUS_CHANGE' && (
                                    <div className="text-muted-foreground">
                                        Status diubah dari <span className="font-medium">{log.metadata.old_status || '-'}</span> menjadi{' '}
                                        <span className="font-medium">{log.metadata.new_status}</span>
                                        {log.metadata.reason && <div className="mt-1">Alasan: {log.metadata.reason}</div>}
                                        {log.metadata.notes && <div className="mt-1">Catatan: {log.metadata.notes}</div>}
                                    </div>
                                )}
                                {log.type === 'DOCUMENT_UPLOAD' && (
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        <a href={`/storage/${log.metadata.file_path}`} target="_blank" className="text-primary hover:underline">
                                            Lihat Dokumen
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {logs.length === 0 && <div className="text-muted-foreground py-8 text-center text-sm">Belum ada aktivitas</div>}
        </div>
    );
}
