export type InternshipType = 'KKL' | 'KKN';

export type InternshipStatus = 'MENUNGGU_PERSETUJUAN' | 'DISETUJUI' | 'DITOLAK' | 'SEDANG_BERJALAN' | 'SELESAI';

export interface Internship {
    id: number;
    mahasiswa_id: number;
    dosen_id?: number;
    type: InternshipType;
    status: InternshipStatus;
    start_date?: string;
    end_date?: string;
    description: string;
    created_at: string;
    updated_at: string;
    mahasiswa?: {
        id: number;
        name: string;
        email: string;
        nim: string;
    };
    dosen?: {
        id: number;
        name: string;
        email: string;
        nip: string;
    };
    logs?: InternshipLog[];
}

export interface InternshipLog {
    id: number;
    internship_id: number;
    activity: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface InternshipSupervision {
    id: number;
    internship_id: number;
    dosen_id: number;
    notes?: string;
    created_at: string;
    updated_at: string;
}
