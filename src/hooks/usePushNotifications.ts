import { useState, useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export const usePushNotifications = () => {
    const { session } = useAuth();
    const [permission, setPermission] = useState<NotificationPermission>(Notification.permission);
    const [fcmToken, setFcmToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const requestPermission = async () => {
        if (!('Notification' in window)) {
            alert('Este navegador não suporta notificações.');
            return;
        }

        setLoading(true);
        try {
            const result = await Notification.requestPermission();
            setPermission(result);

            if (result === 'granted') {
                // Get Token
                const token = await getToken(messaging, {
                    vapidKey: 'BJSeBwl9tGemPRQbBcfvf7MmhJNfn2ZEcUcepy-TfpJg-3Gk6ZxUjQY-YrmUpoGO_FaQd0gxsEBQggqyNUKB-R8'
                });

                if (token) {
                    setFcmToken(token);
                    console.log('FCM Token:', token);

                    // Sync with Supabase
                    if (session?.user?.id) {
                        const { error } = await supabase
                            .from('user_devices')
                            .upsert({
                                user_id: session.user.id,
                                token: token,
                                platform: 'web',
                                last_active_at: new Date().toISOString()
                            }, { onConflict: 'user_id, token' });

                        if (error) console.error('Error saving token to Supabase:', error);
                        else console.log('Token saved to Supabase');
                    }
                }
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        } finally {
            setLoading(false);
        }
    };

    // Foreground listener
    useEffect(() => {
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Foreground Message:', payload);
            // You can show a custom toast here
            new Notification(payload.notification?.title || 'Nova mensagem', {
                body: payload.notification?.body,
                icon: '/pwa-192x192.png'
            });
        });

        return () => unsubscribe();
    }, []);

    return {
        permission,
        requestPermission,
        fcmToken,
        loading
    };
};
