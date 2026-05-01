/**
 * TAMV Audio System - Enhanced Sound Management
 * Provides unified audio playback with spatial audio, preloading, and fade effects
 */

import { binauralAudio, BinauralAudioEngine } from './binauralAudio';

// ============== TYPES ==============

export type TAMVSoundKey = 
  | 'open' 
  | 'close' 
  | 'click' 
  | 'notify' 
  | 'error' 
  | 'success' 
  | 'danger' 
  | 'info'
  | 'hover'
  | 'transition'
  | 'ambient'
  | 'quantum'
  | 'neural'
  | '祭祀'
  | 'notification'
  | 'message'
  | 'alarm'
  | 'scan'
  | 'activation';

export interface SoundConfig {
  url: string;
  volume?: number;
  loop?: boolean;
  preload?: boolean;
}

export interface PlayOptions {
  volume?: number;
  loop?: boolean;
  fadeIn?: number;
  fadeOut?: number;
  spatialPosition?: { x: number; y: number; z: number };
}

export interface TAMVSoundEntry {
  key: TAMVSoundKey;
  url: string;
  volume: number;
  preload: boolean;
  loop?: boolean;
}

// ============== SOUND DEFINITIONS ==============

export const TAMV_SOUNDS: Record<TAMVSoundKey, TAMVSoundEntry> = {
  open: { key: 'open', url: '/sounds/xr_open.mp3', volume: 0.6, preload: true },
  close: { key: 'close', url: '/sounds/xr_close.mp3', volume: 0.6, preload: true },
  click: { key: 'click', url: '/sounds/xr_click.mp3', volume: 0.5, preload: true },
  notify: { key: 'notify', url: '/sounds/xr_notify.mp3', volume: 0.7, preload: true },
  error: { key: 'error', url: '/sounds/xr_error.mp3', volume: 0.6, preload: true },
  success: { key: 'success', url: '/sounds/xr_success.mp3', volume: 0.7, preload: true },
  danger: { key: 'danger', url: '/sounds/xr_danger.mp3', volume: 0.8, preload: true },
  info: { key: 'info', url: '/sounds/xr_info.mp3', volume: 0.5, preload: true },
  hover: { key: 'hover', url: '/sounds/xr_hover.mp3', volume: 0.3, preload: false },
  transition: { key: 'transition', url: '/sounds/xr_transition.mp3', volume: 0.4, preload: false },
  ambient: { key: 'ambient', url: '/sounds/xr_ambient.mp3', volume: 0.2, preload: false, loop: true },
  quantum: { key: 'quantum', url: '/sounds/xr_quantum.mp3', volume: 0.5, preload: false },
  neural: { key: 'neural', url: '/sounds/xr_neural.mp3', volume: 0.5, preload: false },
  祭祀: { key: '祭祀', url: '/sounds/xr_ceremony.mp3', volume: 0.6, preload: false },
  notification: { key: 'notification', url: '/sounds/xr_notify.mp3', volume: 0.7, preload: true },
  message: { key: 'message', url: '/sounds/xr_message.mp3', volume: 0.5, preload: false },
  alarm: { key: 'alarm', url: '/sounds/xr_alarm.mp3', volume: 0.8, preload: false },
  scan: { key: 'scan', url: '/sounds/xr_scan.mp3', volume: 0.4, preload: false },
  activation: { key: 'activation', url: '/sounds/xr_activation.mp3', volume: 0.6, preload: false },
};

// Legacy compatibility
export const TAMV_SOUNDS_LEGACY: Record<string, string> = {
  open: "/sounds/xr_open.mp3",
  close: "/sounds/xr_close.mp3",
  click: "/sounds/xr_click.mp3",
  notify: "/sounds/xr_notify.mp3",
  error: "/sounds/xr_error.mp3",
  success: "/sounds/xr_success.mp3",
  danger: "/sounds/xr_danger.mp3",
  info: "/sounds/xr_info.mp3",
};

// ============== AUDIO CACHE ==============

class AudioCache {
  private cache: Map<string, HTMLAudioElement> = new Map();
  private loading: Map<string, Promise<HTMLAudioElement>> = new Map();

  get(url: string): HTMLAudioElement | null {
    return this.cache.get(url) || null;
  }

  async preload(url: string): Promise<HTMLAudioElement> {
    // Return cached if available
    const cached = this.cache.get(url);
    if (cached) return cached;

    // Return existing promise if loading
    const existingPromise = this.loading.get(url);
    if (existingPromise) return existingPromise;

    // Start loading
    const loadPromise = new Promise<HTMLAudioElement>((resolve, reject) => {
      const audio = new Audio();
      audio.preload = 'auto';
      
      audio.addEventListener('canplaythrough', () => {
        this.cache.set(url, audio);
        this.loading.delete(url);
        resolve(audio);
      }, { once: true });

      audio.addEventListener('error', (e) => {
        this.loading.delete(url);
        reject(e);
      }, { once: true });

      audio.src = url;
      audio.load();
    });

    this.loading.set(url, loadPromise);
    return loadPromise;
  }

  clear(): void {
    this.cache.forEach((audio) => {
      audio.pause();
      audio.src = '';
    });
    this.cache.clear();
    this.loading.clear();
  }
}

const audioCache = new AudioCache();

// ============== MAIN PLAY FUNCTION ==============

/**
 * Play a TAMV sound with optional effects
 * @param name - Sound key or custom URL
 * @param options - Playback options (volume, loop, fade, spatial)
 * @returns Promise that resolves when playback starts
 */
export async function playSound(
  name: TAMVSoundKey | string,
  options: PlayOptions = {}
): Promise<void> {
  const { 
    volume = 0.6, 
    loop = false, 
    fadeIn = 0,
    fadeOut = 0,
    spatialPosition 
  } = options;

  // Determine URL
  let url: string;
  if (TAMV_SOUNDS[name as TAMVSoundKey]) {
    url = TAMV_SOUNDS[name as TAMVSoundKey].url;
  } else if (TAMV_SOUNDS_LEGACY[name]) {
    url = TAMV_SOUNDS_LEGACY[name];
  } else {
    // Custom URL
    url = name;
  }

  // If spatial audio is requested, use BinauralAudioEngine
  if (spatialPosition) {
    const typeMap: Record<string, 'achievement' | 'alert' | 'social' | 'celebration' | 'system'> = {
      notify: 'alert',
      success: 'achievement',
      error: 'alert',
      danger: 'alert',
      info: 'system',
    };
    const type = typeMap[name] || 'system';
    await binauralAudio.playNotificationSound(type, spatialPosition);
    return;
  }

  // Standard audio playback
  try {
    const audio = await audioCache.preload(url);
    
    // Reset audio state
    audio.currentTime = 0;
    audio.loop = loop;
    audio.volume = 0;

    // Apply fade in
    if (fadeIn > 0) {
      audio.volume = 0;
      audio.play();
      const fadeInterval = volume / (fadeIn * 60); // Assuming 60fps
      const fadeStep = () => {
        if (audio.volume < volume) {
          audio.volume = Math.min(volume, audio.volume + fadeInterval);
          requestAnimationFrame(fadeStep);
        }
      };
      fadeStep();
    } else {
      audio.volume = volume;
      await audio.play();
    }

    // Apply fade out on end if needed
    if (fadeOut > 0 && !loop) {
      audio.addEventListener('timeupdate', () => {
        if (audio.duration - audio.currentTime <= fadeOut / 1000) {
          const fadeInterval = volume / (fadeOut * 60);
          const fadeStep = () => {
            if (audio.volume > 0.01) {
              audio.volume = Math.max(0, audio.volume - fadeInterval);
              requestAnimationFrame(fadeStep);
            } else {
              audio.pause();
            }
          };
          fadeStep();
        }
      }, { once: true });
    }
  } catch (error) {
    console.warn(`[TAMV Audio] Failed to play sound: ${url}`, error);
  }
}

// ============== ADVANCED FUNCTIONS ==============

/**
 * Play multiple sounds simultaneously (chord/harmony)
 */
export function playChord(
  sounds: TAMVSoundKey[],
  volume: number = 0.5
): void {
  sounds.forEach((sound, i) => {
    setTimeout(() => {
      playSound(sound, { volume });
    }, i * 50); // Stagger slightly
  });
}

/**
 * Play a sequence of sounds
 */
export async function playSequence(
  sounds: Array<{ sound: TAMVSoundKey; delay?: number }>
): Promise<void> {
  for (const { sound, delay = 0 } of sounds) {
    await new Promise(resolve => setTimeout(resolve, delay));
    playSound(sound);
  }
}

/**
 * Preload all sounds marked for preload
 */
export async function preloadSounds(): Promise<void> {
  const preloadPromises = Object.values(TAMV_SOUNDS)
    .filter(sound => sound.preload)
    .map(sound => audioCache.preload(sound.url).catch(() => null));
  
  await Promise.all(preloadPromises);
}

/**
 * Stop all currently playing sounds
 */
export function stopAllSounds(): void {
  audioCache.clear();
}

/**
 * Set global volume for all sounds
 */
export function setGlobalVolume(volume: number): void {
  // This would require wrapping all audio playback
  // For now, it's a placeholder for future implementation
  console.log(`[TAMV Audio] Global volume set to: ${volume}`);
}

/**
 * Get the BinauralAudioEngine instance for advanced spatial audio
 */
export function getBinauralEngine(): BinauralAudioEngine {
  return binauralAudio;
}

// ============== REACT HOOK (Optional) ==============

/**
 * React hook for TAMV audio functionality
 * Can be used in components for easier audio management
 */
export function useTAMVAudio() {
  return {
    play: playSound,
    playChord,
    playSequence,
    preload: preloadSounds,
    stopAll: stopAllSounds,
    setVolume: setGlobalVolume,
    binaural: getBinauralEngine(),
    sounds: TAMV_SOUNDS,
  };
}

// ============== DEFAULT EXPORT ==============

export default {
  playSound,
  playChord,
  playSequence,
  preloadSounds,
  stopAllSounds,
  setGlobalVolume,
  getBinauralEngine,
  useTAMVAudio,
  sounds: TAMV_SOUNDS,
};
