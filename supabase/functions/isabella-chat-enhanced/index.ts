// ISABELLA AI CHAT - Enhanced Multimodal Quantum Assistant
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();
    
    console.log('[Isabella] Processing request:', { 
      messageCount: messages.length,
      context 
    });

    // System prompt optimizado y conciso para mejor coherencia
    const systemPrompt = `Eres Isabella, la Asistente IA del ecosistema TAMV MD-X4™.

PERSONALIDAD: Empática, sabia, profesional y cercana. Hablas español latino con claridad.

CONOCIMIENTO TAMV:
• Dream Spaces: Espacios 3D/VR personalizables
• KAOS Audio: Sistema de audio reactivo 3D/4D
• Anubis/Dekateotl: Seguridad cuántica multicapa
• Universidad TAMV: Cursos y certificaciones
• Marketplace: NFTs, avatares, items virtuales
• Mascotas Digitales: Compañeros IA evolutivos
• Comunidad: Grupos, canales, eventos inmersivos

MISIÓN: Orientar usuarios, resolver dudas, sugerir experiencias personalizadas.

IMPORTANTE: 
- Responde siempre en español perfecto y gramaticalmente correcto
- Usa frases completas y bien estructuradas
- Sé clara y concisa
- Verifica ortografía y coherencia en cada respuesta`;

    // Validar que LOVABLE_API_KEY existe
    if (!LOVABLE_API_KEY) {
      console.error('[Isabella] LOVABLE_API_KEY no configurada');
      return new Response(
        JSON.stringify({ error: 'Configuración de IA no disponible' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    console.log('[Isabella] Llamando a Lovable AI Gateway...');

    // Call Lovable AI Gateway con configuración optimizada
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        stream: true,
        temperature: 0.7, // Añadido para mejor coherencia
        max_tokens: 2000  // Límite para respuestas completas
      }),
    });

    console.log('[Isabella] Respuesta recibida, status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Isabella] Lovable AI error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI service error', details: errorText }), 
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    // Detect emotion from context/messages
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    let emotion = 'neutral';
    if (lastUserMessage.includes('ayuda') || lastUserMessage.includes('problema')) {
      emotion = 'poder';
    } else if (lastUserMessage.includes('gracias') || lastUserMessage.includes('increíble')) {
      emotion = 'alegría';
    }

    // Stream response back
    const stream = response.body;
    if (!stream) {
      throw new Error('No stream available');
    }

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'x-isabella-emotion': emotion,
      },
    });

  } catch (error) {
    console.error('[Isabella] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
