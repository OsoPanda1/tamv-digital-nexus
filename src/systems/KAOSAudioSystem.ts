// ============================================================================
// TAMV MD-X4™ - KAOS Audio System
// Advanced 3D/4D Spatial Audio Engine with Quantum Processing
// ============================================================================

export type AudioEnvironment = 'quantum' | 'forest' | 'cosmic' | 'crystal' | 'underwater' | 'volcanic';
export type BinauralPreset = 'focus' | 'relax' | 'meditate' | 'energy' | 'sleep' | 'creative';
export type NotificationType = 'achievement' | 'alert' | 'social' | 'celebration' | 'system' | 'error' | 'success';

export interface AudioConfig {
  masterVolume: number;
  spatialEnabled: boolean;
  binauralEnabled: boolean;
  hapticFeedback: boolean;
  quality: 'low' | 'medium' | 'high' | 'ultra';
}

export interface SoundSource {
  id: string;
  position: { x: number; y: number; z: number };
  type: 'ambient' | 'point' | 'directional';
  volume: number;
  loop: boolean;
  playing: boolean;
}

export interface BinauralConfig {
  baseFrequency: number;
  beatFrequency: number;
  duration: number;
  volume: number;
  waveform: OscillatorType;
}

// Binaural presets with scientifically-backed frequencies
const BINAURAL_PRESETS: Record<BinauralPreset, BinauralConfig> = {
  focus: { baseFrequency: 200, beatFrequency: 40, duration: 60000, volume: 0.3, waveform: 'sine' },      // Gamma waves
  relax: { baseFrequency: 180, beatFrequency: 10, duration: 60000, volume: 0.25, waveform: 'sine' },     // Alpha waves
  meditate: { baseFrequency: 150, beatFrequency: 7, duration: 60000, volume: 0.2, waveform: 'sine' },    // Theta waves
  energy: { baseFrequency: 250, beatFrequency: 14, duration: 30000, volume: 0.35, waveform: 'triangle' }, // Beta waves
  sleep: { baseFrequency: 140, beatFrequency: 4, duration: 120000, volume: 0.15, waveform: 'sine' },    // Delta waves
  creative: { baseFrequency: 160, beatFrequency: 7.83, duration: 60000, volume: 0.25, waveform: 'sine' }, // Schumann resonance
};

// Environment soundscapes configuration
const ENVIRONMENT_SOUNDS: Record<AudioEnvironment, { frequencies: number[]; amplitudes: number[]; noiseType?: 'pink' | 'brown' | 'white' }> = {
  quantum: { frequencies: [432, 528, 639], amplitudes: [0.3, 0.2, 0.15], noiseType: 'pink' },
  forest: { frequencies: [220, 330, 440], amplitudes: [0.2, 0.15, 0.1], noiseType: 'pink' },
  cosmic: { frequencies: [136.1, 172.0, 246.0], amplitudes: [0.25, 0.2, 0.15], noiseType: 'brown' },
  crystal: { frequencies: [528, 741, 852], amplitudes: [0.2, 0.15, 0.1], noiseType: 'white' },
  underwater: { frequencies: [110, 165, 220], amplitudes: [0.3, 0.25, 0.2], noiseType: 'brown' },
  volcanic: { frequencies: [80, 120, 160], amplitudes: [0.35, 0.3, 0.25], noiseType: 'pink' },
};

// Notification sound patterns
const NOTIFICATION_PATTERNS: Record<NotificationType, { frequencies: number[]; durations: number[]; type: OscillatorType }> = {
  achievement: { frequencies: [523.25, 659.25, 783.99, 1046.50], durations: [100, 100, 100, 200], type: 'sine' },
  celebration: { frequencies: [523.25, 659.25, 783.99, 659.25, 1046.50], durations: [80, 80, 80, 80, 200], type: 'sine' },
  alert: { frequencies: [880, 440, 880], durations: [150, 150, 150], type: 'square' },
  social: { frequencies: [523.25, 587.33, 659.25], durations: [100, 100, 150], type: 'sine' },
  system: { frequencies: [440, 523.25], durations: [100, 150], type: 'sine' },
  error: { frequencies: [220, 196, 175], durations: [150, 150, 200], type: 'sawtooth' },
  success: { frequencies: [392, 523.25, 659.25], durations: [100, 100, 200], type: 'sine' },
};

/**
 * KAOS Audio System - Main Audio Engine Class
 */
export class KAOSAudioSystem {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private spatialListener: AudioListener | null = null;
  private activeSources: Map<string, { source: AudioBufferSourceNode | OscillatorNode; panner: PannerNode; gain: GainNode }> = new Map();
  private binauralOscillators: { left: OscillatorNode; right: OscillatorNode } | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private config: AudioConfig = {
    masterVolume: 0.8,
    spatialEnabled: true,
    binauralEnabled: true,
    hapticFeedback: false,
    quality: 'high',
  };
  private isInitialized = false;

  /**
   * Initialize the audio system
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create master gain
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = this.config.masterVolume;
      this.masterGain.connect(this.audioContext.destination);

      // Setup spatial listener
      this.spatialListener = this.audioContext.listener;

      // Resume if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.isInitialized = true;
      console.log('[KAOS] Audio system initialized successfully');
      return true;
    } catch (error) {
      console.error('[KAOS] Failed to initialize audio system:', error);
      return false;
    }
  }

  /**
   * Resume audio context (required after user interaction)
   */
  async resume(): Promise<void> {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Set master volume
   */
  setMasterVolume(volume: number): void {
    this.config.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.value = this.config.masterVolume;
    }
  }

  /**
   * Update listener position for 3D audio
   */
  setListenerPosition(x: number, y: number, z: number): void {
    if (!this.audioContext || !this.spatialListener) return;

    const listener = this.spatialListener;
    if (listener.positionX) {
      listener.positionX.value = x;
      listener.positionY.value = y;
      listener.positionZ.value = z;
    }
  }

  /**
   * Set listener orientation
   */
  setListenerOrientation(forwardX: number, forwardY: number, forwardZ: number, upX: number, upY: number, upZ: number): void {
    if (!this.audioContext || !this.spatialListener) return;

    const listener = this.spatialListener;
    if (listener.forwardX) {
      listener.forwardX.value = forwardX;
      listener.forwardY.value = forwardY;
      listener.forwardZ.value = forwardZ;
      listener.upX.value = upX;
      listener.upY.value = upY;
      listener.upZ.value = upZ;
    }
  }

  /**
   * Play binaural beats with preset
   */
  async playBinauralPreset(preset: BinauralPreset, duration?: number): Promise<void> {
    const config = BINAURAL_PRESETS[preset];
    await this.playBinauralBeat(
      config.beatFrequency,
      duration || config.duration,
      config.baseFrequency,
      config.volume,
      config.waveform
    );
  }

  /**
   * Play custom binaural beats
   */
  async playBinauralBeat(
    beatFrequency: number,
    duration: number = 60000,
    baseFrequency: number = 200,
    volume: number = 0.3,
    waveform: OscillatorType = 'sine'
  ): Promise<void> {
    if (!this.audioContext || !this.masterGain) {
      await this.initialize();
    }
    if (!this.audioContext || !this.masterGain) return;

    // Stop existing binaural
    this.stopBinaural();

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Create stereo merger
    const merger = ctx.createChannelMerger(2);
    const leftGain = ctx.createGain();
    const rightGain = ctx.createGain();

    // Create oscillators
    const leftOsc = ctx.createOscillator();
    const rightOsc = ctx.createOscillator();

    leftOsc.type = waveform;
    rightOsc.type = waveform;
    leftOsc.frequency.value = baseFrequency;
    rightOsc.frequency.value = baseFrequency + beatFrequency;

    leftGain.gain.value = volume;
    rightGain.gain.value = volume;

    // Connect left channel
    leftOsc.connect(leftGain);
    leftGain.connect(merger, 0, 0);

    // Connect right channel
    rightOsc.connect(rightGain);
    rightGain.connect(merger, 0, 1);

    // Connect to output
    merger.connect(this.masterGain);

    // Start oscillators
    leftOsc.start(now);
    rightOsc.start(now);

    // Schedule stop
    const stopTime = now + duration / 1000;
    leftOsc.stop(stopTime);
    rightOsc.stop(stopTime);

    this.binauralOscillators = { left: leftOsc, right: rightOsc };

    // Auto-cleanup after duration
    setTimeout(() => {
      this.binauralOscillators = null;
    }, duration);
  }

  /**
   * Stop binaural beats
   */
  stopBinaural(): void {
    if (this.binauralOscillators) {
      try {
        this.binauralOscillators.left.stop();
        this.binauralOscillators.right.stop();
      } catch (e) {
        // Already stopped
      }
      this.binauralOscillators = null;
    }
  }

  /**
   * Play notification sound
   */
  async playNotification(
    type: NotificationType,
    position?: { x: number; y: number; z: number }
  ): Promise<void> {
    if (!this.audioContext || !this.masterGain) {
      await this.initialize();
    }
    if (!this.audioContext || !this.masterGain) return;

    const ctx = this.audioContext;
    const pattern = NOTIFICATION_PATTERNS[type];
    const now = ctx.currentTime;

    // Create oscillator and panner for spatial audio
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = this.config.spatialEnabled && position ? this.createPanner(position) : null;

    osc.type = pattern.type;

    // Schedule frequency sequence
    let time = now;
    pattern.frequencies.forEach((freq, i) => {
      osc.frequency.setValueAtTime(freq, time);
      time += pattern.durations[i] / 1000;
    });

    // Envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, time);

    // Connect nodes
    osc.connect(gain);
    if (panner) {
      gain.connect(panner);
      panner.connect(this.masterGain!);
    } else {
      gain.connect(this.masterGain!);
    }

    osc.start(now);
    osc.stop(time);

    // Trigger haptic feedback if enabled
    if (this.config.hapticFeedback && navigator.vibrate) {
      navigator.vibrate(type === 'error' ? [100, 50, 100] : [50]);
    }
  }

  /**
   * Create 3D panner node
   */
  private createPanner(position: { x: number; y: number; z: number }): PannerNode {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const panner = this.audioContext.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 1;
    panner.maxDistance = 10000;
    panner.rolloffFactor = 1;
    panner.coneInnerAngle = 360;
    panner.coneOuterAngle = 0;
    panner.coneOuterGain = 0;

    panner.positionX.value = position.x;
    panner.positionY.value = position.y;
    panner.positionZ.value = position.z;

    return panner;
  }

  /**
   * Play environment soundscape
   */
  async playEnvironment(environment: AudioEnvironment, duration: number = 0): Promise<void> {
    if (!this.audioContext || !this.masterGain) {
      await this.initialize();
    }
    if (!this.audioContext || !this.masterGain) return;

    const ctx = this.audioContext;
    const config = ENVIRONMENT_SOUNDS[environment];

    // Create noise buffer
    const noiseBuffer = this.createNoiseBuffer(config.noiseType || 'pink', ctx.sampleRate * 2);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Create filter for noise
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 500;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.1;

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    // Create tonal components
    const oscillators: OscillatorNode[] = [];
    config.frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = config.amplitudes[i] * 0.5;

      osc.connect(gain);
      gain.connect(this.masterGain!);
      oscillators.push(osc);
    });

    // Start all sources
    const now = ctx.currentTime;
    noiseSource.start(now);
    oscillators.forEach(osc => osc.start(now));

    this.noiseSource = noiseSource;

    // If duration specified, stop after duration
    if (duration > 0) {
      const stopTime = now + duration / 1000;
      noiseSource.stop(stopTime);
      oscillators.forEach(osc => osc.stop(stopTime));
    }
  }

  /**
   * Stop environment sounds
   */
  stopEnvironment(): void {
    if (this.noiseSource) {
      try {
        this.noiseSource.stop();
      } catch (e) {
        // Already stopped
      }
      this.noiseSource = null;
    }
  }

  /**
   * Create noise buffer
   */
  private createNoiseBuffer(type: 'pink' | 'brown' | 'white', length: number): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const buffer = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    if (type === 'white') {
      for (let i = 0; i < length; i++) {
        left[i] = Math.random() * 2 - 1;
        right[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750758;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;
        left[i] = pink * 0.11;
        right[i] = pink * 0.11;
      }
    } else { // brown
      let lastOutL = 0, lastOutR = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        left[i] = (lastOutL + 0.02 * white) / 1.02;
        lastOutL = left[i];
        left[i] *= 3.5;
        
        const whiteR = Math.random() * 2 - 1;
        right[i] = (lastOutR + 0.02 * whiteR) / 1.02;
        lastOutR = right[i];
        right[i] *= 3.5;
      }
    }

    return buffer;
  }

  /**
   * Create spatial sound source
   */
  createSpatialSource(id: string, position: { x: number; y: number; z: number }, type: 'ambient' | 'point' | 'directional' = 'point'): SoundSource {
    const source: SoundSource = {
      id,
      position,
      type,
      volume: 1,
      loop: false,
      playing: false,
    };

    return source;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<AudioConfig>): void {
    this.config = { ...this.config, ...config };
    if (config.masterVolume !== undefined) {
      this.setMasterVolume(config.masterVolume);
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): AudioConfig {
    return { ...this.config };
  }

  /**
   * Check if audio is supported
   */
  static isSupported(): boolean {
    return typeof window !== 'undefined' && 
      (window.AudioContext !== undefined || (window as any).webkitAudioContext !== undefined);
  }

  /**
   * Cleanup and destroy
   */
  destroy(): void {
    this.stopBinaural();
    this.stopEnvironment();
    
    this.activeSources.forEach(({ source }) => {
      try {
        source.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.activeSources.clear();

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.isInitialized = false;
    console.log('[KAOS] Audio system destroyed');
  }
}

// Singleton instance
let kaosInstance: KAOSAudioSystem | null = null;

export const getKAOSInstance = (): KAOSAudioSystem => {
  if (!kaosInstance) {
    kaosInstance = new KAOSAudioSystem();
  }
  return kaosInstance;
};

export default KAOSAudioSystem;