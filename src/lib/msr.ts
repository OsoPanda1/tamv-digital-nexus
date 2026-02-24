// ============================================================================
// TAMV MD-X4™ - MSR: Motor de Estado, Reglas y Rutas
// Central type registry for all domain contracts
// ============================================================================

// ──────────────────────────────────────────────────────────────────────────────
// DM-X4 Domain identifiers (canon — do not rename)
// ──────────────────────────────────────────────────────────────────────────────

export type DomainId =
  | 'DM-X4-01-CORE'
  | 'DM-X4-02-IA'
  | 'DM-X4-03-SECURITY'
  | 'DM-X4-04-EDUCATION'
  | 'DM-X4-05-ECONOMY'
  | 'DM-X4-06-XR'
  | 'DM-X4-07-INFRA';

export const DOMAIN_LABELS: Record<DomainId, string> = {
  'DM-X4-01-CORE': 'Core / Plataforma',
  'DM-X4-02-IA': 'IA / Isabella / THE SOF',
  'DM-X4-03-SECURITY': 'Seguridad / Guardianías',
  'DM-X4-04-EDUCATION': 'UTAMV / BookPI / TAMV ONLINE',
  'DM-X4-05-ECONOMY': 'MSR / Economía',
  'DM-X4-06-XR': 'Render XR / 3D / 4D',
  'DM-X4-07-INFRA': 'Infra / APIs',
};

// ──────────────────────────────────────────────────────────────────────────────
// Cell descriptor
// ──────────────────────────────────────────────────────────────────────────────

export interface CellDescriptor {
  id: string;
  domain: DomainId;
  name: string;
  status: 'active' | 'beta' | 'planned' | 'deprecated';
  artifacts: string[];
  routes: string[];
}

// ──────────────────────────────────────────────────────────────────────────────
// Fusion Core contract types
// ──────────────────────────────────────────────────────────────────────────────

export interface FusionCoreRequest {
  domain: DomainId;
  action: string;
  payload: Record<string, unknown>;
  userId: string;
  timestamp: string;
  traceId?: string;
}

export interface FusionCoreResponse<T = unknown> {
  success: boolean;
  data: T;
  domain: DomainId;
  action: string;
  processedAt: string;
  traceId: string;
  error?: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// MSR Rule definition
// ──────────────────────────────────────────────────────────────────────────────

export type RuleSeverity = 'constitutional' | 'critical' | 'warning' | 'info';

export interface MSRRule {
  id: string;
  domain: DomainId;
  description: string;
  severity: RuleSeverity;
  enforcer: 'constitution-engine' | 'runtime' | 'manual';
}

export const MSR_RULES: MSRRule[] = [
  {
    id: 'MSR-CORE-01',
    domain: 'DM-X4-01-CORE',
    description: 'Solo App.tsx define BrowserRouter. No debe haber segundas instancias de Router.',
    severity: 'constitutional',
    enforcer: 'constitution-engine',
  },
  {
    id: 'MSR-CORE-02',
    domain: 'DM-X4-01-CORE',
    description: 'Las páginas (src/pages/) no pueden importarse entre sí.',
    severity: 'constitutional',
    enforcer: 'constitution-engine',
  },
  {
    id: 'MSR-ECONOMY-01',
    domain: 'DM-X4-05-ECONOMY',
    description: 'Toda mutación económica requiere confirmación en BD antes de actualizar UI.',
    severity: 'critical',
    enforcer: 'runtime',
  },
  {
    id: 'MSR-ECONOMY-02',
    domain: 'DM-X4-05-ECONOMY',
    description: 'Los webhooks de Stripe deben ser idempotentes. No reintentar si ya procesado.',
    severity: 'critical',
    enforcer: 'runtime',
  },
  {
    id: 'MSR-IA-01',
    domain: 'DM-X4-02-IA',
    description: 'Isabella TTS: cache hit → no llamar a ElevenLabs. Cache key = hash(text + voice_id).',
    severity: 'warning',
    enforcer: 'runtime',
  },
  {
    id: 'MSR-IA-02',
    domain: 'DM-X4-02-IA',
    description: 'Si TTS falla, Isabella responde en texto sin crash de UI.',
    severity: 'critical',
    enforcer: 'runtime',
  },
  {
    id: 'MSR-XR-01',
    domain: 'DM-X4-06-XR',
    description: 'Rutas XR deben cargarse con code-splitting (lazy + Suspense).',
    severity: 'warning',
    enforcer: 'constitution-engine',
  },
  {
    id: 'MSR-XR-02',
    domain: 'DM-X4-06-XR',
    description: 'FPS mínimo objetivo en equipos medios: 45fps. Activar LOD si FPS < 45.',
    severity: 'warning',
    enforcer: 'runtime',
  },
  {
    id: 'MSR-SECURITY-01',
    domain: 'DM-X4-03-SECURITY',
    description: 'Nombres canónicos de guardianías no pueden renombrarse: Anubis, Horus, Osiris, Dekateotl.',
    severity: 'constitutional',
    enforcer: 'constitution-engine',
  },
  {
    id: 'MSR-INFRA-01',
    domain: 'DM-X4-07-INFRA',
    description: 'Todas las Edge Functions deben validar payload con Zod antes de procesar.',
    severity: 'critical',
    enforcer: 'manual',
  },
  {
    id: 'MSR-INFRA-02',
    domain: 'DM-X4-07-INFRA',
    description: 'Política CORS unificada por entorno (dev/stage/prod). No wildcards en producción.',
    severity: 'critical',
    enforcer: 'manual',
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Route registry
// ──────────────────────────────────────────────────────────────────────────────

export interface RouteDescriptor {
  path: string;
  domain: DomainId;
  component: string;
  authRequired: boolean;
  adminRequired?: boolean;
  lazy?: boolean;
}

export const ROUTE_REGISTRY: RouteDescriptor[] = [
  { path: '/', domain: 'DM-X4-01-CORE', component: 'Index', authRequired: false },
  { path: '/dashboard', domain: 'DM-X4-01-CORE', component: 'Dashboard', authRequired: true },
  { path: '/auth', domain: 'DM-X4-01-CORE', component: 'Auth', authRequired: false },
  { path: '/onboarding', domain: 'DM-X4-01-CORE', component: 'Onboarding', authRequired: true },
  { path: '/profile', domain: 'DM-X4-01-CORE', component: 'Profile', authRequired: true },
  { path: '/isabella', domain: 'DM-X4-02-IA', component: 'Isabella', authRequired: false },
  { path: '/anubis', domain: 'DM-X4-03-SECURITY', component: 'Anubis', authRequired: true },
  { path: '/crisis', domain: 'DM-X4-03-SECURITY', component: 'Crisis', authRequired: true },
  { path: '/university', domain: 'DM-X4-04-EDUCATION', component: 'University', authRequired: false },
  { path: '/bookpi', domain: 'DM-X4-04-EDUCATION', component: 'BookPI', authRequired: false },
  { path: '/community', domain: 'DM-X4-04-EDUCATION', component: 'Community', authRequired: false },
  { path: '/docs', domain: 'DM-X4-04-EDUCATION', component: 'Docs', authRequired: false },
  { path: '/economy', domain: 'DM-X4-05-ECONOMY', component: 'Economy', authRequired: true },
  { path: '/gifts', domain: 'DM-X4-05-ECONOMY', component: 'Gifts', authRequired: true },
  { path: '/monetization', domain: 'DM-X4-05-ECONOMY', component: 'Monetization', authRequired: true },
  { path: '/metaverse', domain: 'DM-X4-06-XR', component: 'Metaverse', authRequired: false, lazy: true },
  { path: '/dream-spaces', domain: 'DM-X4-06-XR', component: 'DreamSpaces', authRequired: false, lazy: true },
  { path: '/3d-space', domain: 'DM-X4-06-XR', component: 'ThreeDSpace', authRequired: false, lazy: true },
  { path: '/kaos', domain: 'DM-X4-06-XR', component: 'Kaos', authRequired: false },
  { path: '/ecosystem', domain: 'DM-X4-07-INFRA', component: 'Ecosystem', authRequired: false },
  { path: '/governance', domain: 'DM-X4-07-INFRA', component: 'Governance', authRequired: true },
  { path: '/admin', domain: 'DM-X4-07-INFRA', component: 'Admin', authRequired: true, adminRequired: true },
];

// ──────────────────────────────────────────────────────────────────────────────
// Database schema contracts (source of truth for Supabase tables)
// ──────────────────────────────────────────────────────────────────────────────

export interface PostRow {
  id: string;
  author_id: string;
  content: string;
  media_url: string | null;
  media_type: string | null;
  likes_count: number | null;
  comments_count: number | null;
  shares_count: number | null;
  tags: string[] | null;
  created_at: string | null;
  updated_at: string | null;
  visibility: string | null;
}

export interface ProfileRow {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  email: string | null;
  role: string | null;
  membership_tier: string | null;
  wallet_balance: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface TransactionRow {
  id: string;
  user_id: string;
  type: 'reward' | 'purchase' | 'transfer' | 'subscription' | 'refund' | 'gift' | 'lottery';
  amount: number;
  currency: 'tcep' | 'tau' | 'mxn' | 'usd';
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  from_user_id: string | null;
  to_user_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface WalletRow {
  user_id: string;
  balance_tcep: number;
  balance_tau: number;
  locked_balance: number;
  pending_balance: number;
  membership_tier: 'free' | 'premium' | 'vip' | 'elite' | 'celestial' | 'enterprise';
  membership_expires_at: string | null;
  lifetime_earned: number;
  lifetime_spent: number;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsEventRow {
  id?: string;
  event_name: string;
  event_type: string;
  user_id: string | null;
  properties: Record<string, unknown> | null;
  session_id?: string | null;
  created_at?: string;
}
