// ============================================================================
// TAMV Orchestrator v3.0.0-Sovereign
// CCP - Control & Coordination (Port 8200)
// Health Checks & Service Discovery
// ============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import {
  createHandler,
  jsonOk,
  jsonError,
  errors,
  createLogger,
  buildLogContext,
} from '../_shared/index.ts';

// ============================================================================
// Service Configuration
// ============================================================================

const SERVICE_NAME = 'orchestrator';
const SERVICE_PORT = 8200;
const PIPELINE = 'CCP' as const;
const VERSION = '3.0.0-Sovereign';

// Registered services
const SERVICES = [
  { name: 'auth-service-v3', port: 8001, pipeline: 'A', critical: true },
  { name: 'security-service', port: 8002, pipeline: 'A', critical: true },
  { name: 'transaction-service', port: 8004, pipeline: 'A', critical: true },
  { name: 'payment-service', port: 8005, pipeline: 'A', critical: true },
  { name: 'ai-generation-service', port: 8101, pipeline: 'B', critical: false },
  { name: 'voice-service', port: 8105, pipeline: 'B', critical: false },
  { name: 'policy-engine', port: 8201, pipeline: 'CCP', critical: true },
  { name: 'governance-service', port: 8202, pipeline: 'CCP', critical: false },
];

// Health check cache
const healthCache = new Map<string, { status: string; timestamp: number }>();
const HEALTH_CACHE_TTL = 30000; // 30 seconds

// ============================================================================
// Logger
// ============================================================================

const logger = createLogger(SERVICE_NAME);

// ============================================================================
// Health Check
// ============================================================================

interface ServiceHealth {
  service: string;
  port: number;
  pipeline: string;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  response_time_ms: number;
  version?: string;
  last_check: string;
}

async function checkServiceHealth(service: typeof SERVICES[0]): Promise<ServiceHealth> {
  const start = performance.now();
  
  try {
    // In production: Make actual HTTP call to service health endpoint
    // For MVP: Simulate health check
    const response = await fetch(`http://localhost:${service.port}/health`, {
      method: 'GET',
      // Short timeout for health checks
      signal: AbortSignal.timeout(5000),
    }).catch(() => null);

    const responseTime = Math.round(performance.now() - start);

    if (!response || !response.ok) {
      return {
        service: service.name,
        port: service.port,
        pipeline: service.pipeline,
        status: 'unhealthy',
        response_time_ms: responseTime,
        last_check: new Date().toISOString(),
      };
    }

    const data = await response.json().catch(() => ({}));

    return {
      service: service.name,
      port: service.port,
      pipeline: service.pipeline,
      status: data.status === 'healthy' ? 'healthy' : 'degraded',
      response_time_ms: responseTime,
      version: data.version,
      last_check: new Date().toISOString(),
    };

  } catch {
    return {
      service: service.name,
      port: service.port,
      pipeline: service.pipeline,
      status: 'unknown',
      response_time_ms: Math.round(performance.now() - start),
      last_check: new Date().toISOString(),
    };
  }
}

// ============================================================================
// Main Handler
// ============================================================================

const handler = createHandler(SERVICE_NAME, PIPELINE, async (ctx) => {
  const { request, url, supabase, userId, traceId } = ctx;
  const path = url.pathname.replace('/orchestrator', '');

  // GET /health
  if (path === '/health' && request.method === 'GET') {
    return jsonOk({
      service: SERVICE_NAME,
      version: VERSION,
      pipeline: PIPELINE,
      port: SERVICE_PORT,
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  }

  // GET /metrics - Prometheus-style metrics
  if (path === '/metrics' && request.method === 'GET') {
    // Check all services health
    const healthChecks = await Promise.all(
      SERVICES.map(s => checkServiceHealth(s))
    );

    const healthy = healthChecks.filter(h => h.status === 'healthy').length;
    const degraded = healthChecks.filter(h => h.status === 'degraded').length;
    const unhealthy = healthChecks.filter(h => h.status === 'unhealthy').length;

    const metrics = [
      '# HELP tamv_services_total Total number of services',
      '# TYPE tamv_services_total gauge',
      `tamv_services_total ${SERVICES.length}`,
      '',
      '# HELP tamv_services_healthy Number of healthy services',
      '# TYPE tamv_services_healthy gauge',
      `tamv_services_healthy ${healthy}`,
      '',
      '# HELP tamv_services_degraded Number of degraded services',
      '# TYPE tamv_services_degraded gauge',
      `tamv_services_degraded ${degraded}`,
      '',
      '# HELP tamv_services_unhealthy Number of unhealthy services',
      '# TYPE tamv_services_unhealthy gauge',
      `tamv_services_unhealthy ${unhealthy}`,
      '',
      '# HELP tamv_service_response_time_ms Service response time in milliseconds',
      '# TYPE tamv_service_response_time_ms gauge',
      ...healthChecks.map(h => 
        `tamv_service_response_time_ms{service="${h.service}"} ${h.response_time_ms}`
      ),
    ].join('\n');

    return new Response(metrics, {
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // GET /services - List all services
  if (path === '/services' && request.method === 'GET') {
    return jsonOk({
      services: SERVICES.map(s => ({
        name: s.name,
        port: s.port,
        pipeline: s.pipeline,
        critical: s.critical,
        health_endpoint: `/health`,
      })),
    });
  }

  // GET /health/global - Global health status
  if (path === '/health/global' && request.method === 'GET') {
    const healthChecks = await Promise.all(
      SERVICES.map(s => checkServiceHealth(s))
    );

    const byPipeline = {
      A: healthChecks.filter(h => h.pipeline === 'A'),
      B: healthChecks.filter(h => h.pipeline === 'B'),
      CCP: healthChecks.filter(h => h.pipeline === 'CCP'),
    };

    const isHealthy = (checks: ServiceHealth[]) => 
      checks.every(c => c.status === 'healthy' || !SERVICES.find(s => s.name === c.service)?.critical);

    const overallStatus = 
      isHealthy(byPipeline.A) && isHealthy(byPipeline.CCP) ? 'healthy' :
      isHealthy(byPipeline.A) ? 'degraded' : 'unhealthy';

    return jsonOk({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services: {
        total: SERVICES.length,
        healthy: healthChecks.filter(h => h.status === 'healthy').length,
        degraded: healthChecks.filter(h => h.status === 'degraded').length,
        unhealthy: healthChecks.filter(h => h.status === 'unhealthy').length,
      },
      by_pipeline: {
        A: {
          status: isHealthy(byPipeline.A) ? 'healthy' : 'unhealthy',
          services: byPipeline.A,
        },
        B: {
          status: isHealthy(byPipeline.B) ? 'healthy' : 'degraded',
          services: byPipeline.B,
        },
        CCP: {
          status: isHealthy(byPipeline.CCP) ? 'healthy' : 'unhealthy',
          services: byPipeline.CCP,
        },
      },
    });
  }

  // POST /deploy - Trigger deployment (admin only)
  if (path === '/deploy' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profile?.role !== 'admin') {
      return errors.forbidden('Admin role required');
    }

    const body = await request.json().catch(() => ({}));
    const { service, version } = body;

    if (!service || !version) {
      return errors.badRequest('service and version required');
    }

    // Log deployment
    await supabase.from('deployments').insert({
      service,
      version,
      deployed_by: userId,
      status: 'pending',
    });

    logger.info('Deployment triggered', buildLogContext(request, SERVICE_NAME, PIPELINE), {
      service,
      version,
      user_id: userId,
    });

    return jsonOk({
      message: 'Deployment initiated',
      service,
      version,
      status: 'pending',
    }, 202);
  }

  // POST /rollback - Rollback service (admin only)
  if (path === '/rollback' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profile?.role !== 'admin') {
      return errors.forbidden('Admin role required');
    }

    const body = await request.json().catch(() => ({}));
    const { service, to_version } = body;

    logger.info('Rollback triggered', buildLogContext(request, SERVICE_NAME, PIPELINE), {
      service,
      to_version,
      user_id: userId,
    });

    return jsonOk({
      message: 'Rollback initiated',
      service,
      to_version,
      status: 'pending',
    }, 202);
  }

  // Route not found
  return errors.notFound('Endpoint');
});

// ============================================================================
// Start Server
// ============================================================================

serve(handler);

console.log(`🎛️ ${SERVICE_NAME} v${VERSION} running on port ${SERVICE_PORT} [Pipeline ${PIPELINE}]`);
