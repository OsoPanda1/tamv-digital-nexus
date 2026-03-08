// ============================================================================
// TAMV MD-X4™ — XR Integrity Logger (MSR + BookPI)
// Logs critical XR events to the immutable MSR ledger
// ============================================================================

import { useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type XREventSeverity = 'info' | 'warning' | 'critical';
export type XREventType =
  | 'space_join'
  | 'space_leave'
  | 'object_interact'
  | 'permission_denied'
  | 'safety_alert'
  | 'moderation_action'
  | 'scene_config_change';

interface XRLogEntry {
  action: string;
  domain: string;
  payload: Record<string, unknown>;
  severity: XREventSeverity;
}

export function useXRIntegrity() {
  const { user } = useAuth();
  const batchRef = useRef<XRLogEntry[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const flush = useCallback(async () => {
    if (batchRef.current.length === 0) return;
    const entries = [...batchRef.current];
    batchRef.current = [];

    // Hash payload for evidence chain
    const hashPayload = async (data: string) => {
      const encoded = new TextEncoder().encode(data);
      const buffer = await crypto.subtle.digest('SHA-256', encoded);
      return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    };

    for (const entry of entries) {
      const evidenceHash = await hashPayload(JSON.stringify(entry));
      await supabase.from('msr_events').insert({
        action: entry.action,
        domain: entry.domain,
        payload: entry.payload as any,
        severity: entry.severity,
        actor_id: user?.id || null,
        evidence_hash: evidenceHash,
      });
    }
  }, [user]);

  const logEvent = useCallback((type: XREventType, payload: Record<string, unknown> = {}, severity: XREventSeverity = 'info') => {
    batchRef.current.push({
      action: `xr.${type}`,
      domain: 'xr_4d',
      payload: { ...payload, timestamp: Date.now(), userId: user?.id },
      severity,
    });

    // Flush critical events immediately
    if (severity === 'critical') {
      flush();
      return;
    }

    // Batch non-critical events (flush every 5s)
    if (!timerRef.current) {
      timerRef.current = setTimeout(() => {
        flush();
        timerRef.current = null;
      }, 5000);
    }
  }, [user, flush]);

  return { logEvent, flush };
}
