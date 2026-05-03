// ============================================================================
// TAMV MD-X4™ - Economy System
// TCEP Credits, TAU Tokens, and Simbiotic Economy Management
// ============================================================================

export type CurrencyType = 'tcep' | 'tau' | 'mxn' | 'usd';
export type TransactionType = 'reward' | 'purchase' | 'transfer' | 'subscription' | 'refund' | 'gift' | 'lottery';
export type MembershipTier = 'free' | 'premium' | 'vip' | 'elite' | 'celestial' | 'enterprise';

export interface Wallet {
  userId: string;
  balanceTCEP: number;
  balanceTAU: number;
  lockedBalance: number;
  pendingBalance: number;
  membershipTier: MembershipTier;
  membershipExpiresAt?: string;
  lifetimeEarned: number;
  lifetimeSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: CurrencyType;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  fromUserId?: string;
  toUserId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface LotteryDraw {
  id: string;
  name: string;
  description: string;
  status: 'upcoming' | 'open' | 'drawing' | 'completed' | 'cancelled';
  ticketPrice: number;
  maxTickets: number;
  ticketsSold: number;
  prizePool: number;
  startDate: string;
  endDate: string;
  drawDate: string;
  winners?: LotteryWinner[];
  rules: LotteryRules;
}

export interface LotteryTicket {
  id: string;
  drawId: string;
  userId: string;
  ticketNumber: number;
  purchasedAt: string;
  isWinner: boolean;
  prize?: number;
}

export interface LotteryWinner {
  userId: string;
  ticketId: string;
  prize: number;
  rank: number;
}

export interface LotteryRules {
  maxTicketsPerUser: number;
  prizeDistribution: { rank: number; percentage: number }[];
  socialFundPercentage: number;
  operationFeePercentage: number;
}

export interface FenixFund {
  totalPool: number;
  distributed: number;
  contributors: number;
  period: string;
  distribution: {
    creators: number;
    community: number;
    socialDevelopment: number;
  };
}

// ============================================================================
// Membership Tiers Configuration
// ============================================================================

export const MEMBERSHIP_TIERS: Record<MembershipTier, {
  name: string;
  commissionRate: number;
  monthlyPrice: number;
  features: string[];
  color: string;
}> = {
  free: {
    name: 'Free',
    commissionRate: 0.30,
    monthlyPrice: 0,
    features: ['Acceso básico', 'Dream Spaces públicos', 'Chat Isabella limitado'],
    color: 'text-gray-400',
  },
  premium: {
    name: 'Premium',
    commissionRate: 0.25,
    monthlyPrice: 99,
    features: ['Todo lo de Free', 'Dream Spaces privados', 'Chat Isabella ilimitado', 'Soporte prioritario'],
    color: 'text-blue-400',
  },
  vip: {
    name: 'VIP',
    commissionRate: 0.20,
    monthlyPrice: 299,
    features: ['Todo lo de Premium', 'Acceso anticipado', 'Eventos exclusivos', 'Certificaciones gratis'],
    color: 'text-purple-400',
  },
  elite: {
    name: 'Elite',
    commissionRate: 0.15,
    monthlyPrice: 699,
    features: ['Todo lo de VIP', 'API access', 'Dream Spaces ilimitados', 'Representante DAO'],
    color: 'text-amber-400',
  },
  celestial: {
    name: 'Celestial',
    commissionRate: 0.10,
    monthlyPrice: 1499,
    features: ['Todo lo de Elite', 'NFT exclusivos', 'Voto ponderado 2x', 'Acceso fundadores'],
    color: 'text-cyan-400',
  },
  enterprise: {
    name: 'Enterprise',
    commissionRate: 0.08,
    monthlyPrice: 4999,
    features: ['Todo lo de Celestial', 'API dedicada', 'SLA garantizado', 'Soporte 24/7', 'Custom branding'],
    color: 'text-rose-400',
  },
};

// ============================================================================
// Economy System Class
// ============================================================================

export class EconomySystem {
  private static instance: EconomySystem;
  private wallets: Map<string, Wallet> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private lotteryDraws: Map<string, LotteryDraw> = new Map();
  private lotteryTickets: Map<string, LotteryTicket[]> = new Map();
  private fenixFund: FenixFund = {
    totalPool: 125000,
    distributed: 45000,
    contributors: 1250,
    period: '2026-Q1',
    distribution: {
      creators: 25000,
      community: 37500,
      socialDevelopment: 62500,
    },
  };

  private constructor() {
    this.loadPersistedData();
    this.initializeLotteryDraws();
  }

  static getInstance(): EconomySystem {
    if (!EconomySystem.instance) {
      EconomySystem.instance = new EconomySystem();
    }
    return EconomySystem.instance;
  }

  // ============================================================================
  // Wallet Management
  // ============================================================================

  /**
   * Get or create wallet for user
   */
  getWallet(userId: string): Wallet {
    let wallet = this.wallets.get(userId);
    
    if (!wallet) {
      wallet = {
        userId,
        balanceTCEP: 0,
        balanceTAU: 0,
        lockedBalance: 0,
        pendingBalance: 0,
        membershipTier: 'free',
        lifetimeEarned: 0,
        lifetimeSpent: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.wallets.set(userId, wallet);
      this.persistData();
    }

    return wallet;
  }

  /**
   * Update wallet balance
   */
  updateBalance(userId: string, amount: number, currency: 'tcep' | 'tau'): Wallet | null {
    const wallet = this.getWallet(userId);
    
    if (currency === 'tcep') {
      wallet.balanceTCEP += amount;
      if (amount > 0) wallet.lifetimeEarned += amount;
      if (amount < 0) wallet.lifetimeSpent += Math.abs(amount);
    } else {
      wallet.balanceTAU += amount;
    }

    wallet.updatedAt = new Date().toISOString();
    this.wallets.set(userId, wallet);
    this.persistData();

    return wallet;
  }

  /**
   * Lock balance for pending transaction
   */
  lockBalance(userId: string, amount: number): boolean {
    const wallet = this.getWallet(userId);
    
    if (wallet.balanceTCEP < amount) return false;

    wallet.balanceTCEP -= amount;
    wallet.lockedBalance += amount;
    wallet.updatedAt = new Date().toISOString();
    
    this.wallets.set(userId, wallet);
    this.persistData();
    
    return true;
  }

  /**
   * Unlock locked balance
   */
  unlockBalance(userId: string, amount: number, success: boolean): boolean {
    const wallet = this.getWallet(userId);
    
    if (wallet.lockedBalance < amount) return false;

    wallet.lockedBalance -= amount;
    if (success) {
      wallet.lifetimeSpent += amount;
    } else {
      wallet.balanceTCEP += amount;
    }
    wallet.updatedAt = new Date().toISOString();
    
    this.wallets.set(userId, wallet);
    this.persistData();
    
    return true;
  }

  /**
   * Upgrade membership tier
   */
  upgradeMembership(userId: string, tier: MembershipTier): Wallet {
    const wallet = this.getWallet(userId);
    wallet.membershipTier = tier;
    wallet.membershipExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    wallet.updatedAt = new Date().toISOString();
    
    this.wallets.set(userId, wallet);
    this.persistData();

    // Create transaction
    this.createTransaction({
      userId,
      type: 'subscription',
      amount: MEMBERSHIP_TIERS[tier].monthlyPrice,
      currency: 'mxn',
      description: `Upgrade to ${MEMBERSHIP_TIERS[tier].name}`,
      status: 'completed',
    });

    return wallet;
  }

  // ============================================================================
  // Transactions
  // ============================================================================

  /**
   * Create transaction
   */
  createTransaction(params: {
    userId: string;
    type: TransactionType;
    amount: number;
    currency: CurrencyType;
    description: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    fromUserId?: string;
    toUserId?: string;
    metadata?: Record<string, any>;
  }): Transaction {
    const transaction: Transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...params,
      createdAt: new Date().toISOString(),
    };

    this.transactions.set(transaction.id, transaction);
    this.persistData();

    return transaction;
  }

  /**
   * Get user transactions
   */
  getUserTransactions(userId: string, limit: number = 50): Transaction[] {
    return Array.from(this.transactions.values())
      .filter(t => t.userId === userId || t.fromUserId === userId || t.toUserId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  /**
   * Transfer credits between users
   */
  transferCredits(fromUserId: string, toUserId: string, amount: number, description: string): Transaction | null {
    const fromWallet = this.getWallet(fromUserId);
    
    if (fromWallet.balanceTCEP < amount) {
      return this.createTransaction({
        userId: fromUserId,
        type: 'transfer',
        amount,
        currency: 'tcep',
        description,
        status: 'failed',
        fromUserId,
        toUserId,
        metadata: { reason: 'Insufficient balance' },
      });
    }

    // Deduct from sender
    this.updateBalance(fromUserId, -amount, 'tcep');
    
    // Add to receiver
    this.updateBalance(toUserId, amount, 'tcep');

    return this.createTransaction({
      userId: fromUserId,
      type: 'transfer',
      amount,
      currency: 'tcep',
      description,
      status: 'completed',
      fromUserId,
      toUserId,
    });
  }

  /**
   * Reward user
   */
  rewardUser(userId: string, amount: number, reason: string): Transaction {
    this.updateBalance(userId, amount, 'tcep');

    return this.createTransaction({
      userId,
      type: 'reward',
      amount,
      currency: 'tcep',
      description: reason,
      status: 'completed',
    });
  }

  // ============================================================================
  // Lottery System
  // ============================================================================

  /**
   * Initialize lottery draws
   */
  private initializeLotteryDraws(): void {
    const activeDraw: LotteryDraw = {
      id: 'lottery-001',
      name: 'Sorteo Civilizatorio Q1 2026',
      description: 'Gran sorteo con redistribución ética. 20,000 oportunidades a $1 USD.',
      status: 'open',
      ticketPrice: 1,
      maxTickets: 20000,
      ticketsSold: 8750,
      prizePool: 8750,
      startDate: '2026-01-01T00:00:00Z',
      endDate: '2026-03-31T23:59:59Z',
      drawDate: '2026-04-01T12:00:00Z',
      rules: {
        maxTicketsPerUser: 100,
        prizeDistribution: [
          { rank: 1, percentage: 50 },
          { rank: 2, percentage: 15 },
          { rank: 3, percentage: 10 },
          { rank: 4, percentage: 5 },
        ],
        socialFundPercentage: 30,
        operationFeePercentage: 20,
      },
    };

    this.lotteryDraws.set(activeDraw.id, activeDraw);
  }

  /**
   * Get active lottery draws
   */
  getActiveDraws(): LotteryDraw[] {
    return Array.from(this.lotteryDraws.values()).filter(d => d.status === 'open');
  }

  /**
   * Get lottery draw by ID
   */
  getDraw(drawId: string): LotteryDraw | undefined {
    return this.lotteryDraws.get(drawId);
  }

  /**
   * Purchase lottery tickets
   */
  purchaseTickets(userId: string, drawId: string, quantity: number): { success: boolean; tickets?: LotteryTicket[]; error?: string } {
    const draw = this.lotteryDraws.get(drawId);
    if (!draw) return { success: false, error: 'Draw not found' };

    if (draw.status !== 'open') return { success: false, error: 'Draw is not open' };
    if (draw.ticketsSold + quantity > draw.maxTickets) {
      return { success: false, error: 'Not enough tickets available' };
    }

    // Check user ticket limit
    const userTickets = this.getUserTickets(userId, drawId);
    if (userTickets.length + quantity > draw.rules.maxTicketsPerUser) {
      return { success: false, error: `Maximum ${draw.rules.maxTicketsPerUser} tickets per user` };
    }

    // Calculate cost
    const cost = quantity * draw.ticketPrice;

    // Create tickets
    const tickets: LotteryTicket[] = [];
    for (let i = 0; i < quantity; i++) {
      tickets.push({
        id: `ticket-${drawId}-${draw.ticketsSold + i + 1}`,
        drawId,
        userId,
        ticketNumber: draw.ticketsSold + i + 1,
        purchasedAt: new Date().toISOString(),
        isWinner: false,
      });
    }

    // Update draw
    draw.ticketsSold += quantity;
    draw.prizePool += cost;
    this.lotteryDraws.set(drawId, draw);

    // Store tickets
    if (!this.lotteryTickets.has(drawId)) {
      this.lotteryTickets.set(drawId, []);
    }
    this.lotteryTickets.get(drawId)!.push(...tickets);

    // Create transaction
    this.createTransaction({
      userId,
      type: 'lottery',
      amount: cost,
      currency: 'usd',
      description: `Purchased ${quantity} tickets for ${draw.name}`,
      status: 'completed',
      metadata: { drawId, ticketIds: tickets.map(t => t.id) },
    });

    this.persistData();

    return { success: true, tickets };
  }

  /**
   * Get user tickets for draw
   */
  getUserTickets(userId: string, drawId: string): LotteryTicket[] {
    const drawTickets = this.lotteryTickets.get(drawId) || [];
    return drawTickets.filter(t => t.userId === userId);
  }

  /**
   * Execute lottery draw
   */
  executeDraw(drawId: string): LotteryWinner[] {
    const draw = this.lotteryDraws.get(drawId);
    if (!draw || draw.status !== 'open') return [];

    draw.status = 'drawing';
    this.lotteryDraws.set(drawId, draw);

    const tickets = this.lotteryTickets.get(drawId) || [];
    const winners: LotteryWinner[] = [];

    // Select winners based on prize distribution
    const availableTickets = [...tickets];
    
    for (const prize of draw.rules.prizeDistribution) {
      if (availableTickets.length === 0) break;

      const randomIndex = Math.floor(Math.random() * availableTickets.length);
      const winningTicket = availableTickets[randomIndex];
      
      const prizeAmount = draw.prizePool * (prize.percentage / 100);
      
      winners.push({
        userId: winningTicket.userId,
        ticketId: winningTicket.id,
        prize: prizeAmount,
        rank: prize.rank,
      });

      // Mark ticket as winner
      winningTicket.isWinner = true;
      winningTicket.prize = prizeAmount;

      // Remove from available tickets
      availableTickets.splice(randomIndex, 1);
    }

    // Update draw
    draw.winners = winners;
    draw.status = 'completed';
    this.lotteryDraws.set(drawId, draw);

    // Distribute prizes
    for (const winner of winners) {
      this.rewardUser(winner.userId, winner.prize, `Lottery prize - Rank ${winner.rank}`);
    }

    // Distribute to social fund
    const socialFundAmount = draw.prizePool * (draw.rules.socialFundPercentage / 100);
    this.fenixFund.totalPool += socialFundAmount;
    this.fenixFund.distribution.socialDevelopment += socialFundAmount;

    this.persistData();

    return winners;
  }

  // ============================================================================
  // Fénix Fund
  // ============================================================================

  /**
   * Get Fénix Fund status
   */
  getFenixFund(): FenixFund {
    return { ...this.fenixFund };
  }

  /**
   * Contribute to Fénix Fund
   */
  contributeToFenix(userId: string, amount: number): void {
    this.fenixFund.totalPool += amount;
    this.fenixFund.contributors++;
    this.persistData();
  }

  /**
   * Get commission rate for user
   */
  getCommissionRate(userId: string): number {
    const wallet = this.getWallet(userId);
    return MEMBERSHIP_TIERS[wallet.membershipTier].commissionRate;
  }

  // ============================================================================
  // Statistics
  // ============================================================================

  /**
   * Get economy statistics
   */
  getStatistics(): {
    totalWallets: number;
    totalTCEPInCirculation: number;
    totalTAUInCirculation: number;
    totalTransactions: number;
    activeDraws: number;
    fenixFundTotal: number;
  } {
    const wallets = Array.from(this.wallets.values());
    
    return {
      totalWallets: wallets.length,
      totalTCEPInCirculation: wallets.reduce((sum, w) => sum + w.balanceTCEP, 0),
      totalTAUInCirculation: wallets.reduce((sum, w) => sum + w.balanceTAU, 0),
      totalTransactions: this.transactions.size,
      activeDraws: this.getActiveDraws().length,
      fenixFundTotal: this.fenixFund.totalPool,
    };
  }

  // ============================================================================
  // Persistence
  // ============================================================================

  private loadPersistedData(): void {
    try {
      const stored = localStorage.getItem('economy-data');
      if (stored) {
        const data = JSON.parse(stored);
        data.wallets?.forEach((w: Wallet) => this.wallets.set(w.userId, w));
        data.transactions?.forEach((t: Transaction) => this.transactions.set(t.id, t));
        if (data.fenixFund) this.fenixFund = data.fenixFund;
      }
    } catch (error) {
      console.error('[Economy] Error loading persisted data:', error);
    }
  }

  private persistData(): void {
    try {
      localStorage.setItem('economy-data', JSON.stringify({
        wallets: Array.from(this.wallets.values()),
        transactions: Array.from(this.transactions.values()).slice(-500),
        fenixFund: this.fenixFund,
      }));
    } catch (error) {
      console.error('[Economy] Error persisting data:', error);
    }
  }

  destroy(): void {
    this.persistData();
    this.wallets.clear();
    this.transactions.clear();
    this.lotteryDraws.clear();
    this.lotteryTickets.clear();
    console.log('[Economy] System destroyed');
  }

  // ============================================================================
  // Constitutional Runtime Adapter
  // ============================================================================
  static async handleIntent(intent: string, payload: unknown, permit: { constraints?: Record<string, unknown> }) {
    const economy = EconomySystem.getInstance();

    switch (intent) {
      case 'wallet.transfer':
      case 'economy.transfer': {
        const p = payload as { fromUserId: string; toUserId: string; amount: number; description?: string };
        const maxAmount = Number(permit.constraints?.maxAmount ?? Number.POSITIVE_INFINITY);
        if (!p.fromUserId || !p.toUserId || !Number.isFinite(p.amount) || p.amount <= 0) {
          throw new Error('INVALID_TRANSFER_PAYLOAD');
        }
        if (p.amount > maxAmount) throw new Error('TRANSFER_AMOUNT_EXCEEDS_POLICY_LIMIT');

        const tx = economy.transferCredits(p.fromUserId, p.toUserId, p.amount, p.description ?? 'Constitutional transfer');
        if (!tx || tx.status !== 'completed') throw new Error('TRANSFER_FAILED');
        return { success: true, transaction: tx };
      }
      case 'wallet.create': {
        const p = payload as { ownerId: string };
        if (!p.ownerId) throw new Error('INVALID_WALLET_CREATE_PAYLOAD');
        const wallet = economy.getWallet(p.ownerId);
        return { success: true, wallet };
      }
      case 'wallet.balance.get': {
        const p = payload as { ownerId: string };
        if (!p.ownerId) throw new Error('INVALID_BALANCE_PAYLOAD');
        const wallet = economy.getWallet(p.ownerId);
        return { success: true, wallet };
      }
      default:
        throw new Error(`UNKNOWN_ECONOMY_INTENT: ${intent}`);
    }
  }
}

// Export singleton
export const economy = EconomySystem.getInstance();
export default EconomySystem;
