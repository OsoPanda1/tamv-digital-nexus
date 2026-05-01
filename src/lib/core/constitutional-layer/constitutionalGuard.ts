import { randomUUID } from 'node:crypto';
import { AuditTrail } from './auditTrail';
import { ConstitutionEngine } from './constitutionEngine';
import type { ExecutionPermit, TAMVExecutionRequest } from './types';

export class ConstitutionalGuard {
  authorize(req: TAMVExecutionRequest): ExecutionPermit {
    if (!req.actor?.id || !req.intent || !req.domain) throw new Error('INVALID_EXECUTION_REQUEST');

    const evaluated = ConstitutionEngine.evaluate(req);
    if (!evaluated.allowed) throw new Error(`CONSTITUTIONAL_VIOLATION:${evaluated.policyId ?? 'UNKNOWN'}`);

    return {
      permitId: randomUUID(),
      allowed: true,
      constraints: evaluated.constraints,
      policyId: evaluated.policyId,
      auditHash: AuditTrail.buildPermitHash(req, evaluated),
      issuedAt: new Date().toISOString(),
    };
  }
}

export const constitutionalGuard = new ConstitutionalGuard();
