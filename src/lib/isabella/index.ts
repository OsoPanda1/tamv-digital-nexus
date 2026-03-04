/**
 * TAMV - Isabella AI SDK
 * QC-TAMV-IA-01 Implementation
 */

// Core
export {
  EOCTAnalyzer, eoct, PhoenixProtocol, phoenix,
  InterAgentBridge, interAgent, GuardianValidator, guardian,
} from './core';

export type {
  EmotionVector, BiometricData, EthicalConstraints, QuantumState,
  EOCTInput, PhoenixPayload, InterAgentContext, BookPIEntry,
} from './core';

export {
  constitutionalGuard, executeWithConstitutionalGuard,
  createConstitutionalMiddleware, ConstitutionalRulesEngine,
} from './constitutionalGuard';

export type {
  ConstitutionalViolation, ConstitutionalViolationReport,
} from './constitutionalGuard';

// Filter System
export { octupleFilter, OctupleFilterSystem } from './octupleFilter';
export type { FilterLayer, FilterDecision, FilterResult, PipelineContext } from './octupleFilter';

// Double Pipeline
export {
  pipelineOrchestrator, PipelineOrchestrator, NormalPipeline, RiskPipeline, PipelineType,
} from './doublePipeline';
export type { PipelineConfig, PipelineResult } from './doublePipeline';

// Sexual & Ethical Shield
export {
  sexualEthicalShield, SexualEthicalShield, SemanticShield,
  BehavioralShield, ONTOLOGICAL_SHIELD, checkOntologicalShield,
} from './sexualEthicalShield';
export type { ShieldCategory, ShieldResult } from './sexualEthicalShield';

// Hard Stop
export {
  hardStop, HardStopController, AuthorizationManager,
  MemoryFreezeManager, LogExportManager, ShutdownPhase, AuthorizationLevel,
} from './hardStop';
export type { Authorization, ShutdownState, HardStopConfig } from './hardStop';

// Governance
export interface GovernanceMetrics {
  totalInteractions: number;
  blockedInteractions: number;
  riskDetections: number;
  humanEscalations: number;
  averageResponseTime: number;
  shieldActivations: number;
}

export async function getGovernanceMetrics(): Promise<GovernanceMetrics> {
  const { supabase } = await import('@/integrations/supabase/client');
  try {
    const interactions = await supabase.from('isabella_interactions').select('id', { count: 'exact' });
    const blocks = await supabase.from('isabella_interactions').select('id', { count: 'exact' }).eq('ethical_flag', 'blocked');
    const risks = await supabase.from('isabella_interactions').select('id', { count: 'exact' }).eq('ethical_flag', 'risk_detected');

    return {
      totalInteractions: interactions.count || 0,
      blockedInteractions: blocks.count || 0,
      riskDetections: risks.count || 0,
      humanEscalations: 0, averageResponseTime: 0, shieldActivations: 0,
    };
  } catch (error) {
    console.error('[Governance] Metrics error:', error);
    return { totalInteractions: 0, blockedInteractions: 0, riskDetections: 0, humanEscalations: 0, averageResponseTime: 0, shieldActivations: 0 };
  }
}

// Audit
export interface AuditEntry {
  id: string;
  timestamp: number;
  action: string;
  userId?: string;
  details: Record<string, unknown>;
}

export async function logAuditEntry(
  action: string,
  details: Record<string, unknown>,
  userId?: string
): Promise<void> {
  const { supabase } = await import('@/integrations/supabase/client');
  try {
    await supabase.from('isabella_interactions').insert([{
      user_id: userId || '00000000-0000-0000-0000-000000000000',
      message_role: 'system',
      content: `AUDIT: ${action}`,
      metadata: details as Record<string, unknown>,
      created_at: new Date().toISOString(),
    }]);
  } catch (error) {
    console.error('[Audit] Log error:', error);
  }
}

// System Status
export interface SystemStatus {
  isOperational: boolean;
  isPaused: boolean;
  isShutdown: boolean;
  shieldActive: boolean;
  lastHealthCheck: number;
  version: string;
}

export async function getSystemStatus(): Promise<SystemStatus> {
  const { hardStop: hs } = await import('./hardStop');
  const shutdownStatus = hs.getSystemStatus();
  return {
    isOperational: !shutdownStatus.isActive,
    isPaused: false,
    isShutdown: shutdownStatus.isActive,
    shieldActive: true,
    lastHealthCheck: Date.now(),
    version: '3.0.0-MD-X4',
  };
}

export const ISABELLA_VERSION = '3.0.0-MD-X4';
export const ISABELLA_BUILD = '2026.01.15';
export const DOCUMENT_MASTER_VERSION = '1.0-FUNDACIONAL-2026';

import { eoct, phoenix, interAgent, guardian } from './core';
import { constitutionalGuard } from './constitutionalGuard';
import { octupleFilter } from './octupleFilter';
import { pipelineOrchestrator } from './doublePipeline';
import { sexualEthicalShield } from './sexualEthicalShield';
import { hardStop } from './hardStop';

export default {
  eoct, phoenix, interAgent, guardian, constitutionalGuard,
  octupleFilter, pipelineOrchestrator, sexualEthicalShield, hardStop,
  getGovernanceMetrics, logAuditEntry, getSystemStatus,
  version: ISABELLA_VERSION, build: ISABELLA_BUILD, masterVersion: DOCUMENT_MASTER_VERSION,
};
