// ============================================================================
// TAMV MD-X4™ OMNI-KERNEL — Core Types
// Autor visionario: Edwin Oswaldo Castillo Trejo
// ============================================================================

export interface CubicTriageResult {
  id: string;
  file: string;
  line: number;
  severity: 'low' | 'medium' | 'high';
  title: string;
  recommendation: 'Fix' | 'Skip' | 'Discuss';
  reasoning: string;
}

export interface MutationDSL {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  hints?: string;
}

export interface MutationRequest {
  type: 'CODE_EVOLUTION' | 'PHYSICAL_TO_DIGITAL';
  name?: string;
  dsl?: MutationDSL;
  dataset_path?: string;
}

export interface EvolutionResult {
  status: 'QUEUED_FOR_MERGE' | 'REJECTED' | '3D_PIPELINE_QUEUED';
  prUrl?: string;
  score?: number;
  risks?: string[];
}

export interface RollbackRequest {
  prNumber?: number;
  commitSha?: string;
}

export interface RollbackResult {
  status: 'ROLLBACK_QUEUED';
  rollbackPrUrl: string;
}

export interface SingularityEvent {
  type: string;
  payload: Record<string, string>;
}

export interface SystemHealthMetrics {
  l0_identity: 'healthy' | 'degraded' | 'offline';
  l1_social: 'healthy' | 'degraded' | 'offline';
  l2_economy: 'healthy' | 'degraded' | 'offline';
  l3_governance: 'healthy' | 'degraded' | 'offline';
  isabella_risk_analyzer: 'healthy' | 'degraded' | 'offline';
  ktor_comms: 'healthy' | 'degraded' | 'offline';
  last_check: string;
}

export type SocketStatus = 'connected' | 'disconnected' | 'reconnecting';
