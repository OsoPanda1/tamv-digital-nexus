import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Float, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import introAudio from "@/assets/intro.mp3";
import logoImg from "@/assets/LOGOTAMV2.jpg";

// =======================================================
// TIPOS Y CONSTANTES
// =======================================================

type Phase =
  | "permission"
  | "awakening"
  | "ignition"
  | "explosion"
  | "cosmos"
  | "crown"
  | "logo"
  | "message"
  | "done";

interface MainCinematicIntroProps {
  onComplete: () => void;
  skipEnabled?: boolean;
}

const ISABELLA_LINES: { text: string; duration: number }[] = [
  { text: "PROTOCOLO DE INMERSIÓN ACTIVADO...", duration: 3500 },
  {
    text: "TAMV ONLINE · ORGULLOSAMENTE LATINOAMERICANOS.",
    duration: 5000,
  },
  { text: "PROYECTO DEDICADO A REINA TREJO SERRANO.", duration: 4500 },
  {
    text: "SONRÍE: TU OVEJA NEGRA LO LOGRÓ. TE QUIERO, MA'.",
    duration: 5500,
  },
  { text: "BIENVENIDO AL ECOSISTEMA CIVILIZATORIO.", duration: 4000 },
];

const C = {
  gold: "#FFD700",
  cyan: "#00D9FF",
  purple: "#9D4EDD",
  white: "#FFFFFF",
  magenta: "#FF2D78",
};

// =======================================================
// CONTROLADOR DE CÁMARA CINEMÁTICO (SECUNDARIO)
// =======================================================

const CINEMATIC_CONFIG = {
  DEFAULT_DURATION: 3000,
  TRANSITION_SPEED: 0.03,
  SKIP_HOLD_DURATION: 500,
  DEFAULT_FOV: 75,
  CINEMATIC_FOV: 60,
  WIDE_FOV: 90,
  CLOSE_FOV: 45,
  ORBIT_RADIUS: 8,
  CLOSE_DISTANCE: 4,
  FAR_DISTANCE: 15,
};

const Easing = {
  linear: (t: number) => t,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  cinematicInOut: (t: number) =>
    t < 0.5
      ? 8 * t * t * t * t
      : 1 - Math.pow(-2 * t + 2, 4) / 2,
  easeOutQuad: (t: number) => t * (2 - t),
};

const CameraPathGenerators = {
  heroShot: (target: THREE.Vector3, options: any = {}) => {
    const { distance = 8 } = options;
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(
          target.x + distance * 0.7,
          target.y - 2,
          target.z + distance * 0.7
        ),
        new THREE.Vector3(
          target.x + distance * 0.8,
          target.y + 0.5,
          target.z + distance * 0.6
        ),
        new THREE.Vector3(
          target.x + distance * 0.5,
          target.y + 3,
          target.z + distance * 0.5
        ),
      ],
      false,
      "catmullrom",
      0.5
    );
  },
};

const CinematicPresets: Record<string, any> = {
  heroReveal: {
    name: "Hero Reveal",
    duration: 2500,
    pathGenerator: "heroShot",
    pathOptions: { distance: 8 },
    fovStart: CINEMATIC_CONFIG.CLOSE_FOV,
    fovEnd: CINEMATIC_CONFIG.CINEMATIC_FOV,
    easing: "easeInOutCubic",
    skippable: true,
    showSkipPrompt: true,
    lookAtTarget: true,
  },
};

function SkipPromptUI({
  visible,
  skipProgress,
  skipKey = "SPACE",
}: {
  visible: boolean;
  skipProgress: number;
  skipKey?: string;
}) {
  if (!visible) return null;
  return (
    <Html fullscreen>
      <div
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          fontFamily: "'Courier New', monospace",
          color: "#00ff88",
          textShadow: "0 0 10px #00ff88",
          pointerEvents: "none",
          opacity: 0.8,
        }}
      >
        <div
          style={{
            fontSize: "14px",
            marginBottom: "8px",
            letterSpacing: "2px",
          }}
        >
          HOLD [{skipKey}] TO SKIP
        </div>
        <div
          style={{
            width: "120px",
            height: "6px",
            border: "1px solid #00ff88",
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${skipProgress * 100}%`,
              height: "100%",
              background: "#00ff88",
              boxShadow: "0 0 10px #00ff88",
              transition: "width 0.05s linear",
            }}
          />
        </div>
      </div>
    </Html>
  );
}

function CinematicOverlayUI({
  visible,
  progress,
}: {
  visible: boolean;
  progress: number;
}) {
  if (!visible) return null;
  return (
    <Html fullscreen>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          background:
            "linear-gradient(to bottom, #000 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60px",
          background:
            "linear-gradient(to top, #000 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "200px",
            height: "2px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "1px",
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              background: "rgba(255,255,255,0.6)",
              borderRadius: "1px",
              transition: "width 0.1s linear",
            }}
          />
        </div>
      </div>
    </Html>
  );
}

function useCinematicController() {
  const [isActive, setIsActive] = useState(false);
  const [currentPreset, setCurrentPreset] = useState<any | null>(null);
  const [progress, setProgress] = useState(0);
  const [skipProgress, setSkipProgress] = useState(0);

  const cinematicRef = useRef<any>({
    active: false,
    startTime: 0,
    duration: 0,
    preset: null,
    path: null,
    targetPosition: new THREE.Vector3(),
    originalCameraPosition: new THREE.Vector3(),
    originalCameraFov: CINEMATIC_CONFIG.DEFAULT_FOV,
    onComplete: null,
    onSkip: null,
  });

  const skipRef = useRef({
    isHolding: false,
    holdStartTime: 0,
  });

  const startCinematic = useCallback(
    (presetNameOrConfig: string | any, target: any, callbacks: any = {}) => {
      const preset =
        typeof presetNameOrConfig === "string"
          ? CinematicPresets[presetNameOrConfig]
          : presetNameOrConfig;
      if (!preset) return false;

      const targetVec =
        target instanceof THREE.Vector3
          ? target
          : new THREE.Vector3(target.x, target.y, target.z);
      const pathGenerator =
        CameraPathGenerators[
          preset.pathGenerator as keyof typeof CameraPathGenerators
        ];
      if (!pathGenerator) return false;

      const path = pathGenerator(targetVec, preset.pathOptions);

      cinematicRef.current = {
        ...cinematicRef.current,
        active: true,
        startTime: Date.now(),
        duration: preset.duration,
        preset,
        path,
        targetPosition: targetVec.clone(),
        onComplete: callbacks.onComplete,
        onSkip: callbacks.onSkip,
      };

      setIsActive(true);
      setCurrentPreset(preset);
      setProgress(0);
      setSkipProgress(0);
      return true;
    },
    []
  );

  const stopCinematic = useCallback((wasSkipped = false) => {
    const ref = cinematicRef.current;
    if (ref.active) {
      ref.active = false;
      if (wasSkipped && ref.onSkip) ref.onSkip();
      else if (ref.onComplete) ref.onComplete();
    }
    setIsActive(false);
    setCurrentPreset(null);
    setProgress(0);
    setSkipProgress(0);
  }, []);

  const updateSkip = useCallback(
    (isKeyDown: boolean) => {
      const ref = cinematicRef.current;
      if (!ref.active || !ref.preset?.skippable) return;

      if (isKeyDown && !skipRef.current.isHolding) {
        skipRef.current.isHolding = true;
        skipRef.current.holdStartTime = Date.now();
      } else if (!isKeyDown) {
        skipRef.current.isHolding = false;
        skipRef.current.holdStartTime = 0;
        setSkipProgress(0);
      }

      if (skipRef.current.isHolding) {
        const holdDuration =
          Date.now() - skipRef.current.holdStartTime;
        const p = Math.min(
          holdDuration / CINEMATIC_CONFIG.SKIP_HOLD_DURATION,
          1
        );
        setSkipProgress(p);
        if (p >= 1) stopCinematic(true);
      }
    },
    [stopCinematic]
  );

  return {
    isActive,
    currentPreset,
    progress,
    skipProgress,
    cinematicRef,
    startCinematic,
    stopCinematic,
    updateSkip,
    setProgress,
  };
}

interface CinematicCameraControllerProps {
  target?: THREE.Vector3 | { x: number; y: number; z: number };
  enabled?: boolean;
  onCinematicStart?: (name: string) => void;
  onCinematicEnd?: () => void;
  onCinematicSkip?: () => void;
  showOverlay?: boolean;
  showSkipPrompt?: boolean;
  skipKey?: string;
  controlsDisabledCallback?: (disabled: boolean) => void;
}

export const CinematicCameraController = forwardRef(
  function CinematicCameraController(
    {
      target,
      enabled = true,
      onCinematicStart,
      onCinematicEnd,
      onCinematicSkip,
      showOverlay = true,
      showSkipPrompt = true,
      skipKey = "Space",
      controlsDisabledCallback,
    }: CinematicCameraControllerProps,
    ref
  ) {
    const { camera } = useThree();
    const controller = useCinematicController();
    const {
      isActive,
      currentPreset,
      progress,
      skipProgress,
      cinematicRef,
      startCinematic,
      stopCinematic,
      updateSkip,
      setProgress,
    } = controller;

    useEffect(() => {
      if (!enabled) return;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === skipKey) updateSkip(true);
      };
      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.code === skipKey) updateSkip(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }, [enabled, skipKey, updateSkip]);

    useEffect(() => {
      controlsDisabledCallback?.(isActive);
    }, [isActive, controlsDisabledCallback]);

    useImperativeHandle(ref, () => ({
      play: (
        presetName: string,
        targetOverride?: THREE.Vector3 | {
          x: number;
          y: number;
          z: number;
        },
        callbacks?: { onComplete?: () => void; onSkip?: () => void }
      ) => {
        const t = targetOverride || target;
        if (!t) return false;

        cinematicRef.current.originalCameraPosition.copy(
          camera.position
        );
        cinematicRef.current.originalCameraFov = camera.fov;

        const mergedCallbacks = {
          onComplete: () => {
            onCinematicEnd?.();
            callbacks?.onComplete?.();
          },
          onSkip: () => {
            onCinematicSkip?.();
            callbacks?.onSkip?.();
          },
        };

        const success = startCinematic(presetName, t, mergedCallbacks);
        if (success)
          onCinematicStart?.(
            CinematicPresets[presetName]?.name || presetName
          );
        return success;
      },
      stop: () => stopCinematic(false),
      skip: () => stopCinematic(true),
      isPlaying: () => isActive,
      getProgress: () => progress,
      getCurrentPreset: () => currentPreset,
      getPresetNames: () => Object.keys(CinematicPresets),
      createCustomPreset: (name: string, config: any) => {
        CinematicPresets[name] = config;
      },
    }));

    useFrame(() => {
      const refState = cinematicRef.current;
      if (!refState.active || !refState.path || !refState.preset) return;

      const elapsed = Date.now() - refState.startTime;
      const rawProgress = Math.min(
        elapsed / refState.duration,
        1
      );
      const easingFn =
        Easing[
          refState.preset.easing as keyof typeof Easing
        ] || Easing.linear;
      const easedProgress = easingFn(rawProgress);

      setProgress(rawProgress);
      const pathPoint = refState.path.getPointAt(
        Math.min(easedProgress, 0.999)
      );
      camera.position.lerp(
        pathPoint,
        CINEMATIC_CONFIG.TRANSITION_SPEED * 2
      );

      if (refState.preset.lookAtTarget) {
        camera.lookAt(refState.targetPosition);
      }

      if (
        refState.preset.fovStart !== refState.preset.fovEnd
      ) {
        const targetFov = THREE.MathUtils.lerp(
          refState.preset.fovStart,
          refState.preset.fovEnd,
          easedProgress
        );
        camera.fov = THREE.MathUtils.lerp(
          camera.fov,
          targetFov,
          0.1
        );
        camera.updateProjectionMatrix();
      }

      if (rawProgress >= 1) {
        stopCinematic(false);
      }
    });

    if (!enabled) return null;

    return (
      <>
        {showOverlay && isActive && (
          <CinematicOverlayUI visible={isActive} progress={progress} />
        )}
        {showSkipPrompt &&
          isActive &&
          currentPreset?.showSkipPrompt && (
            <SkipPromptUI
              visible={isActive && currentPreset?.skippable}
              skipProgress={skipProgress}
              skipKey={skipKey.replace("Key", "")}
            />
          )}
      </>
    );
  }
);

// =======================================================
// CÁMARA CINEMÁTICA ORIGINAL (MOUSE + FASES)
// =======================================================

function useCinematicCamera(phase: Phase) {
  useFrame(({ mouse, camera }) => {
    const targetX = THREE.MathUtils.lerp(-0.3, 0.3, (mouse.x + 1) / 2);
    const targetY = THREE.MathUtils.lerp(-0.2, 0.2, (mouse.y + 1) / 2);

    camera.position.x += (targetX - camera.position.x) * 0.06;
    camera.position.y += (targetY - camera.position.y) * 0.06;

    if (phase === "explosion") {
      const shake = 0.06;
      camera.position.x += (Math.random() - 0.5) * shake;
      camera.position.y += (Math.random() - 0.5) * shake;
    }

    if (phase === "crown" || phase === "logo" || phase === "message") {
      const targetZ = 10.5;
      camera.position.z += (targetZ - camera.position.z) * 0.08;
    } else {
      const targetZ = 9;
      camera.position.z += (targetZ - camera.position.z) * 0.08;
    }

    camera.lookAt(0, 0.5, 0);
  });
}

// =======================================================
// ELEMENTOS 3D
// =======================================================

function NebulaFog({ phase }: { phase: Phase }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    const t = clock.elapsedTime;
    const active =
      phase === "cosmos" ||
      phase === "crown" ||
      phase === "logo" ||
      phase === "message";
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

function LightHalo() {
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
      const pulse = active
        ? 1 + Math.sin(t * 2.8 + offsets[i] * 4) * 0.25
        : 0;
      const s = active ? (1.5 + i * 1.8) * pulse : 0;
      ref.current.scale.set(s, s, s);
      // @ts-expect-error
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

function LeadershipCrown({ phase }: { phase: Phase }) {
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

function GlowingOrbs({ phase }: { phase: Phase }) {
  const orbs = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!orbs.current) return;
    const t = state.clock.elapsedTime;
    const visible =
      phase === "cosmos" ||
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

function ParticleTrails({ phase }: { phase: Phase }) {
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
      phase === "explosion" ||
      phase === "cosmos";

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
    // @ts-expect-error
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

function CinematicScene({ phase }: { phase: Phase }) {
  useCinematicCamera(phase);

  return (
    <group>
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
      <MagicRunes phase={phase} />
      <LeadershipCrown phase={phase} />
      <GlowingOrbs phase={phase} />
      <ParticleTrails phase={phase} />
    </group>
  );
}

// =======================================================
// PERMISSION GATE (UI 2D INICIAL)
// =======================================================

function PermissionGate({ onAccept }: { onAccept: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
    >
      {/* Glowing background effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: hovered
            ? "radial-gradient(circle at center, rgba(157,78,221,0.15) 0%, rgba(0,0,0,1) 70%)"
            : "radial-gradient(circle at center, rgba(0,217,255,0.08) 0%, rgba(0,0,0,1) 70%)",
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Logo */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={logoImg}
            alt="TAMV"
            className="w-24 h-24 object-contain rounded-lg"
          />
          <motion.div
            className="absolute -inset-4 rounded-xl"
            animate={{
              boxShadow: hovered
                ? "0 0 40px rgba(157,78,221,0.5), inset 0 0 20px rgba(157,78,221,0.2)"
                : "0 0 20px rgba(0,217,255,0.3), inset 0 0 10px rgba(0,217,255,0.1)",
            }}
          />
        </motion.div>

        {/* Wordmark */}
        <div className="text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold tracking-[0.3em] text-white mb-2"
            style={{
              textShadow: "0 0 30px rgba(0,217,255,0.5)",
            }}
          >
            TAMV
          </motion.h1>
          <motion.p
            className="text-cyan-400/80 text-sm tracking-[0.4em] uppercase"
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            DIGITAL NEXUS
          </motion.p>
        </div>

        {/* Enter button */}
        <motion.button
          onClick={onAccept}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative px-12 py-4 bg-transparent border border-cyan-400/50 text-cyan-400 font-medium tracking-[0.2em] uppercase overflow-hidden group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-cyan-400/20 to-purple-600/20"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
          <span className="relative z-10">Iniciar Experiencia</span>
        </motion.button>

        {/* Subtitle */}
        <motion.p
          className="text-white/40 text-xs tracking-wider max-w-md text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Sistema Cinematico Genesis v6.1
          <br />
          Powered by Isabella AI
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// =======================================================
// CINEMATIC INTRO PRINCIPAL
// =======================================================

export function CinematicIntro({
  onComplete,
  skipEnabled = true,
}: MainCinematicIntroProps) {
  const [phase, setPhase] = useState<Phase>("permission");
  const [accepted, setAccepted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const intervalRef = useRef<number | null>(null);

  const totalDuration =
    ISABELLA_LINES.reduce((s, l) => s + l.duration, 0) + 15000;

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
      // autoplay blocked
    }
  }, []);

  const handleAccept = useCallback(() => {
    setAccepted(true);
    initAudio();

    const push = (fn: () => void, delay: number) => {
      timeoutsRef.current.push(window.setTimeout(fn, delay));
    };

    push(() => setPhase("awakening"), 200);
    push(() => setPhase("ignition"), 2200);
    push(() => setPhase("explosion"), 4800);
    push(() => setPhase("cosmos"), 7200);
    push(() => setPhase("crown"), 9500);
    push(() => setPhase("logo"), 11800);
    push(() => setPhase("message"), 14000);

    let lineDelay = 14000;
    ISABELLA_LINES.forEach((line, idx) => {
      push(() => {
        setCurrentLineIndex(idx);
        setDisplayedLines((prev) => [...prev, line.text]);
      }, lineDelay);
      lineDelay += line.duration;
    });

    intervalRef.current = window.setInterval(() => {
      setProgress((p) => Math.min(p + 100 / (totalDuration / 50), 100));
    }, 50);

    push(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100);
      audioRef.current?.pause();
      window.setTimeout(onComplete, 1000);
    }, totalDuration);
  }, [initAudio, onComplete, totalDuration]);

  const handleSkip = useCallback(() => {
    if (!skipEnabled) return;
    clearAll();
    audioRef.current?.pause();
    onComplete();
  }, [clearAll, onComplete, skipEnabled]);

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
      {/* Chromatic radial glow */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at center, ${bgGlow} 0%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,1) 100%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* 3D canvas */}
      <Canvas
        camera={{ position: [0, 0, 9], fov: 70 }}
        className="absolute inset-0"
      >
        <CinematicScene phase={phase} />
      </Canvas>

      {/* UI Overlay */}
      <AnimatePresence>
        {phase === "logo" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={logoImg}
                alt="TAMV"
                className="w-32 h-32 object-contain rounded-xl"
                style={{
                  boxShadow: "0 0 60px rgba(255,215,0,0.4)",
                }}
              />
              <motion.div
                className="absolute -inset-2 rounded-xl border-2 border-cyan-400/50"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(0,217,255,0.3)",
                    "0 0 40px rgba(0,217,255,0.6)",
                    "0 0 20px rgba(0,217,255,0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        )}

        {phase === "message" && currentLineIndex >= 0 && (
          <motion.div
            className="absolute bottom-24 left-0 right-0 flex flex-col items-center gap-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-3xl mx-auto px-8 text-center space-y-2">
              {displayedLines.map((line, idx) => (
                <motion.p
                  key={idx}
                  className="text-cyan-400/90 text-lg md:text-xl tracking-wide font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: idx === currentLineIndex ? 1 : 0.3, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    textShadow: "0 0 20px rgba(0,217,255,0.5)",
                  }}
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="w-64 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Skip button */}
      {skipEnabled && (
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 z-[10000] text-xs tracking-[0.3em] uppercase text-white/40 hover:text-white/80 transition-colors"
        >
          Saltar Intro
        </button>
      )}
    </div>
  );
}

export default CinematicIntro;
