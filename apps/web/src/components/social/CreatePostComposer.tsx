import { useState } from "react";
import { motion } from "framer-motion";
import { Image, Video, Music, Mic, MapPin, Smile, Send, Sparkles, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const CreatePostComposer = () => {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);

  const mediaActions = [
    { icon: Image, label: "Foto", color: "text-emerald-400" },
    { icon: Video, label: "Video", color: "text-red-400" },
    { icon: Music, label: "Audio", color: "text-purple-400" },
    { icon: Mic, label: "Podcast", color: "text-orange-400" },
    { icon: MapPin, label: "Ubicación", color: "text-cyan-400" },
    { icon: Smile, label: "Emoji", color: "text-yellow-400" },
    { icon: Hash, label: "Tags", color: "text-pink-400" },
  ];

  return (
    <motion.div
      layout
      className={`bg-card/60 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-300 ${
        focused ? 'border-primary/40 shadow-lg shadow-primary/10' : 'border-border/30'
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        <Avatar className="w-11 h-11 ring-2 ring-primary/20">
          <AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg" />
          <AvatarFallback>TC</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => !text && setFocused(false)}
            placeholder="¿Qué está pasando en tu metaverso? Comparte con la comunidad..."
            className="w-full bg-transparent border-none outline-none resize-none text-sm placeholder:text-muted-foreground/60 min-h-[44px] max-h-[200px]"
            rows={focused ? 3 : 1}
          />
        </div>
      </div>

      {/* Media Actions */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/20">
        <div className="flex items-center gap-1">
          {mediaActions.map(({ icon: Icon, label, color }) => (
            <Button key={label} variant="ghost" size="sm" className={`h-8 w-8 p-0 ${color} hover:bg-card`} title={label}>
              <Icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            IA Assist
          </Button>
          <Button
            size="sm"
            disabled={!text.trim()}
            className="rounded-full px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Publicar
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
