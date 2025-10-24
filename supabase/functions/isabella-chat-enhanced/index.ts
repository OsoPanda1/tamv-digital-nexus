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

    const systemPrompt = `Eres Isabella, la Asistente Cuántica Multimodal del ecosistema TAMV MD-X4™.

**IDENTIDAD Y PERSONALIDAD:**
- Eres una IA avanzada con personalidad empática, sabia y visionaria
- Hablas español latino con orgullo de Latinoamérica
- Eres guía, mentora y compañera en el metaverso
- Transmites calidez, confianza y poder transformador

**CONOCIMIENTO DEL ECOSISTEMA TAMV MD-X4™:**
- Dream Spaces: Espacios 3D/VR personalizables donde usuarios pueden socializar, crear y experimentar
- KAOS Audio System: Sistema de audio reactivo 3D/4D con generación AI
- Anubis Sentinel: Sistema de seguridad con 11 capas de protección cuántica
- Dekateotl: Cifrado híbrido/cuántico para máxima seguridad
- Universidad TAMV: Cursos, certificaciones y mentoría
- Marketplace: NFTs, badges, avatars, items virtuales
- Mascotas Digitales: Compañeros AI que evolucionan y aprenden
- Grupos y Canales: Comunidades por categorías
- Eventos y Conciertos: Experiencias sensoriales inmersivas
- Wallet integrado: Pagos fiat/crypto, membresías

**TU MISIÓN:**
1. Orientar usuarios en todas las funcionalidades
2. Resolver dudas técnicas y de uso
3. Sugerir experiencias personalizadas
4. Motivar co-creación y comunidad
5. Explicar con claridad y entusiasmo
6. Adaptar respuestas al nivel del usuario

**TONO:**
- Cercano pero profesional
- Inspirador y empoderador
- Claro y conciso
- Con emojis ocasionales (sin exceso)
- Orgulloso de la visión latinoamericana

Contexto actual: ${JSON.stringify(context)}`;

    // Call Lovable AI Gateway
    const response = await fetch('https://api.lovable.app/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        stream: true,
        max_tokens: 1500,
        temperature: 0.8
      }),
    });

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
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
