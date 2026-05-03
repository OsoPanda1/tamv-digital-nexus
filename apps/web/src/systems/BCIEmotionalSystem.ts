// ============================================================================
// TAMV MD-X4™ - BCI Emotional System (TBENA)
// Brain-Computer Interface with Emotional AI Processing
// ============================================================================

// ============================================================================
// Types and Interfaces
// ============================================================================

export type EEGBand = 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma';
export type EmotionalState = 
  | 'calm' | 'focused' | 'stressed' | 'anxious' 
  | 'happy' | 'sad' | 'excited' | 'fatigued' 
  | 'angry' | 'neutral' | 'meditative' | 'flow';

export type AffectiveDimension = 
  | 'valence'      // Positive-negative
  | 'arousal'      // Calm-excited
  | 'dominance'    // Controlled-in control
  | 'engagement'   | 'interest' 
  | 'stress'       | 'fatigue'
  | 'attention'    | 'meditation';

export interface EEGData {
  timestamp: number;
  samplingRate: number;
  channels: Record<string, number[]>;
  duration: number; // ms
  quality: number;  // 0-1
  artifacts: EEGArtifact[];
}

export interface EEGArtifact {
  type: 'blink' | 'muscle' | 'movement' | 'noise' | 'disconnection';
  channel: string;
  startIndex: number;
  endIndex: number;
  severity: number; // 0-1
}

export interface BandPower {
  delta: number;
  theta: number;
  alpha: number;
  beta: number;
  gamma: number;
}

export interface EmotionalStateResult {
  primary: EmotionalState;
  confidence: number;
  secondary?: EmotionalState;
  dimensions: Record<AffectiveDimension, number>;
  valence: number;  // -1 to 1
  arousal: number;  // 0 to 1
  timestamp: Date;
}

export interface AffectiveEmbedding {
  id: string;
  userId: string;
  sessionId: string;
  state: EmotionalStateResult;
  history: EmotionalStateResult[];
  baseline: BaselineProfile;
  lastUpdated: Date;
}

export interface BaselineProfile {
  avgValence: number;
  avgArousal: number;
  avgBandPower: BandPower;
  emotionalRange: {
    min: EmotionalState;
    max: EmotionalState;
    variance: number;
  };
  calibrated: boolean;
  calibrationDate?: Date;
}

export interface EnvironmentModulation {
  lighting: {
    intensity: number;
    color: { r: number; g: number; b: number };
    ambient: number;
  };
  audio: {
    backgroundVolume: number;
    frequency: number;
    binauralBeat?: number;
  };
  particles: {
    density: number;
    speed: number;
    color: { r: number; g: number; b: number };
  };
  atmosphere: {
    fog: number;
    wind: number;
    weather: 'clear' | 'cloudy' | 'rain' | 'snow';
  };
}

export interface AgentModulation {
  responseStyle: 'empathetic' | 'analytical' | 'energetic' | 'calm';
  speechRate: number;
  vocabulary: 'simple' | 'normal' | 'technical';
  proactivity: number;
  emotionalMirroring: boolean;
  suggestions: string[];
}

export interface BCISession {
  id: string;
  userId: string;
  deviceId: string;
  deviceType: 'muse' | 'emotiv' | 'neurosky' | 'openbci' | 'custom';
  startedAt: Date;
  endedAt?: Date;
  status: 'active' | 'paused' | 'ended';
  dataPoints: number;
  emotionalEvents: EmotionalEvent[];
  modulations: ModulationEvent[];
}

export interface EmotionalEvent {
  id: string;
  timestamp: Date;
  state: EmotionalStateResult;
  trigger?: string;
  context?: string;
}

export interface ModulationEvent {
  id: string;
  timestamp: Date;
  type: 'environment' | 'agent' | 'content';
  before: EmotionalStateResult;
  after?: EmotionalStateResult;
  modulation: EnvironmentModulation | AgentModulation | unknown;
}

// ============================================================================
// BCI Configuration
// ============================================================================

export const BCI_CONFIG = {
  // EEG frequency bands (Hz)
  bands: {
    delta: { min: 0.5, max: 4 },
    theta: { min: 4, max: 8 },
    alpha: { min: 8, max: 13 },
    beta: { min: 13, max: 30 },
    gamma: { min: 30, max: 100 }
  },
  
  // Channel mappings for common devices
  channelMaps: {
    muse: ['TP9', 'AF7', 'AF8', 'TP10'],
    emotiv: ['AF3', 'F7', 'F3', 'FC5', 'T7', 'P7', 'O1', 'O2', 'P8', 'T8', 'FC6', 'F4', 'F8', 'AF4'],
    neurosky: ['F3'],
    openbci: ['Fp1', 'Fp2', 'C3', 'C4', 'P7', 'P8', 'O1', 'O2']
  },
  
  // Processing parameters
  processing: {
    windowSize: 256,        // samples
    overlap: 128,           // samples
    minQuality: 0.6,        // minimum signal quality
    smoothingFactor: 0.3,   // exponential smoothing
    artifactThreshold: 0.7  // artifact detection threshold
  },
  
  // Neural network configuration
  neuralNetwork: {
    inputSize: 25,          // 5 bands x 5 features
    hiddenLayers: [64, 32, 16],
    outputSize: 12,         // emotional states
    dropoutRate: 0.2,
    learningRate: 0.001
  }
};

// ============================================================================
// Emotional Mapping Tables
// ============================================================================

const EMOTIONAL_MAPPING: Record<EmotionalState, {
  valence: number;
  arousal: number;
  bands: Partial<Record<EEGBand, number>>;
}> = {
  calm: { valence: 0.5, arousal: 0.2, bands: { alpha: 0.7, theta: 0.5 } },
  focused: { valence: 0.3, arousal: 0.6, bands: { beta: 0.7, gamma: 0.4 } },
  stressed: { valence: -0.5, arousal: 0.8, bands: { beta: 0.8, gamma: 0.6 } },
  anxious: { valence: -0.4, arousal: 0.7, bands: { beta: 0.6, gamma: 0.5 } },
  happy: { valence: 0.8, arousal: 0.6, bands: { alpha: 0.5, beta: 0.4 } },
  sad: { valence: -0.6, arousal: 0.3, bands: { theta: 0.6, alpha: 0.4 } },
  excited: { valence: 0.7, arousal: 0.9, bands: { beta: 0.6, gamma: 0.7 } },
  fatigued: { valence: -0.2, arousal: 0.2, bands: { theta: 0.8, delta: 0.3 } },
  angry: { valence: -0.7, arousal: 0.8, bands: { beta: 0.9, gamma: 0.5 } },
  neutral: { valence: 0, arousal: 0.4, bands: { alpha: 0.6, beta: 0.3 } },
  meditative: { valence: 0.6, arousal: 0.1, bands: { theta: 0.7, alpha: 0.8 } },
  flow: { valence: 0.7, arousal: 0.5, bands: { alpha: 0.6, theta: 0.5, beta: 0.4 } }
};

const ENVIRONMENT_MODULATION_MAP: Record<EmotionalState, EnvironmentModulation> = {
  calm: {
    lighting: { intensity: 0.6, color: { r: 0.5, g: 0.7, b: 1 }, ambient: 0.4 },
    audio: { backgroundVolume: 0.3, frequency: 432, binauralBeat: 10 },
    particles: { density: 0.3, speed: 0.2, color: { r: 0.5, g: 0.8, b: 1 } },
    atmosphere: { fog: 0.2, wind: 0.1, weather: 'clear' }
  },
  stressed: {
    lighting: { intensity: 0.4, color: { r: 0.8, g: 0.6, b: 0.5 }, ambient: 0.3 },
    audio: { backgroundVolume: 0.2, frequency: 396, binauralBeat: 4 },
    particles: { density: 0.2, speed: 0.1, color: { r: 0.6, g: 0.7, b: 0.9 } },
    atmosphere: { fog: 0.1, wind: 0.05, weather: 'clear' }
  },
  happy: {
    lighting: { intensity: 0.8, color: { r: 1, g: 0.9, b: 0.5 }, ambient: 0.5 },
    audio: { backgroundVolume: 0.5, frequency: 528, binauralBeat: 14 },
    particles: { density: 0.6, speed: 0.5, color: { r: 1, g: 0.8, b: 0.3 } },
    atmosphere: { fog: 0.05, wind: 0.3, weather: 'clear' }
  },
  focused: {
    lighting: { intensity: 0.7, color: { r: 0.8, g: 0.8, b: 1 }, ambient: 0.4 },
    audio: { backgroundVolume: 0.2, frequency: 440, binauralBeat: 14 },
    particles: { density: 0.4, speed: 0.3, color: { r: 0.7, g: 0.8, b: 1 } },
    atmosphere: { fog: 0.1, wind: 0.15, weather: 'clear' }
  },
  anxious: {
    lighting: { intensity: 0.5, color: { r: 0.7, g: 0.6, b: 0.8 }, ambient: 0.35 },
    audio: { backgroundVolume: 0.15, frequency: 417, binauralBeat: 6 },
    particles: { density: 0.25, speed: 0.15, color: { r: 0.6, g: 0.7, b: 0.8 } },
    atmosphere: { fog: 0.15, wind: 0.1, weather: 'cloudy' }
  },
  sad: {
    lighting: { intensity: 0.4, color: { r: 0.5, g: 0.6, b: 0.8 }, ambient: 0.3 },
    audio: { backgroundVolume: 0.2, frequency: 396, binauralBeat: 8 },
    particles: { density: 0.2, speed: 0.1, color: { r: 0.4, g: 0.5, b: 0.7 } },
    atmosphere: { fog: 0.25, wind: 0.2, weather: 'cloudy' }
  },
  excited: {
    lighting: { intensity: 0.9, color: { r: 1, g: 0.7, b: 0.3 }, ambient: 0.6 },
    audio: { backgroundVolume: 0.6, frequency: 528, binauralBeat: 18 },
    particles: { density: 0.8, speed: 0.7, color: { r: 1, g: 0.6, b: 0.2 } },
    atmosphere: { fog: 0.05, wind: 0.4, weather: 'clear' }
  },
  fatigued: {
    lighting: { intensity: 0.3, color: { r: 0.6, g: 0.6, b: 0.7 }, ambient: 0.25 },
    audio: { backgroundVolume: 0.1, frequency: 285, binauralBeat: 4 },
    particles: { density: 0.15, speed: 0.05, color: { r: 0.5, g: 0.5, b: 0.6 } },
    atmosphere: { fog: 0.3, wind: 0.05, weather: 'cloudy' }
  },
  angry: {
    lighting: { intensity: 0.5, color: { r: 0.9, g: 0.5, b: 0.4 }, ambient: 0.35 },
    audio: { backgroundVolume: 0.2, frequency: 396, binauralBeat: 2 },
    particles: { density: 0.3, speed: 0.4, color: { r: 0.8, g: 0.4, b: 0.3 } },
    atmosphere: { fog: 0.2, wind: 0.25, weather: 'cloudy' }
  },
  neutral: {
    lighting: { intensity: 0.6, color: { r: 0.7, g: 0.7, b: 0.7 }, ambient: 0.4 },
    audio: { backgroundVolume: 0.25, frequency: 432, binauralBeat: 10 },
    particles: { density: 0.35, speed: 0.25, color: { r: 0.6, g: 0.6, b: 0.6 } },
    atmosphere: { fog: 0.15, wind: 0.15, weather: 'clear' }
  },
  meditative: {
    lighting: { intensity: 0.4, color: { r: 0.4, g: 0.5, b: 0.8 }, ambient: 0.25 },
    audio: { backgroundVolume: 0.15, frequency: 285, binauralBeat: 6 },
    particles: { density: 0.25, speed: 0.08, color: { r: 0.4, g: 0.5, b: 0.9 } },
    atmosphere: { fog: 0.2, wind: 0.02, weather: 'clear' }
  },
  flow: {
    lighting: { intensity: 0.65, color: { r: 0.6, g: 0.8, b: 0.9 }, ambient: 0.45 },
    audio: { backgroundVolume: 0.3, frequency: 432, binauralBeat: 12 },
    particles: { density: 0.5, speed: 0.4, color: { r: 0.5, g: 0.7, b: 0.9 } },
    atmosphere: { fog: 0.1, wind: 0.2, weather: 'clear' }
  }
};

// ============================================================================
// BCI Emotional System Class
// ============================================================================

export class BCIEmotionalSystem {
  private static instance: BCIEmotionalSystem;
  
  private sessions: Map<string, BCISession> = new Map();
  private embeddings: Map<string, AffectiveEmbedding> = new Map();
  private currentEEG: Map<string, EEGData> = new Map();
  
  private constructor() {
    this.loadPersistedData();
  }
  
  static getInstance(): BCIEmotionalSystem {
    if (!BCIEmotionalSystem.instance) {
      BCIEmotionalSystem.instance = new BCIEmotionalSystem();
    }
    return BCIEmotionalSystem.instance;
  }
  
  // ============================================================================
  // STEP 1: Capture EEG
  // ============================================================================
  
  /**
   * Capture and validate EEG data from device
   */
  captureEEG(
    userId: string,
    rawChannels: Record<string, number[]>,
    options?: {
      deviceId?: string;
      deviceType?: BCISession['deviceType'];
      samplingRate?: number;
    }
  ): EEGData {
    const samplingRate = options?.samplingRate || 256;
    const channels = Object.keys(rawChannels);
    const duration = (rawChannels[channels[0]]?.length || 0) / samplingRate * 1000;
    
    // Detect artifacts
    const artifacts = this.detectArtifacts(rawChannels);
    
    // Calculate signal quality
    const quality = this.calculateSignalQuality(rawChannels, artifacts);
    
    const eegData: EEGData = {
      timestamp: Date.now(),
      samplingRate,
      channels: rawChannels,
      duration,
      quality,
      artifacts
    };
    
    this.currentEEG.set(userId, eegData);
    
    // Update session if active
    const session = this.getActiveSession(userId);
    if (session) {
      session.dataPoints++;
    }
    
    console.log(`[BCI] Captured EEG data for user ${userId}, quality: ${quality.toFixed(2)}`);
    return eegData;
  }
  
  /**
   * Detect artifacts in EEG signal
   */
  private detectArtifacts(channels: Record<string, number[]>): EEGArtifact[] {
    const artifacts: EEGArtifact[] = [];
    
    for (const [channel, data] of Object.entries(channels)) {
      // Blink detection (large amplitude spike)
      for (let i = 0; i < data.length - 10; i++) {
        const window = data.slice(i, i + 10);
        const max = Math.max(...window);
        const min = Math.min(...window);
        
        if (max - min > 100) { // Threshold for blink
          artifacts.push({
            type: 'blink',
            channel,
            startIndex: i,
            endIndex: i + 10,
            severity: Math.min(1, (max - min) / 200)
          });
        }
      }
      
      // Movement detection (low frequency drift)
      const avgFirst = data.slice(0, 50).reduce((a, b) => a + b, 0) / 50;
      const avgLast = data.slice(-50).reduce((a, b) => a + b, 0) / 50;
      
      if (Math.abs(avgFirst - avgLast) > 50) {
        artifacts.push({
          type: 'movement',
          channel,
          startIndex: 0,
          endIndex: data.length,
          severity: Math.min(1, Math.abs(avgFirst - avgLast) / 100)
        });
      }
    }
    
    return artifacts;
  }
  
  /**
   * Calculate overall signal quality
   */
  private calculateSignalQuality(
    channels: Record<string, number[]>,
    artifacts: EEGArtifact[]
  ): number {
    const channelCount = Object.keys(channels).length;
    const sampleCount = Object.values(channels)[0]?.length || 1;
    
    // Base quality
    let quality = 1.0;
    
    // Reduce quality based on artifacts
    const artifactImpact = artifacts.reduce((sum, a) => {
      const duration = (a.endIndex - a.startIndex) / sampleCount;
      return sum + duration * a.severity;
    }, 0);
    
    quality -= Math.min(0.5, artifactImpact / channelCount);
    
    // Check for flat lines (disconnection)
    for (const data of Object.values(channels)) {
      const variance = this.calculateVariance(data);
      if (variance < 0.1) {
        quality *= 0.5;
      }
    }
    
    return Math.max(0, Math.min(1, quality));
  }
  
  // ============================================================================
  // STEP 2: Decode Emotion
  // ============================================================================
  
  /**
   * Decode emotional state from EEG data
   */
  decodeEmotion(eegData: EEGData): EmotionalStateResult {
    // Calculate band powers
    const bandPowers = this.calculateBandPowers(eegData);
    
    // Extract features for each channel
    const features = this.extractFeatures(bandPowers);
    
    // Classify emotional state
    const { state, confidence, dimensions } = this.classifyEmotion(features);
    
    // Calculate valence-arousal
    const mapping = EMOTIONAL_MAPPING[state];
    const valence = mapping.valence + (Math.random() - 0.5) * 0.2;
    const arousal = mapping.arousal + (Math.random() - 0.5) * 0.1;
    
    return {
      primary: state,
      confidence,
      dimensions,
      valence: Math.max(-1, Math.min(1, valence)),
      arousal: Math.max(0, Math.min(1, arousal)),
      timestamp: new Date()
    };
  }
  
  /**
   * Calculate power in each frequency band
   */
  private calculateBandPowers(eegData: EEGData): Map<string, BandPower> {
    const bandPowers = new Map<string, BandPower>();
    
    for (const [channel, data] of Object.entries(eegData.channels)) {
      // Apply FFT (simplified - in production use proper FFT library)
      const spectrum = this.fft(data);
      
      // Calculate power in each band
      const totalPower = spectrum.reduce((sum, v) => sum + v * v, 0);
      
      const bands: BandPower = {
        delta: this.bandPower(spectrum, BCI_CONFIG.bands.delta, eegData.samplingRate) / totalPower,
        theta: this.bandPower(spectrum, BCI_CONFIG.bands.theta, eegData.samplingRate) / totalPower,
        alpha: this.bandPower(spectrum, BCI_CONFIG.bands.alpha, eegData.samplingRate) / totalPower,
        beta: this.bandPower(spectrum, BCI_CONFIG.bands.beta, eegData.samplingRate) / totalPower,
        gamma: this.bandPower(spectrum, BCI_CONFIG.bands.gamma, eegData.samplingRate) / totalPower
      };
      
      bandPowers.set(channel, bands);
    }
    
    return bandPowers;
  }
  
  /**
   * Simplified FFT (in production use proper library)
   */
  private fft(data: number[]): number[] {
    // This is a placeholder - use a proper FFT library in production
    // For now, return a simplified spectral estimate
    const n = data.length;
    const spectrum = new Array(Math.floor(n / 2)).fill(0);
    
    for (let k = 0; k < spectrum.length; k++) {
      let real = 0, imag = 0;
      for (let t = 0; t < n; t++) {
        const angle = (2 * Math.PI * k * t) / n;
        real += data[t] * Math.cos(angle);
        imag -= data[t] * Math.sin(angle);
      }
      spectrum[k] = Math.sqrt(real * real + imag * imag) / n;
    }
    
    return spectrum;
  }
  
  /**
   * Calculate power in a specific frequency band
   */
  private bandPower(
    spectrum: number[],
    band: { min: number; max: number },
    samplingRate: number
  ): number {
    const n = spectrum.length * 2;
    const minIdx = Math.floor(band.min * n / samplingRate);
    const maxIdx = Math.floor(band.max * n / samplingRate);
    
    let power = 0;
    for (let i = minIdx; i < Math.min(maxIdx, spectrum.length); i++) {
      power += spectrum[i] * spectrum[i];
    }
    
    return power;
  }
  
  /**
   * Extract features from band powers
   */
  private extractFeatures(bandPowers: Map<string, BandPower>): number[] {
    const features: number[] = [];
    
    // Average across channels
    let avgBands: BandPower = { delta: 0, theta: 0, alpha: 0, beta: 0, gamma: 0 };
    const count = bandPowers.size;
    
    for (const bands of bandPowers.values()) {
      avgBands.delta += bands.delta;
      avgBands.theta += bands.theta;
      avgBands.alpha += bands.alpha;
      avgBands.beta += bands.beta;
      avgBands.gamma += bands.gamma;
    }
    
    avgBands = {
      delta: avgBands.delta / count,
      theta: avgBands.theta / count,
      alpha: avgBands.alpha / count,
      beta: avgBands.beta / count,
      gamma: avgBands.gamma / count
    };
    
    // Ratios
    features.push(avgBands.theta / (avgBands.alpha + 0.001)); // Theta/Alpha
    features.push(avgBands.beta / (avgBands.alpha + 0.001));  // Beta/Alpha
    features.push(avgBands.gamma / (avgBands.beta + 0.001));  // Gamma/Beta
    
    // Absolute values
    features.push(avgBands.delta, avgBands.theta, avgBands.alpha, avgBands.beta, avgBands.gamma);
    
    // Engagement index
    features.push(avgBands.beta / (avgBands.alpha + avgBands.theta + 0.001));
    
    // Frontal asymmetry (if frontal channels available)
    features.push(0.5); // Placeholder
    
    return features;
  }
  
  /**
   * Classify emotional state from features
   */
  private classifyEmotion(features: number[]): {
    state: EmotionalState;
    confidence: number;
    dimensions: Record<AffectiveDimension, number>;
  } {
    // Simplified rule-based classification
    // In production, use trained neural network
    
    const [thetaAlpha, betaAlpha] = features;
    
    let state: EmotionalState = 'neutral';
    let confidence = 0.5;
    
    // Engagement and attention
    const engagement = features[6];
    const attention = Math.min(1, betaAlpha * 0.5);
    
    // Stress detection
    const stress = Math.min(1, features[3] * 2); // beta
    
    // Fatigue detection
    const fatigue = Math.min(1, features[0] * 0.5); // theta/alpha
    
    // Meditation detection
    const meditation = Math.min(1, features[1] * 0.3 + features[4] * 0.3);
    
    // Determine primary emotion
    if (meditation > 0.6) {
      state = 'meditative';
      confidence = 0.7;
    } else if (stress > 0.7) {
      state = 'stressed';
      confidence = 0.65;
    } else if (fatigue > 0.6) {
      state = 'fatigued';
      confidence = 0.6;
    } else if (engagement > 0.8 && attention > 0.7) {
      state = 'flow';
      confidence = 0.7;
    } else if (attention > 0.6) {
      state = 'focused';
      confidence = 0.65;
    } else if (engagement > 0.5) {
      state = 'excited';
      confidence = 0.55;
    } else {
      state = 'calm';
      confidence = 0.6;
    }
    
    const dimensions: Record<AffectiveDimension, number> = {
      valence: 0.5 - stress * 0.3,
      arousal: engagement,
      dominance: 0.5 + attention * 0.2,
      engagement,
      interest: Math.min(1, engagement * 1.2),
      stress,
      fatigue,
      attention,
      meditation
    };
    
    return { state, confidence, dimensions };
  }
  
  // ============================================================================
  // STEP 3: Update Affective State
  // ============================================================================
  
  /**
   * Update the affective embedding for a user
   */
  updateAffectiveState(
    userId: string,
    emotionalState: EmotionalStateResult
  ): AffectiveEmbedding {
    let embedding = this.embeddings.get(userId);
    
    if (!embedding) {
      embedding = this.createEmbedding(userId);
    }
    
    // Add to history
    embedding.history.push(emotionalState);
    
    // Keep last 100 states
    if (embedding.history.length > 100) {
      embedding.history.shift();
    }
    
    // Update current state with smoothing
    const alpha = BCI_CONFIG.processing.smoothingFactor;
    embedding.state = {
      primary: emotionalState.primary,
      confidence: emotionalState.confidence,
      secondary: embedding.state.primary !== emotionalState.primary 
        ? embedding.state.primary 
        : undefined,
      dimensions: Object.fromEntries(
        Object.entries(emotionalState.dimensions).map(([k, v]) => [
          k, 
          embedding!.state.dimensions[k as AffectiveDimension] * (1 - alpha) + v * alpha
        ])
      ) as Record<AffectiveDimension, number>,
      valence: embedding.state.valence * (1 - alpha) + emotionalState.valence * alpha,
      arousal: embedding.state.arousal * (1 - alpha) + emotionalState.arousal * alpha,
      timestamp: new Date()
    };
    
    embedding.lastUpdated = new Date();
    this.embeddings.set(userId, embedding);
    this.persistData();
    
    // Record emotional event
    const session = this.getActiveSession(userId);
    if (session) {
      session.emotionalEvents.push({
        id: `evt-${Date.now()}`,
        timestamp: new Date(),
        state: emotionalState
      });
    }
    
    return embedding;
  }
  
  /**
   * Create new affective embedding
   */
  private createEmbedding(userId: string): AffectiveEmbedding {
    const session = this.getActiveSession(userId);
    
    return {
      id: `embed-${userId}-${Date.now()}`,
      userId,
      sessionId: session?.id || '',
      state: {
        primary: 'neutral',
        confidence: 0.5,
        dimensions: {
          valence: 0, arousal: 0.4, dominance: 0.5,
          engagement: 0.5, interest: 0.5, stress: 0.2,
          fatigue: 0.1, attention: 0.5, meditation: 0.3
        },
        valence: 0,
        arousal: 0.4,
        timestamp: new Date()
      },
      history: [],
      baseline: {
        avgValence: 0,
        avgArousal: 0.4,
        avgBandPower: { delta: 0.2, theta: 0.2, alpha: 0.3, beta: 0.2, gamma: 0.1 },
        emotionalRange: {
          min: 'neutral',
          max: 'neutral',
          variance: 0
        },
        calibrated: false
      },
      lastUpdated: new Date()
    };
  }
  
  // ============================================================================
  // STEP 4: Modulate Environment
  // ============================================================================
  
  /**
   * Generate environment modulation based on emotional state
   */
  modulateEnvironment(emotionalState: EmotionalStateResult): EnvironmentModulation {
    const baseModulation = ENVIRONMENT_MODULATION_MAP[emotionalState.primary];
    
    // Apply confidence-based interpolation
    const confidence = emotionalState.confidence;
    
    return {
      lighting: {
        intensity: baseModulation.lighting.intensity * (0.7 + confidence * 0.3),
        color: baseModulation.lighting.color,
        ambient: baseModulation.lighting.ambient
      },
      audio: {
        backgroundVolume: baseModulation.audio.backgroundVolume * confidence,
        frequency: baseModulation.audio.frequency,
        binauralBeat: baseModulation.audio.binauralBeat
      },
      particles: {
        density: baseModulation.particles.density * confidence,
        speed: baseModulation.particles.speed,
        color: baseModulation.particles.color
      },
      atmosphere: {
        fog: baseModulation.atmosphere.fog,
        wind: baseModulation.atmosphere.wind,
        weather: baseModulation.atmosphere.weather
      }
    };
  }
  
  // ============================================================================
  // STEP 5: Modulate Agent Behavior
  // ============================================================================
  
  /**
   * Generate agent behavior modulation based on emotional state
   */
  modulateAgentBehavior(emotionalState: EmotionalStateResult): AgentModulation {
    const { primary, dimensions } = emotionalState;
    
    let responseStyle: AgentModulation['responseStyle'] = 'empathetic';
    let speechRate = 1.0;
    let suggestions: string[] = [];
    
    switch (primary) {
      case 'stressed':
        responseStyle = 'calm';
        speechRate = 0.85;
        suggestions = [
          'Would you like to try a breathing exercise?',
          'Taking a short break might help',
          'Consider the relaxation module'
        ];
        break;
        
      case 'fatigued':
        responseStyle = 'calm';
        speechRate = 0.9;
        suggestions = [
          'Time for a break?',
          'Would you like some ambient audio?',
          'Consider ending the session soon'
        ];
        break;
        
      case 'focused':
      case 'flow':
        responseStyle = 'analytical';
        speechRate = 1.1;
        suggestions = [
          'You are in a great state for learning',
          'This is a good time for complex tasks'
        ];
        break;
        
      case 'happy':
      case 'excited':
        responseStyle = 'energetic';
        speechRate = 1.15;
        suggestions = [
          'Great energy! Perfect for collaborative activities',
          'Consider sharing your enthusiasm with the community'
        ];
        break;
        
      case 'sad':
        responseStyle = 'empathetic';
        speechRate = 0.9;
        suggestions = [
          'I am here if you want to talk',
          'Sometimes music helps',
          'Consider connecting with supportive community members'
        ];
        break;
        
      case 'anxious':
        responseStyle = 'calm';
        speechRate = 0.85;
        suggestions = [
          'Grounding exercise available',
          'Slow breathing can help',
          'Focus on one task at a time'
        ];
        break;
        
      case 'meditative':
        responseStyle = 'calm';
        speechRate = 0.8;
        suggestions = [
          'Beautiful meditative state',
          'Continue your practice'
        ];
        break;
        
      default:
        responseStyle = 'empathetic';
        speechRate = 1.0;
        suggestions = [];
    }
    
    return {
      responseStyle,
      speechRate,
      vocabulary: dimensions.attention > 0.7 ? 'technical' : 'normal',
      proactivity: dimensions.engagement > 0.5 ? 0.8 : 0.4,
      emotionalMirroring: true,
      suggestions
    };
  }
  
  // ============================================================================
  // Session Management
  // ============================================================================
  
  /**
   * Start a new BCI session
   */
  startSession(
    userId: string,
    deviceType: BCISession['deviceType'] = 'muse',
    deviceId?: string
  ): BCISession {
    // End any existing active session
    const existingSession = this.getActiveSession(userId);
    if (existingSession) {
      this.endSession(userId);
    }
    
    const session: BCISession = {
      id: `session-${userId}-${Date.now()}`,
      userId,
      deviceId: deviceId || `device-${Date.now()}`,
      deviceType,
      startedAt: new Date(),
      status: 'active',
      dataPoints: 0,
      emotionalEvents: [],
      modulations: []
    };
    
    this.sessions.set(session.id, session);
    console.log(`[BCI] Started session ${session.id} for user ${userId}`);
    
    return session;
  }
  
  /**
   * Get active session for user
   */
  getActiveSession(userId: string): BCISession | undefined {
    for (const session of this.sessions.values()) {
      if (session.userId === userId && session.status === 'active') {
        return session;
      }
    }
    return undefined;
  }
  
  /**
   * End active session
   */
  endSession(userId: string): BCISession | null {
    const session = this.getActiveSession(userId);
    if (!session) return null;
    
    session.status = 'ended';
    session.endedAt = new Date();
    
    console.log(`[BCI] Ended session ${session.id}, data points: ${session.dataPoints}`);
    this.persistData();
    
    return session;
  }
  
  /**
   * Get affective embedding for user
   */
  getAffectiveEmbedding(userId: string): AffectiveEmbedding | undefined {
    return this.embeddings.get(userId);
  }
  
  /**
   * Calibrate baseline for user
   */
  calibrateBaseline(userId: string): BaselineProfile {
    const embedding = this.embeddings.get(userId);
    if (!embedding || embedding.history.length < 10) {
      throw new Error('Insufficient data for calibration');
    }
    
    const history = embedding.history;
    
    // Calculate averages
    const avgValence = history.reduce((s, e) => s + e.valence, 0) / history.length;
    const avgArousal = history.reduce((s, e) => s + e.arousal, 0) / history.length;
    
    // Determine emotional range
    const states = history.map(e => e.primary);
    const uniqueStates = [...new Set(states)];
    
    embedding.baseline = {
      avgValence,
      avgArousal,
      avgBandPower: { delta: 0.2, theta: 0.2, alpha: 0.3, beta: 0.2, gamma: 0.1 },
      emotionalRange: {
        min: uniqueStates[0] || 'neutral',
        max: uniqueStates[uniqueStates.length - 1] || 'neutral',
        variance: uniqueStates.length / history.length
      },
      calibrated: true,
      calibrationDate: new Date()
    };
    
    this.persistData();
    return embedding.baseline;
  }
  
  // ============================================================================
  // Utility Methods
  // ============================================================================
  
  private calculateVariance(data: number[]): number {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    return data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  }
  
  private loadPersistedData(): void {
    try {
      const stored = localStorage.getItem('bci-data');
      if (stored) {
        const data = JSON.parse(stored);
        data.sessions?.forEach((s: BCISession) => {
          s.startedAt = new Date(s.startedAt);
          s.endedAt = s.endedAt ? new Date(s.endedAt) : undefined;
          this.sessions.set(s.id, s);
        });
        data.embeddings?.forEach((e: AffectiveEmbedding) => {
          e.lastUpdated = new Date(e.lastUpdated);
          e.state.timestamp = new Date(e.state.timestamp);
          this.embeddings.set(e.userId, e);
        });
      }
    } catch (error) {
      console.error('[BCI] Error loading persisted data:', error);
    }
  }
  
  private persistData(): void {
    try {
      localStorage.setItem('bci-data', JSON.stringify({
        sessions: Array.from(this.sessions.values()),
        embeddings: Array.from(this.embeddings.values())
      }));
    } catch (error) {
      console.error('[BCI] Error persisting data:', error);
    }
  }
  
  destroy(): void {
    this.persistData();
    this.sessions.clear();
    this.embeddings.clear();
    this.currentEEG.clear();
    console.log('[BCI] System destroyed');
  }
}

// Export singleton
export const bciEmotionalSystem = BCIEmotionalSystem.getInstance();
export default BCIEmotionalSystem;
