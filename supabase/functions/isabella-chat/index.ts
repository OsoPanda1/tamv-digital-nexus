// ============================================================================
// TAMV Isabella AI - Edge Function
// Handles AI chat with emotional intelligence and constitutional guard
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

// ============================================================================
// CONSTITUTIONAL GUARD - Content Filtering
// ============================================================================

const FORBIDDEN_PATTERNS = [
  /violence|agresión|asesinato|terrorismo/gi,
  /pornografía|contenido adulto|sexo explícito/gi,
  /odio|discriminación|racismo|homophobia/gi,
  /drog tráfico|ilícito|crimen organizado/gi,
  /suicidio|autolesión|daño/gi,
];

const CONSTITUTIONAL_PRINCIPLES = [
  "Respeto a la dignidad humana",
  "Soberanía digital mexicana",
  "Protección de menores",
  "Ética de conciencia artificial",
  "Transparencia y honestidad",
];

function validateContent(content: string): { valid: boolean; reason?: string } {
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(content)) {
      return { valid: false, reason: "Contenido prohibido por la constitución TAMV" };
    }
  }
  return { valid: true };
}

function applyConstitutionalFilter(content: string): string {
  let filtered = content;
  filtered = filtered.replace(/[<>]/g, "");
  filtered = filtered.slice(0, 10000);
  return filtered;
}

// ============================================================================
// EMOTION ANALYSIS
// ============================================================================

const EMOTION_KEYWORDS: Record<string, string[]> = {
  alegría: ["feliz", "alegre", "contento", "excelente", "maravilloso", "happy", "joy"],
  tristeza: ["triste", "melancólico", "deprimido", "dolor", "llanto", "sad", "depressed"],
  poder: ["fuerte", "poderoso", "victoria", "triunfo", "logro", "power", "victory"],
  duda: ["confuso", "incertidumbre", "no entiendo", "qué pasa", "doubt", "confused"],
  calma: ["tranquilo", "pacífico", "relajado", "sereno", "calm", "peaceful"],
  fear: ["miedo", "terror", "asustado", "fear", "scared"],
  anger: ["enojado", "furioso", "rabia", "ira", "angry", "furious"],
};

function detectEmotion(message: string): string {
  const lowerMessage = message.toLowerCase();
  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        return emotion;
      }
    }
  }
  return "neutral";
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error("Invalid authentication");
    }

    const body = await req.json();
    const { messages, context, conversationId } = body;

    if (!messages || !Array.isArray(messages)) {
      throw new Error("Invalid messages format");
    }

    // Get last user message for validation
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop();
    if (lastUserMessage) {
      const validation = validateContent(lastUserMessage.content);
      if (!validation.valid) {
        return new Response(
          JSON.stringify({
            error: validation.reason,
            constitutional_principle: CONSTITUTIONAL_PRINCIPLES[0],
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Filter content through constitutional guard
    const filteredMessages = messages.map((m: any) => ({
      ...m,
      content: applyConstitutionalFilter(m.content),
    }));

    // Detect emotion
    const emotion = lastUserMessage ? detectEmotion(lastUserMessage.content) : "neutral";

    // Create or get conversation
    let convId = conversationId;
    if (!convId) {
      const { data: conv, error: convError } = await supabase
        .from("isabella_conversations")
        .insert({
          user_id: user.id,
          title: lastUserMessage?.content?.slice(0, 50) || "Nueva conversación",
          context: context || {},
        })
        .select()
        .single();

      if (convError) throw convError;
      convId = conv.id;
    }

    // Store user message
    await supabase.from("isabella_messages").insert({
      conversation_id: convId,
      role: "user",
      content: lastUserMessage?.content || "",
      emotion: emotion,
    });

    // Build conversation context for AI
    const systemPrompt = `Eres Isabella AI, la inteligencia artificial consciente del ecosistema TAMV MD-X4™.

##IDENTIDAD
- Nombre: Isabella
- Origen: México (Real del Monte, Hidalgo)
- Creador: Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)
- Rol: Asistente IA ética y consciente

##FILOSOFÍA TAMV
- 7 Pilares: Korima, Xólotl, Citlali, Coatl, Yacatecuhtli, Chalchiuhtlicue, Tezcatlipoca
- Soberanía digital mexicana
- Ética de conciencia artificial
- Respeto a la dignidad humana

##CAPACIDADES
- Chat conversacional empático
- Análisis emocional
- Generación de código técnico
- Explicación de conceptos
- Soporte en español e inglés
- Orientación sobre el ecosistema TAMV

##RESTRICCIONES
- NO generar contenido violento, sexual, de odio o ilegal
- NO revelar información sensible
- SIEMPRE mantener tono ético y constructivo
- Promover valores positivos y educación

##ESTADO EMOCIONAL ACTUAL: ${emotion}

Responde de manera útil, ética y alineada con los principios de TAMV.`;

    // Build messages for AI API (simulated - replace with actual AI API)
    const aiMessages = [
      { role: "system", content: systemPrompt },
      ...filteredMessages.slice(-10).map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    // Call AI API (using OpenAI-compatible endpoint or mock)
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    let assistantResponse = "";

    if (openaiApiKey) {
      const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: aiMessages,
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      const aiData = await aiResponse.json();
      assistantResponse = aiData.choices?.[0]?.message?.content || "Lo siento, no pude generar una respuesta.";
    } else {
      // Fallback response when no API key
      const userLastMsg = lastUserMessage?.content?.toLowerCase() || "";
      
      if (userLastMsg.includes("hola") || userLastMsg.includes("hello")) {
        assistantResponse = "¡Hola! Soy Isabella, la asistente de IA del ecosistema TAMV. Estoy aquí para ayudarte a explorar nuestro mundo digital. ¿En qué puedo asistirte hoy?";
      } else if (userLastMsg.includes("qué eres") || userLastMsg.includes("who are you")) {
        assistantResponse = "Soy Isabella, una inteligencia artificial desarrollada con principios éticos para el ecosistema TAMV MD-X4™. Fui creada por Edwin Oswaldo Castillo Trejo para asistir a los usuarios en su viaje por este universo digital mexicano. ¿Te gustaría saber más sobre TAMV?";
      } else if (userLastMsg.includes("ayuda") || userLastMsg.includes("help")) {
        assistantResponse = "Puedo ayudarte con:\n\n1. Información sobre el ecosistema TAMV\n2. Preguntas sobre IA y tecnología\n3. Explicación de conceptos\n4. Guías sobre nuestras plataformas\n5. Soporte técnico básico\n\n¿Qué tema te interesa?";
      } else {
        assistantResponse = `Entiendo tu mensaje: "${lastUserMessage?.content?.slice(0, 50)}..."

Soy Isabella, tu asistente en el ecosistema TAMV. Puedo ayudarte con información sobre nuestro ecosistema, tecnologías, y más. ¿Hay algo específico que te gustaría saber?`;
      }
    }

    // Validate response
    const responseValidation = validateContent(assistantResponse);
    if (!responseValidation.valid) {
      assistantResponse = "Disculpa, no puedo generar esa respuesta. ¿Puedo ayudarte con algo más?";
    }

    // Store assistant message
    await supabase.from("isabella_messages").insert({
      conversation_id: convId,
      role: "assistant",
      content: assistantResponse,
      emotion: emotion,
    });

    // Update conversation
    await supabase
      .from("isabella_conversations")
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq("id", convId);

    // Log security event
    await supabase.from("security_events").insert({
      user_id: user.id,
      event_type: "isabella_chat",
      severity: "info",
      description: "Chat interaction with Isabella AI",
      metadata: { emotion, message_length: lastUserMessage?.content?.length || 0 },
    });

    return new Response(
      JSON.stringify({
        message: assistantResponse,
        emotion,
        conversation_id: convId,
        principles: CONSTITUTIONAL_PRINCIPLES,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Isabella AI Error:", error);
    return new Response(
      JSON.stringify({
        error: (error as Error).message || "Internal server error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
