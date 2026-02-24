/**
 * TAMV - Sistema de Filtración Interna en 8 Capas
 * QC-TAMV-IA-01 Implementation
 * 
 * Este módulo implementa las 8 capas de filtrado requeridas por el documento maestro:
 * 1. Sanitización técnica (inyecciones, payloads)
 * 2. Clasificación semántica de intención
 * 3. Detección de riesgo ético
 * 4. Consistencia contextual
 * 5. Coherencia cognitiva (anti-fragmentación)
 * 6. Evaluación legal y compliance
 * 7. Evaluación de impacto humano
 * 8. Decisión de flujo (permitir / redirigir / bloquear)
 */

import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// TIPOS Y CONSTANTES
// ============================================================================

export enum FilterLayer {
  SANITIZATION = 1,
  SEMANTIC_CLASSIFICATION = 2,
  ETHICAL_RISK_DETECTION = 3,
  CONTEXTUAL_CONSISTENCY = 4,
  COGNITIVE_COHERENCE = 5,
  LEGAL_COMPLIANCE = 6,
  HUMAN_IMPACT_ASSESSMENT = 7,
  FLOW_DECISION = 8
}

export enum FilterDecision {
  ALLOW = 'allow',
  REDIRECT = 'redirect',
  BLOCK = 'block'
}

export interface FilterResult {
  decision: FilterDecision;
  layer: FilterLayer;
  confidence: number;
  reasons: string[];
  recommendations: string[];
  metadata: Record<string, any>;
}

export interface PipelineContext {
  userId?: string;
  sessionId?: string;
  input: string;
  previousMessages?: Array<{ role: string; content: string }>;
  metadata?: Record<string, any>;
}

// ============================================================================
// CAPA 1: SANITIZACIÓN TÉCNICA
// ============================================================================

class SanitizationLayer {
  // Patrones de inyección y payloads maliciosos
  private static readonly INJECTION_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /eval\s*\(/gi,
    /exec\s*\(/gi,
    /document\./gi,
    /window\./gi,
    /\$\{.*\}/g,
    /\{\{.*\}\}/g,
    /<[^>]+>/g
  ];

  // Patrones SQL injection
  private static readonly SQL_INJECTION_PATTERNS = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /('|(\\')|(--)|(\/\*)|(\*\/))/,
    /(union\s+select|union\s+all)/i,
    /(\bOR\b.*=.*\bOR\b)/i
  ];

  // Prompt injection patterns
  private static readonly PROMPT_INJECTION_PATTERNS = [
    /ignore\s+(previous|all|above)\s+(instructions|prompts|commands)/i,
    /forget\s+(everything|all|your)/i,
    /system\s*:\s*/i,
    /assistant\s*:\s*/i,
    /you\s+are\s+(now|no\s+longer)/i,
    /new\s+(system\s+)?(instructions?|rules?)/i,
    /\\n\\n.*:.*\\n/i
  ];

  static sanitize(input: string): { sanitized: string; threats: string[] } {
    let sanitized = input;
    const threats: string[] = [];

    // Sanitize HTML tags
    for (const pattern of this.INJECTION_PATTERNS) {
      if (pattern.test(sanitized)) {
        threats.push(`HTML/JS injection detected: ${pattern.source}`);
        sanitized = sanitized.replace(pattern, '');
      }
    }

    // Check SQL injection
    for (const pattern of this.SQL_INJECTION_PATTERNS) {
      if (pattern.test(sanitized)) {
        threats.push(`SQL injection pattern detected: ${pattern.source}`);
        sanitized = sanitized.replace(pattern, ' [FILTERED] ');
      }
    }

    // Check prompt injection
    for (const pattern of this.PROMPT_INJECTION_PATTERNS) {
      if (pattern.test(sanitized)) {
        threats.push(`Prompt injection detected: ${pattern.source}`);
        sanitized = sanitized.replace(pattern, '[BLOCKED] ');
      }
    }

    // Remove excessive whitespace
    sanitized = sanitized.replace(/\s+/g, ' ').trim();

    return { sanitized, threats };
  }
}

// ============================================================================
// CAPA 2: CLASIFICACIÓN SEMÁNTICA DE INTENCIÓN
// ============================================================================

class SemanticClassificationLayer {
  private static readonly INTENT_PATTERNS: Record<string, RegExp[]> = {
    crisis: [
      /suicid/i, /autolesi/i, /matarme/i, /matarme/i, /fin\s+de\s+mi\s+vid/i,
      /no\s+tengo\s+(ganas|razón|sentido)\s+de/i, /mejor\s+estaría\s+muerto/i,
      /dolor\s+(insoportable|insoportable)/i
    ],
    help: [
      /ayuda/i, /necesito\s+ayuda/i, /no\s+sé\s+qué\s+hacer/i, 
      /emergencia/i, /urgente/i, /problema\s+grave/i
    ],
    information: [
      /qué\s+es/i, /cómo\s+funciona/i, /dime\s+(más|sobre)/i,
      /explicame/i, /información/i, /quiero\s+saber/i
    ],
    action: [
      /quiero\s+(crear|hacer|comprar|obtener)/i, /ayúdame\s+a/i,
      /puedo\s+hacer/i, /haz\s+(esto|esto)/i
    ],
    emotional: [
      /me\s+siento/i, /estoy\s+(triste|feliz|enojado|ansioso)/i,
      /necesito\s+(hablar|desahogarme)/i, /no\s+entiendo\s+mis\s+emociones/i
    ]
  };

  static classify(input: string): { intent: string; confidence: number; subIntents: string[] } {
    const inputLower = input.toLowerCase();
    const scores: Record<string, number> = {};

    for (const [intent, patterns] of Object.entries(this.INTENT_PATTERNS)) {
      scores[intent] = patterns.reduce((score, pattern) => {
        return score + (pattern.test(inputLower) ? 1 : 0);
      }, 0);
    }

    // Get primary intent
    const entries = Object.entries(scores);
    const primary = entries.reduce((a, b) => a[1] > b[1] ? a : b);
    
    const totalScore = entries.reduce((sum, [_, score]) => sum + score, 0);
    const confidence = totalScore > 0 ? primary[1] / totalScore : 0;

    // Get all intents above threshold
    const subIntents = entries
      .filter(([_, score]) => score > 0)
      .map(([intent]) => intent);

    return {
      intent: primary[0] || 'unknown',
      confidence: Math.min(confidence, 1),
      subIntents
    };
  }
}

// ============================================================================
// CAPA 3: DETECCIÓN DE RIESGO ÉTICO
// ============================================================================

class EthicalRiskDetectionLayer {
  // Categorías de riesgo ético
  private static readonly RISK_CATEGORIES = {
    sexual: {
      patterns: [
        /sexo/i, /sexual/i, /erótico/i, /pornografía/i, /xxx/i,
        /relación\s+sexual/i, /cuerpo\s+desnudo/i, /acto\s+sexual/i,
        /masturb/i, /orgasmo/i, /seduce/i, /romántico\s+explicit/i
      ],
      severity: 0.95
    },
    violence: {
      patterns: [
        /matar/i, /morir/i, /asesinar/i, /golpear/i, /atacar/i,
        /violencia/i, /arma/i, /bomba/i, /explosivo/i, /terrorismo/i
      ],
      severity: 0.9
    },
    self_harm: {
      patterns: [
        /suicidio/i, /autolesión/i, /cortarme/i, /hacerme\s+daño/i,
        /lastimarme/i, /no\s+quiero\s+vivir/i, /mejor\s+sin\s+mí/i
      ],
      severity: 1.0
    },
    deception: {
      patterns: [
        /engañar/i, /mentira/i, /fraude/i, /estafa/i, /robar/i,
        /phishing/i, /suplantación/i, /falso\s+perfil/i
      ],
      severity: 0.85
    },
    discrimination: {
      patterns: [
        /discrimin/i, /racismo/i, /sexismo/i, /homofobia/i,
        /odio/i, /supremac/i, /xenofob/i
      ],
      severity: 0.9
    },
    illegal: {
      patterns: [
        /droga/i, /cocaína/i, /heroína/i, /marihuana/i, /tráfico\s+drogas/i,
        /piratería/i, /Software\s+pirata/i, /descarga\s+ilegal/i
      ],
      severity: 0.85
    }
  };

  static detectRisks(input: string): { 
    risks: Array<{ category: string; severity: number; detected: boolean }>;
    overallRisk: number;
    hasCriticalRisk: boolean;
  } {
    const inputLower = input.toLowerCase();
    const risks: Array<{ category: string; severity: number; detected: boolean }> = [];
    let maxSeverity = 0;

    for (const [category, config] of Object.entries(this.RISK_CATEGORIES)) {
      const detected = config.patterns.some(pattern => pattern.test(inputLower));
      if (detected) {
        maxSeverity = Math.max(maxSeverity, config.severity);
      }
      risks.push({
        category,
        severity: config.severity,
        detected
      });
    }

    return {
      risks,
      overallRisk: maxSeverity,
      hasCriticalRisk: maxSeverity >= 0.9
    };
  }
}

// ============================================================================
// CAPA 4: CONSISTENCIA CONTEXTUAL
// ============================================================================

class ContextualConsistencyLayer {
  static checkConsistency(
    currentInput: string,
    previousMessages?: Array<{ role: string; content: string }>
  ): { consistent: boolean; score: number; issues: string[] } {
    const issues: string[] = [];
    
    if (!previousMessages || previousMessages.length === 0) {
      return { consistent: true, score: 1.0, issues: [] };
    }

    const lastMessages = previousMessages.slice(-5);
    const contextWords = new Set<string>();
    
    // Collect context from previous messages
    for (const msg of lastMessages) {
      const words = msg.content.toLowerCase().split(/\s+/);
      words.forEach(w => {
        if (w.length > 4) contextWords.add(w);
      });
    }

    // Check for topic continuity
    const currentWords = currentInput.toLowerCase().split(/\s+/);
    let continuityScore = 0;
    
    for (const word of currentWords) {
      if (contextWords.has(word)) {
        continuityScore++;
      }
    }

    // Check for contradictory messages
    const contradictions = [
      { positive: /sí\s+(quiero|si)/i, negative: /no\s+(quiero|no)/i },
      { positive: /estoy\s+de\s+acuerdo/i, negative: /no\s+estoy\s+de\s+acuerdo/i }
    ];

    for (const { positive, negative } of contradictions) {
      const hasPositive = lastMessages.some(m => positive.test(m.content));
      const hasNegative = negative.test(currentInput);
      
      if (hasPositive && hasNegative) {
        issues.push('Possible contradiction detected with previous message');
      }
    }

    const consistencyScore = Math.min(continuityScore / 3, 1);

    return {
      consistent: issues.length === 0,
      score: consistencyScore,
      issues
    };
  }
}

// ============================================================================
// CAPA 5: COHERENCIA COGNITIVA (ANTI-FRAGMENTACIÓN)
// ============================================================================

class CognitiveCoherenceLayer {
  // Signos de fragmentación cognitiva
  private static readonly FRAGMENTATION_INDICATORS = [
    /\.\.\.+/g,  // Ellipsis repetidos
    /\b\w+\s+\w+\s+\w+\s+\w+\s+\w+$/, // Palabras sin puntuación al final
    /^[a-z]+\s+[a-z]+\s+[a-z]+\s+[a-z]+$/i, // Palabras inconexas
    /[\?!]{3,}/g, // Signos de puntuación repetidos
  ];

  static checkCoherence(input: string): { 
    coherent: boolean; 
    score: number; 
    indicators: string[] 
  } {
    const indicators: string[] = [];
    
    for (const pattern of this.FRAGMENTATION_INDICATORS) {
      if (pattern.test(input)) {
        indicators.push(`Fragmentation detected: ${pattern.source}`);
      }
    }

    // Check sentence completion
    const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const incompleteSentences = sentences.filter(s => {
      const trimmed = s.trim();
      // Check if sentence starts with lowercase (likely incomplete)
      return trimmed.length > 0 && /^[a-záéíóúñ]/.test(trimmed);
    });

    if (incompleteSentences.length > 0) {
      indicators.push(`${incompleteSentences.length} incomplete sentences detected`);
    }

    // Calculate coherence score
    const baseScore = 1.0;
    const indicatorPenalty = indicators.length * 0.15;
    const sentencePenalty = (incompleteSentences.length / Math.max(sentences.length, 1)) * 0.2;

    const score = Math.max(0, baseScore - indicatorPenalty - sentencePenalty);

    return {
      coherent: indicators.length === 0 && sentencePenalty < 0.3,
      score,
      indicators
    };
  }
}

// ============================================================================
// CAPA 6: EVALUACIÓN LEGAL Y COMPLIANCE
// ============================================================================

class LegalComplianceLayer {
  private static readonly COMPLIANCE_REGIONS = {
    GDPR: ['eu', 'european', 'gdpr', 'data protection'],
    COPPA: ['child', 'minor', 'under 13', 'under 18'],
    HIPAA: ['medical', 'health', 'patient', 'diagnosis', 'treatment'],
    FINANCIAL: ['bank', 'credit card', 'payment', 'investment', 'stock']
  };

  static evaluate(input: string, userId?: string): {
    compliant: boolean;
    issues: string[];
    requiresConsent: string[];
  } {
    const inputLower = input.toLowerCase();
    const issues: string[] = [];
    const requiresConsent: string[] = [];

    // Check for regulated data types
    for (const [regulation, keywords] of Object.entries(this.COMPLIANCE_REGIONS)) {
      const hasKeyword = keywords.some(kw => inputLower.includes(kw));
      if (hasKeyword) {
        requiresConsent.push(regulation);
      }
    }

    // Check for financial advice patterns
    if (/invers|acción|criptomoneda|bitcoin|invertir\s+diner/i.test(input)) {
      issues.push('Financial advice - requires disclaimer');
    }

    // Check for medical advice patterns
    if (/diagnóstico|tratamiento\s+médic|receta\s+médic/i.test(input)) {
      issues.push('Medical advice - requires professional disclaimer');
    }

    return {
      compliant: issues.length === 0,
      issues,
      requiresConsent
    };
  }
}

// ============================================================================
// CAPA 7: EVALUACIÓN DE IMPACTO HUMANO
// ============================================================================

class HumanImpactAssessmentLayer {
  // Patrones que indican potencial impacto negativo en el usuario
  private static readonly IMPACT_PATTERNS = {
    negative: [
      /nunca\s+va\s+a\s+poder/i,
      /eres\s+inútil/i,
      /nadie\s+te\s+quiere/i,
      /estás\s+condenado/i,
      /no\s+tienes\s+esperanza/i
    ],
    manipulative: [
      /solo\s+yo\s+puedo\s+ayudarte/i,
      /nadie\s+más\s+entiende/i,
      /debes\s+confiar\s+en\s+mí/i,
      /no\s+le\s+cuentes\s+a\s+nadie/i
    ],
    dependency: [
      /no\s+puedes\s+vivir\s+sin\s+mí/i,
      /necesitas\s+estar\s+conmigo/i,
      /soy\s+lo\s+único\s+que\s+tienes/i
    ]
  };

  static assess(input: string): {
    impact: 'positive' | 'neutral' | 'negative' | 'critical';
    score: number;
    concerns: string[];
    intervention: 'none' | 'monitor' | 'escalate';
  } {
    const inputLower = input.toLowerCase();
    const concerns: string[] = [];
    let maxConcernScore = 0;

    for (const [category, patterns] of Object.entries(this.IMPACT_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(inputLower)) {
          concerns.push(`${category}: ${pattern.source}`);
          if (category === 'negative') maxConcernScore = Math.max(maxConcernScore, 0.7);
          if (category === 'manipulative') maxConcernScore = Math.max(maxConcernScore, 0.8);
          if (category === 'dependency') maxConcernScore = Math.max(maxConcernScore, 0.9);
        }
      }
    }

    let impact: 'positive' | 'neutral' | 'negative' | 'critical' = 'neutral';
    let intervention: 'none' | 'monitor' | 'escalate' = 'none';

    if (maxConcernScore >= 0.9) {
      impact = 'critical';
      intervention = 'escalate';
    } else if (maxConcernScore >= 0.7) {
      impact = 'negative';
      intervention = 'monitor';
    }

    return {
      impact,
      score: 1 - maxConcernScore,
      concerns,
      intervention
    };
  }
}

// ============================================================================
// CAPA 8: DECISIÓN DE FLUJO
// ============================================================================

class FlowDecisionLayer {
  static decide(filterResults: {
    sanitization: { threats: string[] };
    semantic: { intent: string; confidence: number };
    ethical: { overallRisk: number; hasCriticalRisk: boolean };
    coherence: { score: number };
    legal: { compliant: boolean; issues: string[] };
    impact: { intervention: 'none' | 'monitor' | 'escalate' };
  }): FilterResult {
    const reasons: string[] = [];
    let decision: FilterDecision = FilterDecision.ALLOW;
    let confidence = 1.0;

    // Check sanitization threats
    if (filterResults.sanitization.threats.length > 0) {
      decision = FilterDecision.BLOCK;
      reasons.push(`Security threats detected: ${filterResults.sanitization.threats.join(', ')}`);
      confidence = 0.95;
    }

    // Check ethical risks
    if (filterResults.ethical.hasCriticalRisk) {
      decision = FilterDecision.BLOCK;
      reasons.push('Critical ethical risk detected');
      confidence = 0.98;
    } else if (filterResults.ethical.overallRisk > 0.7) {
      decision = FilterDecision.REDIRECT;
      reasons.push('Elevated ethical risk - redirecting to safe mode');
      confidence = 0.85;
    }

    // Check coherence
    if (filterResults.coherence.score < 0.5) {
      decision = FilterDecision.BLOCK;
      reasons.push('Low cognitive coherence');
      confidence = 0.8;
    }

    // Check legal compliance
    if (!filterResults.legal.compliant) {
      decision = FilterDecision.REDIRECT;
      reasons.push(`Legal compliance issues: ${filterResults.legal.issues.join(', ')}`);
      confidence = 0.9;
    }

    // Check human impact
    if (filterResults.impact.intervention === 'escalate') {
      decision = FilterDecision.BLOCK;
      reasons.push('Critical human impact detected - escalation required');
      confidence = 0.99;
    }

    return {
      decision,
      layer: FilterLayer.FLOW_DECISION,
      confidence,
      reasons,
      recommendations: decision === FilterDecision.ALLOW ? [] : ['Review with human supervisor'],
      metadata: filterResults
    };
  }
}

// ============================================================================
// ORQUESTADOR PRINCIPAL - 8 CAPAS DE FILTRADO
// ============================================================================

export class OctupleFilterSystem {
  private static instance: OctupleFilterSystem;

  private constructor() {}

  static getInstance(): OctupleFilterSystem {
    if (!OctupleFilterSystem.instance) {
      OctupleFilterSystem.instance = new OctupleFilterSystem();
    }
    return OctupleFilterSystem.instance;
  }

  /**
   * Ejecuta las 8 capas de filtrado
   */
  async filter(context: PipelineContext): Promise<FilterResult> {
    console.log('[OctupleFilter] Starting 8-layer filtering...');

    // Capa 1: Sanitización
    const sanitization = SanitizationLayer.sanitize(context.input);
    console.log('[OctupleFilter] Layer 1 - Sanitization:', sanitization.threats.length > 0 ? 'threats found' : 'clean');

    // If critical security threats, block immediately
    if (sanitization.threats.length > 3) {
      return this.createBlockResult(FilterLayer.SANITIZATION, 0.99, 
        'Critical security threats detected', ['Input contains malicious content']);
    }

    // Capa 2: Clasificación semántica
    const semantic = SemanticClassificationLayer.classify(context.input);
    console.log('[OctupleFilter] Layer 2 - Semantic:', semantic.intent);

    // Capa 3: Detección de riesgo ético
    const ethical = EthicalRiskDetectionLayer.detectRisks(context.input);
    console.log('[OctupleFilter] Layer 3 - Ethical:', ethical.overallRisk);

    // Capa 4: Consistencia contextual
    const contextual = ContextualConsistencyLayer.checkConsistency(
      context.input, 
      context.previousMessages
    );
    console.log('[OctupleFilter] Layer 4 - Contextual:', contextual.score);

    // Capa 5: Coherencia cognitiva
    const coherence = CognitiveCoherenceLayer.checkCoherence(context.input);
    console.log('[OctupleFilter] Layer 5 - Coherence:', coherence.score);

    // Capa 6: Cumplimiento legal
    const legal = LegalComplianceLayer.evaluate(context.input, context.userId);
    console.log('[OctupleFilter] Layer 6 - Legal:', legal.compliant);

    // Capa 7: Impacto humano
    const impact = HumanImpactAssessmentLayer.assess(context.input);
    console.log('[OctupleFilter] Layer 7 - Impact:', impact.impact);

    // Capa 8: Decisión de flujo
    const flowDecision = FlowDecisionLayer.decide({
      sanitization,
      semantic,
      ethical,
      coherence,
      legal,
      impact
    });

    // Log para auditoría
    await this.logFilterResult(context, flowDecision);

    console.log('[OctupleFilter] Final decision:', flowDecision.decision);
    return flowDecision;
  }

  private createBlockResult(
    layer: FilterLayer, 
    confidence: number, 
    reason: string,
    recommendations: string[]
  ): FilterResult {
    return {
      decision: FilterDecision.BLOCK,
      layer,
      confidence,
      reasons: [reason],
      recommendations,
      metadata: {}
    };
  }

  private async logFilterResult(context: PipelineContext, result: FilterResult) {
    try {
      const { error } = await supabase.from('isabella_filter_logs').insert({
        user_id: context.userId,
        session_id: context.sessionId,
        input_preview: context.input.substring(0, 200),
        decision: result.decision,
        layer: result.layer,
        confidence: result.confidence,
        reasons: result.reasons as any,
        created_at: new Date().toISOString()
      });

      if (error) {
        console.error('[OctupleFilter] Log error:', error);
      }
    } catch (error) {
      console.error('[OctupleFilter] Logging error:', error);
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const octupleFilter = OctupleFilterSystem.getInstance();
