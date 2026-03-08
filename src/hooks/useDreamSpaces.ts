// ============================================================================
// TAMV MD-X4™ — DreamSpaces real-time data hook
// Fetches dreamspaces from Lovable Cloud + realtime subscription
// ============================================================================

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type DreamSpaceRow = Tables<'dreamspaces'>;

export function useDreamSpaces() {
  const [spaces, setSpaces] = useState<DreamSpaceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpaces = async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('dreamspaces')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setSpaces(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSpaces();

    // Realtime subscription
    const channel = supabase
      .channel('dreamspaces-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dreamspaces' }, () => {
        fetchSpaces();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const joinSpace = async (spaceId: string) => {
    const { error: err } = await supabase
      .from('dreamspaces')
      .update({ current_participants: supabase.rpc ? undefined : undefined }) // increment handled below
      .eq('id', spaceId);
    // Use raw increment via RPC or optimistic update
    await supabase.rpc('increment_dreamspace_participants' as any, { space_id: spaceId }).catch(() => {
      // Fallback: optimistic update
      setSpaces((prev) =>
        prev.map((s) =>
          s.id === spaceId ? { ...s, current_participants: (s.current_participants ?? 0) + 1 } : s
        )
      );
    });
  };

  const leaveSpace = async (spaceId: string) => {
    await supabase.rpc('decrement_dreamspace_participants' as any, { space_id: spaceId }).catch(() => {
      setSpaces((prev) =>
        prev.map((s) =>
          s.id === spaceId
            ? { ...s, current_participants: Math.max(0, (s.current_participants ?? 1) - 1) }
            : s
        )
      );
    });
  };

  return { spaces, loading, error, refetch: fetchSpaces, joinSpace, leaveSpace };
}
