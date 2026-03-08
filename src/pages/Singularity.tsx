// ============================================================================
// TAMV MD-X4™ — Singularity Operations Center + Critical Logs
// ============================================================================

import { motion } from 'framer-motion';
import { Cpu, Sparkles, Activity, AlertTriangle, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EpicBackground } from '@/components/effects/EpicBackground';
import { PremiumCard } from '@/components/effects/PremiumCard';
import { DevOpsPanel } from '@/components/devops/DevOpsPanel';
import { SystemHealthMonitor } from '@/components/devops/SystemHealthMonitor';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

function useCriticalLogs() {
  return useQuery({
    queryKey: ['singularity-critical-logs'],
    queryFn: async () => {
      const { data } = await supabase
        .from('msr_events')
        .select('id, action, domain, severity, created_at, payload')
        .in('severity', ['warning', 'critical', 'error'])
        .order('created_at', { ascending: false })
        .limit(15);
      return data ?? [];
    },
    staleTime: 10_000,
    refetchInterval: 15_000,
  });
}

const SEVERITY_STYLE: Record<string, string> = {
  critical: 'border-red-500/40 bg-red-500/10 text-red-400',
  error: 'border-red-500/30 bg-red-500/5 text-red-300',
  warning: 'border-amber-500/30 bg-amber-500/5 text-amber-300',
};

const Singularity = () => {
  const { data: logs, isLoading: logsLoading } = useCriticalLogs();

  return (
    <div className="relative min-h-screen">
      <EpicBackground />

      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <Badge className="mb-3 px-3 py-1 text-xs bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30">
              <Cpu className="w-3 h-3 mr-1.5" />
              OMNI-KERNEL · Centro de Operaciones
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              <span className="text-gradient-quantum">Singularity</span> Operations
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Monitorea la salud del sistema, eventos críticos MSR y ejecuta acciones seguras.
            </p>
          </motion.div>

          {/* System Health */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <PremiumCard className="p-5">
              <SystemHealthMonitor />
            </PremiumCard>
          </motion.div>

          {/* Critical Logs — Real-time */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="p-5 border-border/50 bg-card/60 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Eventos Críticos MSR
                </h3>
                <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1 animate-pulse inline-block" />
                  Auto-refresh 15s
                </Badge>
              </div>

              {logsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 rounded" />)}
                </div>
              ) : (logs?.length ?? 0) === 0 ? (
                <div className="text-center py-8">
                  <Shield className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Sin eventos críticos. Sistema operando normalmente.</p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                  {logs!.map((log: any) => (
                    <div key={log.id} className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${SEVERITY_STYLE[log.severity] || 'border-border/30'}`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <Badge variant="outline" className="text-[9px] shrink-0">{log.severity}</Badge>
                        <span className="font-mono font-medium truncate">{log.action}</span>
                        <span className="text-muted-foreground shrink-0">· {log.domain}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                        {new Date(log.created_at).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* DevOps Panel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <PremiumCard className="p-5">
              <DevOpsPanel />
            </PremiumCard>
          </motion.div>

          <p className="text-center text-[10px] text-muted-foreground">
            © 2026 TAMV MD-X4™ · Visión de Edwin Oswaldo Castillo Trejo · Dedicado a Reina Trejo Serrano ✦
          </p>
        </div>
      </div>
    </div>
  );
};

export default Singularity;
