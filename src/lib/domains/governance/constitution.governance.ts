import type { ConstitutionalPolicy } from '@/lib/core/constitutional-layer/constitutionEngine';

export const governancePolicies: ConstitutionalPolicy[] = [
  { id: 'GOV-001-DAO-NOT-SUPREME', domain: 'governance', intents: ['dao.proposal.execute'], priority: 300, effect: 'deny', conditions: (req) => ['economy', 'legal'].includes((req.payload as { targetDomain?: string }).targetDomain ?? ''), constraints: { reason: 'DAO_CANNOT_MODIFY_CORE_ECONOMY_OR_LEGAL' } },
  { id: 'GOV-003-MULTI-SIGNATURE-REQUIRED', domain: 'governance', intents: ['governance.regulation.update'], priority: 280, effect: 'deny', conditions: (req) => ((req.payload as { signatures?: string[] }).signatures?.length ?? 0) < 3, constraints: { reason: 'MULTI_SIG_REQUIRED' } },
];
