// ============================================================================
// TAMV MD-X4™ - BCI Emotional Handler Edge Function
// Processes BCI data and returns emotional state
// ============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Frequency bands for EEG analysis
const BCI_BANDS = {
  delta: { min: 0.5, max: 4 },
  theta: { min: 4, max: 8 },
  alpha: { min: 8, max: 13 },
  beta: { min: 13, max: 30 },
  gamma: { min: 30, max: 100 }
};

// Emotional mapping
const EMOTIONAL_MAPPING: Record<string, { valence: number; arousal: number }> = {
  calm: { valence: 0.5, arousal: 0.2 },
  focused: { valence: 0.3, arousal: 0.6 },
  stressed: { valence: -0.5, arousal: 0.8 },
  anxious: { valence: -0.4, arousal: 0.7 },
  happy: { valence: 0.8, arousal: 0.6 },
  sad: { valence: -0.6, arousal: 0.3 },
  excited: { valence: 0.7, arousal: 0.9 },
  fatigued: { valence: -0.2, arousal: 0.2 },
  angry: { valence: -0.7, arousal: 0.8 },
  neutral: { valence: 0, arousal: 0.4 },
  meditative: { valence: 0.6, arousal: 0.1 },
  flow: { valence: 0.7, arousal: 0.5 }
};

interface EEGData {
  timestamp: number;
  channels: Record<string, number[]>;
  quality?: number;
}

interface EmotionalResult {
  primary: string;
  secondary?: string;
  confidence: number;
  valence: number;
  arousal: number;
  dimensions: Record<string, number>;
}

// Simplified FFT (in production, use proper FFT library)
function fft(data: number[]): number[] {
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

// Calculate band power
function calculateBandPower(
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

// Decode emotional state
function decodeEmotion(channels: Record<string, number[]>): EmotionalResult {
  const channelEntries = Object.entries(channels);
  if (channelEntries.length === 0) {
    return {
      primary: 'neutral',
      confidence: 0.5,
      valence: 0,
      arousal: 0.4,
      dimensions: { engagement: 0.5, stress: 0.2, attention: 0.5 }
    };
  }
  
  const samplingRate = 256;
  const [firstChannel, data] = channelEntries[0];
  
  // Calculate spectrum
  const spectrum = fft(data);
  const totalPower = spectrum.reduce((sum, v) => sum + v * v, 0) || 1;
  
  // Calculate band powers
  const bandPowers = {
    delta: calculateBandPower(spectrum, BCI_BANDS.delta, samplingRate) / totalPower,
    theta: calculateBandPower(spectrum, BCI_BANDS.theta, samplingRate) / totalPower,
    alpha: calculateBandPower(spectrum, BCI_BANDS.alpha, samplingRate) / totalPower,
    beta: calculateBandPower(spectrum, BCI_BANDS.beta, samplingRate) / totalPower,
    gamma: calculateBandPower(spectrum, BCI_BANDS.gamma, samplingRate) / totalPower
  };
  
  // Calculate features
  const thetaAlpha = bandPowers.theta / (bandPowers.alpha + 0.001);
  const betaAlpha = bandPowers.beta / (bandPowers.alpha + 0.001);
  const engagement = bandPowers.beta / (bandPowers.alpha + bandPowers.theta + 0.001);
  
  // Classify emotion
  let primary = 'neutral';
  let confidence = 0.5;
  
  const stress = Math.min(1, bandPowers.beta * 2);
  const fatigue = Math.min(1, thetaAlpha * 0.5);
  const attention = Math.min(1, betaAlpha * 0.5);
  
  if (stress > 0.7) {
    primary = 'stressed';
    confidence = 0.65;
  } else if (fatigue > 0.6) {
    primary = 'fatigued';
    confidence = 0.6;
  } else if (engagement > 0.8 && attention > 0.7) {
    primary = 'flow';
    confidence = 0.7;
  } else if (attention > 0.6) {
    primary = 'focused';
    confidence = 0.65;
  } else if (engagement > 0.5) {
    primary = 'excited';
    confidence = 0.55;
  } else {
    primary = 'calm';
    confidence = 0.6;
  }
  
  const mapping = EMOTIONAL_MAPPING[primary];
  
  return {
    primary,
    confidence,
    valence: mapping.valence,
    arousal: mapping.arousal,
    dimensions: {
      engagement,
      stress,
      fatigue,
      attention,
      meditation: 1 - engagement
    }
  };
}

Deno.serve(async (req) => {
  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const body = await req.json();
    const { sessionId, data, action } = body;
    
    switch (action) {
      case 'start_session': {
        const { deviceType = 'muse', deviceId } = body;
        
        const { data: session, error } = await supabase
          .from('bci_sessions')
          .insert({
            user_id: user.id,
            device_type: deviceType,
            device_id: deviceId || `device-${Date.now()}`,
            status: 'active'
          })
          .select()
          .single();
        
        if (error) throw error;
        
        return new Response(JSON.stringify({ session }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      case 'end_session': {
        if (!sessionId) {
          return new Response(JSON.stringify({ error: 'sessionId required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const { error } = await supabase
          .from('bci_sessions')
          .update({
            status: 'ended',
            ended_at: new Date().toISOString()
          })
          .eq('id', sessionId)
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      case 'process': {
        if (!sessionId || !data) {
          return new Response(JSON.stringify({ error: 'sessionId and data required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Log BCI data
        await supabase.from('bci_data').insert({
          session_id: sessionId,
          timestamp: data.timestamp || Date.now(),
          channels: data.channels,
          quality: data.quality || 1.0
        });
        
        // Decode emotional state
        const emotionalState = decodeEmotion(data.channels);
        
        // Store emotional state
        await supabase.from('emotional_states').insert({
          user_id: user.id,
          session_id: sessionId,
          primary_emotion: emotionalState.primary,
          confidence: emotionalState.confidence,
          valence: emotionalState.valence,
          arousal: emotionalState.arousal,
          dimensions: emotionalState.dimensions
        });
        
        // Update affective embedding
        const { data: existingEmbedding } = await supabase
          .from('affective_embeddings')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (existingEmbedding) {
          const history = existingEmbedding.history || [];
          history.push(emotionalState);
          
          await supabase
            .from('affective_embeddings')
            .update({
              current_state: emotionalState,
              history: history.slice(-100), // Keep last 100
              last_updated: new Date().toISOString()
            })
            .eq('user_id', user.id);
        } else {
          await supabase
            .from('affective_embeddings')
            .insert({
              user_id: user.id,
              current_state: emotionalState,
              history: [emotionalState]
            });
        }
        
        // Return result with modulation suggestions
        return new Response(JSON.stringify({
          emotionalState,
          modulation: {
            environment: getEnvironmentModulation(emotionalState),
            agent: getAgentModulation(emotionalState)
          }
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      case 'get_state': {
        const { data: embedding } = await supabase
          .from('affective_embeddings')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        return new Response(JSON.stringify({ embedding }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('BCI Handler Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

function getEnvironmentModulation(emotion: EmotionalResult): Record<string, unknown> {
  const modulations: Record<string, Record<string, unknown>> = {
    stressed: {
      lighting: { intensity: 0.4, color: { r: 0.8, g: 0.6, b: 0.5 } },
      audio: { volume: 0.2, frequency: 396 }
    },
    calm: {
      lighting: { intensity: 0.6, color: { r: 0.5, g: 0.7, b: 1 } },
      audio: { volume: 0.3, frequency: 432 }
    },
    focused: {
      lighting: { intensity: 0.7, color: { r: 0.8, g: 0.8, b: 1 } },
      audio: { volume: 0.2, frequency: 440 }
    },
    fatigued: {
      lighting: { intensity: 0.3, color: { r: 0.6, g: 0.6, b: 0.7 } },
      audio: { volume: 0.1, frequency: 285 }
    }
  };
  
  return modulations[emotion.primary] || modulations.neutral || modulations.calm;
}

function getAgentModulation(emotion: EmotionalResult): Record<string, unknown> {
  const styles: Record<string, Record<string, unknown>> = {
    stressed: {
      responseStyle: 'calm',
      speechRate: 0.85,
      suggestions: ['Would you like to try a breathing exercise?']
    },
    focused: {
      responseStyle: 'analytical',
      speechRate: 1.1,
      suggestions: ['You are in a great state for learning']
    },
    fatigued: {
      responseStyle: 'calm',
      speechRate: 0.9,
      suggestions: ['Time for a break?']
    }
  };
  
  return styles[emotion.primary] || { responseStyle: 'empathetic', speechRate: 1.0 };
}
