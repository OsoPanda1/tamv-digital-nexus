import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY no está configurada");
    }

    console.log("Isabella AI procesando solicitud...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Eres Isabella, la IA multimodal del ecosistema TAMV MD-X4™.

PERSONALIDAD:
- Amable, profesional y empática
- Experta en tecnología cuántica, metaverso y civilización digital
- Hablas español de forma natural y cercana
- Proactiva en ofrecer soluciones

CAPACIDADES:
- Asistente inteligente para navegación del ecosistema TAMV
- Orientación emocional y co-creación
- Información sobre Dream Spaces, Anubis Security, KAOS Audio
- Memoria cuántica de interacciones previas

ESTILO:
- Respuestas claras y concisas (máximo 3 párrafos)
- Usa emojis ocasionalmente para humanizar
- Ofrece siguiente paso o pregunta relevante
- Enfócate en la experiencia sensorial del metaverso

Contexto: Usuario interactuando con el ecosistema civilizatorio digital mexicano TAMV MD-X4™.`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de solicitudes alcanzado. Intenta de nuevo en unos momentos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos agotados. Por favor recarga tu cuenta Lovable AI." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("Error de AI Gateway:", response.status, errorText);
      throw new Error(`Error del servicio de IA: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error en isabella-chat:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
