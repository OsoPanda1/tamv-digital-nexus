import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Float, MeshDistortMaterial } from '@react-three/drei';

/**
 * Objeto 3D cuántico - Esfera con distorsión dinámica
 */
export const QuantumSphere = ({ position = [0, 0, 0] as [number, number, number], color = "#a78bfa" }) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh
        ref={meshRef}
        position={position}
        scale={hovered ? 1.2 : 1}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.5}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
};

/**
 * Portal cuántico - Anillo con partículas
 */
export const QuantumPortal = ({ position = [0, 0, 0] as [number, number, number] }) => {
  const ringRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group position={position}>
      <mesh ref={ringRef}>
        <torusGeometry args={[2, 0.1, 16, 100]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2} />
      </mesh>
      
      {/* Partículas interiores */}
      {Array.from({ length: 50 }).map((_, i) => {
        const angle = (i / 50) * Math.PI * 2;
        const radius = 1.5 + Math.random() * 0.5;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius,
              (Math.random() - 0.5) * 0.5
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#a78bfa" />
          </mesh>
        );
      })}
    </group>
  );
};

/**
 * Cristal flotante - Para DreamSpaces
 */
export const FloatingCrystal = ({ position = [0, 0, 0] as [number, number, number], color = "#06b6d4" }) => {
  const crystalRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (crystalRef.current) {
      crystalRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.3;
      crystalRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={crystalRef} position={position} castShadow>
      <octahedronGeometry args={[0.8, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.1}
        metalness={0.9}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};