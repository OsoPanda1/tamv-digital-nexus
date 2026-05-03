// ============================================================================
// TAMV MD-X4™ — XR Presence Sync Hook
// Tracks user 3D positions via Supabase realtime presence channels
// Implements: Scene sync, multi-user presence, position broadcasting
// ============================================================================

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface XRUserPresence {
  userId: string;
  displayName: string;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  status: 'active' | 'idle' | 'away';
  role: 'viewer' | 'interactor' | 'moderator' | 'admin';
  joinedAt: string;
  lastUpdate: number;
}

const AVATAR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#FFE66D', '#A78BFA',
  '#F472B6', '#34D399', '#60A5FA', '#FBBF24',
  '#E879F9', '#2DD4BF', '#FB923C', '#818CF8',
];

function pickColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) hash = (hash << 5) - hash + userId.charCodeAt(i);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function useXRPresence(spaceId: string, spaceName?: string) {
  const { user } = useAuth();
  const [remoteUsers, setRemoteUsers] = useState<XRUserPresence[]>([]);
  const [connected, setConnected] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const positionRef = useRef<[number, number, number]>([0, 0, 0]);
  const rotationRef = useRef<[number, number, number]>([0, 0, 0]);
  const broadcastIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Broadcast local position at ~10Hz
  const updatePosition = useCallback((pos: [number, number, number], rot?: [number, number, number]) => {
    positionRef.current = pos;
    if (rot) rotationRef.current = rot;
  }, []);

  useEffect(() => {
    if (!user || !spaceId) return;

    const channelName = `xr-presence-${spaceId}`;
    const myColor = pickColor(user.id);

    const channel = supabase.channel(channelName, {
      config: { presence: { key: user.id } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<Omit<XRUserPresence, 'userId'>>();
        const users: XRUserPresence[] = [];

        Object.entries(state).forEach(([userId, presences]) => {
          if (userId === user.id) return; // skip self
          const latest = (presences as any[])[0];
          if (latest) {
            users.push({
              userId,
              displayName: latest.displayName || 'Explorador',
              position: latest.position || [0, 0, 0],
              rotation: latest.rotation || [0, 0, 0],
              color: latest.color || pickColor(userId),
              status: latest.status || 'active',
              role: latest.role || 'viewer',
              joinedAt: latest.joinedAt || new Date().toISOString(),
              lastUpdate: latest.lastUpdate || Date.now(),
            });
          }
        });

        setRemoteUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setConnected(true);
          await channel.track({
            displayName: user.email?.split('@')[0] || 'Explorer',
            position: positionRef.current,
            rotation: rotationRef.current,
            color: myColor,
            status: 'active',
            role: 'interactor',
            joinedAt: new Date().toISOString(),
            lastUpdate: Date.now(),
          });
        }
      });

    channelRef.current = channel;

    // Broadcast position updates at ~10Hz
    broadcastIntervalRef.current = setInterval(async () => {
      if (channelRef.current) {
        try {
          await channelRef.current.track({
            displayName: user.email?.split('@')[0] || 'Explorer',
            position: positionRef.current,
            rotation: rotationRef.current,
            color: myColor,
            status: 'active',
            role: 'interactor',
            joinedAt: new Date().toISOString(),
            lastUpdate: Date.now(),
          });
        } catch { /* ignore */ }
      }
    }, 100);

    return () => {
      if (broadcastIntervalRef.current) clearInterval(broadcastIntervalRef.current);
      channel.untrack().then(() => supabase.removeChannel(channel));
      channelRef.current = null;
      setConnected(false);
    };
  }, [user, spaceId]);

  return {
    remoteUsers,
    connected,
    updatePosition,
    userCount: remoteUsers.length + 1, // +1 for self
  };
}
