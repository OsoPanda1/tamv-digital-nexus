import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart, MessageCircle, Share2, Play, Music, Mic2, Video, Radio, Users,
  Layers, MessageSquare, GalleryVertical, Store, Wallet, Star, GraduationCap,
  Sparkles, PawPrint, Waves, Shield, Gem, Flame, Rocket, LucideProps
} from "lucide-react";

// --- Datos mock para ilustración — reemplaza con requests API reales en integración ---
const mainVideo = {
  url: "https://samplelib.com/mp4/sample-5s.mp4",
  title: "Portal Quantum TAMV MD-X4™",
  description: "Bienvenido al salto definitivo del socialnet. Sumérgete en el metaverso, experimenta una comunidad sensorial, explora, crea y conquista el futuro. 😊🚀"
};
const heroEffects = "from-[#291D57]/80 via-[#3B206D]/90 to-[#0F1228]/90";
const glowBtn =
  "from-cyan-400 to-purple-500 via-pink-500 shadow-[0_0_40px_#b253ff99] hover:shadow-[0_0_100px_#ffe15aff] hover:bg-cyan-600/70";
const glass =
  "bg-gradient-to-br from-[#2e156b77] via-[#26093544] to-[#113c5955] backdrop-blur-2xl border border-purple-400/15 shadow-[0_4px_48px_#3c42ff33]";
const glassHover =
  "hover:scale-[1.035] hover:shadow-[0_0_32px_#ff72dd66] transition-all duration-300";

const UNIFIED_TOOLS = [
  { icon: Users, text: "Grupos", color: "from-indigo-500 to-fuchsia-600" },
  { icon: Layers, text: "Canales", color: "from-blue-500 to-cyan-400" },
  { icon: Video, text: "Videollamadas", color: "from-yellow-300 to-orange-400" },
  { icon: MessageSquare, text: "Chats", color: "from-cyan-300 to-violet-600" },
  { icon: Radio, text: "Lives", color: "from-lime-300 to-green-500" },
  { icon: GalleryVertical, text: "Galerías", color: "from-orange-400 to-pink-600" },
  { icon: Store, text: "Marketplace", color: "from-amber-400 to-emerald-400" },
  { icon: Wallet, text: "Wallet", color: "from-slate-500 to-blue-700" }
];

const EXCLUSIVE_SECTIONS = [
  { icon: GraduationCap, label: "Universidad TAMV", color: "from-violet-400 to-violet-800" },
  { icon: Sparkles, label: "DreamSpaces", color: "from-cyan-300 to-blue-400" },
  { icon: Gem, label: "Puentes de Conocimiento", color: "from-yellow-200 to-orange-600" },
  { icon: Music, label: "Conciertos Sensoriales", color: "from-fuchsia-500 to-red-500" },
  { icon: GalleryVertical, label: "Arte Digital", color: "from-green-400 to-cyan-500" },
  { icon: PawPrint, label: "Mascotas", color: "from-lime-400 to-teal-400" },
  { icon: Waves, label: "KAOS", color: "from-blue-400 to-indigo-700" },
  { icon: Shield, label: "Membresías", color: "from-pink-600 to-purple-600" }
];

// Component para el feed social
const SocialPost = ({ idx }: { idx: number }) => (
  <Card className={`${glass} p-6 ${glassHover} mb-6 max-w-2xl mx-auto`}>
    <div className="flex items-start gap-4">
      <img src={`https://randomuser.me/api/portraits/${idx % 2 === 0 ? 'men' : 'women'}/${idx}.jpg`} className="w-14 h-14 rounded-full border-2 border-purple-400/30" alt="User" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-lg">Usuario {idx}</span>
          <Badge className="bg-gradient-to-r from-cyan-500 to-purple-500">Creador</Badge>
          <span className="text-sm text-muted-foreground">• hace 2h</span>
        </div>
        <p className="text-base mb-4">Explorando nuevas dimensiones en el metaverso TAMV 🚀✨ #DreamSpaces #QuantumReality</p>
        <img src={`https://picsum.photos/seed/post${idx}/600/400`} className="rounded-xl mb-4 w-full" alt="Post content" />
        <div className="flex items-center gap-6 text-muted-foreground">
          <Button variant="ghost" size="sm" className="gap-2"><Heart className="w-5 h-5" /> {Math.floor(Math.random() * 500) + 50}</Button>
          <Button variant="ghost" size="sm" className="gap-2"><MessageCircle className="w-5 h-5" /> {Math.floor(Math.random() * 100) + 10}</Button>
          <Button variant="ghost" size="sm" className="gap-2"><Share2 className="w-5 h-5" /> Compartir</Button>
        </div>
      </div>
    </div>
  </Card>
);

export default function TAMVEpicPortal() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#141028] via-[#20134b] to-[#4e23aa] scrollbar-thin pb-20 relative">
      {/* CINTA HERO QUANTUM */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 1, type: "spring" }}
        className="w-full shadow-xl"
      >
        <nav className="bg-gradient-to-br from-cyan-500/10 via-[#1f194966] to-violet-900/80 px-10 py-4 flex flex-row items-center justify-between border-b border-purple-400/10 rounded-b-3xl sticky top-0 z-40 backdrop-blur-2xl">
          <div className="flex items-center gap-4">
            <Flame className="w-10 h-10 text-yellow-300 drop-shadow" />
            <span className="text-[2rem] font-black bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400 bg-clip-text text-transparent tracking-tight animate-gradient">
              TAMV MD-X4
            </span>
          </div>
          <input className="rounded-full px-6 py-2 text-lg w-96 max-w-xs border-none outline-none bg-white/10 focus:bg-white/25 placeholder:text-white/40 transition-all shadow-inner" placeholder="Buscar en el metaverso, docs, IA..." />
          <div className="flex items-center gap-6">
            <Button className={`rounded-full px-7 py-2 text-lg font-extrabold bg-gradient-to-br ${glowBtn}`}>Entrar / Registrarse</Button>
            <img src="https://randomuser.me/api/portraits/men/17.jpg" className="w-12 h-12 rounded-full border-4 border-cyan-500/30 shadow-xl object-cover" />
          </div>
        </nav>
      </motion.header>

      {/* VIDEO HERO */}
      <section className="flex flex-col items-center justify-center max-w-6xl mx-auto pt-12 pb-2 px-2">
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1.1, type: "spring" }}
          className={`rounded-3xl overflow-hidden shadow-2xl border-4 border-fuchsia-600/50 backdrop-blur-xl ${glass}`}
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
          <div className="absolute top-8 right-20 px-6 py-2 rounded-2xl bg-gradient-to-br from-violet-800/80 to-cyan-600/60 text-2xl font-extrabold text-white shadow-lg pointer-events-none select-none">
            <Rocket className="inline-block mr-2 -mt-1 text-yellow-300 animate-bounce" />
            {mainVideo.title}
          </div>
        </motion.div>
        <div className="py-4 text-center max-w-2xl mx-auto font-semibold text-lg text-white/70">{mainVideo.description}</div>
      </section>

      {/* LINEAS DE VIDEOS DESTACADOS */}
      <section className="relative py-3 flex flex-col gap-4 items-center">
        <div className="flex gap-6 w-full max-w-5xl">
          {[...Array(4)].map((_, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px #a389ff88" }}
              className={`rounded-2xl shadow-quantum backdrop-blur-lg relative bg-gradient-to-br from-[#2c216b]/80 to-[#1c3579]/70 overflow-hidden ${glassHover} transition`}
            >
              <img src={`https://picsum.photos/seed/vidline1_${idx}/320/180`} alt="" className="w-64 aspect-video object-cover opacity-80" />
              <div className="absolute bottom-2 left-2 text-sm px-4 py-1 rounded-full bg-black/40 shadow-lg font-bold text-white">{`Destacado #${idx+1}`}</div>
            </motion.div>
          ))}
        </div>
        <div className="flex gap-6 w-full max-w-5xl">
          {[...Array(4)].map((_, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px #82e8e0aa" }}
              className={`rounded-2xl shadow-quantum backdrop-blur-lg relative bg-gradient-to-br from-[#194f63]/80 to-[#0a254b]/70 overflow-hidden ${glassHover} transition`}
            >
              <img src={`https://picsum.photos/seed/vidline2_${800+idx}/320/180`} alt="" className="w-64 aspect-video object-cover opacity-80" />
              <div className="absolute bottom-2 left-2 text-sm px-4 py-1 rounded-full bg-white/20 shadow font-bold text-white">{`Epic Viral #${idx+1}`}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TOOLBAR CATEGORIAS SOCIAL-FUTURE */}
      <motion.section
        initial={{ y: 32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 1.1, type: "spring" }}
        className="py-3 flex flex-wrap gap-6 justify-center items-center w-full max-w-7xl mx-auto"
      >
        {UNIFIED_TOOLS.map(btn => (
          <Button
            key={btn.text}
            className={`h-16 min-w-52 px-10 uppercase text-xl font-extrabold rounded-full shadow-lg bg-gradient-to-br ${btn.color} flex items-center gap-4 justify-center ${glassHover}`}
          >
            <btn.icon className="w-8 h-8 -ml-1" strokeWidth={2.5} />
            {btn.text}
          </Button>
        ))}
      </motion.section>

      {/* MURO GLOBAL ULTRA */}
      <motion.section
        initial={{ opacity: 0, x: 44 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 1.5, type: "spring" }}
        className="py-20 px-4"
      >
        <h2 className="text-4xl font-black text-center mb-8 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400 bg-clip-text text-transparent">
          Feed Global • Social Quantum
        </h2>
        <div className="space-y-6">
          {[...Array(5)].map((_, idx) => (
            <SocialPost key={idx} idx={idx} />
          ))}
        </div>
      </motion.section>

      {/* Panel Música, Podcasts, Streams, Webcams */}
      <motion.section
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.3, type: "spring" }}
        className="py-14 px-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-14 max-w-7xl mx-auto"
      >
        <Card className={`${glass} flex flex-col gap-3 items-center h-full shadow-xl`}>
          <Music className="w-12 h-12 text-cyan-400" />
          <h2 className="text-2xl font-bold tracking-tight">Música</h2>
          <div className="h-24 rounded-xl w-full bg-gradient-to-br from-cyan-800/30 to-blue-700/30 flex items-center justify-center text-xl">Player AI, Charts, Rooms</div>
        </Card>
        <Card className={`${glass} flex flex-col gap-3 items-center h-full shadow-xl`}>
          <Mic2 className="w-12 h-12 text-pink-400" />
          <h2 className="text-2xl font-bold tracking-tight">Podcasts</h2>
          <div className="h-24 rounded-xl w-full bg-gradient-to-br from-pink-800/30 to-violet-700/30 flex items-center justify-center text-xl">Top AI Podcast Shows</div>
        </Card>
        <Card className={`${glass} flex flex-col gap-3 items-center h-full shadow-xl`}>
          <Radio className="w-12 h-12 text-green-400" />
          <h2 className="text-2xl font-bold tracking-tight">Lives Streams</h2>
          <div className="h-24 rounded-xl w-full bg-gradient-to-br from-green-800/20 to-emerald-700/30 flex items-center justify-center text-xl">Streamlist & Alerts</div>
        </Card>
        <Card className={`${glass} flex flex-col gap-3 items-center h-full shadow-xl`}>
          <Video className="w-12 h-12 text-yellow-300" />
          <h2 className="text-2xl font-bold tracking-tight">WebCams</h2>
          <div className="h-24 rounded-xl w-full bg-gradient-to-br from-yellow-800/30 to-pink-200/20 flex items-center justify-center text-xl">Cam Wall, Trending</div>
        </Card>
      </motion.section>

      {/* BLOQUE EXCLUSIVO: University, Dreamspaces, Puentes, Conciertos, Galerías, Mascotas, KAOS, Membresías */}
      <section className="py-24 px-4 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-16">
        {EXCLUSIVE_SECTIONS.map(sec => (
          <motion.div
            key={sec.label}
            whileHover={{ scale: 1.045, boxShadow: "0 4px 34px #fff4" }}
            className={`rounded-3xl shadow-xl border-2 border-white/10 p-8 min-h-[180px] flex items-center gap-5 bg-gradient-to-br ${sec.color} ${glass} cursor-pointer hover:bg-opacity-80 hover:-translate-y-1 transition-all duration-500`}
          >
            <sec.icon className="w-12 h-12 drop-shadow-[0_2px_8px_#e4dcff66]" />
            <span className="font-extrabold text-2xl capitalize">{sec.label}</span>
          </motion.div>
        ))}
      </section>
      {/* OPCIONAL: Overlay animado de partículas, background sensorial, animaciones Framer detrás de los bloques para sensación epic-final */}
    </main>
  );
}
