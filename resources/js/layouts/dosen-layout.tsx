import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { DosenSidebar } from '@/components/dosen-sidebar';

interface Props {
    children: React.ReactNode;
}

export default function DosenLayout({ children }: Props) {
    return (
        <AppShell>
            <AppHeader />
            <DosenSidebar />
            {children}
        </AppShell>
    );
}