// ============================================================================
// TAMV Unified API v3.0.0-Sovereign - Structured Logger
// Horus Tower™ Observability - Dimension 1: Logs
// ============================================================================

import type { AuditLog, EmotionVector, TAMVRequest } from './types.ts';

export interface LogContext {
  trace_id: string;
  span_id: string;
  user_id?: string;
  session_id?: string;
  module: string;
  pipeline: 'A' | 'B' | 'CCP';
}

export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
  message: string;
  context: LogContext;
  timestamp: string;
  metadata?: Record<string, unknown>;
  error?: Error;
}

// ============================================================================
// EOCT™ - Emotional Context Tracking
// ============================================================================

export function generateEOCTHash(
  userId: string,
  emotionVector: EmotionVector,
  context: string
): string {
  const data = JSON.stringify({
    user_id: userId,
    emotions: emotionVector,
    context,
    ts: Date.now()
  });
  
  // Simple hash for MVP - in production use SHA3-256
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

export function detectDominantEmotion(vector: EmotionVector): string {
  const entries = Object.entries(vector);
  const dominant = entries.reduce((a, b) => a[1] > b[1] ? a : b);
  return dominant[0];
}

// ============================================================================
// Structured Logger
// ============================================================================

class TAMVLogger {
  private serviceName: string;
  private version: string = '3.0.0-Sovereign';

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  private formatLogEntry(entry: LogEntry): string {
    const logData = {
      ...entry,
      service: this.serviceName,
      version: this.version,
      timestamp: new Date().toISOString(),
    };

    if (entry.error) {
      logData.error = {
        name: entry.error.name,
        message: entry.error.message,
        stack: entry.error.stack,
      };
    }

    return JSON.stringify(logData);
  }

  debug(message: string, context: LogContext, metadata?: Record<string, unknown>): void {
    console.debug(this.formatLogEntry({
      level: 'debug',
      message,
      context,
      timestamp: new Date().toISOString(),
      metadata,
    }));
  }

  info(message: string, context: LogContext, metadata?: Record<string, unknown>): void {
    console.info(this.formatLogEntry({
      level: 'info',
      message,
      context,
      timestamp: new Date().toISOString(),
      metadata,
    }));
  }

  warn(message: string, context: LogContext, metadata?: Record<string, unknown>): void {
    console.warn(this.formatLogEntry({
      level: 'warn',
      message,
      context,
      timestamp: new Date().toISOString(),
      metadata,
    }));
  }

  error(message: string, context: LogContext, error?: Error, metadata?: Record<string, unknown>): void {
    console.error(this.formatLogEntry({
      level: 'error',
      message,
      context,
      timestamp: new Date().toISOString(),
      error,
      metadata,
    }));
  }

  critical(message: string, context: LogContext, error?: Error, metadata?: Record<string, unknown>): void {
    console.error(this.formatLogEntry({
      level: 'critical',
      message,
      context,
      timestamp: new Date().toISOString(),
      error,
      metadata,
    }));
  }

  // ============================================================================
  // Audit Logging - MSR Integration
  // ============================================================================

  async logAudit(
    supabase: any,
    log: Omit<AuditLog, 'log_id' | 'timestamp'>
  ): Promise<void> {
    const auditLog: AuditLog = {
      ...log,
      log_id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    try {
      // Store in MSR (Memory State Rules) system
      await supabase.from('msr_events').insert({
        actor_id: log.user_id,
        action: log.action,
        domain: log.module,
        resource: log.resource,
        status: log.status,
        risk_level: log.risk_level,
        evidence_hash: await this.generateEvidenceHash(auditLog),
        metadata: {
          ...log.metadata,
          trace_id: log.trace_id,
          span_id: log.span_id,
          duration_ms: log.duration_ms,
        },
      });
    } catch (err) {
      console.error('Failed to write audit log:', err);
    }
  }

  private async generateEvidenceHash(log: AuditLog): Promise<string> {
    const data = JSON.stringify({
      trace_id: log.trace_id,
      user_id: log.user_id,
      action: log.action,
      resource: log.resource,
      timestamp: log.timestamp,
    });
    
    // Use Web Crypto API for SHA-256
    const encoder = new TextEncoder();
    const buffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

// ============================================================================
// Factory
// ============================================================================

export function createLogger(serviceName: string): TAMVLogger {
  return new TAMVLogger(serviceName);
}

// ============================================================================
// Request Context Builder
// ============================================================================

export function buildLogContext(
  request: Request,
  module: string,
  pipeline: 'A' | 'B' | 'CCP'
): LogContext {
  const traceId = request.headers.get('X-TAMV-Trace-Id') || crypto.randomUUID();
  const spanId = crypto.randomUUID();
  
  // Extract user info from JWT if available
  let userId: string | undefined;
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.sub;
    } catch {
      // Invalid token, continue without user
    }
  }

  return {
    trace_id: traceId,
    span_id: spanId,
    user_id: userId,
    session_id: request.headers.get('X-TAMV-Session-Id') || undefined,
    module,
    pipeline,
  };
}

// ============================================================================
// Metrics Helper
// ============================================================================

export interface ServiceMetrics {
  requests_total: number;
  requests_failed: number;
  request_duration_ms: number;
  active_connections: number;
}

export function recordMetric(
  name: string,
  value: number,
  labels: Record<string, string> = {}
): void {
  console.log(JSON.stringify({
    type: 'metric',
    name,
    value,
    labels,
    timestamp: new Date().toISOString(),
  }));
}
