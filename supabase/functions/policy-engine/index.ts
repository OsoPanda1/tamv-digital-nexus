// ============================================================================
// TAMV Policy Engine v3.0.0-Sovereign
// CCP - Control & Coordination (Port 8201)
// OPA-like Policy Evaluation
// ============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import {
  createHandler,
  jsonOk,
  jsonError,
  errors,
  createLogger,
  buildLogContext,
  sha3_256,
} from '../_shared/index.ts';

// ============================================================================
// Service Configuration
// ============================================================================

const SERVICE_NAME = 'policy-engine';
const SERVICE_PORT = 8201;
const PIPELINE = 'CCP' as const;
const VERSION = '3.0.0-Sovereign';

// ============================================================================
// Logger
// ============================================================================

const logger = createLogger(SERVICE_NAME);

// In-memory policy cache
const policyCache = new Map<string, Policy>();

// ============================================================================
// Types
// ============================================================================

interface Policy {
  policy_id: string;
  name: string;
  description: string;
  version: string;
  rules: PolicyRule[];
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

interface PolicyRule {
  rule_id: string;
  resource: string;
  action: string;
  conditions: Condition[];
  effect: 'allow' | 'deny';
  priority: number;
}

interface Condition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains' | 'starts_with' | 'ends_with';
  value: any;
}

interface EvaluationRequest {
  subject: {
    user_id: string;
    role: string;
    tier: string;
    reputation: number;
    mfa_enabled: boolean;
    [key: string]: any;
  };
  resource: {
    type: string;
    id?: string;
    owner_id?: string;
    [key: string]: any;
  };
  action: string;
  context: {
    timestamp: string;
    ip_address?: string;
    user_agent?: string;
    [key: string]: any;
  };
}

// ============================================================================
// Policy Evaluation Engine
// ============================================================================

function evaluateCondition(condition: Condition, data: any): boolean {
  const fieldValue = getNestedValue(data, condition.field);
  const expectedValue = condition.value;

  switch (condition.operator) {
    case 'eq':
      return fieldValue === expectedValue;
    case 'ne':
      return fieldValue !== expectedValue;
    case 'gt':
      return fieldValue > expectedValue;
    case 'gte':
      return fieldValue >= expectedValue;
    case 'lt':
      return fieldValue < expectedValue;
    case 'lte':
      return fieldValue <= expectedValue;
    case 'in':
      return Array.isArray(expectedValue) && expectedValue.includes(fieldValue);
    case 'contains':
      return typeof fieldValue === 'string' && fieldValue.includes(expectedValue);
    case 'starts_with':
      return typeof fieldValue === 'string' && fieldValue.startsWith(expectedValue);
    case 'ends_with':
      return typeof fieldValue === 'string' && fieldValue.endsWith(expectedValue);
    default:
      return false;
  }
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function evaluateRule(rule: PolicyRule, request: EvaluationRequest): boolean {
  // Check resource match
  if (rule.resource !== '*' && rule.resource !== request.resource.type) {
    return false;
  }

  // Check action match
  if (rule.action !== '*' && rule.action !== request.action) {
    return false;
  }

  // Evaluate all conditions
  const data = {
    subject: request.subject,
    resource: request.resource,
    action: request.action,
    context: request.context,
  };

  return rule.conditions.every(condition => evaluateCondition(condition, data));
}

async function evaluatePolicies(
  policies: Policy[],
  request: EvaluationRequest
): Promise<{
  decision: 'allow' | 'deny';
  matched_rules: string[];
  explanation: string;
}> {
  // Sort by priority
  const sortedRules = policies
    .filter(p => p.enabled)
    .flatMap(p => p.rules.map(r => ({ ...r, policy_name: p.name })))
    .sort((a, b) => b.priority - a.priority);

  const matchedRules: string[] = [];
  let decision: 'allow' | 'deny' = 'deny';
  let explanation = 'No matching rules found - default deny';

  for (const rule of sortedRules) {
    if (evaluateRule(rule, request)) {
      matchedRules.push(`${rule.policy_name}:${rule.rule_id}`);
      decision = rule.effect;
      explanation = `Matched rule ${rule.rule_id} in policy ${rule.policy_name} with effect ${rule.effect}`;
      
      // Deny takes precedence
      if (rule.effect === 'deny') {
        break;
      }
    }
  }

  return { decision, matched_rules: matchedRules, explanation };
}

// ============================================================================
// Main Handler
// ============================================================================

const handler = createHandler(SERVICE_NAME, PIPELINE, async (ctx) => {
  const { request, url, supabase, userId, traceId } = ctx;
  const path = url.pathname.replace('/policy-engine', '');

  // GET /health
  if (path === '/health' && request.method === 'GET') {
    return jsonOk({
      service: SERVICE_NAME,
      version: VERSION,
      pipeline: PIPELINE,
      port: SERVICE_PORT,
      status: 'healthy',
      engine: 'OPA-like',
      timestamp: new Date().toISOString(),
    });
  }

  // POST /policy/evaluate - Evaluate request against policies
  if (path === '/policy/evaluate' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    const body = await request.json().catch(() => ({}));
    const evalRequest: EvaluationRequest = body;

    if (!evalRequest.subject || !evalRequest.resource || !evalRequest.action) {
      return errors.badRequest('subject, resource, and action required');
    }

    // Load policies from cache or database
    let policies: Policy[] = [];
    
    if (policyCache.size === 0) {
      const { data: dbPolicies } = await supabase
        .from('policies')
        .select('*, rules:policy_rules(*)');
      
      policies = dbPolicies || [];
      
      // Cache policies
      policies.forEach(p => policyCache.set(p.policy_id, p));
    } else {
      policies = Array.from(policyCache.values());
    }

    // Evaluate
    const startTime = performance.now();
    const result = await evaluatePolicies(policies, evalRequest);
    const duration = Math.round(performance.now() - startTime);

    // Log evaluation
    await supabase.from('policy_evaluations').insert({
      user_id: userId,
      subject_id: evalRequest.subject.user_id,
      resource_type: evalRequest.resource.type,
      action: evalRequest.action,
      decision: result.decision,
      matched_rules: result.matched_rules,
      explanation: result.explanation,
      duration_ms: duration,
      trace_id: traceId,
    });

    logger.info('Policy evaluated', buildLogContext(request, SERVICE_NAME, PIPELINE), {
      decision: result.decision,
      matched_rules: result.matched_rules.length,
      duration_ms: duration,
    });

    return jsonOk({
      decision: result.decision,
      allowed: result.decision === 'allow',
      matched_rules: result.matched_rules,
      explanation: result.explanation,
      evaluation_time_ms: duration,
    });
  }

  // GET /policies - List all policies
  if (path === '/policies' && request.method === 'GET') {
    if (!userId) {
      return errors.unauthorized();
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!['admin', 'policy_manager'].includes(profile?.role)) {
      return errors.forbidden('Policy manager role required');
    }

    const { data: policies } = await supabase
      .from('policies')
      .select('*, rules:policy_rules(*)')
      .order('created_at', { ascending: false });

    return jsonOk({ policies: policies || [] });
  }

  // POST /policies - Create new policy
  if (path === '/policies' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!['admin', 'policy_manager'].includes(profile?.role)) {
      return errors.forbidden('Policy manager role required');
    }

    const body = await request.json().catch(() => ({}));
    const { name, description, rules } = body;

    if (!name || !rules || !Array.isArray(rules)) {
      return errors.badRequest('name and rules array required');
    }

    const policyId = crypto.randomUUID();
    const hash = await sha3_256(JSON.stringify({ name, rules }));

    const { data: policy, error } = await supabase.from('policies').insert({
      policy_id: policyId,
      name,
      description,
      version: '1.0.0',
      enabled: true,
      created_by: userId,
    }).select().single();

    if (error) {
      return errors.internal('Failed to create policy');
    }

    // Insert rules
    for (let i = 0; i < rules.length; i++) {
      await supabase.from('policy_rules').insert({
        rule_id: crypto.randomUUID(),
        policy_id: policyId,
        resource: rules[i].resource,
        action: rules[i].action,
        conditions: rules[i].conditions,
        effect: rules[i].effect,
        priority: rules[i].priority || 0,
      });
    }

    // Clear cache
    policyCache.clear();

    logger.info('Policy created', buildLogContext(request, SERVICE_NAME, PIPELINE), {
      policy_id: policyId,
      created_by: userId,
    });

    return jsonOk({ policy }, 201);
  }

  // PUT /policies/{id} - Update policy
  if (path.match(/^\/policies\/[^/]+$/) && request.method === 'PUT') {
    if (!userId) {
      return errors.unauthorized();
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!['admin', 'policy_manager'].includes(profile?.role)) {
      return errors.forbidden('Policy manager role required');
    }

    const policyId = path.split('/')[2];
    const body = await request.json().catch(() => ({}));

    const { error } = await supabase.from('policies').update({
      name: body.name,
      description: body.description,
      enabled: body.enabled,
      updated_at: new Date().toISOString(),
    }).eq('policy_id', policyId);

    if (error) {
      return errors.notFound('Policy');
    }

    // Clear cache
    policyCache.clear();

    return jsonOk({ message: 'Policy updated' });
  }

  // DELETE /policies/{id} - Delete policy
  if (path.match(/^\/policies\/[^/]+$/) && request.method === 'DELETE') {
    if (!userId) {
      return errors.unauthorized();
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profile?.role !== 'admin') {
      return errors.forbidden('Admin role required');
    }

    const policyId = path.split('/')[2];

    await supabase.from('policy_rules').delete().eq('policy_id', policyId);
    await supabase.from('policies').delete().eq('policy_id', policyId);

    // Clear cache
    policyCache.clear();

    return jsonOk({ message: 'Policy deleted' });
  }

  // POST /policy/validate - Validate policy syntax
  if (path === '/policy/validate' && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const { rules } = body;

    if (!rules || !Array.isArray(rules)) {
      return errors.badRequest('rules array required');
    }

    const validationErrors: string[] = [];

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      
      if (!rule.resource) {
        validationErrors.push(`Rule ${i}: resource required`);
      }
      if (!rule.action) {
        validationErrors.push(`Rule ${i}: action required`);
      }
      if (!rule.effect || !['allow', 'deny'].includes(rule.effect)) {
        validationErrors.push(`Rule ${i}: effect must be 'allow' or 'deny'`);
      }
      if (!Array.isArray(rule.conditions)) {
        validationErrors.push(`Rule ${i}: conditions must be an array`);
      }
    }

    return jsonOk({
      valid: validationErrors.length === 0,
      errors: validationErrors,
    });
  }

  // Route not found
  return errors.notFound('Endpoint');
});

// ============================================================================
// Start Server
// ============================================================================

serve(handler);

console.log(`📋 ${SERVICE_NAME} v${VERSION} running on port ${SERVICE_PORT} [Pipeline ${PIPELINE}]`);
