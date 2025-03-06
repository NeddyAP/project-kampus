import { toast } from 'sonner';

interface ToastOptions {
    description?: string;
}

export const showToast = {
    success: (message: string, options?: ToastOptions) => {
        toast.success(message, {
            ...options,
        });
    },
    error: (message: string, options?: ToastOptions) => {
        toast.error(message, {
            ...options,
        });
    },
    warning: (message: string, options?: ToastOptions) => {
        toast.warning(message, {
            ...options,
        });
    },
    info: (message: string, options?: ToastOptions) => {
        toast.message(message, {
            ...options,
        });
    },
};
