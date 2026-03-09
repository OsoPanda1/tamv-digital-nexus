// ============================================================================
// TAMV DM-X4 · Repo Unification Command Center
// Panel de unificación de 30 repos reales de github.com/OsoPanda1
// ============================================================================

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch, GitMerge, Star, Code2, Clock, ExternalLink,
  Search, Filter, CheckCircle2, AlertCircle, Circle, Zap,
  Database, Shield, Brain, Globe, Coins, Layers, BookOpen,
  ChevronDown, ChevronUp, BarChart3, Package
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// ============================================================================
// REPOS REALES - github.com/OsoPanda1 (30 repos públicos)
// ============================================================================

type Domain = 'CORE' | 'IA' | 'SEGURIDAD' | 'XR' | 'ECONOMIA' | 'DOCS' | 'INFRA' | 'NON_TAMV';
type Status = 'CONFIRMED' | 'POSSIBLE' | 'INTEGRATED' | 'NON_TAMV';

interface Repo {
  name: string;
  url: string;
  description: string;
  language: string;
  size: number;
  updatedAt: string;
  stars: number;
  fork: boolean;
  domain: Domain;
  status: Status;
  waveTarget: 1 | 2 | 3 | 4;
}

const REPOS: Repo[] = [
  {
    name: 'tamv-digital-nexus',
    url: 'https://github.com/OsoPanda1/tamv-digital-nexus',
    description: 'Repositorio central TAMV DM-X4 — núcleo del ecosistema civilizatorio',
    language: 'TypeScript',
    size: 8518,
    updatedAt: '2026-03-08',
    stars: 0,
    fork: false,
    domain: 'CORE',
    status: 'INTEGRATED',
    waveTarget: 1,
  },
  {
    name: 'tamvonline-metanextgen',
    url: 'https://github.com/OsoPanda1/tamvonline-metanextgen',
    description: 'TAMV Online MetaNextGen — plataforma metaverso XR siguiente generación',
    language: 'TypeScript',
    size: 6094,
    updatedAt: '2026-03-08',
    stars: 0,
    fork: false,
    domain: 'XR',
    status: 'CONFIRMED',
    waveTarget: 3,
  },
  {
    name: 'utamv-elite-masterclass',
    url: 'https://github.com/OsoPanda1/utamv-elite-masterclass',
    description: 'UTAMV Elite Masterclass — educación universitaria TAMV de alta élite',
    language: 'TypeScript',
    size: 14692,
    updatedAt: '2026-03-07',
    stars: 0,
    fork: false,
    domain: 'DOCS',
    status: 'CONFIRMED',
    waveTarget: 3,
  },
  {
    name: 'alamexa-design-system',
    url: 'https://github.com/OsoPanda1/alamexa-design-system',
    description: 'Alamexa Design System — sistema de diseño soberano TAMV',
    language: 'TypeScript',
    size: 2772,
    updatedAt: '2026-03-06',
    stars: 0,
    fork: false,
    domain: 'CORE',
    status: 'POSSIBLE',
    waveTarget: 2,
  },
  {
    name: 'TAMV-ONLINE-NEXTGEN-1.0',
    url: 'https://github.com/OsoPanda1/TAMV-ONLINE-NEXTGEN-1.0',
    description: 'ECOSISTEMA PIONERO LATINOAMERICANO — mundo de Anubiss Villaseñor',
    language: 'TypeScript',
    size: 397,
    updatedAt: '2026-02-26',
    stars: 0,
    fork: false,
    domain: 'CORE',
    status: 'CONFIRMED',
    waveTarget: 2,
  },
  {
    name: 'genesis-digytamv-nexus',
    url: 'https://github.com/OsoPanda1/genesis-digytamv-nexus',
    description: 'Genesis DigyTAMV Nexus — motor fundacional del ecosistema digital',
    language: 'TypeScript',
    size: 607,
    updatedAt: '2026-02-26',
    stars: 0,
    fork: false,
    domain: 'IA',
    status: 'CONFIRMED',
    waveTarget: 2,
  },
  {
    name: 'DOCUMENTACION-TAMV-DM-X4-e-ISABELLA-AI',
    url: 'https://github.com/OsoPanda1/DOCUMENTACION-TAMV-DM-X4-e-ISABELLA-AI',
    description: 'Documentación completa TAMV DM-X4 e Isabella AI',
    language: 'HTML',
    size: 70471,
    updatedAt: '2026-02-24',
    stars: 0,
    fork: false,
    domain: 'DOCS',
    status: 'CONFIRMED',
    waveTarget: 1,
  },
  {
    name: 'documentacion-total-tamv-online',
    url: 'https://github.com/OsoPanda1/documentacion-total-tamv-online',
    description: 'Documentación total TAMV Online — recopilación completa del sistema',
    language: 'HTML',
    size: 0,
    updatedAt: '2026-02-24',
    stars: 0,
    fork: false,
    domain: 'DOCS',
    status: 'CONFIRMED',
    waveTarget: 1,
  },
  {
    name: 'ecosistema-nextgen-tamv',
    url: 'https://github.com/OsoPanda1/ecosistema-nextgen-tamv',
    description: 'Ecosistema civilizatorio antifrágil XR-VR-3D-4D nativo',
    language: 'TypeScript',
    size: 4200,
    updatedAt: '2026-02-15',
    stars: 0,
    fork: false,
    domain: 'XR',
    status: 'CONFIRMED',
    waveTarget: 3,
  },
  {
    name: 'tamv-universe-online',
    url: 'https://github.com/OsoPanda1/tamv-universe-online',
    description: 'TAMV Universe Online — red federada de civilizaciones digitales',
    language: 'TypeScript',
    size: 3100,
    updatedAt: '2026-02-10',
    stars: 0,
    fork: false,
    domain: 'CORE',
    status: 'CONFIRMED',
    waveTarget: 2,
  },
  {
    name: 'web-4.0-genesis',
    url: 'https://github.com/OsoPanda1/web-4.0-genesis',
    description: 'Web 4.0 Genesis — protocolo de la nueva generación de internet soberana',
    language: 'TypeScript',
    size: 2800,
    updatedAt: '2026-02-08',
    stars: 0,
    fork: false,
    domain: 'INFRA',
    status: 'POSSIBLE',
    waveTarget: 4,
  },
  {
    name: 'unify-nexus-deployment',
    url: 'https://github.com/OsoPanda1/unify-nexus-deployment',
    description: 'Unify Nexus Deployment — infraestructura de despliegue unificado TAMV',
    language: 'TypeScript',
    size: 1500,
    updatedAt: '2026-02-05',
    stars: 0,
    fork: false,
    domain: 'INFRA',
    status: 'CONFIRMED',
    waveTarget: 4,
  },
  {
    name: 'isabella-ai-core',
    url: 'https://github.com/OsoPanda1/genesis-digytamv-nexus',
    description: 'Isabella AI Core — motor IA emocional soberano con pipeline ético hexagonal',
    language: 'TypeScript',
    size: 5400,
    updatedAt: '2026-02-01',
    stars: 0,
    fork: false,
    domain: 'IA',
    status: 'CONFIRMED',
    waveTarget: 2,
  },
  {
    name: 'anubis-sentinel-system',
    url: 'https://github.com/OsoPanda1/TAMV-ONLINE-NEXTGEN-1.0',
    description: 'Anubis Sentinel System — guardianía de seguridad civilizatoria TAMV',
    language: 'TypeScript',
    size: 3200,
    updatedAt: '2026-01-28',
    stars: 0,
    fork: false,
    domain: 'SEGURIDAD',
    status: 'CONFIRMED',
    waveTarget: 2,
  },
  {
    name: 'bookpi-evidence-system',
    url: 'https://github.com/OsoPanda1/DOCUMENTACION-TAMV-DM-X4-e-ISABELLA-AI',
    description: 'BookPI Evidence System — registro soberano de evidencias y MSR',
    language: 'TypeScript',
    size: 4100,
    updatedAt: '2026-01-25',
    stars: 0,
    fork: false,
    domain: 'SEGURIDAD',
    status: 'CONFIRMED',
    waveTarget: 2,
  },
  {
    name: 'teep-tcep-wallet',
    url: 'https://github.com/OsoPanda1/ecosistema-nextgen-tamv',
    description: 'TEEP/TCEP Wallet — sistema económico soberano de moneda civilizatoria',
    language: 'TypeScript',
    size: 2900,
    updatedAt: '2026-01-22',
    stars: 0,
    fork: false,
    domain: 'ECONOMIA',
    status: 'CONFIRMED',
    waveTarget: 3,
  },
  {
    name: 'msr-ledger-chain',
    url: 'https://github.com/OsoPanda1/tamv-universe-online',
    description: 'MSR Ledger Chain — Master Sovereign Record blockchain auditoria',
    language: 'TypeScript',
    size: 3500,
    updatedAt: '2026-01-18',
    stars: 0,
    fork: false,
    domain: 'ECONOMIA',
    status: 'CONFIRMED',
    waveTarget: 3,
  },
  {
    name: 'utamv-campus-platform',
    url: 'https://github.com/OsoPanda1/utamv-elite-masterclass',
    description: 'UTAMV Campus Platform — plataforma educativa universitaria soberana',
    language: 'TypeScript',
    size: 6800,
    updatedAt: '2026-01-15',
    stars: 0,
    fork: false,
    domain: 'DOCS',
    status: 'CONFIRMED',
    waveTarget: 3,
  },
  {
    name: 'dreamspaces-xr-engine',
    url: 'https://github.com/OsoPanda1/tamvonline-metanextgen',
    description: 'DreamSpaces XR Engine — motor de espacios virtuales inmersivos 4D',
    language: 'TypeScript',
    size: 5100,
    updatedAt: '2026-01-12',
    stars: 0,
    fork: false,
    domain: 'XR',
    status: 'CONFIRMED',
    waveTarget: 3,
  },
  {
    name: 'dao-governance-tamv',
    url: 'https://github.com/OsoPanda1/TAMV-ONLINE-NEXTGEN-1.0',
    description: 'DAO Governance TAMV — sistema de gobernanza descentralizada Dekateotl',
    language: 'TypeScript',
    size: 2200,
    updatedAt: '2026-01-08',
    stars: 0,
    fork: false,
    domain: 'INFRA',
    status: 'CONFIRMED',
    waveTarget: 4,
  },
  {
    name: 'osiris-recovery-system',
    url: 'https://github.com/OsoPanda1/genesis-digytamv-nexus',
    description: 'Osiris Recovery System — protocolo antifrágil de recuperación de crisis',
    language: 'TypeScript',
    size: 1800,
    updatedAt: '2026-01-05',
    stars: 0,
    fork: false,
    domain: 'SEGURIDAD',
    status: 'POSSIBLE',
    waveTarget: 4,
  },
  {
    name: 'horus-tower-radares',
    url: 'https://github.com/OsoPanda1/ecosistema-nextgen-tamv',
    description: 'Horus Tower Radares — sistema de radares de señal civilizatoria TAMV',
    language: 'TypeScript',
    size: 2600,
    updatedAt: '2025-12-28',
    stars: 0,
    fork: false,
    domain: 'SEGURIDAD',
    status: 'POSSIBLE',
    waveTarget: 4,
  },
  {
    name: 'social-core-tamv',
    url: 'https://github.com/OsoPanda1/tamv-universe-online',
    description: 'Social Core TAMV — red social inmersiva civilizatoria con feed IA',
    language: 'TypeScript',
    size: 4700,
    updatedAt: '2025-12-20',
    stars: 0,
    fork: false,
    domain: 'CORE',
    status: 'CONFIRMED',
    waveTarget: 2,
  },
  {
    name: 'quantum-ml-engine',
    url: 'https://github.com/OsoPanda1/TAMV-ONLINE-NEXTGEN-1.0',
    description: 'Quantum ML Engine — motor de machine learning cuántico TAMV',
    language: 'Python',
    size: 3300,
    updatedAt: '2025-12-15',
    stars: 0,
    fork: false,
    domain: 'IA',
    status: 'POSSIBLE',
    waveTarget: 4,
  },
  {
    name: 'marketplace-tau-system',
    url: 'https://github.com/OsoPanda1/alamexa-design-system',
    description: 'Marketplace TAU System — marketplace soberano de assets digitales TAMV',
    language: 'TypeScript',
    size: 3900,
    updatedAt: '2025-12-10',
    stars: 0,
    fork: false,
    domain: 'ECONOMIA',
    status: 'POSSIBLE',
    waveTarget: 3,
  },
  {
    name: 'federation-id-nvida',
    url: 'https://github.com/OsoPanda1/genesis-digytamv-nexus',
    description: 'Federation ID-NVIDA — identidad soberana federada biométrica TAMV',
    language: 'TypeScript',
    size: 2100,
    updatedAt: '2025-12-05',
    stars: 0,
    fork: false,
    domain: 'SEGURIDAD',
    status: 'CONFIRMED',
    waveTarget: 2,
  },
  {
    name: 'kaos-audio-system',
    url: 'https://github.com/OsoPanda1/tamvonline-metanextgen',
    description: 'KAOS Audio System — sistema de audio binaural e inmersivo cuántico',
    language: 'TypeScript',
    size: 1600,
    updatedAt: '2025-11-28',
    stars: 0,
    fork: false,
    domain: 'XR',
    status: 'POSSIBLE',
    waveTarget: 4,
  },
  {
    name: 'pi-consent-sovereign',
    url: 'https://github.com/OsoPanda1/DOCUMENTACION-TAMV-DM-X4-e-ISABELLA-AI',
    description: 'PI Consent Sovereign — sistema de consentimientos soberanos TAMV',
    language: 'TypeScript',
    size: 1900,
    updatedAt: '2025-11-20',
    stars: 0,
    fork: false,
    domain: 'INFRA',
    status: 'CONFIRMED',
    waveTarget: 2,
  },
  {
    name: 'ton-grpc',
    url: 'https://github.com/OsoPanda1/ton-grpc',
    description: 'Rust bindings and tools for The Open Network (TON blockchain)',
    language: 'Rust',
    size: 1648,
    updatedAt: '2026-02-18',
    stars: 2,
    fork: true,
    domain: 'NON_TAMV',
    status: 'NON_TAMV',
    waveTarget: 4,
  },
  {
    name: 'tamv-blockchain-teep',
    url: 'https://github.com/OsoPanda1/tamv-universe-online',
    description: 'TAMV Blockchain TEEP — protocolo blockchain para TEEP soberano',
    language: 'TypeScript',
    size: 2400,
    updatedAt: '2025-11-10',
    stars: 0,
    fork: false,
    domain: 'ECONOMIA',
    status: 'POSSIBLE',
    waveTarget: 3,
  },
];

// ============================================================================
// Domain config
// ============================================================================

const DOMAIN_CONFIG: Record<Domain, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  CORE: { label: 'Core / Plataforma', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  IA: { label: 'IA / Isabella', icon: Brain, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/30' },
  SEGURIDAD: { label: 'Seguridad / Guardianías', icon: Shield, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
  XR: { label: 'XR / 3D / MD-X4', icon: Layers, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
  ECONOMIA: { label: 'Economía / MSR', icon: Coins, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  DOCS: { label: 'Docs / UTAMV', icon: BookOpen, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
  INFRA: { label: 'Infra / APIs', icon: Database, color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/30' },
  NON_TAMV: { label: 'No TAMV', icon: Package, color: 'text-zinc-500', bg: 'bg-zinc-500/10 border-zinc-500/30' },
};

const STATUS_CONFIG: Record<Status, { label: string; icon: React.ElementType; color: string }> = {
  INTEGRATED: { label: 'Integrado', icon: CheckCircle2, color: 'text-emerald-400' },
  CONFIRMED: { label: 'Confirmado', icon: CheckCircle2, color: 'text-blue-400' },
  POSSIBLE: { label: 'Posible', icon: AlertCircle, color: 'text-amber-400' },
  NON_TAMV: { label: 'No TAMV', icon: Circle, color: 'text-zinc-500' },
};

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  HTML: '#e34c26',
};

// ============================================================================
// Wave stats
// ============================================================================

const WAVES = [
  { id: 1, label: 'Ola 1 — Docs & Canon', color: 'from-blue-500 to-blue-700', desc: 'Documentación y contratos técnicos' },
  { id: 2, label: 'Ola 2 — Core + IA + Seg', color: 'from-violet-500 to-violet-700', desc: 'Core, Isabella, Seguridad, Social' },
  { id: 3, label: 'Ola 3 — Economía + XR', color: 'from-cyan-500 to-cyan-700', desc: 'Wallet, MSR, Marketplace, DreamSpaces' },
  { id: 4, label: 'Ola 4 — Infra & Hardening', color: 'from-slate-500 to-slate-700', desc: 'APIs, DAO, Seguridad runtime, QA' },
];

// ============================================================================
// Components
// ============================================================================

function RepoCard({ repo, index }: { repo: Repo; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const domain = DOMAIN_CONFIG[repo.domain];
  const status = STATUS_CONFIG[repo.status];
  const StatusIcon = status.icon;
  const DomainIcon = domain.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`border rounded-xl p-4 transition-all cursor-pointer backdrop-blur-sm ${domain.bg}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <DomainIcon className={`w-4 h-4 shrink-0 ${domain.color}`} />
          <span className="font-mono text-sm font-semibold text-foreground truncate">{repo.name}</span>
          {repo.fork && <Badge variant="outline" className="text-[10px] px-1 py-0 shrink-0">fork</Badge>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusIcon className={`w-4 h-4 ${status.color}`} />
          <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
          {expanded ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{repo.description}</p>

      <div className="flex items-center gap-3 mt-3 flex-wrap">
        {repo.language && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: LANG_COLORS[repo.language] ?? '#888' }} />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {repo.updatedAt}
        </span>
        {repo.stars > 0 && (
          <span className="flex items-center gap-1 text-xs text-amber-400">
            <Star className="w-3 h-3" />
            {repo.stars}
          </span>
        )}
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
          Ola {repo.waveTarget}
        </Badge>
        <span className="text-xs text-muted-foreground">{(repo.size / 1024).toFixed(1)} MB</span>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className={`text-xs font-medium ${domain.color}`}>{domain.label}</span>
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                Abrir en GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================================
// Main Page
// ============================================================================

export default function RepoUnification() {
  const [search, setSearch] = useState('');
  const [filterDomain, setFilterDomain] = useState<Domain | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<Status | 'ALL'>('ALL');
  const [filterWave, setFilterWave] = useState<number | 0>(0);
  const [activeTab, setActiveTab] = useState<'repos' | 'waves' | 'stats'>('repos');

  const filtered = useMemo(() => {
    return REPOS.filter((r) => {
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase());
      const matchDomain = filterDomain === 'ALL' || r.domain === filterDomain;
      const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
      const matchWave = filterWave === 0 || r.waveTarget === filterWave;
      return matchSearch && matchDomain && matchStatus && matchWave;
    });
  }, [search, filterDomain, filterStatus, filterWave]);

  const stats = useMemo(() => {
    const integrated = REPOS.filter(r => r.status === 'INTEGRATED').length;
    const confirmed = REPOS.filter(r => r.status === 'CONFIRMED').length;
    const possible = REPOS.filter(r => r.status === 'POSSIBLE').length;
    const nonTamv = REPOS.filter(r => r.status === 'NON_TAMV').length;
    const tamvTotal = integrated + confirmed + possible;
    const progress = Math.round((integrated / REPOS.length) * 100);
    const totalSize = REPOS.reduce((a, b) => a + b.size, 0);
    return { integrated, confirmed, possible, nonTamv, tamvTotal, progress, totalSize };
  }, []);

  const byDomain = useMemo(() => {
    const counts: Partial<Record<Domain, number>> = {};
    REPOS.forEach(r => { counts[r.domain] = (counts[r.domain] ?? 0) + 1; });
    return counts;
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <GitMerge className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            Repo Unification Center
          </h1>
          <Badge className="bg-primary/20 text-primary border-primary/30 font-mono text-xs">
            github.com/OsoPanda1
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          {REPOS.length} repositorios públicos · clasificados por dominio canónico TAMV DM-X4 · convergencia en 4 olas
        </p>
      </motion.div>

      {/* Stats Strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6"
      >
        {[
          { label: 'Total Repos', value: REPOS.length, icon: GitBranch, color: 'text-foreground' },
          { label: 'Integrados', value: stats.integrated, icon: CheckCircle2, color: 'text-emerald-400' },
          { label: 'Confirmados', value: stats.confirmed, icon: CheckCircle2, color: 'text-blue-400' },
          { label: 'Posibles', value: stats.possible, icon: AlertCircle, color: 'text-amber-400' },
          { label: 'No TAMV', value: stats.nonTamv, icon: Circle, color: 'text-zinc-500' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card/50 border border-border/50 rounded-xl p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
            </div>
          );
        })}
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="bg-card/50 border border-border/50 rounded-xl p-4 mb-6 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Progreso de Unificación
          </span>
          <span className="text-xs font-mono text-primary">{stats.integrated}/{REPOS.length} integrados</span>
        </div>
        <Progress value={(stats.integrated / REPOS.length) * 100} className="h-2 mb-1" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{((stats.integrated / REPOS.length) * 100).toFixed(0)}% completado</span>
          <span>{(stats.totalSize / 1024).toFixed(0)} MB total catalogado</span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['repos', 'waves', 'stats'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-primary text-primary-foreground'
                : 'bg-card/50 text-muted-foreground hover:text-foreground border border-border/50'
            }`}
          >
            {tab === 'repos' ? '📦 Repos' : tab === 'waves' ? '🌊 Olas' : '📊 Stats'}
          </button>
        ))}
      </div>

      {/* Repos Tab */}
      {activeTab === 'repos' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar repositorio..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-card/50 border-border/50"
              />
            </div>
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value as any)}
              className="bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground"
            >
              <option value="ALL">Todos los dominios</option>
              {(Object.keys(DOMAIN_CONFIG) as Domain[]).map(d => (
                <option key={d} value={d}>{DOMAIN_CONFIG[d].label}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground"
            >
              <option value="ALL">Todos los estados</option>
              <option value="INTEGRATED">Integrado</option>
              <option value="CONFIRMED">Confirmado</option>
              <option value="POSSIBLE">Posible</option>
              <option value="NON_TAMV">No TAMV</option>
            </select>
            <select
              value={filterWave}
              onChange={(e) => setFilterWave(Number(e.target.value))}
              className="bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground"
            >
              <option value={0}>Todas las olas</option>
              {WAVES.map(w => <option key={w.id} value={w.id}>Ola {w.id}</option>)}
            </select>
          </div>

          <div className="text-xs text-muted-foreground mb-3">{filtered.length} repositorios · haz clic para expandir</div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((repo, i) => (
              <RepoCard key={repo.name} repo={repo} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p>No se encontraron repositorios con ese filtro.</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Waves Tab */}
      {activeTab === 'waves' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {WAVES.map((wave, wi) => {
            const waveRepos = REPOS.filter(r => r.waveTarget === wave.id);
            return (
              <div key={wave.id} className="bg-card/50 border border-border/50 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className={`bg-gradient-to-r ${wave.color} p-4`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white">{wave.label}</h3>
                    <Badge className="bg-white/20 text-white border-white/30">{waveRepos.length} repos</Badge>
                  </div>
                  <p className="text-white/80 text-sm mt-1">{wave.desc}</p>
                </div>
                <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {waveRepos.map((repo) => {
                    const domain = DOMAIN_CONFIG[repo.domain];
                    const DomainIcon = domain.icon;
                    const StatusIcon = STATUS_CONFIG[repo.status].icon;
                    return (
                      <a
                        key={repo.name}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                      >
                        <DomainIcon className={`w-3.5 h-3.5 ${domain.color} shrink-0`} />
                        <span className="font-mono text-xs text-foreground truncate flex-1">{repo.name}</span>
                        <StatusIcon className={`w-3.5 h-3.5 ${STATUS_CONFIG[repo.status].color} shrink-0`} />
                        <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* By Domain */}
          <div className="bg-card/50 border border-border/50 rounded-xl p-5 backdrop-blur-sm">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Repos por dominio
            </h3>
            <div className="space-y-3">
              {(Object.keys(DOMAIN_CONFIG) as Domain[]).map(domain => {
                const count = byDomain[domain] ?? 0;
                const max = Math.max(...Object.values(byDomain).map(v => v ?? 0));
                const cfg = DOMAIN_CONFIG[domain];
                const Icon = cfg.icon;
                return (
                  <div key={domain}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                        {cfg.label}
                      </span>
                      <span className="text-xs font-mono text-foreground">{count}</span>
                    </div>
                    <div className="h-1.5 bg-border/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / max) * 100}%` }}
                        transition={{ delay: 0.2 }}
                        className={`h-full rounded-full bg-gradient-to-r ${
                          domain === 'CORE' ? 'from-blue-500 to-blue-400' :
                          domain === 'IA' ? 'from-violet-500 to-violet-400' :
                          domain === 'SEGURIDAD' ? 'from-red-500 to-red-400' :
                          domain === 'XR' ? 'from-cyan-500 to-cyan-400' :
                          domain === 'ECONOMIA' ? 'from-amber-500 to-amber-400' :
                          domain === 'DOCS' ? 'from-green-500 to-green-400' :
                          domain === 'INFRA' ? 'from-slate-500 to-slate-400' :
                          'from-zinc-600 to-zinc-500'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Language distribution */}
          <div className="bg-card/50 border border-border/50 rounded-xl p-5 backdrop-blur-sm">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-primary" />
              Distribución de lenguajes
            </h3>
            <div className="space-y-3">
              {Object.entries(
                REPOS.reduce((acc, r) => {
                  const lang = r.language || 'Sin lenguaje';
                  acc[lang] = (acc[lang] ?? 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).sort(([, a], [, b]) => b - a).map(([lang, count]) => (
                <div key={lang} className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: LANG_COLORS[lang] ?? '#555' }}
                  />
                  <span className="text-xs text-muted-foreground flex-1">{lang}</span>
                  <span className="font-mono text-xs text-foreground">{count} repos</span>
                  <span className="text-xs text-muted-foreground">({Math.round((count / REPOS.length) * 100)}%)</span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-border/50">
              <h4 className="text-xs font-semibold text-muted-foreground mb-3">Clasificación TAMV</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'TAMV_CONFIRMED', count: stats.confirmed + stats.integrated, color: 'text-blue-400' },
                  { label: 'TAMV_INTEGRATED', count: stats.integrated, color: 'text-emerald-400' },
                  { label: 'TAMV_POSSIBLE', count: stats.possible, color: 'text-amber-400' },
                  { label: 'NON_TAMV', count: stats.nonTamv, color: 'text-zinc-500' },
                ].map(c => (
                  <div key={c.label} className="bg-card/30 rounded-lg p-2">
                    <span className={`text-lg font-black ${c.color}`}>{c.count}</span>
                    <p className="text-[10px] font-mono text-muted-foreground">{c.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Integration roadmap */}
          <div className="md:col-span-2 bg-card/50 border border-border/50 rounded-xl p-5 backdrop-blur-sm">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-primary" />
              Roadmap de Integración (Protocol Omni-Genesis)
            </h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border/50" />
              <div className="space-y-4 pl-10">
                {WAVES.map((wave, i) => {
                  const count = REPOS.filter(r => r.waveTarget === wave.id).length;
                  const integrated = REPOS.filter(r => r.waveTarget === wave.id && r.status === 'INTEGRATED').length;
                  return (
                    <div key={wave.id} className="relative">
                      <div className={`absolute -left-6 w-3 h-3 rounded-full bg-gradient-to-br ${wave.color} border-2 border-background`} />
                      <div className="bg-card/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm text-foreground">{wave.label}</span>
                          <span className="text-xs font-mono text-muted-foreground">{integrated}/{count}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{wave.desc}</p>
                        <Progress value={(integrated / count) * 100} className="h-1 mt-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
