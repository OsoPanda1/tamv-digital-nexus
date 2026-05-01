import { constitutionalGuard } from '../constitutional-layer/constitutionalGuard';
import type { TAMVExecutionRequest } from '../constitutional-layer/types';

export class UnifiedAPI {
  static execute(req: TAMVExecutionRequest) {
    const permit = constitutionalGuard.authorize(req);
    return { ok: true, permit, request: req };
  }
}
