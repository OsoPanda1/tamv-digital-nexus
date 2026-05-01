export type TAMVDomain = 'economy' | 'social' | 'xr' | 'ia' | 'governance';

export type TAMVActor = {
  id: string;
  type: 'human' | 'agent' | 'system' | 'external';
  roles: string[];
  memberships?: string[];
  federation?: string | null;
};

export type TAMVExecutionContext = {
  origin: 'ui' | 'api' | 'agent' | 'system' | 'cron' | 'webhook';
  riskLevel?: number;
  correlationId?: string;
};

export type TAMVExecutionRequest = {
  actor: TAMVActor;
  intent: string;
  domain: TAMVDomain;
  payload: unknown;
  context: TAMVExecutionContext;
};

export type ExecutionPermit = {
  permitId: string;
  allowed: boolean;
  constraints?: Record<string, unknown>;
  policyId?: string;
  auditHash: string;
  issuedAt: string;
};
