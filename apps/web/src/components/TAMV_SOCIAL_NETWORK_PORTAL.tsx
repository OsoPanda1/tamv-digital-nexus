import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Share2,
  Play,
  Music,
  Mic2,
  Video,
  Radio,
  Users,
  Layers,
  MessageSquare,
  GalleryVertical,
  Store,
  Wallet,
  GraduationCap,
  Sparkles,
  PawPrint,
  Waves,
  Shield,
  Gem,
  Flame,
  Rocket,
} from "lucide-react";

/* --- MOCK DATOS Y ARRAYS --- */
const mainVideo = {
  url: "https://samplelib.com/mp4/sample-5s.mp4",
  title: "Portal Quantum TAMV MD-X4™",
  description:
    "Bienvenido al salto definitivo del socialnet. Sumérgete en el metaverso, experimenta una comunidad sensorial, explora, crea y conquista el futuro.",
};

const UNIFIED_TOOLS = [
  { icon: Users, text: "Grupos", color: "from-indigo-500 to-fuchsia-600" },
  { icon: Layers, text: "Canales", color: "from-blue-500 to-cyan-400" },
  { icon: Video, text: "Videollamadas", color: "from-yellow-300 to-orange-400" },
  { icon: MessageSquare, text: "Chats", color: "from-cyan-300 to-violet-600" },
  { icon: Radio, text: "Lives", color: "from-lime-300 to-green-500" },
  { icon: GalleryVertical, text: "Galerías", color: "from-orange-400 to-pink-600" },
  { icon: Store, text: "Marketplace", color: "from-amber-400 to-emerald-400" },
  { icon: Wallet, text: "Wallet", color: "from-slate-500 to-blue-700" },
];

const EXCLUSIVE_SECTIONS = [
  { icon: GraduationCap, label: "Universidad TAMV", color: "from-violet-400 to-violet-800" },
  { icon: Sparkles, label: "DreamSpaces", color: "from-cyan-300 to-blue-400" },
  { icon: Gem, label: "Puentes de Conocimiento", color: "from-yellow-200 to-orange-600" },
  { icon: Music, label: "Conciertos Sensoriales", color: "from-fuchsia-500 to-red-500" },
  { icon: GalleryVertical, label: "Arte Digital", color: "from-green-400 to-cyan-500" },
  { icon: PawPrint, label: "Mascotas", color: "from-lime-400 to-teal-400" },
  { icon: Waves, label: "KAOS", color: "from-blue-400 to-indigo-700" },
  { icon: Shield, label: "Membresías", color: "from-pink-600 to-purple-600" },
];

const mockPosts = [...Array(8)].map((_, idx) => ({
  id: `${idx + 1}`,
  platform: [
    "Instagram",
    "TikTok",
    "Twitter",
    "LinkedIn",
    "Facebook",
    "OnlyFans",
    "Telegram",
    "Fansly",
  ][idx],
  author: [
    "Design Studio MX",
    "Tech Innovators",
    "Digital Revolution",
    "Professional Network",
    "Community Central",
    "Creative Arts",
    "Tech Community",
    "Digital Creators",
  ][idx],
  avatar: ["DS", "TI", "DR", "PN", "CC", "CA", "TC", "DC"][idx],
  time: [
    "Hace 15 min",
    "Hace 1 hora",
    "Hace 2 horas",
    "Hace 3 horas",
    "Hace 4 horas",
    "Hace 5 horas",
    "Hace 6 horas",
    "Hace 8 horas",
  ][idx],
  content: [
    "Nuevo proyecto de diseño 3D para el metaverso 🎨✨ #TAMV #Design",
    "Tutorial de IA para crear espacios virtuales 🚀",
    "El futuro de las redes sociales...",
    "Conferencia sobre metaverso e IA en CDMX...",
    "Evento comunitario en Dream Space...",
    "Contenido exclusivo: Arte digital y NFTs",
    "Canal abierto de desarrollo TAMV...",
    "Behind the scenes: Creación de avatares 3D",
  ][idx],
  mediaUrl: `https://picsum.photos/seed/post${idx}/600/300`,
  mediaType: idx % 2 === 0 ? "image" : "video",
  likes: 2000 + idx * 1450,
  comments: 120 + idx * 311,
  shares: 80 + idx * 110,
  platformColor: [
    "from-purple-500 to-pink-500",
    "from-black to-cyan-400",
    "from-blue-400 to-blue-600",
    "from-blue-600 to-blue-800",
    "from-blue-500 to-blue-700",
    "from-blue-400 to-cyan-500",
    "from-blue-400 to-blue-500",
    "from-pink-400 to-rose-500",
  ][idx],
}));

export default function TAMVSocialNetworkPortal() {
  const glass =
    "bg-gradient-to-br from-[#2e156b77] via-[#26093544] to-[#113c5955] " +
    "backdrop-blur-xl border border-purple-400/20 shadow-[0_4px_48px_#3c42ff44]";
  const glassHover =
    "hover:scale-[1.03] hover:shadow-[0_0_32px_#ff72dd66] transition-all duration-300";
  const epicGradient = "bg-gradient-to-br from-[#141028] via-[#20134b] to-[#4e23aa]";

  return (
    <main className={`${epicGradient} min-h-screen w-full pb-28`}>
      {/* NAVBAR ÉPICO */}
      <motion.header
        initial={{ y: -48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="
          sticky top-0 z-50
          py-3 md:py-4 px-4 md:px-8
          border-b border-violet-500/15
          flex items-center justify-between gap-4
          backdrop-blur-2xl shadow-xl rounded-b-3xl
        "
      >
        <span
          className="
            flex items-center gap-3
            font-black text-[1.6rem] md:text-[2.2rem]
            bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400
            bg-clip-text text-transparent animate-gradient
          "
        >
          <Flame className="w-9 h-9 md:w-10 md:h-10 text-yellow-300 drop-shadow" />
          TAMV MD-X4
        </span>
        <div className="hidden md:flex flex-1 justify-center">
          <input
            className="
              rounded-full px-6 py-2 text-sm md:text-lg w-full max-w-md
              border-none outline-none
              bg-white/12 focus:bg-white/22
              placeholder:text-white/40 text-white
              shadow-inner
            "
            placeholder="Buscar en el metaverso, docs, IA..."
          />
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          <Button
            className="
              hidden md:inline-flex
              rounded-full px-6 md:px-7 py-2
              text-sm md:text-lg font-extrabold
              bg-gradient-to-br from-cyan-400 to-fuchsia-500 via-pink-400
              shadow-lg hover:scale-105 transition
              text-white
            "
          >
            Entrar / Registrarse
          </Button>
          <img
            src="https://randomuser.me/api/portraits/men/22.jpg"
            className="
              w-10 h-10 md:w-12 md:h-12 rounded-full
              border-4 border-yellow-400/30
              shadow-xl object-cover
            "
            alt="Usuario actual"
          />
        </div>
      </motion.header>

      {/* VIDEO PRINCIPAL PREMIUM */}
      <section className="flex flex-col items-center justify-center py-10 md:py-12 px-2">
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, type: "spring" }}
          className={`
            relative rounded-3xl overflow-hidden
            shadow-2xl border-4 border-fuchsia-600/50
            ${glass}
          `}
        >
          <video
            src={mainVideo.url}
            autoPlay
            loop
            controls
            muted
            className="w-full aspect-video object-cover"
            poster="/img/hero.jpg"
          />
          <div
            className="
              absolute top-4 md:top-8 right-4 md:right-20
              px-4 md:px-6 py-2 rounded-2xl
              bg-gradient-to-br from-violet-800/80 to-cyan-600/60
              text-base md:text-2xl font-extrabold text-white
              shadow-lg pointer-events-none select-none
            "
          >
            <Rocket className="inline-block mr-2 text-yellow-300 animate-bounce" />
            {mainVideo.title}
          </div>
        </motion.div>
        <p className="py-5 text-center max-w-2xl mx-auto font-semibold text-sm md:text-lg text-white/80 px-4">
          {mainVideo.description}
        </p>
      </section>

      {/* VIDEOS DESTACADOS */}
      <section className="relative py-4 flex flex-col gap-4 items-center">
        {[...Array(2)].map((_, lineIdx) => (
          <div
            key={lineIdx}
            className="
              flex gap-4 md:gap-7 w-full max-w-5xl
              overflow-x-auto px-2 md:px-0
            "
          >
            {[...Array(4)].map((_, idx) => (
              <motion.div
                key={`${lineIdx}-${idx}`}
                whileHover={{ scale: 1.06, boxShadow: "0 0 52px #e5ffcc88" }}
                className={`
                  min-w-[220px] md:min-w-[250px]
                  rounded-2xl shadow-[0_2px_48px_#00cfff44]
                  backdrop-blur-lg relative
                  ${glassHover} overflow-hidden
                `}
              >
                <img
                  src={`https://picsum.photos/seed/vid${lineIdx}${idx}/360/180`}
                  alt={`Video destacado ${lineIdx * 4 + idx + 1}`}
                  className="w-full aspect-video object-cover opacity-90"
                />
                <div
                  className="
                    absolute bottom-2 left-2
                    text-xs md:text-sm px-3 md:px-4 py-1
                    rounded-full bg-black/60 shadow-lg
                    font-bold text-white
                  "
                >
                  Featured #{lineIdx * 4 + idx + 1}
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </section>

      {/* TOOLBAR SOCIAL QUANTUM */}
      <motion.section
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
        className="
          py-6 flex flex-wrap gap-4 md:gap-7
          justify-center items-center
          w-full max-w-7xl mx-auto px-4
        "
      >
        {UNIFIED_TOOLS.map((btn) => (
          <Button
            key={btn.text}
            className={`
              h-12 md:h-16
              min-w-[160px] md:min-w-[210px]
              uppercase text-xs md:text-lg font-bold
              rounded-full shadow-lg bg-gradient-to-br ${btn.color}
              flex items-center gap-2 md:gap-4
              justify-center ${glassHover}
            `}
          >
            <btn.icon className="w-5 h-5 md:w-8 md:h-8 -ml-1" strokeWidth={2.5} />
            {btn.text}
          </Button>
        ))}
      </motion.section>

      {/* MURO SOCIAL GLOBAL */}
      <motion.section
        initial={{ opacity: 0, x: 44 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.3, type: "spring" }}
        className="py-16 md:py-20"
      >
        <section className="max-w-6xl mx-auto px-4 md:px-6">
          <h2
            className="
              text-3xl md:text-5xl font-black mb-6 text-center
              bg-gradient-to-r from-violet-500 via-cyan-400 to-pink-400
              bg-clip-text text-transparent
            "
          >
            Muro Global Quantum
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7">
            {mockPosts.map((post, i) => (
              <Card
                key={post.id}
                className={`
                  overflow-hidden ${glass} ${glassHover}
                  border-0 shadow-cyan-600/35
                  animate-scale-in
                `}
                style={{ animationDelay: `${i * 0.06}s` as any }}
              >
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-2">
                    <div
                      className={`
                        w-10 h-10 rounded-full
                        bg-gradient-to-br ${post.platformColor}
                        flex items-center justify-center
                        text-white font-extrabold shadow-xl
                      `}
                    >
                      {post.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-sm">{post.author}</span>
                      <Badge
                        className={`
                          mx-2 bg-gradient-to-r ${post.platformColor}
                          border-0 text-white text-[10px] px-2 py-[1px]
                        `}
                      >
                        {post.platform}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-white/60">
                      {post.time}
                    </span>
                  </div>
                  <p className="mb-3 text-sm md:text-base">{post.content}</p>
                  <div className="relative group cursor-pointer">
                    <img
                      src={post.mediaUrl}
                      alt={post.content}
                      className="w-full h-52 md:h-60 object-cover rounded-2xl"
                    />
                    {post.mediaType === "video" && (
                      <div
                        className="
                          absolute inset-0 flex items-center justify-center
                          bg-black/20 group-hover:bg-black/35
                          transition
                        "
                      >
                        <div
                          className="
                            w-12 h-12 md:w-14 md:h-14 rounded-full
                            bg-white/90 flex items-center justify-center
                            shadow-lg group-hover:scale-105 transition-transform
                          "
                        >
                          <Play className="w-7 h-7 md:w-8 md:h-8 text-black ml-1" />
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 right-4">
                      <Badge className="bg-black/60 text-white text-[10px]">
                        {post.mediaType === "video" ? "Video" : "Imagen"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3">
                    <button className="flex items-center gap-2 text-fuchsia-200 hover:text-fuchsia-500 transition text-sm">
                      <Heart className="w-5 h-5" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-cyan-200 hover:text-cyan-500 transition text-sm">
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-yellow-200 hover:text-yellow-400 transition text-sm">
                      <Share2 className="w-5 h-5" />
                      <span>{post.shares}</span>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </motion.section>

      {/* PANEL MÚSICA / PODCASTS / STREAMS / WEBCAMS */}
      <motion.section
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.3, type: "spring" }}
        className="
          py-12 md:py-16 px-4
          grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4
          gap-8 md:gap-12 max-w-7xl mx-auto
        "
      >
        <Card className={`${glass} flex flex-col gap-3 items-center h-full shadow-xl`}>
          <Music className="w-10 h-10 md:w-12 md:h-12 text-cyan-400" />
          <h2 className="text-xl md:text-2xl font-bold">Música AI</h2>
          <div
            className="
              h-20 md:h-24 w-full rounded-xl
              bg-gradient-to-br from-cyan-800/30 to-blue-400/30
              flex items-center justify-center text-sm md:text-xl
            "
          >
            Player Quantum • Mixes
          </div>
        </Card>
        <Card className={`${glass} flex flex-col gap-3 items-center h-full shadow-xl`}>
          <Mic2 className="w-10 h-10 md:w-12 md:h-12 text-pink-400" />
          <h2 className="text-xl md:text-2xl font-bold">Podcasts</h2>
          <div
            className="
              h-20 md:h-24 w-full rounded-xl
              bg-gradient-to-br from-pink-800/30 to-violet-700/30
              flex items-center justify-center text-sm md:text-xl
            "
          >
            Podcast AI • Deep Talks
          </div>
        </Card>
        <Card className={`${glass} flex flex-col gap-3 items-center h-full shadow-xl`}>
          <Radio className="w-10 h-10 md:w-12 md:h-12 text-green-400" />
          <h2 className="text-xl md:text-2xl font-bold">Live Streams</h2>
          <div
            className="
              h-20 md:h-24 w-full rounded-xl
              bg-gradient-to-br from-green-800/20 to-emerald-700/30
              flex items-center justify-center text-sm md:text-xl
            "
          >
            Stream Grid • Alerts
          </div>
        </Card>
        <Card className={`${glass} flex flex-col gap-3 items-center h-full shadow-xl`}>
          <Video className="w-10 h-10 md:w-12 md:h-12 text-yellow-300" />
          <h2 className="text-xl md:text-2xl font-bold">WebCams</h2>
          <div
            className="
              h-20 md:h-24 w-full rounded-xl
              bg-gradient-to-br from-yellow-800/30 to-pink-200/20
              flex items-center justify-center text-sm md:text-xl
            "
          >
            Cam Wall • Trending
          </div>
        </Card>
      </motion.section>

      {/* PANEL EXCLUSIVO */}
      <section
        className="
          py-16 md:py-24 px-4
          max-w-7xl mx-auto
          grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4
          gap-10 md:gap-16
        "
      >
        {EXCLUSIVE_SECTIONS.map((sec) => (
          <motion.div
            key={sec.label}
            whileHover={{ scale: 1.06, boxShadow: "0 8px 32px #e4dcff66" }}
            className={`
              rounded-3xl shadow-xl border-2 border-white/10
              p-6 md:p-8 min-h-[160px] md:min-h-[180px]
              flex items-center gap-4 md:gap-5
              bg-gradient-to-br ${sec.color}
              ${glass}
              cursor-pointer hover:bg-opacity-80 hover:-translate-y-1
              transition-all duration-500
            `}
          >
            <sec.icon className="w-10 h-10 md:w-14 md:h-14 drop-shadow-[0_2px_8px_#e4dcff66]" />
            <span className="font-extrabold text-lg md:text-2xl capitalize">
              {sec.label}
            </span>
          </motion.div>
        ))}
      </section>

      {/* CAPA PARA FUTURO BACKGROUND 3D / PARTICLES */}
      <div className="fixed inset-0 pointer-events-none select-none z-0 opacity-25">
        {/* Aquí puedes montar Canvas/Three.js para fondo particles / waves */}
      </div>
    </main>
  );
}
