// ============================================================================
// RADARES SIGNAL SYSTEM v10
// Sistema de Ingesta de Señales y Visualización
// TAMV MD-X4™ | Subsistema Mítico de Control
//
// Radares:
// - Quetzalcóatl: Radar de Señales Sociales y ML
// - Ojo de Ra: Radar de Seguridad y Anomalías
// - MOS (Matrix Operating System): Radar de Infraestructura y Métricas
// ============================================================================

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Types & Enums ───────────────────────────────────────────────────────────

export type RadarType = "quetzalcoatl" | "ojo_de_ra" | "mos";

export type SignalSource =
  | "social_media"
  | "api_gateway"
  | "security_events"
  | "infrastructure"
  | "user_behavior"
  | "market_data"
  | "iot_sensors"
  | "blockchain"
  | "ml_predictions";

export type SignalSeverity = "info" | "low" | "medium" | "high" | "critical";

export type SignalStatus = "pending" | "processing" | "processed" | "failed" | "archived";

export interface Signal {
  id: string;
  type: RadarType;
  source: SignalSource;
  severity: SignalSeverity;
  status: SignalStatus;
  timestamp: number;
  data: Record<string, unknown>;
  metadata: {
    priority: number;
    tags: string[];
    correlationId?: string;
    processedBy?: string;
  };
  position: {
    angle: number; // 0-360 degrees
    distance: number; // 0-100 (distance from center)
    elevation: number; // -90 to 90 degrees
  };
  velocity: {
    speed: number;
    direction: number;
  };
  ttl: number; // Time to live in seconds
}

export interface RadarSweep {
  type: RadarType;
  angle: number;
  range: number;
  signals: Signal[];
  timestamp: number;
  scanTime: number; // ms
}

export interface RadarConfig {
  type: RadarType;
  name: string;
  description: string;
  sweepSpeed: number; // degrees per second
  maxRange: number;
  frequency: number; // MHz
  sensitivity: number; // 0-1
  enabled: boolean;
  filters: SignalSource[];
}

export interface SignalStats {
  totalSignals: number;
  byType: Record<RadarType, number>;
  bySource: Record<SignalSource, number>;
  bySeverity: Record<SignalSeverity, number>;
  avgProcessingTime: number;
  signalsPerSecond: number;
  activeSignals: number;
}

export interface Anomaly {
  id: string;
  signalId: string;
  type: RadarType;
  pattern: string;
  confidence: number;
  severity: SignalSeverity;
  detectedAt: number;
  description: string;
  recommendation?: string;
}

export interface Correlation {
  id: string;
  signals: string[];
  pattern: string;
  strength: number; // 0-1
  timestamp: number;
  insight: string;
}

export interface RadarState {
  radars: RadarConfig[];
  signals: Signal[];
  anomalies: Anomaly[];
  correlations: Correlation[];
  stats: SignalStats;
  sweepAngle: number;
  isScanning: boolean;
  lastUpdate: number;
}

// ─── Radar Configurations ────────────────────────────────────────────────────

const RADAR_CONFIGS: RadarConfig[] = [
  {
    type: "quetzalcoatl",
    name: "Quetzalcóatl",
    description: "Radar de Señales Sociales y ML",
    sweepSpeed: 45,
    maxRange: 100,
    frequency: 2400,
    sensitivity: 0.85,
    enabled: true,
    filters: ["social_media", "user_behavior", "ml_predictions"],
  },
  {
    type: "ojo_de_ra",
    name: "Ojo de Ra",
    description: "Radar de Seguridad y Anomalías",
    sweepSpeed: 60,
    maxRange: 100,
    frequency: 5800,
    sensitivity: 0.95,
    enabled: true,
    filters: ["security_events", "api_gateway"],
  },
  {
    type: "mos",
    name: "MOS",
    description: "Matrix Operating System - Infraestructura y Métricas",
    sweepSpeed: 30,
    maxRange: 100,
    frequency: 920,
    sensitivity: 0.75,
    enabled: true,
    filters: ["infrastructure", "iot_sensors", "market_data"],
  },
];

// ─── Signal Generators ───────────────────────────────────────────────────────

const SIGNAL_SOURCES: SignalSource[] = [
  "social_media",
  "api_gateway",
  "security_events",
  "infrastructure",
  "user_behavior",
  "market_data",
  "iot_sensors",
  "blockchain",
  "ml_predictions",
];

const SEVERITY_WEIGHTS: Record<SignalSeverity, number> = {
  info: 50,
  low: 30,
  medium: 15,
  high: 4,
  critical: 1,
};

function generateRandomSignal(radarType: RadarType): Signal {
  const source = getRandomSourceForRadar(radarType);
  const severity = getWeightedRandomSeverity();
  const angle = Math.random() * 360;
  const distance = 20 + Math.random() * 80;

  return {
    id: `sig-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: radarType,
    source,
    severity,
    status: "pending",
    timestamp: Date.now(),
    data: generateSignalData(source, severity),
    metadata: {
      priority: calculatePriority(severity),
      tags: generateTags(source, severity),
    },
    position: {
      angle,
      distance,
      elevation: (Math.random() - 0.5) * 60,
    },
    velocity: {
      speed: Math.random() * 10,
      direction: Math.random() * 360,
    },
    ttl: 300 + Math.random() * 600, // 5-15 minutes
  };
}

function getRandomSourceForRadar(radarType: RadarType): SignalSource {
  const mapping: Record<RadarType, SignalSource[]> = {
    quetzalcoatl: ["social_media", "user_behavior", "ml_predictions", "market_data"],
    ojo_de_ra: ["security_events", "api_gateway", "blockchain"],
    mos: ["infrastructure", "iot_sensors", "market_data"],
  };
  const sources = mapping[radarType];
  return sources[Math.floor(Math.random() * sources.length)];
}

function getWeightedRandomSeverity(): SignalSeverity {
  const rand = Math.random() * 100;
  let cumulative = 0;
  for (const [severity, weight] of Object.entries(SEVERITY_WEIGHTS)) {
    cumulative += weight;
    if (rand <= cumulative) return severity as SignalSeverity;
  }
  return "info";
}

function generateSignalData(source: SignalSource, severity: SignalSeverity): Record<string, unknown> {
  const templates: Record<SignalSource, () => Record<string, unknown>> = {
    social_media: () => ({
      platform: ["twitter", "reddit", "discord"][Math.floor(Math.random() * 3)],
      sentiment: Math.random() * 2 - 1,
      mentions: Math.floor(Math.random() * 1000),
      engagement: Math.floor(Math.random() * 10000),
    }),
    api_gateway: () => ({
      endpoint: `/api/v${Math.floor(Math.random() * 3)}/${["users", "orders", "data"][Math.floor(Math.random() * 3)]}`,
      method: ["GET", "POST", "PUT", "DELETE"][Math.floor(Math.random() * 4)],
      responseTime: Math.random() * 1000,
      statusCode: Math.random() > 0.9 ? [500, 502, 503][Math.floor(Math.random() * 3)] : 200,
    }),
    security_events: () => ({
      eventType: ["login_attempt", "access_denied", "suspicious_activity", "brute_force"][Math.floor(Math.random() * 4)],
      ip: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
      userAgent: "Mozilla/5.0...",
      threatScore: Math.floor(Math.random() * 100),
    }),
    infrastructure: () => ({
      metric: ["cpu", "memory", "disk", "network"][Math.floor(Math.random() * 4)],
      value: Math.random() * 100,
      threshold: 80,
      instance: `instance-${Math.floor(Math.random() * 100)}`,
    }),
    user_behavior: () => ({
      action: ["login", "purchase", "logout", "search"][Math.floor(Math.random() * 4)],
      userId: `user-${Math.floor(Math.random() * 10000)}`,
      sessionDuration: Math.floor(Math.random() * 3600),
      device: ["mobile", "desktop", "tablet"][Math.floor(Math.random() * 3)],
    }),
    market_data: () => ({
      symbol: ["BTC", "ETH", "SOL", "TCEP"][Math.floor(Math.random() * 4)],
      price: Math.random() * 100000,
      volume: Math.random() * 1000000,
      change24h: (Math.random() - 0.5) * 20,
    }),
    iot_sensors: () => ({
      sensorId: `sensor-${Math.floor(Math.random() * 1000)}`,
      type: ["temperature", "humidity", "pressure", "motion"][Math.floor(Math.random() * 4)],
      value: Math.random() * 100,
      unit: ["°C", "%", "hPa", "boolean"][Math.floor(Math.random() * 4)],
    }),
    blockchain: () => ({
      network: ["ethereum", "solana", "polygon"][Math.floor(Math.random() * 3)],
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      gasUsed: Math.floor(Math.random() * 1000000),
      confirmations: Math.floor(Math.random() * 100),
    }),
    ml_predictions: () => ({
      model: ["anomaly_detection", "sentiment", "forecasting"][Math.floor(Math.random() * 3)],
      confidence: Math.random(),
      prediction: Math.random() > 0.5,
      features: Math.floor(Math.random() * 100),
    }),
  };

  return templates[source]();
}

function calculatePriority(severity: SignalSeverity): number {
  const priorities: Record<SignalSeverity, number> = {
    info: 1,
    low: 2,
    medium: 3,
    high: 4,
    critical: 5,
  };
  return priorities[severity];
}

function generateTags(source: SignalSource, severity: SignalSeverity): string[] {
  const tags = [source, severity];
  if (severity === "critical" || severity === "high") {
    tags.push("requires_attention");
  }
  return tags;
}

// ─── Radares System Class ────────────────────────────────────────────────────

export class RadaresSignalSystem {
  private state: RadarState;
  private listeners: Set<(state: RadarState) => void> = new Set();
  private sweepInterval: number | null = null;
  private signalInterval: number | null = null;
  private cleanupInterval: number | null = null;

  constructor() {
    this.state = {
      radars: [...RADAR_CONFIGS],
      signals: [],
      anomalies: [],
      correlations: [],
      stats: this.initializeStats(),
      sweepAngle: 0,
      isScanning: true,
      lastUpdate: Date.now(),
    };

    this.startScanning();
    this.startSignalGeneration();
    this.startCleanup();
  }

  private initializeStats(): SignalStats {
    return {
      totalSignals: 0,
      byType: { quetzalcoatl: 0, ojo_de_ra: 0, mos: 0 },
      bySource: Object.fromEntries(SIGNAL_SOURCES.map((s) => [s, 0])) as Record<SignalSource, number>,
      bySeverity: { info: 0, low: 0, medium: 0, high: 0, critical: 0 },
      avgProcessingTime: 0,
      signalsPerSecond: 0,
      activeSignals: 0,
    };
  }

  private startScanning(): void {
    this.sweepInterval = window.setInterval(() => {
      this.state.sweepAngle = (this.state.sweepAngle + 3) % 360;
      this.performSweep();
      this.notifyListeners();
    }, 50);
  }

  private startSignalGeneration(): void {
    this.signalInterval = window.setInterval(() => {
      if (Math.random() < 0.3) {
        // 30% chance to generate a signal each interval
        const activeRadars = this.state.radars.filter((r) => r.enabled);
        if (activeRadars.length > 0) {
          const radar = activeRadars[Math.floor(Math.random() * activeRadars.length)];
          this.addSignal(generateRandomSignal(radar.type));
        }
      }
    }, 1000);
  }

  private startCleanup(): void {
    this.cleanupInterval = window.setInterval(() => {
      this.cleanupExpiredSignals();
    }, 30000);
  }

  private performSweep(): void {
    const sweepRange = 10; // 10 degree sweep window
    const detectedSignals = this.state.signals.filter(
      (s) =>
        s.status === "pending" &&
        Math.abs(this.normalizeAngle(s.position.angle - this.state.sweepAngle)) <= sweepRange
    );

    detectedSignals.forEach((signal) => {
      signal.status = "processing";
      // Simulate processing
      setTimeout(() => {
        signal.status = Math.random() > 0.05 ? "processed" : "failed";
        this.checkForAnomaly(signal);
        this.notifyListeners();
      }, 500 + Math.random() * 1000);
    });
  }

  private normalizeAngle(angle: number): number {
    while (angle > 180) angle -= 360;
    while (angle < -180) angle += 360;
    return Math.abs(angle);
  }

  private addSignal(signal: Signal): void {
    this.state.signals.unshift(signal);
    if (this.state.signals.length > 1000) {
      this.state.signals = this.state.signals.slice(0, 1000);
    }

    // Update stats
    this.state.stats.totalSignals++;
    this.state.stats.byType[signal.type]++;
    this.state.stats.bySource[signal.source]++;
    this.state.stats.bySeverity[signal.severity]++;
    this.state.stats.activeSignals = this.state.signals.filter((s) => s.status !== "archived").length;
    this.state.stats.signalsPerSecond = this.state.stats.totalSignals / ((Date.now() / 1000) % 60 + 1);

    this.checkForCorrelations(signal);
    this.notifyListeners();
  }

  private checkForAnomaly(signal: Signal): void {
    if (signal.severity === "high" || signal.severity === "critical") {
      const anomaly: Anomaly = {
        id: `anomaly-${Date.now()}`,
        signalId: signal.id,
        type: signal.type,
        pattern: "anomalous_behavior",
        confidence: 0.7 + Math.random() * 0.3,
        severity: signal.severity,
        detectedAt: Date.now(),
        description: `Anomaly detected in ${signal.source} with ${signal.severity} severity`,
        recommendation: "Review signal details and take appropriate action",
      };

      this.state.anomalies.unshift(anomaly);
      if (this.state.anomalies.length > 100) {
        this.state.anomalies = this.state.anomalies.slice(0, 100);
      }
    }
  }

  private checkForCorrelations(newSignal: Signal): void {
    // Simple correlation check: same source within last minute
    const recentSignals = this.state.signals.filter(
      (s) =>
        s.id !== newSignal.id &&
        s.source === newSignal.source &&
        Date.now() - s.timestamp < 60000
    );

    if (recentSignals.length >= 3) {
      const correlation: Correlation = {
        id: `corr-${Date.now()}`,
        signals: [newSignal.id, ...recentSignals.slice(0, 2).map((s) => s.id)],
        pattern: "burst_activity",
        strength: 0.6 + Math.random() * 0.4,
        timestamp: Date.now(),
        insight: `Detected burst of ${recentSignals.length + 1} signals from ${newSignal.source}`,
      };

      this.state.correlations.unshift(correlation);
      if (this.state.correlations.length > 50) {
        this.state.correlations = this.state.correlations.slice(0, 50);
      }
    }
  }

  private cleanupExpiredSignals(): void {
    const now = Date.now();
    this.state.signals = this.state.signals.filter((signal) => {
      const age = (now - signal.timestamp) / 1000;
      return age < signal.ttl;
    });
    this.state.stats.activeSignals = this.state.signals.filter((s) => s.status !== "archived").length;
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener({ ...this.state }));
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  subscribe(listener: (state: RadarState) => void): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => this.listeners.delete(listener);
  }

  toggleRadar(type: RadarType): void {
    const radar = this.state.radars.find((r) => r.type === type);
    if (radar) {
      radar.enabled = !radar.enabled;
      this.notifyListeners();
    }
  }

  updateRadarSensitivity(type: RadarType, sensitivity: number): void {
    const radar = this.state.radars.find((r) => r.type === type);
    if (radar) {
      radar.sensitivity = Math.max(0, Math.min(1, sensitivity));
      this.notifyListeners();
    }
  }

  getSignalsByRadar(type: RadarType): Signal[] {
    return this.state.signals.filter((s) => s.type === type);
  }

  getSignalsBySeverity(severity: SignalSeverity): Signal[] {
    return this.state.signals.filter((s) => s.severity === severity);
  }

  acknowledgeSignal(id: string): boolean {
    const signal = this.state.signals.find((s) => s.id === id);
    if (signal) {
      signal.status = "archived";
      this.state.stats.activeSignals--;
      this.notifyListeners();
      return true;
    }
    return false;
  }

  injectTestSignal(radarType: RadarType, severity: SignalSeverity): Signal {
    const signal = generateRandomSignal(radarType);
    signal.severity = severity;
    this.addSignal(signal);
    return signal;
  }

  getRadarConfig(type: RadarType): RadarConfig | undefined {
    return this.state.radars.find((r) => r.type === type);
  }

  destroy(): void {
    if (this.sweepInterval) clearInterval(this.sweepInterval);
    if (this.signalInterval) clearInterval(this.signalInterval);
    if (this.cleanupInterval) clearInterval(this.cleanupInterval);
  }
}

// ─── Singleton Instance ──────────────────────────────────────────────────────

let radaresInstance: RadaresSignalSystem | null = null;

export function getRadaresSignal(): RadaresSignalSystem {
  if (!radaresInstance) {
    radaresInstance = new RadaresSignalSystem();
  }
  return radaresInstance;
}

// ─── React Hook ──────────────────────────────────────────────────────────────

export function useRadaresSignal() {
  const [state, setState] = useState<RadarState>(() => getRadaresSignal().getRadarConfig("quetzalcoatl") && {
    radars: [],
    signals: [],
    anomalies: [],
    correlations: [],
    stats: {
      totalSignals: 0,
      byType: { quetzalcoatl: 0, ojo_de_ra: 0, mos: 0 },
      bySource: {} as Record<SignalSource, number>,
      bySeverity: { info: 0, low: 0, medium: 0, high: 0, critical: 0 },
      avgProcessingTime: 0,
      signalsPerSecond: 0,
      activeSignals: 0,
    },
    sweepAngle: 0,
    isScanning: true,
    lastUpdate: Date.now(),
  } as RadarState);

  useEffect(() => {
    return getRadaresSignal().subscribe(setState);
  }, []);

  const toggleRadar = useCallback((type: RadarType) => {
    getRadaresSignal().toggleRadar(type);
  }, []);

  const updateSensitivity = useCallback((type: RadarType, sensitivity: number) => {
    getRadaresSignal().updateRadarSensitivity(type, sensitivity);
  }, []);

  const acknowledgeSignal = useCallback((id: string) => {
    return getRadaresSignal().acknowledgeSignal(id);
  }, []);

  const injectTestSignal = useCallback((type: RadarType, severity: SignalSeverity) => {
    return getRadaresSignal().injectTestSignal(type, severity);
  }, []);

  return {
    state,
    toggleRadar,
    updateSensitivity,
    acknowledgeSignal,
    injectTestSignal,
  };
}

export default RadaresSignalSystem;
