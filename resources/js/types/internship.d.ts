import { User } from './index';

export interface Internship {
    id: number;
    mahasiswa_id: number;
    dosen_id: number | null;
    approved_by: number | null;
    category: 'KKL' | 'KKN';
    company_name: string;
    company_address: string;
    company_phone: string;
    supervisor_name: string;
    supervisor_phone: string;
    start_date: string;
    end_date: string;
    cover_letter_path: string | null;
    approval_letter_path: string | null;
    report_file_path: string | null;
    status: InternshipStatus;
    rejection_reason: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;

    // Relations
    mahasiswa?: User;
    dosen?: User;
    approver?: User;
    logs?: InternshipLog[];
    supervisions?: InternshipSupervision[];

    // Helper methods
    canBeApproved(): boolean;
    canBeRejected(): boolean;
    canBeCompleted(): boolean;
    isActive(): boolean;
}

export type InternshipStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface InternshipLog {
    id: number;
    internship_id: number;
    user_id: number;
    type: InternshipLogType;
    title: string;
    description: string | null;
    metadata: any | null;
    attachment_path: string | null;
    created_at: string;
    updated_at: string;

    // Relations
    user?: User;
}

export type InternshipLogType = 'STATUS_CHANGE' | 'COMMENT' | 'DOCUMENT_UPLOAD' | 'ACTIVITY_REPORT' | 'SUPERVISION';

export interface InternshipSupervision {
    id: number;
    internship_id: number;
    dosen_id: number;
    supervision_date: string;
    supervision_type: 'ONLINE' | 'OFFLINE' | 'HYBRID';
    supervision_location: string | null;
    progress_notes: string;
    improvements_needed: string | null;
    progress_score: number | null;
    final_evaluation: any | null;
    final_score: number | null;
    supervisor_notes: string | null;
    attachment_path: string | null;
    created_at: string;
    updated_at: string;

    // Relations
    dosen?: User;
}

export interface InternshipFilters {
    status?: InternshipStatus;
    category?: 'KKL' | 'KKN';
    search?: string;
}

export interface InternshipFormData {
    dosen_id?: number;
    category: 'KKL' | 'KKN';
    company_name: string;
    company_address: string;
    company_phone: string;
    supervisor_name: string;
    supervisor_phone: string;
    start_date: string;
    end_date: string;
    cover_letter?: File;
}
