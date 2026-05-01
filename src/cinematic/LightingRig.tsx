// =======================================================
// CINEMATIC LIGHTING RIG
// Enhanced lighting with superior dramatic effects
// =======================================================

import { useMemo } from "react"
import * as THREE from "three"
import type { ActId } from "./types"
import { VolumetricLight } from "./VolumetricLight"

interface LightingRigProps {
  act: ActId
}

interface LightIntensities {
  key: number
  rim: number
  fill: number
  accent: number
}

export function LightingRig({ act }: LightingRigProps) {
  const intensities = useMemo<LightIntensities>(() => {
    switch (act) {
      case "BLACK_VOID":
        return { key: 0.0, rim: 0.0, fill: 0.0, accent: 0.0 }
      case "CORE_AWAKENS":
        return { key: 3.0, rim: 1.5, fill: 0.2, accent: 0.8 }
      case "SYSTEM_FAILURE":
        return { key: 4.0, rim: 2.0, fill: 0.25, accent: 1.2 }
      case "CIVILIZATORY_EXPANSION":
        return { key: 3.5, rim: 1.3, fill: 0.35, accent: 0.6 }
      case "REVELATION":
        return { key: 4.5, rim: 1.0, fill: 0.5, accent: 0.4 }
      case "FINAL_DECLARATION":
        return { key: 0.4, rim: 0.0, fill: 0.08, accent: 0.2 }
      default:
        return { key: 1, rim: 0.5, fill: 0.2, accent: 0.3 }
    }
  }, [act])

  // Dynamic colors based on act
  const keyColor = useMemo(() => {
    switch (act) {
      case "SYSTEM_FAILURE":
        return new THREE.Color("#ff3333") // Red during crisis
      case "REVELATION":
        return new THREE.Color("#ffd700") // Bright gold
      case "CIVILIZATORY_EXPANSION":
        return new THREE.Color("#ffaa22") // Orange gold
      default:
        return new THREE.Color("#ffbb44") // Golden normal
    }
  }, [act])

  const rimColor = useMemo(() => {
    switch (act) {
      case "SYSTEM_FAILURE":
        return new THREE.Color("#ff6666") // Light red
      case "REVELATION":
        return new THREE.Color("#ffdd00") // Gold
      case "CIVILIZATORY_EXPANSION":
        return new THREE.Color("#00ffcc") // Teal
      default:
        return new THREE.Color("#00ffff") // Cyan
    }
  }, [act])

  const accentColor = useMemo(() => {
    switch (act) {
      case "SYSTEM_FAILURE":
        return new THREE.Color("#ff0044") // Hot pink/red
      case "REVELATION":
        return new THREE.Color("#ffff00") // Yellow
      default:
        return new THREE.Color("#aa44ff") // Purple
    }
  }, [act])

  return (
    <>
      {/* Key Light - Gold/Dynamic */}
      <directionalLight
        position={[5, 12, 8]}
        intensity={intensities.key}
        color={keyColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Secondary Key Light */}
      <directionalLight
        position={[-4, 8, -6]}
        intensity={intensities.key * 0.6}
        color={keyColor}
      />

      {/* Rim Light - Cyan/Gold */}
      <directionalLight
        position={[-8, 5, -10]}
        intensity={intensities.rim}
        color={rimColor}
      />

      {/* Back Rim Light */}
      <directionalLight
        position={[6, 3, -12]}
        intensity={intensities.rim * 0.7}
        color={rimColor}
      />

      {/* Accent Light - Purple/Pink */}
      <pointLight
        position={[0, 6, 0]}
        intensity={intensities.accent}
        color={accentColor}
        distance={25}
        decay={2}
      />

      {/* Fill - Ambient */}
      <ambientLight
        intensity={intensities.fill}
        color={new THREE.Color("#303030")}
      />

      {/* Hemisphere light for more natural feel */}
      <hemisphereLight
        color={new THREE.Color("#4466aa")}
        groundColor={new THREE.Color("#221122")}
        intensity={intensities.fill * 0.5}
      />

      {/* Bottom support light */}
      <pointLight
        position={[0, -6, 0]}
        intensity={act === "SYSTEM_FAILURE" ? 0.8 : 0.3}
        color={act === "SYSTEM_FAILURE" ? "#ff2222" : "#00aaff"}
        distance={25}
        decay={2}
      />

      {/* Left accent light */}
      <pointLight
        position={[-8, 2, 4]}
        intensity={0.4}
        color={act === "SYSTEM_FAILURE" ? "#ff4444" : "#00ffff"}
        distance={20}
        decay={2}
      />

      {/* Right accent light */}
      <pointLight
        position={[8, 2, -4]}
        intensity={0.4}
        color={act === "SYSTEM_FAILURE" ? "#ff6644" : "#ff44ff"}
        distance={20}
        decay={2}
      />

      {/* Spot light for dramatic effect */}
      <spotLight
        position={[0, 15, 0]}
        angle={0.4}
        penumbra={0.5}
        intensity={intensities.key * 0.3}
        color={keyColor}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Volumetric central beam */}
      <VolumetricLight act={act} />
    </>
  )
}
