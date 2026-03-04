// ============================================================================
// TAMV Unified API v3.0.0-Sovereign - Response Utilities
// Standardized JSON responses with Horus Tower™ observability
// ============================================================================

import type { TAMVResponse, TAMVError, ResponseMeta, AuditLog } from './types.ts';
import { createLogger, buildLogContext } from './logger.ts';

const VERSION = '3.0.0-Sovereign';

// ============================================================================
// CORS Headers
// ============================================================================

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-tamv-trace-id, x-tamv-session-id',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
};

// ============================================================================
// Security Headers
// ============================================================================

export const securityHeaders = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

// ============================================================================
// Response Builders
// ============================================================================

export function createMeta(
  traceId: string,
  durationMs: number
): ResponseMeta {
  return {
    trace_id: traceId,
    timestamp: new Date().toISOString(),
    version: VERSION,
    request_duration_ms: durationMs,
  };
}

export function jsonOk<T>(
  data: T,
  status: number = 200,
  meta?: ResponseMeta
): Response {
  const response: TAMVResponse<T> = {
    success: true,
    data,
    meta: meta || createMeta(crypto.randomUUID(), 0),
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      ...corsHeaders,
      ...securityHeaders,
      'X-TAMV-Trace-Id': response.meta.trace_id,
    },
  });
}

export function jsonError(
  message: string,
  status: number = 400,
  code?: string,
  details?: Record<string, unknown>,
  meta?: ResponseMeta
): Response {
  const error: TAMVError = {
    code: code || getErrorCode(status),
    message,
    details,
  };

  const response: TAMVResponse<never> = {
    success: false,
    error,
    meta: meta || createMeta(crypto.randomUUID(), 0),
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      ...corsHeaders,
      ...securityHeaders,
      'X-TAMV-Trace-Id': response.meta.trace_id,
    },
  });
}

// ============================================================================
// Error Codes Mapping
// ============================================================================

function getErrorCode(status: number): string {
  const codes: Record<number, string> = {
    400: 'INVALID_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'VALIDATION_ERROR',
    429: 'RATE_LIMITED',
    500: 'INTERNAL_ERROR',
    503: 'SERVICE_UNAVAILABLE',
  };
  return codes[status] || 'UNKNOWN_ERROR';
}

// ============================================================================
// Standard Error Responses
// ============================================================================

export const errors = {
  unauthorized: (message = 'Authentication required') =>
    jsonError(message, 401, 'UNAUTHORIZED'),
  
  forbidden: (message = 'Insufficient permissions') =>
    jsonError(message, 403, 'FORBIDDEN'),
  
  notFound: (resource = 'Resource') =>
    jsonError(`${resource} not found`, 404, 'NOT_FOUND'),
  
  badRequest: (message = 'Invalid request', details?: Record<string, unknown>) =>
    jsonError(message, 400, 'INVALID_REQUEST', details),
  
  validation: (message = 'Validation failed', details?: Record<string, unknown>) =>
    jsonError(message, 422, 'VALIDATION_ERROR', details),
  
  rateLimited: (retryAfter = 60) =>
    jsonError('Rate limit exceeded', 429, 'RATE_LIMITED', { retry_after: retryAfter }),
  
  internal: (message = 'Internal server error') =>
    jsonError(message, 500, 'INTERNAL_ERROR'),
  
  quantumValidation: (message = 'Quantum signature validation failed') =>
    jsonError(message, 400, 'QUANTUM_VALIDATION_FAILED'),
  
  eoctViolation: (message = 'Emotional context tracking violation') =>
    jsonError(message, 403, 'EOCT_VIOLATION'),
};

// ============================================================================
// Request Handler Wrapper
// ============================================================================

export interface HandlerContext {
  request: Request;
  url: URL;
  supabase: any;
  userId: string | null;
  traceId: string;
  spanId: string;
  startTime: number;
}

export type RequestHandler = (ctx: HandlerContext) => Promise<Response>;

export function createHandler(
  serviceName: string,
  pipeline: 'A' | 'B' | 'CCP',
  handler: RequestHandler
): (req: Request) => Promise<Response> {
  const logger = createLogger(serviceName);

  return async (request: Request): Promise<Response> => {
    const startTime = performance.now();
    const traceId = request.headers.get('X-TAMV-Trace-Id') || crypto.randomUUID();
    const spanId = crypto.randomUUID();

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Initialize Supabase client
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey, {
        global: {
          headers: {
            Authorization: request.headers.get('Authorization') || '',
          },
        },
      });

      // Get user from auth header
      let userId: string | null = null;
      const authHeader = request.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        try {
          const { data } = await supabase.auth.getUser();
          userId = data.user?.id || null;
        } catch {
          // Invalid token
        }
      }

      const context: HandlerContext = {
        request,
        url: new URL(request.url),
        supabase,
        userId,
        traceId,
        spanId,
        startTime,
      };

      // Execute handler
      const response = await handler(context);

      // Log success
      const duration = Math.round(performance.now() - startTime);
      logger.info(`${request.method} ${request.url} - ${response.status}`,
        buildLogContext(request, serviceName, pipeline),
        { status: response.status, duration_ms: duration }
      );

      return response;

    } catch (error) {
      // Log error
      const duration = Math.round(performance.now() - startTime);
      logger.error(
        `Error handling request: ${error instanceof Error ? error.message : 'Unknown error'}`,
        buildLogContext(request, serviceName, pipeline),
        error instanceof Error ? error : undefined,
        { duration_ms: duration }
      );

      return jsonError(
        error instanceof Error ? error.message : 'Internal server error',
        500,
        'INTERNAL_ERROR',
        undefined,
        createMeta(traceId, duration)
      );
    }
  };
}

// ============================================================================
// Import helper for Supabase client
// ============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ============================================================================
// Validation Helpers
// ============================================================================

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export function validateAmount(amount: number): boolean {
  return typeof amount === 'number' && amount > 0 && isFinite(amount);
}

// ============================================================================
// Pagination Helpers
// ============================================================================

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export function getPagination(url: URL): PaginationParams {
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

export function createPaginatedResponse<T>(
  items: T[],
  total: number,
  pagination: PaginationParams,
  traceId: string
): Response {
  const { page, limit } = pagination;
  const totalPages = Math.ceil(total / limit);

  return jsonOk({
    items,
    pagination: {
      page,
      limit,
      total,
      total_pages: totalPages,
      has_next: page < totalPages,
      has_prev: page > 1,
    },
  }, 200, createMeta(traceId, 0));
}

// ============================================================================
// Rate Limiting Helper
// ============================================================================

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export function createRateLimiter(config: RateLimitConfig) {
  const requests = new Map<string, number[]>();

  return {
    check: (key: string): { allowed: boolean; retryAfter?: number } => {
      const now = Date.now();
      const windowStart = now - config.windowMs;
      
      // Get existing requests for this key
      const timestamps = requests.get(key) || [];
      
      // Filter to current window
      const validTimestamps = timestamps.filter(t => t > windowStart);
      
      if (validTimestamps.length >= config.maxRequests) {
        const oldestRequest = validTimestamps[0];
        const retryAfter = Math.ceil((oldestRequest + config.windowMs - now) / 1000);
        return { allowed: false, retryAfter };
      }
      
      // Add current request
      validTimestamps.push(now);
      requests.set(key, validTimestamps);
      
      return { allowed: true };
    },
  };
}
