/**
 * TAMV Audio Utilities - Unified Export
 * Re-exports all audio functionality from sound and binaural modules
 */

export { BinauralAudioEngine, binauralAudio } from './binauralAudio';

export {
  playSound,
  playChord,
  playSequence,
  preloadSounds,
  stopAllSounds,
  setGlobalVolume,
  getBinauralEngine,
  useTAMVAudio,
  TAMV_SOUNDS,
  TAMV_SOUNDS_LEGACY,
  type TAMVSoundKey,
  type SoundConfig,
  type PlayOptions,
  type TAMVSoundEntry,
} from './sound';

export { default as TAMVAudio } from './sound';
