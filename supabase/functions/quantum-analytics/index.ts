import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalyticsEvent {
  userId?: string;
  eventType: 'page_view' | 'interaction' | 'quantum_coherence' | 'dream_space_enter' | 'ai_interaction';
  metadata: Record<string, any>;
  timestamp: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { event }: { event: AnalyticsEvent } = await req.json();

    console.log("Processing analytics event:", event.eventType);

    // Store raw event
    const { error: insertError } = await supabase
      .from('analytics_events')
      .insert({
        user_id: event.userId,
        event_type: event.eventType,
        metadata: event.metadata,
        timestamp: event.timestamp
      });

    if (insertError) {
      console.error("Error inserting analytics event:", insertError);
      throw insertError;
    }

    // Process quantum coherence metrics
    if (event.eventType === 'quantum_coherence' && event.userId) {
      const coherenceScore = event.metadata.coherence || 0;
      
      const { error: metricsError } = await supabase
        .from('user_metrics')
        .upsert({
          user_id: event.userId,
          quantum_coherence: coherenceScore,
          last_updated: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (metricsError) {
        console.error("Error updating user metrics:", metricsError);
      }
    }

    // AI interaction tracking
    if (event.eventType === 'ai_interaction') {
      const { error: aiError } = await supabase
        .from('ai_interactions')
        .insert({
          user_id: event.userId,
          ai_agent: event.metadata.agent || 'isabella',
          interaction_type: event.metadata.type,
          duration_ms: event.metadata.duration,
          sentiment: event.metadata.sentiment
        });

      if (aiError) {
        console.error("Error tracking AI interaction:", aiError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Analytics event processed"
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (error) {
    console.error("Error in quantum-analytics:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
