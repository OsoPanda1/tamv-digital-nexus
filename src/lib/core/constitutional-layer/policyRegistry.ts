import { domainPolicies } from '@/lib/domains';
import type { ConstitutionalPolicy } from './constitutionEngine';
import type { TAMVDomain } from './types';

export class PolicyRegistry {
  static getPolicies(domain: TAMVDomain, intent: string): ConstitutionalPolicy[] {
    return domainPolicies.filter((p) => p.domain === domain && (!p.intents || p.intents.includes(intent)));
  }
}
