import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AudioAnalyzerData {
  frequency: number;
  amplitude: number;
  beat: boolean;
}

interface AudioReactiveMeshProps {
  audioData: AudioAnalyzerData;
}

function AudioReactiveMesh({ audioData }: AudioReactiveMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    const { elapsedTime } = state.clock;

    const amp = audioData.amplitude;
    const baseScale = 1 + amp * 2.3;
    const breathing = 0.05 * Math.sin(elapsedTime * 2.2);
    const scale = baseScale + breathing;
    meshRef.current.scale.set(scale, scale, scale);

    // Rotación base suave + extra en beats
    meshRef.current.rotation.y += 0.002 + amp * 0.02;
    meshRef.current.rotation.x = Math.sin(elapsedTime * 0.4) * 0.2;
    if (audioData.beat) {
      meshRef.current.rotation.y += 0.22;
    }

    materialRef.current.uniforms.time.value = elapsedTime;
    materialRef.current.uniforms.audioFrequency.value = audioData.frequency;
    materialRef.current.uniforms.audioAmplitude.value = amp;
  });

  const vertexShader = `
    uniform float time;
    uniform float audioFrequency;
    uniform float audioAmplitude;

    varying vec2 vUv;
    varying vec3 vWorldPos;
    varying float vRipple;

    void main() {
      vUv = uv;

      vec3 pos = position;
      float r = length(pos.xy);

      float baseFreq = 2.0 + audioFrequency * 10.0;
      float wave = sin(r * baseFreq - time * 2.5);
      float swirl = sin(atan(pos.y, pos.x) * 4.0 + time * 1.4);

      float displacement = (wave + swirl * 0.5) * (0.5 + audioAmplitude * 2.0);

      pos += normal * displacement;

      vRipple = wave;
      vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
      vWorldPos = worldPosition.xyz;

      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `;

  const fragmentShader = `
    uniform float time;
    uniform float audioFrequency;
    uniform float audioAmplitude;

    varying vec2 vUv;
    varying vec3 vWorldPos;
    varying float vRipple;

    void main() {
      vec3 aqua = vec3(0.0, 0.85, 1.0);
      vec3 silver = vec3(0.78, 0.78, 0.8);
      vec3 navy = vec3(0.01, 0.05, 0.16);

      float amp = clamp(audioAmplitude * 2.2, 0.0, 1.0);
      float pulse = 0.5 + 0.5 * sin(time * 3.0 + audioFrequency * 18.0);

      vec2 centerUV = vUv - 0.5;
      float radial = length(centerUV) * 2.0;

      vec3 base = mix(navy, aqua, (1.0 - radial) * (0.7 + 0.3 * amp));

      // Silver “metallic” dependiendo de la amplitud y el ripple
      float metallic = clamp(0.3 + vRipple * 0.2 + amp * 0.4, 0.0, 1.0);
      vec3 color = mix(base, silver, metallic * 0.4);

      float glow = pow(1.0 - radial, 3.0) * (0.4 + 0.6 * pulse) * amp;
      color += aqua * glow;

      float rim = pow(1.0 - abs(dot(normalize(vWorldPos), vec3(0.0, 0.0, 1.0))), 1.5);
      color += vec3(0.1, 0.2, 0.3) * rim * amp * 0.5;

      gl_FragColor = vec4(color, 0.9);
    }
  `;

  return (
    <mesh ref={meshRef}>
      {/* más segmentado para distorsión suave */}
      <torusGeometry args={[3, 1, 80, 220]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
          audioFrequency: { value: 0 },
          audioAmplitude: { value: 0 },
        }}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

interface ParticleFieldProps {
  audioData: AudioAnalyzerData;
  count?: number;
}

function ParticleField({ audioData, count = 2200 }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const positionsRef = useRef<Float32Array | null>(null);
  const basePositionsRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    const positions = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 20 + Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      base[i3] = x;
      base[i3 + 1] = y;
      base[i3 + 2] = z;
    }

    positionsRef.current = positions;
    basePositionsRef.current = base;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current || !positionsRef.current || !basePositionsRef.current)
      return;

    const { elapsedTime } = state.clock;
    const geom = pointsRef.current.geometry as THREE.BufferGeometry;
    const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
    const positions = posAttr.array as Float32Array;
    const base = basePositionsRef.current;

    const amp = 0.25 + audioData.amplitude * 1.5;

    pointsRef.current.rotation.y = elapsedTime * 0.02;
    pointsRef.current.rotation.x = Math.sin(elapsedTime * 0.07) * 0.18;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const bx = base[i3];
      const by = base[i3 + 1];
      const bz = base[i3 + 2];

      const dist = Math.sqrt(bx * bx + by * by + bz * bz);

      const wave =
        Math.sin(dist * 0.2 - elapsedTime * 1.8) * amp * 0.8 +
        Math.sin(elapsedTime * 2.5 + i * 0.02) * audioData.amplitude * 0.4;

      const factor = 1.0 + wave * 0.06;

      positions[i3] = bx * factor;
      positions[i3 + 1] = by * factor;
      positions[i3 + 2] = bz * factor;
    }

    posAttr.needsUpdate = true;

    const material = pointsRef.current.material as THREE.PointsMaterial;
    material.size = 0.08 + audioData.amplitude * 0.5;
    material.opacity = 0.3 + audioData.amplitude * 0.5;

    const baseColor = new THREE.Color("#00d9ff");
    const hotColor = new THREE.Color("#b3ffff");
    const mixed = baseColor.clone().lerp(hotColor, audioData.amplitude);
    material.color.copy(mixed);
  });

  if (!positionsRef.current) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positionsRef.current.length / 3}
          array={positionsRef.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#00D9FF"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function Scene({ audioData }: { audioData: AudioAnalyzerData }) {
  const mainLightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (!mainLightRef.current) return;
    const amp = audioData.amplitude;
    mainLightRef.current.intensity = 1 + amp * 1.6;
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight
        ref={mainLightRef}
        position={[10, 10, 10]}
        intensity={1.1}
        color="#00D9FF"
      />
      <pointLight
        position={[-10, -10, -10]}
        intensity={0.7}
        color="#C0C0C0"
      />
      <AudioReactiveMesh audioData={audioData} />
      <ParticleField audioData={audioData} />
    </>
  );
}

export const HyperRealEngine = () => {
  const [audioData, setAudioData] = useState<AudioAnalyzerData>({
    frequency: 0,
    amplitude: 0,
    beat: false,
  });

  const animationFrameRef = useRef<number>();
  const prevAmpRef = useRef(0);

  useEffect(() => {
    const simulate = () => {
      const time = Date.now() / 1000;

      const rawAmp = (Math.sin(time * 2.1) + 1) / 4; // 0–0.5
      const rawFreq = (Math.sin(time * 0.55) + 1) / 2; // 0–1

      const prev = prevAmpRef.current;
      const smoothing = 0.12;
      const smoothAmp = prev + (rawAmp - prev) * smoothing;
      prevAmpRef.current = smoothAmp;

      const beatThreshold = 0.34;
      const randomBeatChance = 0.78;
      const beat =
        smoothAmp > beatThreshold && Math.random() > randomBeatChance;

      setAudioData({
        frequency: rawFreq,
        amplitude: smoothAmp,
        beat,
      });

      animationFrameRef.current = requestAnimationFrame(simulate);
    };

    animationFrameRef.current = requestAnimationFrame(simulate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <Scene audioData={audioData} />
      </Canvas>
    </div>
  );
};
