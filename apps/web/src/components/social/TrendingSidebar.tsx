import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Hash,
  Flame,
  Zap,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const TRENDING_TOPICS = [
  { tag: "TAMVQuantum", posts: "12.4K", category: "Tecnología" },
  { tag: "IsabellaAI", posts: "8.9K", category: "IA" },
  { tag: "DreamSpaces", posts: "6.2K", category: "Metaverso" },
  { tag: "CITEMESH", posts: "4.1K", category: "Gobernanza" },
  { tag: "MineralDelMonte", posts: "3.8K", category: "Cultura" },
];

const SUGGESTED_USERS = [
  {
    name: "Isabella AI",
    handle: "@isabella",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    verified: true,
    badge: "IA",
  },
  {
    name: "TAMV Music",
    handle: "@tamvmusic",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    verified: true,
    badge: "Oficial",
  },
  {
    name: "Ana Torres",
    handle: "@anatorres",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    verified: false,
  },
  {
    name: "UTAMV",
    handle: "@utamv",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    verified: true,
    badge: "Universidad",
  },
];

const LIVE_EVENTS = [
  { title: "Concierto Quantum Night", viewers: "2.3K", type: "music" },
  { title: "Clase UTAMV: Blockchain", viewers: "891", type: "education" },
  { title: "DreamSpace Tour #42", viewers: "456", type: "metaverse" },
];

const cardBase =
  "bg-card/60 backdrop-blur-2xl border border-border/25 rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.35)]";

export const TrendingSidebar = () => (
  <aside className="space-y-5 sticky top-24 max-w-xs hidden xl:block">
    {/* Trending */}
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.25, duration: 0.5 }}
      className={cardBase}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/20">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-sm">Tendencias</h3>
        </div>
        <div className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground">
          <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
          <span>Tiempo real</span>
        </div>
      </div>
      <div className="divide-y divide-border/10">
        {TRENDING_TOPICS.map((topic, i) => (
          <button
            key={topic.tag}
            className="
              w-full px-4 py-2.5 text-left
              hover:bg-muted/25
              transition-colors group
            "
          >
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[11px] text-muted-foreground">
                {topic.category}
              </span>
              <span className="text-[10px] text-muted-foreground/80">
                #{i + 1}
              </span>
            </div>
            <p
              className="
                font-semibold text-sm flex items-center gap-1.5
                text-foreground
              "
            >
              <Hash className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
              <span className="truncate">#{topic.tag}</span>
            </p>
            <span className="text-[11px] text-muted-foreground">
              {topic.posts} publicaciones
            </span>
          </button>
        ))}
      </div>
    </motion.div>

    {/* En vivo ahora */}
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.45, duration: 0.5 }}
      className={cardBase}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/20">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-red-400 animate-pulse" />
          <h3 className="font-semibold text-sm">En vivo ahora</h3>
        </div>
        <Badge className="ml-auto bg-destructive/85 text-destructive-foreground text-[10px] border border-red-500/60">
          LIVE
        </Badge>
      </div>
      <div className="divide-y divide-border/10">
        {LIVE_EVENTS.map((event) => (
          <button
            key={event.title}
            className="
              w-full px-4 py-2.5 text-left flex items-center gap-3
              hover:bg-muted/25 transition-colors
            "
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{event.title}</p>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                <Users className="w-3 h-3" />
                {event.viewers} viendo
              </p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>

    {/* Sugeridos */}
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.65, duration: 0.5 }}
      className={cardBase}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/20">
        <Crown className="w-5 h-5 text-yellow-400" />
        <h3 className="font-semibold text-sm">Sugeridos para ti</h3>
      </div>
      <div className="divide-y divide-border/10">
        {SUGGESTED_USERS.map((user) => (
          <div
            key={user.handle}
            className="
              px-4 py-2.5 flex items-center gap-3
              hover:bg-muted/25 transition-colors
            "
          >
            <Avatar className="w-9 h-9">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate flex items-center gap-1.5">
                <span>{user.name}</span>
                {user.badge && (
                  <Badge
                    variant="secondary"
                    className="text-[9px] px-1 py-[1px] rounded-full"
                  >
                    {user.badge}
                  </Badge>
                )}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {user.handle}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="
                h-7 text-xs rounded-full
                border-primary/40 text-primary
                hover:bg-primary/10
              "
            >
              Seguir
            </Button>
          </div>
        ))}
      </div>
    </motion.div>

    {/* Quick Links */}
    <div className="px-4 pt-1 pb-2 text-[11px] text-muted-foreground/60 space-y-1">
      <div className="flex flex-wrap gap-x-2 gap-y-1">
        <Link to="/docs" className="hover:text-primary transition-colors">
          Docs
        </Link>
        <Link
          to="/governance"
          className="hover:text-primary transition-colors"
        >
          Gobernanza
        </Link>
        <Link to="/economy" className="hover:text-primary transition-colors">
          Economía
        </Link>
        <Link
          to="/university"
          className="hover:text-primary transition-colors"
        >
          UTAMV
        </Link>
      </div>
      <p>© 2026 TAMV MD-X4™ · Ecosistema civilizatorio</p>
    </div>
  </aside>
);
