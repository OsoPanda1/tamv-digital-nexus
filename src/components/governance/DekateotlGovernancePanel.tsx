// ============================================================================
// DEKATEOTL GOVERNANCE PANEL v10
// Panel de Gobernanza Azteca con Matrices de KPIs Vivos
// TAMV MD-X4™ | Subsistema Mítico de Control
// ============================================================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Shield,
  Activity,
  Database,
  Server,
  RefreshCw,
  Scroll,
  AlertTriangle,
  CheckCircle,
  Flame,
  Droplets,
  Sun,
  Moon,
  Wind,
  TrendingUp,
  TrendingDown,
  Minus,
  Play,
  Clock,
  Zap,
} from "lucide-react";
import {
  useDekateotlGovernance,
  type AztekDeity,
  type GovernancePillar,
  type KPI,
  type Ritual,
  type Prophecy,
} from "@/systems/DekateotlGovernanceSystem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ─── Deity Icons ─────────────────────────────────────────────────────────────

const DEITY_ICONS: Record<AztekDeity, React.ReactNode> = {
  quetzalcoatl: <Wind className="w-5 h-5" />,
  tezcatlipoca: <Moon className="w-5 h-5" />,
  huitzilopochtli: <Sun className="w-5 h-5" />,
  tlaloc: <Droplets className="w-5 h-5" />,
  coatlicue: <Server className="w-5 h-5" />,
  xipe_totec: <RefreshCw className="w-5 h-5" />,
};

// ─── Status Config ───────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  divine: { color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/50", icon: <Sparkles className="w-5 h-5" /> },
  blessed: { color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/50", icon: <CheckCircle className="w-5 h-5" /> },
  neutral: { color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/50", icon: <Minus className="w-5 h-5" /> },
  cursed: { color: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/50", icon: <AlertTriangle className="w-5 h-5" /> },
  chaos: { color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/50", icon: <Flame className="w-5 h-5" /> },
};

const PILLAR_STATUS_CONFIG = {
  optimal: { color: "text-emerald-400", bg: "bg-emerald-500/20", label: "Óptimo" },
  stable: { color: "text-blue-400", bg: "bg-blue-500/20", label: "Estable" },
  degraded: { color: "text-amber-400", bg: "bg-amber-500/20", label: "Degradado" },
  critical: { color: "text-red-400", bg: "bg-red-500/20", label: "Crítico" },
};

const KPI_STATUS_CONFIG = {
  healthy: { color: "text-emerald-400", bg: "bg-emerald-500/20", dot: "bg-emerald-400" },
  warning: { color: "text-amber-400", bg: "bg-amber-500/20", dot: "bg-amber-400" },
  critical: { color: "text-red-400", bg: "bg-red-500/20", dot: "bg-red-400" },
  unknown: { color: "text-slate-400", bg: "bg-slate-500/20", dot: "bg-slate-400" },
};

// ─── Mini Chart Component ────────────────────────────────────────────────────

const MiniChart: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 100 100" className="w-16 h-8" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

// ─── KPI Card Component ──────────────────────────────────────────────────────

const KPICard: React.FC<{ kpi: KPI }> = ({ kpi }) => {
  const config = KPI_STATUS_CONFIG[kpi.status];
  const trend = kpi.trend[kpi.trend.length - 1] - kpi.trend[kpi.trend.length - 2];
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`p-3 rounded-lg border ${config.bg} ${config.color} border-opacity-30 bg-opacity-10`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium truncate">{kpi.name}</span>
              <div className={`w-2 h-2 rounded-full ${config.dot}`} />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-lg font-bold">
                  {kpi.current.toFixed(kpi.unit === "%" ? 1 : 0)}
                  <span className="text-xs ml-1 opacity-70">{kpi.unit}</span>
                </div>
                <div className="text-[10px] opacity-60">
                  Target: {kpi.target}{kpi.unit}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <TrendIcon className={`w-3 h-3 ${trend > 0 ? "text-emerald-400" : trend < 0 ? "text-red-400" : "text-slate-400"}`} />
                <MiniChart data={kpi.trend} color={config.color.replace("text-", "").replace("-400", "").replace("emerald", "#10b981").replace("amber", "#f59e0b").replace("red", "#ef4444").replace("slate", "#94a3b8")} />
              </div>
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{kpi.name}</p>
          <p className="text-xs opacity-70">{kpi.description}</p>
          <div className="mt-1 text-xs">
            <span className={config.color}>{kpi.status.toUpperCase()}</span>
            <span className="ml-2">Weight: {(kpi.weight * 100).toFixed(0)}%</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// ─── Pillar Card Component ───────────────────────────────────────────────────

const PillarCard: React.FC<{ pillar: GovernancePillar }> = ({ pillar }) => {
  const config = PILLAR_STATUS_CONFIG[pillar.status];
  const deityConfig = {
    quetzalcoatl: { color: "#00D9FF", icon: "🐍" },
    tezcatlipoca: { color: "#9D4EDD", icon: "🌙" },
    huitzilopochtli: { color: "#FFD700", icon: "☀️" },
    tlaloc: { color: "#00B4D8", icon: "🌧️" },
    coatlicue: { color: "#FF6B35", icon: "🌍" },
    xipe_totec: { color: "#FF2D78", icon: "🌸" },
  }[pillar.deity];

  return (
    <motion.div
      layout
      className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden"
    >
      <div
        className="p-4 border-b border-slate-800"
        style={{ background: `linear-gradient(135deg, ${deityConfig.color}10, transparent)` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{deityConfig.icon}</span>
            <div>
              <h3 className="font-semibold text-slate-200">{pillar.name}</h3>
              <p className="text-xs text-slate-500">{pillar.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${config.color}`}>
              {pillar.score.toFixed(1)}
            </div>
            <Badge variant="outline" className={`${config.bg} ${config.color} border-opacity-30`}>
              {config.label}
            </Badge>
          </div>
        </div>

        <div className="mt-3">
          <Progress value={pillar.score} className="h-1.5" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-2">
          {pillar.kpis.map((kpi) => (
            <KPICard key={kpi.id} kpi={kpi} />
          ))}
        </div>

        {/* Blessings & Curses */}
        {(pillar.blessings.length > 0 || pillar.curses.length > 0) && (
          <div className="space-y-2">
            {pillar.blessings.map((blessing, idx) => (
              <div key={`blessing-${idx}`} className="flex items-center gap-2 text-xs text-emerald-400">
                <Sparkles className="w-3 h-3" />
                <span>{blessing}</span>
              </div>
            ))}
            {pillar.curses.map((curse, idx) => (
              <div key={`curse-${idx}`} className="flex items-center gap-2 text-xs text-red-400">
                <Flame className="w-3 h-3" />
                <span>{curse}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Ritual Card Component ───────────────────────────────────────────────────

const RitualCard: React.FC<{ ritual: Ritual; onExecute: () => void }> = ({ ritual, onExecute }) => {
  const deityConfig = {
    quetzalcoatl: { color: "text-cyan-400", bg: "bg-cyan-500/20" },
    tezcatlipoca: { color: "text-purple-400", bg: "bg-purple-500/20" },
    huitzilopochtli: { color: "text-amber-400", bg: "bg-amber-500/20" },
    tlaloc: { color: "text-blue-400", bg: "bg-blue-500/20" },
    coatlicue: { color: "text-orange-400", bg: "bg-orange-500/20" },
    xipe_totec: { color: "text-pink-400", bg: "bg-pink-500/20" },
  }[ritual.deity];

  const statusConfig = {
    idle: { label: "Listo", color: "text-slate-400" },
    running: { label: "Ejecutando...", color: "text-amber-400" },
    completed: { label: "Completado", color: "text-emerald-400" },
    failed: { label: "Fallido", color: "text-red-400" },
  }[ritual.status];

  const timeUntil = Math.max(0, Math.floor((ritual.nextRun - Date.now()) / 1000 / 60));

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="p-3 rounded-lg border border-slate-800 bg-slate-900/30"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {DEITY_ICONS[ritual.deity]}
          <div>
            <h4 className="text-sm font-medium text-slate-300">{ritual.name}</h4>
            <p className="text-xs text-slate-500">{ritual.description}</p>
          </div>
        </div>
        <Badge className={`${deityConfig.bg} ${deityConfig.color} text-[10px]`}>
          {statusConfig.label}
        </Badge>
      </div>

      <div className="flex items-center justify-between mt-3 text-xs">
        <div className="flex items-center gap-4">
          <span className="text-slate-500">
            Success: <span className="text-emerald-400">{ritual.successRate.toFixed(1)}%</span>
          </span>
          <span className="text-slate-500">
            Next: <span className="text-blue-400">{timeUntil}m</span>
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs border-slate-700"
          onClick={onExecute}
          disabled={ritual.status === "running"}
        >
          {ritual.status === "running" ? (
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
          ) : (
            <Play className="w-3 h-3 mr-1" />
          )}
          Ejecutar
        </Button>
      </div>
    </motion.div>
  );
};

// ─── Prophecy Card Component ─────────────────────────────────────────────────

const ProphecyCard: React.FC<{ prophecy: Prophecy }> = ({ prophecy }) => {
  const severityConfig = {
    info: { color: "text-blue-400", bg: "bg-blue-500/20", icon: <Scroll className="w-4 h-4" /> },
    warning: { color: "text-amber-400", bg: "bg-amber-500/20", icon: <AlertTriangle className="w-4 h-4" /> },
    critical: { color: "text-red-400", bg: "bg-red-500/20", icon: <Flame className="w-4 h-4" /> },
  }[prophecy.severity];

  const deityConfig = {
    quetzalcoatl: "🐍",
    tezcatlipoca: "🌙",
    huitzilopochtli: "☀️",
    tlaloc: "🌧️",
    coatlicue: "🌍",
    xipe_totec: "🌸",
  }[prophecy.deity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-3 rounded-lg border ${severityConfig.bg} ${severityConfig.color} border-opacity-30`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${severityConfig.color}`}>{severityConfig.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span>{deityConfig}</span>
            <span className="text-xs font-medium">Profecía</span>
            <span className="text-xs opacity-60">· {prophecy.timeframe}</span>
          </div>
          <p className="text-sm">{prophecy.prediction}</p>
          {prophecy.mitigation && (
            <p className="text-xs mt-1 opacity-70">
              Mitigación: {prophecy.mitigation}
            </p>
          )}
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="opacity-60">Probabilidad</span>
              <span>{prophecy.probability.toFixed(0)}%</span>
            </div>
            <Progress value={prophecy.probability} className="h-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Panel Component ────────────────────────────────────────────────────

export const DekateotlGovernancePanel: React.FC = () => {
  const { matrix, executeRitual, performSacrifice, requestBlessing } = useDekateotlGovernance();
  const [selectedDeity, setSelectedDeity] = useState<AztekDeity | null>(null);

  const statusConfig = STATUS_CONFIG[matrix.systemStatus];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-purple-500/20 flex items-center justify-center border border-amber-500/30">
            <Scroll className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Dekateotl Governance</h2>
            <p className="text-xs text-slate-400">Sistema de Gobernanza Azteca v10</p>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${statusConfig.bg} ${statusConfig.border}`}>
          <span className={statusConfig.color}>{statusConfig.icon}</span>
          <div className="text-right">
            <div className={`text-lg font-bold ${statusConfig.color}`}>
              {matrix.overallScore.toFixed(1)}
            </div>
            <div className={`text-xs uppercase tracking-wider ${statusConfig.color} opacity-70`}>
              {matrix.systemStatus}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="pillars" className="w-full">
        <TabsList className="bg-slate-900/50 border border-slate-800">
          <TabsTrigger value="pillars" className="data-[state=active]:bg-slate-800">
            <Shield className="w-4 h-4 mr-2" />
            Pilares
          </TabsTrigger>
          <TabsTrigger value="rituals" className="data-[state=active]:bg-slate-800">
            <RefreshCw className="w-4 h-4 mr-2" />
            Rituales
          </TabsTrigger>
          <TabsTrigger value="prophecies" className="data-[state=active]:bg-slate-800">
            <Scroll className="w-4 h-4 mr-2" />
            Profecías
          </TabsTrigger>
        </TabsList>

        {/* Pillars Tab */}
        <TabsContent value="pillars" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {matrix.pillars.map((pillar) => (
              <PillarCard key={pillar.deity} pillar={pillar} />
            ))}
          </div>

          {/* Governance Matrix Overview */}
          <Card className="mt-4 bg-slate-900/30 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-300">Matriz de Gobernanza</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-2 text-center">
                {matrix.pillars.map((pillar) => {
                  const config = PILLAR_STATUS_CONFIG[pillar.status];
                  const deityConfig = {
                    quetzalcoatl: { icon: "🐍", name: "Quetzalcóatl" },
                    tezcatlipoca: { icon: "🌙", name: "Tezcatlipoca" },
                    huitzilopochtli: { icon: "☀️", name: "Huitzilopochtli" },
                    tlaloc: { icon: "🌧️", name: "Tlaloc" },
                    coatlicue: { icon: "🌍", name: "Coatlicue" },
                    xipe_totec: { icon: "🌸", name: "Xipe Totec" },
                  }[pillar.deity];

                  return (
                    <TooltipProvider key={pillar.deity}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`p-3 rounded-lg border ${config.bg} ${config.color} border-opacity-30 cursor-pointer hover:scale-105 transition-transform`}>
                            <div className="text-2xl mb-1">{deityConfig.icon}</div>
                            <div className="text-xs font-medium">{pillar.score.toFixed(0)}</div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-medium">{deityConfig.name}</p>
                          <p className="text-xs opacity-70">{pillar.kpis.length} KPIs</p>
                          <p className={`text-xs ${config.color}`}>{config.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rituals Tab */}
        <TabsContent value="rituals" className="mt-4 space-y-3">
          {matrix.activeRituals.map((ritual) => (
            <RitualCard
              key={ritual.id}
              ritual={ritual}
              onExecute={() => executeRitual(ritual.id)}
            />
          ))}
        </TabsContent>

        {/* Prophecies Tab */}
        <TabsContent value="prophecies" className="mt-4 space-y-3">
          {matrix.prophecies.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p>No hay profecías activas</p>
              <p className="text-xs opacity-60">El sistema está en equilibrio</p>
            </div>
          ) : (
            matrix.prophecies.map((prophecy) => (
              <ProphecyCard key={prophecy.id} prophecy={prophecy} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DekateotlGovernancePanel;
