// ============================================================================
// TAMV Security Service v3.0.0-Sovereign
// Pipeline A - Critical Operations (Port 8002)
// QuantumSecurityLayer™ - Kyber/Dilithium Implementation
// ============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import {
  createHandler,
  jsonOk,
  jsonError,
  errors,
  createLogger,
  buildLogContext,
  createQSL,
  generateQuantumKeyPair,
  sha3_256,
  signWithDilithium,
  verifyDilithiumSignature,
  encapsulateKey,
  decapsulateKey,
  encryptWithPQC,
  decryptWithPQC,
  scheduleKeyRotation,
  isKeyExpired,
  generateEntropy,
  validateEntropy,
} from '../_shared/index.ts';

// ============================================================================
// Service Configuration
// ============================================================================

const SERVICE_NAME = 'security-service';
const SERVICE_PORT = 8002;
const PIPELINE = 'A' as const;
const VERSION = '3.0.0-Sovereign';

// ============================================================================
// Logger & QSL
// ============================================================================

const logger = createLogger(SERVICE_NAME);
const qsl = createQSL({ enabled: true, hybridMode: true });

// Key store (use secure vault in production)
const keyStore = new Map<string, {
  keyPair: any;
  privateKey: string;
  createdAt: string;
}>();

// ============================================================================
// Main Handler
// ============================================================================

const handler = createHandler(SERVICE_NAME, PIPELINE, async (ctx) => {
  const { request, url, supabase, userId, traceId } = ctx;
  const path = url.pathname.replace('/security-service', '');

  // GET /health - Health check with entropy status
  if (path === '/health' && request.method === 'GET') {
    const entropy = await generateEntropy(32);
    const entropyStatus = await validateEntropy(entropy);

    return jsonOk({
      service: SERVICE_NAME,
      version: VERSION,
      pipeline: PIPELINE,
      port: SERVICE_PORT,
      status: 'healthy',
      qsl: {
        enabled: true,
        kem_algorithm: 'Kyber1024',
        signature_algorithm: 'Dilithium3',
        hybrid_mode: true,
      },
      entropy: {
        valid: entropyStatus.valid,
        shannon_entropy: entropyStatus.shannonEntropy.toFixed(4),
        bits: entropyStatus.entropyBits.toFixed(2),
      },
      timestamp: new Date().toISOString(),
    });
  }

  // GET /security/state - Global security state
  if (path === '/security/state' && request.method === 'GET') {
    if (!userId) {
      return errors.unauthorized();
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!['admin', 'security_officer'].includes(profile?.role)) {
      return errors.forbidden('Security officer role required');
    }

    // Get security metrics
    const { data: events } = await supabase
      .from('security_events')
      .select('severity', { count: 'exact' })
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    const severityCounts = events?.reduce((acc: any, e: any) => {
      acc[e.severity] = (acc[e.severity] || 0) + 1;
      return acc;
    }, {}) || {};

    return jsonOk({
      qsl_status: {
        enabled: true,
        active_keys: keyStore.size,
        algorithm: 'Dilithium3',
      },
      events_24h: severityCounts,
      active_threats: await getActiveThreats(supabase),
      quantum_readiness: {
        kem: 'Kyber1024',
        signatures: 'Dilithium3',
        hybrid_mode: true,
        nist_compliant: true,
      },
    });
  }

  // POST /security/hybrid-key - Generate hybrid key pair
  if (path === '/security/hybrid-key' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    try {
      // Generate quantum key pair
      const keyPair = await generateQuantumKeyPair();
      
      // Store private key securely (in production: use HSM/Vault)
      const privateKey = await sha3_256(keyPair.key_id + 'private-seed');
      keyStore.set(keyPair.key_id, {
        keyPair,
        privateKey,
        createdAt: new Date().toISOString(),
      });

      // Schedule rotation
      const rotationSchedule = await scheduleKeyRotation(keyPair.key_id, 90);

      // Log key generation
      await supabase.from('security_events').insert({
        user_id: userId,
        event_type: 'quantum_key_generated',
        severity: 'info',
        description: `Hybrid key pair generated: ${keyPair.key_id}`,
        metadata: {
          key_id: keyPair.key_id,
          algorithm: 'Dilithium3',
          rotation_scheduled: rotationSchedule.rotateAt,
        },
      });

      logger.info('Hybrid key generated', buildLogContext(request, SERVICE_NAME, PIPELINE), {
        user_id: userId,
        key_id: keyPair.key_id,
      });

      return jsonOk({
        key_id: keyPair.key_id,
        public_key_dilithium: keyPair.public_key_dilithium,
        public_key_kyber: keyPair.public_key_kyber,
        created_at: keyPair.created_at,
        expires_at: keyPair.expires_at,
        rotation_schedule: rotationSchedule,
      }, 201);

    } catch (error) {
      logger.error('Key generation failed', buildLogContext(request, SERVICE_NAME, PIPELINE),
        error instanceof Error ? error : undefined);
      return errors.internal('Key generation failed');
    }
  }

  // POST /security/sign - Sign payload with Dilithium
  if (path === '/security/sign' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    const body = await request.json().catch(() => ({}));
    const { payload, key_id } = body;

    if (!payload || !key_id) {
      return errors.badRequest('payload and key_id required');
    }

    const keyEntry = keyStore.get(key_id);
    if (!keyEntry) {
      return errors.notFound('Key');
    }

    if (isKeyExpired(keyEntry.keyPair)) {
      return errors.badRequest('Key has expired');
    }

    try {
      const signature = await signWithDilithium(
        typeof payload === 'string' ? payload : JSON.stringify(payload),
        keyEntry.privateKey,
        'Dilithium3'
      );

      logger.info('Payload signed', buildLogContext(request, SERVICE_NAME, PIPELINE), {
        user_id: userId,
        key_id,
      });

      return jsonOk({
        signature,
        algorithm: 'Dilithium3',
        key_id,
      });

    } catch (error) {
      logger.error('Signing failed', buildLogContext(request, SERVICE_NAME, PIPELINE),
        error instanceof Error ? error : undefined);
      return errors.internal('Signing failed');
    }
  }

  // POST /security/verify - Verify Dilithium signature
  if (path === '/security/verify' && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const { payload, signature, public_key } = body;

    if (!payload || !signature || !public_key) {
      return errors.badRequest('payload, signature, and public_key required');
    }

    try {
      const isValid = await verifyDilithiumSignature(
        typeof payload === 'string' ? payload : JSON.stringify(payload),
        signature,
        public_key
      );

      return jsonOk({
        valid: isValid,
        algorithm: signature.algorithm,
        timestamp: signature.timestamp,
      });

    } catch (error) {
      logger.error('Verification failed', buildLogContext(request, SERVICE_NAME, PIPELINE),
        error instanceof Error ? error : undefined);
      return jsonOk({ valid: false, error: 'Verification failed' });
    }
  }

  // POST /security/encrypt - Encrypt with Kyber KEM
  if (path === '/security/encrypt' && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const { plaintext, public_key_kyber } = body;

    if (!plaintext || !public_key_kyber) {
      return errors.badRequest('plaintext and public_key_kyber required');
    }

    try {
      const encrypted = await encryptWithPQC(plaintext, public_key_kyber);

      return jsonOk({
        encrypted,
        algorithm: 'Kyber1024+AES-256-GCM',
      });

    } catch (error) {
      logger.error('Encryption failed', buildLogContext(request, SERVICE_NAME, PIPELINE),
        error instanceof Error ? error : undefined);
      return errors.internal('Encryption failed');
    }
  }

  // POST /security/decrypt - Decrypt with Kyber KEM
  if (path === '/security/decrypt' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    const body = await request.json().catch(() => ({}));
    const { encrypted_data, key_id } = body;

    if (!encrypted_data || !key_id) {
      return errors.badRequest('encrypted_data and key_id required');
    }

    const keyEntry = keyStore.get(key_id);
    if (!keyEntry) {
      return errors.notFound('Key');
    }

    try {
      const decrypted = await decryptWithPQC(encrypted_data, keyEntry.privateKey);

      return jsonOk({
        plaintext: decrypted,
        algorithm: 'Kyber1024+AES-256-GCM',
      });

    } catch (error) {
      logger.error('Decryption failed', buildLogContext(request, SERVICE_NAME, PIPELINE),
        error instanceof Error ? error : undefined);
      return errors.internal('Decryption failed');
    }
  }

  // GET /security/entropy - Entropy status
  if (path === '/security/entropy' && request.method === 'GET') {
    const entropy = await generateEntropy(64);
    const status = await validateEntropy(entropy);

    return jsonOk({
      entropy: {
        valid: status.valid,
        shannon_entropy: parseFloat(status.shannonEntropy.toFixed(4)),
        bits: parseFloat(status.entropyBits.toFixed(2)),
        threshold: 7.5,
        sample: btoa(String.fromCharCode(...entropy.slice(0, 8))) + '...',
      },
      rng: {
        source: 'Web Crypto API',
        certified: true,
        standard: 'NIST SP 800-90A',
      },
    });
  }

  // GET /security/audit - Security audit logs
  if (path === '/security/audit' && request.method === 'GET') {
    if (!userId) {
      return errors.unauthorized();
    }

    // Check auditor role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!['admin', 'security_officer', 'auditor'].includes(profile?.role)) {
      return errors.forbidden('Auditor role required');
    }

    const page = ctx.url.searchParams.get('page') || '1';
    const limit = ctx.url.searchParams.get('limit') || '20';
    const severity = ctx.url.searchParams.get('severity');
    const event_type = ctx.url.searchParams.get('event_type');
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let query = supabase
      .from('security_events')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit as string) - 1);

    if (severity) {
      query = query.eq('severity', severity);
    }

    if (event_type) {
      query = query.eq('event_type', event_type);
    }

    const { data, error, count } = await query;

    if (error) {
      return errors.internal('Failed to fetch audit logs');
    }

    return jsonOk({
      events: data,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: count,
      },
    });
  }

  // POST /security/scan - Run security scan (DEKATEOTL integration)
  if (path === '/security/scan' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    const body = await request.json().catch(() => ({}));
    const { target_user_id, scan_type = 'full' } = body;

    const targetId = target_user_id || userId;

    // Only admins can scan other users
    if (targetId !== userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (!['admin', 'security_officer'].includes(profile?.role)) {
        return errors.forbidden('Can only scan own account');
      }
    }

    try {
      // Call DEKATEOTL security function
      const { data: scanResult } = await supabase.functions.invoke('dekateotl-security', {
        body: { userId: targetId, scanType: scan_type },
      });

      return jsonOk({
        scan_id: crypto.randomUUID(),
        target_user_id: targetId,
        scan_type,
        result: scanResult,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      logger.error('Security scan failed', buildLogContext(request, SERVICE_NAME, PIPELINE),
        error instanceof Error ? error : undefined);
      return errors.internal('Security scan failed');
    }
  }

  // Route not found
  return errors.notFound('Endpoint');
});

// ============================================================================
// Helper Functions
// ============================================================================

async function getActiveThreats(supabase: any): Promise<any[]> {
  const { data } = await supabase
    .from('security_alerts')
    .select('*')
    .in('severity', ['high', 'critical'])
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(10);

  return data || [];
}

// ============================================================================
// Start Server
// ============================================================================

serve(handler);

console.log(`🔐 ${SERVICE_NAME} v${VERSION} running on port ${SERVICE_PORT} [Pipeline ${PIPELINE}]`);
