// ============================================================================
// TAMV MD-X4™ OMNI-KERNEL — API Client
// Connects frontend to TAMV backend services
// ============================================================================

import { supabase } from '@/integrations/supabase/client';
import type {
  CubicTriageResult,
  MutationRequest,
  EvolutionResult,
  RollbackRequest,
  RollbackResult,
  SystemHealthMetrics,
} from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// Edge function caller helper
async function callEdgeFunction<T>(
  functionName: string,
  body: Record<string, unknown>
): Promise<T> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;

  const res = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorBody.error || `Edge function error: ${res.status}`);
  }

  return res.json();
}

// ── DevOps: Cubic Triage (code review) ──
export async function runCubicTriage(workflowId: string): Promise<CubicTriageResult[]> {
  return callEdgeFunction<CubicTriageResult[]>('tamv-unified-api', {
    action: 'devops.review',
    domain: 'DM-X4-07-INFRA',
    payload: { workflowId },
  });
}

// ── DevOps: Request code evolution ──
export async function requestEvolution(
  workflowId: string,
  request: MutationRequest
): Promise<EvolutionResult> {
  return callEdgeFunction<EvolutionResult>('tamv-unified-api', {
    action: 'devops.singularity',
    domain: 'DM-X4-07-INFRA',
    payload: { workflowId, request },
  });
}

// ── DevOps: Rollback ──
export async function requestRollback(
  req: RollbackRequest
): Promise<RollbackResult> {
  return callEdgeFunction<RollbackResult>('tamv-unified-api', {
    action: 'devops.rollback',
    domain: 'DM-X4-07-INFRA',
    payload: req,
  });
}

// ── System health ──
export async function fetchSystemHealth(): Promise<SystemHealthMetrics> {
  try {
    const result = await callEdgeFunction<{ data: SystemHealthMetrics }>('tamv-unified-api', {
      action: 'system.health',
      domain: 'DM-X4-07-INFRA',
      payload: {},
    });
    return result.data;
  } catch {
    // Fallback: simulate health when backend is not reachable
    return {
      l0_identity: 'healthy',
      l1_social: 'healthy',
      l2_economy: 'healthy',
      l3_governance: 'healthy',
      isabella_risk_analyzer: 'healthy',
      ktor_comms: 'disconnected' as any,
      last_check: new Date().toISOString(),
    };
  }
}
