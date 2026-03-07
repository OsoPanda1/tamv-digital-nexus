// ============================================================================
// TAMV MD-X4™ — System Health Monitor (Functional)
// Real-time status of all OMNI-KERNEL layers
// ============================================================================

import { useOmniKernel } from '@/lib/omni-kernel';
import { motion } from 'framer-motion';
import {
  Activity, RefreshCw, Wifi, WifiOff,
  CheckCircle2, AlertTriangle, XCircle, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATUS_CONFIG = {
  healthy: { icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: 'bg-emerald-400' },
  degraded: { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-amber-400', bg: 'bg-amber-500/10', dot: 'bg-amber-400' },
  offline: { icon: <XCircle className="w-4 h-4" />, color: 'text-red-400', bg: 'bg-red-500/10', dot: 'bg-red-400' },
  disconnected: { icon: <XCircle className="w-4 h-4" />, color: 'text-red-400', bg: 'bg-red-500/10', dot: 'bg-red-400' },
};

const LAYER_LABELS: Record<string, { name: string; level: string }> = {
  l0_identity: { name: 'Core Identity & Comms', level: 'L0' },
  l1_social: { name: 'Social & Creadores', level: 'L1' },
  l2_economy: { name: 'Economía & XR', level: 'L2' },
  l3_governance: { name: 'Gobernanza & DAO', level: 'L3' },
  isabella_risk_analyzer: { name: 'Isabella RiskAnalyzer', level: 'AI' },
  ktor_comms: { name: 'Ktor Mesh Comms', level: 'NET' },
};

export const SystemHealthMonitor = () => {
  const { systemHealth, refreshHealth, socketStatus } = useOmniKernel();

  if (!systemHealth) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading system health…
      </div>
    );
  }

  const entries = Object.entries(systemHealth).filter(([k]) => k !== 'last_check');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          System Health
        </h3>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 text-xs ${socketStatus === 'connected' ? 'text-emerald-400' : 'text-muted-foreground'}`}>
            {socketStatus === 'connected' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            Mesh: {socketStatus}
          </div>
          <Button
            onClick={refreshHealth}
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {entries.map(([key, status], i) => {
          const label = LAYER_LABELS[key] || { name: key, level: '?' };
          const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.offline;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 rounded-xl border border-white/5 ${config.bg} transition-colors`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded">
                  {label.level}
                </span>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
                  <span className={`text-xs font-medium ${config.color}`}>{String(status)}</span>
                </div>
              </div>
              <p className="text-sm font-medium text-foreground">{label.name}</p>
            </motion.div>
          );
        })}
      </div>

      <p className="text-[10px] text-muted-foreground text-right">
        Last check: {new Date(systemHealth.last_check).toLocaleString()}
      </p>
    </div>
  );
};
