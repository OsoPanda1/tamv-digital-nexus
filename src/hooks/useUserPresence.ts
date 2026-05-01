import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface PresenceState {
  userId: string;
  onlineAt: string;
  status: 'online' | 'away' | 'offline';
}

export interface UseUserPresenceReturn {
  onlineUsers: PresenceState[];
  isOnline: (userId: string) => boolean;
  myStatus: PresenceState['status'];
  setMyStatus: (status: PresenceState['status']) => void;
}

export function useUserPresence(): UseUserPresenceReturn {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<PresenceState[]>([]);
  const [myStatus, setMyStatusState] = useState<PresenceState['status']>('online');

  const isOnline = useCallback(
    (userId: string): boolean => onlineUsers.some((p) => p.userId === userId && p.status !== 'offline'),
    [onlineUsers]
  );

  const setMyStatus = useCallback((status: PresenceState['status']) => {
    setMyStatusState(status);
  }, []);

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel('tamv-presence', {
      config: { presence: { key: user.id } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<{ status: PresenceState['status']; onlineAt: string }>();
        const users: PresenceState[] = Object.entries(state).map(([userId, presences]) => {
          const latest = (presences as Array<{ status: PresenceState['status']; onlineAt: string }>)[0];
          return {
            userId,
            onlineAt: latest?.onlineAt ?? new Date().toISOString(),
            status: latest?.status ?? 'online',
          };
        });
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        const raw = newPresences as unknown as Array<Record<string, unknown>>;
        const incoming: PresenceState[] = raw.map((p) => ({
          userId: String((p as Record<string, unknown>).key || (p as Record<string, unknown>).presence_ref || 'unknown'),
          onlineAt: String((p as Record<string, unknown>).onlineAt ?? new Date().toISOString()),
          status: ((p as Record<string, unknown>).status ?? 'online') as PresenceState['status'],
        }));
        setOnlineUsers((prev) => {
          const existingIds = new Set(prev.map((u) => u.userId));
          return [...prev, ...incoming.filter((u) => !existingIds.has(u.userId))];
        });
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        const raw = leftPresences as unknown as Array<Record<string, unknown>>;
        const leftIds = new Set(raw.map((p) => String((p as Record<string, unknown>).key || (p as Record<string, unknown>).presence_ref || '')));
        setOnlineUsers((prev) =>
          prev.map((u) => (leftIds.has(u.userId) ? { ...u, status: 'offline' as const } : u))
        );
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ status: myStatus, onlineAt: new Date().toISOString() });
        }
      });

    return () => {
      channel.untrack().then(() => supabase.removeChannel(channel));
    };
  }, [user, myStatus]);

  return { onlineUsers, isOnline, myStatus, setMyStatus };
}
