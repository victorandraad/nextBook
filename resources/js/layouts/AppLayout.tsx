import { Toaster } from '@/components/ui/toaster';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <main>{children}</main>
            <Toaster />
        </div>
    );
} 