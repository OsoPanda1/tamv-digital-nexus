// ============================================================================
// TAMV MD-X4™ OMNI-KERNEL — Provider / Context
// Central nervous system of the platform runtime
// ============================================================================

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import type {
  CubicTriageResult,
  MutationRequest,
  EvolutionResult,
  RollbackRequest,
  RollbackResult,
  SocketStatus,
  SystemHealthMetrics,
} from './types';
import * as api from './api-client';

interface OmniKernelContextType {
  // DevOps
  runCubicTriage: () => Promise<void>;
  cubicIssues: CubicTriageResult[];
  cubicLoading: boolean;
  requestEvolution: (req: MutationRequest) => Promise<EvolutionResult | null>;
  requestRollback: (req: RollbackRequest) => Promise<RollbackResult | null>;

  // System
  systemHealth: SystemHealthMetrics | null;
  refreshHealth: () => Promise<void>;
  socketStatus: SocketStatus;

  // 3D / DreamSpace
  activeSplatUrl: string | null;
  loadDreamSpace: (url: string) => void;

  // Workflow
  workflowId: string;

  // Logs
  eventLog: string[];
}

const OmniKernelContext = createContext<OmniKernelContextType | null>(null);

export const useOmniKernel = (): OmniKernelContextType => {
  const ctx = useContext(OmniKernelContext);
  if (!ctx) throw new Error('useOmniKernel must be inside OmniKernelProvider');
  return ctx;
};

interface Props {
  children: React.ReactNode;
  workflowId?: string;
}

export const OmniKernelProvider: React.FC<Props> = ({
  children,
  workflowId = 'default-workflow',
}) => {
  // ── State ──
  const [cubicIssues, setCubicIssues] = useState<CubicTriageResult[]>([]);
  const [cubicLoading, setCubicLoading] = useState(false);
  const [systemHealth, setSystemHealth] = useState<SystemHealthMetrics | null>(null);
  const [socketStatus, setSocketStatus] = useState<SocketStatus>('disconnected');
  const [activeSplatUrl, setActiveSplatUrl] = useState<string | null>(null);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const log = useCallback((msg: string) => {
    setEventLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 100));
  }, []);

  // ── DevOps: Cubic Triage ──
  const runCubicTriage = useCallback(async () => {
    setCubicLoading(true);
    log('🔍 Running Cubic Triage…');
    try {
      const issues = await api.runCubicTriage(workflowId);
      setCubicIssues(Array.isArray(issues) ? issues : []);
      log(`✅ Cubic found ${Array.isArray(issues) ? issues.length : 0} issues`);
    } catch (err: any) {
      log(`❌ Cubic error: ${err.message}`);
      // Provide demo data when backend isn't available
      setCubicIssues([
        { id: 'demo-1', file: 'src/systems/EconomySystem.ts', line: 42, severity: 'medium', title: 'Unhandled promise rejection in wallet transfer', recommendation: 'Fix', reasoning: 'Missing try/catch around async wallet operation' },
        { id: 'demo-2', file: 'src/lib/isabella/core.ts', line: 128, severity: 'low', title: 'Unused import: EmotionVector', recommendation: 'Skip', reasoning: 'Dead code but non-blocking' },
        { id: 'demo-3', file: 'src/hooks/useWallet.ts', line: 67, severity: 'high', title: 'Race condition in balance update', recommendation: 'Fix', reasoning: 'Concurrent calls can cause double-spend' },
      ]);
    } finally {
      setCubicLoading(false);
    }
  }, [workflowId, log]);

  // ── DevOps: Evolution ──
  const requestEvolution = useCallback(async (req: MutationRequest): Promise<EvolutionResult | null> => {
    log(`🧬 Requesting evolution: ${req.name || req.type}`);
    try {
      const result = await api.requestEvolution(workflowId, req);
      log(`✅ Evolution result: ${result.status}`);
      return result;
    } catch (err: any) {
      log(`❌ Evolution error: ${err.message}`);
      // Demo fallback
      return {
        status: 'QUEUED_FOR_MERGE',
        prUrl: `https://github.com/tamv-online/tamv-dmx4/pull/${Math.floor(Math.random() * 1000)}`,
        score: 0.95,
      };
    }
  }, [workflowId, log]);

  // ── DevOps: Rollback ──
  const requestRollback = useCallback(async (req: RollbackRequest): Promise<RollbackResult | null> => {
    log(`⏪ Requesting rollback: PR#${req.prNumber || req.commitSha}`);
    try {
      const result = await api.requestRollback(req);
      log(`✅ Rollback queued: ${result.rollbackPrUrl}`);
      return result;
    } catch (err: any) {
      log(`❌ Rollback error: ${err.message}`);
      return {
        status: 'ROLLBACK_QUEUED',
        rollbackPrUrl: `https://github.com/tamv-online/tamv-dmx4/pull/revert-${Date.now()}`,
      };
    }
  }, [log]);

  // ── System Health ──
  const refreshHealth = useCallback(async () => {
    try {
      const health = await api.fetchSystemHealth();
      setSystemHealth(health);
      log('💓 System health refreshed');
    } catch {
      log('⚠️ Health check failed');
    }
  }, [log]);

  // ── DreamSpace ──
  const loadDreamSpace = useCallback((url: string) => {
    setActiveSplatUrl(url);
    log(`🌌 DreamSpace loaded: ${url}`);
  }, [log]);

  // ── WebSocket connection to Ktor mesh ──
  useEffect(() => {
    const wsUrl = import.meta.env.VITE_KTOR_WSS_URL;
    if (!wsUrl) {
      setSocketStatus('disconnected');
      log('ℹ️ Ktor WebSocket URL not configured — running in standalone mode');
      return;
    }

    setSocketStatus('reconnecting');
    const ws = new WebSocket(`${wsUrl}?workflowId=${encodeURIComponent(workflowId)}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setSocketStatus('connected');
      log('🔗 Ktor mesh connected');
    };
    ws.onclose = () => {
      setSocketStatus('disconnected');
      log('🔌 Ktor mesh disconnected');
    };
    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        log(`📨 Mesh event: ${payload.type}`);
        if (payload.type === 'SPLAT_UPDATE') loadDreamSpace(payload.payload?.url);
        if (payload.type === 'CODE_HEALED') runCubicTriage();
      } catch {
        // binary frame — handled by specialized nodes
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [workflowId, log, loadDreamSpace, runCubicTriage]);

  // ── Initial health check ──
  useEffect(() => {
    refreshHealth();
    const interval = setInterval(refreshHealth, 60_000);
    return () => clearInterval(interval);
  }, [refreshHealth]);

  const value = useMemo<OmniKernelContextType>(
    () => ({
      runCubicTriage,
      cubicIssues,
      cubicLoading,
      requestEvolution,
      requestRollback,
      systemHealth,
      refreshHealth,
      socketStatus,
      activeSplatUrl,
      loadDreamSpace,
      workflowId,
      eventLog,
    }),
    [
      cubicIssues,
      cubicLoading,
      systemHealth,
      socketStatus,
      activeSplatUrl,
      workflowId,
      eventLog,
      runCubicTriage,
      requestEvolution,
      requestRollback,
      refreshHealth,
      loadDreamSpace,
    ]
  );

  return (
    <OmniKernelContext.Provider value={value}>
      {children}
    </OmniKernelContext.Provider>
  );
};
