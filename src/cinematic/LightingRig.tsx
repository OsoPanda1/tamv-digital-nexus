// =======================================================
// CINEMATIC LIGHTING RIG
// Act-based lighting with key, rim, fill and volumetric
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
}

export function LightingRig({ act }: LightingRigProps) {
  const intensities = useMemo<LightIntensities>(() => {
    switch (act) {
      case "BLACK_VOID":
        return { key: 0.0, rim: 0.0, fill: 0.0 }
      case "CORE_AWAKENS":
        return { key: 2.5, rim: 1.2, fill: 0.15 }
      case "SYSTEM_FAILURE":
        return { key: 3.2, rim: 1.5, fill: 0.2 }
      case "CIVILIZATORY_EXPANSION":
        return { key: 2.8, rim: 1.0, fill: 0.3 }
      case "REVELATION":
        return { key: 3.5, rim: 0.8, fill: 0.4 }
      case "FINAL_DECLARATION":
        return { key: 0.3, rim: 0.0, fill: 0.05 }
      default:
        return { key: 1, rim: 0.5, fill: 0.2 }
    }
  }, [act])

  // Colores dinámicos según acto
  const keyColor = useMemo(() => {
    switch (act) {
      case "SYSTEM_FAILURE":
        return new THREE.Color("#ff5555") // rojo durante crisis
      case "REVELATION":
        return new THREE.Color("#f3d48a") // dorado brillante
      default:
        return new THREE.Color("#f3b35b") // dorado normal
    }
  }, [act])

  const rimColor = useMemo(() => {
    switch (act) {
      case "SYSTEM_FAILURE":
        return new THREE.Color("#ff8888") // rojo claro
      case "REVELATION":
        return new THREE.Color("#ffd700") // dorado
      default:
        return new THREE.Color("#4be2ff") // cian
    }
  }, [act])

  return (
    <>
      {/* Key Light - Oro/Dinámico */}
      <directionalLight
        position={[4, 10, 6]}
        intensity={intensities.key}
        color={keyColor}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
      />

      {/* Rim Light - Cian/Dorado */}
      <directionalLight
        position={[-6, 4, -8]}
        intensity={intensities.rim}
        color={rimColor}
      />

      {/* Fill - Ambiente */}
      <ambientLight
        intensity={intensities.fill}
        color={new THREE.Color("#404040")}
      />

      {/* Luz de apoyo inferior */}
      <pointLight
        position={[0, -5, 0]}
        intensity={act === "SYSTEM_FAILURE" ? 0.5 : 0.2}
        color={act === "SYSTEM_FAILURE" ? "#ff3333" : "#4be2ff"}
        distance={20}
      />

      {/* Volumetric beam central */}
      <VolumetricLight act={act} />
    </>
  )
}
