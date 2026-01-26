import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/layouts/MainLayout';
import { motion } from 'framer-motion';

interface PrivateRouteProps {
    children: React.ReactNode;
    fullScreen?: boolean;
}

export const PrivateRoute = ({ children, fullScreen = false }: PrivateRouteProps) => {
    const { session, loading } = useAuth();

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#D4AF37] font-black tracking-widest animate-pulse">CARREGANDO...</div>;

    if (!session) {
        return <Navigate to="/welcome" replace />;
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full min-h-screen"
        >
            <MainLayout fullScreen={fullScreen}>{children}</MainLayout>
        </motion.div>
    );
};
