export type InternshipType = 'KKL' | 'KKN';

export type InternshipStatus = 'DRAFT' | 'MENUNGGU_PERSETUJUAN' | 'DISETUJUI' | 'DITOLAK' | 'SEDANG_BERJALAN' | 'SELESAI';

export interface Internship {
    id: number;
    mahasiswa_id: number;
    dosen_id?: number;
    approved_by?: number;
    category: InternshipType;
    company_name: string;
    company_address: string;
    company_phone: string;
    supervisor_name: string;
    supervisor_phone: string;
    start_date?: string;
    end_date?: string;
    cover_letter_path?: string;
    approval_letter_path?: string;
    report_file_path?: string;
    status: InternshipStatus;
    rejection_reason?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
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
    approver?: {
        id: number;
        name: string;
        email: string;
    };
    logs?: InternshipLog[];
    supervisions?: InternshipSupervision[];
}

export interface InternshipLog {
    id: number;
    internship_id: number;
    user_id?: number;
    type: 'STATUS_CHANGE' | 'COMMENT' | 'DOCUMENT_UPLOAD' | 'ACTIVITY_REPORT' | 'SUPERVISION';
    title: string;
    description?: string;
    metadata?: {
        old_status?: string;
        new_status?: string;
        reason?: string;
        notes?: string;
        file_path?: string;
    };
    attachment_path?: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    user?: {
        id: number;
        name: string;
    };
}

export interface InternshipSupervision {
    id: number;
    internship_id: number;
    dosen_id: number;
    supervision_date: string;
    supervision_type: 'ONLINE' | 'OFFLINE' | 'HYBRID';
    supervision_location?: string;
    progress_notes?: string;
    improvements_needed?: string;
    progress_score?: number;
    final_evaluation?: Record<string, any>;
    final_score?: number;
    supervisor_notes?: string;
    attachment_path?: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    dosen?: {
        id: number;
        name: string;
        nip: string;
    };
}
