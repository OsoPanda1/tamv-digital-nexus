// ============================================================================
// TAMV MD-X4™ — 48 FEDERACIONES CIVILIZATORIAS
// Autor visionario: Edwin Oswaldo Castillo Trejo
// Cada federación es un dominio soberano del ecosistema
// ============================================================================

export interface Federation {
  id: string;
  name: string;
  domain: string;
  icon: string; // emoji for now, can be replaced with SVG
  color: string; // HSL accent
  layer: 'L0' | 'L1' | 'L2' | 'L3';
  status: 'active' | 'building' | 'planned';
  description: string;
}

export const FEDERATIONS: Federation[] = [
  // ═══ L0 — CORE IDENTITY & INFRASTRUCTURE (12) ═══
  { id: 'f-identity', name: 'Identidad Soberana', domain: 'identity', icon: '🪪', color: '185 100% 60%', layer: 'L0', status: 'active', description: 'ID-NVIDA, biometría, reputación' },
  { id: 'f-auth', name: 'Autenticación', domain: 'auth', icon: '🔐', color: '185 100% 55%', layer: 'L0', status: 'active', description: 'MFA, OAuth, session management' },
  { id: 'f-msr', name: 'Master Sovereign Record', domain: 'msr', icon: '📜', color: '220 80% 50%', layer: 'L0', status: 'active', description: 'Registro inmutable de evidencia' },
  { id: 'f-bookpi', name: 'BookPI', domain: 'bookpi', icon: '📖', color: '271 100% 65%', layer: 'L0', status: 'active', description: 'Propiedad intelectual verificable' },
  { id: 'f-security', name: 'Anubis Sentinel', domain: 'security', icon: '🛡️', color: '0 90% 60%', layer: 'L0', status: 'active', description: 'Seguridad antifrágil L0-L3' },
  { id: 'f-crisis', name: 'Osiris Recovery', domain: 'crisis', icon: '🔥', color: '30 100% 55%', layer: 'L0', status: 'active', description: 'Crisis response & rollback' },
  { id: 'f-consent', name: 'Consentimiento PI', domain: 'consent', icon: '✅', color: '120 100% 40%', layer: 'L0', status: 'active', description: 'Consentimiento granular GDPR+' },
  { id: 'f-encryption', name: 'Cripto-Bóveda', domain: 'encryption', icon: '🔒', color: '220 85% 45%', layer: 'L0', status: 'active', description: 'Cifrado E2E, vault de claves' },
  { id: 'f-mesh', name: 'Mesh Comms', domain: 'mesh', icon: '🌐', color: '190 100% 50%', layer: 'L0', status: 'active', description: 'WebSocket federation bus' },
  { id: 'f-radares', name: 'Radares Signal', domain: 'radares', icon: '📡', color: '200 90% 55%', layer: 'L0', status: 'active', description: 'Telemetría y señales en tiempo real' },
  { id: 'f-devops', name: 'Self-Healing DevOps', domain: 'devops', icon: '🔧', color: '45 100% 50%', layer: 'L0', status: 'active', description: 'CI/CD, autocuración de código' },
  { id: 'f-omnikernel', name: 'OMNI-KERNEL', domain: 'kernel', icon: '⚛️', color: '271 100% 60%', layer: 'L0', status: 'active', description: 'Motor central del organismo' },

  // ═══ L1 — SOCIAL & CREATORS (12) ═══
  { id: 'f-feed', name: 'Civilizatory Flow', domain: 'feed', icon: '🌊', color: '185 100% 60%', layer: 'L1', status: 'active', description: 'Feed social next-gen' },
  { id: 'f-stories', name: 'Stories XR', domain: 'stories', icon: '📸', color: '330 100% 65%', layer: 'L1', status: 'active', description: 'Historias inmersivas 3D' },
  { id: 'f-reels', name: 'Quantum Reels', domain: 'reels', icon: '🎬', color: '0 90% 60%', layer: 'L1', status: 'active', description: 'Video corto con IA' },
  { id: 'f-streaming', name: 'Live Streaming', domain: 'streaming', icon: '📺', color: '120 100% 50%', layer: 'L1', status: 'active', description: 'Transmisiones en vivo' },
  { id: 'f-messaging', name: 'Mensajería E2E', domain: 'messaging', icon: '💬', color: '217 100% 60%', layer: 'L1', status: 'active', description: 'Chat cifrado, grupos, canales' },
  { id: 'f-communities', name: 'Comunidades', domain: 'communities', icon: '👥', color: '271 80% 55%', layer: 'L1', status: 'active', description: 'Grupos temáticos federados' },
  { id: 'f-channels', name: 'Canales de Difusión', domain: 'channels', icon: '📢', color: '45 100% 55%', layer: 'L1', status: 'active', description: 'Broadcasting unidireccional' },
  { id: 'f-podcasts', name: 'Podcasts AI', domain: 'podcasts', icon: '🎙️', color: '330 80% 55%', layer: 'L1', status: 'active', description: 'Audio shows con IA' },
  { id: 'f-music', name: 'KAOS Music', domain: 'music', icon: '🎵', color: '185 100% 55%', layer: 'L1', status: 'active', description: 'Música binaural 432Hz' },
  { id: 'f-events', name: 'Eventos & Meetups', domain: 'events', icon: '🎉', color: '45 100% 60%', layer: 'L1', status: 'active', description: 'Eventos híbridos IRL+XR' },
  { id: 'f-collabs', name: 'Colaboraciones', domain: 'collabs', icon: '🤝', color: '160 80% 50%', layer: 'L1', status: 'active', description: 'Co-creación entre creadores' },
  { id: 'f-gifts', name: 'Circle Gifts', domain: 'gifts', icon: '🎁', color: '330 100% 60%', layer: 'L1', status: 'active', description: 'Regalos digitales y combos' },

  // ═══ L2 — ECONOMY & XR (12) ═══
  { id: 'f-wallet', name: 'NubiWallet', domain: 'wallet', icon: '💎', color: '185 100% 60%', layer: 'L2', status: 'active', description: 'TEEP/TCEP, staking, rewards' },
  { id: 'f-marketplace', name: 'Marketplace TAU', domain: 'marketplace', icon: '🏪', color: '120 100% 45%', layer: 'L2', status: 'active', description: 'Comercio digital federado' },
  { id: 'f-subscriptions', name: 'Membresías Fénix', domain: 'subscriptions', icon: '👑', color: '45 100% 55%', layer: 'L2', status: 'active', description: 'Modelo 70/20/10 revenue' },
  { id: 'f-dreamspaces', name: 'DreamSpaces XR', domain: 'dreamspaces', icon: '🌌', color: '271 100% 65%', layer: 'L2', status: 'active', description: 'Mundos 3D inmersivos' },
  { id: 'f-nft', name: 'NFT Soberanos', domain: 'nft', icon: '🖼️', color: '330 100% 60%', layer: 'L2', status: 'building', description: 'Activos digitales verificables' },
  { id: 'f-lottery', name: 'Lotería TAMV', domain: 'lottery', icon: '🎰', color: '45 100% 60%', layer: 'L2', status: 'active', description: 'Sorteos verificables en chain' },
  { id: 'f-crowdfunding', name: 'Crowdfunding', domain: 'crowdfunding', icon: '🚀', color: '185 80% 50%', layer: 'L2', status: 'building', description: 'Financiación colectiva soberana' },
  { id: 'f-tipping', name: 'Tipping Protocol', domain: 'tipping', icon: '⚡', color: '45 90% 55%', layer: 'L2', status: 'active', description: 'Propinas instantáneas' },
  { id: 'f-metaverse', name: 'Metaverso TAMV', domain: 'metaverse', icon: '🪐', color: '271 90% 55%', layer: 'L2', status: 'building', description: 'Parcelas, avatares, economia XR' },
  { id: 'f-ads', name: 'Publicidad Ética', domain: 'ads', icon: '📊', color: '160 70% 45%', layer: 'L2', status: 'planned', description: 'Ads con revenue para creador' },
  { id: 'f-payments', name: 'Pasarela de Pagos', domain: 'payments', icon: '💳', color: '220 80% 50%', layer: 'L2', status: 'active', description: 'Stripe, crypto, SPEI' },
  { id: 'f-pets', name: 'Mascotas Digitales', domain: 'pets', icon: '🐾', color: '30 90% 55%', layer: 'L2', status: 'active', description: 'Compañeros digitales con IA' },

  // ═══ L3 — GOVERNANCE, AI & EDUCATION (12) ═══
  { id: 'f-dao', name: 'CITEMESH DAO', domain: 'dao', icon: '🏛️', color: '45 100% 55%', layer: 'L3', status: 'active', description: 'Gobernanza descentralizada' },
  { id: 'f-isabella', name: 'Isabella AI Prime', domain: 'isabella', icon: '🧠', color: '271 100% 65%', layer: 'L3', status: 'active', description: 'IA emocional orquestadora' },
  { id: 'f-university', name: 'UTAMV', domain: 'university', icon: '🎓', color: '220 85% 55%', layer: 'L3', status: 'active', description: 'Universidad blockchain' },
  { id: 'f-certification', name: 'Certificaciones', domain: 'certification', icon: '🏆', color: '45 100% 50%', layer: 'L3', status: 'active', description: 'Credenciales verificables' },
  { id: 'f-mentoring', name: 'Mentoría IA', domain: 'mentoring', icon: '🌟', color: '185 90% 55%', layer: 'L3', status: 'building', description: 'Coaching con Isabella' },
  { id: 'f-guardianias', name: 'Guardianías', domain: 'guardianias', icon: '⚔️', color: '0 80% 55%', layer: 'L3', status: 'active', description: 'Moderación humana + IA' },
  { id: 'f-constitution', name: 'Constitución Digital', domain: 'constitution', icon: '📋', color: '220 70% 45%', layer: 'L3', status: 'active', description: 'Leyes del ecosistema' },
  { id: 'f-voting', name: 'Votaciones', domain: 'voting', icon: '🗳️', color: '160 80% 50%', layer: 'L3', status: 'active', description: 'Democracia directa on-chain' },
  { id: 'f-analytics', name: 'Quantum Analytics', domain: 'analytics', icon: '📈', color: '185 100% 60%', layer: 'L3', status: 'active', description: 'Dashboard civilizatorio' },
  { id: 'f-compliance', name: 'Compliance Global', domain: 'compliance', icon: '⚖️', color: '220 60% 40%', layer: 'L3', status: 'active', description: 'GDPR, LFPDPPP, SOC2' },
  { id: 'f-research', name: 'R&D Quantum', domain: 'research', icon: '🔬', color: '271 80% 55%', layer: 'L3', status: 'planned', description: 'Investigación avanzada' },
  { id: 'f-diplomacy', name: 'Diplomacia Digital', domain: 'diplomacy', icon: '🕊️', color: '185 70% 50%', layer: 'L3', status: 'planned', description: 'Relaciones inter-ecosistemas' },
];

export const LAYER_META = {
  L0: { name: 'Core & Infraestructura', color: '185 100% 60%', count: 12 },
  L1: { name: 'Social & Creadores', color: '330 100% 65%', count: 12 },
  L2: { name: 'Economía & XR', color: '45 100% 55%', count: 12 },
  L3: { name: 'Gobernanza, IA & Educación', color: '271 100% 65%', count: 12 },
};

export const getFederationsByLayer = (layer: Federation['layer']) =>
  FEDERATIONS.filter(f => f.layer === layer);

export const getActiveFederations = () =>
  FEDERATIONS.filter(f => f.status === 'active');

export const FEDERATION_COUNT = FEDERATIONS.length; // 48
