import { showToast } from '@/lib/toast';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

interface FlashMessage {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

interface CustomPageProps {
    flash: {
        message?: string;
        error?: string;
        data?: FlashMessage;
    };
}

type PageProps = InertiaPageProps & CustomPageProps;

export default function FlashMessage() {
    const { flash } = usePage<PageProps>().props;

    useEffect(() => {
        // Handle simple flash messages
        if (flash.message) {
            showToast.success(flash.message);
        }

        // Handle error messages
        if (flash.error) {
            showToast.error(flash.error);
        }

        // Handle structured flash messages
        if (flash.data) {
            const { type, message } = flash.data;
            switch (type) {
                case 'success':
                    showToast.success(message);
                    break;
                case 'error':
                    showToast.error(message);
                    break;
                case 'warning':
                    showToast.warning(message);
                    break;
                case 'info':
                    showToast.info(message);
                    break;
            }
        }
    }, [flash]);

    return null;
}
