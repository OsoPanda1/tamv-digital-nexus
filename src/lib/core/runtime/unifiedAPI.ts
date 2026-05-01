import { constitutionalGuard } from '../constitutional-layer/constitutionalGuard';
import type { TAMVExecutionRequest } from '../constitutional-layer/types';
import { EconomySystem } from '@/systems/EconomySystem';

export class UnifiedAPI {
  static async execute(req: TAMVExecutionRequest) {
    const permit = constitutionalGuard.authorize(req);
    if (req.domain === 'economy') {
      const result = await EconomySystem.handleIntent(req.intent, req.payload, permit);
      return { ok: true, permit, result };
    }

    return { ok: true, permit, result: null };
  }
}
