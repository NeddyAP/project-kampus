export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface Auth {
    user: AuthUser | null;
    roles: {
        isAdmin: boolean;
        isDosen: boolean;
        isMahasiswa: boolean;
    };
    can: (permission: string) => boolean;
    check: (role: string) => boolean;
    guest: boolean;
    authenticated: boolean;
    userCan: (permission: string) => boolean;
    userIs: (role: string) => boolean;
}

declare module '@inertiajs/core' {
    interface PageProps {
        auth: Auth;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    }
}
