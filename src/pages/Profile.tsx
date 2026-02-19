import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Settings, Bell, MapPin, LinkIcon, Calendar, Grid3X3,
  Heart, MessageCircle, Bookmark, Video, Image as ImageIcon,
  Verified, Shield, Crown, Star, Users, ExternalLink
} from "lucide-react";
import { SocialFeedPost, MOCK_POSTS } from "@/components/social/SocialFeedPost";

const USER_MEDIA = Array.from({ length: 9 }, (_, i) => ({
  id: i, url: `https://picsum.photos/seed/media${i}/400/400`, type: i % 3 === 0 ? "video" : "photo"
}));

const Profile = () => {
  const [following, setFollowing] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Photo */}
      <div className="relative h-56 md:h-72 w-full overflow-hidden">
        <img
          src="https://picsum.photos/seed/cover_tamv/1920/600"
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-end gap-5 mb-6"
        >
          <Avatar className="w-32 h-32 ring-4 ring-background shadow-xl">
            <AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg" />
            <AvatarFallback className="text-3xl">TC</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">Edwin O. Castillo</h1>
              <Verified className="w-6 h-6 text-primary fill-primary/20" />
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">CEO Fundador</Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-2">@anubis_villasenor · Arquitecto Computacional & Custodio Legal de Entidades Digitales</p>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />Mineral del Monte, Hidalgo</span>
              <span className="flex items-center gap-1"><LinkIcon className="w-3 h-3" />tamv.online</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Se unió en 2024</span>
            </div>
            <div className="flex gap-5 text-sm">
              <span><strong className="text-foreground">21K</strong> <span className="text-muted-foreground">seguidores</span></span>
              <span><strong className="text-foreground">342</strong> <span className="text-muted-foreground">siguiendo</span></span>
              <span><strong className="text-foreground">1.2K</strong> <span className="text-muted-foreground">posts</span></span>
            </div>
          </div>

          <div className="flex gap-2 self-start md:self-auto">
            <Button
              onClick={() => setFollowing(!following)}
              className={following ? "bg-card border border-border text-foreground hover:bg-card/80" : "bg-primary text-primary-foreground hover:bg-primary/90"}
              size="sm"
            >
              {following ? "Siguiendo" : "Seguir"}
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9"><MessageCircle className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon" className="h-9 w-9"><Settings className="w-4 h-4" /></Button>
          </div>
        </motion.div>

        {/* Badges */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { icon: Crown, label: "Gold 18K", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
            { icon: Shield, label: "Anubis Sentinel", color: "text-primary bg-primary/10 border-primary/20" },
            { icon: Star, label: "Top Creator", color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
            { icon: Users, label: "CITEMESH DAO", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
          ].map(b => (
            <Badge key={b.label} variant="outline" className={`gap-1 ${b.color}`}>
              <b.icon className="w-3 h-3" />{b.label}
            </Badge>
          ))}
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full bg-card/30 border border-border/20 rounded-xl p-1 h-auto flex">
            <TabsTrigger value="posts" className="flex-1 gap-1.5 text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg">
              <Grid3X3 className="w-4 h-4" />Posts
            </TabsTrigger>
            <TabsTrigger value="media" className="flex-1 gap-1.5 text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg">
              <ImageIcon className="w-4 h-4" />Media
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex-1 gap-1.5 text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg">
              <Video className="w-4 h-4" />Videos
            </TabsTrigger>
            <TabsTrigger value="likes" className="flex-1 gap-1.5 text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg">
              <Heart className="w-4 h-4" />Likes
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex-1 gap-1.5 text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg">
              <Bookmark className="w-4 h-4" />Guardados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-4 space-y-4">
            {MOCK_POSTS.slice(0, 4).map((post, i) => (
              <SocialFeedPost key={post.id} post={post} index={i} />
            ))}
          </TabsContent>

          <TabsContent value="media" className="mt-4">
            <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden">
              {USER_MEDIA.map((m) => (
                <motion.div key={m.id} whileHover={{ scale: 1.02 }} className="relative aspect-square cursor-pointer group">
                  <img src={m.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3">
                      <span className="flex items-center gap-1 text-sm font-bold"><Heart className="w-4 h-4" />234</span>
                      <span className="flex items-center gap-1 text-sm font-bold"><MessageCircle className="w-4 h-4" />45</span>
                    </div>
                  </div>
                  {m.type === "video" && (
                    <Video className="absolute top-2 right-2 w-5 h-5 text-foreground drop-shadow" />
                  )}
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="mt-4">
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer group">
                  <img src={`https://picsum.photos/seed/vid${i}/300/530`} alt="" className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end text-xs">
                    <span className="font-bold">{(Math.random() * 50 + 1).toFixed(1)}K views</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="likes" className="mt-4 space-y-4">
            {MOCK_POSTS.slice(2, 5).map((post, i) => (
              <SocialFeedPost key={post.id} post={post} index={i} />
            ))}
          </TabsContent>

          <TabsContent value="saved" className="mt-4">
            <div className="text-center py-12 text-muted-foreground">
              <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Elementos guardados</p>
              <p className="text-sm">Tu contenido guardado aparecerá aquí</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
