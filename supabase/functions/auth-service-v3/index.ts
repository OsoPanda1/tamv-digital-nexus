// ============================================================================
// TAMV Auth Service v3.0.0-Sovereign
// Pipeline A - Critical Operations (Port 8001)
// JWT + Post-Quantum Cryptography (PQC) Support
// ============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
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
  corsHeaders,
} from '../_shared/index.ts';

// ============================================================================
// Service Configuration
// ============================================================================

const SERVICE_NAME = 'auth-service-v3';
const SERVICE_PORT = 8001;
const PIPELINE = 'A' as const;
const VERSION = '3.0.0-Sovereign';

// Rate limiting config
const RATE_LIMITS = {
  login: { maxRequests: 5, windowMs: 60000 }, // 5 per minute
  register: { maxRequests: 3, windowMs: 3600000 }, // 3 per hour
  refresh: { maxRequests: 10, windowMs: 60000 }, // 10 per minute
};

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// ============================================================================
// Logger & QSL
// ============================================================================

const logger = createLogger(SERVICE_NAME);
const qsl = createQSL({ enabled: true, hybridMode: true });

// ============================================================================
// JWT + PQC Token Generation
// ============================================================================

interface TokenPayload {
  sub: string; // user_id
  email: string;
  role: string;
  tier: string;
  iat: number;
  exp: number;
  jti: string; // JWT ID for revocation
  qsl_key_id?: string;
  quantum_sig?: string;
}

async function generateTokens(
  userId: string,
  email: string,
  role: string,
  tier: string,
  usePQC: boolean = false
): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 3600; // 1 hour
  const jti = crypto.randomUUID();

  const payload: TokenPayload = {
    sub: userId,
    email,
    role,
    tier,
    iat: now,
    exp: now + expiresIn,
    jti,
  };

  // Add PQC signature if enabled
  if (usePQC) {
    const keyPair = await generateQuantumKeyPair();
    payload.qsl_key_id = keyPair.key_id;
    
    const payloadHash = await sha3_256(JSON.stringify(payload));
    const signature = await qsl.sign(payloadHash, keyPair.key_id);
    payload.quantum_sig = signature.signature;
  }

  // Create JWT (simplified - use proper JWT library in production)
  const header = btoa(JSON.stringify({ alg: usePQC ? 'HS256+PQC' : 'HS256', typ: 'JWT' }));
  const payloadB64 = btoa(JSON.stringify(payload));
  const signature = await sha3_256(`${header}.${payloadB64}.${Deno.env.get('JWT_SECRET')}`);
  const accessToken = `${header}.${payloadB64}.${signature}`;

  // Generate refresh token
  const refreshJti = crypto.randomUUID();
  const refreshPayload = { sub: userId, jti: refreshJti, type: 'refresh', iat: now, exp: now + 86400 * 7 };
  const refreshHeader = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const refreshPayloadB64 = btoa(JSON.stringify(refreshPayload));
  const refreshSignature = await sha3_256(`${refreshHeader}.${refreshPayloadB64}.${Deno.env.get('JWT_SECRET')}`);
  const refreshToken = `${refreshHeader}.${refreshPayloadB64}.${refreshSignature}`;

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expiresIn,
  };
}

async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const [headerB64, payloadB64, signature] = token.split('.');
    if (!headerB64 || !payloadB64 || !signature) return null;

    // Verify signature
    const expectedSignature = await sha3_256(`${headerB64}.${payloadB64}.${Deno.env.get('JWT_SECRET')}`);
    if (signature !== expectedSignature) return null;

    // Decode payload
    const payload: TokenPayload = JSON.parse(atob(payloadB64));

    // Check expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

// ============================================================================
// Rate Limiting
// ============================================================================

function checkRateLimit(key: string, config: { maxRequests: number; windowMs: number }): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
    return { allowed: true };
  }

  if (record.count >= config.maxRequests) {
    return { allowed: false, retryAfter: Math.ceil((record.resetTime - now) / 1000) };
  }

  record.count++;
  return { allowed: true };
}

// ============================================================================
// Main Handler
// ============================================================================

const handler = createHandler(SERVICE_NAME, PIPELINE, async (ctx) => {
  const { request, url, supabase, userId, traceId } = ctx;
  const path = url.pathname.replace('/auth-service-v3', '');

  // GET /health - Health check
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

  // POST /auth/register - User registration
  if (path === '/auth/register' && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const { email, password, name, metadata = {} } = body;

    // Validation
    if (!email || !password) {
      return errors.badRequest('Email and password are required');
    }

    if (password.length < 8) {
      return errors.validation('Password must be at least 8 characters');
    }

    // Rate limit check
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = checkRateLimit(`register:${clientIp}`, RATE_LIMITS.register);
    if (!rateLimit.allowed) {
      return errors.rateLimited(rateLimit.retryAfter);
    }

    try {
      // Check if user exists
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (existing) {
        return errors.badRequest('Email already registered');
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name || email.split('@')[0],
            ...metadata,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email,
        display_name: name || email.split('@')[0],
        full_name: name,
        role: 'public',
        tier: 'free',
        created_at: new Date().toISOString(),
      });

      if (profileError) {
        // Rollback auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }

      // Generate PQC-enabled tokens
      const tokens = await generateTokens(
        authData.user.id,
        email,
        'public',
        'free',
        true // Enable PQC
      );

      // Log security event
      await supabase.from('security_events').insert({
        user_id: authData.user.id,
        event_type: 'user_registered',
        severity: 'info',
        description: 'New user registration with PQC tokens',
        metadata: { 
          email: email.slice(0, 3) + '***',
          tier: 'free',
          qsl_enabled: true,
        },
      });

      logger.info('User registered successfully', buildLogContext(request, SERVICE_NAME, PIPELINE), {
        user_id: authData.user.id,
        tier: 'free',
      });

      return jsonOk({
        user: {
          id: authData.user.id,
          email: authData.user.email,
          display_name: name || email.split('@')[0],
          tier: 'free',
        },
        ...tokens,
        qsl_enabled: true,
      }, 201);

    } catch (error) {
      logger.error('Registration failed', buildLogContext(request, SERVICE_NAME, PIPELINE), 
        error instanceof Error ? error : undefined);
      return errors.internal(error instanceof Error ? error.message : 'Registration failed');
    }
  }

  // POST /auth/login - User login
  if (path === '/auth/login' && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const { email, password, mfa_code } = body;

    if (!email || !password) {
      return errors.badRequest('Email and password are required');
    }

    // Rate limit check
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = checkRateLimit(`login:${email}:${clientIp}`, RATE_LIMITS.login);
    if (!rateLimit.allowed) {
      return errors.rateLimited(rateLimit.retryAfter);
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Log failed attempt
        await supabase.from('security_events').insert({
          event_type: 'login_failed',
          severity: 'medium',
          description: 'Failed login attempt',
          metadata: { email: email.slice(0, 3) + '***', reason: authError.message },
        });
        return errors.unauthorized('Invalid credentials');
      }

      if (!authData.user) {
        return errors.unauthorized('Authentication failed');
      }

      // Check if MFA is required
      const { data: profile } = await supabase
        .from('profiles')
        .select('mfa_enabled, tier, role')
        .eq('id', authData.user.id)
        .single();

      if (profile?.mfa_enabled && !mfa_code) {
        return jsonError('MFA code required', 403, 'MFA_REQUIRED');
      }

      // Verify MFA code if provided
      if (profile?.mfa_enabled && mfa_code) {
        // MFA verification logic here
        // For MVP: simplified check
        const { data: mfaValid } = await supabase.rpc('verify_mfa_code', {
          user_id: authData.user.id,
          code: mfa_code,
        });
        
        if (!mfaValid) {
          return errors.unauthorized('Invalid MFA code');
        }
      }

      // Generate PQC-enabled tokens
      const tokens = await generateTokens(
        authData.user.id,
        authData.user.email!,
        profile?.role || 'public',
        profile?.tier || 'free',
        true
      );

      // Log successful login
      await supabase.from('security_events').insert({
        user_id: authData.user.id,
        event_type: 'login_success',
        severity: 'info',
        description: 'User logged in successfully',
        metadata: { 
          tier: profile?.tier,
          qsl_enabled: true,
        },
      });

      // Update last login
      await supabase.from('profiles').update({
        last_login_at: new Date().toISOString(),
      }).eq('id', authData.user.id);

      logger.info('User logged in successfully', buildLogContext(request, SERVICE_NAME, PIPELINE), {
        user_id: authData.user.id,
        tier: profile?.tier,
      });

      return jsonOk({
        user: {
          id: authData.user.id,
          email: authData.user.email,
          display_name: authData.user.user_metadata?.display_name,
          role: profile?.role,
          tier: profile?.tier,
        },
        ...tokens,
        qsl_enabled: true,
      });

    } catch (error) {
      logger.error('Login failed', buildLogContext(request, SERVICE_NAME, PIPELINE),
        error instanceof Error ? error : undefined);
      return errors.internal('Login failed');
    }
  }

  // POST /auth/refresh - Refresh token
  if (path === '/auth/refresh' && request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const { refresh_token } = body;

    if (!refresh_token) {
      return errors.badRequest('Refresh token required');
    }

    // Rate limit check
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = checkRateLimit(`refresh:${clientIp}`, RATE_LIMITS.refresh);
    if (!rateLimit.allowed) {
      return errors.rateLimited(rateLimit.retryAfter);
    }

    try {
      const payload = await verifyToken(refresh_token);
      if (!payload || payload.type !== 'refresh') {
        return errors.unauthorized('Invalid refresh token');
      }

      // Check if token is revoked
      const { data: revoked } = await supabase
        .from('revoked_tokens')
        .select('jti')
        .eq('jti', payload.jti)
        .single();

      if (revoked) {
        return errors.unauthorized('Token has been revoked');
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, role, tier')
        .eq('id', payload.sub)
        .single();

      if (!profile) {
        return errors.notFound('User');
      }

      // Generate new tokens
      const tokens = await generateTokens(
        payload.sub,
        profile.email,
        profile.role,
        profile.tier,
        true
      );

      logger.info('Token refreshed', buildLogContext(request, SERVICE_NAME, PIPELINE), {
        user_id: payload.sub,
      });

      return jsonOk({
        ...tokens,
        qsl_enabled: true,
      });

    } catch (error) {
      logger.error('Token refresh failed', buildLogContext(request, SERVICE_NAME, PIPELINE),
        error instanceof Error ? error : undefined);
      return errors.unauthorized('Invalid refresh token');
    }
  }

  // POST /auth/logout - Logout
  if (path === '/auth/logout' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    try {
      const authHeader = request.headers.get('Authorization');
      const token = authHeader?.split(' ')[1];

      if (token) {
        const payload = await verifyToken(token);
        if (payload) {
          // Revoke token
          await supabase.from('revoked_tokens').insert({
            jti: payload.jti,
            user_id: payload.sub,
            revoked_at: new Date().toISOString(),
            expires_at: new Date(payload.exp * 1000).toISOString(),
          });
        }
      }

      await supabase.auth.signOut();

      logger.info('User logged out', buildLogContext(request, SERVICE_NAME, PIPELINE), {
        user_id: userId,
      });

      return jsonOk({ message: 'Logged out successfully' });

    } catch (error) {
      logger.error('Logout failed', buildLogContext(request, SERVICE_NAME, PIPELINE),
        error instanceof Error ? error : undefined);
      return errors.internal('Logout failed');
    }
  }

  // GET /auth/validate - Validate token
  if (path === '/auth/validate' && request.method === 'GET') {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return errors.unauthorized('Token required');
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return errors.unauthorized('Invalid token');
    }

    // Check if token is revoked
    const { data: revoked } = await supabase
      .from('revoked_tokens')
      .select('jti')
      .eq('jti', payload.jti)
      .single();

    if (revoked) {
      return errors.unauthorized('Token has been revoked');
    }

    return jsonOk({
      valid: true,
      user_id: payload.sub,
      email: payload.email,
      role: payload.role,
      tier: payload.tier,
      expires_at: new Date(payload.exp * 1000).toISOString(),
      qsl_enabled: !!payload.quantum_sig,
    });
  }

  // POST /auth/mfa/enable - Enable 2FA
  if (path === '/auth/mfa/enable' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    try {
      // Generate TOTP secret
      const secret = crypto.randomUUID().replace(/-/g, '').slice(0, 16);
      
      await supabase.from('profiles').update({
        mfa_secret: secret,
        mfa_enabled: false, // Will be enabled after verification
      }).eq('id', userId);

      // Generate QR code URL (simplified)
      const qrUrl = `otpauth://totp/TAMV:${userId}?secret=${secret}&issuer=TAMV`;

      logger.info('MFA setup initiated', buildLogContext(request, SERVICE_NAME, PIPELINE), {
        user_id: userId,
      });

      return jsonOk({
        secret,
        qr_code_url: qrUrl,
        message: 'Scan QR code with authenticator app and verify to enable MFA',
      });

    } catch (error) {
      logger.error('MFA enable failed', buildLogContext(request, SERVICE_NAME, PIPELINE),
        error instanceof Error ? error : undefined);
      return errors.internal('Failed to enable MFA');
    }
  }

  // POST /auth/mfa/verify - Verify and enable MFA
  if (path === '/auth/mfa/verify' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    const body = await request.json().catch(() => ({}));
    const { code } = body;

    if (!code) {
      return errors.badRequest('MFA code required');
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('mfa_secret')
        .eq('id', userId)
        .single();

      if (!profile?.mfa_secret) {
        return errors.badRequest('MFA not set up');
      }

      // Verify TOTP code (simplified - use proper TOTP library in production)
      const valid = await supabase.rpc('verify_totp', {
        secret: profile.mfa_secret,
        code,
      });

      if (!valid) {
        return errors.unauthorized('Invalid MFA code');
      }

      // Enable MFA
      await supabase.from('profiles').update({
        mfa_enabled: true,
      }).eq('id', userId);

      logger.info('MFA enabled', buildLogContext(request, SERVICE_NAME, PIPELINE), {
        user_id: userId,
      });

      return jsonOk({ message: 'MFA enabled successfully' });

    } catch (error) {
      logger.error('MFA verification failed', buildLogContext(request, SERVICE_NAME, PIPELINE),
        error instanceof Error ? error : undefined);
      return errors.internal('MFA verification failed');
    }
  }

  // Route not found
  return errors.notFound('Endpoint');
});

// ============================================================================
// Start Server
// ============================================================================

serve(handler);

console.log(`🛡️  ${SERVICE_NAME} v${VERSION} running on port ${SERVICE_PORT} [Pipeline ${PIPELINE}]`);
