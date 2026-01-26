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
            const { title, body } = payload.notification || {};

            // 1. Try native notification
            if (Notification.permission === 'granted') {
                new Notification(title || 'Nova mensagem', {
                    body: body,
                    icon: '/pwa-192x192.png'
                });
            }

            // 2. Fallback: Dispatch custom event for UI Toast
            // This ensures the user sees it inside the app even if native notification fails
            const event = new CustomEvent('push-notification', {
                detail: { title, body }
            });
            window.dispatchEvent(event);
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
