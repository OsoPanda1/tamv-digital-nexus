// ============================================================================
// OSIRIS RECOVERY PANEL v10
// Panel de Control de Recuperación ante Desastres
// TAMV MD-X4™ | Subsistema Mítico de Control
// ============================================================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  RefreshCw,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Play,
  Pause,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  FileText,
  Server,
  Zap,
  AlertOctagon,
} from "lucide-react";
import {
  useOsirisRecovery,
  RecoveryPlan,
  DisasterType,
  type RecoveryState,
  type Snapshot,
  type RecoveryLog,
} from "@/systems/OsirisRecoverySystem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Plan Card Component ─────────────────────────────────────────────────────

interface PlanCardProps {
  plan: RecoveryPlan;
  isActive: boolean;
  onExecute: (plan: RecoveryPlan) => void;
  disabled: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isActive, onExecute, disabled }) => {
  const { getPlanDefinition } = useOsirisRecovery();
  const definition = getPlanDefinition(plan);

  const planColors: Record<RecoveryPlan, { bg: string; border: string; text: string; glow: string }> = {
    A: { bg: "bg-emerald-950/30", border: "border-emerald-500/50", text: "text-emerald-400", glow: "shadow-emerald-500/20" },
    B: { bg: "bg-blue-950/30", border: "border-blue-500/50", text: "text-blue-400", glow: "shadow-blue-500/20" },
    C: { bg: "bg-amber-950/30", border: "border-amber-500/50", text: "text-amber-400", glow: "shadow-amber-500/20" },
    D: { bg: "bg-red-950/30", border: "border-red-500/50", text: "text-red-400", glow: "shadow-red-500/20" },
  };

  const colors = planColors[plan];

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`relative p-4 rounded-lg border ${colors.bg} ${colors.border} ${
        isActive ? `shadow-lg ${colors.glow}` : ""
      } transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
          <Shield className={`w-5 h-5 ${colors.text}`} />
        </div>
        {isActive && (
          <Badge className={`${colors.bg} ${colors.text} ${colors.border}`}>
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            Active
          </Badge>
        )}
      </div>

      <h3 className={`font-semibold ${colors.text} mb-1`}>Plan {plan}</h3>
      <p className="text-xs text-slate-400 mb-3 line-clamp-2">{definition?.description}</p>

      <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>RTO: {definition?.rto}s</span>
        </div>
        <div className="flex items-center gap-1">
          <Database className="w-3 h-3" />
          <span>RPO: {definition?.rpo}s</span>
        </div>
      </div>

      <Button
        onClick={() => onExecute(plan)}
        disabled={disabled || isActive}
        className={`w-full ${colors.bg} ${colors.text} ${colors.border} hover:${colors.bg}`}
        variant="outline"
      >
        {isActive ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Executing...
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Execute Plan {plan}
          </>
        )}
      </Button>
    </motion.div>
  );
};

// ─── Snapshot Item Component ─────────────────────────────────────────────────

interface SnapshotItemProps {
  snapshot: Snapshot;
  onDelete: (id: string) => void;
}

const SnapshotItem: React.FC<SnapshotItemProps> = ({ snapshot, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const typeColors: Record<Snapshot["type"], string> = {
    full: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    incremental: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    differential: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  };

  const age = Math.floor((Date.now() - snapshot.timestamp) / 60000);
  const ageText = age < 60 ? `${age}m ago` : `${Math.floor(age / 60)}h ago`;

  return (
    <motion.div
      layout
      className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="w-4 h-4 text-slate-400" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-200">{snapshot.id}</span>
              <Badge variant="outline" className={`text-xs ${typeColors[snapshot.type]}`}>
                {snapshot.type}
              </Badge>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
              <span>{snapshot.sizeGB.toFixed(1)} GB</span>
              <span>·</span>
              <span>{snapshot.region}</span>
              <span>·</span>
              <span>{ageText}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950/30"
            onClick={() => onDelete(snapshot.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-2"
          >
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500">RTO:</span>
                <span className="text-slate-300 ml-2">{snapshot.rto}s</span>
              </div>
              <div>
                <span className="text-slate-500">RPO:</span>
                <span className="text-slate-300 ml-2">{snapshot.rpo}s</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">Components:</span>
                <span className="text-slate-300 ml-2">{snapshot.components.join(", ")}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">Checksum:</span>
                <span className="text-slate-300 ml-2 font-mono">{snapshot.checksum}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Log Item Component ──────────────────────────────────────────────────────

const LogItem: React.FC<{ log: RecoveryLog }> = ({ log }) => {
  const levelColors: Record<RecoveryLog["level"], { icon: React.ReactNode; color: string }> = {
    info: { icon: <FileText className="w-3 h-3" />, color: "text-blue-400" },
    warning: { icon: <AlertTriangle className="w-3 h-3" />, color: "text-amber-400" },
    error: { icon: <XCircle className="w-3 h-3" />, color: "text-red-400" },
    success: { icon: <CheckCircle className="w-3 h-3" />, color: "text-emerald-400" },
  };

  const { icon, color } = levelColors[log.level];
  const time = new Date(log.timestamp).toLocaleTimeString();

  return (
    <div className="flex items-start gap-2 py-1.5 text-xs">
      <span className="text-slate-600 font-mono">{time}</span>
      <span className={color}>{icon}</span>
      <span className="text-slate-300">{log.message}</span>
      {log.plan && (
        <Badge variant="outline" className="text-[10px] h-4 border-slate-700">
          Plan {log.plan}
        </Badge>
      )}
      {log.duration && (
        <span className="text-slate-500">({log.duration.toFixed(1)}s)</span>
      )}
    </div>
  );
};

// ─── Main Panel Component ────────────────────────────────────────────────────

export const OsirisRecoveryPanel: React.FC = () => {
  const {
    state,
    executeRecovery,
    createSnapshot,
    deleteSnapshot,
    simulateDisaster,
    clearEvent,
  } = useOsirisRecovery();

  const [selectedPlan, setSelectedPlan] = useState<RecoveryPlan | null>(null);
  const [showDisasterDialog, setShowDisasterDialog] = useState(false);

  const isExecuting = state.status !== "idle" && state.status !== "failed" && state.status !== "complete";

  const getStatusColor = (status: RecoveryState["status"]) => {
    switch (status) {
      case "idle": return "text-slate-400";
      case "scanning": return "text-blue-400";
      case "restoring": return "text-amber-400";
      case "validating": return "text-purple-400";
      case "complete": return "text-emerald-400";
      case "failed": return "text-red-400";
      default: return "text-slate-400";
    }
  };

  const getStatusIcon = (status: RecoveryState["status"]) => {
    switch (status) {
      case "idle": return <Shield className="w-4 h-4" />;
      case "scanning": return <Activity className="w-4 h-4 animate-pulse" />;
      case "restoring": return <RefreshCw className="w-4 h-4 animate-spin" />;
      case "validating": return <CheckCircle className="w-4 h-4" />;
      case "complete": return <CheckCircle className="w-4 h-4" />;
      case "failed": return <XCircle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const handleExecutePlan = async (plan: RecoveryPlan) => {
    setSelectedPlan(plan);
    await executeRecovery(plan);
    setSelectedPlan(null);
  };

  const handleSimulateDisaster = (type: DisasterType, severity: 1 | 2 | 3 | 4 | 5) => {
    simulateDisaster(type, severity);
    setShowDisasterDialog(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center border border-emerald-500/30">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Osiris Recovery</h2>
            <p className="text-xs text-slate-400">Sistema de Recuperación ante Desastres v10</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {state.activeEvent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/50 border border-red-500/30"
            >
              <AlertOctagon className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400">{state.activeEvent.type.replace("_", " ")}</span>
              <Badge className="bg-red-500/20 text-red-400">Sev {state.activeEvent.severity}</Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 ml-1"
                onClick={clearEvent}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          <Dialog open={showDisasterDialog} onOpenChange={setShowDisasterDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-950/30">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Simulate Disaster
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-950 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">Simulate Disaster Event</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Trigger a test disaster to validate recovery procedures
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {(["datacenter_failure", "database_corruption", "security_breach", "cascading_failure"] as DisasterType[]).map((type) => (
                  <div key={type} className="space-y-2">
                    <p className="text-xs text-slate-500 capitalize">{type.replace("_", " ")}</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((sev) => (
                        <Button
                          key={sev}
                          variant="outline"
                          size="sm"
                          className={`h-8 w-8 p-0 ${
                            sev >= 4 ? "border-red-500/50 text-red-400" : "border-slate-700"
                          }`}
                          onClick={() => handleSimulateDisaster(type, sev as 1 | 2 | 3 | 4 | 5)}
                        >
                          {sev}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Status Bar */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className={getStatusColor(state.status)}>{getStatusIcon(state.status)}</span>
                <span className={`text-sm font-medium capitalize ${getStatusColor(state.status)}`}>
                  {state.status}
                </span>
              </div>

              {state.currentPlan && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500">Current Plan:</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    Plan {state.currentPlan}
                  </Badge>
                </div>
              )}

              {state.currentStep > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500">Step:</span>
                  <span className="text-slate-300">
                    {state.currentStep} / {state.totalSteps}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="text-right">
                <p className="text-slate-500 text-xs">Availability</p>
                <p className="text-emerald-400 font-mono">{state.metrics.availability.toFixed(3)}%</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-xs">Total Recoveries</p>
                <p className="text-slate-300 font-mono">{state.metrics.totalRecoveries}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-xs">Avg Recovery Time</p>
                <p className="text-slate-300 font-mono">{state.metrics.avgRecoveryTime.toFixed(1)}s</p>
              </div>
            </div>
          </div>

          {isExecuting && (
            <div className="mt-4">
              <Progress value={state.progress} className="h-2" />
              <p className="text-xs text-slate-500 mt-1 text-right">{state.progress.toFixed(0)}%</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="bg-slate-900/50 border border-slate-800">
          <TabsTrigger value="plans" className="data-[state=active]:bg-slate-800">
            <Shield className="w-4 h-4 mr-2" />
            Recovery Plans
          </TabsTrigger>
          <TabsTrigger value="snapshots" className="data-[state=active]:bg-slate-800">
            <Database className="w-4 h-4 mr-2" />
            Snapshots ({state.snapshots.length})
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-slate-800">
            <FileText className="w-4 h-4 mr-2" />
            Logs
          </TabsTrigger>
        </TabsList>

        {/* Recovery Plans Tab */}
        <TabsContent value="plans" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {(["A", "B", "C", "D"] as RecoveryPlan[]).map((plan) => (
              <PlanCard
                key={plan}
                plan={plan}
                isActive={state.currentPlan === plan && isExecuting}
                onExecute={handleExecutePlan}
                disabled={isExecuting}
              />
            ))}
          </div>

          <Card className="mt-4 bg-slate-900/30 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-300">Plan Descriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <p className="text-emerald-400 font-medium">Plan A - Failover Automático</p>
                  <p className="text-slate-500">Conmutación automática a región secundaria. RTO: 60s, RPO: 5s</p>
                </div>
                <div className="space-y-1">
                  <p className="text-blue-400 font-medium">Plan B - Restauración Snapshot</p>
                  <p className="text-slate-500">Restauración desde snapshot más reciente. RTO: 5min, RPO: 5min</p>
                </div>
                <div className="space-y-1">
                  <p className="text-amber-400 font-medium">Plan C - Reconstrucción Gradual</p>
                  <p className="text-slate-500">Reconstrucción por prioridad de servicios. RTO: 30min, RPO: 10min</p>
                </div>
                <div className="space-y-1">
                  <p className="text-red-400 font-medium">Plan D - Modo Degradado</p>
                  <p className="text-slate-500">Operación con funcionalidad limitada. RTO: 0s, RPO: 0s</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Snapshots Tab */}
        <TabsContent value="snapshots" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">Available Snapshots</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700"
                onClick={() => createSnapshot("full", ["database", "filesystem", "config"])}
              >
                <Plus className="w-4 h-4 mr-2" />
                Full Snapshot
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700"
                onClick={() => createSnapshot("incremental", ["database"])}
              >
                <Plus className="w-4 h-4 mr-2" />
                Incremental
              </Button>
            </div>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {state.snapshots.map((snapshot) => (
              <SnapshotItem
                key={snapshot.id}
                snapshot={snapshot}
                onDelete={deleteSnapshot}
              />
            ))}
          </div>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="mt-4">
          <Card className="bg-slate-950 border-slate-800">
            <CardContent className="p-4">
              <div className="max-h-64 overflow-y-auto space-y-1 font-mono">
                {state.logs.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-8">No logs available</p>
                ) : (
                  state.logs.map((log, idx) => <LogItem key={idx} log={log} />)
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OsirisRecoveryPanel;
