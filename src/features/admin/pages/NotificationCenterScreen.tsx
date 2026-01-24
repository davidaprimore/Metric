import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Bell,
    UserPlus,
    ChevronRight,
    ShieldAlert,
    Clock,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { BottomNav } from '@/components/layout/BottomNav';
import { cn } from '@/lib/utils';

export const NotificationCenterScreen: React.FC = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            // 1. Fetch standard notifications
            const { data: notifs, error } = await supabase
                .from('notifications')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            let combined = notifs || [];

            // 2. Synthesize "Virtual Notifications" for Admins
            // We check for pending profiles
            const { data: user } = await supabase.auth.getUser();
            // Simple check if I am admin (can be improved with role check)
            // But usually this screen is inclusive. 
            // We'll fetch pending profiles anyway, handling permissions gracefully.

            try {
                // Determine if I am admin by checking if I can read all profiles or via context
                // Let's just try to fetch pending profiles. RLS will block if not allowed.
                const { data: pending } = await supabase
                    .from('profiles')
                    .select('id, full_name, created_at')
                    .eq('approval_status', 'pending');

                if (pending && pending.length > 0) {
                    const virtualNotifs = pending.map(p => ({
                        id: `virt_${p.id}`,
                        title: 'Novo Profissional Aguardando',
                        message: `${p.full_name} completou o cadastro e aguarda validação.`,
                        type: 'warning',
                        created_at: p.created_at,
                        read: false,
                        is_virtual: true, // Marker
                        data_id: p.id
                    }));
                    combined = [...virtualNotifs, ...combined];
                }
            } catch (err) {
                // Ignore RLS errors if not admin
            }

            // Sort combined by date desc
            combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            setNotifications(combined);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', id);

            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    return (
        <div className="min-h-screen bg-[#F1F3F5] pb-32 font-sans px-5">
            <header className="pt-8 flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-dark active:scale-95 transition-transform"
                >
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-xl font-bold text-dark tracking-tight">
                    Central de <span className="text-secondary">Avisos</span>
                </h1>
            </header>

            <div className="space-y-4">
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <div
                            key={notif.id}
                            onClick={() => {
                                // If virtual, navigate directly to detail
                                if (notif.is_virtual) {
                                    navigate(`/admin/professionals/verify/${notif.data_id}`);
                                    return;
                                }

                                markAsRead(notif.id);
                                // If it's a professional registration notification, navigate to verification
                                if (notif.title.includes('Profissional')) {
                                    navigate('/admin/registrations/approvals');
                                }
                            }}
                            className={cn(
                                "bg-white p-5 rounded-[2rem] shadow-sm border transition-all active:scale-98 cursor-pointer relative overflow-hidden",
                                notif.read ? "border-transparent opacity-80" : "border-secondary/20 shadow-md shadow-secondary/5"
                            )}
                        >
                            <div className="flex gap-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                                    notif.type === 'warning' ? "bg-amber-100 text-amber-600" :
                                        notif.type === 'success' ? "bg-emerald-100 text-emerald-600" :
                                            "bg-blue-100 text-blue-600"
                                )}>
                                    {notif.type === 'warning' ? <ShieldAlert size={22} /> :
                                        notif.type === 'success' ? <CheckCircle2 size={22} /> : <Bell size={22} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-sm font-black text-dark leading-tight line-clamp-1">{notif.title}</h3>
                                        <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap ml-2">
                                            {new Date(notif.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-1 line-clamp-2">
                                        {notif.message}
                                    </p>
                                </div>
                            </div>
                            {!notif.read && (
                                <div className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full"></div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="py-20 flex flex-col items-center text-center px-10">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-300">
                            <Bell size={40} />
                        </div>
                        <p className="text-sm font-bold text-gray-400">Nenhuma notificação por aqui no momento.</p>
                        <p className="text-[10px] text-gray-300 font-medium mt-2 uppercase tracking-widest">Tudo em ordem!</p>
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
};
