import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CinematicIntro } from "@/components/CinematicIntro";
import { StoriesCarousel } from "@/components/social/StoriesCarousel";
import { SocialFeedPost, MOCK_POSTS } from "@/components/social/SocialFeedPost";
import { CreatePostComposer } from "@/components/social/CreatePostComposer";
import { TrendingSidebar } from "@/components/social/TrendingSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Compass, Tv, GraduationCap, Music, Gamepad2, ShoppingBag,
  Users, Radio, Globe, Sparkles, Play, Flame, ArrowRight
} from "lucide-react";

const QUICK_NAV = [
  { icon: Compass, label: "Explorar", path: "/ecosystem", color: "text-cyan-400" },
  { icon: Tv, label: "Videos", path: "/dream-spaces", color: "text-red-400" },
  { icon: Radio, label: "Lives", path: "/kaos", color: "text-green-400" },
  { icon: Music, label: "Música", path: "/kaos", color: "text-purple-400" },
  { icon: GraduationCap, label: "Cursos", path: "/university", color: "text-amber-400" },
  { icon: Users, label: "Grupos", path: "/community", color: "text-blue-400" },
  { icon: ShoppingBag, label: "Market", path: "/monetization", color: "text-pink-400" },
  { icon: Gamepad2, label: "Games", path: "/dream-spaces", color: "text-emerald-400" },
];

const FEATURED_REELS = [
  { id: 1, img: "https://picsum.photos/seed/reel1/300/530", user: "María R.", views: "12.4K" },
  { id: 2, img: "https://picsum.photos/seed/reel2/300/530", user: "Carlos M.", views: "8.2K" },
  { id: 3, img: "https://picsum.photos/seed/reel3/300/530", user: "TAMV", views: "45.1K" },
  { id: 4, img: "https://picsum.photos/seed/reel4/300/530", user: "Isabella", views: "23.7K" },
  { id: 5, img: "https://picsum.photos/seed/reel5/300/530", user: "UTAMV", views: "5.6K" },
  { id: 6, img: "https://picsum.photos/seed/reel6/300/530", user: "Ana T.", views: "9.3K" },
];

const Index = () => {
  const [showIntro, setShowIntro] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('tamv_intro_shown');
    if (!hasSeenIntro) {
      setShowIntro(true);
    } else {
      setIntroComplete(true);
    }
  }, []);

  const handleIntroComplete = () => {
    localStorage.setItem('tamv_intro_shown', 'true');
    setShowIntro(false);
    setIntroComplete(true);
  };

  if (showIntro && !introComplete) {
    return <CinematicIntro onComplete={handleIntroComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Quick Navigation Bar */}
      <div className="border-b border-border/20 bg-card/30 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {QUICK_NAV.map(({ icon: Icon, label, path, color }) => (
              <Link key={label} to={path}>
                <Button variant="ghost" size="sm" className="flex-shrink-0 gap-1.5 h-9 text-xs font-medium">
                  <Icon className={`w-4 h-4 ${color}`} />
                  {label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Main Feed Column */}
          <div className="space-y-4">
            {/* Stories */}
            <div className="bg-card/30 backdrop-blur border border-border/20 rounded-2xl px-3 py-1">
              <StoriesCarousel />
            </div>

            {/* Composer */}
            <CreatePostComposer />

            {/* Featured Reels */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Reels Trending
                </h2>
                <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
                  Ver todos <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
                {FEATURED_REELS.map((reel) => (
                  <motion.div
                    key={reel.id}
                    whileHover={{ scale: 1.03 }}
                    className="relative flex-shrink-0 w-32 aspect-[9/16] rounded-xl overflow-hidden cursor-pointer group"
                  >
                    <img src={reel.img} alt="" className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8 text-foreground fill-foreground/20" />
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-xs font-bold truncate">{reel.user}</p>
                      <p className="text-[10px] text-foreground/60 flex items-center gap-1">
                        <Play className="w-2.5 h-2.5" />{reel.views}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Feed Posts */}
            <div className="space-y-4">
              {MOCK_POSTS.map((post, i) => (
                <SocialFeedPost key={post.id} post={post} index={i} />
              ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center py-8">
              <Button variant="outline" className="rounded-full gap-2 border-primary/30 text-primary hover:bg-primary/10">
                <Sparkles className="w-4 h-4" />
                Cargar más contenido
              </Button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block">
            <TrendingSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
