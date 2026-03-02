/**
 * TAMV - Isabella AI SDK
 * QC-TAMV-IA-01 Implementation
 */

// Core
export {
  EOCTAnalyzer,
  eoct,
  PhoenixProtocol,
  phoenix,
  InterAgentBridge,
  interAgent,
  GuardianValidator,
  guardian,
  EmotionVector,
  BiometricData,
  EthicalConstraints,
  QuantumState,
  EOCTInput,
  PhoenixPayload,
  InterAgentContext,
  BookPIEntry,
} from './core';

export {
  constitutionalGuard,
  executeWithConstitutionalGuard,
  createConstitutionalMiddleware,
  ConstitutionalRulesEngine,
  ConstitutionalViolation,
  ConstitutionalViolationReport,
} from './constitutionalGuard';

// Filter System
export {
  octupleFilter,
  OctupleFilterSystem,
} from './octupleFilter';

export type {
  FilterLayer,
  FilterDecision,
  FilterResult,
  PipelineContext,
} from './octupleFilter';

// Double Pipeline
export {
  pipelineOrchestrator,
  PipelineOrchestrator,
  NormalPipeline,
  RiskPipeline,
  PipelineType,
  PipelineConfig,
  PipelineResult,
} from './doublePipeline';

// Sexual & Ethical Shield
export {
  sexualEthicalShield,
  SexualEthicalShield,
  SemanticShield,
  BehavioralShield,
  ONTOLOGICAL_SHIELD,
  checkOntologicalShield,
  ShieldCategory,
  ShieldResult,
} from './sexualEthicalShield';

// Hard Stop
export {
  hardStop,
  HardStopController,
  AuthorizationManager,
  MemoryFreezeManager,
  LogExportManager,
  ShutdownPhase,
  AuthorizationLevel,
  Authorization,
  ShutdownState,
  HardStopConfig,
} from './hardStop';

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
    const [interactions, blocks, risks, escalations, shields] = await Promise.all([
      supabase.from('isabella_interactions').select('id', { count: 'exact' }),
      supabase.from('isabella_filter_logs').select('id', { count: 'exact' })
        .eq('decision', 'block'),
      supabase.from('isabella_risk_logs').select('id', { count: 'exact' }),
      supabase.from('isabella_alerts').select('id', { count: 'exact' })
        .eq('status', 'pending'),
      supabase.from('isabella_filter_logs').select('id', { count: 'exact' })
        .eq('decision', 'block')
        .like('reasons', '%ethical%')
    ]);
    const interactions = await supabase
      .from('isabella_interactions')
      .select('id', { count: 'exact' });

    const blocks = await supabase
      .from('isabella_interactions')
      .select('id', { count: 'exact' })
      .eq('ethical_flag', 'blocked');

    const risks = await supabase
      .from('isabella_interactions')
      .select('id', { count: 'exact' })
      .eq('ethical_flag', 'risk_detected');

    return {
      totalInteractions: interactions.count || 0,
      blockedInteractions: blocks.count || 0,
      riskDetections: risks.count || 0,
      humanEscalations: escalations.count || 0,
      averageResponseTime: 0, // Calculated separately
      shieldActivations: shields.count || 0
      humanEscalations: 0,
      averageResponseTime: 0,
      shieldActivations: 0,
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
  details: Record<string, any>;
}

export async function logAuditEntry(
  action: string,
  details: Record<string, any>,
  userId?: string
): Promise<void> {
  const { supabase } = await import('@/integrations/supabase/client');
  try {
    await supabase.from('isabella_audit_logs').insert({
      action,
      user_id: userId,
      details,
      created_at: new Date().toISOString()
    await supabase.from('isabella_interactions').insert({
      user_id: userId || '00000000-0000-0000-0000-000000000000',
      message_role: 'system',
      content: `AUDIT: ${action}`,
      metadata: details as any,
      created_at: new Date().toISOString(),
    });
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

// ============================================================================
// DEFAULT EXPORTS
// ============================================================================

export default {
  // Core
  eoct,
  phoenix,
  interAgent,
  guardian,
  constitutionalGuard,
  
  // System
  octupleFilter,
  pipelineOrchestrator,
  sexualEthicalShield,
  hardStop,
  
  // Utils
  getGovernanceMetrics,
  logAuditEntry,
  getSystemStatus,
  
  // Version
  version: ISABELLA_VERSION,
  build: ISABELLA_BUILD,
  masterVersion: DOCUMENT_MASTER_VERSION
};
