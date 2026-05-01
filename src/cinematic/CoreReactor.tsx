// =======================================================
// CORE REACTOR - Núcleo Civilizatorio
// Enhanced with superior visual effects
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
  const outerCore = useRef<THREE.Mesh>(null)
  const ringA = useRef<THREE.Mesh>(null)
  const ringB = useRef<THREE.Mesh>(null)
  const ringC = useRef<THREE.Mesh>(null)
  const ringD = useRef<THREE.Mesh>(null)
  const ringE = useRef<THREE.Mesh>(null)
  const panels = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (!group.current) return

    // Visibility based on act
    const visible =
      act === "CORE_AWAKENS" ||
      act === "SYSTEM_FAILURE" ||
      act === "CIVILIZATORY_EXPANSION" ||
      act === "REVELATION"

    group.current.visible = visible
    if (!visible) return

    // Integrity: construction vs destruction
    const integrity =
      act === "CORE_AWAKENS"
        ? t
        : act === "SYSTEM_FAILURE"
        ? 1 - t
        : 0.85

    // Smooth central position
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      0,
      3,
      delta
    )

    // Inner core pulse
    if (innerCore.current) {
      const m = innerCore.current.material as THREE.MeshStandardMaterial
      const basePulse = 0.5
      const pulseSpeed = act === "SYSTEM_FAILURE" ? 0.025 : 0.005
      const pulse = basePulse + Math.sin(state.clock.elapsedTime * pulseSpeed * 1000) * 0.2

      // Dynamic emissivity
      m.emissiveIntensity = pulse * (0.4 + integrity * 0.8)

      // Emissive color based on state
      if (act === "SYSTEM_FAILURE") {
        m.emissive.setHex(0xff3333)
        m.color.setHex(0xff5555)
      } else if (act === "REVELATION") {
        m.emissive.setHex(0xffd700)
        m.color.setHex(0xffec8b)
      } else {
        m.emissive.setHex(0xffaa33)
        m.color.setHex(0xffcc66)
      }

      innerCore.current.rotation.y += delta * (0.35 + integrity * 0.25)
      innerCore.current.rotation.z += delta * 0.15
    }

    // Outer core
    if (outerCore.current) {
      outerCore.current.rotation.y -= delta * 0.2
      outerCore.current.rotation.x += delta * 0.1
      const om = outerCore.current.material as THREE.MeshStandardMaterial
      om.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.15
    }

    // Ring rotation with more speed and effects
    if (ringA.current && ringB.current && ringC.current && ringD.current && ringE.current) {
      const speedMultiplier = act === "SYSTEM_FAILURE" ? 2.5 : 1
      ringA.current.rotation.y -= delta * (0.12 + integrity * 0.7) * speedMultiplier
      ringB.current.rotation.y += delta * (0.18 + integrity * 0.6) * speedMultiplier
      ringC.current.rotation.x += delta * (0.15 + integrity * 0.5) * speedMultiplier
      ringD.current.rotation.z -= delta * (0.2 + integrity * 0.4) * speedMultiplier
      ringE.current.rotation.x += delta * (0.1 + integrity * 0.3) * speedMultiplier

      // Shake in crisis
      if (act === "SYSTEM_FAILURE") {
        ringA.current.rotation.x = (Math.random() - 0.5) * 0.15
        ringB.current.rotation.x = (Math.random() - 0.5) * 0.12
        ringC.current.rotation.y = (Math.random() - 0.5) * 0.1
      } else {
        ringA.current.rotation.x = THREE.MathUtils.damp(ringA.current.rotation.x, 0, 5, delta)
        ringB.current.rotation.x = THREE.MathUtils.damp(ringB.current.rotation.x, 0, 5, delta)
        ringC.current.rotation.y = THREE.MathUtils.damp(ringC.current.rotation.y, 0, 5, delta)
      }
    }

    // Glow effect pulse
    if (glowRef.current) {
      const glowM = glowRef.current.material as THREE.MeshBasicMaterial
      const glowPulse = 0.4 + Math.sin(state.clock.elapsedTime * 3) * 0.2
      glowM.opacity = glowPulse * integrity
      glowRef.current.scale.setScalar(1.8 + Math.sin(state.clock.elapsedTime * 2) * 0.1)
    }

    // Floating panels
    if (panels.current) {
      panels.current.children.forEach((child, idx) => {
        const baseRadius = 3.5
        const spread = 2.5 * (1 - integrity * 0.5)
        const r = baseRadius + spread
        const angle = (idx / panels.current!.children.length) * Math.PI * 2

        child.position.x = Math.cos(angle) * r
        child.position.z = Math.sin(angle) * r
        child.lookAt(0, 0, 0)

        // Individual floating motion
        const floatOffset = Math.sin(state.clock.elapsedTime * 2.5 + idx) * 0.12
        child.position.y = floatOffset
      })
    }
  })

  // Panel geometry construction
  const panelCount = 12
  const panelArray = Array.from({ length: panelCount })

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Inner core - Icosahedron */}
      <mesh ref={innerCore}>
        <icosahedronGeometry args={[1.3, 2]} />
        <meshStandardMaterial
          color={"#ffcc66"}
          metalness={0.65}
          roughness={0.2}
          emissive={"#ffaa33"}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Outer core - Dodecahedron */}
      <mesh ref={outerCore}>
        <dodecahedronGeometry args={[1.8, 0]} />
        <meshStandardMaterial
          color={"#8866ff"}
          metalness={0.8}
          roughness={0.15}
          emissive={"#6644ff"}
          emissiveIntensity={0.4}
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial
          color={act === "SYSTEM_FAILURE" ? "#ff4444" : "#ffaa33"}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ring A - Horizontal */}
      <mesh ref={ringA} rotation={[0, 0, 0]}>
        <torusGeometry args={[2.6, 0.09, 16, 80]} />
        <meshStandardMaterial
          color={"#0a0a0a"}
          metalness={0.95}
          roughness={0.08}
        />
      </mesh>

      {/* Ring B - Vertical */}
      <mesh ref={ringB} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.2, 0.07, 16, 80]} />
        <meshStandardMaterial
          color={"#151515"}
          metalness={0.92}
          roughness={0.1}
        />
      </mesh>

      {/* Ring C - Diagonal 1 */}
      <mesh ref={ringC} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.9, 0.055, 16, 64]} />
        <meshStandardMaterial
          color={"#1a1a1a"}
          metalness={0.9}
          roughness={0.12}
          emissive={"#00ffff"}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Ring D - Diagonal 2 */}
      <mesh ref={ringD} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[3.5, 0.045, 16, 64]} />
        <meshStandardMaterial
          color={"#121212"}
          metalness={0.93}
          roughness={0.09}
          emissive={"#ff44ff"}
          emissiveIntensity={0.12}
        />
      </mesh>

      {/* Ring E - Tilted */}
      <mesh ref={ringE} rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[4.0, 0.035, 16, 48]} />
        <meshStandardMaterial
          color={"#0d0d0d"}
          metalness={0.88}
          roughness={0.11}
          emissive={"#44ff44"}
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Floating panels */}
      <group ref={panels}>
        {panelArray.map((_, i) => (
          <mesh key={i}>
            <boxGeometry args={[0.22, 1.5, 0.65]} />
            <meshStandardMaterial
              color={"#181818"}
              metalness={0.88}
              roughness={0.18}
              emissive={i % 2 === 0 ? "#00ccff" : "#ff44aa"}
              emissiveIntensity={0.25}
            />
          </mesh>
        ))}
      </group>

      {/* Central energy beam */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.15, 8, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffaa33"
          emissiveIntensity={2}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Bottom glow */}
      <mesh position={[0, -3, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[3, 2, 32]} />
        <meshBasicMaterial
          color={act === "SYSTEM_FAILURE" ? "#ff2222" : "#ff8800"}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
