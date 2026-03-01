// ============================================================================
// TAMV MD-X4™ - Membership System
// SaaS B2B/B2G Membership Management with Tiered Access
// ============================================================================

export type MembershipTier = 'free' | 'starter' | 'pro' | 'business' | 'enterprise' | 'custom';

export interface MembershipTierConfig {
  name: string;
  price: number;
  priceMax?: number;
  billingCycle: 'monthly' | 'yearly' | 'custom';
  features: string[];
  limits: MembershipLimits;
  support: SupportLevel;
  sla?: SLAConfig;
  visibility: VisibilityConfig;
}

export interface MembershipLimits {
  users: number;
  apiCallsPerDay: number;
  apiCallsPerMonth: number;
  storageGB: number;
  bandwidthGB: number;
  nodes: number;
  certifications: number;
  dreamSpaces: number;
  courses: number;
}

export interface SupportLevel {
  channels: ('email' | 'chat' | 'phone' | 'dedicated')[];
  responseTime: string;
  availability: string;
}

export interface SLAConfig {
  uptime: number;
  responseTime: number;
  compensation: string;
}

export interface VisibilityConfig {
  nodes: number;
  metrics: ('basic' | 'standard' | 'advanced' | 'complete')[];
  dashboards: string[];
  reports: string[];
}

export interface Membership {
  id: string;
  organizationId?: string;
  userId: string;
  tier: MembershipTier;
  status: 'active' | 'paused' | 'cancelled' | 'expired' | 'pending';
  startDate: Date;
  endDate?: Date;
  billingCycle: 'monthly' | 'yearly';
  price: number;
  features: string[];
  limits: MembershipLimits;
  usage: MembershipUsage;
  createdAt: Date;
  updatedAt: Date;
}

export interface MembershipUsage {
  apiCallsToday: number;
  apiCallsThisMonth: number;
  storageUsedGB: number;
  bandwidthUsedGB: number;
  usersCount: number;
  certificationsUsed: number;
  dreamSpacesUsed: number;
  lastReset: Date;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipFailedRequests: boolean;
  keyGenerator?: (req: unknown) => string;
}

// ============================================================================
// Tier Configurations
// ============================================================================

export const MEMBERSHIP_TIERS: Record<MembershipTier, MembershipTierConfig> = {
  free: {
    name: 'Free',
    price: 0,
    billingCycle: 'monthly',
    features: [
      'basic_access',
      'public_dream_spaces',
      'free_courses',
      'basic_wallet',
      'community_forums',
      'email_support'
    ],
    limits: {
      users: 1,
      apiCallsPerDay: 100,
      apiCallsPerMonth: 3000,
      storageGB: 1,
      bandwidthGB: 5,
      nodes: 0,
      certifications: 1,
      dreamSpaces: 1,
      courses: 5
    },
    support: {
      channels: ['email'],
      responseTime: '48 hours',
      availability: 'Business hours'
    },
    visibility: {
      nodes: 0,
      metrics: ['basic'],
      dashboards: ['basic'],
      reports: ['public']
    }
  },
  
  starter: {
    name: 'Starter',
    price: 30,
    billingCycle: 'monthly',
    features: [
      'everything_in_free',
      'premium_courses_limited',
      'api_access_basic',
      'private_groups',
      'extended_wallet',
      'priority_email_support',
      'courses_5_included'
    ],
    limits: {
      users: 5,
      apiCallsPerDay: 1000,
      apiCallsPerMonth: 30000,
      storageGB: 10,
      bandwidthGB: 50,
      nodes: 10,
      certifications: 5,
      dreamSpaces: 5,
      courses: 20
    },
    support: {
      channels: ['email'],
      responseTime: '24 hours',
      availability: 'Business hours'
    },
    visibility: {
      nodes: 10,
      metrics: ['basic', 'standard'],
      dashboards: ['basic', 'standard'],
      reports: ['public', 'organization']
    }
  },
  
  pro: {
    name: 'Pro',
    price: 180,
    billingCycle: 'monthly',
    features: [
      'everything_in_starter',
      'all_courses_access',
      'api_extended',
      'advanced_dashboards',
      'bci_basic',
      'chat_support',
      'courses_all_included',
      'certifications_20'
    ],
    limits: {
      users: 20,
      apiCallsPerDay: 10000,
      apiCallsPerMonth: 300000,
      storageGB: 50,
      bandwidthGB: 200,
      nodes: 25,
      certifications: 20,
      dreamSpaces: 20,
      courses: -1 // Unlimited
    },
    support: {
      channels: ['email', 'chat'],
      responseTime: '4 hours',
      availability: 'Extended hours'
    },
    visibility: {
      nodes: 25,
      metrics: ['basic', 'standard', 'advanced'],
      dashboards: ['basic', 'standard', 'advanced'],
      reports: ['public', 'organization', 'detailed']
    }
  },
  
  business: {
    name: 'Business',
    price: 550,
    priceMax: 800,
    billingCycle: 'monthly',
    features: [
      'everything_in_pro',
      'priority_support_24_7',
      'sla_99_9',
      'bci_advanced',
      'custom_integrations',
      'dedicated_account_manager',
      'sso',
      'audit_logs'
    ],
    limits: {
      users: 100,
      apiCallsPerDay: 100000,
      apiCallsPerMonth: 3000000,
      storageGB: 200,
      bandwidthGB: 1000,
      nodes: 48,
      certifications: 100,
      dreamSpaces: 50,
      courses: -1
    },
    support: {
      channels: ['email', 'chat', 'phone'],
      responseTime: '1 hour',
      availability: '24/7'
    },
    sla: {
      uptime: 99.9,
      responseTime: 100,
      compensation: 'Service credits'
    },
    visibility: {
      nodes: 48,
      metrics: ['basic', 'standard', 'advanced', 'complete'],
      dashboards: ['basic', 'standard', 'advanced', 'custom'],
      reports: ['all']
    }
  },
  
  enterprise: {
    name: 'Enterprise',
    price: 2400,
    priceMax: 9500,
    billingCycle: 'yearly',
    features: [
      'everything_in_business',
      'dedicated_infrastructure',
      'sla_99_99',
      'bci_complete',
      'on_premise_option',
      'compliance_support',
      'custom_development',
      'white_label_ready',
      'data_residency'
    ],
    limits: {
      users: -1,
      apiCallsPerDay: -1,
      apiCallsPerMonth: -1,
      storageGB: -1,
      bandwidthGB: -1,
      nodes: 48,
      certifications: -1,
      dreamSpaces: -1,
      courses: -1
    },
    support: {
      channels: ['email', 'chat', 'phone', 'dedicated'],
      responseTime: '15 minutes',
      availability: '24/7/365'
    },
    sla: {
      uptime: 99.99,
      responseTime: 50,
      compensation: 'Full refund + credits'
    },
    visibility: {
      nodes: 48,
      metrics: ['basic', 'standard', 'advanced', 'complete'],
      dashboards: ['all'],
      reports: ['all']
    }
  },
  
  custom: {
    name: 'Custom',
    price: 10000,
    priceMax: -1,
    billingCycle: 'custom',
    features: [
      'everything_in_enterprise',
      'white_label',
      'fully_customized',
      'co_governance',
      'dedicated_team',
      'strategic_partnership'
    ],
    limits: {
      users: -1,
      apiCallsPerDay: -1,
      apiCallsPerMonth: -1,
      storageGB: -1,
      bandwidthGB: -1,
      nodes: -1,
      certifications: -1,
      dreamSpaces: -1,
      courses: -1
    },
    support: {
      channels: ['email', 'chat', 'phone', 'dedicated'],
      responseTime: 'Immediate',
      availability: '24/7/365'
    },
    sla: {
      uptime: 99.999,
      responseTime: 10,
      compensation: 'Negotiated'
    },
    visibility: {
      nodes: -1,
      metrics: ['all'],
      dashboards: ['all'],
      reports: ['all']
    }
  }
};

// ============================================================================
// Rate Limits Configuration
// ============================================================================

export const RATE_LIMITS: Record<MembershipTier, Record<string, RateLimitConfig>> = {
  free: {
    api: { windowMs: 60000, maxRequests: 10 },
    auth: { windowMs: 900000, maxRequests: 5 },
    bci: { windowMs: 60000, maxRequests: 0 }, // No BCI access
    upload: { windowMs: 3600000, maxRequests: 5 }
  },
  starter: {
    api: { windowMs: 60000, maxRequests: 50 },
    auth: { windowMs: 900000, maxRequests: 20 },
    bci: { windowMs: 60000, maxRequests: 0 },
    upload: { windowMs: 3600000, maxRequests: 20 }
  },
  pro: {
    api: { windowMs: 60000, maxRequests: 200 },
    auth: { windowMs: 900000, maxRequests: 50 },
    bci: { windowMs: 60000, maxRequests: 30 },
    upload: { windowMs: 3600000, maxRequests: 100 }
  },
  business: {
    api: { windowMs: 60000, maxRequests: 1000 },
    auth: { windowMs: 900000, maxRequests: 200 },
    bci: { windowMs: 60000, maxRequests: 100 },
    upload: { windowMs: 3600000, maxRequests: 500 }
  },
  enterprise: {
    api: { windowMs: 60000, maxRequests: 5000 },
    auth: { windowMs: 900000, maxRequests: 1000 },
    bci: { windowMs: 60000, maxRequests: 500 },
    upload: { windowMs: 3600000, maxRequests: -1 }
  },
  custom: {
    api: { windowMs: 60000, maxRequests: -1 },
    auth: { windowMs: 900000, maxRequests: -1 },
    bci: { windowMs: 60000, maxRequests: -1 },
    upload: { windowMs: 3600000, maxRequests: -1 }
  }
};

// ============================================================================
// Membership System Class
// ============================================================================

export class MembershipSystem {
  private static instance: MembershipSystem;
  private memberships: Map<string, Membership> = new Map();
  private userMemberships: Map<string, string> = new Map(); // userId -> membershipId
  
  private constructor() {
    this.loadPersistedData();
  }
  
  static getInstance(): MembershipSystem {
    if (!MembershipSystem.instance) {
      MembershipSystem.instance = new MembershipSystem();
    }
    return MembershipSystem.instance;
  }
  
  /**
   * Get tier configuration
   */
  getTierConfig(tier: MembershipTier): MembershipTierConfig {
    return MEMBERSHIP_TIERS[tier];
  }
  
  /**
   * Get all tier configurations
   */
  getAllTiers(): Record<MembershipTier, MembershipTierConfig> {
    return MEMBERSHIP_TIERS;
  }
  
  /**
   * Create or update membership for a user
   */
  createMembership(
    userId: string,
    tier: MembershipTier,
    options?: {
      organizationId?: string;
      billingCycle?: 'monthly' | 'yearly';
      startDate?: Date;
    }
  ): Membership {
    const existingMembership = this.getMembershipByUser(userId);
    if (existingMembership) {
      this.memberships.delete(existingMembership.id);
    }
    
    const tierConfig = MEMBERSHIP_TIERS[tier];
    const billingCycle = options?.billingCycle || 
      (tier === 'enterprise' ? 'yearly' : 'monthly');
    
    const price = billingCycle === 'yearly' 
      ? Math.round(tierConfig.price * 12 * 0.8) // 20% discount
      : tierConfig.price;
    
    const membership: Membership = {
      id: `membership-${userId}-${Date.now()}`,
      organizationId: options?.organizationId,
      userId,
      tier,
      status: 'active',
      startDate: options?.startDate || new Date(),
      endDate: this.calculateEndDate(billingCycle),
      billingCycle,
      price,
      features: [...tierConfig.features],
      limits: { ...tierConfig.limits },
      usage: this.initializeUsage(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.memberships.set(membership.id, membership);
    this.userMemberships.set(userId, membership.id);
    this.persistData();
    
    console.log(`[Membership] Created ${tier} membership for user ${userId}`);
    return membership;
  }
  
  /**
   * Get membership by user ID
   */
  getMembershipByUser(userId: string): Membership | undefined {
    const membershipId = this.userMemberships.get(userId);
    return membershipId ? this.memberships.get(membershipId) : undefined;
  }
  
  /**
   * Get membership by ID
   */
  getMembership(membershipId: string): Membership | undefined {
    return this.memberships.get(membershipId);
  }
  
  /**
   * Check if user has access to a feature
   */
  hasFeatureAccess(userId: string, feature: string): boolean {
    const membership = this.getMembershipByUser(userId);
    if (!membership || membership.status !== 'active') {
      return MEMBERSHIP_TIERS.free.features.includes(feature);
    }
    return membership.features.includes(feature);
  }
  
  /**
   * Check if user has access to a feature (async for external calls)
   */
  async checkFeatureAccess(userId: string, feature: string): Promise<boolean> {
    return this.hasFeatureAccess(userId, feature);
  }
  
  /**
   * Check if user can perform action based on limits
   */
  checkLimit(userId: string, limitType: keyof MembershipLimits): {
    allowed: boolean;
    current: number;
    limit: number;
    remaining: number;
  } {
    const membership = this.getMembershipByUser(userId);
    const tierConfig = membership 
      ? MEMBERSHIP_TIERS[membership.tier] 
      : MEMBERSHIP_TIERS.free;
    
    const limit = tierConfig.limits[limitType];
    const current = this.getCurrentUsage(membership, limitType);
    
    const isUnlimited = limit === -1;
    const allowed = isUnlimited || current < limit;
    
    return {
      allowed,
      current,
      limit,
      remaining: isUnlimited ? -1 : Math.max(0, limit - current)
    };
  }
  
  /**
   * Increment usage counter
   */
  incrementUsage(
    userId: string, 
    usageType: keyof Omit<MembershipUsage, 'lastReset'>,
    amount: number = 1
  ): boolean {
    const membership = this.getMembershipByUser(userId);
    if (!membership) return false;
    
    membership.usage[usageType] = (membership.usage[usageType] as number) + amount;
    membership.updatedAt = new Date();
    this.persistData();
    
    return true;
  }
  
  /**
   * Check rate limit
   */
  checkRateLimit(
    userId: string, 
    category: string,
    identifier?: string
  ): { allowed: boolean; retryAfter?: number } {
    const membership = this.getMembershipByUser(userId);
    const tier = membership?.tier || 'free';
    const tierRates = RATE_LIMITS[tier];
    
    if (!tierRates[category]) {
      return { allowed: true };
    }
    
    const rateConfig = tierRates[category];
    
    // Unlimited
    if (rateConfig.maxRequests === -1) {
      return { allowed: true };
    }
    
    // In production, this would use Redis for distributed rate limiting
    // This is a simplified version
    const key = `ratelimit:${userId}:${category}:${identifier || 'default'}`;
    const stored = localStorage.getItem(key);
    
    if (stored) {
      const data = JSON.parse(stored);
      const now = Date.now();
      
      if (now < data.resetAt) {
        if (data.count >= rateConfig.maxRequests) {
          return { 
            allowed: false, 
            retryAfter: Math.ceil((data.resetAt - now) / 1000)
          };
        }
        
        localStorage.setItem(key, JSON.stringify({
          count: data.count + 1,
          resetAt: data.resetAt
        }));
        return { allowed: true };
      }
    }
    
    localStorage.setItem(key, JSON.stringify({
      count: 1,
      resetAt: Date.now() + rateConfig.windowMs
    }));
    
    return { allowed: true };
  }
  
  /**
   * Get visible nodes based on membership tier
   */
  getVisibleNodes(userId: string): number {
    const membership = this.getMembershipByUser(userId);
    const tierConfig = membership 
      ? MEMBERSHIP_TIERS[membership.tier] 
      : MEMBERSHIP_TIERS.free;
    
    return tierConfig.visibility.nodes;
  }
  
  /**
   * Get dashboard visibility
   */
  getDashboardVisibility(userId: string): VisibilityConfig {
    const membership = this.getMembershipByUser(userId);
    const tierConfig = membership 
      ? MEMBERSHIP_TIERS[membership.tier] 
      : MEMBERSHIP_TIERS.free;
    
    return tierConfig.visibility;
  }
  
  /**
   * Upgrade membership
   */
  upgradeMembership(userId: string, newTier: MembershipTier): Membership | null {
    const currentMembership = this.getMembershipByUser(userId);
    
    if (!currentMembership) {
      return this.createMembership(userId, newTier);
    }
    
    const currentTierIndex = this.getTierIndex(currentMembership.tier);
    const newTierIndex = this.getTierIndex(newTier);
    
    if (newTierIndex <= currentTierIndex) {
      console.warn('[Membership] Cannot upgrade to same or lower tier');
      return null;
    }
    
    return this.createMembership(userId, newTier, {
      organizationId: currentMembership.organizationId,
      billingCycle: currentMembership.billingCycle
    });
  }
  
  /**
   * Downgrade membership (takes effect at end of billing cycle)
   */
  downgradeMembership(userId: string, newTier: MembershipTier): {
    success: boolean;
    effectiveDate?: Date;
  } {
    const membership = this.getMembershipByUser(userId);
    if (!membership) {
      return { success: false };
    }
    
    // Schedule downgrade for end of current period
    membership.status = 'active';
    // In production, this would be handled by a job scheduler
    
    console.log(`[Membership] Downgrade scheduled for user ${userId} to ${newTier}`);
    return { 
      success: true, 
      effectiveDate: membership.endDate 
    };
  }
  
  /**
   * Cancel membership
   */
  cancelMembership(userId: string, reason?: string): boolean {
    const membership = this.getMembershipByUser(userId);
    if (!membership) return false;
    
    membership.status = 'cancelled';
    membership.updatedAt = new Date();
    
    console.log(`[Membership] Cancelled for user ${userId}. Reason: ${reason || 'Not provided'}`);
    this.persistData();
    
    return true;
  }
  
  /**
   * Get membership statistics
   */
  getStatistics(): {
    totalMemberships: number;
    byTier: Record<MembershipTier, number>;
    activeUsers: number;
    mrr: number;
    arr: number;
  } {
    const memberships = Array.from(this.memberships.values());
    const byTier: Record<MembershipTier, number> = {
      free: 0, starter: 0, pro: 0, business: 0, enterprise: 0, custom: 0
    };
    
    let mrr = 0;
    
    memberships.forEach(m => {
      byTier[m.tier]++;
      if (m.status === 'active' && m.billingCycle === 'monthly') {
        mrr += m.price;
      } else if (m.status === 'active' && m.billingCycle === 'yearly') {
        mrr += Math.round(m.price / 12);
      }
    });
    
    return {
      totalMemberships: memberships.length,
      byTier,
      activeUsers: memberships.filter(m => m.status === 'active').length,
      mrr,
      arr: mrr * 12
    };
  }
  
  // ============================================================================
  // Private Methods
  // ============================================================================
  
  private getTierIndex(tier: MembershipTier): number {
    const order: MembershipTier[] = ['free', 'starter', 'pro', 'business', 'enterprise', 'custom'];
    return order.indexOf(tier);
  }
  
  private calculateEndDate(billingCycle: 'monthly' | 'yearly'): Date {
    const now = new Date();
    const endDate = new Date(now);
    
    if (billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    return endDate;
  }
  
  private initializeUsage(): MembershipUsage {
    return {
      apiCallsToday: 0,
      apiCallsThisMonth: 0,
      storageUsedGB: 0,
      bandwidthUsedGB: 0,
      usersCount: 1,
      certificationsUsed: 0,
      dreamSpacesUsed: 0,
      lastReset: new Date()
    };
  }
  
  private getCurrentUsage(
    membership: Membership | undefined, 
    limitType: keyof MembershipLimits
  ): number {
    if (!membership) return 0;
    
    switch (limitType) {
      case 'apiCallsPerDay':
        return membership.usage.apiCallsToday;
      case 'apiCallsPerMonth':
        return membership.usage.apiCallsThisMonth;
      case 'storageGB':
        return membership.usage.storageUsedGB;
      case 'bandwidthGB':
        return membership.usage.bandwidthUsedGB;
      case 'users':
        return membership.usage.usersCount;
      case 'certifications':
        return membership.usage.certificationsUsed;
      case 'dreamSpaces':
        return membership.usage.dreamSpacesUsed;
      default:
        return 0;
    }
  }
  
  private loadPersistedData(): void {
    try {
      const stored = localStorage.getItem('membership-data');
      if (stored) {
        const data = JSON.parse(stored);
        data.memberships?.forEach((m: Membership) => {
          m.startDate = new Date(m.startDate);
          m.endDate = m.endDate ? new Date(m.endDate) : undefined;
          m.createdAt = new Date(m.createdAt);
          m.updatedAt = new Date(m.updatedAt);
          m.usage.lastReset = new Date(m.usage.lastReset);
          
          this.memberships.set(m.id, m);
          this.userMemberships.set(m.userId, m.id);
        });
      }
    } catch (error) {
      console.error('[Membership] Error loading persisted data:', error);
    }
  }
  
  private persistData(): void {
    try {
      localStorage.setItem('membership-data', JSON.stringify({
        memberships: Array.from(this.memberships.values())
      }));
    } catch (error) {
      console.error('[Membership] Error persisting data:', error);
    }
  }
  
  destroy(): void {
    this.persistData();
    this.memberships.clear();
    this.userMemberships.clear();
    console.log('[Membership] System destroyed');
  }
}

// Export singleton
export const membershipSystem = MembershipSystem.getInstance();
export default MembershipSystem;
