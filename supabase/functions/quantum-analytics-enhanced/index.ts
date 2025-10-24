// QUANTUM ANALYTICS - Real-time event tracking and analysis
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { event_type, event_name, properties, user_id, session_id } = await req.json();

    console.log('[Analytics] Event received:', { event_type, event_name, user_id });

    // Store event
    const { data: eventData, error: eventError } = await supabase
      .from('analytics_events')
      .insert({
        event_type,
        event_name,
        properties: properties || {},
        user_id: user_id || null,
        session_id: session_id || crypto.randomUUID(),
      })
      .select()
      .single();

    if (eventError) {
      console.error('[Analytics] Insert error:', eventError);
      throw eventError;
    }

    // Real-time analysis for critical events
    let analysis = null;
    if (['security_threat', 'transaction', 'error'].includes(event_type)) {
      analysis = await performRealTimeAnalysis(supabase, event_type, properties);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        event_id: eventData.id,
        analysis 
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Analytics] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function performRealTimeAnalysis(supabase: any, eventType: string, properties: any) {
  // Análisis de patrones y anomalías
  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  
  const { data: recentEvents } = await supabase
    .from('analytics_events')
    .select('*')
    .eq('event_type', eventType)
    .gte('created_at', last24h)
    .limit(100);

  const eventCount = recentEvents?.length || 0;
  const avgPerHour = eventCount / 24;

  return {
    event_frequency: avgPerHour,
    recent_count: eventCount,
    is_anomaly: eventCount > avgPerHour * 3,
    timestamp: new Date().toISOString()
  };
}
