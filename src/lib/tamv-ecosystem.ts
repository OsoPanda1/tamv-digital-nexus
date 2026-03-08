// ============================================================================
// TAMV MD-X4™ / MD-X5 / TAMV Online — Unified Ecosystem Engine
// Functional data layer derived from web research + AVIXA + Blog + OMNI-KERNEL
// Autor visionario: Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)
// Origen: Real del Monte, Hidalgo, México
// ============================================================================

import { supabase } from "@/integrations/supabase/client";

// ── Core Constants ──

export const TAMV_META = {
  founder: "Edwin Oswaldo Castillo Trejo",
  alias: "Anubis Villaseñor",
  origin: "Real del Monte, Hidalgo, México",
  dedication: "Reina Trejo Serrano ✦",
  hoursDocumented: 21_000,
  launchDate: "2026-02-05",
  blog: "https://tamvonlinenetwork.blogspot.com",
  avixaProfile: "https://xchange.avixa.org/users/edwin-oswaldo-castillo-trejo",
  versions: {
    "MD-X4": "Ecosistema cuántico-emocional civilizatorio (v4)",
    "MD-X5": "Ecosistema Civilizatorio Federado (ECF) — redefinición estratégica",
    "Online": "Plataforma social inmersiva con soberanía digital",
  },
} as const;

// ── Isabella Ethics (from AVIXA publication) ──

export const ISABELLA_ETHICS = {
  tripleBlock: {
    ontological: {
      label: "Bloqueo Ontológico",
      description: "No se entrena con datasets pornográficos, eróticos o de 'novia virtual'. No se define como objeto de deseo.",
    },
    semantic: {
      label: "Bloqueo Semántico",
      description: "Filtros y clasificadores detectan sexualización, sexting, grooming o explotación. Redirige a mensajes de límites y ayuda.",
    },
    behavioral: {
      label: "Bloqueo Conductual",
      description: "Isabella no coquetea, no erotiza, rechaza activamente usos abusivos. Tono de respeto y profesionalidad.",
    },
  },
  humanInTheLoop: {
    autonomyLimits: "Sugiere, advierte, etiqueta — pero no bloquea definitivamente sin guardianía humana.",
    traceability: "Cada intervención se registra: qué detectó, qué recomendó, si humano aceptó/rechazó.",
    escalation: "Casos de abuso o riesgo se escalan a operadores especializados.",
  },
  domains: ["Social y Comunidad", "XR y Experiencias Inmersivas", "Educación y Alfabetización Digital", "Interfaz con Gobernanza"],
  scientificBasis: [
    "Neurociencia afectiva (Damasio, 1994)",
    "Computación afectiva (Picard, 1997)",
    "Terapia Cognitivo-Conductual (Beck, 1979)",
    "Terapia Dialéctica Conductual (Linehan, 1993)",
    "Modelo Circumplex de Russell (1980)",
  ],
} as const;

// ── 7 Federations (OMNI-MODUS COS) ──

export const FEDERATIONS = [
  { id: "security", name: "Seguridad", codename: "Anubis/Horus", icon: "Shield", status: "active", desc: "11 capas DEKATEOTL, post-quantum crypto, detección deepfake" },
  { id: "economy", name: "Economía", codename: "MSR/Fénix", icon: "Activity", status: "active", desc: "TCEP tokens, distribución Fénix 70/20/10, Banco TAMV" },
  { id: "technical", name: "Técnica", codename: "Quantum", icon: "Cpu", status: "active", desc: "Quantum compute, OMNI-KERNEL self-healing, CI/CD" },
  { id: "education", name: "Educación", codename: "UTAMV", icon: "GraduationCap", status: "active", desc: "Universidad TAMV, certificaciones BookPI, mentorías" },
  { id: "ai", name: "Inteligencia Artificial", codename: "Isabella Prime", icon: "Brain", status: "active", desc: "IA emocional ética, triple bloqueo, acompañamiento contextual" },
  { id: "creative", name: "Creativa", codename: "DreamSpaces", icon: "Sparkles", status: "active", desc: "Metaverso 3D/4D, audio KAOS, experiencias XR" },
  { id: "governance", name: "Gobernanza", codename: "CITEMESH", icon: "Crown", status: "active", desc: "DAO híbrida, votaciones, propuestas comunitarias" },
] as const;

// ── Architecture Layers L0–L3 ──

export const ARCHITECTURE_LAYERS = [
  { level: "L0", name: "Core Identity & Comms", desc: "Siempre vivo. ID-NVIDA soberana, MSR inmutable, comunicación base.", degradable: false },
  { level: "L1", name: "Social & Creadores", desc: "Red social federada, contenido, streaming, gifts, stories.", degradable: true },
  { level: "L2", name: "Economía & XR", desc: "Banco TAMV, DreamSpaces, marketplace, lotería, membresías.", degradable: true },
  { level: "L3", name: "Gobernanza & DAO", desc: "CITEMESH, DAO híbrida, votaciones. Puede degradarse sin afectar L0.", degradable: true },
] as const;

// ── Self-Healing Pipeline ──

export const SELF_HEALING_PIPELINE = [
  { step: 1, title: "DSL/IDL Seguro", desc: "El creador define intención en un lenguaje controlado, no código crudo." },
  { step: 2, title: "Backengine Genera", desc: "TypeScript seguro generado desde el esquema validado." },
  { step: 3, title: "Isabella Analiza", desc: "RiskAnalyzer ML evalúa seguridad (score ≥ 0.9 requerido)." },
  { step: 4, title: "PR en GitHub", desc: "Cambio firmado criptográficamente, revisado, con rollback inmediato." },
  { step: 5, title: "Deploy CI/CD", desc: "Pipeline automatizado, tests Deca-V, zero-downtime deploy." },
] as const;

// ── DINN Principles ──

export const DINN_PRINCIPLES = [
  { title: "Zero-Trust Extremo", desc: "Cada petición se trata como hostil. Auth + validación + auditoría." },
  { title: "Defense in Depth", desc: "L0 siempre vivo. Si XR, banco o gobernanza fallan, identidad sobrevive." },
  { title: "IaC + GitOps", desc: "Estado de producción = proyección del repo. No cambios manuales." },
  { title: "Soberanía del Creador", desc: "Tus datos, tu contenido, tus ingresos. La plataforma sirve al creador." },
  { title: "Derecho a Integridad No Negociable (DINN)", desc: "Fundamento axiomático del ecosistema civilizatorio." },
  { title: "Autopoiesis Controlada", desc: "El sistema evoluciona pero nunca ejecuta código arbitrario sin análisis." },
] as const;

// ── Functional DB Queries ──

export async function fetchEcosystemMetrics() {
  const [
    { count: profileCount },
    { count: postCount },
    { count: courseCount },
    { count: daoCount },
    { count: isabellaCount },
    { count: crisisCount },
    { count: msrCount },
    { count: transactionCount },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("dao_proposals").select("*", { count: "exact", head: true }),
    supabase.from("isabella_interactions").select("*", { count: "exact", head: true }),
    supabase.from("crisis_logs").select("*", { count: "exact", head: true }),
    supabase.from("msr_events").select("*", { count: "exact", head: true }),
    supabase.from("tcep_transactions").select("*", { count: "exact", head: true }),
  ]);

  return {
    users: profileCount ?? 0,
    posts: postCount ?? 0,
    courses: courseCount ?? 0,
    daoProposals: daoCount ?? 0,
    isabellaInteractions: isabellaCount ?? 0,
    crisisLogs: crisisCount ?? 0,
    msrEvents: msrCount ?? 0,
    transactions: transactionCount ?? 0,
  };
}

export async function fetchRecentActivity(limit = 10) {
  const [
    { data: recentPosts },
    { data: recentMsr },
    { data: recentIsabella },
  ] = await Promise.all([
    supabase.from("posts").select("id, content, created_at, author_id").order("created_at", { ascending: false }).limit(limit),
    supabase.from("msr_events").select("id, action, domain, created_at, severity").order("created_at", { ascending: false }).limit(limit),
    supabase.from("isabella_interactions").select("id, content, message_role, created_at").order("created_at", { ascending: false }).limit(limit),
  ]);

  type ActivityItem = { id: string; type: string; title: string; time: string; severity?: string };
  const activities: ActivityItem[] = [];

  (recentPosts ?? []).forEach(p => activities.push({
    id: p.id, type: "post", title: `Nuevo post publicado`, time: p.created_at ?? "",
  }));
  (recentMsr ?? []).forEach(m => activities.push({
    id: m.id, type: "msr", title: `MSR: ${m.action} [${m.domain}]`, time: m.created_at ?? "", severity: m.severity ?? undefined,
  }));
  (recentIsabella ?? []).forEach(i => activities.push({
    id: i.id, type: "isabella", title: `Isabella ${i.message_role}`, time: i.created_at ?? "",
  }));

  return activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, limit);
}

export async function fetchFederationHealth() {
  // Query actual counts from tables that map to each federation
  const [
    { count: securityScans },
    { count: walletCount },
    { count: courseCount },
    { count: isabellaCount },
    { count: dreamspaceCount },
    { count: daoCount },
  ] = await Promise.all([
    supabase.from("security_scans").select("*", { count: "exact", head: true }),
    supabase.from("tcep_wallets").select("*", { count: "exact", head: true }),
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("isabella_interactions").select("*", { count: "exact", head: true }),
    supabase.from("dreamspaces").select("*", { count: "exact", head: true }),
    supabase.from("dao_proposals").select("*", { count: "exact", head: true }),
  ]);

  return FEDERATIONS.map(fed => {
    let records = 0;
    if (fed.id === "security") records = securityScans ?? 0;
    else if (fed.id === "economy") records = walletCount ?? 0;
    else if (fed.id === "education") records = courseCount ?? 0;
    else if (fed.id === "ai") records = isabellaCount ?? 0;
    else if (fed.id === "creative") records = dreamspaceCount ?? 0;
    else if (fed.id === "governance") records = daoCount ?? 0;
    else records = 0;

    return { ...fed, records, health: records > 0 ? 100 : 80 };
  });
}
