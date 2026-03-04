// ============================================================================
// TAMV Unified API v3.0.0-Sovereign - Distributed Tracing
// OpenTelemetry-compatible tracing for Horus Tower™
// ============================================================================

import type { LogContext } from './logger.ts';

// ============================================================================
// Trace Context Types (W3C Standard)
// ============================================================================

export interface TraceContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  sampled: boolean;
}

export interface Span {
  spanId: string;
  traceId: string;
  parentSpanId?: string;
  name: string;
  startTime: number;
  endTime?: number;
  attributes: Record<string, any>;
  status: 'unset' | 'ok' | 'error';
  events: SpanEvent[];
}

export interface SpanEvent {
  name: string;
  timestamp: number;
  attributes: Record<string, any>;
}

// ============================================================================
// Tracer
// ============================================================================

class TAMVTracer {
  private serviceName: string;
  private spans: Map<string, Span> = new Map();
  private completedSpans: Span[] = [];

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  /**
   * Extract trace context from request headers (W3C format)
   */
  extractContext(headers: Headers): TraceContext {
    const traceParent = headers.get('traceparent');
    
    if (traceParent) {
      // Parse W3C traceparent: version-traceId-parentId-flags
      const parts = traceParent.split('-');
      if (parts.length === 4) {
        return {
          traceId: parts[1],
          spanId: parts[2],
          sampled: parts[3] === '01',
        };
      }
    }

    // Generate new context
    return {
      traceId: this.generateId(32),
      spanId: this.generateId(16),
      sampled: true,
    };
  }

  /**
   * Inject trace context into headers (W3C format)
   */
  injectContext(context: TraceContext, headers: Headers): void {
    const traceParent = `00-${context.traceId}-${context.spanId}-01`;
    headers.set('traceparent', traceParent);
  }

  /**
   * Start a new span
   */
  startSpan(
    name: string,
    parentContext?: TraceContext,
    attributes: Record<string, any> = {}
  ): Span {
    const spanId = this.generateId(16);
    const span: Span = {
      spanId,
      traceId: parentContext?.traceId || this.generateId(32),
      parentSpanId: parentContext?.spanId,
      name: `${this.serviceName}.${name}`,
      startTime: performance.now(),
      attributes: {
        'service.name': this.serviceName,
        ...attributes,
      },
      status: 'unset',
      events: [],
    };

    this.spans.set(spanId, span);
    return span;
  }

  /**
   * End a span
   */
  endSpan(spanId: string, status: 'ok' | 'error' = 'ok'): void {
    const span = this.spans.get(spanId);
    if (!span) return;

    span.endTime = performance.now();
    span.status = status;
    
    this.completedSpans.push(span);
    this.spans.delete(spanId);
  }

  /**
   * Add event to span
   */
  addEvent(spanId: string, name: string, attributes: Record<string, any> = {}): void {
    const span = this.spans.get(spanId);
    if (!span) return;

    span.events.push({
      name,
      timestamp: Date.now(),
      attributes,
    });
  }

  /**
   * Get span context for propagation
   */
  getSpanContext(spanId: string): TraceContext | undefined {
    const span = this.spans.get(spanId);
    if (!span) return undefined;

    return {
      traceId: span.traceId,
      spanId: span.spanId,
      sampled: true,
    };
  }

  /**
   * Export completed spans (OpenTelemetry format)
   */
  exportSpans(): any[] {
    const spans = [...this.completedSpans];
    this.completedSpans = [];

    return spans.map(span => ({
      traceId: span.traceId,
      spanId: span.spanId,
      parentSpanId: span.parentSpanId,
      name: span.name,
      kind: 1, // SERVER
      startTimeUnixNano: Math.round(span.startTime * 1e6),
      endTimeUnixNano: span.endTime ? Math.round(span.endTime * 1e6) : undefined,
      attributes: Object.entries(span.attributes).map(([key, value]) => ({
        key,
        value: { stringValue: String(value) },
      })),
      status: {
        code: span.status === 'ok' ? 1 : span.status === 'error' ? 2 : 0,
      },
      events: span.events.map(event => ({
        name: event.name,
        timeUnixNano: Math.round(event.timestamp * 1e6),
        attributes: Object.entries(event.attributes).map(([key, value]) => ({
          key,
          value: { stringValue: String(value) },
        })),
      })),
    }));
  }

  /**
   * Generate hex ID
   */
  private generateId(length: number): string {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * 16)];
    }
    return result;
  }
}

// ============================================================================
// Factory
// ============================================================================

export function createTracer(serviceName: string): TAMVTracer {
  return new TAMVTracer(serviceName);
}

// ============================================================================
// Middleware for automatic tracing
// ============================================================================

export interface TracedRequest {
  span: Span;
  context: TraceContext;
  end: (status?: 'ok' | 'error') => void;
}

export function withTracing(
  serviceName: string,
  handler: (req: Request, traced: TracedRequest) => Promise<Response>
): (req: Request) => Promise<Response> {
  const tracer = createTracer(serviceName);

  return async (request: Request): Promise<Response> => {
    const parentContext = tracer.extractContext(request.headers);
    const span = tracer.startSpan('request', parentContext, {
      'http.method': request.method,
      'http.url': request.url,
      'http.user_agent': request.headers.get('user-agent') || 'unknown',
    });

    const traced: TracedRequest = {
      span,
      context: {
        traceId: span.traceId,
        spanId: span.spanId,
        parentSpanId: parentContext.spanId,
        sampled: parentContext.sampled,
      },
      end: (status = 'ok') => tracer.endSpan(span.spanId, status),
    };

    try {
      const response = await handler(request, traced);
      
      tracer.addEvent(span.spanId, 'response', {
        'http.status_code': response.status,
      });
      
      traced.end(response.ok ? 'ok' : 'error');
      return response;
    } catch (error) {
      tracer.addEvent(span.spanId, 'error', {
        'error.type': error instanceof Error ? error.name : 'Unknown',
        'error.message': error instanceof Error ? error.message : String(error),
      });
      
      traced.end('error');
      throw error;
    }
  };
}

// ============================================================================
// Log correlation
// ============================================================================

export function addTraceToLogContext(
  logContext: LogContext,
  traceContext: TraceContext
): LogContext {
  return {
    ...logContext,
    trace_id: traceContext.traceId,
    span_id: traceContext.spanId,
  };
}
