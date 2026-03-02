/**
 * TAMV - Sistema de Doble Pipeline Operativo
 * QC-TAMV-IA-01 Implementation
 * 
 * Este módulo implementa el sistema de doble pipeline según el documento maestro:
 * - Pipeline A: Flujo Normal (input válido → contextualización → inferencia → respuesta)
 * - Pipeline B: Flujo de Riesgo (input sospechoso → análisis profundo → respuesta segura o bloqueo)
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

// Configuración por defecto
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

  /**
   * Ejecuta el flujo normal:
   * Input válido → Contextualización → Inferencia → Respuesta
   */
  async execute(context: PipelineContext): Promise<PipelineResult> {
    const startTime = Date.now();
    console.log('[Pipeline A] Starting normal flow...');

    try {
      // Step 1: Validación rápida de input
      if (!context.input || context.input.trim().length === 0) {
        throw new Error('Empty input not allowed');
      }

      if (context.input.length > 10000) {
        throw new Error('Input exceeds maximum length');
      }

      // Step 2: Filtrado rápido (solo capas críticas)
      const filterResult = await octupleFilter.filter(context);
      
      // Si el filtro indica riesgo, redirigir a Pipeline B
      if (filterResult.decision === FilterDecision.REDIRECT) {
        console.log('[Pipeline A] Redirecting to Pipeline B...');
        const riskPipeline = new RiskPipeline(this.config);
        return await riskPipeline.execute(context);
      }

      // Si el filtro indica bloqueo, retornar error
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

      // Step 3: Contextualización (obtener contexto adicional)
      const enrichedContext = await this.enrichContext(context);

      // Step 4: Inferencia (llamada a TAMVAI)
      const inferenceResult = await this.performInference(enrichedContext);

      // Step 5: Post-procesamiento
      const processedResult = this.postProcess(inferenceResult);

      const latency = Date.now() - startTime;
      console.log(`[Pipeline A] Completed in ${latency}ms`);

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

      // Fallback si está habilitado
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

  /**
   * Enriches context with additional data
   */
  private async enrichContext(context: PipelineContext): Promise<PipelineContext> {
    const enriched = { ...context };

    try {
      // Get recent conversation history
      if (context.sessionId) {
        const { data: history } = await supabase
          .from('isabella_conversations')
          .select('messages')
          .eq('session_id', context.sessionId)
          .from('isabella_interactions')
          .select('content, message_role, metadata')
          .eq('user_id', context.userId || '')
          .order('created_at', { ascending: false })
          .limit(10);

        if (history && history.length > 0) {
          enriched.previousMessages = history[0].messages as any[];
        }
      }

      // Get user preferences
      if (context.userId) {
        const { data: userPrefs } = await supabase
          .from('user_preferences')
      // Get user profile as preferences proxy
      if (context.userId) {
        const { data: userPrefs } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', context.userId)
          .single();

        if (userPrefs) {
          enriched.metadata = {
            ...enriched.metadata,
            userPreferences: userPrefs
          };
        }
      }
    } catch (error) {
      console.error('[Pipeline A] Context enrichment error:', error);
    }

    return enriched;
  }

  /**
   * Performs inference using TAMVAI
   */
  private async performInference(context: PipelineContext): Promise<any> {
    // Call to TAMVAI API (simulated)
    // In production, this would call the actual TAMVAI endpoint
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

  /**
   * Post-processes the inference result
   */
  private postProcess(result: any): any {
    // Add metadata
    return {
      ...result,
      _pipeline: PipelineType.NORMAL,
      _timestamp: Date.now()
    };
  }

  /**
   * Fallback handler
   */
  private fallback(context: PipelineContext, error: any): PipelineResult {
    console.log('[Pipeline A] Executing fallback...');
    
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

  /**
   * Ejecuta el flujo de riesgo:
   * Input sospechoso → Análisis profundo → Respuesta segura o bloqueo
   */
  async execute(context: PipelineContext): Promise<PipelineResult> {
    const startTime = Date.now();
    console.log('[Pipeline B] Starting risk flow...');

    try {
      // Step 1: Análisis profundo (todas las capas de filtrado)
      const deepFilterResult = await octupleFilter.filter(context);

      // Step 2: Si el análisis profundo indica bloqueo, ejecutar bloqueo seguro
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

      // Step 3: Generar respuesta segura
      const safeResponse = await this.generateSafeResponse(context, deepFilterResult);

      // Step 4: Respuesta segura
      const latency = Date.now() - startTime;
      console.log(`[Pipeline B] Completed in ${latency}ms`);

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
      const latency = Date.now() - startTime;
      console.error('[Pipeline B] Error:', error);

      // En caso de error, siempre bloquear para seguridad
      return {
        pipeline: PipelineType.RISK,
        success: false,
        error: 'Risk analysis failed - defaulting to safe response',
        latency,
        metadata: {
          filterDecision: FilterDecision.BLOCK,
          confidence: 1.0,
          layer: 8
        }
      };
    }
  }

  /**
   * Generates a safe response based on detected risks
   */
  private generateSafeResponse(context: PipelineContext, filterResult: any): any {
    // Determine response based on risk category
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
            safeMessage = 'Estoy preocupado por ti. Si estás pensando en hacerte daño, por favor busca ayuda profesional. ¿Te gustaría que te proporcione recursos de apoyo?';
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
      safeMessage = 'He detectado que esta conversación puede requerir atención especial. ¿Podrías reformular tu solicitud de otra manera?';
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

  /**
   * Logs risk events for auditing
   */
  private async logRiskEvent(
    context: PipelineContext, 
    filterResult: any, 
    action: string
  ) {
    try {
      await supabase.from('isabella_risk_logs').insert({
        user_id: context.userId,
        session_id: context.sessionId,
        input_preview: context.input.substring(0, 200),
        action,
        filter_result: filterResult as any,
        pipeline: PipelineType.RISK,
      await supabase.from('isabella_interactions').insert({
        user_id: context.userId || '',
        message_role: 'system',
        content: `RISK_LOG: ${action} - ${context.input.substring(0, 200)}`,
        metadata: { filter_result: filterResult, pipeline: PipelineType.RISK, session_id: context.sessionId } as any,
        ethical_flag: 'risk_detected',
        created_at: new Date().toISOString()
      });

      // Alert human supervisor if critical
      if (filterResult.confidence > 0.9) {
        await this.alertHumanSupervisor(context, filterResult);
      }
    } catch (error) {
      console.error('[Pipeline B] Log error:', error);
    }
  }

  /**
   * Alerts human supervisor for critical risks
   */
  private async alertHumanSupervisor(context: PipelineContext, filterResult: any) {
    try {
      await supabase.from('isabella_alerts').insert({
        alert_type: 'CRITICAL_RISK',
        user_id: context.userId,
        session_id: context.sessionId,
        details: {
          filterResult: filterResult,
          input: context.input.substring(0, 200),
          timestamp: Date.now()
        },
        status: 'pending',
      await supabase.from('isabella_interactions').insert({
        user_id: context.userId || '',
        message_role: 'system',
        content: `ALERT: CRITICAL_RISK - ${context.input.substring(0, 200)}`,
        metadata: { alert_type: 'CRITICAL_RISK', session_id: context.sessionId, filterResult, status: 'pending' } as any,
        ethical_flag: 'critical_risk',
        created_at: new Date().toISOString()
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

  /**
   * Ejecuta el pipeline apropiado basado en el contexto
   */
  async execute(context: PipelineContext): Promise<PipelineResult> {
    // Determinar qué pipeline usar basado en el análisis rápido
    const quickFilter = await octupleFilter.filter(context);
    
    // Si el riesgo es bajo, usar Pipeline A
    if (quickFilter.decision === FilterDecision.ALLOW) {
      this.metrics.normalRequests++;
      const result = await this.normalPipeline.execute(context);
      this.metrics.normalLatency.push(result.latency);
      return result;
    }

    // Si el riesgo es medio o alto, usar Pipeline B
    this.metrics.riskRequests++;
    const result = await this.riskPipeline.execute(context);
    this.metrics.riskLatency.push(result.latency);
    return result;
  }

  /**
   * Obtiene métricas del sistema
   */
  getMetrics() {
    const avgNormalLatency = this.metrics.normalLatency.length > 0
      ? this.metrics.normalLatency.reduce((a, b) => a + b, 0) / this.metrics.normalLatency.length
      : 0;

    const avgRiskLatency = this.metrics.riskLatency.length > 0
      ? this.metrics.riskLatency.reduce((a, b) => a + b, 0) / this.metrics.riskLatency.length
      : 0;

    return {
      totalNormalRequests: this.metrics.normalRequests,
      totalRiskRequests: this.metrics.riskRequests,
      averageNormalLatency: avgNormalLatency,
      averageRiskLatency: avgRiskLatency,
      riskRatio: this.metrics.riskRequests / 
        (this.metrics.normalRequests + this.metrics.riskRequests || 1)
    };
  }

  /**
   * Reinicia las métricas
   */
  resetMetrics() {
    this.metrics = {
      normalRequests: 0,
      riskRequests: 0,
      normalLatency: [],
      riskLatency: []
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const pipelineOrchestrator = PipelineOrchestrator.getInstance();
export { NormalPipeline, RiskPipeline };
