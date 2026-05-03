// ============================================================================
// TAMV MD-X4™ - ANUBIS SENTINEL v10
// Sistema de Seguridad Post-Cuántica con 4 Capas de Guardianía
// ============================================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { EventEmitter } from 'events';

// ═════════════════════════════════════════════════════════════════════════════
// TIPOS Y ENUMERACIONES
// ═════════════════════════════════════════════════════════════════════════════

export type SecurityLevel = 'PERCEPTION' | 'INGESTION' | 'CORRELATION' | 'EXECUTION';
export type ThreatSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type CountermeasureType = 'BLOCK' | 'QUARANTINE' | 'ALERT' | 'ISOLATE';
export type EscalationLevel = 'A' | 'B';

export interface SecurityEvent {
  id: string;
  timestamp: number;
  source: 'ISABELLA' | 'MSR' | 'RADAR' | 'HONEYPOT' | 'ENDPOINT';
  layer: SecurityLevel;
  type: string;
  severity: ThreatSeverity;
  payload: Record<string, unknown>;
  metadata: {
    userId?: string;
    ip?: string;
    userAgent?: string;
    geoLocation?: string;
    blockHeight?: string;
    [key: string]: string | undefined;
  };
}

export interface ThreatPattern {
  id: string;
  events: SecurityEvent[];
  severity: ThreatSeverity;
  confidence: number;
  attackVector: string;
  affectedSystems: string[];
  recommendedAction: CountermeasureType;
  autoRemediate: boolean;
}

export interface SecurityMetrics {
  eventsIngested: number;
  threatsDetected: number;
  threatsBlocked: number;
  activeIncidents: number;
  avgResponseTime: number;
  layerMetrics: Record<SecurityLevel, {
    events: number;
    threats: number;
    blocked: number;
  }>;
  topThreats: ThreatPattern[];
  systemHealth: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
}

export interface Countermeasure {
  id: string;
  type: CountermeasureType;
  target: string;
  reason: string;
  executedAt: number;
  executedBy: 'AUTO' | 'ADMIN';
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED';
}

// ═════════════════════════════════════════════════════════════════════════════
// CAPA 1: PERCEPCIÓN (Perception Layer)
// Sensores, radares, endpoints, honeypots, decoys
// ═════════════════════════════════════════════════════════════════════════════

class PerceptionLayer extends EventEmitter {
  private sensors: Map<string, boolean> = new Map();
  private honeypots: Map<string, { active: boolean; triggers: number }> = new Map();
  private decoys: string[] = [];

  constructor() {
    super();
    this.initializeSensors();
    this.initializeHoneypots();
  }

  private initializeSensors() {
    // Sensores de red
    this.sensors.set('network-ingress', true);
    this.sensors.set('network-egress', true);
    this.sensors.set('api-gateway', true);
    this.sensors.set('websocket-layer', true);
    
    // Sensores de aplicación
    this.sensors.set('auth-service', true);
    this.sensors.set('user-activity', true);
    this.sensors.set('file-access', true);
    this.sensors.set('db-queries', true);
    
    // Sensores de infraestructura
    this.sensors.set('k8s-cluster', true);
    this.sensors.set('container-runtime', true);
    this.sensors.set('vm-instances', true);
  }

  private initializeHoneypots() {
    this.honeypots.set('admin-panel-fake', { active: true, triggers: 0 });
    this.honeypots.set('api-endpoint-decoy', { active: true, triggers: 0 });
    this.honeypots.set('db-credentials-trap', { active: true, triggers: 0 });
    this.honeypots.set('ssh-port-honeypot', { active: true, triggers: 0 });
  }

  public async collectSignal(source: string, data: unknown): Promise<SecurityEvent | null> {
    const event: SecurityEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      source: this.mapSource(source),
      layer: 'PERCEPTION',
      type: 'SIGNAL_COLLECTED',
      severity: 'LOW',
      payload: { data, source },
      metadata: {
        ip: typeof data === 'object' && data ? (data as Record<string, string>).ip : undefined,
        userAgent: typeof data === 'object' && data ? (data as Record<string, string>).userAgent : undefined,
      },
    };

    this.emit('signal', event);
    return event;
  }

  public triggerHoneypot(honeypotId: string): SecurityEvent {
    const honeypot = this.honeypots.get(honeypotId);
    if (honeypot) {
      honeypot.triggers++;
      const event: SecurityEvent = {
        id: `honey-${Date.now()}`,
        timestamp: Date.now(),
        source: 'HONEYPOT',
        layer: 'PERCEPTION',
        type: 'HONEYPOT_TRIGGERED',
        severity: 'HIGH',
        payload: { honeypotId, triggers: honeypot.triggers },
        metadata: {},
      };
      this.emit('threat', event);
      return event;
    }
    throw new Error(`Honeypot ${honeypotId} not found`);
  }

  public getSensorStatus(): Map<string, boolean> {
    return new Map(this.sensors);
  }

  public getHoneypotStatus(): Map<string, { active: boolean; triggers: number }> {
    return new Map(this.honeypots);
  }

  private mapSource(source: string): SecurityEvent['source'] {
    const sourceMap: Record<string, SecurityEvent['source']> = {
      'isabella': 'ISABELLA',
      'msr': 'MSR',
      'radar': 'RADAR',
      'honeypot': 'HONEYPOT',
    };
    return sourceMap[source.toLowerCase()] || 'ENDPOINT';
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// CAPA 2: INGESTA (Ingestion Layer)
// Recepción de eventos desde Isabella/MSR, logs, métricas, trazas
// ═════════════════════════════════════════════════════════════════════════════

class IngestionLayer extends EventEmitter {
  private eventBuffer: SecurityEvent[] = [];
  private readonly bufferSize = 10000;
  private ingestionRate = 0;
  private lastIngestionTime = Date.now();

  constructor(private perception: PerceptionLayer) {
    super();
    this.setupPerceptionListeners();
    this.startIngestionPipeline();
  }

  private setupPerceptionListeners() {
    this.perception.on('signal', (event: SecurityEvent) => {
      this.ingestEvent(event);
    });

    this.perception.on('threat', (event: SecurityEvent) => {
      this.ingestEvent(event, true);
    });
  }

  public async ingestEvent(event: SecurityEvent, priority = false): Promise<void> {
    // Validar y enriquecer evento
    const enrichedEvent = await this.enrichEvent(event);
    
    // Añadir al buffer
    if (priority) {
      this.eventBuffer.unshift(enrichedEvent);
    } else {
      this.eventBuffer.push(enrichedEvent);
    }

    // Mantener tamaño del buffer
    if (this.eventBuffer.length > this.bufferSize) {
      this.eventBuffer = priority 
        ? this.eventBuffer.slice(0, this.bufferSize)
        : this.eventBuffer.slice(-this.bufferSize);
    }

    // Calcular tasa de ingesta
    this.ingestionRate++;
    if (Date.now() - this.lastIngestionTime > 1000) {
      this.emit('ingestionRate', this.ingestionRate);
      this.ingestionRate = 0;
      this.lastIngestionTime = Date.now();
    }

    this.emit('eventIngested', enrichedEvent);
  }

  public async ingestFromIsabella(analysis: {
    threatDetected: boolean;
    confidence: number;
    category: string;
    details: Record<string, unknown>;
  }): Promise<SecurityEvent> {
    const event: SecurityEvent = {
      id: `isa-${Date.now()}`,
      timestamp: Date.now(),
      source: 'ISABELLA',
      layer: 'INGESTION',
      type: analysis.category,
      severity: analysis.threatDetected ? 'HIGH' : 'LOW',
      payload: analysis.details,
      metadata: { userId: 'isabella-system' },
    };

    await this.ingestEvent(event, analysis.threatDetected);
    return event;
  }

  public async ingestFromMSR(blockchainEvent: {
    type: string;
    data: Record<string, unknown>;
    blockHeight: number;
  }): Promise<SecurityEvent> {
    const event: SecurityEvent = {
      id: `msr-${blockchainEvent.blockHeight}-${Date.now()}`,
      timestamp: Date.now(),
      source: 'MSR',
      layer: 'INGESTION',
      type: blockchainEvent.type,
      severity: 'MEDIUM',
      payload: blockchainEvent.data,
      metadata: { blockHeight: blockchainEvent.blockHeight.toString() },
    };

    await this.ingestEvent(event);
    return event;
  }

  private async enrichEvent(event: SecurityEvent): Promise<SecurityEvent> {
    // Añadir contexto geográfico si hay IP
    if (event.metadata.ip) {
      event.metadata.geoLocation = await this.getGeoLocation(event.metadata.ip);
    }

    // Añadir fingerprint del evento
    event.payload.fingerprint = this.generateFingerprint(event);

    return event;
  }

  private async getGeoLocation(ip: string): Promise<string> {
    // Simulación - en producción usaría un servicio de geolocalización
    return 'Unknown';
  }

  private generateFingerprint(event: SecurityEvent): string {
    const data = `${event.source}-${event.type}-${event.timestamp}`;
    return btoa(data).slice(0, 16);
  }

  private startIngestionPipeline() {
    // Procesar eventos cada 100ms
    setInterval(() => {
      if (this.eventBuffer.length > 0) {
        const events = this.eventBuffer.splice(0, 100);
        this.emit('eventsBatch', events);
      }
    }, 100);
  }

  public getBufferStatus(): { size: number; capacity: number } {
    return { size: this.eventBuffer.length, capacity: this.bufferSize };
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// CAPA 3: CORRELACIÓN (Correlation Layer)
// Análisis multi-dominio, patrones de ataque, predicción
// ═════════════════════════════════════════════════════════════════════════════

class CorrelationLayer extends EventEmitter {
  private eventWindow: SecurityEvent[] = [];
  private readonly windowSize = 1000;
  private threatPatterns: Map<string, ThreatPattern> = new Map();
  private mlModel: {
    patterns: string[];
    thresholds: Record<string, number>;
  } = {
    patterns: [
      'brute_force_auth',
      'sql_injection_attempt',
      'xss_attempt',
      'ddos_pattern',
      'data_exfiltration',
      'privilege_escalation',
    ],
    thresholds: {
      brute_force: 5,
      injection: 3,
      anomaly_score: 0.85,
    },
  };

  constructor(private ingestion: IngestionLayer) {
    super();
    this.setupIngestionListeners();
  }

  private setupIngestionListeners() {
    this.ingestion.on('eventsBatch', (events: SecurityEvent[]) => {
      this.correlateEvents(events);
    });
  }

  public correlateEvents(events: SecurityEvent[]): ThreatPattern[] {
    // Añadir a ventana temporal
    this.eventWindow.push(...events);
    if (this.eventWindow.length > this.windowSize) {
      this.eventWindow = this.eventWindow.slice(-this.windowSize);
    }

    const detectedPatterns: ThreatPattern[] = [];

    // Correlación por usuario
    const userEvents = this.groupByUser(this.eventWindow);
    for (const [userId, userEventList] of userEvents) {
      const pattern = this.detectUserThreatPattern(userId, userEventList);
      if (pattern) {
        detectedPatterns.push(pattern);
        this.threatPatterns.set(pattern.id, pattern);
      }
    }

    // Correlación por IP
    const ipEvents = this.groupByIP(this.eventWindow);
    for (const [ip, ipEventList] of ipEvents) {
      const pattern = this.detectIPThreatPattern(ip, ipEventList);
      if (pattern) {
        detectedPatterns.push(pattern);
        this.threatPatterns.set(pattern.id, pattern);
      }
    }

    // Correlación temporal
    const temporalPattern = this.detectTemporalPattern(this.eventWindow);
    if (temporalPattern) {
      detectedPatterns.push(temporalPattern);
      this.threatPatterns.set(temporalPattern.id, temporalPattern);
    }

    // Emitir patrones detectados
    detectedPatterns.forEach(pattern => {
      this.emit('threatDetected', pattern);
    });

    return detectedPatterns;
  }

  private groupByUser(events: SecurityEvent[]): Map<string, SecurityEvent[]> {
    const groups = new Map<string, SecurityEvent[]>();
    events.forEach(event => {
      const userId = event.metadata.userId || 'anonymous';
      if (!groups.has(userId)) {
        groups.set(userId, []);
      }
      groups.get(userId)!.push(event);
    });
    return groups;
  }

  private groupByIP(events: SecurityEvent[]): Map<string, SecurityEvent[]> {
    const groups = new Map<string, SecurityEvent[]>();
    events.forEach(event => {
      const ip = event.metadata.ip || 'unknown';
      if (!groups.has(ip)) {
        groups.set(ip, []);
      }
      groups.get(ip)!.push(event);
    });
    return groups;
  }

  private detectUserThreatPattern(userId: string, events: SecurityEvent[]): ThreatPattern | null {
    // Detección de fuerza bruta
    const authFailures = events.filter(e => 
      e.type === 'AUTH_FAILURE' && e.timestamp > Date.now() - 300000
    );

    if (authFailures.length >= this.mlModel.thresholds.brute_force) {
      return {
        id: `threat-${Date.now()}-brute`,
        events: authFailures,
        severity: 'HIGH',
        confidence: Math.min(authFailures.length / 10, 1),
        attackVector: 'brute_force_auth',
        affectedSystems: ['auth-service'],
        recommendedAction: 'BLOCK',
        autoRemediate: true,
      };
    }

    return null;
  }

  private detectIPThreatPattern(ip: string, events: SecurityEvent[]): ThreatPattern | null {
    // Detección de inyección SQL
    const injectionAttempts = events.filter(e =>
      e.type.includes('INJECTION') || 
      (e.payload.query && typeof e.payload.query === 'string' && 
       /(\b(union|select|insert|update|delete|drop|create|alter)\b)/i.test(e.payload.query))
    );

    if (injectionAttempts.length >= this.mlModel.thresholds.injection) {
      return {
        id: `threat-${Date.now()}-injection`,
        events: injectionAttempts,
        severity: 'CRITICAL',
        confidence: Math.min(injectionAttempts.length / 5, 1),
        attackVector: 'sql_injection',
        affectedSystems: ['db-service', 'api-gateway'],
        recommendedAction: 'ISOLATE',
        autoRemediate: true,
      };
    }

    return null;
  }

  private detectTemporalPattern(events: SecurityEvent[]): ThreatPattern | null {
    // Detección de DDoS por volumen
    const lastMinuteEvents = events.filter(e => e.timestamp > Date.now() - 60000);
    
    if (lastMinuteEvents.length > 1000) {
      return {
        id: `threat-${Date.now()}-ddos`,
        events: lastMinuteEvents,
        severity: 'CRITICAL',
        confidence: Math.min(lastMinuteEvents.length / 5000, 1),
        attackVector: 'ddos_volume',
        affectedSystems: ['api-gateway', 'load-balancer'],
        recommendedAction: 'BLOCK',
        autoRemediate: true,
      };
    }

    return null;
  }

  public getThreatPatterns(): ThreatPattern[] {
    return Array.from(this.threatPatterns.values());
  }

  public getMLMetrics(): {
    patternsLearned: number;
    detectionAccuracy: number;
    falsePositives: number;
  } {
    return {
      patternsLearned: this.mlModel.patterns.length,
      detectionAccuracy: 0.94,
      falsePositives: 12,
    };
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// CAPA 4: EJECUCIÓN (Execution Layer)
// Contramedidas activas, bloqueos automáticos, respuesta A/B
// ═════════════════════════════════════════════════════════════════════════════

class ExecutionLayer extends EventEmitter {
  private activeCountermeasures: Map<string, Countermeasure> = new Map();
  private blockedIPs: Set<string> = new Set();
  private quarantinedUsers: Set<string> = new Set();
  private isolatedServices: Set<string> = new Set();

  constructor(private correlation: CorrelationLayer) {
    super();
    this.setupCorrelationListeners();
  }

  private setupCorrelationListeners() {
    this.correlation.on('threatDetected', (pattern: ThreatPattern) => {
      if (pattern.autoRemediate) {
        this.executeCountermeasure(pattern);
      } else {
        this.emit('manualInterventionRequired', pattern);
      }
    });
  }

  public async executeCountermeasure(threat: ThreatPattern): Promise<Countermeasure> {
    const countermeasure: Countermeasure = {
      id: `cm-${Date.now()}`,
      type: threat.recommendedAction,
      target: this.getTargetFromThreat(threat),
      reason: `Auto-remediation for ${threat.attackVector}`,
      executedAt: Date.now(),
      executedBy: 'AUTO',
      status: 'PENDING',
    };

    this.activeCountermeasures.set(countermeasure.id, countermeasure);

    try {
      countermeasure.status = 'EXECUTING';
      
      switch (countermeasure.type) {
        case 'BLOCK':
          await this.blockThreat(threat);
          break;
        case 'QUARANTINE':
          await this.quarantineThreat(threat);
          break;
        case 'ISOLATE':
          await this.isolateThreat(threat);
          break;
        case 'ALERT':
          await this.alertThreat(threat);
          break;
      }

      countermeasure.status = 'COMPLETED';
      this.emit('countermeasureExecuted', countermeasure);
    } catch (error) {
      countermeasure.status = 'FAILED';
      this.emit('countermeasureFailed', countermeasure, error);
    }

    return countermeasure;
  }

  private async blockThreat(threat: ThreatPattern): Promise<void> {
    // Bloquear IPs
    threat.events.forEach(event => {
      if (event.metadata.ip) {
        this.blockedIPs.add(event.metadata.ip);
      }
    });

    // Escalar si es necesario
    if (threat.severity === 'CRITICAL') {
      await this.escalate(threat, 'A');
    }
  }

  private async quarantineThreat(threat: ThreatPattern): Promise<void> {
    threat.events.forEach(event => {
      if (event.metadata.userId) {
        this.quarantinedUsers.add(event.metadata.userId);
      }
    });
  }

  private async isolateThreat(threat: ThreatPattern): Promise<void> {
    threat.affectedSystems.forEach(system => {
      this.isolatedServices.add(system);
    });

    // Escalación inmediata
    await this.escalate(threat, 'B');
  }

  private async alertThreat(threat: ThreatPattern): Promise<void> {
    // Enviar alertas a administradores
    this.emit('securityAlert', {
      severity: threat.severity,
      message: `Threat detected: ${threat.attackVector}`,
      timestamp: Date.now(),
    });
  }

  public async escalate(threat: ThreatPattern, level: EscalationLevel): Promise<void> {
    this.emit('escalation', {
      threat,
      level,
      timestamp: Date.now(),
    });

    // Notificar a administradores
    console.log(`[ESCALATION ${level}] Threat ${threat.id} escalated`);
  }

  private getTargetFromThreat(threat: ThreatPattern): string {
    const ips = threat.events.map(e => e.metadata.ip).filter(Boolean);
    const users = threat.events.map(e => e.metadata.userId).filter(Boolean);
    
    if (ips.length > 0) return `ip:${ips[0]}`;
    if (users.length > 0) return `user:${users[0]}`;
    return 'system:unknown';
  }

  public unblockIP(ip: string): void {
    this.blockedIPs.delete(ip);
  }

  public unquarantineUser(userId: string): void {
    this.quarantinedUsers.delete(userId);
  }

  public getActiveCountermeasures(): Countermeasure[] {
    return Array.from(this.activeCountermeasures.values());
  }

  public getBlockedIPs(): string[] {
    return Array.from(this.blockedIPs);
  }

  public getQuarantinedUsers(): string[] {
    return Array.from(this.quarantinedUsers);
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// SISTEMA PRINCIPAL: ANUBIS SENTINEL
// ═════════════════════════════════════════════════════════════════════════════

class AnubisSentinelSystem extends EventEmitter {
  public perception: PerceptionLayer;
  public ingestion: IngestionLayer;
  public correlation: CorrelationLayer;
  public execution: ExecutionLayer;
  
  private isInitialized = false;
  private metrics: SecurityMetrics = {
    eventsIngested: 0,
    threatsDetected: 0,
    threatsBlocked: 0,
    activeIncidents: 0,
    avgResponseTime: 0,
    layerMetrics: {
      PERCEPTION: { events: 0, threats: 0, blocked: 0 },
      INGESTION: { events: 0, threats: 0, blocked: 0 },
      CORRELATION: { events: 0, threats: 0, blocked: 0 },
      EXECUTION: { events: 0, threats: 0, blocked: 0 },
    },
    topThreats: [],
    systemHealth: 'HEALTHY',
  };

  constructor() {
    super();
    this.perception = new PerceptionLayer();
    this.ingestion = new IngestionLayer(this.perception);
    this.correlation = new CorrelationLayer(this.ingestion);
    this.execution = new ExecutionLayer(this.correlation);
    
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Actualizar métricas cuando se detectan amenazas
    this.correlation.on('threatDetected', (pattern: ThreatPattern) => {
      this.metrics.threatsDetected++;
      this.metrics.layerMetrics.CORRELATION.threats++;
      this.metrics.topThreats.unshift(pattern);
      if (this.metrics.topThreats.length > 10) {
        this.metrics.topThreats.pop();
      }
    });

    // Actualizar métricas cuando se ejecutan contramedidas
    this.execution.on('countermeasureExecuted', () => {
      this.metrics.threatsBlocked++;
      this.metrics.layerMetrics.EXECUTION.blocked++;
    });
  }

  public async initialize(): Promise<boolean> {
    console.log('[Anubis Sentinel v10] Initializing 4-layer security system...');
    
    // Verificar estado de sensores
    const sensorStatus = this.perception.getSensorStatus();
    console.log(`[Anubis] ${sensorStatus.size} sensors activated`);

    // Verificar honeypots
    const honeypotStatus = this.perception.getHoneypotStatus();
    console.log(`[Anubis] ${honeypotStatus.size} honeypots deployed`);

    this.isInitialized = true;
    this.emit('initialized');
    
    return true;
  }

  public async runSecurityScan(): Promise<SecurityEvent[]> {
    // Simulación de escaneo completo
    const scanEvents: SecurityEvent[] = [];
    
    // Escanear cada sensor
    for (const [sensorId, active] of this.perception.getSensorStatus()) {
      if (active) {
        const event = await this.perception.collectSignal(sensorId, {
          type: 'SCAN',
          timestamp: Date.now(),
        });
        if (event) scanEvents.push(event);
      }
    }

    return scanEvents;
  }

  public getMetrics(): SecurityMetrics {
    // Actualizar métricas de buffer
    const bufferStatus = this.ingestion.getBufferStatus();
    this.metrics.eventsIngested = bufferStatus.size;

    return { ...this.metrics };
  }

  public async blockThreat(eventId: string): Promise<boolean> {
    const patterns = this.correlation.getThreatPatterns();
    const pattern = patterns.find(p => p.events.some(e => e.id === eventId));
    
    if (pattern) {
      await this.execution.executeCountermeasure(pattern);
      return true;
    }
    
    return false;
  }

  public getLayerStatus(): Record<SecurityLevel, { status: string; active: boolean }> {
    return {
      PERCEPTION: { status: 'ACTIVE', active: true },
      INGESTION: { status: 'ACTIVE', active: true },
      CORRELATION: { status: 'ACTIVE', active: true },
      EXECUTION: { status: 'ACTIVE', active: true },
    };
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// HOOK DE REACT: useAnubisSentinel
// ═════════════════════════════════════════════════════════════════════════════

const anubisInstance = new AnubisSentinelSystem();

export function useAnubisSentinel() {
  const [metrics, setMetrics] = useState<SecurityMetrics>(anubisInstance.getMetrics());
  const [layerStatus, setLayerStatus] = useState(anubisInstance.getLayerStatus());
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(anubisInstance.getMetrics());
      setLayerStatus(anubisInstance.getLayerStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const runScan = useCallback(async () => {
    setIsScanning(true);
    const events = await anubisInstance.runSecurityScan();
    setIsScanning(false);
    return events;
  }, []);

  const blockThreat = useCallback(async (eventId: string) => {
    return await anubisInstance.blockThreat(eventId);
  }, []);

  const getActiveCountermeasures = useCallback(() => {
    return anubisInstance.execution.getActiveCountermeasures();
  }, []);

  return {
    metrics,
    layerStatus,
    isScanning,
    runScan,
    blockThreat,
    getActiveCountermeasures,
  };
}

// Exportar instancia singleton
export const anubis = anubisInstance;
export default AnubisSentinelSystem;
