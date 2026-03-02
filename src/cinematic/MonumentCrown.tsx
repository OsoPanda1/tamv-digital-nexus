// =======================================================
// MONUMENT CROWN
// Corona TAMV con placa para logo
// =======================================================

import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"
import type { ActId } from "./types"

interface MonumentCrownProps {
  act: ActId
  t: number
}

export function MonumentCrown({ act, t }: MonumentCrownProps) {
  const group = useRef<THREE.Group>(null)

  const segments = useMemo(
    () => Array.from({ length: 12 }).map((_, i) => i),
    []
  )

  useFrame((state, delta) => {
    if (!group.current) return

    const visible = act === "CIVILIZATORY_EXPANSION" || act === "REVELATION"
    group.current.visible = visible
    if (!visible) return

    // Elevación según progreso
    const rise = act === "CIVILIZATORY_EXPANSION" ? t : 1
    const targetY = 4 + 2 * rise

    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      targetY,
      3,
      delta
    )

    // Rotación lenta en revelación
    if (act === "REVELATION") {
      group.current.rotation.y += delta * 0.08
    }

    // Brillo pulsante
    group.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        const m = child.material as THREE.MeshStandardMaterial
        if (m.emissive) {
          const pulse = 0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
          m.emissiveIntensity = pulse
        }
      }
    })
  })

  const reveal =
    act === "CIVILIZATORY_EXPANSION" ? t : act === "REVELATION" ? 1 : 0

  return (
    <group ref={group} position={[0, -10, 0]}>
      {/* Anillo base */}
      <mesh>
        <torusGeometry args={[2.8, 0.18, 24, 96]} />
        <meshStandardMaterial
          color={"#141414"}
          metalness={0.9}
          roughness={0.25}
          emissive={"#f3b35b"}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Anillo medio */}
      <mesh position={[0, 0.5, 0]}>
        <torusGeometry args={[2.5, 0.12, 20, 64]} />
        <meshStandardMaterial
          color={"#181818"}
          metalness={0.95}
          roughness={0.2}
        />
      </mesh>

      {/* Dientes monumentales */}
      {segments.map((i) => {
        const angle = (i / segments.length) * Math.PI * 2
        const radius = 2.8
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const h = (2 + (i % 3) * 0.8) * reveal

        return (
          <mesh key={i} position={[x, h / 2, z]} rotation={[0, angle, 0]}>
            <boxGeometry args={[0.35, h, 0.9]} />
            <meshStandardMaterial
              color={"#181818"}
              metalness={0.9}
              roughness={0.3}
            />
          </mesh>
        )
      })}

      {/* Placa central para logo TAMV */}
      <mesh position={[0, 2.6, 0]}>
        <boxGeometry args={[3, 1.3, 0.25]} />
        <meshStandardMaterial
          color={"#202020"}
          metalness={0.95}
          roughness={0.25}
        />
      </mesh>

      {/* Borde iluminado de placa */}
      <mesh position={[0, 2.6, 0.15]}>
        <boxGeometry args={[3.1, 1.4, 0.05]} />
        <meshStandardMaterial
          color={"#000000"}
          metalness={1}
          roughness={0.1}
          emissive={"#f3b35b"}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Gema central */}
      <mesh position={[0, 2.6, 0.2]}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={"#ffd700"}
          metalness={1}
          roughness={0}
          emissive={"#ffaa00"}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Columnas soporte */}
      <mesh position={[-1.2, 1.3, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 2.6, 16]} />
        <meshStandardMaterial color={"#151515"} metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[1.2, 1.3, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 2.6, 16]} />
        <meshStandardMaterial color={"#151515"} metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  )
}
