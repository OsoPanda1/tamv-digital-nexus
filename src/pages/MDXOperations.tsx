// ============================================================================
// TAMV MD-X4™ Operations Dashboard
// Real-time system status and subsystem monitoring
// ============================================================================

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";
import ParticleField from "@/components/ParticleField";
import {
  Shield,
  Brain,
  Radio,
  Wallet,
  Users,
  Building2,
  Zap,
  Activity,
  Server,
  Eye,
  Heart,
  Cpu,
  Lock,
  Globe,
  Gauge,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// System status interface
interface SystemStatus {
  name: string;
  icon: React.ElementType;
  status: "online" | "offline" | "warning" | "maintenance";
  uptime: number;
  load: number;
  lastUpdate: string;
  description: string;
}

// Subsystem data
interface SubsystemData {
  id: string;
  name: string;
  type: "guardian" | "ia" | "social" | "economy" | "security";
  status: "active" | "inactive" | "error";
  metrics: {
    label: string;
    value: number;
    max: number;
  }[];
}

const MDXOperations = () => {
  const [systems, setSystems] = useState<SystemStatus[]>([]);
  const [subsystems, setSubsystems] = useState<SubsystemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Mock systems data - in production, fetch from edge functions
  const mockSystems: SystemStatus[] = [
    {
      name: "Isabella AI Core",
      icon: Brain,
      status: "online",
      uptime: 99.97,
      load: 34,
      lastUpdate: new Date().toISOString(),
      description: "Motor de IA emocional y constitucional",
    },
    {
      name: "Anubis Sentinel",
      icon: Shield,
      status: "online",
      uptime: 99.99,
      load: 12,
      lastUpdate: new Date().toISOString(),
      description: "Sistema de seguridad y vigilancia",
    },
    {
      name: "NubiWallet",
      icon: Wallet,
      status: "online",
      uptime: 99.94,
      load: 45,
      lastUpdate: new Date().toISOString(),
      description: "Gestión de activos TCEP/TAU",
    },
    {
      name: "Social Core",
      icon: Users,
      status: "online",
      uptime: 99.89,
      load: 67,
      lastUpdate: new Date().toISOString(),
      description: "Feed, stories y canales",
    },
    {
      name: "Horus Tower",
      icon: Eye,
      status: "warning",
      uptime: 98.5,
      load: 78,
      lastUpdate: new Date().toISOString(),
      description: "Monitoreo de eventos en tiempo real",
    },
    {
      name: "Osiris Recovery",
      icon: RefreshCw,
      status: "online",
      uptime: 100,
      load: 5,
      lastUpdate: new Date().toISOString(),
      description: "Sistema de recuperación de cuentas",
    },
    {
      name: "Dekateotl Governance",
      icon: Building2,
      status: "online",
      uptime: 99.8,
      load: 23,
      lastUpdate: new Date().toISOString(),
      description: "Gobernanza DAO y propuestas",
    },
    {
      name: "MSR Blockchain",
      icon: Zap,
      status: "online",
      uptime: 99.95,
      load: 41,
      lastUpdate: new Date().toISOString(),
      description: "Motor de recompensas y staking",
    },
  ];

  const mockSubsystems: SubsystemData[] = [
    {
      id: "horus",
      name: "Horus Events",
      type: "guardian",
      status: "active",
      metrics: [
        { label: "Events/min", value: 1250, max: 2000 },
        { label: "Alerts", value: 3, max: 10 },
      ],
    },
    {
      id: "osiris",
      name: "Osiris Recovery",
      type: "guardian",
      status: "active",
      metrics: [
        { label: "Pending", value: 2, max: 50 },
        { label: "Success Rate", value: 98, max: 100 },
      ],
    },
    {
      id: "isabella",
      name: "Isabella Prime",
      type: "ia",
      status: "active",
      metrics: [
        { label: "Tokens/min", value: 4500, max: 10000 },
        { label: "Latency", value: 180, max: 500 },
      ],
    },
    {
      id: "anubis",
      name: "Anubis Sentinel",
      type: "security",
      status: "active",
      metrics: [
        { label: "Blocked", value: 47, max: 100 },
        { label: "Scans/min", value: 890, max: 2000 },
      ],
    },
    {
      id: "social",
      name: "Social Feed",
      type: "social",
      status: "active",
      metrics: [
        { label: "Posts/min", value: 15, max: 100 },
        { label: "Active", value: 234, max: 1000 },
      ],
    },
    {
      id: "wallet",
      name: "NubiWallet",
      type: "economy",
      status: "active",
      metrics: [
        { label: "TPS", value: 89, max: 200 },
        { label: "Pending", value: 5, max: 50 },
      ],
    },
  ];

  const fetchSystemData = async () => {
    setLoading(true);
    try {
      // In production, fetch from Supabase edge functions
      // For now, use mock data
      setSystems(mockSystems);
      setSubsystems(mockSubsystems);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error fetching system data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchSystemData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: SystemStatus["status"]) => {
    switch (status) {
      case "online":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "offline":
        return "text-red-500";
      case "maintenance":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBadge = (status: SystemStatus["status"]) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-500">Online</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500">Warning</Badge>;
      case "offline":
        return <Badge className="bg-red-500">Offline</Badge>;
      case "maintenance":
        return <Badge className="bg-blue-500">Maintenance</Badge>;
    }
  };

  const getSubsystemStatusIcon = (status: SubsystemData["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "inactive":
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ParticleField />
      <Navigation />

      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold glow-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                MD-X4 Operations Center
              </h1>
              <p className="text-muted-foreground mt-2">
                Monitoreo en tiempo real del ecosistema TAMV
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Última actualización: {lastRefresh.toLocaleTimeString()}
              </p>
              <Button onClick={fetchSystemData} disabled={loading}>
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* System Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {systems.map((system) => {
            const Icon = system.icon;
            return (
              <Card
                key={system.name}
                className="glass-panel p-4 hover:shadow-quantum transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-white/5 ${getStatusColor(system.status)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {getStatusBadge(system.status)}
                </div>
                <h3 className="font-bold text-sm mb-1">{system.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{system.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Uptime</span>
                    <span className="text-green-400">{system.uptime}%</span>
                  </div>
                  <Progress value={system.load} className="h-1" />
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Load</span>
                    <span>{system.load}%</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Subsystems Detail */}
        <h2 className="text-2xl font-bold mb-4">Subsistemas Activos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subsystems.map((subsystem) => (
            <Card key={subsystem.id} className="glass-panel p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getSubsystemStatusIcon(subsystem.status)}
                  <h3 className="font-bold">{subsystem.name}</h3>
                </div>
                <Badge variant="outline" className="text-xs">
                  {subsystem.type}
                </Badge>
              </div>
              <div className="space-y-3">
                {subsystem.metrics.map((metric, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{metric.label}</span>
                      <span>
                        {metric.value} / {metric.max}
                      </span>
                    </div>
                    <Progress value={(metric.value / metric.max) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card className="glass-panel p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500/20">
                <Activity className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {systems.filter((s) => s.status === "online").length}/{systems.length}
                </p>
                <p className="text-sm text-muted-foreground">Sistemas Online</p>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-cyan-500/20">
                <Gauge className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(systems.reduce((acc, s) => acc + s.load, 0) / systems.length)}%
                </p>
                <p className="text-sm text-muted-foreground">Carga Promedio</p>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {systems.reduce((acc, s) => acc + s.uptime, 0) / systems.length}%
                </p>
                <p className="text-sm text-muted-foreground">Uptime Promedio</p>
              </div>
            </div>
          </Card>

          <Card className="glass-panel p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-yellow-500/20">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {systems.filter((s) => s.status === "warning").length}
                </p>
                <p className="text-sm text-muted-foreground">Alertas</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MDXOperations;
