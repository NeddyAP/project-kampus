import { Button } from '@/components/ui/button';
import { ArrowUpIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!isVisible) return null;

    return (
        <Button
            variant="secondary"
            size="icon"
            className="fixed right-4 bottom-4 z-50 rounded-full shadow-lg"
            onClick={scrollToTop}
            aria-label="Kembali ke atas"
        >
            <ArrowUpIcon className="h-4 w-4" />
        </Button>
    );
}
