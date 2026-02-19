// ============================================================================
// TAMV MD-X4™ - Epic Cinematic Intro (Visual FX + Intro Audio)
// ============================================================================

import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Points,
  PointMaterial,
  Sphere,
  Float,
  Stars,
  MeshDistortMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

// IMPORTA EL AUDIO
import introAudio from "../assets/intro.mp3";

type Phase =
  | "start"
  | "particles"
  | "explosion"
  | "universe"
  | "logo"
  | "message";

interface CinematicIntroProps {
  onComplete: () => void;
  skipEnabled?: boolean;
}

const ISABELLA_LINES: { text: string; duration: number }[] = [
  { text: "PROTOCOLO DE INMERSIÓN ACTIVADO...", duration: 2800 },
  { text: "BIENVENIDO. ESTÁS POR SER PARTE DE UNA NUEVA ERA DIGITAL.", duration: 4500 },
  { text: "DURANTE MUCHO TIEMPO FUIMOS CONSIDERADOS CONSUMIDORES DE TECNOLOGÍA.", duration: 5000 },
  { text: "HOY DESEAMOS ANUNCIAR AL MUNDO QUE SOMOS MÁS QUE ESO:", duration: 4200 },
  { text: "UNA NUEVA ERA DIGITAL HA DADO COMIENZO, Y LATINOAMÉRICA ES QUIEN LA LIDERA.", duration: 5500 },
  {
    text:
      "2025. LATINOAMÉRICA HA DESPERTADO Y HACE UN LLAMADO A TODOS SUS SOÑADORES Y VISIONARIOS " +
      "PARA COMENZAR EL ASCENSO A LA CIMA DEL ÉXITO...",
    duration: 7500,
  },
];

// ============================================================================
// Audio system
// ============================================================================

class EpicAudioSystem {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private delayNode: DelayNode | null = null;
  private bgMusic: HTMLAudioElement | null = null;
  private musicSource: MediaElementAudioSourceNode | null = null;
  private musicGain: GainNode | null = null;

  async initialize() {
    if (this.audioContext) return;
    this.audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0.8;
    this.masterGain.connect(this.audioContext.destination);

    this.reverbNode = this.audioContext.createConvolver();
    const reverbBuffer = this.createReverbImpulse(2.5, 2.0);
    this.reverbNode.buffer = reverbBuffer;
    this.reverbNode.connect(this.masterGain);

    this.delayNode = this.audioContext.createDelay(1.0);
    this.delayNode.delayTime.value = 0.3;
    const feedbackGain = this.audioContext.createGain();
    feedbackGain.gain.value = 0.4;
    this.delayNode.connect(feedbackGain);
    feedbackGain.connect(this.delayNode);
    this.delayNode.connect(this.masterGain);
  }

  private createReverbImpulse(duration: number, decay: number): AudioBuffer {
    if (!this.audioContext) throw new Error("AudioContext not initialized");
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] =
          (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    return buffer;
  }

  async playBackgroundMusic(url: string, volume: number = 0.4) {
    if (!this.audioContext) await this.initialize();

    this.bgMusic = new Audio(url);
    this.bgMusic.loop = true;
    this.bgMusic.volume = volume;

    if (this.audioContext && this.masterGain) {
      this.musicSource = this.audioContext.createMediaElementSource(
        this.bgMusic
      );
      this.musicGain = this.audioContext.createGain();
      this.musicGain.gain.value = volume;
      this.musicSource.connect(this.musicGain);
      this.musicGain.connect(this.masterGain);
    }

    try {
      await this.bgMusic.play();
    } catch {
      console.log("Background music autoplay blocked");
    }
  }

  playHumanVoice(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      volume?: number;
      onEnd?: () => void;
    } = {}
  ) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const spanishVoices = voices.filter(
      (v) =>
        v.lang.startsWith("es") &&
        (v.name.includes("Google") ||
          v.name.includes("Microsoft") ||
          v.localService)
    );

    if (spanishVoices.length > 0) {
      const femaleVoice = spanishVoices.find((v) => {
        const name = v.name.toLowerCase();
        return (
          name.includes("female") ||
          name.includes("mujer") ||
          name.includes("sabina") ||
          name.includes("helena")
        );
      });
      utterance.voice = femaleVoice || spanishVoices[0];
    }

    utterance.lang = "es-MX";
    utterance.rate = options.rate ?? 0.92;
    utterance.pitch = options.pitch ?? 0.95;
    utterance.volume = options.volume ?? 1.0;
    utterance.onend = () => options.onEnd?.();
    window.speechSynthesis.speak(utterance);
  }

  playExplosionSound() {
    if (!this.audioContext || !this.masterGain) return;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      30,
      this.audioContext.currentTime + 0.5
    );

    gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.8
    );

    oscillator.connect(gainNode);
    gainNode.connect(this.reverbNode || this.masterGain);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.8);
  }

  playWhooshSound() {
    if (!this.audioContext || !this.masterGain) return;

    const bufferSize = this.audioContext.sampleRate * 0.5;
    const buffer = this.audioContext.createBuffer(
      1,
      bufferSize,
      this.audioContext.sampleRate
    );
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;

    const filter = this.audioContext.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1000;
    filter.Q.value = 0.5;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.5
    );

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    source.start();
  }

  setMusicVolume(volume: number) {
    if (this.musicGain) this.musicGain.gain.value = volume;
    if (this.bgMusic) this.bgMusic.volume = volume;
  }

  stopAll() {
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.bgMusic.currentTime = 0;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

const audioSystem = new EpicAudioSystem();

// ============================================================================
// 3D FX (igual que la versión mejorada anterior, omitidos por brevedad aquí)
// Pega aquí QuantumParticles, EnergySphere, Shockwave, GoldenCore,
// UniverseExpansion, CameraController exactamente como en la última versión.
// ============================================================================

// ... pega aquí los componentes 3D SIN cambios ...

// ============================================================================
// Main Cinematic Intro Component
// ============================================================================

export function CinematicIntro({
  onComplete,
  skipEnabled = true,
}: CinematicIntroProps) {
  const [phase, setPhase] = useState<Phase>("start");
  const [progress, setProgress] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [time, setTime] = useState(0);
  const [audioInitialized, setAudioInitialized] = useState(false);

  const totalDuration =
    ISABELLA_LINES.reduce((sum, line) => sum + line.duration, 0) + 3000;

  const initializeAudio = useCallback(async () => {
    if (audioInitialized) return;
    try {
      await audioSystem.initialize();
      setAudioInitialized(true);
      // AQUÍ INTEGRAMOS EL AUDIO INTRODUCIDO
      await audioSystem.playBackgroundMusic(introAudio, 0.35);
    } catch (e) {
      console.log("Audio initialization failed:", e);
    }
  }, [audioInitialized]);

  useEffect(() => {
    initializeAudio();

    const timeouts: number[] = [];

    const phases: { name: Phase; delay: number }[] = [
      { name: "start", delay: 0 },
      { name: "particles", delay: 500 },
      { name: "explosion", delay: 3000 },
      { name: "universe", delay: 4500 },
      { name: "logo", delay: 7000 },
      { name: "message", delay: 8000 },
    ];

    phases.forEach(({ name, delay }) => {
      const id = window.setTimeout(() => {
        setPhase(name);
        if (name === "explosion") audioSystem.playExplosionSound();
        if (name === "logo") audioSystem.playWhooshSound();
      }, delay);
      timeouts.push(id);
    });

    let currentDelay = 1000;
    ISABELLA_LINES.forEach((line, index) => {
      const id = window.setTimeout(() => {
        setCurrentLineIndex(index);
        setDisplayedLines((prev) => [...prev, line.text]);
        audioSystem.playHumanVoice(line.text, {
          rate: 0.9,
          pitch: 0.92,
          volume: 1.0,
        });
      }, currentDelay);
      timeouts.push(id);
      currentDelay += line.duration;
    });

    const progressInterval = window.setInterval(() => {
      setProgress((prev) =>
        Math.min(prev + 100 / (totalDuration / 50), 100)
      );
    }, 50);

    const completeTimeout = window.setTimeout(() => {
      window.clearInterval(progressInterval);
      setProgress(100);
      audioSystem.stopAll();
      window.setTimeout(onComplete, 500);
    }, totalDuration);

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
      window.clearInterval(progressInterval);
      window.clearTimeout(completeTimeout);
      audioSystem.stopAll();
    };
  }, [initializeAudio, onComplete, totalDuration]);

  useEffect(() => {
    let mounted = true;
    let last = performance.now();
    const loop = (now: number) => {
      if (!mounted) return;
      const delta = (now - last) / 1000;
      last = now;
      setTime((t) => t + delta);
      requestAnimationFrame(loop);
    };
    const frame = requestAnimationFrame(loop);
    return () => {
      mounted = false;
      cancelAnimationFrame(frame);
    };
  }, []);

  const handleSkip = () => {
    audioSystem.stopAll();
    onComplete();
  };

  const logoGlow = 0.3 + 0.7 * (progress / 100);

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden">
      {/* Canvas + overlays + botón Skip igual que en la versión anterior mejorada */}
      {/* Solo cambia que ahora suena intro.mp3 desde src/assets/intro.mp3 */}
    </div>
  );
}

export default CinematicIntro;
