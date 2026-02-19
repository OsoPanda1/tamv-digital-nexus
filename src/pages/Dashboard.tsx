// ============================================================================
// TAMV MD-X4â"¢ - Dashboard Page
// Central control panel with unified design
// ============================================================================

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, TrendingUp, Users, Zap, Brain, Shield,
  Headphones, BookOpen, Vote, DollarSign, ArrowRight,
  Activity, Globe, Layers
} from "lucide-react";
import { useBackgroundControl } from "@/components/UnifiedBackground";
import { federationManager } from "@/systems/FederationSystem";

// ============================================================================
// Dashboard Stats
// ============================================================================

const stats = [
  { label: "Usuarios Activos", value: "12.5K", icon: Users, color: "text-cyan-400", trend: "+12%" },
  { label: "Dream Spaces", value: "234", icon: Sparkles, color: "text-rose-400", trend: "+8%" },
  { label: "Engagement", value: "+45%", icon: TrendingUp, color: "text-emerald-400", trend: "+23%" },
  { label: "Energy Level", value: "98%", icon: Zap, color: "text-amber-400", trend: "stable" },
];

const quickActions = [
  { label: "Crear Dream Space", icon: Sparkles, path: "/dream-spaces", color: "from-rose-500 to-rose-700" },
  { label: "Chat Isabella AI", icon: Brain, path: "/isabella", color: "from-cyan-500 to-blue-600" },
  { label: "Ver Comunidad", icon: Users, path: "/community", color: "from-pink-500 to-pink-700" },
  { label: "DocumentaciÃ³n", icon: BookOpen, path: "/docs", color: "from-emerald-500 to-green-600" },
];

const recentActivity = [
  { title: "Nuevo Dream Space creado", time: "Hace 5 min", user: "Usuario #1234", type: "creation" },
  { title: "Evento comunitario iniciado", time: "Hace 15 min", user: "Moderador", type: "event" },
  { title: "Isabella AI actualizada", time: "Hace 1 hora", user: "Sistema", type: "system" },
  { title: "Nuevo contenido publicado", time: "Hace 2 horas", user: "Creador Pro", type: "content" },
  { title: "Propuesta DAO aprobada", time: "Hace 3 horas", user: "CITEMESH", type: "governance" },
];

// ============================================================================
// Dashboard Component
// ============================================================================

const Dashboard = () => {
  const { setBackground } = useBackgroundControl();
  const fedStats = federationManager.getStatistics();

  useEffect(() => {
    setBackground('quantum', 0.25);
  }, [setBackground]);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span 
                style={{
                  background: 'linear-gradient(90deg, #00D9FF, #3E7EA3, #C1CBD5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Centro de Control TAMV
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Bienvenido al ecosistema digital civilizatorio
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className="p-4 md:p-6 border-aqua/20 hover:border-aqua/40 transition-all duration-300"
                  style={{
                    background: 'rgba(11, 12, 17, 0.6)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                    <Badge variant="outline" className="text-xs border-aqua/30 text-aqua">
                      {stat.trend}
                    </Badge>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activity Feed */}
            <Card 
              className="lg:col-span-2 p-6 border-aqua/20"
              style={{
                background: 'rgba(11, 12, 17, 0.6)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-aqua" />
                  Actividad Reciente
                </h2>
                <Badge variant="outline" className="border-aqua/30 text-aqua">En vivo</Badge>
              </div>
              
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-aqua/10 hover:border-aqua/30 transition-colors"
                    style={{ background: 'rgba(0, 217, 255, 0.03)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: activity.type === 'creation' ? '#F472B6' :
                                     activity.type === 'event' ? '#22C55E' :
                                     activity.type === 'system' ? '#00D9FF' :
                                     activity.type === 'content' ? '#FBBF24' : '#8B5CF6'
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.user}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card 
              className="p-6 border-aqua/20"
              style={{
                background: 'rgba(11, 12, 17, 0.6)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <h2 className="text-xl font-bold mb-6">Acciones RÃ¡pidas</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link key={index} to={action.path}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 h-auto py-3 hover:bg-aqua/10 transition-all duration-300"
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">{action.label}</span>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Federation Status */}
          <Card 
            className="mt-6 p-6 border-aqua/20"
            style={{
              background: 'rgba(11, 12, 17, 0.6)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Layers className="w-5 h-5 text-aqua" />
                Estado de Federaciones
              </h2>
              <Link to="/ecosystem">
                <Button variant="outline" size="sm" className="border-aqua/30 text-aqua hover:bg-aqua/10">
                  Ver Todas
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg border border-aqua/10">
                <p className="text-3xl font-bold text-aqua">{fedStats.total}</p>
                <p className="text-sm text-muted-foreground">Total Federaciones</p>
              </div>
              <div className="text-center p-4 rounded-lg border border-emerald-500/20">
                <p className="text-3xl font-bold text-emerald-400">{fedStats.active}</p>
                <p className="text-sm text-muted-foreground">Activas</p>
              </div>
              <div className="text-center p-4 rounded-lg border border-amber-500/20">
                <p className="text-3xl font-bold text-amber-400">{fedStats.development}</p>
                <p className="text-sm text-muted-foreground">En Desarrollo</p>
              </div>
              <div className="text-center p-4 rounded-lg border border-violet-500/20">
                <p className="text-3xl font-bold text-violet-400">{fedStats.quantumEnabled}</p>
                <p className="text-sm text-muted-foreground">Quantum Ready</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progreso del Ecosistema</span>
                <span className="text-aqua">{Math.round((fedStats.active / fedStats.total) * 100)}%</span>
              </div>
              <Progress 
                value={(fedStats.active / fedStats.total) * 100} 
                className="h-2"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
