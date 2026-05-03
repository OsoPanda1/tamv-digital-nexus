// Binaural 3D Audio Engine for NOTITAMV
export class BinauralAudioEngine {
  private audioContext: AudioContext | null = null;
  private panner: PannerNode | null = null;
  private gainNode: GainNode | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new AudioContext();
      this.setupNodes();
    }
  }

  private setupNodes() {
    if (!this.audioContext) return;

    this.panner = this.audioContext.createPanner();
    this.panner.panningModel = 'HRTF';
    this.panner.distanceModel = 'inverse';
    this.panner.refDistance = 1;
    this.panner.maxDistance = 10000;
    this.panner.rolloffFactor = 1;
    this.panner.coneInnerAngle = 360;
    this.panner.coneOuterAngle = 0;
    this.panner.coneOuterGain = 0;

    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0.8;

    this.panner.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
  }

  async playNotificationSound(
    type: 'achievement' | 'alert' | 'social' | 'celebration' | 'system',
    position: { x: number; y: number; z: number } = { x: 0, y: 0, z: -1 }
  ) {
    if (!this.audioContext || !this.panner) return;

    // Resume context if suspended
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // Set 3D position
    this.panner.positionX.value = position.x;
    this.panner.positionY.value = position.y;
    this.panner.positionZ.value = position.z;

    // Create oscillator for notification sound
    const oscillator = this.audioContext.createOscillator();
    const frequencyMap = {
      achievement: [523.25, 659.25, 783.99], // C-E-G (Major chord)
      celebration: [523.25, 659.25, 783.99, 1046.50], // C-E-G-C (Octave)
      alert: [880, 440], // A-A (Descending)
      social: [523.25, 587.33], // C-D
      system: [440] // A
    };

    const frequencies = frequencyMap[type] || [440];
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequencies[0];

    const now = this.audioContext.currentTime;
    
    // Create envelope
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(0, now);
      this.gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
      
      // Play sequence
      frequencies.forEach((freq, i) => {
        const time = now + (i * 0.15);
        oscillator.frequency.setValueAtTime(freq, time);
      });

      this.gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    }

    oscillator.connect(this.panner);
    oscillator.start(now);
    oscillator.stop(now + 0.5);
  }

  async playBinauralBeat(frequency: number, duration: number = 3000) {
    if (!this.audioContext) return;

    const baseFreq = 200;
    const beatFreq = frequency;

    const leftOsc = this.audioContext.createOscillator();
    const rightOsc = this.audioContext.createOscillator();
    
    const leftGain = this.audioContext.createGain();
    const rightGain = this.audioContext.createGain();
    
    const merger = this.audioContext.createChannelMerger(2);

    leftOsc.frequency.value = baseFreq;
    rightOsc.frequency.value = baseFreq + beatFreq;

    leftGain.gain.value = 0.2;
    rightGain.gain.value = 0.2;

    leftOsc.connect(leftGain);
    rightOsc.connect(rightGain);
    
    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 1);
    
    merger.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;
    leftOsc.start(now);
    rightOsc.start(now);
    leftOsc.stop(now + duration / 1000);
    rightOsc.stop(now + duration / 1000);
  }

  setListenerPosition(x: number, y: number, z: number) {
    if (!this.audioContext) return;
    
    const listener = this.audioContext.listener;
    if (listener.positionX) {
      listener.positionX.value = x;
      listener.positionY.value = y;
      listener.positionZ.value = z;
    }
  }

  destroy() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export const binauralAudio = new BinauralAudioEngine();
