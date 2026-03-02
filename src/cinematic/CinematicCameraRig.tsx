// =======================================================
// CINEMATIC CAMERA RIG
// Act-based camera poses with damping and shake effects
// =======================================================

import { useThree, useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import * as THREE from "three"
import type { ActId } from "./types"

// Poses de cámara por acto (posición de la cámara)
const CAMERA_POSES: Record<ActId, THREE.Vector3> = {
  BLACK_VOID: new THREE.Vector3(0, 1, 24),
  CORE_AWAKENS: new THREE.Vector3(0, 2, 18),
  SYSTEM_FAILURE: new THREE.Vector3(0, 1.5, 14),
  CIVILIZATORY_EXPANSION: new THREE.Vector3(0, 3, 12),
  REVELATION: new THREE.Vector3(0, 2.5, 9),
  FINAL_DECLARATION: new THREE.Vector3(0, 1, 18),
}

// Target de lookAt por acto
const LOOK_AT_TARGETS: Record<ActId, THREE.Vector3> = {
  BLACK_VOID: new THREE.Vector3(0, 0, 0),
  CORE_AWAKENS: new THREE.Vector3(0, 0, 0),
  SYSTEM_FAILURE: new THREE.Vector3(0, 0, 0),
  CIVILIZATORY_EXPANSION: new THREE.Vector3(0, 1, 0),
  REVELATION: new THREE.Vector3(0, 2, 0),
  FINAL_DECLARATION: new THREE.Vector3(0, 0, 0),
}

interface CinematicCameraRigProps {
  act: ActId
  t: number // progreso local del acto (0-1)
}

export function CinematicCameraRig({ act }: CinematicCameraRigProps) {
  const { camera } = useThree()

  // Target de lookAt
  const target = useMemo(() => new THREE.Vector3(0, 1.5, 0), [])

  useFrame((state, delta) => {
    const pose = CAMERA_POSES[act]
    const lookTarget = LOOK_AT_TARGETS[act]
    const speed = 3.5 // factor de damping

    // Interpolación suave de posición
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      pose.x,
      speed,
      delta
    )
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      pose.y,
      speed,
      delta
    )
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      pose.z,
      speed,
      delta
    )

    // Shake intensivo en SYSTEM_FAILURE
    if (act === "SYSTEM_FAILURE") {
      const time = state.clock.elapsedTime
      const shakeAmplitude = 0.08
      const shakeFrequency = 15
      camera.position.x += Math.sin(time * shakeFrequency * 1.3) * shakeAmplitude
      camera.position.y += Math.cos(time * shakeFrequency * 0.7) * shakeAmplitude
      camera.position.z += Math.sin(time * shakeFrequency * 0.5) * shakeAmplitude * 0.5
    }

    // LookAt suave
    target.lerp(lookTarget, 0.1)
    camera.lookAt(target)
  })

  return null
}
