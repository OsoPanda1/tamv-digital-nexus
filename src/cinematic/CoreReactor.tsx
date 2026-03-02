// =======================================================
// CORE REACTOR - Núcleo Civilizatorio
// Procedural geometry with integrity and alignment params
// =======================================================

import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"
import type { ActId } from "./types"

interface CoreReactorProps {
  act: ActId
  t: number
}

export function CoreReactor({ act, t }: CoreReactorProps) {
  const group = useRef<THREE.Group>(null)
  const innerCore = useRef<THREE.Mesh>(null)
  const ringA = useRef<THREE.Mesh>(null)
  const ringB = useRef<THREE.Mesh>(null)
  const panels = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!group.current) return

    // Visibilidad según acto
    const visible =
      act === "CORE_AWAKENS" ||
      act === "SYSTEM_FAILURE" ||
      act === "CIVILIZATORY_EXPANSION" ||
      act === "REVELATION"

    group.current.visible = visible
    if (!visible) return

    // Integridad: construcción vs destrucción
    const integrity =
      act === "CORE_AWAKENS"
        ? t // se "arma" progresivamente
        : act === "SYSTEM_FAILURE"
        ? 1 - t // se "desintegra"
        : 0.8 // estable

    // Posición central suave
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      0,
      3,
      delta
    )

    // Pulso del núcleo interno
    if (innerCore.current) {
      const m = innerCore.current.material as THREE.MeshStandardMaterial
      const basePulse = 0.4
      const pulseSpeed = act === "SYSTEM_FAILURE" ? 0.02 : 0.004
      const pulse = basePulse + Math.sin(state.clock.elapsedTime * pulseSpeed * 1000) * 0.15

      // Emisividad dinámica
      m.emissiveIntensity = pulse * (0.3 + integrity * 0.7)

      // Color de emisión según estado
      if (act === "SYSTEM_FAILURE") {
        m.emissive.setHex(0xff4444)
        m.color.setHex(0xff6666)
      } else if (act === "REVELATION") {
        m.emissive.setHex(0xffd700)
        m.color.setHex(0xffec8b)
      } else {
        m.emissive.setHex(0xf3b35b)
        m.color.setHex(0xf9d48a)
      }

      innerCore.current.rotation.y += delta * (0.3 + integrity * 0.2)
      innerCore.current.rotation.z += delta * 0.1
    }

    // Rotación de anillos
    if (ringA.current && ringB.current) {
      const speedMultiplier = act === "SYSTEM_FAILURE" ? 2 : 1
      ringA.current.rotation.y -= delta * (0.1 + integrity * 0.6) * speedMultiplier
      ringB.current.rotation.y += delta * (0.15 + integrity * 0.5) * speedMultiplier

      // Shake en crisis
      if (act === "SYSTEM_FAILURE") {
        ringA.current.rotation.x = (Math.random() - 0.5) * 0.1
        ringB.current.rotation.x = (Math.random() - 0.5) * 0.1
      } else {
        ringA.current.rotation.x = THREE.MathUtils.damp(ringA.current.rotation.x, 0, 5, delta)
        ringB.current.rotation.x = THREE.MathUtils.damp(ringB.current.rotation.x, 0, 5, delta)
      }
    }

    // Paneles flotantes
    if (panels.current) {
      panels.current.children.forEach((child, idx) => {
        const baseRadius = 3
        const spread = 2 * (1 - integrity * 0.5)
        const r = baseRadius + spread
        const angle = (idx / panels.current!.children.length) * Math.PI * 2

        child.position.x = Math.cos(angle) * r
        child.position.z = Math.sin(angle) * r
        child.lookAt(0, 0, 0)

        // Movimiento flotante individual
        const floatOffset = Math.sin(state.clock.elapsedTime * 2 + idx) * 0.1
        child.position.y = floatOffset
      })
    }
  })

  // Construcción de geometría
  const panelCount = 10
  const panelArray = Array.from({ length: panelCount })

  return (
    <group ref={group} position={[0, -10, 0]}>
      {/* Núcleo interno - Icosaedro */}
      <mesh ref={innerCore}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color={"#f9d48a"}
          metalness={0.6}
          roughness={0.25}
          emissive={"#f3b35b"}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Anillo A - Horizontal */}
      <mesh ref={ringA} rotation={[0, 0, 0]}>
        <torusGeometry args={[2.4, 0.08, 16, 64]} />
        <meshStandardMaterial
          color={"#151515"}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Anillo B - Vertical */}
      <mesh ref={ringB} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.0, 0.06, 16, 64]} />
        <meshStandardMaterial
          color={"#202020"}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* Anillo C - Diagonal */}
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[2.7, 0.04, 12, 48]} />
        <meshStandardMaterial
          color={"#1a1a1a"}
          metalness={0.95}
          roughness={0.1}
          emissive={"#4be2ff"}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Paneles flotantes */}
      <group ref={panels}>
        {panelArray.map((_, i) => (
          <mesh key={i}>
            <boxGeometry args={[0.2, 1.4, 0.6]} />
            <meshStandardMaterial
              color={"#202020"}
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}
