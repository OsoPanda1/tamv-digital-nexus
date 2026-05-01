import { createHash, randomUUID } from 'node:crypto';
import type { TAMVExecutionRequest } from './types';

let lastHash: string | null = null;

export class AuditTrail {
  static chain(event: unknown): string {
    const h = createHash('sha256');
    h.update(JSON.stringify(event));
    if (lastHash) h.update(lastHash);
    const digest = h.digest('hex');
    lastHash = digest;
    return digest;
  }

  static buildPermitHash(req: TAMVExecutionRequest, result: unknown): string {
    return this.chain({ req, result, type: 'permit', nonce: randomUUID() });
  }
}
