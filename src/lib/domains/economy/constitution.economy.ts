import type { ConstitutionalPolicy } from '@/lib/core/constitutional-layer/constitutionEngine';

export const economyPolicies: ConstitutionalPolicy[] = [
  {
    id: 'ECON-001-MEMBERSHIP-REQUIRED-FOR-TRANSFER', domain: 'economy', intents: ['wallet.transfer', 'economy.transfer'], priority: 100, effect: 'deny',
    conditions: (req) => !req.actor.memberships || req.actor.memberships.length === 0, constraints: { reason: 'MEMBERSHIP_REQUIRED' },
  },
  {
    id: 'ECON-002-LIMIT-TRANSFER-AMOUNT-BY-TIER', domain: 'economy', intents: ['wallet.transfer', 'economy.transfer'], priority: 90, effect: 'modify',
    conditions: () => true,
    constraints: (req) => {
      const tier = req.actor.memberships?.[0] ?? 'free';
      const maxAmount = tier === 'enterprise' ? 1000000 : tier === 'business' ? 250000 : tier === 'pro' ? 50000 : 5000;
      return { maxAmount };
    },
  },
];
