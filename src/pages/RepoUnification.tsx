// ============================================================================
// TAMV DM-X4 · Repo Unification Command Center — LIVE SCANNER
// Escaneo en tiempo real de github.com/OsoPanda1 con clasificación automática
// ============================================================================

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch, GitMerge, Star, Code2, Clock, ExternalLink,
  Search, Filter, CheckCircle2, AlertCircle, Circle, Zap,
  Database, Shield, Brain, Globe, Coins, Layers, BookOpen,
  ChevronDown, ChevronUp, BarChart3, Package, RefreshCw, Loader2,
  Rocket, TrendingUp, AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// TYPES
// ============================================================================

type Domain = 'CORE' | 'IA' | 'SEGURIDAD' | 'XR' | 'ECONOMIA' | 'DOCS' | 'INFRA' | 'NON_TAMV';
type Status = 'CONFIRMED' | 'POSSIBLE' | 'INTEGRATED' | 'NON_TAMV';

interface ClassifiedRepo {
  name: string;
  url: string;
  description: string;
  language: string;
  size: number;
  stars: number;
  forks: number;
  fork: boolean;
  updatedAt: string;
  createdAt: string;
  pushedAt: string;
  topics: string[];
  defaultBranch: string;
  archived: boolean;
  domain: Domain;
  domainConfidence: number;
  status: Status;
  waveTarget: number;
  tamvSignals: string[];
  evolutionPotential: string[];
  integrableModules: string[];
}

interface ScanResult {
  ok: boolean;
  scannedAt: string;
  targetUser: string;
  summary: {
    totalRepos: number;
    activeRepos: number;
    archivedSkipped: number;
    byDomain: Record<string, number>;
    byStatus: Record<string, number>;
    byWave: Record<string, number>;
    byLanguage: Record<string, number>;
    totalSizeKB: number;
    withEvolutionPotential: number;
  };
  repos: ClassifiedRepo[];
  error?: string;
}

// ============================================================================
// DOMAIN CONFIG
// ============================================================================

const domainConfig: Record<string, { icon: any; color: string; label: string }> = {
  CORE: { icon: Database, color: 'text-blue-400', label: 'Core/Plataforma' },
  IA: { icon: Brain, color: 'text-purple-400', label: 'IA/Isabella' },
  SEGURIDAD: { icon: Shield, color: 'text-red-400', label: 'Seguridad' },
  XR: { icon: Globe, color: 'text-cyan-400', label: 'XR/Metaverso' },
  ECONOMIA: { icon: Coins, color: 'text-amber-400', label: 'Economía/MSR' },
  DOCS: { icon: BookOpen, color: 'text-green-400', label: 'Docs/UTAMV' },
  INFRA: { icon: Layers, color: 'text-orange-400', label: 'Infra/DevOps' },
  NON_TAMV: { icon: Circle, color: 'text-muted-foreground', label: 'Externo' },
};

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  INTEGRATED: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  CONFIRMED: { icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  POSSIBLE: { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/20' },
  NON_TAMV: { icon: Circle, color: 'text-muted-foreground', bg: 'bg-muted/20' },
};

// ============================================================================
// COMPONENT
// ============================================================================

const RepoUnification = () => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [expandedRepo, setExpandedRepo] = useState<string | null>(null);

  const runScan = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('github-repo-scanner');
      if (fnError) throw new Error(fnError.message);
      if (!data?.ok) throw new Error(data?.error || 'Scan failed');
      setScanResult(data as ScanResult);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const repos = scanResult?.repos || [];
  const summary = scanResult?.summary;

  const filtered = useMemo(() => {
    return repos.filter(r => {
      if (searchTerm && !`${r.name} ${r.description} ${r.language}`.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (domainFilter !== 'ALL' && r.domain !== domainFilter) return false;
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
      return true;
    });
  }, [repos, searchTerm, domainFilter, statusFilter]);

  const integrationProgress = useMemo(() => {
    if (!repos.length) return 0;
    const integrated = repos.filter(r => r.status === 'INTEGRATED').length;
    const confirmed = repos.filter(r => r.status === 'CONFIRMED').length;
    return Math.round(((integrated * 1 + confirmed * 0.5) / repos.length) * 100);
  }, [repos]);

  return (
    <div className="min-h-screen p-4 md:p-8 relative z-30">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
            <GitMerge className="inline-block mr-3 text-blue-400" size={36} />
            Repo Unification · Live Scanner
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Escaneo en tiempo real de <span className="text-blue-400 font-bold">github.com/OsoPanda1</span> —
            clasificación automática por dominio TAMV con detección de potencial evolutivo.
          </p>
        </motion.div>

        {/* Scan Button */}
        <div className="flex justify-center">
          <Button
            onClick={runScan}
            disabled={loading}
            size="lg"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-6 text-lg rounded-xl gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={22} />
                Escaneando repositorios...
              </>
            ) : (
              <>
                <RefreshCw size={22} />
                {scanResult ? 'Re-escanear Repos' : 'Iniciar Escaneo de OsoPanda1'}
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/20 border border-destructive/40 rounded-xl p-4 text-center text-destructive">
            <AlertTriangle className="inline mr-2" size={18} />
            {error}
          </div>
        )}

        {/* Summary Cards */}
        {summary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-3"
          >
            <SummaryCard label="Total Repos" value={summary.totalRepos} icon={Package} />
            <SummaryCard label="Activos" value={summary.activeRepos} icon={Zap} color="text-emerald-400" />
            <SummaryCard label="Con Potencial" value={summary.withEvolutionPotential} icon={TrendingUp} color="text-blue-400" />
            <SummaryCard label="Tamaño Total" value={`${Math.round(summary.totalSizeKB / 1024)} MB`} icon={Database} color="text-purple-400" />
            <SummaryCard label="Integración" value={`${integrationProgress}%`} icon={Rocket} color="text-amber-400" />
          </motion.div>
        )}

        {/* Domain Distribution */}
        {summary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-xl p-5"
          >
            <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">Distribución por Dominio</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(summary.byDomain).map(([domain, count]) => {
                const cfg = domainConfig[domain] || domainConfig.NON_TAMV;
                const Icon = cfg.icon;
                return (
                  <button
                    key={domain}
                    onClick={() => setDomainFilter(domainFilter === domain ? 'ALL' : domain)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                      domainFilter === domain ? 'border-blue-500 bg-blue-500/20' : 'border-border/40 bg-card/40 hover:bg-card/80'
                    }`}
                  >
                    <Icon size={16} className={cfg.color} />
                    <span className="text-sm font-medium text-foreground">{cfg.label}</span>
                    <Badge variant="secondary" className="text-xs">{count}</Badge>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Filters */}
        {repos.length > 0 && (
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Buscar por nombre, descripción o lenguaje..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card/60 border-border/40"
              />
            </div>
            <div className="flex gap-2">
              {['ALL', 'INTEGRATED', 'CONFIRMED', 'POSSIBLE', 'NON_TAMV'].map(s => (
                <Button
                  key={s}
                  variant={statusFilter === s ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(s)}
                  className="text-xs"
                >
                  {s === 'ALL' ? 'Todos' : s}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {repos.length > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progreso de Integración</span>
              <span>{integrationProgress}%</span>
            </div>
            <Progress value={integrationProgress} className="h-2" />
          </div>
        )}

        {/* Repo List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((repo, i) => (
              <RepoCard
                key={repo.name}
                repo={repo}
                index={i}
                expanded={expandedRepo === repo.name}
                onToggle={() => setExpandedRepo(expandedRepo === repo.name ? null : repo.name)}
              />
            ))}
          </AnimatePresence>
        </div>

        {repos.length > 0 && filtered.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            No se encontraron repos con los filtros actuales.
          </div>
        )}

        {/* Languages Chart */}
        {summary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-xl p-5"
          >
            <h3 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">Lenguajes Detectados</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(summary.byLanguage)
                .sort(([, a], [, b]) => b - a)
                .map(([lang, count]) => (
                  <Badge key={lang} variant="outline" className="text-xs">
                    <Code2 size={12} className="mr-1" /> {lang}: {count}
                  </Badge>
                ))}
            </div>
          </motion.div>
        )}

        {/* Scan metadata */}
        {scanResult && (
          <div className="text-center text-xs text-muted-foreground/60 pt-4">
            Último escaneo: {new Date(scanResult.scannedAt).toLocaleString()} · Target: {scanResult.targetUser}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const SummaryCard = ({ label, value, icon: Icon, color = 'text-foreground' }: {
  label: string; value: string | number; icon: any; color?: string;
}) => (
  <div className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-xl p-4 text-center">
    <Icon size={20} className={`mx-auto mb-1 ${color}`} />
    <div className={`text-xl font-black ${color}`}>{value}</div>
    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
  </div>
);

const RepoCard = ({ repo, index, expanded, onToggle }: {
  repo: ClassifiedRepo; index: number; expanded: boolean; onToggle: () => void;
}) => {
  const domainCfg = domainConfig[repo.domain] || domainConfig.NON_TAMV;
  const statusCfg = statusConfig[repo.status] || statusConfig.NON_TAMV;
  const DomainIcon = domainCfg.icon;
  const StatusIcon = statusCfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.03 }}
      className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all"
    >
      <button onClick={onToggle} className="w-full p-4 text-left">
        <div className="flex items-center gap-3">
          <DomainIcon size={20} className={domainCfg.color} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-foreground text-sm">{repo.name}</span>
              {repo.fork && <Badge variant="outline" className="text-[10px]">Fork</Badge>}
              <Badge className={`${statusCfg.bg} ${statusCfg.color} text-[10px] border-0`}>
                <StatusIcon size={10} className="mr-1" />
                {repo.status}
              </Badge>
              <Badge variant="outline" className="text-[10px]">{repo.language}</Badge>
              {repo.domainConfidence >= 0.5 && (
                <Badge variant="outline" className="text-[10px] text-blue-400 border-blue-500/30">
                  {Math.round(repo.domainConfidence * 100)}% match
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">{repo.description}</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
            {repo.stars > 0 && <span className="flex items-center gap-1"><Star size={12} />{repo.stars}</span>}
            <span className="flex items-center gap-1"><Clock size={12} />{new Date(repo.updatedAt).toLocaleDateString()}</span>
            <span>{Math.round(repo.size / 1024) || '<1'} MB</span>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/30"
          >
            <div className="p-4 space-y-4">
              {/* Signals */}
              {repo.tamvSignals.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground mb-2 uppercase">Señales TAMV Detectadas</h4>
                  <div className="flex flex-wrap gap-1">
                    {repo.tamvSignals.map((s, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] text-blue-400 border-blue-500/30">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Topics */}
              {repo.topics.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground mb-2 uppercase">Topics GitHub</h4>
                  <div className="flex flex-wrap gap-1">
                    {repo.topics.map((t, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px]">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Evolution Potential */}
              {repo.evolutionPotential.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 mb-2 uppercase flex items-center gap-1">
                    <TrendingUp size={14} /> Potencial Evolutivo para TAMV
                  </h4>
                  <ul className="space-y-1">
                    {repo.evolutionPotential.map((p, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <Rocket size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Integrable Modules */}
              {repo.integrableModules.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-purple-400 mb-2 uppercase">Módulos Integrables</h4>
                  <div className="flex flex-wrap gap-1">
                    {repo.integrableModules.map((m, i) => (
                      <Badge key={i} className="text-[10px] bg-purple-500/20 text-purple-400 border-0">{m}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/30">
                <span>Rama: <code className="text-blue-400">{repo.defaultBranch}</code></span>
                <span>Wave Target: <code className="text-amber-400">{repo.waveTarget}</code></span>
                <span>Creado: {new Date(repo.createdAt).toLocaleDateString()}</span>
                <span>Push: {new Date(repo.pushedAt).toLocaleDateString()}</span>
                <a href={repo.url} target="_blank" rel="noopener" className="flex items-center gap-1 text-blue-400 hover:underline ml-auto">
                  <ExternalLink size={12} /> GitHub
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RepoUnification;
