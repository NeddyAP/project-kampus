export interface AuthUser {
    id: number;
    name: string;
    email: string;
    roles: string[];
}

export interface Auth {
    user: AuthUser | null;
}

declare module '@inertiajs/core' {
    interface PageProps {
        auth: Auth;
        [key: string]: any;
    }
}
