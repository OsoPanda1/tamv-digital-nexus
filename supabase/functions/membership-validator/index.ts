// ============================================================================
// TAMV MD-X4™ - Membership Validator Edge Function
// Validates membership tier and access permissions
// ============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Tier hierarchy
const TIER_HIERARCHY = ['free', 'starter', 'pro', 'business', 'enterprise', 'custom'];

interface ValidationResult {
  valid: boolean;
  tier: string;
  features: string[];
  limits: Record<string, number>;
  visibility: Record<string, unknown>;
  rateLimit: Record<string, unknown>;
}

// Default tier configurations
const DEFAULT_TIERS: Record<string, Partial<ValidationResult>> = {
  free: {
    tier: 'free',
    features: ['basic_access', 'public_dream_spaces', 'free_courses'],
    limits: { apiCallsPerDay: 100, storageGB: 1, users: 1 },
    visibility: { nodes: 0, metrics: ['basic'] },
    rateLimit: { windowMs: 60000, maxRequests: 10 }
  },
  starter: {
    tier: 'starter',
    features: ['everything_in_free', 'api_access_basic', 'premium_courses_limited'],
    limits: { apiCallsPerDay: 1000, storageGB: 10, users: 5 },
    visibility: { nodes: 10, metrics: ['basic', 'standard'] },
    rateLimit: { windowMs: 60000, maxRequests: 50 }
  },
  pro: {
    tier: 'pro',
    features: ['everything_in_starter', 'all_courses_access', 'api_extended', 'bci_basic'],
    limits: { apiCallsPerDay: 10000, storageGB: 50, users: 20 },
    visibility: { nodes: 25, metrics: ['basic', 'standard', 'advanced'] },
    rateLimit: { windowMs: 60000, maxRequests: 200 }
  },
  business: {
    tier: 'business',
    features: ['everything_in_pro', 'priority_support', 'bci_advanced'],
    limits: { apiCallsPerDay: 100000, storageGB: 200, users: 100 },
    visibility: { nodes: 48, metrics: ['basic', 'standard', 'advanced', 'complete'] },
    rateLimit: { windowMs: 60000, maxRequests: 1000 }
  },
  enterprise: {
    tier: 'enterprise',
    features: ['everything_in_business', 'dedicated_infrastructure', 'on_premise_option'],
    limits: { apiCallsPerDay: -1, storageGB: -1, users: -1 },
    visibility: { nodes: 48, metrics: ['all'] },
    rateLimit: { windowMs: 60000, maxRequests: 5000 }
  },
  custom: {
    tier: 'custom',
    features: ['everything_in_enterprise', 'white_label', 'fully_customized'],
    limits: { apiCallsPerDay: -1, storageGB: -1, users: -1 },
    visibility: { nodes: -1, metrics: ['all'] },
    rateLimit: { windowMs: 60000, maxRequests: -1 }
  }
};

Deno.serve(async (req) => {
  try {
    // Get authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const body = await req.json().catch(() => ({}));
    const { action, feature, limitType } = body;
    
    // Get user's membership
    const { data: membership } = await supabase
      .from('memberships')
      .select('*, membership_tiers(*)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();
    
    const tierId = membership?.tier_id || 'free';
    const tierConfig = membership?.membership_tiers || DEFAULT_TIERS[tierId];
    
    switch (action) {
      case 'validate': {
        const result: ValidationResult = {
          valid: true,
          tier: tierId,
          features: tierConfig.features || DEFAULT_TIERS[tierId]?.features || [],
          limits: tierConfig.limits || DEFAULT_TIERS[tierId]?.limits || {},
          visibility: tierConfig.visibility || DEFAULT_TIERS[tierId]?.visibility || {},
          rateLimit: tierConfig.rateLimit || DEFAULT_TIERS[tierId]?.rateLimit || {}
        };
        
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      case 'check_feature': {
        if (!feature) {
          return new Response(JSON.stringify({ error: 'feature required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const features: string[] = tierConfig.features || [];
        const hasAccess = features.includes(feature) || 
          features.some((f: string) => f.startsWith('everything_in_'));
        
        return new Response(JSON.stringify({
          hasAccess,
          tier: tierId,
          feature
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      case 'check_limit': {
        if (!limitType) {
          return new Response(JSON.stringify({ error: 'limitType required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const limits = tierConfig.limits || {};
        const usage = membership?.usage || {};
        
        const limit = limits[limitType] ?? 0;
        const current = usage[limitType] ?? 0;
        
        const isUnlimited = limit === -1;
        const allowed = isUnlimited || current < limit;
        
        return new Response(JSON.stringify({
          allowed,
          limit,
          current,
          remaining: isUnlimited ? -1 : Math.max(0, limit - current),
          tier: tierId
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      case 'check_rate_limit': {
        const { category = 'api' } = body;
        const rateLimits = tierConfig.rateLimit || DEFAULT_TIERS[tierId]?.rateLimit || {};
        
        // In production, use Redis for distributed rate limiting
        // This is a simplified version
        const key = `ratelimit:${user.id}:${category}`;
        const now = Date.now();
        const windowMs = rateLimits.windowMs || 60000;
        const maxRequests = rateLimits.maxRequests ?? 10;
        
        // Get current count from KV store (simplified)
        const { data: rateData } = await supabase
          .from('rate_limits')
          .select('*')
          .eq('key', key)
          .single();
        
        let count = 1;
        let resetAt = now + windowMs;
        
        if (rateData && rateData.reset_at > now) {
          count = rateData.count + 1;
          resetAt = rateData.reset_at;
        }
        
        const allowed = maxRequests === -1 || count <= maxRequests;
        
        // Update rate limit
        await supabase
          .from('rate_limits')
          .upsert({
            key,
            count,
            reset_at: resetAt,
            user_id: user.id
          });
        
        return new Response(JSON.stringify({
          allowed,
          remaining: maxRequests === -1 ? -1 : Math.max(0, maxRequests - count),
          resetAt: new Date(resetAt).toISOString(),
          tier: tierId
        }), {
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': String(maxRequests),
            'X-RateLimit-Remaining': String(maxRequests === -1 ? -1 : Math.max(0, maxRequests - count)),
            'X-RateLimit-Reset': String(Math.floor(resetAt / 1000))
          }
        });
      }
      
      case 'upgrade': {
        const { newTier } = body;
        
        if (!newTier || !TIER_HIERARCHY.includes(newTier)) {
          return new Response(JSON.stringify({ error: 'Invalid tier' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const currentTierIndex = TIER_HIERARCHY.indexOf(tierId);
        const newTierIndex = TIER_HIERARCHY.indexOf(newTier);
        
        if (newTierIndex <= currentTierIndex) {
          return new Response(JSON.stringify({ error: 'Cannot upgrade to same or lower tier' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // In production, this would create a Stripe checkout session
        const newTierConfig = DEFAULT_TIERS[newTier];
        
        return new Response(JSON.stringify({
          message: 'Upgrade requested',
          currentTier: tierId,
          newTier,
          price: newTierConfig?.limits,
          requiresPayment: true
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      case 'get_tiers': {
        return new Response(JSON.stringify({
          tiers: DEFAULT_TIERS,
          currentTier: tierId
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Membership Validator Error:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
