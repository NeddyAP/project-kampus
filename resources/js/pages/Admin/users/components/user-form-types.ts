import { User } from '@/types';

export interface UserFormProps {
    user?: User;
    roles: Record<string, string>;
    mode: 'create' | 'edit';
    dosen_users: Pick<User, 'id' | 'name'>[];
    disabledFields?: string[];
}

export type FormData = {
    name: string;
    email: string;
    password: string;
    role: string;
    // Admin profile fields
    employee_id: string;
    department: string;
    position: string;
    employment_status: 'Tetap' | 'Kontrak' | 'Magang';
    join_date: string;
    phone_number: string;
    address: string;
    supervisor_name: string;
    work_location: string;
    // Dosen profile fields
    nip: string;
    bidang_keahlian: string;
    pendidikan_terakhir: string;
    jabatan_akademik: string;
    status_kepegawaian: 'PNS' | 'Non-PNS';
    tahun_mulai_mengajar: number;
    // Mahasiswa profile fields
    nim: string;
    program_studi: string;
    angkatan: number;
    status_akademik: 'Aktif' | 'Cuti' | 'Lulus';
    semester: number;
    dosen_pembimbing_id: string | null;
    ipk: string;
};
