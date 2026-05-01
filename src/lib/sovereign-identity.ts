// ============================================================================
// TAMV MD-X4™ — Sovereign Identity System v2.0
// Ported from digital-civilization-core/libs/shared-types/creator-identity.ts
// Unified DID + Dignity + Trust contracts for civilizatory identity
// ============================================================================

// ── Sovereign Identity Types ──

export interface SovereignDID {
  did: string;
  method: 'tamv' | 'key' | 'web';
  publicKey: string;
  createdAt: string;
  status: 'active' | 'revoked' | 'suspended';
}

export interface DignityProfile {
  userId: string;
  dignityScore: number;       // 0-100
  reputationScore: number;    // 0-∞ (accumulated)
  trustLevel: number;         // 1-10
  emotionalFingerprint: EmotionalFingerprint;
  biometricHash?: string;     // Cancelable biometric
  immutableUsername?: string;
  lastDignityDecay?: string;
}

export interface EmotionalFingerprint {
  dominantTrait: 'analytical' | 'empathetic' | 'creative' | 'resilient' | 'balanced';
  stability: number;          // 0-1
  coherence: number;          // 0-1
  lastUpdated: string;
}

export interface CreatorManifest {
  creatorDID: string;
  genesisTimestamp: string;
  sovereigntyLevel: 'citizen' | 'creator' | 'guardian' | 'architect' | 'genesis';
  powers: CreatorPower[];
  federationsAccess: string[];
}

export type CreatorPower =
  | 'LOGICAL'
  | 'OBSERVER'
  | 'MODERATOR'
  | 'ECONOMIC_ADMIN'
  | 'SECURITY_SENTINEL'
  | 'GOVERNANCE_VOTE'
  | 'CONTENT_CREATE'
  | 'XR_ARCHITECT'
  | 'AI_ORCHESTRATE'
  | 'GENESIS_AUTHORITY';

// ── Sovereign Identity Engine ──

export class SovereignIdentityEngine {
  private static readonly GENESIS_DID = 'did:tamv:eoct:genesis:2026';

  /**
   * Generate a new sovereign DID for a user
   */
  static async generateDID(userId: string): Promise<SovereignDID> {
    const encoder = new TextEncoder();
    const keyMaterial = `${userId}:${Date.now()}:${crypto.randomUUID()}`;
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(keyMaterial));
    const publicKey = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return {
      did: `did:tamv:${publicKey.slice(0, 32)}`,
      method: 'tamv',
      publicKey,
      createdAt: new Date().toISOString(),
      status: 'active',
    };
  }

  /**
   * Compute dignity score based on user behavior metrics
   */
  static computeDignityScore(metrics: {
    postsCount: number;
    likesReceived: number;
    reportsAgainst: number;
    coursesCompleted: number;
    governanceVotes: number;
    accountAgeDays: number;
  }): number {
    const {
      postsCount, likesReceived, reportsAgainst,
      coursesCompleted, governanceVotes, accountAgeDays
    } = metrics;

    // Base score from activity
    let score = 50;

    // Positive contributions
    score += Math.min(postsCount * 0.5, 10);
    score += Math.min(likesReceived * 0.1, 10);
    score += Math.min(coursesCompleted * 2, 15);
    score += Math.min(governanceVotes * 1, 10);

    // Time-based trust
    score += Math.min(accountAgeDays * 0.02, 5);

    // Negative impact
    score -= reportsAgainst * 5;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Determine sovereignty level from dignity score and roles
   */
  static determineSovereigntyLevel(
    dignityScore: number,
    roles: string[]
  ): CreatorManifest['sovereigntyLevel'] {
    if (roles.includes('admin')) return 'genesis';
    if (roles.includes('moderator') && dignityScore >= 80) return 'guardian';
    if (roles.includes('creator') && dignityScore >= 60) return 'creator';
    if (dignityScore >= 40) return 'citizen';
    return 'citizen';
  }

  /**
   * Map sovereignty level to available powers
   */
  static getPowers(level: CreatorManifest['sovereigntyLevel']): CreatorPower[] {
    const base: CreatorPower[] = ['LOGICAL', 'OBSERVER'];

    switch (level) {
      case 'genesis':
        return [...base, 'MODERATOR', 'ECONOMIC_ADMIN', 'SECURITY_SENTINEL',
          'GOVERNANCE_VOTE', 'CONTENT_CREATE', 'XR_ARCHITECT', 'AI_ORCHESTRATE', 'GENESIS_AUTHORITY'];
      case 'guardian':
        return [...base, 'MODERATOR', 'SECURITY_SENTINEL', 'GOVERNANCE_VOTE', 'CONTENT_CREATE'];
      case 'creator':
        return [...base, 'GOVERNANCE_VOTE', 'CONTENT_CREATE', 'XR_ARCHITECT'];
      case 'citizen':
        return [...base, 'GOVERNANCE_VOTE'];
      default:
        return base;
    }
  }

  /**
   * Build full creator manifest
   */
  static async buildManifest(
    userId: string,
    dignityScore: number,
    roles: string[]
  ): Promise<CreatorManifest> {
    const did = await this.generateDID(userId);
    const level = this.determineSovereigntyLevel(dignityScore, roles);
    const powers = this.getPowers(level);

    // Determine federation access based on level
    const federations: string[] = ['L0_CORE', 'L1_SOCIAL'];
    if (level !== 'citizen') federations.push('L2_ECONOMY', 'L2_XR');
    if (level === 'guardian' || level === 'genesis') federations.push('L3_GOVERNANCE', 'L3_AI', 'L3_EDUCATION');

    return {
      creatorDID: did.did,
      genesisTimestamp: did.createdAt,
      sovereigntyLevel: level,
      powers,
      federationsAccess: federations,
    };
  }
}
