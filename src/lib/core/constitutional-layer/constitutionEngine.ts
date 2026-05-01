import type { TAMVExecutionRequest } from './types';
import { PolicyRegistry } from './policyRegistry';

export type PolicyEffect = 'allow' | 'deny' | 'modify';

export type ConstitutionalPolicy = {
  id: string;
  domain: string;
  intents?: string[];
  conditions: (req: TAMVExecutionRequest) => boolean;
  effect: PolicyEffect;
  constraints?: Record<string, unknown> | ((req: TAMVExecutionRequest) => Record<string, unknown>);
  priority: number;
};

export type PolicyEvaluationResult = {
  allowed: boolean;
  constraints?: Record<string, unknown>;
  policyId?: string;
};

export class ConstitutionEngine {
  static evaluate(req: TAMVExecutionRequest): PolicyEvaluationResult {
    const sorted = PolicyRegistry.getPolicies(req.domain, req.intent).sort((a, b) => b.priority - a.priority);

    for (const policy of sorted) {
      if (!policy.conditions(req)) continue;
      const constraints = typeof policy.constraints === 'function' ? policy.constraints(req) : (policy.constraints ?? {});

      if (policy.effect === 'deny') return { allowed: false, constraints, policyId: policy.id };
      return { allowed: true, constraints, policyId: policy.id };
    }

    return { allowed: false, constraints: { reason: 'NO_MATCHING_POLICY' } };
  }
}
