import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, Calendar, Plus, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BottomNav: React.FC = () => {
    const navigate = useNavigate();

    const navItemClass = (isActive: boolean) => cn(
        "flex flex-col items-center gap-1 transition-colors",
        isActive ? "text-secondary" : "text-gray-400 hover:text-gray-600"
    );

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-xl border-t border-gray-200 py-4 px-6 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.03)] pb-safe">
            <NavLink to="/" className={({ isActive }) => navItemClass(isActive)}>
                <LayoutGrid className="w-6 h-6" />
                <span className="text-[10px] font-bold">Home</span>
            </NavLink>

            <NavLink to="/schedule" className={({ isActive }) => navItemClass(isActive)}>
                <Calendar className="w-6 h-6" />
                <span className="text-[10px] font-bold">Agenda</span>
            </NavLink>

            {/* Floating Action Button */}
            <button
                onClick={() => navigate('/assessment')}
                className="w-14 h-14 bg-dark rounded-full flex items-center justify-center -mt-8 shadow-lg shadow-black/30 border-4 border-light transform transition-transform hover:scale-105"
            >
                <Plus className="text-primary w-8 h-8" />
            </button>

            <NavLink to="/profile" className={({ isActive }) => navItemClass(isActive)}>
                <User className="w-6 h-6" />
                <span className="text-[10px] font-bold">Perfil</span>
            </NavLink>

            <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-6 h-6" />
                <span className="text-[10px] font-bold">Ajustes</span>
            </button>
        </nav>
    );
};
