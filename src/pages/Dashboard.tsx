import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { StoriesCarousel } from "@/components/social/StoriesCarousel";
import { SocialFeedPost, MOCK_POSTS } from "@/components/social/SocialFeedPost";
import {
  TrendingUp, Users, Sparkles, Zap, Activity, Eye,
  ArrowRight, Radio, MessageCircle, Bell, BarChart3
} from "lucide-react";

const STATS = [
  { label: "Usuarios Activos", value: "12.5K", change: "+18%", icon: Users, color: "text-primary" },
  { label: "Posts Hoy", value: "3.2K", change: "+45%", icon: Activity, color: "text-emerald-400" },
  { label: "Lives Ahora", value: "23", change: "", icon: Radio, color: "text-red-400" },
  { label: "Coherencia", value: "98%", change: "+5%", icon: Zap, color: "text-amber-400" },
];

const Dashboard = () => (
  <div className="min-h-screen bg-background">
    <div className="max-w-7xl mx-auto px-4 pt-6 pb-20">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Centro de Control</h1>
        <p className="text-sm text-muted-foreground">Bienvenido al ecosistema TAMV MD-X4™</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card/40 backdrop-blur border border-border/20 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                {stat.change && (
                  <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    <TrendingUp className="w-3 h-3 mr-0.5" />{stat.change}
                  </Badge>
                )}
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          {/* Stories */}
          <div className="bg-card/30 border border-border/20 rounded-2xl px-3 py-1">
            <StoriesCarousel />
          </div>

          {/* Activity Feed */}
          <div>
            <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Actividad Reciente
            </h2>
            <div className="space-y-3">
              {MOCK_POSTS.slice(0, 4).map((post, i) => (
                <SocialFeedPost key={post.id} post={post} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <Card className="bg-card/40 backdrop-blur border border-border/20 rounded-xl p-4">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Acciones Rápidas
            </h3>
            <div className="space-y-2">
              {[
                { label: "Crear Dream Space", path: "/dream-spaces", icon: Sparkles },
                { label: "Ver Comunidad", path: "/community", icon: Users },
                { label: "Chat Isabella AI", path: "/isabella", icon: MessageCircle },
                { label: "Gobernanza DAO", path: "/governance", icon: Eye },
                { label: "Universidad", path: "/university", icon: ArrowRight },
              ].map(({ label, path, icon: Icon }) => (
                <Link key={path} to={path}>
                  <Button variant="ghost" className="w-full justify-start gap-2 text-sm h-9">
                    <Icon className="w-4 h-4 text-primary" />{label}
                  </Button>
                </Link>
              ))}
            </div>
          </Card>

          <Card className="bg-card/40 backdrop-blur border border-border/20 rounded-xl p-4">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              Notificaciones
            </h3>
            <div className="space-y-2">
              {[
                "Isabella AI procesó 340 análisis emocionales",
                "Nuevo evento: Hackathon TAMV 2026",
                "Tu propuesta DAO recibió 45 votos",
                "Certificación Quantum completada"
              ].map((n, i) => (
                <div key={i} className="text-xs text-muted-foreground p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer">
                  {n}
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  </div>
);

export default Dashboard;
