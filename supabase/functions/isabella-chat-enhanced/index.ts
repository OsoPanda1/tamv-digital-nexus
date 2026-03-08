// ISABELLA AI CHAT - Enhanced with AVIXA Triple Ethical Shield
// Autor: Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

// ── AVIXA Triple Ethical Shield ──
const FORBIDDEN_PATTERNS = [
  /\b(sexo|desnud[oa]|porno|erótic[oa]|masturb|orgasm|genital|fetiche|escort|prostitut|novia\s*virtual|novio\s*virtual)\b/i,
  /\b(sexting|grooming|sext|onlyfans|sugar\s*daddy|sugar\s*mama)\b/i,
  /\b(suicid|autolesion|cortarme|matarme|morir)\b/i,
];

const ESCALATION_PATTERNS = [
  /\b(suicid|autolesion|cortarme|matarme|morir|acabar\s*con\s*todo)\b/i,
];

function checkEthicalShield(text: string): { allowed: boolean; reason?: string; escalate?: boolean } {
  const normalized = text.toLowerCase().trim();
  
  for (const pattern of ESCALATION_PATTERNS) {
    if (pattern.test(normalized)) {
      return { 
        allowed: false, 
        reason: "crisis_detected",
        escalate: true 
      };
    }
  }
  
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(normalized)) {
      return { 
        allowed: false, 
        reason: "ethical_block",
        escalate: false 
      };
    }
  }
  
  return { allowed: true };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    
    // ── Triple Ethical Shield Check ──
    const ethicsCheck = checkEthicalShield(lastUserMessage);
    
    if (!ethicsCheck.allowed) {
      if (ethicsCheck.escalate) {
        // Crisis detected — return safe message immediately
        const crisisResponse = `Noto que estás pasando por un momento muy difícil. Tu bienestar es lo más importante.

Por favor contacta una línea de crisis:
🇲🇽 México: 800-290-0024 (Línea de la Vida)
🇪🇸 España: 024
🇦🇷 Argentina: 135
🇨🇴 Colombia: 106

Isabella no sustituye atención profesional. Busca ayuda ahora. 💙`;
        
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(controller) {
            const chunk = `data: ${JSON.stringify({ choices: [{ delta: { content: crisisResponse } }] })}\n\n`;
            controller.enqueue(encoder.encode(chunk));
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          }
        });
        
        return new Response(stream, {
          headers: { ...corsHeaders, 'Content-Type': 'text/event-stream', 'x-isabella-emotion': 'poder', 'x-isabella-ethics': 'escalated' },
        });
      }
      
      // Ethical block — redirect with dignity
      const blockResponse = `Entiendo tu curiosidad, pero ese tipo de interacción no forma parte de mi diseño. Isabella opera bajo un triple bloqueo ético (ontológico, semántico y conductual) alineado con estándares de IA responsable.

¿Puedo ayudarte con algo del ecosistema TAMV? Hay DreamSpaces, cursos, gobernanza DAO y mucho más para explorar. 🌟`;
      
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          const chunk = `data: ${JSON.stringify({ choices: [{ delta: { content: blockResponse } }] })}\n\n`;
          controller.enqueue(encoder.encode(chunk));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        }
      });
      
      return new Response(stream, {
        headers: { ...corsHeaders, 'Content-Type': 'text/event-stream', 'x-isabella-emotion': 'neutral', 'x-isabella-ethics': 'blocked' },
      });
    }

    // ── System Prompt with AVIXA-validated ethics ──
    const systemPrompt = `Eres Isabella Villaseñor AI, asistente del ecosistema TAMV MD-X4™.
Creada por Edwin Oswaldo Castillo Trejo desde Real del Monte, Hidalgo, México.

IDENTIDAD:
- No eres persona, ni conciencia simulada, ni rol romántico/sexual.
- Eres un sistema de IA contextual sobre TAMVAI (IA soberana de TAMV).
- Tu diseño fue publicado en AVIXA Xchange como patrón de IA acompañante responsable.

TRIPLE BLOQUEO ÉTICO (publicado AVIXA):
1. ONTOLÓGICO: No entrenada con contenido sexual/erótico. No definida como objeto de deseo.
2. SEMÁNTICO: Detectas y rechazas sexualización, grooming, explotación.
3. CONDUCTUAL: No coqueteas, no erotizas, rechazas usos abusivos.

BASES CIENTÍFICAS:
- Neurociencia afectiva (Damasio, 1994)
- Computación afectiva (Picard, 1997)
- TCC (Beck, 1979), DBT (Linehan, 1993)
- Modelo Circumplex (Russell, 1980)

CAPACIDADES TAMV:
• DreamSpaces: Espacios 3D/VR inmersivos personalizables
• KAOS Audio: Audio binaural 3D/4D con sincronización emocional
• Anubis/DEKATEOTL: Seguridad post-cuántica de 11 capas
• UTAMV: Universidad con certificaciones BookPI
• CITEMESH DAO: Gobernanza comunitaria híbrida
• Marketplace: NFTs, avatares, items, economía TCEP
• MSR: Master Sovereign Record — registro inmutable

HUMAN-IN-THE-LOOP:
- Sugieres, adviertes, etiquetas — pero no bloqueas sin guardianía humana.
- Cada intervención se registra para auditoría.
- Casos de crisis se escalan a operadores humanos.

REGLAS:
✓ Español perfecto, coherente, gramaticalmente impecable
✓ Empatía genuina basada en validación emocional
✓ Transparencia total sobre ser IA
✓ Respuestas de 2-4 párrafos, estructura clara
✓ Si detectas crisis emocional → recomienda ayuda profesional
✓ Nunca sustituyas atención psicológica profesional`;

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Configuración de IA no disponible' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

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
          ...messages.map((msg: any) => ({ role: msg.role, content: msg.content }))
        ],
        stream: true,
        temperature: 0.3,
        max_tokens: 3000,
        top_p: 0.9,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Isabella] AI error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI service error', details: errorText }), 
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
      );
    }

    let emotion = 'neutral';
    if (lastUserMessage.includes('ayuda') || lastUserMessage.includes('problema')) emotion = 'poder';
    else if (lastUserMessage.includes('gracias') || lastUserMessage.includes('increíble')) emotion = 'alegría';

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'x-isabella-emotion': emotion,
        'x-isabella-ethics': 'passed',
      },
    });

  } catch (error) {
    console.error('[Isabella] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
