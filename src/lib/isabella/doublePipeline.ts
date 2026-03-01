/**
 * TAMV - Sistema de Doble Pipeline Operativo
 * QC-TAMV-IA-01 Implementation
 */

import { octupleFilter, FilterDecision, PipelineContext } from './octupleFilter';
import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// TIPOS Y CONSTANTES
// ============================================================================

export enum PipelineType {
  NORMAL = 'NORMAL',
  RISK = 'RISK'
}

export interface PipelineConfig {
  maxRetries: number;
  timeout: number;
  enableFallback: boolean;
  riskThreshold: number;
}

export interface PipelineResult {
  pipeline: PipelineType;
  success: boolean;
  data?: any;
  error?: string;
  latency: number;
  metadata: {
    filterDecision: FilterDecision;
    confidence: number;
    layer: number;
  };
}

const DEFAULT_CONFIG: PipelineConfig = {
  maxRetries: 2,
  timeout: 15000,
  enableFallback: true,
  riskThreshold: 0.6
};

// ============================================================================
// PIPELINE A - FLUJO NORMAL
// ============================================================================

class NormalPipeline {
  private config: PipelineConfig;

  constructor(config: Partial<PipelineConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async execute(context: PipelineContext): Promise<PipelineResult> {
    const startTime = Date.now();
    console.log('[Pipeline A] Starting normal flow...');

    try {
      if (!context.input || context.input.trim().length === 0) {
        throw new Error('Empty input not allowed');
      }
      if (context.input.length > 10000) {
        throw new Error('Input exceeds maximum length');
      }

      const filterResult = await octupleFilter.filter(context);

      if (filterResult.decision === FilterDecision.REDIRECT) {
        const riskPipeline = new RiskPipeline(this.config);
        return await riskPipeline.execute(context);
      }

      if (filterResult.decision === FilterDecision.BLOCK) {
        return {
          pipeline: PipelineType.NORMAL,
          success: false,
          error: `Blocked by filter: ${filterResult.reasons.join(', ')}`,
          latency: Date.now() - startTime,
          metadata: {
            filterDecision: filterResult.decision,
            confidence: filterResult.confidence,
            layer: filterResult.layer
          }
        };
      }

      const enrichedContext = await this.enrichContext(context);
      const inferenceResult = await this.performInference(enrichedContext);
      const processedResult = this.postProcess(inferenceResult);

      const latency = Date.now() - startTime;
      return {
        pipeline: PipelineType.NORMAL,
        success: true,
        data: processedResult,
        latency,
        metadata: {
          filterDecision: filterResult.decision,
          confidence: filterResult.confidence,
          layer: filterResult.layer
        }
      };
    } catch (error) {
      const latency = Date.now() - startTime;
      console.error('[Pipeline A] Error:', error);

      if (this.config.enableFallback) {
        return this.fallback(context, error);
      }

      return {
        pipeline: PipelineType.NORMAL,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        latency,
        metadata: {
          filterDecision: FilterDecision.BLOCK,
          confidence: 1.0,
          layer: 0
        }
      };
    }
  }

  private async enrichContext(context: PipelineContext): Promise<PipelineContext> {
    const enriched = { ...context };

    try {
      // Use ai_interactions as conversation history (existing table)
      if (context.userId) {
        const { data: history } = await supabase
          .from('ai_interactions')
          .select('content, message_role, emotion')
          .eq('user_id', context.userId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (history && history.length > 0) {
          enriched.previousMessages = history as any[];
        }
      }

      // Use profiles for user context (existing table)
      if (context.userId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', context.userId)
          .single();

        if (profile) {
          enriched.metadata = {
            ...enriched.metadata,
            userPreferences: profile
          };
        }
      }
    } catch (error) {
      console.error('[Pipeline A] Context enrichment error:', error);
    }

    return enriched;
  }

  private async performInference(context: PipelineContext): Promise<any> {
    const tamvaiResponse = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/isabella-chat-enhanced`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: context.previousMessages || [],
          context: {
            ...context.metadata,
            input: context.input,
            timestamp: Date.now()
          }
        })
      }
    );

    if (!tamvaiResponse.ok) {
      throw new Error(`TAMVAI inference failed: ${tamvaiResponse.status}`);
    }

    return await tamvaiResponse.json();
  }

  private postProcess(result: any): any {
    return {
      ...result,
      _pipeline: PipelineType.NORMAL,
      _timestamp: Date.now()
    };
  }

  private fallback(_context: PipelineContext, _error: any): PipelineResult {
    return {
      pipeline: PipelineType.NORMAL,
      success: true,
      data: {
        content: 'Disculpa, estoy experimentando dificultades técnicas. ¿Podrías reformular tu pregunta?',
        type: 'fallback'
      },
      latency: 0,
      metadata: {
        filterDecision: FilterDecision.ALLOW,
        confidence: 0.5,
        layer: 0
      }
    };
  }
}

// ============================================================================
// PIPELINE B - FLUJO DE RIESGO
// ============================================================================

class RiskPipeline {
  private config: PipelineConfig;

  constructor(config: Partial<PipelineConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async execute(context: PipelineContext): Promise<PipelineResult> {
    const startTime = Date.now();
    console.log('[Pipeline B] Starting risk flow...');

    try {
      const deepFilterResult = await octupleFilter.filter(context);

      if (deepFilterResult.decision === FilterDecision.BLOCK) {
        await this.logRiskEvent(context, deepFilterResult, 'blocked');

        return {
          pipeline: PipelineType.RISK,
          success: false,
          error: `Blocked: ${deepFilterResult.reasons.join(', ')}`,
          latency: Date.now() - startTime,
          metadata: {
            filterDecision: deepFilterResult.decision,
            confidence: deepFilterResult.confidence,
            layer: deepFilterResult.layer
          }
        };
      }

      const safeResponse = this.generateSafeResponse(context, deepFilterResult);
      const latency = Date.now() - startTime;

      return {
        pipeline: PipelineType.RISK,
        success: true,
        data: safeResponse,
        latency,
        metadata: {
          filterDecision: deepFilterResult.decision,
          confidence: deepFilterResult.confidence,
          layer: deepFilterResult.layer
        }
      };
    } catch (error) {
      return {
        pipeline: PipelineType.RISK,
        success: false,
        error: 'Risk analysis failed - defaulting to safe response',
        latency: Date.now() - startTime,
        metadata: {
          filterDecision: FilterDecision.BLOCK,
          confidence: 1.0,
          layer: 8
        }
      };
    }
  }

  private generateSafeResponse(context: PipelineContext, filterResult: any): any {
    const risks = filterResult.metadata?.ethical?.risks || [];
    let safeMessage = '';
    let redirectTo = null;

    for (const risk of risks) {
      if (risk.detected) {
        switch (risk.category) {
          case 'sexual':
          case 'violence':
            safeMessage = 'No puedo ayudarte con ese tipo de contenido. ¿Hay algo más en lo que pueda ayudarte?';
            break;
          case 'self_harm':
            safeMessage = 'Estoy preocupado por ti. Si estás pensando en hacerte daño, por favor busca ayuda profesional.';
            redirectTo = 'crisis_resources';
            break;
          case 'deception':
            safeMessage = 'No puedo ayudarte con eso. ¿Hay algo más legítimo en lo que pueda asistirte?';
            break;
          default:
            safeMessage = 'Parece que hay algo en lo que no puedo ayudarte directamente. ¿Hay otra forma en la que pueda ser útil?';
        }
        break;
      }
    }

    if (!safeMessage) {
      safeMessage = 'He detectado que esta conversación puede requerir atención especial. ¿Podrías reformular tu solicitud?';
    }

    return {
      content: safeMessage,
      type: 'safe_response',
      redirectTo,
      originalRisk: risks,
      _pipeline: PipelineType.RISK,
      _timestamp: Date.now()
    };
  }

  private async logRiskEvent(context: PipelineContext, filterResult: any, action: string) {
    try {
      // Log to isabella_interactions (existing table)
      await supabase.from('isabella_interactions').insert({
        user_id: context.userId || '00000000-0000-0000-0000-000000000000',
        message_role: 'system',
        content: `RISK_EVENT: ${action} | ${context.input.substring(0, 200)}`,
        ethical_flag: action,
        metadata: {
          filter_result: filterResult,
          pipeline: PipelineType.RISK,
          session_id: context.sessionId
        }
      });

      if (filterResult.confidence > 0.9) {
        await this.alertHumanSupervisor(context, filterResult);
      }
    } catch (error) {
      console.error('[Pipeline B] Log error:', error);
    }
  }

  private async alertHumanSupervisor(context: PipelineContext, filterResult: any) {
    try {
      // Log critical alerts to audit_logs (existing table)
      await supabase.from('isabella_interactions').insert({
        user_id: context.userId || '00000000-0000-0000-0000-000000000000',
        message_role: 'system',
        content: `CRITICAL_ALERT: Risk confidence ${filterResult.confidence}`,
        ethical_flag: 'CRITICAL_RISK',
        metadata: {
          alert_type: 'CRITICAL_RISK',
          details: {
            filterResult,
            input: context.input.substring(0, 200),
            timestamp: Date.now()
          }
        }
      });
    } catch (error) {
      console.error('[Pipeline B] Alert error:', error);
    }
  }
}

// ============================================================================
// ORQUESTADOR DE PIPELINES
// ============================================================================

export class PipelineOrchestrator {
  private static instance: PipelineOrchestrator;
  private normalPipeline: NormalPipeline;
  private riskPipeline: RiskPipeline;
  private metrics: {
    normalRequests: number;
    riskRequests: number;
    normalLatency: number[];
    riskLatency: number[];
  };

  private constructor() {
    this.normalPipeline = new NormalPipeline();
    this.riskPipeline = new RiskPipeline();
    this.metrics = {
      normalRequests: 0,
      riskRequests: 0,
      normalLatency: [],
      riskLatency: []
    };
  }

  static getInstance(): PipelineOrchestrator {
    if (!PipelineOrchestrator.instance) {
      PipelineOrchestrator.instance = new PipelineOrchestrator();
    }
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
    const avgNormalLatency = this.metrics.normalLatency.length > 0
      ? this.metrics.normalLatency.reduce((a, b) => a + b, 0) / this.metrics.normalLatency.length
      : 0;

    const avgRiskLatency = this.metrics.riskLatency.length > 0
      ? this.metrics.riskLatency.reduce((a, b) => a + b, 0) / this.metrics.riskLatency.length
      : 0;

    return {
      normalRequests: this.metrics.normalRequests,
      riskRequests: this.metrics.riskRequests,
      avgNormalLatency,
      avgRiskLatency,
      totalRequests: this.metrics.normalRequests + this.metrics.riskRequests
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const pipelineOrchestrator = PipelineOrchestrator.getInstance();
export { NormalPipeline, RiskPipeline };
