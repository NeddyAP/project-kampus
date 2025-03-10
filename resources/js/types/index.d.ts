import { LucideIcon } from 'lucide-react';

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    admin_profile?: AdminProfile;
    dosen_profile?: DosenProfile;
    mahasiswa_profile?: MahasiswaProfile;
}

export interface AdminProfile {
    id?: number;
    user_id?: number;
    employee_id?: string;
    department?: string;
    position?: string;
    employment_status?: 'Tetap' | 'Kontrak' | 'Magang';
    join_date?: string;
    phone_number?: string;
    address?: string;
    supervisor_name?: string;
    work_location?: string;
    created_at?: string;
    updated_at?: string;
}

export interface DosenProfile {
    id?: number;
    user_id?: number;
    nip?: string;
    bidang_keahlian?: string;
    pendidikan_terakhir?: string;
    jabatan_akademik?: string;
    status_kepegawaian?: 'PNS' | 'Non-PNS';
    tahun_mulai_mengajar?: number;
    created_at?: string;
    updated_at?: string;
}

export interface MahasiswaProfile {
    id?: number;
    user_id?: number;
    nim?: string;
    program_studi?: string;
    angkatan?: number;
    status_akademik?: 'Aktif' | 'Cuti' | 'Lulus';
    semester?: number;
    dosen_pembimbing_id?: number | null;
    ipk?: string | number;
    created_at?: string;
    updated_at?: string;
}
