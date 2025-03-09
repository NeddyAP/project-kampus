import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatBytes } from '@/lib/utils';
import { File } from 'lucide-react';

interface Media {
    id: number;
    filename: string;
    url: string;
    mime_type: string;
    size: number;
    created_at: string;
    internship: {
        id: number;
        mahasiswa: {
            name: string;
        };
    };
}

interface Props {
    media: Media[];
    onDownload: (media: Media) => void;
    onPreview: (media: Media) => void;
}

export const MediaGrid = ({ media, onDownload, onPreview }: Props) => {
    const isPreviewable = (mimeType: string) => {
        return mimeType.startsWith('image/') || mimeType === 'application/pdf';
    };

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {media.map((item) => (
                <Card key={item.id}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-center py-4">
                            <File className="h-12 w-12" />
                        </div>

                        <div className="space-y-2">
                            <div className="line-clamp-1 font-medium" title={item.filename}>
                                {item.filename}
                            </div>

                            <div className="text-muted-foreground text-sm">Diunggah oleh: {item.internship.mahasiswa.name}</div>

                            <div className="text-muted-foreground text-sm">Ukuran: {formatBytes(item.size)}</div>

                            <div className="text-muted-foreground text-sm">
                                Tanggal:{' '}
                                {new Date(item.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="w-full" onClick={() => onDownload(item)}>
                                    Unduh
                                </Button>

                                {isPreviewable(item.mime_type) && (
                                    <Button variant="outline" size="sm" className="w-full" onClick={() => onPreview(item)}>
                                        Pratinjau
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
