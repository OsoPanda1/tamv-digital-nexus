// ============================================================================
// TAMV MD-X4™ - Social Core System
// Social Network with EOCT Reputation System
// ============================================================================

import { MembershipSystem, MembershipTier } from './MembershipSystem';

// ============================================================================
// Types and Interfaces
// ============================================================================

export type EntityType = 'person' | 'community' | 'organization' | 'node' | 'bot';
export type ReputationLevel = 1 | 2 | 3 | 4 | 5;
export type RelationshipType = 'follow' | 'friend' | 'collaborate' | 'mentor' | 'member';

export interface SocialEntity {
  id: string;
  type: EntityType;
  name: string;
  avatar?: string;
  bio?: string;
  reputation: EOCTReputation;
  memberships: string[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}

export interface Person extends SocialEntity {
  type: 'person';
  userId: string;
  username: string;
  verified: boolean;
  badges: Badge[];
  communities: string[];
  following: string[];
  followers: string[];
  friends: string[];
}

export interface Community extends SocialEntity {
  type: 'community';
  description: string;
  category: string;
  members: string[];
  moderators: string[];
  rules: CommunityRule[];
  isPublic: boolean;
  membershipTier?: MembershipTier;
}

export interface FederationNode extends SocialEntity {
  type: 'node';
  region: string;
  country: string;
  endpoint: string;
  status: 'online' | 'offline' | 'maintenance';
  capabilities: NodeCapabilities;
  metrics: NodeMetrics;
}

export interface NodeCapabilities {
  quantum: boolean;
  bci: boolean;
  xr: boolean;
  ai: boolean;
}

export interface NodeMetrics {
  latency: number;
  load: number;
  health: number;
  uptime: number;
}

export interface EOCTReputation {
  score: number;          // 0-100
  level: ReputationLevel;
  factors: {
    antiquity: number;      // Time in system
    contributions: number;  // Contributions made
    reputation: number;     // Peer reputation
    verifications: number;  // Completed verifications
    certifications: number; // Courses completed
  };
  history: ReputationEvent[];
  lastCalculated: Date;
}

export interface ReputationEvent {
  id: string;
  timestamp: Date;
  type: 'contribution' | 'endorsement' | 'certification' | 'violation' | 'achievement';
  description: string;
  points: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface CommunityRule {
  id: string;
  title: string;
  description: string;
  enforcement: 'warning' | 'removal' | 'ban';
}

export interface Relationship {
  id: string;
  from: string;
  to: string;
  type: RelationshipType;
  since: Date;
  strength: number;  // 0-1 based on interaction
}

export interface SocialPost {
  id: string;
  authorId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'link' | 'dreamspace';
  visibility: 'public' | 'followers' | 'friends' | 'community' | 'private';
  communityId?: string;
  tags: string[];
  mentions: string[];
  reactions: Reaction[];
  comments: Comment[];
  shares: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reaction {
  userId: string;
  type: 'like' | 'love' | 'support' | 'celebrate' | 'curious' | 'insightful';
  createdAt: Date;
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  reactions: Reaction[];
  replies: Comment[];
  createdAt: Date;
}

// ============================================================================
// EOCT Calculator
// ============================================================================

class EOCTCalculator {
  private weights = {
    antiquity: 0.15,
    contributions: 0.25,
    reputation: 0.25,
    verifications: 0.20,
    certifications: 0.15
  };

  calculate(factors: EOCTReputation['factors']): { score: number; level: ReputationLevel } {
    const normalized = {
      antiquity: Math.min(factors.antiquity / 365, 1),          // Max 1 year
      contributions: Math.min(factors.contributions / 100, 1), // Max 100 contributions
      reputation: Math.min(factors.reputation / 100, 1),        // Already 0-100
      verifications: Math.min(factors.verifications / 5, 1),   // Max 5 verifications
      certifications: Math.min(factors.certifications / 20, 1) // Max 20 certifications
    };

    const score = 
      normalized.antiquity * this.weights.antiquity +
      normalized.contributions * this.weights.contributions +
      normalized.reputation * this.weights.reputation +
      normalized.verifications * this.weights.verifications +
      normalized.certifications * this.weights.certifications;

    const level = this.calculateLevel(score * 100);

    return { score: Math.round(score * 100), level };
  }

  private calculateLevel(score: number): ReputationLevel {
    if (score >= 80) return 5;
    if (score >= 60) return 4;
    if (score >= 40) return 3;
    if (score >= 20) return 2;
    return 1;
  }

  addPoints(
    reputation: EOCTReputation,
    type: ReputationEvent['type'],
    points: number,
    description: string
  ): EOCTReputation {
    const event: ReputationEvent = {
      id: `rep-${Date.now()}`,
      timestamp: new Date(),
      type,
      description,
      points
    };

    // Update relevant factor
    switch (type) {
      case 'contribution':
        reputation.factors.contributions += 1;
        break;
      case 'endorsement':
        reputation.factors.reputation = Math.min(100, reputation.factors.reputation + points);
        break;
      case 'certification':
        reputation.factors.certifications += 1;
        break;
      case 'violation':
        reputation.factors.reputation = Math.max(0, reputation.factors.reputation - points);
        break;
    }

    reputation.history.push(event);
    
    // Recalculate
    const { score, level } = this.calculate(reputation.factors);
    reputation.score = score;
    reputation.level = level;
    reputation.lastCalculated = new Date();

    return reputation;
  }
}

// ============================================================================
// Social Core System Class
// ============================================================================

export class SocialCoreSystem {
  private static instance: SocialCoreSystem;
  
  private entities: Map<string, SocialEntity> = new Map();
  private persons: Map<string, Person> = new Map();
  private communities: Map<string, Community> = new Map();
  private nodes: Map<string, FederationNode> = new Map();
  private relationships: Map<string, Relationship> = new Map();
  private posts: Map<string, SocialPost> = new Map();
  
  private eoctCalculator = new EOCTCalculator();
  private membershipSystem: MembershipSystem;

  private constructor() {
    this.membershipSystem = MembershipSystem.getInstance();
    this.loadPersistedData();
    this.initializeFederationNodes();
  }

  static getInstance(): SocialCoreSystem {
    if (!SocialCoreSystem.instance) {
      SocialCoreSystem.instance = new SocialCoreSystem();
    }
    return SocialCoreSystem.instance;
  }

  // ============================================================================
  // Person Management
  // ============================================================================

  createPerson(data: {
    userId: string;
    username: string;
    name: string;
    avatar?: string;
    bio?: string;
  }): Person {
    const existingPerson = this.getPersonByUserId(data.userId);
    if (existingPerson) return existingPerson;

    const person: Person = {
      id: `person-${data.userId}`,
      type: 'person',
      userId: data.userId,
      username: data.username,
      name: data.name,
      avatar: data.avatar,
      bio: data.bio,
      verified: false,
      badges: [],
      communities: [],
      following: [],
      followers: [],
      friends: [],
      reputation: this.createInitialReputation(),
      memberships: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.persons.set(person.id, person);
    this.entities.set(person.id, person);
    this.persistData();

    console.log(`[Social] Created person: ${data.username}`);
    return person;
  }

  getPersonByUserId(userId: string): Person | undefined {
    for (const person of this.persons.values()) {
      if (person.userId === userId) return person;
    }
    return undefined;
  }

  getPerson(personId: string): Person | undefined {
    return this.persons.get(personId);
  }

  updatePerson(userId: string, updates: Partial<Person>): Person | null {
    const person = this.getPersonByUserId(userId);
    if (!person) return null;

    Object.assign(person, updates, { updatedAt: new Date() });
    this.persons.set(person.id, person);
    this.entities.set(person.id, person);
    this.persistData();

    return person;
  }

  // ============================================================================
  // Community Management
  // ============================================================================

  createCommunity(data: {
    name: string;
    description: string;
    category: string;
    creatorId: string;
    isPublic?: boolean;
    membershipTier?: MembershipTier;
  }): Community {
    const community: Community = {
      id: `community-${Date.now()}`,
      type: 'community',
      name: data.name,
      description: data.description,
      category: data.category,
      members: [data.creatorId],
      moderators: [data.creatorId],
      rules: [],
      isPublic: data.isPublic ?? true,
      membershipTier: data.membershipTier,
      reputation: this.createInitialReputation(),
      memberships: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.communities.set(community.id, community);
    this.entities.set(community.id, community);

    // Add community to creator's communities
    const creator = this.getPersonByUserId(data.creatorId);
    if (creator) {
      creator.communities.push(community.id);
      this.persons.set(creator.id, creator);
    }

    this.persistData();
    console.log(`[Social] Created community: ${data.name}`);
    return community;
  }

  getCommunity(communityId: string): Community | undefined {
    return this.communities.get(communityId);
  }

  joinCommunity(userId: string, communityId: string): boolean {
    const person = this.getPersonByUserId(userId);
    const community = this.communities.get(communityId);

    if (!person || !community) return false;

    // Check membership tier if required
    if (community.membershipTier) {
      const membership = this.membershipSystem.getMembershipByUser(userId);
      const requiredTier = community.membershipTier;
      
      const tierOrder: MembershipTier[] = ['free', 'starter', 'pro', 'business', 'enterprise', 'custom'];
      const userTierIndex = tierOrder.indexOf(membership?.tier || 'free');
      const requiredTierIndex = tierOrder.indexOf(requiredTier);

      if (userTierIndex < requiredTierIndex) {
        console.log(`[Social] User ${userId} doesn't meet tier requirement for community ${communityId}`);
        return false;
      }
    }

    if (!community.members.includes(userId)) {
      community.members.push(userId);
      this.communities.set(communityId, community);
    }

    if (!person.communities.includes(communityId)) {
      person.communities.push(communityId);
      this.persons.set(person.id, person);
    }

    this.persistData();
    return true;
  }

  leaveCommunity(userId: string, communityId: string): boolean {
    const person = this.getPersonByUserId(userId);
    const community = this.communities.get(communityId);

    if (!person || !community) return false;

    community.members = community.members.filter(id => id !== userId);
    person.communities = person.communities.filter(id => id !== communityId);

    this.communities.set(communityId, community);
    this.persons.set(person.id, person);
    this.persistData();

    return true;
  }

  // ============================================================================
  // Federation Nodes
  // ============================================================================

  private initializeFederationNodes(): void {
    // Initialize 48 federation nodes
    const nodeData = [
      // México (6 nodos)
      { id: 'MX-CEN', name: 'México Central', region: 'América del Norte', country: 'México', latency: 12, load: 45, health: 98 },
      { id: 'MX-NOR', name: 'México Norte', region: 'América del Norte', country: 'México', latency: 18, load: 32, health: 95 },
      { id: 'MX-SUR', name: 'México Sur', region: 'América del Norte', country: 'México', latency: 15, load: 28, health: 97 },
      { id: 'MX-OCC', name: 'México Occidente', region: 'América del Norte', country: 'México', latency: 14, load: 55, health: 94 },
      { id: 'MX-BAJ', name: 'México Bajío', region: 'América del Norte', country: 'México', latency: 16, load: 42, health: 96 },
      { id: 'MX-SEP', name: 'México Sureste', region: 'América del Norte', country: 'México', latency: 19, load: 38, health: 93 },
      // Brasil (8 nodos)
      { id: 'BR-LE', name: 'Brasil Leste', region: 'América del Sur', country: 'Brasil', latency: 67, load: 78, health: 91 },
      { id: 'BR-NE', name: 'Brasil Nordeste', region: 'América del Sur', country: 'Brasil', latency: 72, load: 45, health: 94 },
      { id: 'BR-NO', name: 'Brasil Norte', region: 'América del Sur', country: 'Brasil', latency: 85, load: 32, health: 89 },
      { id: 'BR-SE', name: 'Brasil Sudeste', region: 'América del Sur', country: 'Brasil', latency: 63, load: 68, health: 95 },
      { id: 'BR-SU', name: 'Brasil Sur', region: 'América del Sur', country: 'Brasil', latency: 70, load: 52, health: 92 },
      { id: 'BR-CO', name: 'Brasil Centro-Oeste', region: 'América del Sur', country: 'Brasil', latency: 95, load: 85, health: 78 },
      { id: 'BR-DF', name: 'Brasil Distrito Federal', region: 'América del Sur', country: 'Brasil', latency: 65, load: 48, health: 96 },
      { id: 'BR-RJ', name: 'Brasil Río', region: 'América del Sur', country: 'Brasil', latency: 68, load: 72, health: 93 },
      // Argentina (5 nodos)
      { id: 'AR-BA', name: 'Argentina Buenos Aires', region: 'América del Sur', country: 'Argentina', latency: 89, load: 56, health: 94 },
      { id: 'AR-CEN', name: 'Argentina Centro', region: 'América del Sur', country: 'Argentina', latency: 92, load: 38, health: 91 },
      { id: 'AR-NOR', name: 'Argentina Norte', region: 'América del Sur', country: 'Argentina', latency: 98, load: 29, health: 88 },
      { id: 'AR-SUR', name: 'Argentina Sur', region: 'América del Sur', country: 'Argentina', latency: 105, load: 22, health: 86 },
      { id: 'AR-CUY', name: 'Argentina Cuyo', region: 'América del Sur', country: 'Argentina', latency: 95, load: 35, health: 90 },
      // Colombia (5 nodos)
      { id: 'CO-BOG', name: 'Colombia Bogotá', region: 'América del Sur', country: 'Colombia', latency: 55, load: 62, health: 95 },
      { id: 'CO-MED', name: 'Colombia Medellín', region: 'América del Sur', country: 'Colombia', latency: 58, load: 48, health: 93 },
      { id: 'CO-CAL', name: 'Colombia Cali', region: 'América del Sur', country: 'Colombia', latency: 60, load: 42, health: 91 },
      { id: 'CO-CAR', name: 'Colombia Caribe', region: 'América del Sur', country: 'Colombia', latency: 62, load: 35, health: 89 },
      { id: 'CO-PAC', name: 'Colombia Pacífico', region: 'América del Sur', country: 'Colombia', latency: 65, load: 28, health: 87 },
      // Chile (3 nodos)
      { id: 'CL-NOR', name: 'Chile Norte', region: 'América del Sur', country: 'Chile', latency: 95, load: 38, health: 92 },
      { id: 'CL-CEN', name: 'Chile Central', region: 'América del Sur', country: 'Chile', latency: 92, load: 55, health: 94 },
      { id: 'CL-SUR', name: 'Chile Sur', region: 'América del Sur', country: 'Chile', latency: 100, load: 32, health: 90 },
      // Perú (3 nodos)
      { id: 'PE-LIM', name: 'Perú Lima', region: 'América del Sur', country: 'Perú', latency: 68, load: 52, health: 93 },
      { id: 'PE-ARE', name: 'Perú Arequipa', region: 'América del Sur', country: 'Perú', latency: 72, load: 38, health: 91 },
      { id: 'PE-CUS', name: 'Perú Cusco', region: 'América del Sur', country: 'Perú', latency: 78, load: 28, health: 88 },
      // España (4 nodos)
      { id: 'ES-MAD', name: 'España Madrid', region: 'Europa', country: 'España', latency: 145, load: 58, health: 96 },
      { id: 'ES-BCN', name: 'España Barcelona', region: 'Europa', country: 'España', latency: 148, load: 52, health: 95 },
      { id: 'ES-VAL', name: 'España Valencia', region: 'Europa', country: 'España', latency: 150, load: 42, health: 93 },
      { id: 'ES-AND', name: 'España Andalucía', region: 'Europa', country: 'España', latency: 152, load: 38, health: 91 },
      // Estados Unidos (4 nodos)
      { id: 'US-EAST', name: 'US East', region: 'América del Norte', country: 'Estados Unidos', latency: 35, load: 68, health: 97 },
      { id: 'US-WEST', name: 'US West', region: 'América del Norte', country: 'Estados Unidos', latency: 42, load: 55, health: 96 },
      { id: 'US-CENT', name: 'US Central', region: 'América del Norte', country: 'Estados Unidos', latency: 38, load: 48, health: 95 },
      { id: 'US-SOUTH', name: 'US South', region: 'América del Norte', country: 'Estados Unidos', latency: 40, load: 42, health: 94 },
      // Ecuador (2 nodos)
      { id: 'EC-UIO', name: 'Ecuador Quito', region: 'América del Sur', country: 'Ecuador', latency: 72, load: 45, health: 92 },
      { id: 'EC-GYE', name: 'Ecuador Guayaquil', region: 'América del Sur', country: 'Ecuador', latency: 75, load: 38, health: 90 },
      // Venezuela (2 nodos)
      { id: 'VE-CCS', name: 'Venezuela Caracas', region: 'América del Sur', country: 'Venezuela', latency: 85, load: 72, health: 82 },
      { id: 'VE-MAR', name: 'Venezuela Maracaibo', region: 'América del Sur', country: 'Venezuela', latency: 88, load: 48, health: 85 },
      // Centroamérica (3 nodos)
      { id: 'GT-GUA', name: 'Guatemala', region: 'Centroamérica', country: 'Guatemala', latency: 45, load: 35, health: 90 },
      { id: 'CR-SJO', name: 'Costa Rica', region: 'Centroamérica', country: 'Costa Rica', latency: 52, load: 42, health: 92 },
      { id: 'PA-PTY', name: 'Panamá', region: 'Centroamérica', country: 'Panamá', latency: 48, load: 55, health: 94 }
    ];

    nodeData.forEach(data => {
      const node: FederationNode = {
        id: data.id,
        type: 'node',
        name: data.name,
        region: data.region,
        country: data.country,
        endpoint: `https://${data.id.toLowerCase()}.tamv.network`,
        status: data.health > 85 ? 'online' : data.health > 70 ? 'maintenance' : 'offline',
        capabilities: {
          quantum: data.health > 90,
          bci: data.health > 80,
          xr: data.health > 75,
          ai: true
        },
        metrics: {
          latency: data.latency,
          load: data.load,
          health: data.health,
          uptime: 30
        },
        reputation: this.createInitialReputation(),
        memberships: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.nodes.set(node.id, node);
      this.entities.set(node.id, node);
    });

    console.log(`[Social] Initialized ${this.nodes.size} federation nodes`);
  }

  getFederationNodes(): FederationNode[] {
    return Array.from(this.nodes.values());
  }

  getVisibleNodes(userId: string): FederationNode[] {
    const visibleCount = this.membershipSystem.getVisibleNodes(userId);
    const nodes = this.getFederationNodes();
    
    if (visibleCount === 0) return [];
    if (visibleCount === -1 || visibleCount >= nodes.length) return nodes;
    
    return nodes.slice(0, visibleCount);
  }

  getNode(nodeId: string): FederationNode | undefined {
    return this.nodes.get(nodeId);
  }

  // ============================================================================
  // Relationships
  // ============================================================================

  followUser(followerId: string, followingId: string): boolean {
    const follower = this.getPersonByUserId(followerId);
    const following = this.getPersonByUserId(followingId);

    if (!follower || !following) return false;

    if (!follower.following.includes(following.userId)) {
      follower.following.push(following.userId);
      this.persons.set(follower.id, follower);
    }

    if (!following.followers.includes(follower.userId)) {
      following.followers.push(follower.userId);
      this.persons.set(following.id, following);
    }

    this.createRelationship(followerId, followingId, 'follow');
    this.persistData();

    return true;
  }

  unfollowUser(followerId: string, followingId: string): boolean {
    const follower = this.getPersonByUserId(followerId);
    const following = this.getPersonByUserId(followingId);

    if (!follower || !following) return false;

    follower.following = follower.following.filter(id => id !== following.userId);
    following.followers = following.followers.filter(id => id !== follower.userId);

    this.persons.set(follower.id, follower);
    this.persons.set(following.id, following);
    this.persistData();

    return true;
  }

  private createRelationship(from: string, to: string, type: RelationshipType): Relationship {
    const id = `rel-${from}-${to}-${type}`;
    let relationship = this.relationships.get(id);

    if (!relationship) {
      relationship = {
        id,
        from,
        to,
        type,
        since: new Date(),
        strength: 0.5
      };
      this.relationships.set(id, relationship);
    }

    return relationship;
  }

  // ============================================================================
  // Reputation (EOCT)
  // ============================================================================

  private createInitialReputation(): EOCTReputation {
    return {
      score: 0,
      level: 1,
      factors: {
        antiquity: 0,
        contributions: 0,
        reputation: 50, // Start neutral
        verifications: 0,
        certifications: 0
      },
      history: [],
      lastCalculated: new Date()
    };
  }

  addReputationPoints(
    userId: string,
    type: ReputationEvent['type'],
    points: number,
    description: string
  ): EOCTReputation | null {
    const person = this.getPersonByUserId(userId);
    if (!person) return null;

    person.reputation = this.eoctCalculator.addPoints(
      person.reputation,
      type,
      points,
      description
    );

    this.persons.set(person.id, person);
    this.persistData();

    return person.reputation;
  }

  getReputation(userId: string): EOCTReputation | null {
    const person = this.getPersonByUserId(userId);
    return person?.reputation || null;
  }

  // ============================================================================
  // Posts
  // ============================================================================

  createPost(data: {
    authorId: string;
    content: string;
    type: SocialPost['type'];
    visibility?: SocialPost['visibility'];
    communityId?: string;
    tags?: string[];
    mentions?: string[];
  }): SocialPost {
    const post: SocialPost = {
      id: `post-${Date.now()}`,
      authorId: data.authorId,
      content: data.content,
      type: data.type,
      visibility: data.visibility || 'public',
      communityId: data.communityId,
      tags: data.tags || [],
      mentions: data.mentions || [],
      reactions: [],
      comments: [],
      shares: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.posts.set(post.id, post);

    // Add contribution point
    this.addReputationPoints(data.authorId, 'contribution', 1, 'Created a post');

    this.persistData();
    return post;
  }

  getPost(postId: string): SocialPost | undefined {
    return this.posts.get(postId);
  }

  getFeed(userId: string, options?: { limit?: number; offset?: number }): SocialPost[] {
    const person = this.getPersonByUserId(userId);
    if (!person) return [];

    const following = person.following;
    const limit = options?.limit || 20;
    const offset = options?.offset || 0;

    const feed = Array.from(this.posts.values())
      .filter(post => {
        if (post.visibility === 'public') return true;
        if (post.visibility === 'followers' && following.includes(post.authorId)) return true;
        if (post.visibility === 'friends' && person.friends.includes(post.authorId)) return true;
        if (post.authorId === userId) return true;
        return false;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);

    return feed;
  }

  // ============================================================================
  // Statistics
  // ============================================================================

  getStatistics(): {
    totalUsers: number;
    totalCommunities: number;
    totalNodes: number;
    totalPosts: number;
    activeUsers: number;
    averageReputation: number;
  } {
    const persons = Array.from(this.persons.values());
    const reputations = persons.map(p => p.reputation.score);

    return {
      totalUsers: persons.length,
      totalCommunities: this.communities.size,
      totalNodes: this.nodes.size,
      totalPosts: this.posts.size,
      activeUsers: persons.filter(p => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return p.updatedAt > weekAgo;
      }).length,
      averageReputation: reputations.length > 0
        ? reputations.reduce((a, b) => a + b, 0) / reputations.length
        : 0
    };
  }

  // ============================================================================
  // Persistence
  // ============================================================================

  private loadPersistedData(): void {
    try {
      const stored = localStorage.getItem('social-data');
      if (stored) {
        const data = JSON.parse(stored);
        
        data.persons?.forEach((p: Person) => {
          p.createdAt = new Date(p.createdAt);
          p.updatedAt = new Date(p.updatedAt);
          p.reputation.lastCalculated = new Date(p.reputation.lastCalculated);
          this.persons.set(p.id, p);
          this.entities.set(p.id, p);
        });

        data.communities?.forEach((c: Community) => {
          c.createdAt = new Date(c.createdAt);
          c.updatedAt = new Date(c.updatedAt);
          this.communities.set(c.id, c);
          this.entities.set(c.id, c);
        });

        data.posts?.forEach((p: SocialPost) => {
          p.createdAt = new Date(p.createdAt);
          p.updatedAt = new Date(p.updatedAt);
          this.posts.set(p.id, p);
        });
      }
    } catch (error) {
      console.error('[Social] Error loading persisted data:', error);
    }
  }

  private persistData(): void {
    try {
      localStorage.setItem('social-data', JSON.stringify({
        persons: Array.from(this.persons.values()),
        communities: Array.from(this.communities.values()),
        posts: Array.from(this.posts.values())
      }));
    } catch (error) {
      console.error('[Social] Error persisting data:', error);
    }
  }

  destroy(): void {
    this.persistData();
    this.entities.clear();
    this.persons.clear();
    this.communities.clear();
    this.nodes.clear();
    this.relationships.clear();
    this.posts.clear();
    console.log('[Social] System destroyed');
  }
}

// Export singleton
export const socialCoreSystem = SocialCoreSystem.getInstance();
export default SocialCoreSystem;
