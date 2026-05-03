import type { ConstitutionalPolicy } from '@/lib/core/constitutional-layer/constitutionEngine';

export const xrPolicies: ConstitutionalPolicy[] = [
  { id: 'XR-001-PHYSICAL-SAFETY', domain: 'xr', intents: ['xr.session.start', 'xr.scene.enter'], priority: 120, effect: 'deny', conditions: (req) => (req.payload as { environment?: string }).environment === 'high_risk', constraints: { reason: 'XR_ENVIRONMENT_NOT_SAFE' } },
];
