// ============================================================================
// TAMV MD-X4™ - Dashboard — LIVE DATA + Quick Actions (no extra backgrounds)
// ============================================================================

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sparkles, TrendingUp, Users, Zap, Brain, Shield,
  BookOpen, ArrowRight, Activity, Layers, Crown,
  MessageCircle, FileText, AlertTriangle, Wallet, Filter
} from "lucide-react";
import { useEcosystemMetrics, useRecentActivity, useFederationHealth } from "@/hooks/useEcosystemMetrics";

const quickActions = [
  { label: "Crear Dream Space", icon: Sparkles, path: "/dream-spaces", color: "from-rose-500 to-rose-700" },
  { label: "Chat Isabella AI", icon: Brain, path: "/isabella", color: "from-cyan-500 to-blue-600" },
  { label: "Ver Comunidad", icon: Users, path: "/community", color: "from-pink-500 to-pink-700" },
  { label: "Documentación", icon: BookOpen, path: "/docs", color: "from-emerald-500 to-green-600" },
  { label: "Gobernanza DAO", icon: Crown, path: "/governance", color: "from-purple-500 to-violet-600" },
  { label: "Singularity Ops", icon: Zap, path: "/singularity", color: "from-amber-500 to-orange-600" },
];

const EVENT_TYPES = [
  { value: "all", label: "Todos" },
  { value: "post", label: "Posts" },
  { value: "msr", label: "MSR" },
  { value: "isabella", label: "Isabella" },
  { value: "crisis", label: "Crisis" },
];

const Dashboard = () => {
  const { data: metrics, isLoading: metricsLoading } = useEcosystemMetrics();
  const { data: activity, isLoading: activityLoading } = useRecentActivity(20);
  const { data: federations, isLoading: fedLoading } = useFederationHealth();
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredActivity = useMemo(() => {
    if (!activity) return [];
    if (typeFilter === "all") return activity.slice(0, 10);
    return activity.filter(a => a.type === typeFilter).slice(0, 10);
  }, [activity, typeFilter]);

  const statCards = [
    { label: "Usuarios", value: metrics?.users ?? 0, icon: Users, color: "text-cyan-400" },
    { label: "Posts", value: metrics?.posts ?? 0, icon: FileText, color: "text-rose-400" },
    { label: "Isabella Msgs", value: metrics?.isabellaInteractions ?? 0, icon: Brain, color: "text-purple-400" },
    { label: "Transacciones", value: metrics?.transactions ?? 0, icon: Wallet, color: "text-amber-400" },
    { label: "Cursos", value: metrics?.courses ?? 0, icon: BookOpen, color: "text-emerald-400" },
    { label: "Propuestas DAO", value: metrics?.daoProposals ?? 0, icon: Crown, color: "text-violet-400" },
    { label: "MSR Events", value: metrics?.msrEvents ?? 0, icon: Shield, color: "text-teal-400" },
    { label: "Crisis Logs", value: metrics?.crisisLogs ?? 0, icon: AlertTriangle, color: "text-red-400" },
  ];

  const activeFeds = federations?.filter(f => f.health >= 80).length ?? 0;
  const totalFeds = federations?.length ?? 7;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="text-gradient-quantum">Centro de Control</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Métricas en vivo · Datos reales de Lovable Cloud
            </p>
          </div>

          {/* Live Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="p-4 border-border/50 hover:border-primary/40 transition-all bg-card/60 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                    <Badge variant="outline" className="text-[9px] border-primary/30 text-primary">LIVE</Badge>
                  </div>
                  {metricsLoading ? (
                    <Skeleton className="h-7 w-16 mb-1" />
                  ) : (
                    <p className="text-2xl font-bold mb-0.5">{stat.value.toLocaleString()}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </Card>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activity Feed */}
            <Card className="lg:col-span-2 p-6 border-border/50 bg-card/60 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Actividad Reciente
                </h2>
                <div className="flex items-center gap-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                      <Filter className="w-3 h-3 mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse inline-block" />
                    LIVE
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                {activityLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg" />
                  ))
                ) : filteredActivity.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {typeFilter !== 'all' ? `Sin actividad de tipo "${typeFilter}".` : 'No hay actividad reciente.'}
                  </p>
                ) : (
                  filteredActivity.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg border border-border/30 hover:border-primary/30 transition-colors bg-background/30">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            background: item.type === 'post' ? '#F472B6' :
                                       item.type === 'msr' ? '#22C55E' :
                                       item.type === 'isabella' ? '#00D9FF' : '#8B5CF6'
                          }} />
                        <div>
                          <p className="text-sm font-medium">{item.title}</p>
                          {item.severity && <Badge variant="outline" className="text-[9px] mt-0.5">{item.severity}</Badge>}
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-3">
                        {new Date(item.time).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 border-border/50 bg-card/60 backdrop-blur-sm">
              <h2 className="text-lg font-bold mb-4">Acciones Rápidas</h2>
              <div className="space-y-2">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link key={index} to={action.path}>
                      <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-2.5 hover:bg-primary/10 transition-all">
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                          <Icon className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm font-medium">{action.label}</span>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Federation Status */}
          <Card className="mt-6 p-6 border-border/50 bg-card/60 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                7 Federaciones · Estado en Vivo
              </h2>
              <Link to="/evolution">
                <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10 text-xs">
                  Ver Arquitectura <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>

            {fedLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-4">
                  {(federations ?? []).map((fed) => (
                    <div key={fed.id} className="text-center p-2.5 rounded-lg border border-border/30 hover:border-primary/30 transition-colors">
                      <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-1.5 ${fed.health >= 80 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <p className="text-[11px] font-bold truncate">{fed.codename}</p>
                      <p className="text-[9px] text-muted-foreground">{fed.records} reg.</p>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Ecosistema Operativo</span>
                    <span className="text-primary">{activeFeds}/{totalFeds} activas</span>
                  </div>
                  <Progress value={(activeFeds / totalFeds) * 100} className="h-1.5" />
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
