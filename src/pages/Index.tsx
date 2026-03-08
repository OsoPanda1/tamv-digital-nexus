// ============================================================================
// TAMV MD-X4™ — HOME: Social Feed First (Instagram/TikTok-style)
// Visual-first: 85% media, 15% text
// ============================================================================

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Flame, TrendingUp, Users, Video, Radio, Search,
  Hash, Crown, Zap, Globe, Star, Sparkles,
} from "lucide-react";

// Social components
import { NextGenFeed } from "@/components/social/NextGenFeed";
import { TrendingSidebar } from "@/components/social/TrendingSidebar";
import { StoriesCarousel } from "@/components/social/StoriesCarousel";
import CinematicIntro from "@/components/CinematicIntro";
import { useAuth } from "@/hooks/useAuth";

// ============================================================================
// MAIN
// ============================================================================

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const { isAuthenticated } = useAuth();

  if (showIntro) {
    return <CinematicIntro onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen py-4">
      {/* Top bar: Search + Quick actions */}
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              placeholder="Buscar en TAMV..."
              className="w-full bg-card/40 border border-border/20 rounded-xl pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 backdrop-blur-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            {!isAuthenticated && (
              <Link to="/auth">
                <Button size="sm" className="rounded-xl bg-primary text-primary-foreground text-xs gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Unirse
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main layout: Feed + Trending Sidebar */}
      <div className="max-w-7xl mx-auto px-4 flex gap-6">
        {/* Feed Column */}
        <div className="flex-1 max-w-2xl mx-auto xl:mx-0">
          {/* Stories */}
          <StoriesCarousel />

          {/* Feed tabs */}
          <Tabs defaultValue="foryou" className="w-full mb-4">
            <TabsList className="bg-card/30 border border-border/20 rounded-xl p-1 h-auto flex w-full">
              <TabsTrigger value="foryou" className="flex-1 gap-1.5 text-xs rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Flame className="w-3.5 h-3.5" /> Para ti
              </TabsTrigger>
              <TabsTrigger value="following" className="flex-1 gap-1.5 text-xs rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Users className="w-3.5 h-3.5" /> Siguiendo
              </TabsTrigger>
              <TabsTrigger value="live" className="flex-1 gap-1.5 text-xs rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Radio className="w-3.5 h-3.5" /> En Vivo
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex-1 gap-1.5 text-xs rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <TrendingUp className="w-3.5 h-3.5" /> Tendencia
              </TabsTrigger>
            </TabsList>

            <TabsContent value="foryou" className="mt-4">
              <NextGenFeed />
            </TabsContent>

            <TabsContent value="following" className="mt-4">
              <NextGenFeed />
            </TabsContent>

            <TabsContent value="live" className="mt-4">
              <LiveGrid />
            </TabsContent>

            <TabsContent value="trending" className="mt-4">
              <NextGenFeed />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right sidebar — Trending (desktop only) */}
        <TrendingSidebar />
      </div>
    </div>
  );
};

// ─── Live Grid ───
const LIVE_CHANNELS = [
  { name: "Quantum Night Live", viewers: "2.3K", img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=225&fit=crop", host: "TAMV Official" },
  { name: "Coding Session", viewers: "891", img: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=400&h=225&fit=crop", host: "Carlos M." },
  { name: "Art Workshop XR", viewers: "456", img: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=225&fit=crop", host: "María R." },
  { name: "Music Jam Binaural", viewers: "1.2K", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=225&fit=crop", host: "KAOS Audio" },
  { name: "DreamSpace Build", viewers: "678", img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=225&fit=crop", host: "Luna S." },
  { name: "UTAMV Clase Abierta", viewers: "1.5K", img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=225&fit=crop", host: "UTAMV" },
];

const LiveGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {LIVE_CHANNELS.map((ch) => (
      <motion.div
        key={ch.name}
        whileHover={{ scale: 1.02 }}
        className="relative rounded-xl overflow-hidden cursor-pointer group"
      >
        <img src={ch.img} alt="" className="w-full aspect-video object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        <Badge className="absolute top-2.5 left-2.5 bg-destructive/90 text-destructive-foreground gap-1 text-[9px] animate-pulse rounded-sm">
          <Radio className="w-3 h-3" /> LIVE
        </Badge>
        <div className="absolute top-2.5 right-2.5 text-[10px] bg-background/60 backdrop-blur px-2 py-0.5 rounded-sm flex items-center gap-1 font-mono">
          <Users className="w-3 h-3" />{ch.viewers}
        </div>
        <div className="absolute bottom-2.5 left-2.5 right-2.5">
          <p className="font-bold text-sm">{ch.name}</p>
          <p className="text-[10px] text-muted-foreground">{ch.host}</p>
        </div>
      </motion.div>
    ))}
  </div>
);

export default Index;
