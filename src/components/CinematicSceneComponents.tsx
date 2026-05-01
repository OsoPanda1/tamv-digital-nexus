// ============================================================================
// CINEMATIC SCENE COMPONENTS
// 3D Components for the Cinematic Intro
// Extracted from CinematicIntro for reusability
// ============================================================================

import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

const C = {
  gold: "#FFD700",
  cyan: "#00D9FF",
  purple: "#9D4EDD",
  white: "#FFFFFF",
  magenta: "#FF2D78",
};

// ============================================================================
// NEBULA FOG
// ============================================================================

export function NebulaFog({ phase }: { phase: string }) {
  const matRef = React.useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    const t = clock.elapsedTime;
    const active =
      phase === "expansion" || phase === "crown" || phase === "logo" || phase === "message";
    const base = active ? 0.35 : 0.12;
    matRef.current.opacity = base + Math.sin(t * 0.3) * 0.05;
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
            color={
              idx === 0 ? C.purple : idx === 1 ? C.cyan : C.magenta
            }
            opacity={0.18}
          />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================================
// LIGHT HALO
// ============================================================================

export function LightHalo() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0, -4]}>
        <planeGeometry args={[11, 11]} />
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
// QUANTUM FIELD
// ============================================================================

export function QuantumField({ phase }: { phase: string }) {
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
      phase === "crisis" ||
      phase === "expansion" ||
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
        size={phase === "crisis" ? 0.06 : 0.035}
        sizeAttenuation
        depthWrite={false}
        opacity={0.95}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  ) : null;
}

// ============================================================================
// POWER CORE
// ============================================================================

export function PowerCore({ phase }: { phase: string }) {
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
        : phase === "crisis"
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
      phase === "ignition" || phase === "crisis" ? pulse * 1.6 : 1.2;
    (inner.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      phase === "ignition" || phase === "crisis" ? pulse * 2 : 1.4;
  });

  if (
    phase === "permission" ||
    phase === "expansion" ||
    phase === "crown" ||
    phase === "logo" ||
    phase === "message" ||
    phase === "complete"
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
// SHOCKWAVE RINGS
// ============================================================================

export function ShockwaveRings({ phase }: { phase: string }) {
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
      const active = phase === "crisis" || phase === "expansion";
      const pulse = active
        ? 1 + Math.sin(t * 2.8 + offsets[i] * 4) * 0.25
        : 0;
      const s = active ? (1.5 + i * 1.8) * pulse : 0;
      ref.current.scale.set(s, s, s);
      // @ts-expect-error -- r3f material typing is broader than runtime mesh material with opacity
      ref.current.material.opacity = active ? 0.18 - i * 0.04 : 0;
    });
  });

  if (phase !== "crisis" && phase !== "expansion") return null;

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
// LEADERSHIP CROWN
// ============================================================================

export function LeadershipCrown({ phase }: { phase: string }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const visible =
      phase === "crown" || phase === "logo" || phase === "message";
    const targetY = visible ? 2.8 : 5.5;
    group.current.position.y += (targetY - group.current.position.y) * 0.08;
    group.current.rotation.y = t * 0.5;

    const s = visible ? 1 : 0;
    group.current.scale.x += (s - group.current.scale.x) * 0.1;
    group.current.scale.y += (s - group.current.scale.y) * 0.1;
    group.current.scale.z += (s - group.current.scale.z) * 0.1;
  });

  const SPIKE_ANGLES = [0, 60, 120, 180, 240, 300].map(
    (d) => (d * Math.PI) / 180
  );

  return (
    <group ref={group} position={[0, 2.8, 0.5]}>
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
      <mesh position={[0, 0.45, 0]}>
        <octahedronGeometry args={[0.3, 0]} />
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
// MAGIC RUNES
// ============================================================================

export function MagicRunes({ phase }: { phase: string }) {
  const g1 = useRef<THREE.Mesh>(null);
  const g2 = useRef<THREE.Mesh>(null);
  const g3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const visible =
      phase === "ignition" ||
      phase === "crisis" ||
      phase === "expansion" ||
      phase === "crown" ||
      phase === "logo";

    [g1, g2, g3].forEach((ref, i) => {
      if (!ref.current) return;
      const s = visible ? 1 : 0;
      ref.current.scale.x += (s - ref.current.scale.x) * 0.07;
      ref.current.scale.y += (s - ref.current.scale.y) * 0.07;
      ref.current.scale.z += (s - ref.current.scale.z) * 0.07;
      ref.current.rotation.z =
        t * (0.4 + i * 0.25) * (i % 2 === 0 ? 1 : -1);
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
// GLOWING ORBS
// ============================================================================

export function GlowingOrbs({ phase }: { phase: string }) {
  const orbs = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!orbs.current) return;
    const t = state.clock.elapsedTime;
    const visible =
      phase === "expansion" ||
      phase === "crown" ||
      phase === "logo" ||
      phase === "message";

    orbs.current.children.forEach((orb: any, i) => {
      const speed = 0.3 + i * 0.1;
      const radius = 3 + i * 1.2;
      orb.position.x = Math.cos(t * speed + i) * radius;
      orb.position.y = Math.sin(t * speed * 0.7 + i) * radius * 0.5;
      orb.position.z = Math.sin(t * speed + i) * radius * 0.3;

      const targetScale = visible ? 1 : 0;
      orb.scale.x += (targetScale - orb.scale.x) * 0.05;
      orb.scale.y += (targetScale - orb.scale.y) * 0.05;
      orb.scale.z += (targetScale - orb.scale.z) * 0.05;
    });
  });

  return (
    <group ref={orbs}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.08 + i * 0.02, 16, 16]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? C.gold : C.cyan}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================================
// PARTICLE TRAILS
// ============================================================================

export function ParticleTrails({ phase }: { phase: string }) {
  const trailRef = useRef<THREE.Points>(null);
  const trailCount = 150;
  const positions = useRef(new Float32Array(trailCount * 3));

  useEffect(() => {
    for (let i = 0; i < trailCount; i++) {
      const i3 = i * 3;
      positions.current[i3] = (Math.random() - 0.5) * 10;
      positions.current[i3 + 1] = (Math.random() - 0.5) * 10;
      positions.current[i3 + 2] = (Math.random() - 0.5) * 5;
    }
  }, []);

  useFrame((state) => {
    if (!trailRef.current) return;
    const t = state.clock.elapsedTime;
    const visible =
      phase === "ignition" ||
      phase === "crisis" ||
      phase === "expansion";

    const arr =
      trailRef.current.geometry.attributes.position
        .array as Float32Array;
    for (let i = 0; i < trailCount; i++) {
      const i3 = i * 3;
      arr[i3] += Math.sin(t + i) * 0.01;
      arr[i3 + 1] += Math.cos(t + i * 0.5) * 0.01;
      arr[i3 + 2] += 0.02;

      if (arr[i3 + 2] > 5) {
        arr[i3 + 2] = -5;
      }
    }
    trailRef.current.geometry.attributes.position.needsUpdate = true;
    // @ts-expect-error -- points material exposes opacity at runtime although TS union omits it
    trailRef.current.material.opacity = visible ? 0.6 : 0;
  });

  return (
    <points ref={trailRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={trailCount}
          array={positions.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={C.cyan}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export { C };
export default {
  NebulaFog,
  LightHalo,
  QuantumField,
  PowerCore,
  ShockwaveRings,
  LeadershipCrown,
  MagicRunes,
  GlowingOrbs,
  ParticleTrails,
};
