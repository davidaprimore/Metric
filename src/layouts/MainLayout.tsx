import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

interface MainLayoutProps {
    children: ReactNode;
    fullScreen?: boolean;
}

import { Toast } from '@/components/ui/Toast';
import { useState, useEffect } from 'react';

export const MainLayout = ({ children, fullScreen = false }: MainLayoutProps) => {
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'loading' });

    // Global listener for foreground notifications
    useEffect(() => {
        const handlePush = (e: any) => {
            const { title, body } = e.detail;
            setToast({
                show: true,
                message: `${title}: ${body}`,
                type: 'success'
            });
        };

        window.addEventListener('push-notification', handlePush);
        return () => window.removeEventListener('push-notification', handlePush);
    }, []);

    return (
        <div className="flex min-h-screen bg-black text-foreground no-select">
            <Toast
                isVisible={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />
            {/* Sidebar - Desktop Only (Hidden if fullScreen) */}
            {!fullScreen && <Sidebar />}

            {/* Main Content */}
            <main className={`flex-1 min-h-screen relative transition-all duration-300 ${!fullScreen ? 'md:ml-64 pb-24 md:pb-0' : ''}`}>
                {children}
            </main>

            {/* Bottom Nav - Mobile Only (Hidden if fullScreen) */}
            {!fullScreen && <BottomNav />}
        </div>
    );
};
