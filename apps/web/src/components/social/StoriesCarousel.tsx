import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Play, Volume2 } from "lucide-react";

const STORIES = [
  { id: 1, user: "Tu Historia", avatar: "", isOwn: true, gradient: "from-primary to-secondary", viewed: false },
  { id: 2, user: "Isabella AI", avatar: "https://randomuser.me/api/portraits/women/44.jpg", gradient: "from-cyan-400 to-purple-600", viewed: false, isLive: true },
  { id: 3, user: "Edwin C.", avatar: "https://randomuser.me/api/portraits/men/32.jpg", gradient: "from-pink-500 to-orange-400", viewed: false },
  { id: 4, user: "María R.", avatar: "https://randomuser.me/api/portraits/women/28.jpg", gradient: "from-emerald-400 to-cyan-500", viewed: false },
  { id: 5, user: "TAMV Live", avatar: "https://randomuser.me/api/portraits/men/75.jpg", gradient: "from-red-500 to-pink-600", viewed: false, isLive: true },
  { id: 6, user: "Carlos M.", avatar: "https://randomuser.me/api/portraits/men/45.jpg", gradient: "from-blue-500 to-indigo-600", viewed: true },
  { id: 7, user: "Ana T.", avatar: "https://randomuser.me/api/portraits/women/65.jpg", gradient: "from-yellow-400 to-red-500", viewed: false },
  { id: 8, user: "DreamBot", avatar: "https://randomuser.me/api/portraits/lego/1.jpg", gradient: "from-violet-500 to-fuchsia-600", viewed: true },
  { id: 9, user: "Quantum", avatar: "https://randomuser.me/api/portraits/men/22.jpg", gradient: "from-teal-400 to-blue-600", viewed: false },
  { id: 10, user: "UTAMV", avatar: "https://randomuser.me/api/portraits/women/12.jpg", gradient: "from-amber-400 to-orange-600", viewed: true },
  { id: 11, user: "Anubis", avatar: "https://randomuser.me/api/portraits/men/55.jpg", gradient: "from-slate-400 to-zinc-600", viewed: false },
  { id: 12, user: "KAOS", avatar: "https://randomuser.me/api/portraits/women/33.jpg", gradient: "from-lime-400 to-emerald-600", viewed: true },
];

export const StoriesCarousel = () => {
  const [selectedStory, setSelectedStory] = useState<number | null>(null);

  return (
    <>
      <div className="w-full overflow-x-auto scrollbar-none py-4 px-2">
        <div className="flex gap-3 min-w-max">
          {STORIES.map((story, i) => (
            <motion.button
              key={story.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setSelectedStory(story.id)}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className={`relative p-[3px] rounded-full bg-gradient-to-br ${story.viewed ? 'from-muted/40 to-muted/20' : story.gradient}`}>
                {story.isOwn ? (
                  <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center border-2 border-card">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                ) : (
                  <img
                    src={story.avatar}
                    alt={story.user}
                    className="w-16 h-16 rounded-full object-cover border-2 border-card group-hover:scale-105 transition-transform"
                  />
                )}
                {story.isLive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] font-bold bg-destructive text-destructive-foreground rounded-full uppercase tracking-wider animate-pulse">
                    Live
                  </span>
                )}
              </div>
              <span className={`text-xs font-medium truncate max-w-[72px] ${story.viewed ? 'text-muted-foreground' : 'text-foreground'}`}>
                {story.user}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {selectedStory !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setSelectedStory(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`https://picsum.photos/seed/story${selectedStory}/400/700`}
                alt="Story"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80" />
              {/* Progress bars */}
              <div className="absolute top-3 left-3 right-3 flex gap-1">
                {[1, 2, 3].map((seg) => (
                  <div key={seg} className="flex-1 h-0.5 rounded-full bg-foreground/30 overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: seg === 1 ? "100%" : "0%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="h-full bg-foreground rounded-full"
                    />
                  </div>
                ))}
              </div>
              <div className="absolute top-8 left-4 flex items-center gap-3">
                <img
                  src={STORIES.find(s => s.id === selectedStory)?.avatar || "https://randomuser.me/api/portraits/men/1.jpg"}
                  className="w-10 h-10 rounded-full border-2 border-foreground/50"
                  alt=""
                />
                <div>
                  <p className="text-sm font-bold text-foreground">{STORIES.find(s => s.id === selectedStory)?.user}</p>
                  <p className="text-xs text-foreground/60">hace 2h</p>
                </div>
              </div>
              <div className="absolute bottom-6 left-4 right-4">
                <div className="flex items-center gap-2">
                  <input
                    placeholder="Responder historia..."
                    className="flex-1 bg-foreground/10 backdrop-blur rounded-full px-4 py-2.5 text-sm border border-foreground/20 text-foreground placeholder:text-foreground/40"
                  />
                  <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <Play className="w-4 h-4 text-primary-foreground" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
