import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface AdminProfileFormProps {
    data: {
        employee_id: string;
        department: string;
        position: string;
        employment_status: 'Tetap' | 'Kontrak' | 'Magang';
        join_date: string;
        phone_number: string;
        address: string;
        supervisor_name: string;
        work_location: string;
    };
    setData: (key: string, value: string) => void;
    errors: Record<string, string>;
}

export default function AdminProfileForm({ data, setData, errors }: AdminProfileFormProps) {
    return (
        <div className="space-y-6 rounded-lg border p-4">
            <h2 className="text-lg font-semibold">Informasi Admin</h2>

            <div className="space-y-2">
                <Label htmlFor="employee_id">ID Pegawai</Label>
                <Input
                    id="employee_id"
                    value={data.employee_id}
                    onChange={(e) => setData('employee_id', e.target.value)}
                    placeholder="Masukkan ID pegawai..."
                />
                {errors.employee_id && <p className="text-sm text-red-500">{errors.employee_id}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="department">Departemen</Label>
                <Input
                    id="department"
                    value={data.department}
                    onChange={(e) => setData('department', e.target.value)}
                    placeholder="Masukkan departemen..."
                />
                {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="position">Jabatan</Label>
                <Input id="position" value={data.position} onChange={(e) => setData('position', e.target.value)} placeholder="Masukkan jabatan..." />
                {errors.position && <p className="text-sm text-red-500">{errors.position}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="employment_status">Status Kepegawaian</Label>
                <Select value={data.employment_status} onValueChange={(value: 'Tetap' | 'Kontrak' | 'Magang') => setData('employment_status', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih status kepegawaian" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Tetap">Tetap</SelectItem>
                        <SelectItem value="Kontrak">Kontrak</SelectItem>
                        <SelectItem value="Magang">Magang</SelectItem>
                    </SelectContent>
                </Select>
                {errors.employment_status && <p className="text-sm text-red-500">{errors.employment_status}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="join_date">Tanggal Bergabung</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn('w-full justify-start text-left font-normal', !data.join_date && 'text-muted-foreground')}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {data.join_date ? format(new Date(data.join_date), 'PPP') : <span>Pilih tanggal</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={data.join_date ? new Date(data.join_date) : undefined}
                            onSelect={(date) => setData('join_date', date ? format(date, 'yyyy-MM-dd') : '')}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {errors.join_date && <p className="text-sm text-red-500">{errors.join_date}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone_number">Nomor Telepon</Label>
                <Input
                    id="phone_number"
                    value={data.phone_number}
                    onChange={(e) => setData('phone_number', e.target.value)}
                    placeholder="Masukkan nomor telepon..."
                />
                {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Textarea id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} placeholder="Masukkan alamat..." />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="supervisor_name">Nama Atasan</Label>
                <Input
                    id="supervisor_name"
                    value={data.supervisor_name}
                    onChange={(e) => setData('supervisor_name', e.target.value)}
                    placeholder="Masukkan nama atasan..."
                />
                {errors.supervisor_name && <p className="text-sm text-red-500">{errors.supervisor_name}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="work_location">Lokasi Kerja</Label>
                <Input
                    id="work_location"
                    value={data.work_location}
                    onChange={(e) => setData('work_location', e.target.value)}
                    placeholder="Masukkan lokasi kerja..."
                />
                {errors.work_location && <p className="text-sm text-red-500">{errors.work_location}</p>}
            </div>
        </div>
    );
}
