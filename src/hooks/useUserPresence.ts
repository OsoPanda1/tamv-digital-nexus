// ============================================================================
// TAMV MD-X4™ - DM-X4-01 Social Cell
// Hook: useUserPresence — realtime online/offline tracking via Supabase Presence
// ============================================================================

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
    (userId: string): boolean => {
      return onlineUsers.some(
        (p) => p.userId === userId && p.status !== 'offline'
      );
    },
    [onlineUsers]
  );

  const setMyStatus = useCallback(
    (status: PresenceState['status']) => {
      setMyStatusState(status);
    },
    []
  );

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
        setOnlineUsers((prev) => {
          const incoming = (newPresences as Array<{ key: string; status: PresenceState['status']; onlineAt: string }>).map((p) => ({
            userId: p.key,
            onlineAt: p.onlineAt ?? new Date().toISOString(),
            status: p.status ?? 'online' as PresenceState['status'],
          const raw = newPresences as unknown as Array<Record<string, any>>;
          const incoming = raw.map((p) => ({
            userId: (p as any).key || (p as any).presence_ref || 'unknown',
            onlineAt: (p as any).onlineAt ?? new Date().toISOString(),
            status: ((p as any).status ?? 'online') as PresenceState['status'],
          }));
          const existingIds = new Set(prev.map((u) => u.userId));
          return [...prev, ...incoming.filter((u) => !existingIds.has(u.userId))];
        });
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        const raw = leftPresences as unknown as Array<Record<string, any>>;
        const leftIds = new Set(
          (leftPresences as Array<{ key: string }>).map((p) => p.key)
          raw.map((p) => (p as any).key || (p as any).presence_ref || '')
        );
        setOnlineUsers((prev) =>
          prev.map((u) =>
            leftIds.has(u.userId) ? { ...u, status: 'offline' as const } : u
          )
        );
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            status: myStatus,
            onlineAt: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.untrack().then(() => supabase.removeChannel(channel));
    };
  }, [user, myStatus]);

  return { onlineUsers, isOnline, myStatus, setMyStatus };
}
