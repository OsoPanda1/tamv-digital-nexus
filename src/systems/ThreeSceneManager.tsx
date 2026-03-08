import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Environment } from '@react-three/drei';
import { Suspense, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ThreeSceneManagerProps {
  children?: ReactNode;
  camera?: { position: [number, number, number]; fov?: number };
  enableOrbitControls?: boolean;
  showStars?: boolean;
  environment?: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park';
}

/**
 * Gestor de escenas 3D con Three.js
 * Sistema base para DreamSpaces, avatares, y entornos XR
 */
export const ThreeSceneManager = ({
  children,
  camera = { position: [0, 0, 5], fov: 75 },
  enableOrbitControls = true,
  showStars = true,
  environment = 'sunset'
}: ThreeSceneManagerProps) => {
  return (
    <div className="w-full h-full relative">
      <Canvas
        className="w-full h-full"
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        shadows
      >
        <PerspectiveCamera makeDefault position={camera.position} fov={camera.fov || 75} />
        
        {/* Iluminación avanzada */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#a78bfa" />
        <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.3} penumbra={1} castShadow />

        {/* Estrellas de fondo (opcional) */}
        {showStars && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}

        {/* Entorno HDR */}
        <Suspense fallback={null}>
          <Environment preset={environment} />
        </Suspense>

        {/* Controles de órbita */}
        {enableOrbitControls && (
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={20}
          />
        )}

        {/* Contenido de la escena */}
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>

      {/* Loader removed — scenes load via Suspense fallback inside Canvas */}
    </div>
  );
};