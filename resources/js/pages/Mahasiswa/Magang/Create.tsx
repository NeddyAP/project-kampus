import { AppContent } from "@/components/app-content";
import { AppHeader } from "@/components/app-header";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Head, Link, useForm } from "@inertiajs/react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

interface Props {
    dosen: { id: number; name: string }[];
    categories: Record<string, string>;
}

export default function MahasiswaMagangCreate({ dosen, categories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        dosen_id: "",
        category: "",
        company_name: "",
        company_address: "",
        company_phone: "",
        supervisor_name: "",
        supervisor_phone: "",
        start_date: null as Date | null | undefined,
        end_date: null as Date | null | undefined,
        cover_letter: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("mahasiswa.magang.store"), {
            forceFormData: true,
            onError: (errors) => {
                if (errors.cover_letter) {
                    alert('Error saat mengunggah file: ' + errors.cover_letter);
                }
            },
            preserveScroll: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const maxSize = 2 * 1024 * 1024; // 2MB in bytes

            if (file.size > maxSize) {
                e.target.value = ''; // Clear the input
                alert('Ukuran file tidak boleh lebih dari 2MB');
                return;
            }

            setData("cover_letter", file);
        }
    };

    const formatDate = (date: Date) => {
        return format(date, "dd MMMM yyyy", { locale: id });
    };

    return (
        <AppShell>
            <Head title="Buat Pengajuan Magang" />
            <AppHeader />
            <AppContent>
                <div className="container mx-auto py-10">
                    <div className="mb-6">
                        <Link
                            href={route("mahasiswa.magang.index")}
                            className="text-muted-foreground hover:text-primary text-sm"
                        >
                            &larr; Kembali ke Daftar Magang
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Buat Pengajuan Magang Baru</CardTitle>
                            <CardDescription>
                                Silahkan isi data berikut untuk mengajukan magang
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Kategori Magang</Label>
                                        <Select
                                            value={data.category}
                                            onValueChange={(value) => setData("category", value)}
                                        >
                                            <SelectTrigger id="category">
                                                <SelectValue placeholder="Pilih kategori magang" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(categories).map(([value, label]) => (
                                                    <SelectItem key={value} value={value}>
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category && (
                                            <p className="text-destructive text-sm">{errors.category}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="dosen_id">Dosen Pembimbing</Label>
                                        <Select
                                            value={data.dosen_id}
                                            onValueChange={(value) => setData("dosen_id", value)}
                                        >
                                            <SelectTrigger id="dosen_id">
                                                <SelectValue placeholder="Pilih dosen pembimbing" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {dosen.map((d) => (
                                                    <SelectItem key={d.id} value={d.id.toString()}>
                                                        {d.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.dosen_id && (
                                            <p className="text-destructive text-sm">{errors.dosen_id}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company_name">Nama Perusahaan</Label>
                                    <Input
                                        id="company_name"
                                        value={data.company_name}
                                        onChange={(e) => setData("company_name", e.target.value)}
                                        placeholder="Masukkan nama perusahaan"
                                    />
                                    {errors.company_name && (
                                        <p className="text-destructive text-sm">{errors.company_name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company_address">Alamat Perusahaan</Label>
                                    <Textarea
                                        id="company_address"
                                        value={data.company_address}
                                        onChange={(e) => setData("company_address", e.target.value)}
                                        placeholder="Masukkan alamat lengkap perusahaan"
                                    />
                                    {errors.company_address && (
                                        <p className="text-destructive text-sm">{errors.company_address}</p>
                                    )}
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="company_phone">Telepon Perusahaan</Label>
                                        <Input
                                            id="company_phone"
                                            value={data.company_phone}
                                            onChange={(e) => setData("company_phone", e.target.value)}
                                            placeholder="Contoh: 021-1234567"
                                        />
                                        {errors.company_phone && (
                                            <p className="text-destructive text-sm">{errors.company_phone}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="supervisor_phone">Telepon Supervisor</Label>
                                        <Input
                                            id="supervisor_phone"
                                            value={data.supervisor_phone}
                                            onChange={(e) => setData("supervisor_phone", e.target.value)}
                                            placeholder="Contoh: 08123456789"
                                        />
                                        {errors.supervisor_phone && (
                                            <p className="text-destructive text-sm">{errors.supervisor_phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="supervisor_name">Nama Supervisor</Label>
                                    <Input
                                        id="supervisor_name"
                                        value={data.supervisor_name}
                                        onChange={(e) => setData("supervisor_name", e.target.value)}
                                        placeholder="Masukkan nama supervisor/pembimbing di perusahaan"
                                    />
                                    {errors.supervisor_name && (
                                        <p className="text-destructive text-sm">{errors.supervisor_name}</p>
                                    )}
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Tanggal Mulai</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !data.start_date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {data.start_date ? (
                                                        formatDate(data.start_date)
                                                    ) : (
                                                        <span>Pilih tanggal mulai</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={data.start_date || undefined}
                                                    onSelect={(date) =>
                                                        setData("start_date", date)
                                                    }
                                                    initialFocus
                                                    locale={id}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {errors.start_date && (
                                            <p className="text-destructive text-sm">{errors.start_date}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Tanggal Selesai</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !data.end_date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {data.end_date ? (
                                                        formatDate(data.end_date)
                                                    ) : (
                                                        <span>Pilih tanggal selesai</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={data.end_date || undefined}
                                                    onSelect={(date) =>
                                                        setData("end_date", date)
                                                    }
                                                    initialFocus
                                                    fromDate={data.start_date || undefined}
                                                    locale={id}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {errors.end_date && (
                                            <p className="text-destructive text-sm">{errors.end_date}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cover_letter">Surat Pengantar (PDF)</Label>
                                    <Input
                                        id="cover_letter"
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                    />
                                    <p className="text-muted-foreground text-sm">
                                        Unggah surat pengantar dalam format PDF (maksimal 2MB)
                                    </p>
                                    {errors.cover_letter && (
                                        <p className="text-destructive text-sm">{errors.cover_letter}</p>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Batal
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Buat Pengajuan
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
