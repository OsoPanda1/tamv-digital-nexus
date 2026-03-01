// ============================================================================
// TAMV MD-X4™ — CINEMATIC GENESIS INTRO v6.0 (Full File)
// PODER · LIDERAZGO · MAGIA — La Entrada al Mundo TAMV
// ============================================================================

import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float, Stars } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import introAudio from "@/assets/intro.mp3";
import logoImg from "@/assets/LOGOTAMV2.jpg";

// ─── Phase machine ───────────────────────────────────────────────────────────
type Phase =
  | "permission" // Black screen + button
  | "awakening"  // Dark pulse / heartbeat
  | "ignition"   // Energy builds
  | "explosion"  // Quantum big bang
  | "cosmos"     // Stars + particles fly
  | "crown"      // Leadership crown moment
  | "logo"       // Logo reveal
  | "message"    // Isabella lines
  | "done";

interface CinematicIntroProps {
  onComplete: () => void;
  skipEnabled?: boolean;
}

// ─── Isabella narrative ──────────────────────────────────────────────────────
const ISABELLA_LINES: { text: string; duration: number }[] = [
  { text: "PROTOCOLO DE INMERSIÓN ACTIVADO...", duration: 3000 },
  { text: "TAMV ONLINE · ORGULLOSAMENTE LATINOAMERICANOS.", duration: 4500 },
  { text: "PROYECTO DEDICADO A REINA TREJO SERRANO.", duration: 4000 },
  { text: "SONRÍE: TU OVEJA NEGRA LO LOGRÓ. TE QUIERO, MA'.", duration: 5000 },
];

// ─── Color palette ───────────────────────────────────────────────────────────
const C = {
  gold: "#FFD700",
  cyan: "#00D9FF",
  purple: "#9D4EDD",
  white: "#FFFFFF",
  magenta: "#FF2D78",
};

// ============================================================================
// 3-D: Camera rig with parallax and shake
// ============================================================================
function useCinematicCamera(phase: Phase) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ mouse, clock, camera }) => {
    const t = clock.elapsedTime;

    const targetX = THREE.MathUtils.lerp(-0.4, 0.4, (mouse.x + 1) / 2);
    const targetY = THREE.MathUtils.lerp(-0.25, 0.25, (mouse.y + 1) / 2);

    // Parallax suave
    camera.position.x += (targetX - camera.position.x) * 0.06;
    camera.position.y += (targetY - camera.position.y) * 0.06;

    // Shake ligero en explosión
    if (phase === "explosion") {
      const shake = 0.08;
      camera.position.x += (Math.random() - 0.5) * shake;
      camera.position.y += (Math.random() - 0.5) * shake;
    }

    camera.lookAt(0, 0, 0);

    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.1) * 0.1;
      group.current.rotation.x = Math.cos(t * 0.08) * 0.08;
    }
  });

  return group;
}

// ============================================================================
// 3-D: Nebula fog and light halo
// ============================================================================
function NebulaFog({ phase }: { phase: Phase }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    const t = clock.elapsedTime;
    const intensity =
      phase === "cosmos" || phase === "crown" || phase === "logo" ? 0.35 : 0.14;
    matRef.current.opacity = intensity + Math.sin(t * 0.3) * 0.05;
  });

  return (
    <group>
      {[26, 34, 42].map((r, idx) => (
        <mesh key={idx}>
          <sphereGeometry args={[r, 48, 48]} />
          <meshStandardMaterial
            ref={idx === 0 ? matRef : undefined}
            transparent
            depthWrite={false}
            side={THREE.BackSide}
            color={idx === 0 ? C.purple : idx === 1 ? C.cyan : C.magenta}
            opacity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function LightHalo() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0, -4]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial
          transparent
          depthWrite={false}
          opacity={0.22}
          color={C.gold}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// 3-D: Quantum Particle Field (better, denser, more alive)
// ============================================================================
function QuantumField({ phase }: { phase: Phase }) {
  const ref = useRef<THREE.Points>(null);
  const COUNT = 20000;
  const positions = useRef(new Float32Array(COUNT * 3));
  const velocities = useRef(new Float32Array(COUNT * 3));

  useEffect(() => {
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.4 + Math.random() * 5.0;

      positions.current[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions.current[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions.current[i3 + 2] = r * Math.cos(phi);

      const spd = 0.02 + Math.random() * 0.06;
      velocities.current[i3] = (Math.random() - 0.5) * spd;
      velocities.current[i3 + 1] = (Math.random() - 0.5) * spd;
      velocities.current[i3 + 2] = (Math.random() - 0.5) * spd;
    }
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const geom = ref.current.geometry;
    const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    const flying =
      phase === "explosion" ||
      phase === "cosmos" ||
      phase === "crown" ||
      phase === "logo" ||
      phase === "message";

    const baseSpeed = flying ? 0.4 : 0.02;
    const swirl = flying ? 0.45 : 0.15;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;

      arr[i3] += velocities.current[i3] * baseSpeed;
      arr[i3 + 1] += velocities.current[i3 + 1] * baseSpeed;
      arr[i3 + 2] += velocities.current[i3 + 2] * baseSpeed;

      const dx = arr[i3];
      const dy = arr[i3 + 1];
      const dz = arr[i3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.0001;
      const attract = flying ? -0.0008 : -0.0002;

      arr[i3] += (dx / dist) * attract * swirl;
      arr[i3 + 1] += (dy / dist) * attract * swirl;
      arr[i3 + 2] += (dz / dist) * attract * swirl;

      if (dist > 55) {
        arr[i3] *= 0.4;
        arr[i3 + 1] *= 0.4;
        arr[i3 + 2] *= 0.4;
      }
    }

    posAttr.needsUpdate = true;

    ref.current.rotation.y = t * 0.16;
    ref.current.rotation.x = Math.sin(t * 0.3) * 0.25;
  });

  const visible = phase !== "permission";

  return visible ? (
    <Points
      ref={ref}
      positions={positions.current}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        vertexColors={false}
        color="#ffffff"
        size={phase === "explosion" ? 0.06 : 0.035}
        sizeAttenuation
        depthWrite={false}
        opacity={0.95}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  ) : null;
}

// ============================================================================
// 3-D: Sacred Geometry — Power Core
// ============================================================================
function PowerCore({ phase }: { phase: Phase }) {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!outer.current || !inner.current) return;

    const target =
      phase === "awakening"
        ? 0.8
        : phase === "ignition"
        ? 1.6
        : phase === "explosion"
        ? 8
        : 0;

    const cur = outer.current.scale.x || 0.001;
    const ns = cur + (target - cur) * 0.08;
    outer.current.scale.set(ns, ns, ns);
    inner.current.scale.set(ns * 0.6, ns * 0.6, ns * 0.6);

    outer.current.rotation.y = t * 0.9;
    outer.current.rotation.x = t * 0.55;
    inner.current.rotation.y = -t * 1.4;
    inner.current.rotation.z = t * 0.9;

    if (ring1.current) {
      ring1.current.rotation.z = t * 1.4;
      ring1.current.position.y = Math.sin(t * 0.8) * 0.25;
    }
    if (ring2.current) {
      ring2.current.rotation.z = -t * 1.0;
      ring2.current.position.y = Math.cos(t * 0.6) * 0.25;
    }

    const pulse = 1.5 + Math.sin(t * 3) * 0.6;
    (outer.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      phase === "ignition" || phase === "explosion" ? pulse * 1.6 : 1.2;
    (inner.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      phase === "ignition" || phase === "explosion" ? pulse * 2 : 1.4;
  });

  if (
    phase === "permission" ||
    phase === "cosmos" ||
    phase === "crown" ||
    phase === "logo" ||
    phase === "message" ||
    phase === "done"
  )
    return null;

  return (
    <Float speed={2} rotationIntensity={0.7} floatIntensity={0.9}>
      <mesh ref={outer}>
        <icosahedronGeometry args={[1, 4]} />
        <meshStandardMaterial
          color={C.gold}
          emissive={new THREE.Color(C.gold)}
          emissiveIntensity={2.2}
          wireframe
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh ref={inner}>
        <octahedronGeometry args={[0.9, 2]} />
        <meshStandardMaterial
          color={C.cyan}
          emissive={new THREE.Color(C.cyan)}
          emissiveIntensity={2.8}
          wireframe
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh ref={ring1}>
        <torusGeometry args={[1.7, 0.03, 16, 120]} />
        <meshBasicMaterial color={C.purple} transparent opacity={0.9} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[2.2, 0.02, 16, 120]} />
        <meshBasicMaterial color={C.magenta} transparent opacity={0.7} />
      </mesh>
    </Float>
  );
}

// ============================================================================
// 3-D: Shockwave rings
// ============================================================================
function ShockwaveRings({ phase }: { phase: Phase }) {
  const refs = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
  ];
  const offsets = [0, 0.45, 0.9];

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    refs.forEach((ref, i) => {
      if (!ref.current) return;
      const active = phase === "explosion" || phase === "cosmos";
      const pulse = active ? 1 + Math.sin(t * 2.8 + offsets[i] * 4) * 0.25 : 0;
      const s = active ? (1.5 + i * 1.8) * pulse : 0;
      ref.current.scale.set(s, s, s);
      // @ts-expect-error runtime opacity access
      ref.current.material.opacity = active ? 0.18 - i * 0.04 : 0;
    });
  });

  if (phase !== "explosion" && phase !== "cosmos") return null;

  return (
    <>
      {refs.map((ref, i) => (
        <mesh key={i} ref={ref}>
          <ringGeometry args={[1.2, 1.38, 80]} />
          <meshBasicMaterial
            color={i === 0 ? C.gold : i === 1 ? C.cyan : C.purple}
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
}

// ============================================================================
// 3-D: Crown of Leadership
// ============================================================================
function LeadershipCrown({ phase }: { phase: Phase }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const visible =
      phase === "crown" || phase === "logo" || phase === "message";
    const targetY = visible ? 2.5 : 5;
    group.current.position.y += (targetY - group.current.position.y) * 0.07;
    group.current.rotation.y = t * 0.5;

    const s = visible ? 1 : 0;
    group.current.scale.x += (s - group.current.scale.x) * 0.08;
    group.current.scale.y += (s - group.current.scale.y) * 0.08;
    group.current.scale.z += (s - group.current.scale.z) * 0.08;
  });

  const SPIKE_ANGLES = [0, 60, 120, 180, 240, 300].map(
    (d) => (d * Math.PI) / 180
  );

  return (
    <group ref={group} position={[0, 5, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.1, 0.09, 16, 80]} />
        <meshStandardMaterial
          color={C.gold}
          emissive={C.gold}
          emissiveIntensity={4}
        />
      </mesh>
      {SPIKE_ANGLES.map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(angle) * 1.1,
            0.3 + (i % 2 === 0 ? 0.55 : 0.2),
            Math.sin(angle) * 1.1,
          ]}
        >
          <coneGeometry args={[0.08, i % 2 === 0 ? 0.9 : 0.5, 8]} />
          <meshStandardMaterial
            color={C.gold}
            emissive={C.gold}
            emissiveIntensity={3.5}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.3, 0]}>
        <octahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial
          color={C.cyan}
          emissive={C.cyan}
          emissiveIntensity={5}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// 3-D: Magic rune circles
// ============================================================================
function MagicRunes({ phase }: { phase: Phase }) {
  const g1 = useRef<THREE.Mesh>(null);
  const g2 = useRef<THREE.Mesh>(null);
  const g3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const visible =
      phase === "ignition" ||
      phase === "explosion" ||
      phase === "cosmos" ||
      phase === "crown" ||
      phase === "logo";

    [g1, g2, g3].forEach((ref, i) => {
      if (!ref.current) return;
      const s = visible ? 1 : 0;
      ref.current.scale.x += (s - ref.current.scale.x) * 0.07;
      ref.current.scale.y += (s - ref.current.scale.y) * 0.07;
      ref.current.scale.z += (s - ref.current.scale.z) * 0.07;
      ref.current.rotation.z = t * (0.4 + i * 0.25) * (i % 2 === 0 ? 1 : -1);
      ref.current.rotation.x = Math.sin(t * 0.3 + i) * 0.35;
      ref.current.position.y = -1.2 + Math.sin(t * 0.5 + i) * 0.15;
    });
  });

  return (
    <>
      <mesh ref={g1}>
        <torusGeometry args={[2.6, 0.02, 18, 220]} />
        <meshBasicMaterial color={C.gold} transparent opacity={0.5} />
      </mesh>
      <mesh ref={g2}>
        <torusGeometry args={[3.4, 0.018, 18, 220]} />
        <meshBasicMaterial color={C.purple} transparent opacity={0.4} />
      </mesh>
      <mesh ref={g3}>
        <torusGeometry args={[4.1, 0.016, 18, 220]} />
        <meshBasicMaterial color={C.cyan} transparent opacity={0.35} />
      </mesh>
    </>
  );
}

// ============================================================================
// 3-D Scene root
// ============================================================================
function CinematicScene({ phase }: { phase: Phase }) {
  const camRig = useCinematicCamera(phase);

  return (
    <group ref={camRig}>
      <ambientLight intensity={0.25} color="#0b1020" />
      <spotLight
        position={[0, 6, 5]}
        intensity={2.8}
        angle={0.6}
        penumbra={0.6}
        color={C.gold}
      />
      <pointLight position={[6, -4, 4]} intensity={2.3} color={C.cyan} />
      <pointLight position={[-8, 6, -6]} intensity={1.7} color={C.purple} />

      <NebulaFog phase={phase} />
      <Stars
        radius={200}
        depth={120}
        count={16000}
        factor={4.5}
        saturation={0.4}
        fade
        speed={phase === "cosmos" || phase === "crown" ? 3 : 1}
      />
      <LightHalo />
      <QuantumField phase={phase} />
      <PowerCore phase={phase} />
      <ShockwaveRings phase={phase} />
      <LeadershipCrown phase={phase} />
      <MagicRunes phase={phase} />
    </group>
  );
}

// ============================================================================
// PERMISSION SCREEN — the gate
// ============================================================================
function PermissionGate({ onAccept }: { onAccept: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPulse((p) => p + 1), 50);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
    >
      {/* Breathing ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 50% 50%, rgba(157,78,221,0.04) 0%, transparent 65%)",
            "radial-gradient(circle at 50% 50%, rgba(0,217,255,0.07) 0%, transparent 65%)",
            "radial-gradient(circle at 50% 50%, rgba(255,215,0,0.05) 0%, transparent 65%)",
            "radial-gradient(circle at 50% 50%, rgba(157,78,221,0.04) 0%, transparent 65%)",
          ],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Tiny star field */}
      {[...Array(80)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 2 + 0.5,
            height: Math.random() * 2 + 0.5,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ opacity: [0.05, 0.6, 0.05] }}
          transition={{
            duration: 2 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Corner brackets — HUD frame */}
      {["tl", "tr", "bl", "br"].map((pos) => (
        <div
          key={pos}
          className="absolute w-12 h-12 pointer-events-none"
          style={{
            top: pos.startsWith("t") ? 24 : "auto",
            bottom: pos.startsWith("b") ? 24 : "auto",
            left: pos.endsWith("l") ? 24 : "auto",
            right: pos.endsWith("r") ? 24 : "auto",
            borderTop: pos.startsWith("t")
              ? "1px solid rgba(0,217,255,0.4)"
              : "none",
            borderBottom: pos.startsWith("b")
              ? "1px solid rgba(0,217,255,0.4)"
              : "none",
            borderLeft: pos.endsWith("l")
              ? "1px solid rgba(0,217,255,0.4)"
              : "none",
            borderRight: pos.endsWith("r")
              ? "1px solid rgba(0,217,255,0.4)"
              : "none",
          }}
        />
      ))}

      {/* Top label */}
      <motion.div
        className="absolute top-8 text-[0.65rem] tracking-[0.5em] uppercase text-white/20 text-center"
        initial({ opacity: 0 })}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        TAMV MD-X4™ · PROTOCOL GENESIS · v5.0
      </motion.div>

      {/* TAMV wordmark */}
      <motion.div
        className="relative z-10 flex flex-col items-center mb-16"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
      >
        <motion.div
          className="w-20 h-20 rounded-2xl overflow-hidden mb-6"
          style={{
            boxShadow: hovered
              ? "0 0 60px rgba(255,215,0,0.5), 0 0 120px rgba(0,217,255,0.3)"
              : "0 0 30px rgba(0,217,255,0.25)",
          }}
        >
          <img src={logoImg} alt="TAMV" className="w-full h-full object-cover" />
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-black tracking-[0.4em] text-center"
          style={{
            background:
              "linear-gradient(135deg, #FFD700 0%, #00D9FF 45%, #9D4EDD 80%, #FFD700 100%)",
            backgroundSize: "300% 300%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          TAMV
        </motion.h1>

        <motion.p
          className="mt-3 text-[0.7rem] md:text-xs tracking-[0.6em] uppercase text-white/35 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          ECOSISTEMA CIVILIZATORIO LATINOAMERICANO
        </motion.p>
      </motion.div>

      {/* THE BUTTON */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
      >
        {/* Hint text */}
        <motion.p
          className="text-xs tracking-[0.4em] uppercase text-white/30 text-center"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          Para iniciar la experiencia de inmersión
        </motion.p>

        {/* Main CTA button */}
        <motion.button
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={onAccept}
          className="relative group cursor-pointer select-none"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
        >
          {/* Outer glow ring */}
          <motion.div
            className="absolute -inset-3 rounded-full pointer-events-none"
            animate={{
              boxShadow: [
                "0 0 0px 0px rgba(255,215,0,0)",
                "0 0 40px 8px rgba(255,215,0,0.35)",
                "0 0 0px 0px rgba(255,215,0,0)",
              ],
            }}
            transition={{ duration: 2.2, repeat: Infinity }}
          />

          {/* Button body */}
          <div
            className="relative px-10 py-5 rounded-full text-sm md:text-base font-bold tracking-[0.3em] uppercase overflow-hidden"
            style={{
              background: hovered
                ? "linear-gradient(135deg, rgba(255,215,0,0.18) 0%, rgba(0,217,255,0.18) 50%, rgba(157,78,221,0.18) 100%)"
                : "rgba(255,255,255,0.04)",
              border: "1px solid",
              borderColor: hovered
                ? "rgba(255,215,0,0.8)"
                : "rgba(255,215,0,0.4)",
              color: hovered ? "#FFD700" : "rgba(255,255,255,0.7)",
              backdropFilter: "blur(20px)",
              boxShadow: hovered
                ? "0 0 50px rgba(255,215,0,0.4), inset 0 0 30px rgba(255,215,0,0.1)"
                : "0 0 20px rgba(255,215,0,0.1)",
              transition: "all 0.3s ease",
            }}
          >
            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
            <span className="relative z-10 flex items-center gap-3">
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="text-lg"
              >
                ✦
              </motion.span>
              ACEPTAR PERMISOS DE INMERSIÓN
              <motion.span
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="text-lg"
              >
                ✦
              </motion.span>
            </span>
          </div>
        </motion.button>

        {/* Sub hint */}
        <motion.p
          className="text-[0.6rem] tracking-[0.35em] uppercase text-white/18 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          Experiencia inmersiva · Audio activado · 3D Habilitado
        </motion.p>
      </motion.div>

      {/* Bottom credits */}
      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-1 text-[0.6rem] tracking-[0.4em] uppercase text-white/15"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span>MSR · THE SOF · UTAMV · LATAM NODE</span>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export function CinematicIntro({
  onComplete,
  skipEnabled = true,
}: CinematicIntroProps) {
  const [phase, setPhase] = useState<Phase>("permission");
  const [accepted, setAccepted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const intervalRef = useRef<number | null>(null);

  const totalDuration =
    ISABELLA_LINES.reduce((s, l) => s + l.duration, 0) + 11000;

  const clearAll = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const initAudio = useCallback(async () => {
    try {
      const audio = new Audio(introAudio);
      audio.volume = 0.9;
      audioRef.current = audio;
      await audio.play();
    } catch {
      // autoplay blocked — silent fail
    }
  }, []);

  const handleAccept = useCallback(() => {
    setAccepted(true);
    initAudio();

    const push = (fn: () => void, delay: number) => {
      timeoutsRef.current.push(window.setTimeout(fn, delay));
    };

    // Phase timeline
    push(() => setPhase("awakening"), 200);
    push(() => setPhase("ignition"), 2200);
    push(() => setPhase("explosion"), 4800);
    push(() => setPhase("cosmos"), 7200);
    push(() => setPhase("crown"), 9500);
    push(() => setPhase("logo"), 11800);
    push(() => setPhase("message"), 14000);

    // Isabella narrative
    let lineDelay = 14000;
    ISABELLA_LINES.forEach((line, idx) => {
      push(() => {
        setCurrentLineIndex(idx);
        setDisplayedLines((prev) => [...prev, line.text]);
      }, lineDelay);
      lineDelay += line.duration;
    });

    // Progress bar
    intervalRef.current = window.setInterval(() => {
      setProgress((p) => Math.min(p + 100 / (totalDuration / 50), 100));
    }, 50);

    // Completion
    push(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100);
      audioRef.current?.pause();
      window.setTimeout(onComplete, 1000);
    }, totalDuration);
  }, [initAudio, onComplete, totalDuration]);

  const handleSkip = useCallback(() => {
    clearAll();
    audioRef.current?.pause();
    onComplete();
  }, [clearAll, onComplete]);

  useEffect(
    () => () => {
      clearAll();
      audioRef.current?.pause();
    },
    [clearAll]
  );

  if (!accepted) {
    return (
      <AnimatePresence>
        <PermissionGate onAccept={handleAccept} />
      </AnimatePresence>
    );
  }

  const bgGlow = (() => {
    if (phase === "awakening") return "rgba(157,78,221,0.15)";
    if (phase === "ignition") return "rgba(255,215,0,0.20)";
    if (phase === "explosion") return "rgba(0,217,255,0.55)";
    if (phase === "cosmos") return "rgba(157,78,221,0.30)";
    if (phase === "crown") return "rgba(255,215,0,0.35)";
    return "rgba(0,217,255,0.18)";
  })();

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden">
      {/* 3D canvas */}
      <Canvas camera={{ position: [0, 0, 9], fov: 70 }} className="absolute inset-0">
        <CinematicScene phase={phase} />
      </Canvas>

      {/* Chromatic radial glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        animate={{
          background: `radial-gradient(circle at 50% 50%, ${bgGlow} 0%, transparent 60%)`,
        }}
        transition={{ duration: 1.2 }}
      />

      {/* Secondary color wash */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(circle at 20% 0%, rgba(255,215,0,0.12) 0%, transparent 40%), " +
            "radial-gradient(circle at 80% 100%, rgba(157,78,221,0.15) 0%, transparent 38%)",
          mixBlendMode: "screen",
        }}
      />

      {/* CRT scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.03) 1px, transparent 3px)",
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.18]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
          mixBlendMode: "soft-light",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.85) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* HUD frame */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-[18px] border border-white/[0.06] rounded-[22px] shadow-[0_0_0_1px_rgba(255,215,0,0.12)]" />
        <div className="absolute inset-x-[26px] top-[26px] flex justify-between text-[0.65rem] tracking-[0.4em] uppercase text-white/20 px-2">
          <span>TAMV MD-X4™ · GENESIS PROTOCOL</span>
          <span>IMMERSION · ACTIVE</span>
        </div>
        <div className="absolute inset-x-[26px] bottom-[26px] flex justify-between text-[0.6rem] tracking-[0.4em] uppercase text-white/20 px-2">
          <span>LATAM NODE</span>
          <span>MSR · THE SOF · UTAMV</span>
        </div>
      </div>

      {/* AWAKENING */}
      <AnimatePresence>
        {phase === "awakening" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.p
              className="text-[0.8rem] md:text-sm tracking-[1em] uppercase font-mono"
              style={{
                color: "rgba(157,78,221,0.9)",
                textShadow: "0 0 40px rgba(157,78,221,0.8)",
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.98, 1.02, 0.98],
              }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              INICIALIZANDO...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* IGNITION */}
      <AnimatePresence>
        {phase === "ignition" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.p
              className="text-lg md:text-2xl tracking-[0.6em] uppercase font-black text-center"
              style={{
                background: "linear-gradient(90deg, #FFD700, #00D9FF, #FFD700)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              PODER · LIDERAZGO · MAGIA
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EXPLOSION */}
      <AnimatePresence>
        {phase === "explosion" && (
          <motion.div
            className="absolute inset-0 z-30 pointer-events-none"
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8 }}
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(0,217,255,0.5) 35%, transparent 65%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* CROWN */}
      <AnimatePresence>
        {phase === "crown" && (
          <motion.div
            className="absolute inset-0 flex items-end justify-center pb-56 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center">
              <motion.p
                className="text-2xl md:text-4xl font-black tracking-[0.5em] uppercase"
                style={{
                  background:
                    "linear-gradient(135deg, #FFD700 0%, #FFFFFF 50%, #FFD700 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 60px rgba(255,215,0,0.5)",
                }}
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ERES LÍDER
              </motion.p>
              <motion.p
                className="mt-3 text-[0.75rem] tracking-[0.6em] uppercase text-white/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                El mundo te espera
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGO / MESSAGE */}
      <AnimatePresence>
        {(phase === "logo" || phase === "message") && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <motion.div
              className="relative mb-8"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            >
              <div
                className="absolute -inset-4 rounded-full"
                style={{
                  border: "1px solid rgba(255,215,0,0.4)",
                  boxShadow:
                    "0 0 30px rgba(255,215,0,0.3), 0 0 60px rgba(0,217,255,0.2)",
                }}
              />
              <div
                className="absolute -inset-8 rounded-full"
                style={{ border: "1px solid rgba(0,217,255,0.25)" }}
              />
              <motion.div
                className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-2"
                style={{
                  borderColor: "rgba(255,215,0,0.8)",
                  boxShadow:
                    "0 0 40px rgba(255,215,0,0.6), 0 0 90px rgba(0,217,255,0.4), 0 0 160px rgba(157,78,221,0.3)",
                }}
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              >
                <img src={logoImg} alt="TAMV" className="w-full h-full object-cover" />
                <div className="absolute inset-0 pointer-events-none mix-blend-overlay bg-[radial-gradient(circle_at_30%_0%,rgba(255,255,255,0.25)_0%,transparent_40%)]" />
              </motion.div>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-8xl font-black tracking-[0.45em] md:tracking-[0.55em] mb-4 text-center"
              style={{
                background:
                  "linear-gradient(135deg, #FFD700 0%, #00D9FF 35%, #9D4EDD 65%, #FFFFFF 100%)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 30px rgba(255,215,0,0.5))",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              initial={{ y: 40, opacity: 0 }}
            >
              TAMV MD-X4™
            </motion.h1>

            <motion.p
              className="text-xs md:text-sm tracking-[0.7em] uppercase text-white/45 text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1.2 }}
            >
              ECOSISTEMA CIVILIZATORIO LATINOAMERICANO · NEXT-GEN
            </motion.p>

            <motion.div
              className="mt-5 flex flex-col items-center gap-2 text-[0.7rem] md:text-xs text-white/30 tracking-[0.38em] uppercase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.9 }}
            >
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                <span>PODER · LIDERAZGO · MAGIA</span>
                <span className="h-px w-10 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
              </div>
              <span className="text-[0.6rem] tracking-[0.45em] text-white/20">
                LATAM · MSR · THE SOF · UTAMV · ORGULLOSAMENTE LATINOAMERICANOS
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ISABELLA LINES */}
      <div className="absolute bottom-28 left-0 right-0 z-30 px-8">
        <AnimatePresence>
          {displayedLines.length > 0 && (
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {displayedLines.map((line, i) => (
                <motion.p
                  key={i}
                  className={`text-sm md:text-lg font-mono mb-2 md:mb-3 ${
                    i === currentLineIndex
                      ? "text-yellow-300"
                      : "text-white/25"
                  }`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  style={
                    i === currentLineIndex
                      ? {
                          textShadow:
                            "0 0 28px rgba(255,215,0,0.8), 0 0 56px rgba(255,215,0,0.45)",
                          letterSpacing: "0.32em",
                        }
                      : { letterSpacing: "0.22em" }
                  }
                >
                  {line}
                </motion.p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PROGRESS BAR */}
      <div className="absolute bottom-10 left-10 right-10 z-30">
        <div
          className="h-[3px] rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, #FFD700 0%, #00D9FF 40%, #9D4EDD 75%, #FFFFFF 100%)",
              boxShadow:
                "0 0 16px rgba(255,215,0,0.7), 0 0 32px rgba(0,217,255,0.4)",
            }}
          />
        </div>
      </div>

      {/* SKIP BUTTON */}
      {skipEnabled && (
        <motion.button
          className="absolute top-6 right-6 z-50 px-5 py-2.5 rounded-full text-[0.72rem] font-semibold border transition-all"
          style={{
            borderColor: "rgba(255,215,0,0.4)",
            color: "rgba(255,235,180,0.8)",
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(16px)",
          }}
          onClick={handleSkip}
          whileHover={{
            scale: 1.08,
            borderColor: "rgba(255,215,0,0.9)",
            boxShadow: "0 0 28px rgba(255,215,0,0.6)",
          }}
          whileTap={{ scale: 0.94 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          SKIP →
        </motion.button>
      )}
    </div>
  );
}

export default CinematicIntro;
