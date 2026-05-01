// ============================================================================
// TAMV MD-X4™ - Constitution Engine
// Runtime invariant checker and canonical rule enforcer
// ============================================================================

import { MSR_RULES, type MSRRule, type RuleSeverity } from './msr';

export interface ConstitutionViolation {
  ruleId: string;
  severity: RuleSeverity;
  description: string;
  context?: string;
  timestamp: number;
}

export interface ConstitutionEngineState {
  violations: ConstitutionViolation[];
  lastChecked: number | null;
  healthy: boolean;
}

let _state: ConstitutionEngineState = {
  violations: [],
  lastChecked: null,
  healthy: true,
};

const _listeners: Array<(state: ConstitutionEngineState) => void> = [];

function notify() {
  _listeners.forEach((fn) => fn({ ..._state, violations: [..._state.violations] }));
}

export function constitutionEngineSubscribe(
  listener: (state: ConstitutionEngineState) => void
): () => void {
  _listeners.push(listener);
  listener({ ..._state });
  return () => {
    const idx = _listeners.indexOf(listener);
    if (idx !== -1) _listeners.splice(idx, 1);
  };
}

export function getConstitutionState(): ConstitutionEngineState {
  return { ..._state, violations: [..._state.violations] };
}

export function reportViolation(
  ruleId: string,
  context?: string
): void {
  const rule = MSR_RULES.find((r) => r.id === ruleId);
  if (!rule) return;

  const violation: ConstitutionViolation = {
    ruleId,
    severity: rule.severity,
    description: rule.description,
    context,
    timestamp: Date.now(),
  };

  _state = {
    violations: [violation, ..._state.violations].slice(0, 50),
    lastChecked: Date.now(),
    healthy: false,
  };

  if (rule.severity === 'constitutional' || rule.severity === 'critical') {
    console.error(`[Constitution Engine] VIOLATION ${ruleId}: ${rule.description}`, context ?? '');
  } else {
    console.warn(`[Constitution Engine] WARNING ${ruleId}: ${rule.description}`, context ?? '');
  }

  notify();
}

export function clearViolations(): void {
  _state = { violations: [], lastChecked: Date.now(), healthy: true };
  notify();
}

export function runRuntimeChecks(): void {
  _state = { ..._state, lastChecked: Date.now() };

  const hasRouterInstances = document.querySelectorAll('[data-tamv-router]').length > 1;
  if (hasRouterInstances) {
    reportViolation('MSR-CORE-01', 'Multiple Router instances detected in DOM');
  }

  const constitutionalViolations = _state.violations.filter(
    (v) => v.severity === 'constitutional' || v.severity === 'critical'
  );

  _state = {
    ..._state,
    healthy: constitutionalViolations.length === 0,
  };

  notify();
}

export function getRuleById(id: string): MSRRule | undefined {
  return MSR_RULES.find((r) => r.id === id);
}

export function getRulesByDomain(domainId: string): MSRRule[] {
  return MSR_RULES.filter((r) => r.domain === domainId);
}

export class ConstitutionEngine {
  policies: any[] = [];

  constructor(public config: any) {}

  register(policy: any) {
    this.policies.push(policy);
  }

  validate(ctx: any) {
    const violations = [];

    for (const p of this.policies) {
      if (!p.validate(ctx)) {
        violations.push(p.id);
      }
    }

    return {
      valid: violations.length === 0,
      violations,
    };
  }
}
