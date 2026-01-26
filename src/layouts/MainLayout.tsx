import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

interface MainLayoutProps {
    children: ReactNode;
    fullScreen?: boolean;
}

export const MainLayout = ({ children, fullScreen = false }: MainLayoutProps) => {
    return (
        <div className="flex min-h-screen bg-black text-foreground no-select">
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
