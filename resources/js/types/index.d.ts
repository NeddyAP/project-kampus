import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface AdminProfile {
    id: number;
    user_id: number;
    employee_id: string;
    department: string;
    position: string;
    employment_status: 'Tetap' | 'Kontrak' | 'Magang';
    join_date: string;
    phone_number: string | null;
    address: string | null;
    supervisor_name: string | null;
    work_location: string;
    created_at: string;
    updated_at: string;
}

export interface DosenProfile {
    id: number;
    user_id: number;
    nip: string;
    bidang_keahlian: string;
    pendidikan_terakhir: string;
    jabatan_akademik: string;
    status_kepegawaian: 'PNS' | 'Non-PNS';
    tahun_mulai_mengajar: number;
    created_at: string;
    updated_at: string;
}

export interface MahasiswaProfile {
    id: number;
    user_id: number;
    nim: string;
    program_studi: string;
    angkatan: number;
    status_akademik: 'Aktif' | 'Cuti' | 'Lulus';
    semester: number;
    dosen_pembimbing_id: number | null;
    ipk: number | null;
    created_at: string;
    updated_at: string;
    dosen_pembimbing?: User;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    admin_profile?: AdminProfile;
    dosen_profile?: DosenProfile;
    mahasiswa_profile?: MahasiswaProfile;
    [key: string]: unknown; // This allows for additional properties...
}

export interface PaginationLink {
    url: string | undefined | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
    from?: number;
    to?: number;
}

declare global {
    interface Window {
        auth: {
            user: User;
        };
    }
}
