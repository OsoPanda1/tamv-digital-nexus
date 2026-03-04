// ============================================================================
// TAMV MD-X4™ - HORUS TOWER v5
// Sistema de Observabilidad con 5 Dimensiones
// ============================================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { EventEmitter } from 'events';

// ═════════════════════════════════════════════════════════════════════════════
// TIPOS Y ENUMERACIONES
// ═════════════════════════════════════════════════════════════════════════════

export type Dimension = 'METRICS' | 'TRACES' | 'ANOMALIES' | 'PREDICTION' | 'ETHICAL_RISK';
export type Domain = 'SOCIAL' | 'XR' | 'ECONOMY' | 'AI' | 'CONTENT';
export type MetricType = 'SLI' | 'SLO' | 'KPI';
export type AnomalySeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  type: MetricType;
  domain: Domain;
  timestamp: number;
  labels: Record<string, string>;
  thresholds: {
    warning: number;
    critical: number;
  };
}

export interface Trace {
  id: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  service: string;
  operation: string;
  startTime: number;
  duration: number;
  status: 'OK' | 'ERROR' | 'UNKNOWN';
  tags: Record<string, string>;
  logs: Array<{
    timestamp: number;
    fields: Record<string, unknown>;
  }>;
}

export interface Anomaly {
  id: string;
  dimension: Dimension;
  severity: AnomalySeverity;
  metric: string;
  expectedValue: number;
  actualValue: number;
  deviation: number;
  detectedAt: number;
  domain: Domain;
  description: string;
  autoResolved: boolean;
}

export interface Prediction {
  id: string;
  metric: string;
  domain: Domain;
  currentValue: number;
  predictedValues: Array<{
    timestamp: number;
    value: number;
    confidence: number;
  }>;
  horizon: '1h' | '24h' | '7d' | '30d';
  model: string;
  accuracy: number;
}

export interface EthicalRiskScore {
  domain: Domain;
  overallScore: number; // 0-100, menor es mejor
  dimensions: {
    fairness: number;
    transparency: number;
    privacy: number;
    accountability: number;
    bias: number;
  };
  violations: Array<{
    type: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    description: string;
  }>;
  lastUpdated: number;
}

export interface Dashboard {
  id: string;
  domain: Domain;
  name: string;
  panels: Array<{
    id: string;
    type: 'metric' | 'graph' | 'trace' | 'anomaly' | 'prediction';
    title: string;
    query: string;
    refreshInterval: number;
  }>;
}

// ═════════════════════════════════════════════════════════════════════════════
// DIMENSIÓN 1: MÉTRICAS (Metrics)
// ═════════════════════════════════════════════════════════════════════════════

class MetricsDimension extends EventEmitter {
  private metrics: Map<string, Metric> = new Map();
  private timeSeries: Map<string, Array<{ timestamp: number; value: number }>> = new Map();
  private readonly retentionPeriod = 7 * 24 * 60 * 60 * 1000; // 7 días

  constructor() {
    super();
    this.startCleanupInterval();
  }

  public recordMetric(metric: Omit<Metric, 'id' | 'timestamp'>): Metric {
    const fullMetric: Metric = {
      ...metric,
      id: `metric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    this.metrics.set(fullMetric.id, fullMetric);

    // Almacenar serie temporal
    const seriesKey = `${metric.domain}:${metric.name}`;
    if (!this.timeSeries.has(seriesKey)) {
      this.timeSeries.set(seriesKey, []);
    }
    this.timeSeries.get(seriesKey)!.push({
      timestamp: fullMetric.timestamp,
      value: fullMetric.value,
    });

    // Verificar umbrales
    this.checkThresholds(fullMetric);

    this.emit('metricRecorded', fullMetric);
    return fullMetric;
  }

  public getMetric(id: string): Metric | undefined {
    return this.metrics.get(id);
  }

  public queryMetrics(filters: {
    domain?: Domain;
    type?: MetricType;
    name?: string;
    startTime?: number;
    endTime?: number;
  }): Metric[] {
    return Array.from(this.metrics.values()).filter(metric => {
      if (filters.domain && metric.domain !== filters.domain) return false;
      if (filters.type && metric.type !== filters.type) return false;
      if (filters.name && !metric.name.includes(filters.name)) return false;
      if (filters.startTime && metric.timestamp < filters.startTime) return false;
      if (filters.endTime && metric.timestamp > filters.endTime) return false;
      return true;
    });
  }

  public getTimeSeries(name: string, domain: Domain, duration: number): Array<{ timestamp: number; value: number }> {
    const seriesKey = `${domain}:${name}`;
    const series = this.timeSeries.get(seriesKey) || [];
    const cutoff = Date.now() - duration;
    return series.filter(point => point.timestamp >= cutoff);
  }

  private checkThresholds(metric: Metric): void {
    if (metric.value >= metric.thresholds.critical) {
      this.emit('thresholdExceeded', {
        metric,
        level: 'CRITICAL',
        message: `${metric.name} exceeded critical threshold: ${metric.value} ${metric.unit}`,
      });
    } else if (metric.value >= metric.thresholds.warning) {
      this.emit('thresholdExceeded', {
        metric,
        level: 'WARNING',
        message: `${metric.name} exceeded warning threshold: ${metric.value} ${metric.unit}`,
      });
    }
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      const cutoff = Date.now() - this.retentionPeriod;
      
      // Limpiar métricas antiguas
      for (const [id, metric] of this.metrics) {
        if (metric.timestamp < cutoff) {
          this.metrics.delete(id);
        }
      }

      // Limpiar series temporales
      for (const [key, series] of this.timeSeries) {
        this.timeSeries.set(key, series.filter(point => point.timestamp >= cutoff));
      }
    }, 60 * 60 * 1000); // Cada hora
  }

  public getSLIs(): Metric[] {
    return this.queryMetrics({ type: 'SLI' });
  }

  public getSLOs(): Metric[] {
    return this.queryMetrics({ type: 'SLO' });
  }

  public getKPIs(): Metric[] {
    return this.queryMetrics({ type: 'KPI' });
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// DIMENSIÓN 2: TRAZAS (Traces)
// ═════════════════════════════════════════════════════════════════════════════

class TracesDimension extends EventEmitter {
  private traces: Map<string, Trace> = new Map();
  private serviceMap: Map<string, Set<string>> = new Map();

  public startTrace(traceData: Omit<Trace, 'id' | 'startTime' | 'spans'>): string {
    const id = `trace-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const trace: Trace = { ...traceData, id, startTime: Date.now(), spans: [] } as Trace;
    this.traces.set(id, trace);
    return id;
  }
}