// ============================================================================
// DEKATEOTL GOVERNANCE v10
// Sistema de Gobernanza con Matrices Aztecas de KPIs Vivos
// TAMV MD-X4™ | Subsistema Mítico de Control
// 
// Dioses Aztecas y sus Dominios:
// - Quetzalcóatl: Sabiduría, Conocimiento, Viento
// - Tezcatlipoca: Oscuridad, Noche, Providencia
// - Huitzilopochtli: Guerra, Sol, Movimiento
// - Tlaloc: Lluvia, Fertilidad, Agua
// - Coatlicue: Tierra, Vida, Muerte
// - Xipe Totec: Primavera, Renovación, Agricultura
// ============================================================================

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Types & Enums ───────────────────────────────────────────────────────────

export type AztekDeity =
  | "quetzalcoatl"  // Sabiduría, ML, Conocimiento
  | "tezcatlipoca"  // Oscuridad, Seguridad, Noche
  | "huitzilopochtli" // Guerra, Performance, Movimiento
  | "tlaloc"        // Lluvia, Datos, Flujo
  | "coatlicue"     // Tierra, Infraestructura, Base
  | "xipe_totec";   // Renovación, CI/CD, Ciclos

export type GovernanceDomain =
  | "knowledge"
  | "security"
  | "performance"
  | "data"
  | "infrastructure"
  | "renewal";

export type KPICategory =
  | "technical"
  | "security"
  | "business"
  | "operational"
  | "compliance";

export interface KPI {
  id: string;
  name: string;
  description: string;
  category: KPICategory;
  domain: GovernanceDomain;
  deity: AztekDeity;
  unit: string;
  target: number;
  warning: number;
  critical: number;
  current: number;
  trend: number[]; // Last 24 values
  status: "healthy" | "warning" | "critical" | "unknown";
  lastUpdated: number;
  weight: number; // 0-1 for governance score
}

export interface GovernancePillar {
  deity: AztekDeity;
  domain: GovernanceDomain;
  name: string;
  description: string;
  kpis: KPI[];
  score: number; // 0-100
  status: "optimal" | "stable" | "degraded" | "critical";
  blessings: string[]; // Active benefits
  curses: string[];    // Active issues
}

export interface GovernanceMatrix {
  pillars: GovernancePillar[];
  overallScore: number;
  systemStatus: "divine" | "blessed" | "neutral" | "cursed" | "chaos";
  activeRituals: Ritual[];
  prophecies: Prophecy[];
  lastUpdate: number;
}

export interface Ritual {
  id: string;
  name: string;
  deity: AztekDeity;
  description: string;
  automated: boolean;
  schedule: string; // Cron expression
  lastRun: number;
  nextRun: number;
  status: "idle" | "running" | "completed" | "failed";
  successRate: number;
}

export interface Prophecy {
  id: string;
  deity: AztekDeity;
  prediction: string;
  probability: number;
  timeframe: string;
  severity: "info" | "warning" | "critical";
  mitigation?: string;
  triggered: boolean;
  createdAt: number;
}

export interface Sacrifice {
  id: string;
  resource: string;
  amount: number;
  deity: AztekDeity;
  purpose: string;
  timestamp: number;
  accepted: boolean;
}

export interface GovernanceAction {
  id: string;
  deity: AztekDeity;
  type: "blessing" | "curse" | "ritual" | "sacrifice";
  description: string;
  impact: number;
  automated: boolean;
  executed: boolean;
  timestamp: number;
}

// ─── Deity Configurations ────────────────────────────────────────────────────

const DEITY_CONFIG: Record<AztekDeity, {
  name: string;
  domain: GovernanceDomain;
  glyph: string;
  color: string;
  description: string;
}> = {
  quetzalcoatl: {
    name: "Quetzalcóatl",
    domain: "knowledge",
    glyph: "🐍",
    color: "#00D9FF",
    description: "Dios del conocimiento, sabiduría y viento",
  },
  tezcatlipoca: {
    name: "Tezcatlipoca",
    domain: "security",
    glyph: "🌙",
    color: "#9D4EDD",
    description: "Dios de la noche, oscuridad y providencia",
  },
  huitzilopochtli: {
    name: "Huitzilopochtli",
    domain: "performance",
    glyph: "☀️",
    color: "#FFD700",
    description: "Dios de la guerra, el sol y el movimiento",
  },
  tlaloc: {
    name: "Tlaloc",
    domain: "data",
    glyph: "🌧️",
    color: "#00B4D8",
    description: "Dios de la lluvia, fertilidad y agua",
  },
  coatlicue: {
    name: "Coatlicue",
    domain: "infrastructure",
    glyph: "🌍",
    color: "#FF6B35",
    description: "Diosa de la tierra, vida y muerte",
  },
  xipe_totec: {
    name: "Xipe Totec",
    domain: "renewal",
    glyph: "🌸",
    color: "#FF2D78",
    description: "Dios de la primavera, renovación y agricultura",
  },
};

// ─── Default KPIs ────────────────────────────────────────────────────────────

const DEFAULT_KPIS: Omit<KPI, "current" | "trend" | "status" | "lastUpdated">[] = [
  // Quetzalcóatl - Knowledge
  {
    id: "kpi-ml-accuracy",
    name: "ML Model Accuracy",
    description: "Precisión promedio de modelos de ML",
    category: "technical",
    domain: "knowledge",
    deity: "quetzalcoatl",
    unit: "%",
    target: 95,
    warning: 90,
    critical: 85,
    weight: 0.9,
  },
  {
    id: "kpi-knowledge-base",
    name: "Knowledge Base Coverage",
    description: "Cobertura de base de conocimiento",
    category: "technical",
    domain: "knowledge",
    deity: "quetzalcoatl",
    unit: "%",
    target: 90,
    warning: 80,
    critical: 70,
    weight: 0.7,
  },
  // Tezcatlipoca - Security
  {
    id: "kpi-security-score",
    name: "Security Posture Score",
    description: "Puntuación de seguridad general",
    category: "security",
    domain: "security",
    deity: "tezcatlipoca",
    unit: "pts",
    target: 95,
    warning: 85,
    critical: 70,
    weight: 1.0,
  },
  {
    id: "kpi-threat-detection",
    name: "Threat Detection Rate",
    description: "Tasa de detección de amenazas",
    category: "security",
    domain: "security",
    deity: "tezcatlipoca",
    unit: "%",
    target: 99,
    warning: 95,
    critical: 90,
    weight: 0.95,
  },
  // Huitzilopochtli - Performance
  {
    id: "kpi-api-latency",
    name: "API Latency P99",
    description: "Latencia percentil 99 de APIs",
    category: "technical",
    domain: "performance",
    deity: "huitzilopochtli",
    unit: "ms",
    target: 100,
    warning: 200,
    critical: 500,
    weight: 0.85,
  },
  {
    id: "kpi-throughput",
    name: "System Throughput",
    description: "Throughput del sistema",
    category: "technical",
    domain: "performance",
    deity: "huitzilopochtli",
    unit: "req/s",
    target: 10000,
    warning: 8000,
    critical: 5000,
    weight: 0.8,
  },
  // Tlaloc - Data
  {
    id: "kpi-data-quality",
    name: "Data Quality Score",
    description: "Calidad de datos",
    category: "technical",
    domain: "data",
    deity: "tlaloc",
    unit: "%",
    target: 98,
    warning: 95,
    critical: 90,
    weight: 0.85,
  },
  {
    id: "kpi-pipeline-success",
    name: "Data Pipeline Success",
    description: "Tasa de éxito de pipelines de datos",
    category: "technical",
    domain: "data",
    deity: "tlaloc",
    unit: "%",
    target: 99,
    warning: 97,
    critical: 95,
    weight: 0.75,
  },
  // Coatlicue - Infrastructure
  {
    id: "kpi-uptime",
    name: "System Uptime",
    description: "Tiempo de actividad del sistema",
    category: "operational",
    domain: "infrastructure",
    deity: "coatlicue",
    unit: "%",
    target: 99.99,
    warning: 99.9,
    critical: 99.5,
    weight: 1.0,
  },
  {
    id: "kpi-resource-util",
    name: "Resource Utilization",
    description: "Utilización de recursos",
    category: "operational",
    domain: "infrastructure",
    deity: "coatlicue",
    unit: "%",
    target: 70,
    warning: 85,
    critical: 95,
    weight: 0.7,
  },
  // Xipe Totec - Renewal
  {
    id: "kpi-deployment-freq",
    name: "Deployment Frequency",
    description: "Frecuencia de despliegues",
    category: "operational",
    domain: "renewal",
    deity: "xipe_totec",
    unit: "/day",
    target: 10,
    warning: 5,
    critical: 2,
    weight: 0.6,
  },
  {
    id: "kpi-lead-time",
    name: "Lead Time for Changes",
    description: "Tiempo de entrega de cambios",
    category: "operational",
    domain: "renewal",
    deity: "xipe_totec",
    unit: "hours",
    target: 4,
    warning: 8,
    critical: 24,
    weight: 0.65,
  },
];

// ─── Default Rituals ─────────────────────────────────────────────────────────

const DEFAULT_RITUALS: Ritual[] = [
  {
    id: "ritual-knowledge-sync",
    name: "Sincronización del Conocimiento",
    deity: "quetzalcoatl",
    description: "Sincronizar bases de conocimiento",
    automated: true,
    schedule: "0 */6 * * *",
    lastRun: Date.now() - 3600000,
    nextRun: Date.now() + 18000000,
    status: "idle",
    successRate: 98.5,
  },
  {
    id: "ritual-security-scan",
    name: "Escaneo de Sombras",
    deity: "tezcatlipoca",
    description: "Escanear vulnerabilidades de seguridad",
    automated: true,
    schedule: "0 2 * * *",
    lastRun: Date.now() - 86400000,
    nextRun: Date.now() + 86400000,
    status: "idle",
    successRate: 99.2,
  },
  {
    id: "ritual-performance-sacrifice",
    name: "Sacrificio de Recursos",
    deity: "huitzilopochtli",
    description: "Optimizar rendimiento del sistema",
    automated: true,
    schedule: "0 */4 * * *",
    lastRun: Date.now() - 7200000,
    nextRun: Date.now() + 7200000,
    status: "idle",
    successRate: 97.8,
  },
  {
    id: "ritual-data-purification",
    name: "Purificación de Aguas",
    deity: "tlaloc",
    description: "Limpiar y purificar datos",
    automated: true,
    schedule: "0 1 * * *",
    lastRun: Date.now() - 43200000,
    nextRun: Date.now() + 43200000,
    status: "idle",
    successRate: 99.9,
  },
  {
    id: "ritual-infrastructure-harvest",
    name: "Cosecha de Infraestructura",
    deity: "coatlicue",
    description: "Recolectar métricas de infraestructura",
    automated: true,
    schedule: "*/5 * * * *",
    lastRun: Date.now() - 300000,
    nextRun: Date.now() + 300000,
    status: "idle",
    successRate: 100,
  },
  {
    id: "ritual-renewal-cycle",
    name: "Ciclo de Renovación",
    deity: "xipe_totec",
    description: "Rotar y renovar recursos",
    automated: true,
    schedule: "0 0 * * 0",
    lastRun: Date.now() - 172800000,
    nextRun: Date.now() + 432000000,
    status: "idle",
    successRate: 96.4,
  },
];

// ─── Governance System Class ─────────────────────────────────────────────────

export class DekateotlGovernanceSystem {
  private matrix: GovernanceMatrix;
  private listeners: Set<(matrix: GovernanceMatrix) => void> = new Set();
  private updateInterval: number | null = null;
  private actions: GovernanceAction[] = [];

  constructor() {
    this.matrix = this.initializeMatrix();
    this.startUpdates();
  }

  private initializeMatrix(): GovernanceMatrix {
    const pillars: GovernancePillar[] = (Object.keys(DEITY_CONFIG) as AztekDeity[]).map((deity) => {
      const kpis = DEFAULT_KPIS
        .filter((k) => k.deity === deity)
        .map((k) => this.initializeKPI(k));

      return {
        deity,
        domain: DEITY_CONFIG[deity].domain,
        name: DEITY_CONFIG[deity].name,
        description: DEITY_CONFIG[deity].description,
        kpis,
        score: 85 + Math.random() * 10,
        status: "stable",
        blessings: [],
        curses: [],
      };
    });

    return {
      pillars,
      overallScore: 87,
      systemStatus: "blessed",
      activeRituals: [...DEFAULT_RITUALS],
      prophecies: [],
      lastUpdate: Date.now(),
    };
  }

  private initializeKPI(kpiDef: Omit<KPI, "current" | "trend" | "status" | "lastUpdated">): KPI {
    const target = kpiDef.target;
    const variation = (Math.random() - 0.5) * 10;
    const current = Math.max(0, target + variation);

    return {
      ...kpiDef,
      current,
      trend: Array(24).fill(0).map(() => current + (Math.random() - 0.5) * 5),
      status: this.calculateKPIStatus(current, kpiDef),
      lastUpdated: Date.now(),
    };
  }

  private calculateKPIStatus(current: number, kpi: { target: number; warning: number; critical: number }): KPI["status"] {
    // For metrics where lower is better (like latency)
    const isLowerBetter = kpi.target < kpi.warning;

    if (isLowerBetter) {
      if (current <= kpi.target) return "healthy";
      if (current <= kpi.warning) return "warning";
      if (current <= kpi.critical) return "critical";
      return "critical";
    } else {
      if (current >= kpi.target) return "healthy";
      if (current >= kpi.warning) return "warning";
      if (current >= kpi.critical) return "critical";
      return "critical";
    }
  }

  private startUpdates(): void {
    this.updateInterval = window.setInterval(() => {
      this.updateKPIs();
      this.updatePillarScores();
      this.updateOverallScore();
      this.generateProphecies();
      this.checkRituals();
      this.notifyListeners();
    }, 5000);
  }

  private updateKPIs(): void {
    this.matrix.pillars.forEach((pillar) => {
      pillar.kpis.forEach((kpi) => {
        // Update trend
        kpi.trend.shift();
        const variation = (Math.random() - 0.5) * (kpi.target * 0.05);
        kpi.current = Math.max(0, kpi.current + variation);
        kpi.trend.push(kpi.current);
        kpi.status = this.calculateKPIStatus(kpi.current, kpi);
        kpi.lastUpdated = Date.now();
      });
    });
    this.matrix.lastUpdate = Date.now();
  }

  private updatePillarScores(): void {
    this.matrix.pillars.forEach((pillar) => {
      const kpiScores = pillar.kpis.map((kpi) => {
        const target = kpi.target;
        const current = kpi.current;
        const isLowerBetter = target < kpi.warning;

        let score: number;
        if (isLowerBetter) {
          score = target === 0 ? 100 : Math.max(0, (target / current) * 100);
        } else {
          score = (current / target) * 100;
        }

        return score * kpi.weight;
      });

      const totalWeight = pillar.kpis.reduce((sum, k) => sum + k.weight, 0);
      pillar.score = Math.min(100, kpiScores.reduce((sum, s) => sum + s, 0) / totalWeight);

      // Update pillar status
      if (pillar.score >= 95) pillar.status = "optimal";
      else if (pillar.score >= 85) pillar.status = "stable";
      else if (pillar.score >= 70) pillar.status = "degraded";
      else pillar.status = "critical";

      // Update blessings and curses
      pillar.blessings = pillar.kpis
        .filter((k) => k.status === "healthy")
        .map((k) => `${k.name} está en óptimas condiciones`);

      pillar.curses = pillar.kpis
        .filter((k) => k.status === "critical")
        .map((k) => `${k.name} requiere atención inmediata`);
    });
  }

  private updateOverallScore(): void {
    const scores = this.matrix.pillars.map((p) => p.score);
    this.matrix.overallScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;

    // Update system status
    if (this.matrix.overallScore >= 95) this.matrix.systemStatus = "divine";
    else if (this.matrix.overallScore >= 85) this.matrix.systemStatus = "blessed";
    else if (this.matrix.overallScore >= 70) this.matrix.systemStatus = "neutral";
    else if (this.matrix.overallScore >= 50) this.matrix.systemStatus = "cursed";
    else this.matrix.systemStatus = "chaos";
  }

  private generateProphecies(): void {
    // Remove old prophecies
    this.matrix.prophecies = this.matrix.prophecies.filter(
      (p) => Date.now() - p.createdAt < 86400000 // 24 hours
    );

    // Generate new prophecies based on KPI trends
    if (Math.random() < 0.1 && this.matrix.prophecies.length < 5) {
      const criticalKPIs = this.matrix.pillars
        .flatMap((p) => p.kpis)
        .filter((k) => k.status === "warning" || k.status === "critical");

      if (criticalKPIs.length > 0) {
        const kpi = criticalKPIs[Math.floor(Math.random() * criticalKPIs.length)];
        const deity = kpi.deity;

        const prophecies: Record<AztekDeity, string[]> = {
          quetzalcoatl: ["El conocimiento se nublará", "La sabiduría será probada"],
          tezcatlipoca: ["Las sombras se acercan", "La oscuridad amenaza"],
          huitzilopochtli: ["El sol se debilitará", "La guerra viene"],
          tlaloc: ["Las aguas se agitarán", "La sequía se avecina"],
          coatlicue: ["La tierra temblará", "La madre tierra se alzará"],
          xipe_totec: ["El ciclo se romperá", "La renovación se retrasa"],
        };

        const predictions = prophecies[deity];
        const prophecy: Prophecy = {
          id: `prop-${Date.now()}`,
          deity,
          prediction: predictions[Math.floor(Math.random() * predictions.length)],
          probability: 60 + Math.random() * 30,
          timeframe: "< 24h",
          severity: kpi.status === "critical" ? "critical" : "warning",
          mitigation: `Ajustar ${kpi.name}`,
          triggered: false,
          createdAt: Date.now(),
        };

        this.matrix.prophecies.push(prophecy);
      }
    }
  }

  private checkRituals(): void {
    this.matrix.activeRituals.forEach((ritual) => {
      if (Date.now() >= ritual.nextRun) {
        ritual.status = "running";
        // Simulate ritual execution
        setTimeout(() => {
          ritual.status = Math.random() > 0.05 ? "completed" : "failed";
          ritual.lastRun = Date.now();
          ritual.nextRun = Date.now() + 3600000; // +1 hour
          this.notifyListeners();
        }, 1000);
      }
    });
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener({ ...this.matrix }));
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  subscribe(listener: (matrix: GovernanceMatrix) => void): () => void {
    this.listeners.add(listener);
    listener({ ...this.matrix });
    return () => this.listeners.delete(listener);
  }

  getDeityConfig(deity: AztekDeity) {
    return DEITY_CONFIG[deity];
  }

  executeRitual(ritualId: string): boolean {
    const ritual = this.matrix.activeRituals.find((r) => r.id === ritualId);
    if (ritual && ritual.status === "idle") {
      ritual.status = "running";
      this.notifyListeners();

      setTimeout(() => {
        ritual.status = "completed";
        ritual.lastRun = Date.now();
        ritual.successRate = Math.min(100, ritual.successRate + 0.1);
        this.notifyListeners();
      }, 2000);

      return true;
    }
    return false;
  }

  performSacrifice(resource: string, amount: number, deity: AztekDeity): Sacrifice {
    const sacrifice: Sacrifice = {
      id: `sac-${Date.now()}`,
      resource,
      amount,
      deity,
      purpose: `Offering to ${DEITY_CONFIG[deity].name}`,
      timestamp: Date.now(),
      accepted: Math.random() > 0.1,
    };

    if (sacrifice.accepted) {
      // Bless the deity
      const pillar = this.matrix.pillars.find((p) => p.deity === deity);
      if (pillar) {
        pillar.score = Math.min(100, pillar.score + 2);
        pillar.blessings.push(`Sacrifice accepted: ${resource}`);
      }
    }

    return sacrifice;
  }

  requestBlessing(deity: AztekDeity, type: string): boolean {
    const pillar = this.matrix.pillars.find((p) => p.deity === deity);
    if (pillar && pillar.score >= 80) {
      pillar.blessings.push(`Blessing granted: ${type}`);
      return true;
    }
    return false;
  }

  getActions(): GovernanceAction[] {
    return [...this.actions];
  }

  destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}

// ─── Singleton Instance ──────────────────────────────────────────────────────

let dekateotlInstance: DekateotlGovernanceSystem | null = null;

export function getDekateotlGovernance(): DekateotlGovernanceSystem {
  if (!dekateotlInstance) {
    dekateotlInstance = new DekateotlGovernanceSystem();
  }
  return dekateotlInstance;
}

// ─── React Hook ──────────────────────────────────────────────────────────────

export function useDekateotlGovernance() {
  const [matrix, setMatrix] = useState<GovernanceMatrix>(() => getDekateotlGovernance().getActions() && {
    pillars: [],
    overallScore: 0,
    systemStatus: "neutral",
    activeRituals: [],
    prophecies: [],
    lastUpdate: Date.now(),
  } as GovernanceMatrix);

  useEffect(() => {
    return getDekateotlGovernance().subscribe(setMatrix);
  }, []);

  const executeRitual = useCallback((ritualId: string) => {
    return getDekateotlGovernance().executeRitual(ritualId);
  }, []);

  const performSacrifice = useCallback((resource: string, amount: number, deity: AztekDeity) => {
    return getDekateotlGovernance().performSacrifice(resource, amount, deity);
  }, []);

  const requestBlessing = useCallback((deity: AztekDeity, type: string) => {
    return getDekateotlGovernance().requestBlessing(deity, type);
  }, []);

  const getDeityConfig = useCallback((deity: AztekDeity) => {
    return getDekateotlGovernance().getDeityConfig(deity);
  }, []);

  return {
    matrix,
    executeRitual,
    performSacrifice,
    requestBlessing,
    getDeityConfig,
  };
}

export default DekateotlGovernanceSystem;
