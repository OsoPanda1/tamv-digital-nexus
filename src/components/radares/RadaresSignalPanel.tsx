// ============================================================================
// RADARES SIGNAL PANEL v10
// Panel de Visualización de Señales Tipo Radar
// TAMV MD-X4™ | Subsistema Mítico de Control
// ============================================================================

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radar,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
  Wind,
  Eye,
  Cpu,
  Radio,
  Signal,
  Zap,
  Filter,
  Target,
  Crosshair,
  AlertOctagon,
} from "lucide-react";
import {
  useRadaresSignal,
  type RadarType,
  type Signal,
  type SignalSeverity,
  type RadarConfig,
} from "@/systems/RadaresSignalSystem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ─── Radar Visualizer Component ──────────────────────────────────────────────

interface RadarVisualizerProps {
  type: RadarType;
  config: RadarConfig;
  signals: Signal[];
  sweepAngle: number;
  isActive: boolean;
  onToggle: () => void;
  onSensitivityChange: (value: number) => void;
}

const RadarVisualizer: React.FC<RadarVisualizerProps> = ({
  type,
  config,
  signals,
  sweepAngle,
  isActive,
  onToggle,
  onSensitivityChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = 280;
  const center = size / 2;
  const maxRadius = size * 0.4;

  const radarConfig = {
    quetzalcoatl: { color: "#00D9FF", icon: "🐍", name: "Quetzalcóatl", gradient: ["from-cyan-500/20", "to-cyan-900/20"] },
    ojo_de_ra: { color: "#9D4EDD", icon: "👁️", name: "Ojo de Ra", gradient: ["from-purple-500/20", "to-purple-900/20"] },
    mos: { color: "#00B4D8", icon: "🖥️", name: "MOS", gradient: ["from-blue-500/20", "to-blue-900/20"] },
  }[type];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    if (!isActive) {
      // Draw inactive state
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(center, center, maxRadius, 0, Math.PI * 2);
      ctx.stroke();
      return;
    }

    // Draw radar circles
    ctx.strokeStyle = `${radarConfig.color}30`;
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.75, 1].forEach((ratio) => {
      ctx.beginPath();
      ctx.arc(center, center, maxRadius * ratio, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Draw crosshairs
    ctx.strokeStyle = `${radarConfig.color}20`;
    ctx.beginPath();
    ctx.moveTo(center, center - maxRadius);
    ctx.lineTo(center, center + maxRadius);
    ctx.moveTo(center - maxRadius, center);
    ctx.lineTo(center + maxRadius, center);
    ctx.stroke();

    // Draw degree markers
    ctx.fillStyle = `${radarConfig.color}60`;
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    for (let i = 0; i < 360; i += 30) {
      const angle = (i - 90) * (Math.PI / 180);
      const x = center + Math.cos(angle) * (maxRadius + 15);
      const y = center + Math.sin(angle) * (maxRadius + 15);
      ctx.fillText(i.toString(), x, y + 3);
    }

    // Draw sweep line
    const sweepRad = (sweepAngle - 90) * (Math.PI / 180);
    const gradient = ctx.createLinearGradient(
      center,
      center,
      center + Math.cos(sweepRad) * maxRadius,
      center + Math.sin(sweepRad) * maxRadius
    );
    gradient.addColorStop(0, `${radarConfig.color}00`);
    gradient.addColorStop(1, radarConfig.color);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(
      center + Math.cos(sweepRad) * maxRadius,
      center + Math.sin(sweepRad) * maxRadius
    );
    ctx.stroke();

    // Draw sweep arc
    const arcGradient = ctx.createConicGradient(
      (sweepAngle - 90) * (Math.PI / 180),
      center,
      center
    );
    arcGradient.addColorStop(0, `${radarConfig.color}40`);
    arcGradient.addColorStop(0.1, `${radarConfig.color}00`);
    arcGradient.addColorStop(1, `${radarConfig.color}00`);

    ctx.fillStyle = arcGradient;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, maxRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw signals
    signals.forEach((signal) => {
      if (signal.type !== type) return;

      const angle = (signal.position.angle - 90) * (Math.PI / 180);
      const radius = (signal.position.distance / 100) * maxRadius;
      const x = center + Math.cos(angle) * radius;
      const y = center + Math.sin(angle) * radius;

      const severityColors: Record<SignalSeverity, string> = {
        info: "#3b82f6",
        low: "#22c55e",
        medium: "#eab308",
        high: "#f97316",
        critical: "#ef4444",
      };

      const color = severityColors[signal.severity];
      const pulse = signal.status === "processing" ? Math.sin(Date.now() / 100) * 0.5 + 0.5 : 1;

      // Signal dot
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 3 + pulse * 2, 0, Math.PI * 2);
      ctx.fill();

      // Signal glow
      ctx.fillStyle = `${color}40`;
      ctx.beginPath();
      ctx.arc(x, y, 8 + pulse * 4, 0, Math.PI * 2);
      ctx.fill();

      // Signal ring for high/critical
      if (signal.severity === "high" || signal.severity === "critical") {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, 12 + pulse * 3, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  }, [signals, sweepAngle, isActive, type, radarConfig.color]);

  return (
    <Card className={`overflow-hidden border-slate-800 bg-slate-950 ${!isActive ? "opacity-60" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{radarConfig.icon}</span>
            <div>
              <CardTitle className="text-sm text-slate-200">{radarConfig.name}</CardTitle>
              <p className="text-xs text-slate-500">{config.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={onToggle} />
            <Badge
              variant="outline"
              className={`text-xs ${isActive ? "border-emerald-500/50 text-emerald-400" : "border-slate-700 text-slate-500"}`}
            >
              {isActive ? "ACTIVE" : "OFFLINE"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-center">
          <div
            className="relative rounded-full overflow-hidden"
            style={{
              width: size,
              height: size,
              background: `radial-gradient(circle, ${radarConfig.color}10 0%, transparent 70%)`,
            }}
          >
            <canvas
              ref={canvasRef}
              width={size}
              height={size}
              className="rounded-full"
            />
            {/* Center crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-slate-400/50" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500">Sensitivity</span>
              <span className="text-slate-400">{(config.sensitivity * 100).toFixed(0)}%</span>
            </div>
            <Slider
              value={[config.sensitivity * 100]}
              onValueChange={([v]) => onSensitivityChange(v / 100)}
              max={100}
              step={5}
              disabled={!isActive}
              className="cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Freq: {config.frequency} MHz</span>
            <span>Speed: {config.sweepSpeed}°/s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Signal List Item Component ──────────────────────────────────────────────

const SignalItem: React.FC<{
  signal: Signal;
  onAcknowledge: () => void;
}> = ({ signal, onAcknowledge }) => {
  const severityConfig: Record<SignalSeverity, { color: string; icon: React.ReactNode }> = {
    info: { color: "text-blue-400", icon: <Info className="w-4 h-4" /> },
    low: { color: "text-emerald-400", icon: <CheckCircle className="w-4 h-4" /> },
    medium: { color: "text-amber-400", icon: <AlertTriangle className="w-4 h-4" /> },
    high: { color: "text-orange-400", icon: <AlertOctagon className="w-4 h-4" /> },
    critical: { color: "text-red-400", icon: <Zap className="w-4 h-4" /> },
  };

  const config = severityConfig[signal.severity];
  const age = Math.floor((Date.now() - signal.timestamp) / 1000);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-3 p-3 rounded-lg border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-colors"
    >
      <div className={`${config.color}`}>{config.icon}</div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-300 truncate">{signal.id}</span>
          <Badge variant="outline" className={`text-[10px] ${config.color} border-opacity-30`}>
            {signal.severity}
          </Badge>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span className="capitalize">{signal.source.replace("_", " ")}</span>
          <span>·</span>
          <span>{age}s ago</span>
          <span>·</span>
          <span className="capitalize">{signal.status}</span>
        </div>
      </div>

      <div className="text-xs text-slate-600 text-right">
        <div>θ{signal.position.angle.toFixed(0)}°</div>
        <div>r{signal.position.distance.toFixed(0)}%</div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-xs"
        onClick={onAcknowledge}
        disabled={signal.status === "archived"}
      >
        {signal.status === "archived" ? "Ack'd" : "Ack"}
      </Button>
    </motion.div>
  );
};

// ─── Stats Card Component ────────────────────────────────────────────────────

const StatsCard: React.FC<{ title: string; value: string | number; subtitle?: string; icon: React.ReactNode }> = ({
  title,
  value,
  subtitle,
  icon,
}) => (
  <Card className="bg-slate-900/50 border-slate-800">
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-200">{value}</p>
          {subtitle && <p className="text-xs text-slate-600">{subtitle}</p>}
        </div>
        <div className="text-slate-600">{icon}</div>
      </div>
    </CardContent>
  </Card>
);

// ─── Main Panel Component ────────────────────────────────────────────────────

export const RadaresSignalPanel: React.FC = () => {
  const { state, toggleRadar, updateSensitivity, acknowledgeSignal, injectTestSignal } = useRadaresSignal();
  const [selectedTab, setSelectedTab] = useState("visualization");

  const activeRadars = state.radars.filter((r) => r.enabled).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-500/30">
            <Radar className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Radares Signal System</h2>
            <p className="text-xs text-slate-400">Ingesta de Señales y Visualización v10</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-cyan-400">{activeRadars}/3</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">Radars Active</div>
          </div>
          
          <div className="flex gap-2">
            {(["info", "low", "medium", "high", "critical"] as SignalSeverity[]).map((sev) => (
              <TooltipProvider key={sev}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 border-slate-700"
                      onClick={() => injectTestSignal("quetzalcoatl", sev)}
                    >
                      <Signal className={`w-3 h-3 mr-1 ${
                        sev === "info" ? "text-blue-400" :
                        sev === "low" ? "text-emerald-400" :
                        sev === "medium" ? "text-amber-400" :
                        sev === "high" ? "text-orange-400" : "text-red-400"
                      }`} />
                      {sev[0].toUpperCase()}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Inject {sev} signal</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard
          title="Total Signals"
          value={state.stats.totalSignals.toLocaleString()}
          subtitle="All time"
          icon={<Activity className="w-5 h-5" />}
        />
        <StatsCard
          title="Active Signals"
          value={state.stats.activeSignals}
          subtitle="In system"
          icon={<Radio className="w-5 h-5" />}
        />
        <StatsCard
          title="Signals/sec"
          value={state.stats.signalsPerSecond.toFixed(1)}
          subtitle="Current rate"
          icon={<Zap className="w-5 h-5" />}
        />
        <StatsCard
          title="Anomalies"
          value={state.anomalies.length}
          subtitle="Detected"
          icon={<AlertTriangle className="w-5 h-5" />}
        />
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="bg-slate-900/50 border border-slate-800">
          <TabsTrigger value="visualization" className="data-[state=active]:bg-slate-800">
            <Target className="w-4 h-4 mr-2" />
            Visualization
          </TabsTrigger>
          <TabsTrigger value="signals" className="data-[state=active]:bg-slate-800">
            <Signal className="w-4 h-4 mr-2" />
            Signals ({state.signals.length})
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="data-[state=active]:bg-slate-800">
            <AlertOctagon className="w-4 h-4 mr-2" />
            Anomalies ({state.anomalies.length})
          </TabsTrigger>
        </TabsList>

        {/* Visualization Tab */}
        <TabsContent value="visualization" className="mt-4">
          <div className="grid grid-cols-3 gap-4">
            {state.radars.map((radar) => (
              <RadarVisualizer
                key={radar.type}
                type={radar.type}
                config={radar}
                signals={state.signals}
                sweepAngle={state.sweepAngle}
                isActive={radar.enabled}
                onToggle={() => toggleRadar(radar.type)}
                onSensitivityChange={(v) => updateSensitivity(radar.type, v)}
              />
            ))}
          </div>

          {/* Severity Distribution */}
          <Card className="mt-4 bg-slate-900/30 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-300">Signal Distribution by Severity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {Object.entries(state.stats.bySeverity).map(([severity, count]) => {
                  const colors: Record<string, string> = {
                    info: "bg-blue-500",
                    low: "bg-emerald-500",
                    medium: "bg-amber-500",
                    high: "bg-orange-500",
                    critical: "bg-red-500",
                  };
                  const total = state.stats.totalSignals || 1;
                  const percentage = (count / total) * 100;
                  
                  return (
                    <div key={severity} className="flex-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="capitalize text-slate-500">{severity}</span>
                        <span className="text-slate-400">{count}</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          className={`h-full ${colors[severity]}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Signals Tab */}
        <TabsContent value="signals" className="mt-4">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {state.signals.map((signal) => (
                <SignalItem
                  key={signal.id}
                  signal={signal}
                  onAcknowledge={() => acknowledgeSignal(signal.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        {/* Anomalies Tab */}
        <TabsContent value="anomalies" className="mt-4">
          <div className="space-y-2">
            {state.anomalies.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <CheckCircle className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>No anomalies detected</p>
                <p className="text-xs opacity-60">System operating normally</p>
              </div>
            ) : (
              state.anomalies.map((anomaly) => (
                <motion.div
                  key={anomaly.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-lg border border-red-500/30 bg-red-950/20"
                >
                  <div className="flex items-start gap-3">
                    <AlertOctagon className="w-5 h-5 text-red-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-red-400">{anomaly.pattern}</h4>
                      <p className="text-xs text-slate-400 mt-1">{anomaly.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="text-slate-500">Confidence: {(anomaly.confidence * 100).toFixed(0)}%</span>
                        <span className="text-slate-500">Source: {anomaly.signalId}</span>
                      </div>
                      {anomaly.recommendation && (
                        <p className="text-xs text-amber-400 mt-2">
                          Recommendation: {anomaly.recommendation}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RadaresSignalPanel;
