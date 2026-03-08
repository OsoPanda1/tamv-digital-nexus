/**
 * ISABELLA TTS Edge Function
 * TAMV MD-X4™ - ElevenLabs Integration
 * 
 * Genera voz sintética usando ElevenLabs API
 * con soporte para perfiles emocionales
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TTSRequest {
  text: string;
  emotionalProfile: string;
  voiceId: string;
  modelId: string;
  voiceSettings: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
  language: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    
    // Si no hay API key, retornar respuesta simulada para desarrollo
    if (!ELEVENLABS_API_KEY) {
      console.log('[ISABELLA-TTS] No API key configured, returning mock response');
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'TTS mock - API key not configured',
          audio: null,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    const body: TTSRequest = await req.json();
    const { text, voiceId, modelId, voiceSettings, language } = body;

    // Validación de input
    if (!text || text.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    if (text.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Text exceeds maximum length (5000 characters)' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    console.log(`[ISABELLA-TTS] Generating audio for ${text.length} characters`);

    // Llamar a ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: modelId || 'eleven_turbo_v2_5',
          voice_settings: voiceSettings || {
            stability: 0.6,
            similarity_boost: 0.8,
            style: 0.7,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ISABELLA-TTS] ElevenLabs error:', response.status, errorText);
      
      if (response.status === 401) {
        console.warn('[ISABELLA-TTS] ElevenLabs auth failed, returning text-only fallback');
        return new Response(
          JSON.stringify({ 
            success: true,
            audio: null,
            fallback: true,
            message: 'TTS temporarily unavailable - text-only mode',
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 429,
          }
        );
      }

      return new Response(
        JSON.stringify({ error: `ElevenLabs API error: ${response.status}` }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Convertir audio a base64
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(audioBuffer))
    );

    console.log(`[ISABELLA-TTS] Audio generated: ${audioBuffer.byteLength} bytes`);

    return new Response(
      JSON.stringify({
        success: true,
        audio: base64Audio,
        mimeType: 'audio/mpeg',
        size: audioBuffer.byteLength,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('[ISABELLA-TTS] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
