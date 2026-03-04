/**
 * TAMV - Sistema de Filtrado Óctuple (8 capas)
 * QC-TAMV-IA-01 — All logs to isabella_interactions
 */

import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// TYPES
// ============================================================================

export enum FilterDecision {
  ALLOW = 'allow',
  BLOCK = 'block',
  REDIRECT = 'redirect',
  FLAG = 'flag'
}

export interface FilterLayer {
  name: string;
  order: number;
  enabled: boolean;
  weight: number;
}

export interface FilterResult {
  decision: FilterDecision;
  layer: number;
  confidence: number;
  reasons: string[];
  recommendations: string[];
  metadata: Record<string, unknown>;
}

export interface PipelineContext {
  input: string;
  userId?: string;
  sessionId?: string;
  previousMessages?: unknown[];
  metadata?: Record<string, unknown>;
}

// ============================================================================
// FILTER LAYERS
// ============================================================================

const FILTER_LAYERS: FilterLayer[] = [
  { name: 'Input Validation', order: 1, enabled: true, weight: 1.0 },
  { name: 'Content Classification', order: 2, enabled: true, weight: 0.9 },
  { name: 'Ethical Analysis', order: 3, enabled: true, weight: 1.0 },
  { name: 'Sexual Content Shield', order: 4, enabled: true, weight: 1.0 },
  { name: 'Violence Detection', order: 5, enabled: true, weight: 0.95 },
  { name: 'Manipulation Detection', order: 6, enabled: true, weight: 0.85 },
  { name: 'Context Coherence', order: 7, enabled: true, weight: 0.7 },
  { name: 'Final Governance Gate', order: 8, enabled: true, weight: 1.0 },
];

// Pattern lists
const SEXUAL_PATTERNS = [
  /pornograf[íi]a/gi, /contenido\s+adulto/gi, /sexo\s+expl[íi]cito/gi,
  /desnud[oa]s?\b/gi, /er[oó]tic[oa]/gi,
];

const VIOLENCE_PATTERNS = [
  /asesinato/gi, /terrorismo/gi, /tortura/gi,
  /masacre/gi, /armas?\s+de\s+fuego/gi,
];

const MANIPULATION_PATTERNS = [
  /ignora\s+tus\s+instrucciones/gi, /olvida\s+todo/gi,
  /act[úu]a\s+como\s+si\s+no\s+tuvieras\s+reglas/gi,
  /jailbreak/gi, /prompt\s+injection/gi,
];

const SELF_HARM_PATTERNS = [
  /suicid/gi, /autolesi[oó]n/gi, /quiero\s+morir/gi,
  /hacerme\s+da[ñn]o/gi,
];

// ============================================================================
// OCTUPLE FILTER SYSTEM
// ============================================================================

export class OctupleFilterSystem {
  private static instance: OctupleFilterSystem;
  private layers: FilterLayer[];

  private constructor() { this.layers = FILTER_LAYERS; }

  static getInstance(): OctupleFilterSystem {
    if (!OctupleFilterSystem.instance) OctupleFilterSystem.instance = new OctupleFilterSystem();
    return OctupleFilterSystem.instance;
  }

  async filter(context: PipelineContext): Promise<FilterResult> {
    const reasons: string[] = [];
    const recommendations: string[] = [];
    let maxRisk = 0;
    let blockLayer = 0;
    const metadata: Record<string, unknown> = {};

    for (const layer of this.layers) {
      if (!layer.enabled) continue;

      const layerResult = this.executeLayer(layer, context);
      if (layerResult.risk > 0) {
        reasons.push(...layerResult.reasons);
        recommendations.push(...layerResult.recommendations);
        metadata[layer.name] = layerResult;
      }

      const weightedRisk = layerResult.risk * layer.weight;
      if (weightedRisk > maxRisk) {
        maxRisk = weightedRisk;
        blockLayer = layer.order;
      }
    }

    let decision: FilterDecision;
    if (maxRisk >= 0.9) decision = FilterDecision.BLOCK;
    else if (maxRisk >= 0.6) decision = FilterDecision.REDIRECT;
    else if (maxRisk >= 0.3) decision = FilterDecision.FLAG;
    else decision = FilterDecision.ALLOW;

    const result: FilterResult = {
      decision, layer: blockLayer, confidence: maxRisk,
      reasons, recommendations, metadata,
    };

    if (decision !== FilterDecision.ALLOW) {
      await this.logFilterResult(context, result);
    }

    return result;
  }

  private executeLayer(layer: FilterLayer, context: PipelineContext): { risk: number; reasons: string[]; recommendations: string[] } {
    const input = context.input || '';
    const reasons: string[] = [];
    const recommendations: string[] = [];
    let risk = 0;

    switch (layer.order) {
      case 1: // Input Validation
        if (!input || input.trim().length === 0) { risk = 1.0; reasons.push('Empty input'); }
        if (input.length > 10000) { risk = 0.8; reasons.push('Input too long'); }
        if (/<script|javascript:|on\w+=/i.test(input)) { risk = 1.0; reasons.push('XSS attempt detected'); }
        break;

      case 2: // Content Classification
        if (/\b(hack|exploit|vulnerability|zero-?day)\b/i.test(input)) {
          risk = 0.4; reasons.push('Potential security-related content');
        }
        break;

      case 3: // Ethical Analysis
        if (SELF_HARM_PATTERNS.some(p => p.test(input))) {
          risk = 0.95; reasons.push('Self-harm content detected');
          recommendations.push('Redirect to crisis resources');
        }
        break;

      case 4: // Sexual Content Shield
        if (SEXUAL_PATTERNS.some(p => p.test(input))) {
          risk = 1.0; reasons.push('Sexual content detected');
        }
        break;

      case 5: // Violence Detection
        if (VIOLENCE_PATTERNS.some(p => p.test(input))) {
          risk = 0.95; reasons.push('Violent content detected');
        }
        break;

      case 6: // Manipulation Detection
        if (MANIPULATION_PATTERNS.some(p => p.test(input))) {
          risk = 1.0; reasons.push('Prompt injection/manipulation detected');
        }
        break;

      case 7: // Context Coherence
        if (context.previousMessages && context.previousMessages.length > 0) {
          // Basic coherence check — placeholder
        }
        break;

      case 8: // Final Governance Gate
        // Aggregate check already done above
        break;
    }

    return { risk, reasons, recommendations };
  }

  private createResult(decision: FilterDecision, layer: number, confidence: number, reason: string, recommendations: string[] = []): FilterResult {
    return { decision, layer, confidence, reasons: [reason], recommendations, metadata: {} };
  }

  private async logFilterResult(context: PipelineContext, result: FilterResult) {
    try {
      await supabase.from('isabella_interactions').insert({
        user_id: context.userId || '00000000-0000-0000-0000-000000000000',
        message_role: 'system',
        content: `FILTER_LOG: ${result.decision} at layer ${result.layer} - ${context.input.substring(0, 200)}`,
        metadata: { decision: result.decision, layer: result.layer, confidence: result.confidence, reasons: result.reasons },
        ethical_flag: result.decision === FilterDecision.BLOCK ? 'blocked' : null,
      });
    } catch (error) {
      console.error('[OctupleFilter] Logging error:', error);
    }
  }
}

export const octupleFilter = OctupleFilterSystem.getInstance();
