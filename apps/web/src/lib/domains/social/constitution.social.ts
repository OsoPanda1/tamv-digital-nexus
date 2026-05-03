import type { ConstitutionalPolicy } from '@/lib/core/constitutional-layer/constitutionEngine';

export const socialPolicies: ConstitutionalPolicy[] = [
  { id: 'SOC-002-ANONYMOUS-LIMITED', domain: 'social', intents: ['social.post.create', 'social.comment.create'], priority: 150, effect: 'modify', conditions: (req) => req.actor.type === 'external', constraints: { maxLength: 140, visibility: 'limited' } },
  { id: 'SOC-003-REPUTATION-BASED-PRIORITY', domain: 'social', intents: ['social.feed.fetch'], priority: 50, effect: 'modify', conditions: () => true, constraints: { useReputationScore: true } },
];
