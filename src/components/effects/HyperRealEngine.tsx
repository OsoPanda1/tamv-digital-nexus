import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AudioAnalyzerData {
  frequency: number;
  amplitude: number;
  beat: boolean;
}

function AudioReactiveMesh({ audioData }: { audioData: AudioAnalyzerData }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      const scale = 1 + audioData.amplitude * 2;
      meshRef.current.scale.set(scale, scale, scale);
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      materialRef.current.uniforms.audioFrequency.value = audioData.frequency;
      materialRef.current.uniforms.audioAmplitude.value = audioData.amplitude;
      if (audioData.beat) meshRef.current.rotation.y += 0.1;
    }
  });

  const vertexShader = `
    uniform float time;
    uniform float audioFrequency;
    uniform float audioAmplitude;
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      vec3 pos = position;
      float displacement = sin(pos.x * audioFrequency + time) * audioAmplitude * 0.5;
      pos.y += displacement;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float time;
    uniform float audioFrequency;
    uniform float audioAmplitude;
    varying vec2 vUv;
    void main() {
      vec3 aqua = vec3(0.0, 0.85, 1.0);
      vec3 silver = vec3(0.75, 0.75, 0.75);
      vec3 navy = vec3(0.0, 0.2, 0.4);
      float pulse = sin(time * 2.0 + audioFrequency * 10.0) * audioAmplitude;
      vec3 color = mix(navy, aqua, vUv.y + pulse);
      color = mix(color, silver, audioAmplitude * 0.5);
      float glow = pow(1.0 - abs(vUv.y - 0.5) * 2.0, 2.0);
      color += aqua * glow * audioAmplitude;
      gl_FragColor = vec4(color, 0.8);
    }
  `;

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[3, 1, 32, 100]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
          audioFrequency: { value: 0 },
          audioAmplitude: { value: 0 }
        }}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function ParticleField({ audioData, count = 2000 }: { audioData: AudioAnalyzerData; count?: number }) {
  const points = useRef<THREE.Points>(null);
  const particles = useRef(new Float32Array(count * 3));

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      particles.current[i * 3] = (Math.random() - 0.5) * 50;
      particles.current[i * 3 + 1] = (Math.random() - 0.5) * 50;
      particles.current[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.05;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
      const positions = points.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime + positions[i3]) * 0.01 * (1 + audioData.amplitude);
      }
      points.current.geometry.attributes.position.needsUpdate = true;
      const material = points.current.material as THREE.PointsMaterial;
      material.size = 0.1 + audioData.amplitude * 0.5;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles.current} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#00D9FF" transparent opacity={0.6} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Scene({ audioData }: { audioData: AudioAnalyzerData }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00D9FF" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#C0C0C0" />
      <AudioReactiveMesh audioData={audioData} />
      <ParticleField audioData={audioData} />
    </>
  );
}

export const HyperRealEngine = () => {
  const [audioData, setAudioData] = useState<AudioAnalyzerData>({ frequency: 0, amplitude: 0, beat: false });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const simulate = () => {
      const time = Date.now() / 1000;
      setAudioData({
        frequency: (Math.sin(time * 0.5) + 1) / 2,
        amplitude: (Math.sin(time * 2) + 1) / 4,
        beat: Math.random() > 0.95
      });
      animationFrameRef.current = requestAnimationFrame(simulate);
    };
    simulate();
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <Scene audioData={audioData} />
      </Canvas>
    </div>
  );
};
