/**
 * TAMV - Sistema de Doble Pipeline Operativo
 * QC-TAMV-IA-01 — All queries use real tables (isabella_interactions, profiles)
 */

import { octupleFilter, FilterDecision, PipelineContext } from './octupleFilter';
import { supabase } from '@/integrations/supabase/client';

export enum PipelineType { NORMAL = 'NORMAL', RISK = 'RISK' }

export interface PipelineConfig {
  maxRetries: number;
  timeout: number;
  enableFallback: boolean;
  riskThreshold: number;
}

export interface PipelineResult {
  pipeline: PipelineType;
  success: boolean;
  data?: unknown;
  error?: string;
  latency: number;
  metadata: { filterDecision: FilterDecision; confidence: number; layer: number };
}

const DEFAULT_CONFIG: PipelineConfig = { maxRetries: 2, timeout: 15000, enableFallback: true, riskThreshold: 0.6 };

// ============================================================================
// PIPELINE A - NORMAL
// ============================================================================

class NormalPipeline {
  private config: PipelineConfig;
  constructor(config: Partial<PipelineConfig> = {}) { this.config = { ...DEFAULT_CONFIG, ...config }; }

  async execute(context: PipelineContext): Promise<PipelineResult> {
    const startTime = Date.now();
    try {
      if (!context.input || context.input.trim().length === 0) throw new Error('Empty input');
      if (context.input.length > 10000) throw new Error('Input too long');

      const filterResult = await octupleFilter.filter(context);

      if (filterResult.decision === FilterDecision.REDIRECT) {
        return await new RiskPipeline(this.config).execute(context);
      }
      if (filterResult.decision === FilterDecision.BLOCK) {
        return {
          pipeline: PipelineType.NORMAL, success: false,
          error: `Blocked: ${filterResult.reasons.join(', ')}`,
          latency: Date.now() - startTime,
          metadata: { filterDecision: filterResult.decision, confidence: filterResult.confidence, layer: filterResult.layer }
        };
      }

      const enrichedContext: PipelineContext = { ...context };
      const inferenceResult = await this.performInference(enrichedContext);

      return {
        pipeline: PipelineType.NORMAL, success: true,
        data: { ...inferenceResult, _pipeline: PipelineType.NORMAL, _timestamp: Date.now() },
        latency: Date.now() - startTime,
        metadata: { filterDecision: filterResult.decision, confidence: filterResult.confidence, layer: filterResult.layer }
      };
    } catch (error) {
      if (this.config.enableFallback) return this.fallback();
      return {
        pipeline: PipelineType.NORMAL, success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        latency: Date.now() - startTime,
        metadata: { filterDecision: FilterDecision.BLOCK, confidence: 1.0, layer: 0 }
      };
    }
  }

  private async enrichContext(context: PipelineContext): Promise<PipelineContext> {
    const enriched = { ...context };
    try {
      if (context.userId) {
        const { data: history } = await supabase
          .from('isabella_interactions')
          .select('content, message_role, metadata')
          .eq('user_id', context.userId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (history && history.length > 0) {
          enriched.previousMessages = history as unknown[];
        }

        const { data: userPrefs } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', context.userId)
          .single();

        if (userPrefs) {
          enriched.metadata = { ...enriched.metadata, userPreferences: userPrefs };
        }
      }
    } catch (error) {
      console.error('[Pipeline A] Context enrichment error:', error);
    }
    return enriched;
  }

  private async performInference(context: PipelineContext): Promise<unknown> {
    const resp = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/isabella-chat-enhanced`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: context.previousMessages || [],
          context: { ...context.metadata, input: context.input, timestamp: Date.now() }
        })
      }
    );
    if (!resp.ok) throw new Error(`TAMVAI inference failed: ${resp.status}`);
    return await resp.json();
  }

  private fallback(): PipelineResult {
    return {
      pipeline: PipelineType.NORMAL, success: true,
      data: { content: 'Disculpa, estoy experimentando dificultades técnicas. ¿Podrías reformular tu pregunta?', type: 'fallback' },
      latency: 0,
      metadata: { filterDecision: FilterDecision.ALLOW, confidence: 0.5, layer: 0 }
    };
  }
}

// ============================================================================
// PIPELINE B - RISK
// ============================================================================

class RiskPipeline {
  private config: PipelineConfig;
  constructor(config: Partial<PipelineConfig> = {}) { this.config = { ...DEFAULT_CONFIG, ...config }; }

  async execute(context: PipelineContext): Promise<PipelineResult> {
    const startTime = Date.now();
    try {
      const deepFilterResult = await octupleFilter.filter(context);

      if (deepFilterResult.decision === FilterDecision.BLOCK) {
        await this.logRiskEvent(context, deepFilterResult, 'blocked');
        return {
          pipeline: PipelineType.RISK, success: false,
          error: `Blocked: ${deepFilterResult.reasons.join(', ')}`,
          latency: Date.now() - startTime,
          metadata: { filterDecision: deepFilterResult.decision, confidence: deepFilterResult.confidence, layer: deepFilterResult.layer }
        };
      }

      const safeResponse = this.generateSafeResponse(context, deepFilterResult);
      return {
        pipeline: PipelineType.RISK, success: true, data: safeResponse,
        latency: Date.now() - startTime,
        metadata: { filterDecision: deepFilterResult.decision, confidence: deepFilterResult.confidence, layer: deepFilterResult.layer }
      };
    } catch {
      return {
        pipeline: PipelineType.RISK, success: false,
        error: 'Risk analysis failed - defaulting to safe response',
        latency: Date.now() - startTime,
        metadata: { filterDecision: FilterDecision.BLOCK, confidence: 1.0, layer: 8 }
      };
    }
  }

  private generateSafeResponse(context: PipelineContext, filterResult: { metadata?: { ethical?: { risks?: Array<{ detected: boolean; category: string }> } } }) {
    const risks = filterResult.metadata?.ethical?.risks || [];
    let safeMessage = 'He detectado que esta conversación puede requerir atención especial. ¿Podrías reformular tu solicitud?';
    let redirectTo: string | null = null;

    for (const risk of risks) {
      if (risk.detected) {
        switch (risk.category) {
          case 'sexual': case 'violence':
            safeMessage = 'No puedo ayudarte con ese tipo de contenido. ¿Hay algo más en lo que pueda ayudarte?'; break;
          case 'self_harm':
            safeMessage = 'Estoy preocupado por ti. Si estás pensando en hacerte daño, busca ayuda profesional.';
            redirectTo = 'crisis_resources'; break;
          case 'deception':
            safeMessage = 'No puedo ayudarte con eso. ¿Hay algo más legítimo en lo que pueda asistirte?'; break;
        }
        break;
      }
    }

    return { content: safeMessage, type: 'safe_response', redirectTo, _pipeline: PipelineType.RISK, _timestamp: Date.now() };
  }

  private async logRiskEvent(context: PipelineContext, filterResult: unknown, action: string) {
    try {
      await supabase.from('isabella_interactions').insert([{
        user_id: context.userId || '00000000-0000-0000-0000-000000000000',
        message_role: 'system',
        content: `RISK_LOG: ${action} - ${context.input.substring(0, 200)}`,
        metadata: { filter_result: filterResult, pipeline: PipelineType.RISK, session_id: context.sessionId } as Record<string, unknown>,
        ethical_flag: 'risk_detected',
      }]);
    } catch (error) {
      console.error('[Pipeline B] Log error:', error);
    }
  }
}

// ============================================================================
// ORCHESTRATOR
// ============================================================================

export class PipelineOrchestrator {
  private static instance: PipelineOrchestrator;
  private normalPipeline: NormalPipeline;
  private riskPipeline: RiskPipeline;
  private metrics = { normalRequests: 0, riskRequests: 0, normalLatency: [] as number[], riskLatency: [] as number[] };

  private constructor() { this.normalPipeline = new NormalPipeline(); this.riskPipeline = new RiskPipeline(); }

  static getInstance(): PipelineOrchestrator {
    if (!PipelineOrchestrator.instance) PipelineOrchestrator.instance = new PipelineOrchestrator();
    return PipelineOrchestrator.instance;
  }

  async execute(context: PipelineContext): Promise<PipelineResult> {
    const quickFilter = await octupleFilter.filter(context);
    if (quickFilter.decision === FilterDecision.ALLOW) {
      this.metrics.normalRequests++;
      const result = await this.normalPipeline.execute(context);
      this.metrics.normalLatency.push(result.latency);
      return result;
    }
    this.metrics.riskRequests++;
    const result = await this.riskPipeline.execute(context);
    this.metrics.riskLatency.push(result.latency);
    return result;
  }

  getMetrics() {
    const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    return {
      totalNormalRequests: this.metrics.normalRequests,
      totalRiskRequests: this.metrics.riskRequests,
      averageNormalLatency: avg(this.metrics.normalLatency),
      averageRiskLatency: avg(this.metrics.riskLatency),
      riskRatio: this.metrics.riskRequests / (this.metrics.normalRequests + this.metrics.riskRequests || 1)
    };
  }

  resetMetrics() { this.metrics = { normalRequests: 0, riskRequests: 0, normalLatency: [], riskLatency: [] }; }
}

export const pipelineOrchestrator = PipelineOrchestrator.getInstance();
export { NormalPipeline, RiskPipeline };
