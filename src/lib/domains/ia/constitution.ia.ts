import type { ConstitutionalPolicy } from '@/lib/core/constitutional-layer/constitutionEngine';

export const iaPolicies: ConstitutionalPolicy[] = [
  { id: 'IA-002-PERSONAL-DATA-GUARD', domain: 'ia', intents: ['isabella.chat', 'isabella.tts'], priority: 240, effect: 'modify', conditions: () => true, constraints: { redactPII: true } },
  { id: 'IA-003-AGENT-AUTONOMY-LIMITS', domain: 'ia', intents: ['agent.action.execute'], priority: 230, effect: 'deny', conditions: (req) => ['financial_transfer', 'governance_vote'].includes((req.payload as { actionType?: string }).actionType ?? ''), constraints: { reason: 'AGENT_CANNOT_EXECUTE_SENSITIVE_ACTION' } },
];
