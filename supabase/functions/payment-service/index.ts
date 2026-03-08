// ============================================================================
// TAMV Payment Service v3.0.0-Sovereign
// Pipeline A - Critical Operations (Port 8005)
// Stripe + TAU Ledger Integration
// ============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import {
  createHandler,
  jsonOk,
  jsonError,
  errors,
  createLogger,
  buildLogContext,
  sha3_256,
} from '../_shared/index.ts';

// ============================================================================
// Service Configuration
// ============================================================================

const SERVICE_NAME = 'payment-service';
const SERVICE_PORT = 8005;
const PIPELINE = 'A' as const;
const VERSION = '3.0.0-Sovereign';

// Commission rates by tier
const COMMISSION_RATES: Record<string, number> = {
  free: 0.30,
  premium: 0.25,
  vip: 0.20,
  elite: 0.15,
  celestial: 0.10,
  enterprise: 0.08,
  gold: 0.12,
  gold_plus: 0.10,
};

// ============================================================================
// Logger
// ============================================================================

const logger = createLogger(SERVICE_NAME);

// ============================================================================
// Stripe Integration (simplified - use actual Stripe SDK in production)
// ============================================================================

async function createStripePaymentIntent(
  amount: number,
  currency: string,
  metadata: Record<string, string>
): Promise<{ client_secret: string; payment_intent_id: string }> {
  const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
  if (!stripeSecret) {
    throw new Error('Stripe not configured');
  }

  // In production: Use actual Stripe API
  // For MVP: Simulate Stripe response
  const paymentIntentId = `pi_${crypto.randomUUID().replace(/-/g, '')}`;
  const clientSecret = `${paymentIntentId}_secret_${crypto.randomUUID().replace(/-/g, '').slice(0, 24)}`;

  return {
    client_secret: clientSecret,
    payment_intent_id: paymentIntentId,
  };
}

async function confirmStripePayment(paymentIntentId: string): Promise<boolean> {
  // In production: Verify with Stripe API
  return true;
}

// ============================================================================
// Main Handler
// ============================================================================

const handler = createHandler(SERVICE_NAME, PIPELINE, async (ctx) => {
  const { request, url, supabase, userId, traceId } = ctx;
  const path = url.pathname.replace('/payment-service', '');

  // GET /health
  if (path === '/health' && request.method === 'GET') {
    return jsonOk({
      service: SERVICE_NAME,
      version: VERSION,
      pipeline: PIPELINE,
      port: SERVICE_PORT,
      status: 'healthy',
      integrations: {
        stripe: !!Deno.env.get('STRIPE_SECRET_KEY'),
        tau_ledger: true,
        tcep_tokens: true,
      },
      timestamp: new Date().toISOString(),
    });
  }

  // POST /payments/create - Create payment intent
  if (path === '/payments/create' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    const body = await request.json().catch(() => ({}));
    const { amount, currency = 'USD', payment_method = 'stripe', description, metadata = {} } = body;

    if (!amount || amount <= 0) {
      return errors.badRequest('Valid amount required');
    }

    // Get user tier for commission calculation
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', userId)
      .single();

    const tier = profile?.tier || 'free';
    const commissionRate = COMMISSION_RATES[tier] || 0.30;
    const commission = Math.round(amount * commissionRate * 100) / 100;
    const netAmount = amount - commission;

    const paymentId = crypto.randomUUID();
    const hash = await sha3_256(JSON.stringify({
      payment_id: paymentId,
      user_id: userId,
      amount,
      currency,
      ts: Date.now(),
    }));

    const result: any = {
      payment_id: paymentId,
      amount,
      currency,
      commission,
      net_amount: netAmount,
      commission_rate: commissionRate,
      status: 'pending',
    };

    try {
      if (payment_method === 'stripe') {
        const stripePayment = await createStripePaymentIntent(
          Math.round(amount * 100), // Convert to cents
          currency.toLowerCase(),
          { user_id: userId, payment_id: paymentId, ...metadata }
        );

        result.client_secret = stripePayment.client_secret;
        result.stripe_payment_intent_id = stripePayment.payment_intent_id;
        result.requires_confirmation = true;

        // Store payment record
        await supabase.from('payments').insert({
          id: paymentId,
          user_id: userId,
          amount,
          currency,
          payment_method: 'stripe',
          commission_rate: commissionRate,
          commission_amount: commission,
          net_amount: netAmount,
          status: 'requires_confirmation',
          provider_payment_id: stripePayment.payment_intent_id,
          description,
          metadata,
          evidence_hash: hash,
        });

      } else if (payment_method === 'tau_ledger') {
        // TAU ledger payment
        result.requires_confirmation = false;
        result.status = 'completed';

        // Debit TAU from user wallet
        await supabase.rpc('update_wallet_balance', {
          p_user_id: userId,
          p_delta: -amount,
        });

        // Store payment record
        await supabase.from('payments').insert({
          id: paymentId,
          user_id: userId,
          amount,
          currency: 'TAU',
          payment_method: 'tau_ledger',
          commission_rate: commissionRate,
          commission_amount: commission,
          net_amount: netAmount,
          status: 'completed',
          description,
          metadata,
          evidence_hash: hash,
          completed_at: new Date().toISOString(),
        });

        // Credit to system wallet
        await supabase.rpc('credit_system_wallet', {
          p_amount: netAmount,
          p_currency: 'TAU',
        });

      } else {
        return errors.badRequest('Unsupported payment method');
      }

      // Log MSR event
      await supabase.from('msr_events').insert({
        actor_id: userId,
        action: 'PAYMENT_CREATED',
        domain: 'ECONOMY',
        resource: paymentId,
        status: 'success',
        risk_level: amount > 1000 ? 'medium' : 'low',
        evidence_hash: hash,
        metadata: {
          amount,
          currency,
          payment_method,
          commission,
        },
      });

      logger.info('Payment created', buildLogContext(request, SERVICE_NAME, PIPELINE), {
        payment_id: paymentId,
        user_id: userId,
        amount,
        method: payment_method,
      });

      return jsonOk(result, 201);

    } catch (error) {
      logger.error('Payment creation failed', buildLogContext(request, SERVICE_NAME, PIPELINE),
        error instanceof Error ? error : undefined);
      return errors.internal('Payment creation failed');
    }
  }

  // POST /payments/{id}/confirm - Confirm payment with 2FA
  if (path.match(/^\/payments\/[^/]+\/confirm$/) && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    const paymentId = path.split('/')[2];
    const body = await request.json().catch(() => ({}));
    const { mfa_code } = body;

    // Get payment
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .eq('user_id', userId)
      .single();

    if (error || !payment) {
      return errors.notFound('Payment');
    }

    if (payment.status !== 'requires_confirmation') {
      return errors.badRequest('Payment cannot be confirmed');
    }

    // Verify 2FA for high amounts
    if (payment.amount > 1000) {
      if (!mfa_code) {
        return jsonError('2FA required for payments over 1000', 403, '2FA_REQUIRED');
      }

      const { data: mfaValid } = await supabase.rpc('verify_mfa_code', {
        user_id: userId,
        code: mfa_code,
      });

      if (!mfaValid) {
        return errors.unauthorized('Invalid 2FA code');
      }
    }

    try {
      // Confirm with provider
      if (payment.payment_method === 'stripe') {
        await confirmStripePayment(payment.provider_payment_id);
      }

      // Update payment status
      await supabase.from('payments').update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      }).eq('id', paymentId);

      // Credit to system wallet
      if (payment.payment_method !== 'tau_ledger') {
        await supabase.rpc('credit_system_wallet', {
          p_amount: payment.net_amount,
          p_currency: payment.currency,
        });
      }

      logger.info('Payment confirmed', buildLogContext(request, SERVICE_NAME, PIPELINE), {
        payment_id: paymentId,
        user_id: userId,
      });

      return jsonOk({
        payment_id: paymentId,
        status: 'completed',
        completed_at: new Date().toISOString(),
      });

    } catch (error) {
      logger.error('Payment confirmation failed', buildLogContext(request, SERVICE_NAME, PIPELINE),
        error instanceof Error ? error : undefined);
      return errors.internal('Payment confirmation failed');
    }
  }

  // GET /payments/{id} - Get payment status
  if (path.match(/^\/payments\/[^/]+$/) && request.method === 'GET') {
    if (!userId) {
      return errors.unauthorized();
    }

    const paymentId = path.split('/')[2];

    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .eq('user_id', userId)
      .single();

    if (error || !payment) {
      return errors.notFound('Payment');
    }

    return jsonOk({ payment });
  }

  // GET /payments/{id}/status - Quick status check
  if (path.match(/^\/payments\/[^/]+\/status$/) && request.method === 'GET') {
    const paymentId = path.split('/')[2];

    const { data: payment, error } = await supabase
      .from('payments')
      .select('id, status, completed_at')
      .eq('id', paymentId)
      .single();

    if (error || !payment) {
      return errors.notFound('Payment');
    }

    return jsonOk({
      payment_id: payment.id,
      status: payment.status,
      completed_at: payment.completed_at,
    });
  }

  // POST /payments/{id}/cancel - Cancel pending payment
  if (path.match(/^\/payments\/[^/]+\/cancel$/) && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    const paymentId = path.split('/')[2];

    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .eq('user_id', userId)
      .single();

    if (error || !payment) {
      return errors.notFound('Payment');
    }

    if (!['pending', 'requires_confirmation'].includes(payment.status)) {
      return errors.badRequest('Payment cannot be cancelled');
    }

    // Refund if using TAU ledger
    if (payment.payment_method === 'tau_ledger') {
      await supabase.rpc('update_wallet_balance', {
        p_user_id: userId,
        p_delta: payment.amount,
      });
    }

    await supabase.from('payments').update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
    }).eq('id', paymentId);

    return jsonOk({
      payment_id: paymentId,
      status: 'cancelled',
    });
  }

  // POST /payments/webhook - Stripe webhook
  if (path === '/payments/webhook' && request.method === 'POST') {
    const signature = request.headers.get('stripe-signature');
    const body = await request.text();

    // Verify webhook signature (in production)
    // const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    // Parse event
    let event;
    try {
      event = JSON.parse(body);
    } catch {
      return errors.badRequest('Invalid webhook payload');
    }

    logger.info('Stripe webhook received', buildLogContext(request, SERVICE_NAME, PIPELINE), {
      event_type: event.type,
    });

    // Handle events
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        
        // Find and update payment
        await supabase.from('payments')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
          })
          .eq('provider_payment_id', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        
        await supabase.from('payments')
          .update({
            status: 'failed',
            failure_message: paymentIntent.last_payment_error?.message,
          })
          .eq('provider_payment_id', paymentIntent.id);
        break;
      }
    }

    return jsonOk({ received: true });
  }

  // POST /payments/refund - Process refund
  if (path === '/payments/refund' && request.method === 'POST') {
    if (!userId) {
      return errors.unauthorized();
    }

    const body = await request.json().catch(() => ({}));
    const { payment_id, amount, reason } = body;

    if (!payment_id) {
      return errors.badRequest('payment_id required');
    }

    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', payment_id)
      .eq('user_id', userId)
      .single();

    if (error || !payment) {
      return errors.notFound('Payment');
    }

    if (payment.status !== 'completed') {
      return errors.badRequest('Only completed payments can be refunded');
    }

    const refundAmount = amount || payment.amount;
    if (refundAmount > payment.amount) {
      return errors.badRequest('Refund amount exceeds payment amount');
    }

    const refundId = crypto.randomUUID();

    // Process refund
    if (payment.payment_method === 'stripe') {
      // In production: Create Stripe refund
    } else if (payment.payment_method === 'tau_ledger') {
      await supabase.rpc('update_wallet_balance', {
        p_user_id: userId,
        p_delta: refundAmount,
      });
    }

    await supabase.from('refunds').insert({
      id: refundId,
      payment_id,
      user_id: userId,
      amount: refundAmount,
      reason,
      status: 'completed',
      completed_at: new Date().toISOString(),
    });

    await supabase.from('payments').update({
      status: refundAmount >= payment.amount ? 'refunded' : 'partially_refunded',
    }).eq('id', payment_id);

    return jsonOk({
      refund_id: refundId,
      payment_id,
      amount: refundAmount,
      status: 'completed',
    }, 201);
  }

  // Route not found
  return errors.notFound('Endpoint');
});

// ============================================================================
// Start Server
// ============================================================================

serve(handler);

console.log(`💳 ${SERVICE_NAME} v${VERSION} running on port ${SERVICE_PORT} [Pipeline ${PIPELINE}]`);
