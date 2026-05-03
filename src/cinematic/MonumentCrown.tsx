// =================================================================
// MONUMENT CROWN V2 - FUTURISTIC & ELEGANT
// Corona TAMV con placa para logo, refactorizada para modularidad
// y efectos visuales avanzados.
// =================================================================

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { Group } from "three";
import { animated, useSpring } from "@react-spring/three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

// --- Tipos y Constantes ---
type ActId = "CIVILIZATORY_EXPANSION" | "REVELATION" | "INACTIVE";
const SPIRE_COUNT = 12;

interface MonumentCrownProps {
  act: ActId;
  t: number; // Progreso de 0 a 1
}

// --- Shader para la Gema Energética ---
const EnergyGemMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0.1, 0.3, 1.0), // Un azul energético
    power: 2.0,
  },
  // Vertex Shader
  `
    varying vec3 vNormal;
    void main() {
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float time;
    uniform vec3 color;
    uniform float power;
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), power);
      float pulse = 0.6 + 0.4 * sin(time * 2.0);
      gl_FragColor = vec4(color * intensity * pulse, 1.0);
    }
  `
);
extend({ EnergyGemMaterial });

// --- Componentes Modulares de la Corona ---

const Spire = ({ index, revealFactor }: { index: number; revealFactor: number }) => {
  const angle = (index / SPIRE_COUNT) * Math.PI * 2;
  const radius = 2.8;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  // Altura variable para un look más dinámico
  const baseHeight = 2 + (index % 3) * 0.8;
  const h = baseHeight * revealFactor;

  return (
    <mesh position={[x, h / 2, z]} rotation={[0, -angle, 0]}>
      <boxGeometry args={[0.35, h, 0.9]} />
      <meshStandardMaterial
        color={"#181818"}
        metalness={0.9}
        roughness={0.3}
      />
    </mesh>
  );
};

const LogoPlate = () => (
  <group>
    {/* Placa Principal */}
    <mesh position={[0, 2.6, 0]}>
      <boxGeometry args={[3, 1.3, 0.25]} />
      <meshStandardMaterial
        color={"#202020"}
        metalness={0.95}
        roughness={0.25}
      />
    </mesh>
    {/* Borde Iluminado */}
    <mesh position={[0, 2.6, 0.15]}>
      <boxGeometry args={[3.1, 1.4, 0.05]} />
      <meshStandardMaterial
        color={"#000000"}
        metalness={1}
        roughness={0.1}
        emissive={"#5b93f3"} // Tonalidad azul futurista
        emissiveIntensity={0.6}
      />
    </mesh>
     {/* Columnas de Soporte */}
     <mesh position={[-1.2, 1.3, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2.6, 8]} />
        <meshStandardMaterial color={"#151515"} metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[1.2, 1.3, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2.6, 8]} />
        <meshStandardMaterial color={"#151515"} metalness={0.9} roughness={0.3} />
      </mesh>
  </group>
);

const Gem = () => {
    const materialRef = useRef<any>();
    useFrame((_, delta) => {
        if(materialRef.current) {
            materialRef.current.time += delta;
        }
    });

    return (
        <mesh position={[0, 2.6, 0.25]}>
            <icosahedronGeometry args={[0.4, 0]} />
            <energyGemMaterial ref={materialRef} />
        </mesh>
    )
}


// --- Componente Principal ---

export function MonumentCrown({ act, t }: MonumentCrownProps) {
  const group = useRef<Group>(null);
  const spires = useMemo(() => Array.from({ length: SPIRE_COUNT }).map((_, i) => i), []);

  const isVisible = act === "CIVILIZATORY_EXPANSION" || act === "REVELATION";
  const revealFactor = act === "CIVILIZATORY_EXPANSION" ? t : isVisible ? 1 : 0;

  // Animaciones controladas por React Spring
  const { positionY, rotationY, emissiveIntensity } = useSpring({
    positionY: isVisible ? 4 + 2 * revealFactor : 0,
    rotationY: act === "REVELATION" ? Math.PI * 2 : 0,
    emissiveIntensity: isVisible ? 0.25 : 0,
    config: { mass: 5, tension: 120, friction: 50 },
  });

  return (
    <animated.group
      ref={group}
      position-y={positionY}
      rotation-y={rotationY}
      visible={isVisible}
    >
      {/* Anillo base con brillo animado */}
      <mesh>
        <torusGeometry args={[2.8, 0.18, 24, 96]} />
        <animated.meshStandardMaterial
          color={"#141414"}
          metalness={0.9}
          roughness={0.25}
          emissive={"#5b93f3"}
          emissiveIntensity={emissiveIntensity.to(i => i * (0.8 + Math.sin(Date.now() * 0.002) * 0.2))}
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

      {/* Dientes monumentales generados dinámicamente */}
      {spires.map((i) => (
        <Spire key={i} index={i} revealFactor={revealFactor} />
      ))}

      {/* Placa para el logo */}
      <LogoPlate />

      {/* Gema central con shader personalizado */}
      <Gem />

    </animated.group>
  );
}```
