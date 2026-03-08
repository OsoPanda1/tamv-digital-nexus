// ============================================================================
// TAMV MD-X4™ — XR Permission System
// Role-based interaction control for XR objects and spaces
// ============================================================================

import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export type XRInteractionLevel = 'none' | 'view' | 'interact' | 'create' | 'admin';

export interface XRPermissions {
  canInteractObjects: boolean;
  canCreateObjects: boolean;
  canModerateUsers: boolean;
  canManageSpace: boolean;
  canUseAudio: boolean;
  canBroadcast: boolean;
  interactionLevel: XRInteractionLevel;
  maxObjectsPerUser: number;
}

const PERMISSION_MAP: Record<string, XRPermissions> = {
  admin: {
    canInteractObjects: true,
    canCreateObjects: true,
    canModerateUsers: true,
    canManageSpace: true,
    canUseAudio: true,
    canBroadcast: true,
    interactionLevel: 'admin',
    maxObjectsPerUser: 100,
  },
  moderator: {
    canInteractObjects: true,
    canCreateObjects: true,
    canModerateUsers: true,
    canManageSpace: false,
    canUseAudio: true,
    canBroadcast: true,
    interactionLevel: 'create',
    maxObjectsPerUser: 50,
  },
  creator: {
    canInteractObjects: true,
    canCreateObjects: true,
    canModerateUsers: false,
    canManageSpace: false,
    canUseAudio: true,
    canBroadcast: true,
    interactionLevel: 'create',
    maxObjectsPerUser: 25,
  },
  pro: {
    canInteractObjects: true,
    canCreateObjects: true,
    canModerateUsers: false,
    canManageSpace: false,
    canUseAudio: true,
    canBroadcast: false,
    interactionLevel: 'interact',
    maxObjectsPerUser: 10,
  },
  user: {
    canInteractObjects: true,
    canCreateObjects: false,
    canModerateUsers: false,
    canManageSpace: false,
    canUseAudio: true,
    canBroadcast: false,
    interactionLevel: 'interact',
    maxObjectsPerUser: 0,
  },
};

const DEFAULT_PERMS = PERMISSION_MAP.user;

export function useXRPermissions() {
  const { user } = useAuth();

  const { data: roleData } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.rpc('get_user_role', { _user_id: user.id });
      return data as string | null;
    },
    enabled: !!user,
    staleTime: 120_000,
  });

  const permissions = useMemo<XRPermissions>(() => {
    if (!roleData) return DEFAULT_PERMS;
    return PERMISSION_MAP[roleData] || DEFAULT_PERMS;
  }, [roleData]);

  return { permissions, role: roleData || 'user' };
}
