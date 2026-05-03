// ============================================================================
// TAMV MD-X4™ — Isabella Orchestrator v2.0
// Ported from digital-civilization-core/services/intelligence-federation
// Unified sovereign agent orchestration with EOCT + Ethical Pipeline
// ============================================================================

import { supabase } from '@/integrations/supabase/client';

// ── Sovereign Types (from @tamv/shared-types) ──

export interface IsabellaAgent {
  id: string;
  role: 'isabella' | 'anubis' | 'horus' | 'dekateotl' | 'aztek';
  capabilities: string[];
  trustLevel: number;
  isCreator: boolean;
}

export interface AgentTask {
  id: string;
  assignedTo: string;
  input: unknown;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'failed';
  result?: { success?: boolean; error?: string; data?: unknown };
  creatorSignature?: string;
  evidenceHash?: string;
  timestamp: number;
}

export interface SecurityDecision {
  allow: boolean;
  reason: string;
  threatLevel: 'clean' | 'warning' | 'critical' | 'lockdown';
  auditTrail: string[];
}

export interface CreatorSessionContext {
  userId: string;
  dignityScore: number;
  trustLevel: number;
  membershipTier: string;
  activeRoles: string[];
}

// ── Creator Identity (Sovereign DID) ──

export const CreatorIdentity = {
  CREATOR_DID: 'did:tamv:eoct:genesis:2026',

  isCreatorAgent(agent: IsabellaAgent): boolean {
    return agent.isCreator && agent.trustLevel >= 10;
  },

  async signTask(
    taskData: { assignedTo: string; input: unknown },
    agent: IsabellaAgent,
    session?: CreatorSessionContext
  ): Promise<AgentTask> {
    const payload = JSON.stringify({ ...taskData, agent: agent.id, ts: Date.now() });
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(payload));
    const evidenceHash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return {
      id: crypto.randomUUID(),
      assignedTo: taskData.assignedTo,
      input: taskData.input,
      status: 'pending',
      creatorSignature: session?.userId
        ? `sig:${session.userId.slice(0, 8)}:${evidenceHash.slice(0, 16)}`
        : undefined,
      evidenceHash,
      timestamp: Date.now(),
    };
  },
};

// ── Sentinel Evaluator (inline, replaces Python gate.py) ──

class SentinelEvaluator {
  private readonly forbiddenPatterns = [
    /\b(hack|exploit|inject|bypass)\b/i,
    /\b(drop\s+table|delete\s+from|truncate)\b/i,
    /<script\b/i,
  ];

  async evaluateTask(task: AgentTask): Promise<SecurityDecision> {
    const auditTrail: string[] = [];
    const inputStr = typeof task.input === 'string'
      ? task.input
      : JSON.stringify(task.input);

    // Pattern scanning
    for (const pattern of this.forbiddenPatterns) {
      if (pattern.test(inputStr)) {
        auditTrail.push(`BLOCKED: forbidden pattern ${pattern.source}`);
        return {
          allow: false,
          reason: `Security violation: dangerous pattern detected`,
          threatLevel: 'critical',
          auditTrail,
        };
      }
    }

    // Input length check
    if (inputStr.length > 50_000) {
      auditTrail.push('BLOCKED: payload exceeds 50KB limit');
      return {
        allow: false,
        reason: 'Payload too large',
        threatLevel: 'warning',
        auditTrail,
      };
    }

    auditTrail.push('PASSED: all security checks');
    return {
      allow: true,
      reason: 'Task approved',
      threatLevel: 'clean',
      auditTrail,
    };
  }
}

// ── Isabella Orchestrator ──

export class IsabellaOrchestrator {
  private readonly sentinel = new SentinelEvaluator();

  constructor(
    private readonly agentProfile: IsabellaAgent,
    private readonly creatorSession?: CreatorSessionContext
  ) {
    this.logRecognition();
  }

  private logRecognition() {
    if (CreatorIdentity.isCreatorAgent(this.agentProfile)) {
      console.info(`[TAMV ORCHESTRATOR] Creador Detectado — DID: ${CreatorIdentity.CREATOR_DID}`);
    }
  }

  async executeTask(taskInput: unknown): Promise<AgentTask> {
    // 1. Sign and create task
    const task = await CreatorIdentity.signTask(
      { assignedTo: this.agentProfile.role, input: taskInput },
      this.agentProfile,
      this.creatorSession
    );

    // 2. Security evaluation
    const decision = await this.sentinel.evaluateTask(task);

    if (!decision.allow) {
      console.warn(`[TAMV ORCHESTRATOR] BLOCKED: ${decision.reason}`);

      // Log to MSR
      await this.logToMSR(task, decision);

      return {
        ...task,
        status: 'blocked',
        result: { error: decision.reason },
      };
    }

    // 3. Execute (delegate to specific agent logic)
    const result = await this.delegateExecution(task);

    // 4. Log success to MSR
    await this.logToMSR({ ...task, ...result }, decision);

    return result;
  }

  private async delegateExecution(task: AgentTask): Promise<AgentTask> {
    // Agent-specific routing
    switch (this.agentProfile.role) {
      case 'isabella':
        return { ...task, status: 'completed', result: { success: true, data: { agent: 'isabella' } } };
      case 'anubis':
        return { ...task, status: 'completed', result: { success: true, data: { agent: 'anubis', scan: 'clean' } } };
      case 'horus':
        return { ...task, status: 'completed', result: { success: true, data: { agent: 'horus', metrics: 'nominal' } } };
      default:
        return { ...task, status: 'completed', result: { success: true } };
    }
  }

  private async logToMSR(task: AgentTask, decision: SecurityDecision): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await supabase.from('msr_events').insert({
        actor_id: session.user.id,
        action: `ORCHESTRATOR_${task.status.toUpperCase()}`,
        domain: 'IA',
        evidence_hash: task.evidenceHash || 'no-hash',
        severity: decision.threatLevel === 'critical' ? 'warn' : 'info',
        payload: {
          taskId: task.id,
          agent: this.agentProfile.role,
          decision: decision.reason,
          threatLevel: decision.threatLevel,
          auditTrail: decision.auditTrail,
        } as any,
      });
    } catch (e) {
      console.error('[MSR LOG ERROR]', e);
    }
  }
}

// ── Factory ──

export function createOrchestrator(
  role: IsabellaAgent['role'] = 'isabella',
  session?: CreatorSessionContext
): IsabellaOrchestrator {
  const agent: IsabellaAgent = {
    id: crypto.randomUUID(),
    role,
    capabilities: ['chat', 'analysis', 'ethical-review', 'emotional-detection'],
    trustLevel: session?.trustLevel ?? 5,
    isCreator: session?.activeRoles?.includes('admin') ?? false,
  };

  return new IsabellaOrchestrator(agent, session);
}
