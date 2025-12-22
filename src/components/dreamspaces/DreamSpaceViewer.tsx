import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Sky, 
  Stars, 
  Float, 
  Text3D, 
  Center,
  Environment,
  MeshDistortMaterial,
  Sparkles,
  useKeyboardControls,
  PointerLockControls
} from '@react-three/drei';
import * as THREE from 'three';
import { binauralAudio } from '@/utils/binauralAudio';

interface AvatarProps {
  position: [number, number, number];
  color: string;
  name: string;
  isLocal?: boolean;
}

// Interactive Avatar Component
function Avatar({ position, color, name, isLocal = false }: AvatarProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      // Rotation when hovered
      if (hovered) {
        meshRef.current.rotation.y += 0.02;
      }
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={isLocal ? 1.2 : 1}
        >
          {/* Body */}
          <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
          <MeshDistortMaterial
            color={color}
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0}
            metalness={0.8}
            distort={hovered ? 0.3 : 0.1}
            speed={2}
          />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={0.3}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>

        {/* Glow ring for local player */}
        {isLocal && (
          <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.5, 0.7, 32]} />
            <meshBasicMaterial color="#00D9FF" transparent opacity={0.5} />
          </mesh>
        )}
      </Float>
      
      {/* Name tag */}
      <sprite position={[0, 1.5, 0]} scale={[2, 0.5, 1]}>
        <spriteMaterial color={hovered ? "#FFD700" : "#FFFFFF"} opacity={0.9} transparent />
      </sprite>
    </group>
  );
}

// First Person Controller
function FirstPersonController({ speed = 5 }: { speed?: number }) {
  const { camera } = useThree();
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward.current = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          moveBackward.current = true;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft.current = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveRight.current = true;
          break;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward.current = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          moveBackward.current = false;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft.current = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveRight.current = false;
          break;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    direction.current.z = Number(moveForward.current) - Number(moveBackward.current);
    direction.current.x = Number(moveRight.current) - Number(moveLeft.current);
    direction.current.normalize();

    if (moveForward.current || moveBackward.current) {
      velocity.current.z -= direction.current.z * speed * delta;
    }
    if (moveLeft.current || moveRight.current) {
      velocity.current.x -= direction.current.x * speed * delta;
    }

    // Apply movement
    camera.position.x += velocity.current.x;
    camera.position.z += velocity.current.z;

    // Damping
    velocity.current.x *= 0.9;
    velocity.current.z *= 0.9;

    // Update binaural audio listener position
    binauralAudio.setListenerPosition(
      camera.position.x,
      camera.position.y,
      camera.position.z
    );
  });

  return null;
}

// Ground with grid
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[100, 100, 50, 50]} />
      <meshStandardMaterial
        color="#1a1a2e"
        wireframe={false}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

// Quantum Portal
function QuantumPortal({ position }: { position: [number, number, number] }) {
  const portalRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (portalRef.current) {
      portalRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group position={position}>
      <mesh ref={portalRef}>
        <torusGeometry args={[2, 0.1, 16, 100]} />
        <meshStandardMaterial
          color="#00D9FF"
          emissive="#00D9FF"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>
      <Sparkles count={50} scale={4} size={2} speed={0.4} color="#00D9FF" />
    </group>
  );
}

// Audio Source Component
function AudioSource({ position, type }: { position: [number, number, number]; type: 'ambient' | 'interactive' }) {
  const { camera } = useThree();
  const sphereRef = useRef<THREE.Mesh>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useFrame(() => {
    if (sphereRef.current) {
      const distance = camera.position.distanceTo(new THREE.Vector3(...position));
      const scale = Math.max(0.5, 2 - distance * 0.1);
      sphereRef.current.scale.setScalar(scale);
    }
  });

  const handleClick = async () => {
    if (!isPlaying) {
      setIsPlaying(true);
      await binauralAudio.playBinauralBeat(10, 5000); // Theta waves for relaxation
      setIsPlaying(false);
    }
  };

  return (
    <mesh
      ref={sphereRef}
      position={position}
      onClick={handleClick}
    >
      <icosahedronGeometry args={[0.5, 1]} />
      <meshStandardMaterial
        color={isPlaying ? "#FFD700" : "#9945FF"}
        emissive={isPlaying ? "#FFD700" : "#9945FF"}
        emissiveIntensity={isPlaying ? 2 : 0.5}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

// Environment based on type
function SpaceEnvironmentAdvanced({ type }: { type: 'quantum' | 'forest' | 'cosmic' | 'crystal' }) {
  const colors = {
    quantum: { fog: '#0a0a1a', light: '#00D9FF', ambient: 0.3 },
    forest: { fog: '#0a3a1a', light: '#90EE90', ambient: 0.4 },
    cosmic: { fog: '#050510', light: '#C0C0C0', ambient: 0.2 },
    crystal: { fog: '#1a1a2e', light: '#FF6B6B', ambient: 0.5 }
  };

  const config = colors[type] || colors.quantum;

  return (
    <>
      <fog attach="fog" args={[config.fog, 10, 80]} />
      <ambientLight intensity={config.ambient} />
      <pointLight position={[10, 20, 10]} intensity={1.5} color={config.light} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.8} color="#9945FF" />
      <spotLight position={[0, 30, 0]} intensity={2} color={config.light} angle={0.3} penumbra={1} castShadow />
      
      {type === 'cosmic' && <Stars radius={100} depth={50} count={7000} factor={4} saturation={0.5} fade speed={1} />}
      {type === 'forest' && <Environment preset="forest" />}
      {type === 'crystal' && <Environment preset="warehouse" />}
      {type === 'quantum' && <Environment preset="night" />}
    </>
  );
}

interface DreamSpaceViewerProps {
  environment: 'quantum' | 'forest' | 'cosmic' | 'crystal';
  participants?: Array<{ id: string; name: string; position: [number, number, number]; color: string }>;
  onExit?: () => void;
}

export function DreamSpaceViewer({ environment, participants = [], onExit }: DreamSpaceViewerProps) {
  const [isLocked, setIsLocked] = useState(false);
  const controlsRef = useRef<any>(null);

  // Mock participants for demo
  const mockParticipants = useMemo(() => [
    { id: '1', name: 'Usuario 1', position: [5, 0, 5] as [number, number, number], color: '#FF6B6B' },
    { id: '2', name: 'Usuario 2', position: [-3, 0, 8] as [number, number, number], color: '#4ECDC4' },
    { id: '3', name: 'Usuario 3', position: [8, 0, -3] as [number, number, number], color: '#FFE66D' },
    ...participants
  ], [participants]);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 2, 10], fov: 75 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <SpaceEnvironmentAdvanced type={environment} />
        
        {/* First Person Controls */}
        <FirstPersonController speed={5} />
        <OrbitControls 
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          minDistance={2}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2}
        />

        {/* Ground */}
        <Ground />

        {/* Local Player Avatar */}
        <Avatar
          position={[0, 0, 0]}
          color="#00D9FF"
          name="Tú"
          isLocal={true}
        />

        {/* Other Participants */}
        {mockParticipants.map((p) => (
          <Avatar
            key={p.id}
            position={p.position}
            color={p.color}
            name={p.name}
          />
        ))}

        {/* Quantum Portals */}
        <QuantumPortal position={[0, 2, -20]} />
        <QuantumPortal position={[15, 2, 0]} />

        {/* Audio Sources */}
        <AudioSource position={[-5, 1, 5]} type="ambient" />
        <AudioSource position={[10, 1, -5]} type="interactive" />
        <AudioSource position={[0, 1, 15]} type="interactive" />

        {/* Decorative Elements */}
        <Sparkles count={200} scale={50} size={3} speed={0.2} color="#00D9FF" />
      </Canvas>

      {/* HUD Overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
        <div className="glass-panel p-4 rounded-xl pointer-events-auto">
          <h3 className="text-primary font-bold text-lg">Controles</h3>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li>W/S - Avanzar/Retroceder</li>
            <li>A/D - Izquierda/Derecha</li>
            <li>Mouse - Rotar cámara</li>
            <li>Scroll - Zoom</li>
          </ul>
        </div>

        <div className="glass-panel p-4 rounded-xl pointer-events-auto">
          <h3 className="text-primary font-bold text-lg">Participantes: {mockParticipants.length + 1}</h3>
          <div className="flex gap-2 mt-2">
            {mockParticipants.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="w-8 h-8 rounded-full border-2 border-primary/50"
                style={{ backgroundColor: p.color }}
                title={p.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Exit Button */}
      {onExit && (
        <button
          onClick={onExit}
          className="absolute bottom-4 right-4 px-6 py-3 bg-destructive/80 hover:bg-destructive text-white rounded-xl font-bold transition-all"
        >
          Salir del Espacio
        </button>
      )}
    </div>
  );
}
