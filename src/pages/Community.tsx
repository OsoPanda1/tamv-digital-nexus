import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CreatePostComposer } from "@/components/social/CreatePostComposer";
import { SocialFeedPost, MOCK_POSTS } from "@/components/social/SocialFeedPost";
import {
  Users, Video, MessageCircle, Heart, Search, TrendingUp, Radio,
  Image as ImageIcon, Star, Crown, Globe, Music, Flame
} from "lucide-react";

const GROUPS = [
  { name: "Desarrolladores Quantum", members: "12.4K", avatar: "https://picsum.photos/seed/g1/80/80", category: "Tech" },
  { name: "Arte Digital XR", members: "8.9K", avatar: "https://picsum.photos/seed/g2/80/80", category: "Arte" },
  { name: "UTAMV Students", members: "6.2K", avatar: "https://picsum.photos/seed/g3/80/80", category: "Educación" },
  { name: "Music Producers", members: "4.1K", avatar: "https://picsum.photos/seed/g4/80/80", category: "Música" },
  { name: "DreamSpace Builders", members: "3.8K", avatar: "https://picsum.photos/seed/g5/80/80", category: "Metaverso" },
  { name: "CITEMESH DAO", members: "2.3K", avatar: "https://picsum.photos/seed/g6/80/80", category: "Gobernanza" },
];

const LIVE_CHANNELS = [
  { name: "Quantum Night Live", viewers: "2.3K", img: "https://picsum.photos/seed/live1/400/225", host: "TAMV Official" },
  { name: "Coding Session", viewers: "891", img: "https://picsum.photos/seed/live2/400/225", host: "Carlos M." },
  { name: "Art Workshop", viewers: "456", img: "https://picsum.photos/seed/live3/400/225", host: "María R." },
  { name: "Music Jam", viewers: "1.2K", img: "https://picsum.photos/seed/live4/400/225", host: "TAMV Music" },
];

const Community = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex items-end pb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Comunidad TAMV</h1>
            <p className="text-sm text-muted-foreground">156 grupos · 23 canales live · 12.5K miembros activos</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6 pb-20">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Buscar grupos, canales, personas..."
            className="w-full bg-card/40 border border-border/20 rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40"
          />
        </div>

        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="bg-card/30 border border-border/20 rounded-xl p-1 h-auto flex w-full mb-6">
            <TabsTrigger value="feed" className="flex-1 gap-1.5 text-xs rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Flame className="w-4 h-4" />Feed
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex-1 gap-1.5 text-xs rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Users className="w-4 h-4" />Grupos
            </TabsTrigger>
            <TabsTrigger value="live" className="flex-1 gap-1.5 text-xs rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Radio className="w-4 h-4" />En Vivo
            </TabsTrigger>
            <TabsTrigger value="events" className="flex-1 gap-1.5 text-xs rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Star className="w-4 h-4" />Eventos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-4">
            <CreatePostComposer />
            {MOCK_POSTS.map((post, i) => (
              <SocialFeedPost key={post.id} post={post} index={i} />
            ))}
          </TabsContent>

          <TabsContent value="groups">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {GROUPS.map((group) => (
                <motion.div
                  key={group.name}
                  whileHover={{ scale: 1.02 }}
                  className="bg-card/40 backdrop-blur border border-border/20 rounded-2xl p-5 cursor-pointer hover:border-primary/20 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img src={group.avatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{group.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" />{group.members} miembros
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">{group.category}</Badge>
                  </div>
                  <Button size="sm" className="w-full rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
                    Unirme
                  </Button>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="live">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LIVE_CHANNELS.map((ch) => (
                <motion.div
                  key={ch.name}
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group"
                >
                  <img src={ch.img} alt="" className="w-full aspect-video object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                  <Badge className="absolute top-3 left-3 bg-destructive/90 text-destructive-foreground gap-1 animate-pulse">
                    <Radio className="w-3 h-3" />LIVE
                  </Badge>
                  <div className="absolute top-3 right-3 text-xs bg-background/60 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1">
                    <Users className="w-3 h-3" />{ch.viewers}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="font-bold text-sm">{ch.name}</p>
                    <p className="text-xs text-muted-foreground">{ch.host}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div className="space-y-4">
              {[
                { title: "Concierto Quantum Night", date: "Mar 15, 2026", attendees: "2.3K", location: "DreamSpace Arena" },
                { title: "Hackathon TAMV 2026", date: "Apr 1-3, 2026", attendees: "500", location: "Virtual" },
                { title: "Ceremonia de Certificación UTAMV", date: "Mar 28, 2026", attendees: "1.2K", location: "UTAMV Campus" },
              ].map((event) => (
                <div key={event.title} className="bg-card/40 backdrop-blur border border-border/20 rounded-2xl p-5 flex items-center gap-4 hover:border-primary/20 transition-all">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex flex-col items-center justify-center border border-primary/20">
                    <span className="text-xs text-primary font-medium">{event.date.split(" ")[0]}</span>
                    <span className="text-lg font-bold text-primary">{event.date.split(" ")[1]?.replace(",", "")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <Globe className="w-3 h-3" />{event.location}
                      <span>·</span>
                      <Users className="w-3 h-3" />{event.attendees} asistentes
                    </p>
                  </div>
                  <Button size="sm" className="rounded-full">Asistir</Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Community;
