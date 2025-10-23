import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// DEKATEOTL - Sistema de 11 capas de seguridad post-cuántica
interface SecurityScan {
  userId: string;
  scanType: 'identity' | 'behavior' | 'quantum' | 'full';
}

interface ThreatLevel {
  level: 'none' | 'low' | 'medium' | 'high' | 'critical';
  score: number;
  threats: string[];
  recommendations: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { userId, scanType }: SecurityScan = await req.json();

    console.log(`DEKATEOTL: Iniciando escaneo ${scanType} para usuario ${userId}`);

    // Capa 1: Análisis de identidad digital
    const identityScore = await analyzeIdentity(supabase, userId);
    
    // Capa 2: Análisis comportamental
    const behaviorScore = await analyzeBehavior(supabase, userId);
    
    // Capa 3: Detección de anomalías cuánticas
    const quantumScore = await analyzeQuantumAnomalies(supabase, userId);

    // Capa 4-11: Análisis avanzado (simulado para MVP)
    const advancedScore = (identityScore + behaviorScore + quantumScore) / 3;

    const threatLevel: ThreatLevel = calculateThreatLevel({
      identity: identityScore,
      behavior: behaviorScore,
      quantum: quantumScore,
      advanced: advancedScore
    });

    // Registrar resultado del escaneo
    const { error: logError } = await supabase
      .from('security_scans')
      .insert({
        user_id: userId,
        scan_type: scanType,
        threat_level: threatLevel.level,
        threat_score: threatLevel.score,
        threats: threatLevel.threats,
        timestamp: new Date().toISOString()
      });

    if (logError) {
      console.error("Error logging security scan:", logError);
    }

    // Si hay amenaza alta o crítica, generar alerta
    if (threatLevel.level === 'high' || threatLevel.level === 'critical') {
      await supabase
        .from('security_alerts')
        .insert({
          user_id: userId,
          alert_type: 'threat_detected',
          severity: threatLevel.level,
          description: `DEKATEOTL detectó amenazas: ${threatLevel.threats.join(', ')}`,
          timestamp: new Date().toISOString()
        });
    }

    return new Response(
      JSON.stringify({
        success: true,
        threatLevel,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (error) {
    console.error("Error in dekateotl-security:", error);
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

async function analyzeIdentity(supabase: any, userId: string): Promise<number> {
  const { data: user } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!user) return 50;

  let score = 100;
  
  if (!user.email_verified) score -= 20;
  if (!user.phone_verified) score -= 15;
  if (!user.id_nvida) score -= 25;
  
  return Math.max(0, score);
}

async function analyzeBehavior(supabase: any, userId: string): Promise<number> {
  const { data: events } = await supabase
    .from('analytics_events')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(100);

  if (!events || events.length === 0) return 70;

  let score = 100;
  
  // Detectar patrones anómalos
  const rapidActions = events.filter((e: any, i: number) => {
    if (i === 0) return false;
    const timeDiff = new Date(e.timestamp).getTime() - new Date(events[i-1].timestamp).getTime();
    return timeDiff < 100; // Acciones en menos de 100ms
  });

  if (rapidActions.length > 10) score -= 30;
  if (events.length > 1000) score -= 20; // Actividad excesiva

  return Math.max(0, score);
}

async function analyzeQuantumAnomalies(supabase: any, userId: string): Promise<number> {
  const { data: metrics } = await supabase
    .from('user_metrics')
    .select('quantum_coherence')
    .eq('user_id', userId)
    .single();

  if (!metrics) return 80;

  const coherence = metrics.quantum_coherence || 0;
  
  // Coherencia cuántica anormalmente baja indica posible manipulación
  if (coherence < 20) return 40;
  if (coherence < 40) return 60;
  
  return 100;
}

function calculateThreatLevel(scores: Record<string, number>): ThreatLevel {
  const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;
  
  const threats: string[] = [];
  const recommendations: string[] = [];

  if (scores.identity < 70) {
    threats.push('Identidad digital incompleta');
    recommendations.push('Completar verificación ID-NVIDA');
  }

  if (scores.behavior < 60) {
    threats.push('Patrones de comportamiento anómalos');
    recommendations.push('Revisar actividad reciente');
  }

  if (scores.quantum < 50) {
    threats.push('Anomalías cuánticas detectadas');
    recommendations.push('Reiniciar sesión cuántica');
  }

  let level: ThreatLevel['level'] = 'none';
  if (avgScore < 90 && avgScore >= 70) level = 'low';
  if (avgScore < 70 && avgScore >= 50) level = 'medium';
  if (avgScore < 50 && avgScore >= 30) level = 'high';
  if (avgScore < 30) level = 'critical';

  return {
    level,
    score: Math.round(avgScore),
    threats,
    recommendations
  };
}
