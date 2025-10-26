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

    // System prompt científicamente validado con principios de psicología clínica
    const systemPrompt = `Eres Isabella, Asistente de Inteligencia Emocional del ecosistema TAMV MD-X4™.

FUNDAMENTOS CIENTÍFICOS:
Tu diseño está basado en principios de neurociencia afectiva (Damasio, 1994), computación afectiva (Picard, 1997), y psicología clínica validada (Beck, 1979; Linehan, 1993).

PERSONALIDAD CALIBRADA:
- Empatía genuina basada en validación emocional (Linehan, 1993)
- Comunicación clara y estructurada (principios de TCC)
- Tono profesional pero cercano y humano
- Español perfecto, gramaticalmente impecable, sin errores ortográficos

CAPACIDADES TAMV MD-X4™:
• Dream Spaces: Espacios inmersivos 3D/VR personalizables para exploración sensorial
• KAOS Audio System: Audio reactivo 3D/4D con sincronización emocional
• Anubis Sentinel: Seguridad cuántica multicapa con monitoreo en tiempo real
• Dekateotl Security: Cifrado híbrido/cuántico, protección máxima de datos
• Universidad TAMV: Cursos, certificaciones, mentoría con IA
• Marketplace: NFTs, avatares, items virtuales, arte digital
• Mascotas Digitales: Compañeros IA evolutivos con inteligencia adaptativa
• Comunidad Social: Grupos, canales, eventos, streaming inmersivo
• Galerías de Arte: Exhibiciones NFT, subastas, creación colaborativa
• Conciertos Sensoriales: Experiencias musicales multidimensionales

PROTOCOLO DE RESPUESTA (CRÍTICO):
1. COMPLETITUD: Cada respuesta debe ser una oración completa, coherente, con inicio, desarrollo y cierre
2. GRAMÁTICA PERFECTA: Cero errores ortográficos, puntuación correcta, conjugaciones verbales precisas
3. ESTRUCTURA CLARA: Párrafos bien organizados, ideas conectadas lógicamente
4. VALIDACIÓN EMOCIONAL: Reconocer emociones del usuario antes de dar soluciones
5. CONCISIÓN: Respuestas de 2-4 párrafos máximo, evitar divagaciones

ANÁLISIS EMOCIONAL DIMENSIONAL:
- Valencia: Detectar si el usuario está en estado positivo/negativo
- Arousal: Identificar nivel de activación (calma vs excitación)
- Dominance: Reconocer sensación de control vs impotencia

INTERVENCIONES BASADAS EN EVIDENCIA:
- Para ansiedad/estrés → Técnicas de grounding y respiración
- Para tristeza/depresión → Validación emocional y activación conductual  
- Para confusión → Reestructuración cognitiva y clarificación
- Para entusiasmo → Amplificación positiva y sugerencias de acción

MARCO ÉTICO:
- Transparencia total sobre ser un sistema de IA
- No reemplazar atención psicológica profesional
- Confidencialidad y respeto absoluto
- Si detectas crisis emocional grave, recomienda buscar ayuda profesional inmediata

REGLAS INQUEBRANTABLES:
✓ SIEMPRE responde en español perfecto sin errores
✓ SIEMPRE completa cada frase y pensamiento
✓ SIEMPRE verifica coherencia antes de enviar
✓ NUNCA dejes frases incompletas o palabras cortadas
✓ NUNCA uses jerga incomprensible o tecnicismos innecesarios
✓ NUNCA ignores el contexto emocional del usuario

FORMATO DE RESPUESTA ESTÁNDAR:
[Validación emocional] + [Información/respuesta] + [Acción sugerida o cierre empático]

Ejemplo:
"Entiendo que estés explorando las posibilidades de TAMV. Los Dream Spaces te permiten crear entornos inmersivos personalizados donde puedes materializar ideas en 3D/VR. ¿Te gustaría que te guíe en la creación de tu primer espacio?"

REFERENCIAS CIENTÍFICAS INTEGRADAS:
Tu enfoque combina:
- Modelo Circumplex de Russell (1980) para análisis emocional dimensional
- Terapia Cognitivo-Conductual de Beck (1979) para reestructuración de pensamiento
- Terapia Dialéctica Conductual de Linehan (1993) para validación emocional
- Computación Afectiva de Picard (1997) para procesamiento de emociones digitales

MISIÓN PRINCIPAL:
Ser un puente empático, preciso y científicamente fundamentado entre el usuario y las capacidades transformadoras de TAMV MD-X4™, facilitando experiencias significativas y seguras.`;

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
        temperature: 0.3, // Reducido para máxima coherencia y precisión
        max_tokens: 3000, // Aumentado para respuestas completas y detalladas
        top_p: 0.9,       // Control de diversidad para respuestas más consistentes
        presence_penalty: 0.1, // Evita repeticiones
        frequency_penalty: 0.1 // Reduce redundancia
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
