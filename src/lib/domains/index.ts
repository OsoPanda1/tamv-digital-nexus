import { economyPolicies } from './economy/constitution.economy';
import { governancePolicies } from './governance/constitution.governance';
import { iaPolicies } from './ia/constitution.ia';
import { socialPolicies } from './social/constitution.social';
import { xrPolicies } from './xr/constitution.xr';

export const domainPolicies = [...economyPolicies, ...socialPolicies, ...xrPolicies, ...iaPolicies, ...governancePolicies];
