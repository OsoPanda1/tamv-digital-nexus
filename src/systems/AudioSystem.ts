// ============================================================================
// TAMV MD-X4â"¢ - Immersive Audio System
// Background music, spatial audio, and voice synthesis with effects
// ============================================================================

export type AudioTrack = 
  | 'techno-house-intro'
  | 'ambient-space'
  | 'quantum-pulse'
  | 'meditation'
  | 'focus'
  | 'celebration';

export type VoiceProfile = 
  | 'isabella-human'
  | 'isabella-epic'
  | 'isabella-calm'
  | 'isabella-leader';

// ============================================================================
// Audio Configuration
// ============================================================================

export const AUDIO_CONFIG = {
  tracks: {
    'techno-house-intro': {
      url: '/audio/techno-house-intro.mp3',
      bpm: 128,
      volume: 0.4,
      loop: true,
      fadeIn: 2000,
      fadeOut: 1500,
    },
    'ambient-space': {
      url: '/audio/ambient-space.mp3',
      bpm: 60,
      volume: 0.3,
      loop: true,
      fadeIn: 3000,
      fadeOut: 2000,
    },
    'quantum-pulse': {
      url: '/audio/quantum-pulse.mp3',
      bpm: 140,
      volume: 0.35,
      loop: true,
      fadeIn: 1500,
      fadeOut: 1000,
    },
    'meditation': {
      url: '/audio/meditation.mp3',
      bpm: 40,
      volume: 0.25,
      loop: true,
      fadeIn: 4000,
      fadeOut: 3000,
    },
    'focus': {
      url: '/audio/focus.mp3',
      bpm: 80,
      volume: 0.3,
      loop: true,
      fadeIn: 2000,
      fadeOut: 1500,
    },
    'celebration': {
      url: '/audio/celebration.mp3',
      bpm: 150,
      volume: 0.45,
      loop: false,
      fadeIn: 500,
      fadeOut: 2000,
    },
  },
  voices: {
    'isabella-human': {
      lang: 'es-MX',
      rate: 0.92,
      pitch: 0.95,
      volume: 1.0,
      echo: 0.3,
      reverb: 0.4,
    },
    'isabella-epic': {
      lang: 'es-MX',
      rate: 0.85,
      pitch: 0.88,
      volume: 1.0,
      echo: 0.5,
      reverb: 0.6,
    },
    'isabella-calm': {
      lang: 'es-MX',
      rate: 0.95,
      pitch: 1.0,
      volume: 0.9,
      echo: 0.2,
      reverb: 0.3,
    },
    'isabella-leader': {
      lang: 'es-MX',
      rate: 0.88,
      pitch: 0.90,
      volume: 1.0,
      echo: 0.4,
      reverb: 0.5,
    },
  },
};

// ============================================================================
// Audio Engine Class
// ============================================================================

export class ImmersiveAudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private delayNode: DelayNode | null = null;
  private currentTrack: HTMLAudioElement | null = null;
  private trackSource: MediaElementAudioSourceNode | null = null;
  private trackGain: GainNode | null = null;
  private isInitialized: boolean = false;
  private currentTrackName: AudioTrack | null = null;
  
  // Singleton pattern
  private static instance: ImmersiveAudioEngine;
  
  static getInstance(): ImmersiveAudioEngine {
    if (!ImmersiveAudioEngine.instance) {
      ImmersiveAudioEngine.instance = new ImmersiveAudioEngine();
    }
    return ImmersiveAudioEngine.instance;
  }
  
  private constructor() {}
  
  // ============================================================================
  // Initialization
  // ============================================================================
  
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Master gain
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.8;
      this.masterGain.connect(this.audioContext.destination);
      
      // Reverb (convolver)
      this.reverbNode = this.audioContext.createConvolver();
      this.reverbNode.buffer = this.createReverbImpulse(2.5, 2.0);
      this.reverbNode.connect(this.masterGain);
      
      // Delay (echo)
      this.delayNode = this.audioContext.createDelay(1.0);
      this.delayNode.delayTime.value = 0.25;
      const feedbackGain = this.audioContext.createGain();
      feedbackGain.gain.value = 0.35;
      this.delayNode.connect(feedbackGain);
      feedbackGain.connect(this.delayNode);
      this.delayNode.connect(this.reverbNode);
      
      this.isInitialized = true;
      console.log('ðÅâ Immersive Audio Engine initialized');
    } catch (error) {
      console.error('Failed to initialize audio engine:', error);
    }
  }
  
  private createReverbImpulse(duration: number, decay: number): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not initialized');
    
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        // Create a more natural reverb tail
        const t = i / sampleRate;
        const envelope = Math.exp(-t * decay) * (1 - Math.random() * 0.2);
        channelData[i] = (Math.random() * 2 - 1) * envelope;
      }
    }
    
    return buffer;
  }
  
  // ============================================================================
  // Background Music
  // ============================================================================
  
  async playTrack(trackName: AudioTrack, volume?: number): Promise<void> {
    await this.initialize();
    
    const config = AUDIO_CONFIG.tracks[trackName];
    if (!config) {
      console.error(`Track not found: ${trackName}`);
      return;
    }
    
    // Stop current track
    if (this.currentTrack) {
      await this.stopTrack();
    }
    
    // Create new audio element
    this.currentTrack = new Audio(config.url);
    this.currentTrack.loop = config.loop;
    this.currentTrack.volume = volume ?? config.volume;
    
    // Connect to audio context
    if (this.audioContext && this.masterGain) {
      this.trackSource = this.audioContext.createMediaElementSource(this.currentTrack);
      this.trackGain = this.audioContext.createGain();
      this.trackGain.gain.value = 0;
      
      this.trackSource.connect(this.trackGain);
      this.trackGain.connect(this.masterGain);
      
      // Fade in
      this.trackGain.gain.linearRampToValueAtTime(
        volume ?? config.volume,
        this.audioContext.currentTime + config.fadeIn / 1000
      );
    }
    
    try {
      await this.currentTrack.play();
      this.currentTrackName = trackName;
      console.log(`ðÅâ Playing track: ${trackName}`);
    } catch (error) {
      console.log('Autoplay blocked, user interaction required');
    }
  }
  
  async stopTrack(): Promise<void> {
    if (!this.currentTrack || !this.trackGain || !this.audioContext) return;
    
    const config = this.currentTrackName ? AUDIO_CONFIG.tracks[this.currentTrackName] : null;
    const fadeOut = config?.fadeOut ?? 1000;
    
    // Fade out
    this.trackGain.gain.linearRampToValueAtTime(
      0,
      this.audioContext.currentTime + fadeOut / 1000
    );
    
    await new Promise(resolve => setTimeout(resolve, fadeOut));
    
    this.currentTrack.pause();
    this.currentTrack.currentTime = 0;
    this.currentTrack = null;
    this.currentTrackName = null;
  }
  
  setTrackVolume(volume: number): void {
    if (this.trackGain && this.audioContext) {
      this.trackGain.gain.linearRampToValueAtTime(
        volume,
        this.audioContext.currentTime + 0.1
      );
    }
    if (this.currentTrack) {
      this.currentTrack.volume = volume;
    }
  }
  
  // ============================================================================
  // Voice Synthesis
  // ============================================================================
  
  speak(text: string, profile: VoiceProfile = 'isabella-human'): Promise<void> {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) {
        console.warn('Speech synthesis not supported');
        resolve();
        return;
      }
      
      const config = AUDIO_CONFIG.voices[profile];
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      
      // Find best Spanish voice
      const spanishVoices = voices.filter(v => 
        v.lang.startsWith('es') && !v.name.toLowerCase().includes('google translate')
      );
      
      // Prefer high-quality voices
      const preferredVoice = spanishVoices.find(v => 
        v.name.includes('Microsoft') || 
        v.name.includes('Sabina') ||
        v.name.includes('Helena') ||
        v.name.includes('Paulina') ||
        v.localService
      ) || spanishVoices[0];
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.lang = config.lang;
      utterance.rate = config.rate;
      utterance.pitch = config.pitch;
      utterance.volume = config.volume;
      
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    });
  }
  
  // ============================================================================
  // Sound Effects
  // ============================================================================
  
  playExplosion(): void {
    if (!this.audioContext || !this.masterGain) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(20, this.audioContext.currentTime + 0.8);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.8);
    
    gainNode.gain.setValueAtTime(0.6, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.0);
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.reverbNode || this.masterGain);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 1.0);
  }
  
  playWhoosh(): void {
    if (!this.audioContext || !this.masterGain) return;
    
    const bufferSize = this.audioContext.sampleRate * 0.4;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.4);
    filter.Q.value = 2;
    
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
    
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    source.start();
  }
  
  playChime(frequency: number = 880, duration: number = 0.5): void {
    if (!this.audioContext || !this.masterGain) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.reverbNode || this.masterGain);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }
  
  // ============================================================================
  // Binaural Beats (for focus/meditation)
  // ============================================================================
  
  playBinauralBeats(baseFreq: number = 200, beatFreq: number = 10, duration: number = 60): void {
    if (!this.audioContext || !this.masterGain) return;
    
    const leftOsc = this.audioContext.createOscillator();
    const rightOsc = this.audioContext.createOscillator();
    const merger = this.audioContext.createChannelMerger(2);
    const gainNode = this.audioContext.createGain();
    
    leftOsc.frequency.value = baseFreq;
    rightOsc.frequency.value = baseFreq + beatFreq;
    
    leftOsc.type = 'sine';
    rightOsc.type = 'sine';
    
    gainNode.gain.value = 0.15;
    
    leftOsc.connect(merger, 0, 0);
    rightOsc.connect(merger, 0, 1);
    merger.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    leftOsc.start();
    rightOsc.start();
    
    setTimeout(() => {
      leftOsc.stop();
      rightOsc.stop();
    }, duration * 1000);
  }
  
  // ============================================================================
  // Cleanup
  // ============================================================================
  
  dispose(): void {
    this.stopTrack();
    window.speechSynthesis.cancel();
    
    if (this.audioContext) {
      this.audioContext.close();
    }
    
    this.isInitialized = false;
  }
}

// Export singleton instance
export const audioEngine = ImmersiveAudioEngine.getInstance();

// ============================================================================
// React Hook for Audio
// ============================================================================

import { useEffect, useRef, useCallback } from 'react';

export function useAudio() {
  const engineRef = useRef<ImmersiveAudioEngine>(audioEngine);
  
  useEffect(() => {
    // Initialize on first use
    engineRef.current.initialize();
    
    return () => {
      // Don't dispose on unmount, keep the singleton
    };
  }, []);
  
  const playTrack = useCallback(async (track: AudioTrack, volume?: number) => {
    await engineRef.current.playTrack(track, volume);
  }, []);
  
  const stopTrack = useCallback(async () => {
    await engineRef.current.stopTrack();
  }, []);
  
  const speak = useCallback(async (text: string, profile?: VoiceProfile) => {
    await engineRef.current.speak(text, profile);
  }, []);
  
  const playExplosion = useCallback(() => {
    engineRef.current.playExplosion();
  }, []);
  
  const playWhoosh = useCallback(() => {
    engineRef.current.playWhoosh();
  }, []);
  
  const playChime = useCallback((freq?: number, dur?: number) => {
    engineRef.current.playChime(freq, dur);
  }, []);
  
  return {
    playTrack,
    stopTrack,
    speak,
    playExplosion,
    playWhoosh,
    playChime,
  };
}