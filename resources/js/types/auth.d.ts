export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface Auth {
    user: AuthUser | null;
}

declare module '@inertiajs/core' {
    interface PageProps {
        auth: Auth;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    }
}
