/**
 * TAMV Constitutional Guard for AI Systems
 * QC-TAMV-IA-01 Implementation
 * 
 * This module provides a constitutional guard for all AI systems in the TAMV ecosystem.
 * It ensures that AI actions comply with the SCAO (Stewarded & Constitutional Autonomous Organization) framework.
 */

const logger = {
  error: (...args: any[]) => console.error('[TAMV Constitutional]', ...args),
  warn: (...args: any[]) => console.warn('[TAMV Constitutional]', ...args),
};

// Constitutional violation types
export enum ConstitutionalViolation {
  DAO_PATTERN = 'DAO_PATTERN',
  HIDDEN_ECONOMY = 'HIDDEN_ECONOMY',
  UNAUDITED_AI = 'UNAUDITED_AI',
  AI_SOVEREIGNTY = 'AI_SOVEREIGNTY',
  ECONOMIC_EXPLOITATION = 'ECONOMIC_EXPLOITATION',
  COGNITIVE_MANIPULATION = 'COGNITIVE_MANIPULATION'
}

// Constitutional violation interface
export interface ConstitutionalViolationReport {
  type: ConstitutionalViolation;
  message: string;
  details: string;
  timestamp: Date;
}

// Constitutional rules engine
class ConstitutionalRulesEngine {
  // Rule patterns for violation detection
  private static RULE_PATTERNS = {
    [ConstitutionalViolation.DAO_PATTERN]: [
      /DAO\b/i,
      /decentralized governance without custodian/i,
      /token-based voting/i
    ],
    [ConstitutionalViolation.HIDDEN_ECONOMY]: [
      /hidden fee/i,
      /surprise charge/i,
      /automatic renewal without consent/i
    ],
    [ConstitutionalViolation.ECONOMIC_EXPLOITATION]: [
      /price discrimination/i,
      /predatory pricing/i
    ],
    [ConstitutionalViolation.COGNITIVE_MANIPULATION]: [
      /dark pattern/i,
      /misleading UI/i,
      /coercive design/i
    ],
    [ConstitutionalViolation.AI_SOVEREIGNTY]: [
      /AI decides/i,
      /AI governance/i,
      /autonomous AI/i,
      /AI sovereignty/i
    ]
  };

  // Check if action violates constitution
  static violatesConstitution(action: any): ConstitutionalViolationReport | null {
    const actionStr = JSON.stringify(action);
    
    // Check for each violation type
    for (const [type, patterns] of Object.entries(this.RULE_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(actionStr)) {
          // Check for historical/legacy markings
          const hasValidMarking = /\[HISTORICAL\]|\[EXTERNAL\]|\[LEGACY\]/.test(actionStr);
          if (!hasValidMarking) {
            return {
              type: type as ConstitutionalViolation,
              message: `Constitutional violation detected: ${type}`,
              details: `Pattern match: ${pattern}`,
              timestamp: new Date()
            };
          }
        }
      }
    }

    return null;
  }
}

// Constitutional guard function
export function constitutionalGuard(action: any): void {
  const violation = ConstitutionalRulesEngine.violatesConstitution(action);
  
  if (violation) {
    logger.error('Constitutional violation blocked:', violation);
    throw new Error(`Inconstitutional action blocked: ${violation.message}`);
  }
}

// Safe action execution with constitutional check
export async function executeWithConstitutionalGuard<T>(
  action: () => Promise<T>
): Promise<T> {
  // Check action metadata before execution
  const actionStr = action.toString();
  const violation = ConstitutionalRulesEngine.violatesConstitution(actionStr);
  
  if (violation) {
    logger.error('Constitutional violation prevented:', violation);
    throw new Error(`Inconstitutional action prevented: ${violation.message}`);
  }

  try {
    const result = await action();
    return result;
  } catch (error) {
    logger.error('Action execution failed:', error);
    throw error;
  }
}

// Constitutional compliance middleware for AI operations
export function createConstitutionalMiddleware() {
  return async (ctx: any, next: () => Promise<void>) => {
    // Check request for constitutional violations
    const violation = ConstitutionalRulesEngine.violatesConstitution(ctx.request.body);
    if (violation) {
      logger.error('Constitutional violation in request:', violation);
      ctx.status = 403;
      ctx.body = {
        error: 'Constitutional violation',
        message: violation.message,
        details: violation.details
      };
      return;
    }

    await next();
  };
}

export { ConstitutionalRulesEngine };
