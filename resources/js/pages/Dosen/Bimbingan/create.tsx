import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Head, Link, useForm } from '@inertiajs/react';
import { CalendarIcon, ChevronLeft, Clock } from 'lucide-react';

export default function BuatJadwalBimbingan() {
    // Form untuk membuat jadwal bimbingan
    const {
        data: scheduleData,
        setData: setScheduleData,
        post: postSchedule,
        processing: scheduleProcessing,
        reset: resetSchedule,
    } = useForm({
        title: '',
        notes: '',
        date: '',
        time: '',
        category: 'KKL',
        attachment: null as File | null,
    });

    // Handle schedule form submission
    const handleScheduleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postSchedule(route('dosen.bimbingan.schedule.create'), {
            onSuccess: () => {
                resetSchedule();
            },
        });
    };

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setScheduleData('attachment', e.target.files[0]);
        }
    };

    return (
        <AppShell>
            <Head title="Buat Jadwal Bimbingan" />
            <AppHeader />
            <AppContent>
                <div className="container mx-auto py-10">
                    <Link href={route('dosen.bimbingan.upcoming')} className="mb-4 flex items-center space-x-2 text-sm hover:underline">
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Kembali ke Jadwal Bimbingan
                    </Link>
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Buat Jadwal Bimbingan</CardTitle>
                            <CardDescription>Buat jadwal bimbingan untuk semua mahasiswa yang dibimbing</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleScheduleSubmit}>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Kategori Bimbingan</label>
                                            <RadioGroup
                                                value={scheduleData.category}
                                                onValueChange={(value) => setScheduleData('category', value)}
                                                className="flex gap-4"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="KKL" id="kkl" />
                                                    <Label htmlFor="kkl">Kuliah Kerja Lapangan (KKL)</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="KKN" id="kkn" />
                                                    <Label htmlFor="kkn">Kuliah Kerja Nyata (KKN)</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>

                                        <div>
                                            <label htmlFor="title" className="mb-2 block text-sm font-medium">
                                                Judul Bimbingan
                                            </label>
                                            <Input
                                                id="title"
                                                value={scheduleData.title}
                                                onChange={(e) => setScheduleData('title', e.target.value)}
                                                placeholder="Contoh: Bimbingan Mingguan"
                                                className="w-full"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="notes" className="mb-2 block text-sm font-medium">
                                                Catatan Bimbingan
                                            </label>
                                            <Textarea
                                                id="notes"
                                                value={scheduleData.notes}
                                                onChange={(e) => setScheduleData('notes', e.target.value)}
                                                placeholder="Masukkan agenda atau catatan untuk bimbingan"
                                                rows={4}
                                                className="w-full"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="date" className="mb-2 block text-sm font-medium">
                                                Tanggal
                                            </label>
                                            <div className="relative">
                                                <Input
                                                    id="date"
                                                    type="date"
                                                    value={scheduleData.date}
                                                    onChange={(e) => setScheduleData('date', e.target.value)}
                                                    className="w-full"
                                                    min={new Date().toISOString().split('T')[0]}
                                                    required
                                                />
                                                <CalendarIcon className="text-muted-foreground absolute top-2.5 right-3 h-4 w-4" />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="time" className="mb-2 block text-sm font-medium">
                                                Waktu
                                            </label>
                                            <div className="relative">
                                                <Input
                                                    id="time"
                                                    type="time"
                                                    value={scheduleData.time}
                                                    onChange={(e) => setScheduleData('time', e.target.value)}
                                                    className="w-full"
                                                    required
                                                />
                                                <Clock className="text-muted-foreground absolute top-2.5 right-3 h-4 w-4" />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="attachment" className="mb-2 block text-sm font-medium">
                                                Lampiran (Opsional)
                                            </label>
                                            <Input id="attachment" type="file" onChange={handleFileChange} className="w-full" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Button type="submit" disabled={scheduleProcessing}>
                                        Buat Jadwal Bimbingan
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </AppContent>
        </AppShell>
    );
}
