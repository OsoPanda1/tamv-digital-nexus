// =======================================================
// VOLUMETRIC LIGHT
// Simulated volumetric lighting with cone geometry
// =======================================================

import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useRef } from "react"
import type { ActId } from "./types"

interface VolumetricLightProps {
  act: ActId
}

export function VolumetricLight({ act }: VolumetricLightProps) {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (!mesh.current) return

    let targetOpacity = 0

    switch (act) {
      case "CORE_AWAKENS":
        targetOpacity = 0.25
        break
      case "SYSTEM_FAILURE":
        targetOpacity = 0.35
        break
      case "CIVILIZATORY_EXPANSION":
        targetOpacity = 0.5
        break
      case "REVELATION":
        targetOpacity = 0.6
        break
      case "FINAL_DECLARATION":
        targetOpacity = 0.2
        break
    }

    const m = mesh.current.material as THREE.MeshBasicMaterial
    m.opacity = THREE.MathUtils.damp(m.opacity, targetOpacity, 3, delta)

    // Rotación lenta
    mesh.current.rotation.z += delta * 0.05
  })

  return (
    <mesh
      ref={mesh}
      position={[0, 5, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <coneGeometry args={[4.2, 10, 64, 1, true]} />
      <meshBasicMaterial
        color={"#f7e0b0"}
        transparent
        opacity={0}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
