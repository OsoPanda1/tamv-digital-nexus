import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { supabase } from '@/integrations/supabase/client';

interface HyperRealEffect {
  id: string;
  name: string;
  effect_type: string;
  parameters: {
    intensity?: number;
    color?: string;
    speed?: number;
    audioReactive?: boolean;
  };
  shader_code?: string;
  audio_reactive: boolean;
  ai_driven: boolean;
}

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
      
      if (audioData.beat) {
        meshRef.current.rotation.y += 0.1;
      }
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
    varying vec3 vPosition;
    
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

  const particles = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    particles[i * 3] = (Math.random() - 0.5) * 50;
    particles[i * 3 + 1] = (Math.random() - 0.5) * 50;
    particles[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }

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
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
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
      />
    </points>
  );
}

function Scene({ effects, audioData }: { effects: HyperRealEffect[]; audioData: AudioAnalyzerData }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00D9FF" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#C0C0C0" />
      
      <AudioReactiveMesh audioData={audioData} />
      <ParticleField audioData={audioData} />
      
      <EffectComposer>
        <Bloom
          intensity={0.5 + audioData.amplitude}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.001 * audioData.amplitude, 0.001 * audioData.amplitude] as [number, number]}
        />
        <Noise opacity={0.05} />
      </EffectComposer>
    </>
  );
}

export const HyperRealEngine = () => {
  const [effects, setEffects] = useState<HyperRealEffect[]>([]);
  const [audioData, setAudioData] = useState<AudioAnalyzerData>({
    frequency: 0,
    amplitude: 0,
    beat: false
  });
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    loadEffects();
    initAudioAnalyzer();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      audioContextRef.current?.close();
    };
  }, []);

  const loadEffects = async () => {
    try {
      const { data, error } = await supabase
        .from('hyperreal_effects')
        .select('*');

      if (error) throw error;

      const formattedEffects = (data || []).map(effect => ({
        ...effect,
        parameters: typeof effect.parameters === 'string'
          ? JSON.parse(effect.parameters)
          : effect.parameters || {}
      }));

      setEffects(formattedEffects);
    } catch (error) {
      console.error('Error loading effects:', error);
    }
  };

  const initAudioAnalyzer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      
      analyser.fftSize = 512;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      analyzeAudio();
    } catch (error) {
      console.warn('Audio analyzer not available:', error);
      // Continue without audio reactivity
      simulateAudioData();
    }
  };

  const analyzeAudio = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    const timeArray = new Uint8Array(analyserRef.current.fftSize);

    const analyze = () => {
      analyserRef.current!.getByteFrequencyData(dataArray);
      analyserRef.current!.getByteTimeDomainData(timeArray);

      // Calculate average frequency and amplitude
      const avgFrequency = dataArray.reduce((a, b) => a + b) / dataArray.length / 255;
      const avgAmplitude = Math.abs(
        timeArray.reduce((sum, value) => sum + Math.abs(value - 128), 0) / timeArray.length / 128
      );

      // Detect beat (simple threshold-based)
      const beat = avgAmplitude > 0.7;

      setAudioData({
        frequency: avgFrequency,
        amplitude: avgAmplitude,
        beat
      });

      animationFrameRef.current = requestAnimationFrame(analyze);
    };

    analyze();
  };

  const simulateAudioData = () => {
    // Simulate audio data when microphone is not available
    const simulate = () => {
      const time = Date.now() / 1000;
      setAudioData({
        frequency: (Math.sin(time * 0.5) + 1) / 2,
        amplitude: (Math.sin(time * 2) + 1) / 4,
        beat: Math.random() > 0.9
      });
      animationFrameRef.current = requestAnimationFrame(simulate);
    };
    simulate();
  };

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <Scene effects={effects} audioData={audioData} />
      </Canvas>
    </div>
  );
};
