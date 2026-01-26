import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Simple offline queue implementation
interface QueueItem {
    id: string;
    type: 'ASSESSMENT_CREATE' | 'ASSESSMENT_UPDATE';
    payload: any;
    createdAt: number;
}

interface OfflineQueueContextType {
    isOnline: boolean;
    queue: QueueItem[];
    addToQueue: (type: QueueItem['type'], payload: any) => void;
    syncQueue: () => Promise<void>;
}

const OfflineQueueContext = createContext<OfflineQueueContextType>({} as OfflineQueueContextType);

export const OfflineQueueProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [queue, setQueue] = useState<QueueItem[]>([]);

    useEffect(() => {
        // Load queue from localStorage on mount
        const savedQueue = localStorage.getItem('metric_offline_queue');
        if (savedQueue) {
            setQueue(JSON.parse(savedQueue));
        }

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Save queue to storage whenever it changes
    useEffect(() => {
        localStorage.setItem('metric_offline_queue', JSON.stringify(queue));
    }, [queue]);

    // Auto-sync when coming back online
    useEffect(() => {
        if (isOnline && queue.length > 0) {
            syncQueue();
        }
    }, [isOnline]);

    const addToQueue = (type: QueueItem['type'], payload: any) => {
        const newItem: QueueItem = {
            id: crypto.randomUUID(),
            type,
            payload,
            createdAt: Date.now(),
        };
        setQueue(prev => [...prev, newItem]);
        alert('Você está offline. A ação foi salva e será sincronizada assim que a conexão retornar.');
    };

    const syncQueue = async () => {
        if (queue.length === 0) return;

        const newQueue = [...queue];

        // Process items
        for (const item of queue) {
            try {
                if (item.type === 'ASSESSMENT_CREATE') {
                    const { error } = await supabase.from('assessments').insert(item.payload);
                    if (error) throw error;
                }
                // Remove processed item
                const index = newQueue.findIndex(i => i.id === item.id);
                if (index > -1) newQueue.splice(index, 1);

            } catch (error) {
                console.error('Failed to sync item', item, error);
                // Leave in queue to retry? Or move to "failed"? 
                // For simple strategy, we keep it in queue but maybe alert user.
            }
        }

        setQueue(newQueue);
        if (newQueue.length === 0) {
            console.log('Sync complete');
        }
    };

    return (
        <OfflineQueueContext.Provider value={{ isOnline, queue, addToQueue, syncQueue }}>
            {children}
        </OfflineQueueContext.Provider>
    );
};

export const useOfflineQueue = () => useContext(OfflineQueueContext);
