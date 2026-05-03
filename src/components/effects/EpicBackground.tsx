import { motion } from "framer-motion";

export const EpicBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#030712]" />

      <motion.div
        className="absolute -inset-[20%]"
        animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle at 20% 25%, rgba(56,189,248,0.22) 0%, transparent 40%), radial-gradient(circle at 80% 30%, rgba(168,85,247,0.2) 0%, transparent 45%), radial-gradient(circle at 50% 80%, rgba(16,185,129,0.16) 0%, transparent 42%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.08) 45%, transparent 70%)",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/25 to-black/70" />
    </div>
  );
};

export default EpicBackground;
