// =======================================================
// MEGA STRUCTURE
// Expansión civilizatoria - Columnas monumentales
// =======================================================

import { useMemo } from "react"
import * as THREE from "three"
import type { ActId } from "./types"

interface MegaStructureProps {
  act: ActId
  t: number
}

export function MegaStructure({ act, t }: MegaStructureProps) {
  // Generar columnas con parámetros variados
  const columns = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        angle: (i / 24) * Math.PI * 2,
        radius: 8 + (i % 3) * 1.5,
        heightBase: 3 + (i % 5) * 1.5,
        thickness: 0.5 + (i % 3) * 0.2,
      })),
    []
  )

  // Visibilidad solo en expansión y revelación
  if (act !== "CIVILIZATORY_EXPANSION" && act !== "REVELATION") {
    return null
  }

  // Factor de revelación
  const reveal = act === "CIVILIZATORY_EXPANSION" ? t : 1

  return (
    <group>
      {/* Columnas circulares */}
      {columns.map((c, i) => {
        const h = c.heightBase * (0.3 + reveal * 0.7)
        const x = Math.cos(c.angle) * c.radius
        const z = Math.sin(c.angle) * c.radius

        return (
          <mesh key={i} position={[x, h / 2 - 1, z]}>
            <boxGeometry args={[c.thickness, h, c.thickness]} />
            <meshStandardMaterial
              color={"#101010"}
              metalness={0.8}
              roughness={0.35}
            />
          </mesh>
        )
      })}

      {/* Eje vertical central */}
      <mesh position={[0, 6 * reveal - 1, 0]}>
        <cylinderGeometry args={[0.7, 1.2, 12 * reveal, 32]} />
        <meshStandardMaterial
          color={"#181818"}
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Anillos de conexión */}
      <mesh position={[0, 2 * reveal, 0]}>
        <torusGeometry args={[6, 0.1, 16, 48]} />
        <meshStandardMaterial
          color={"#252525"}
          metalness={0.95}
          roughness={0.2}
        />
      </mesh>

      <mesh position={[0, 6 * reveal, 0]}>
        <torusGeometry args={[5, 0.08, 16, 48]} />
        <meshStandardMaterial
          color={"#252525"}
          metalness={0.95}
          roughness={0.2}
        />
      </mesh>

      {/* Plataforma base */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7, 12, 64]} />
        <meshStandardMaterial
          color={"#0a0a0a"}
          metalness={0.7}
          roughness={0.8}
        />
      </mesh>
    </group>
  )
}
