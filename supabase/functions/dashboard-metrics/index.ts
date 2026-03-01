// ============================================================================
// TAMV MD-X4™ - Dashboard Metrics Edge Function
// Provides metrics for dashboard by membership tier
// ============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mock node data for 48 federation nodes
const FEDERATION_NODES = [
  // México (6 nodos)
  { id: 'MX-CEN', name: 'México Central', region: 'América del Norte', country: 'México', latency: 12, load: 45, health: 98 },
  { id: 'MX-NOR', name: 'México Norte', region: 'América del Norte', country: 'México', latency: 18, load: 32, health: 95 },
  { id: 'MX-SUR', name: 'México Sur', region: 'América del Norte', country: 'México', latency: 15, load: 28, health: 97 },
  { id: 'MX-OCC', name: 'México Occidente', region: 'América del Norte', country: 'México', latency: 14, load: 55, health: 94 },
  { id: 'MX-BAJ', name: 'México Bajío', region: 'América del Norte', country: 'México', latency: 16, load: 42, health: 96 },
  { id: 'MX-SEP', name: 'México Sureste', region: 'América del Norte', country: 'México', latency: 19, load: 38, health: 93 },
  // Brasil (8 nodos)
  { id: 'BR-LE', name: 'Brasil Leste', region: 'América del Sur', country: 'Brasil', latency: 67, load: 78, health: 91 },
  { id: 'BR-NE', name: 'Brasil Nordeste', region: 'América del Sur', country: 'Brasil', latency: 72, load: 45, health: 94 },
  { id: 'BR-NO', name: 'Brasil Norte', region: 'América del Sur', country: 'Brasil', latency: 85, load: 32, health: 89 },
  { id: 'BR-SE', name: 'Brasil Sudeste', region: 'América del Sur', country: 'Brasil', latency: 63, load: 68, health: 95 },
  { id: 'BR-SU', name: 'Brasil Sur', region: 'América del Sur', country: 'Brasil', latency: 70, load: 52, health: 92 },
  { id: 'BR-CO', name: 'Brasil Centro-Oeste', region: 'América del Sur', country: 'Brasil', latency: 95, load: 85, health: 78 },
  { id: 'BR-DF', name: 'Brasil Distrito Federal', region: 'América del Sur', country: 'Brasil', latency: 65, load: 48, health: 96 },
  { id: 'BR-RJ', name: 'Brasil Río', region: 'América del Sur', country: 'Brasil', latency: 68, load: 72, health: 93 },
  // Argentina (5 nodos)
  { id: 'AR-BA', name: 'Argentina Buenos Aires', region: 'América del Sur', country: 'Argentina', latency: 89, load: 56, health: 94 },
  { id: 'AR-CEN', name: 'Argentina Centro', region: 'América del Sur', country: 'Argentina', latency: 92, load: 38, health: 91 },
  { id: 'AR-NOR', name: 'Argentina Norte', region: 'América del Sur', country: 'Argentina', latency: 98, load: 29, health: 88 },
  { id: 'AR-SUR', name: 'Argentina Sur', region: 'América del Sur', country: 'Argentina', latency: 105, load: 22, health: 86 },
  { id: 'AR-CUY', name: 'Argentina Cuyo', region: 'América del Sur', country: 'Argentina', latency: 95, load: 35, health: 90 },
  // Colombia (5 nodos)
  { id: 'CO-BOG', name: 'Colombia Bogotá', region: 'América del Sur', country: 'Colombia', latency: 55, load: 62, health: 95 },
  { id: 'CO-MED', name: 'Colombia Medellín', region: 'América del Sur', country: 'Colombia', latency: 58, load: 48, health: 93 },
  { id: 'CO-CAL', name: 'Colombia Cali', region: 'América del Sur', country: 'Colombia', latency: 60, load: 42, health: 91 },
  { id: 'CO-CAR', name: 'Colombia Caribe', region: 'América del Sur', country: 'Colombia', latency: 62, load: 35, health: 89 },
  { id: 'CO-PAC', name: 'Colombia Pacífico', region: 'América del Sur', country: 'Colombia', latency: 65, load: 28, health: 87 },
  // Chile (3 nodos)
  { id: 'CL-NOR', name: 'Chile Norte', region: 'América del Sur', country: 'Chile', latency: 95, load: 38, health: 92 },
  { id: 'CL-CEN', name: 'Chile Central', region: 'América del Sur', country: 'Chile', latency: 92, load: 55, health: 94 },
  { id: 'CL-SUR', name: 'Chile Sur', region: 'América del Sur', country: 'Chile', latency: 100, load: 32, health: 90 },
  // Perú (3 nodos)
  { id: 'PE-LIM', name: 'Perú Lima', region: 'América del Sur', country: 'Perú', latency: 68, load: 52, health: 93 },
  { id: 'PE-ARE', name: 'Perú Arequipa', region: 'América del Sur', country: 'Perú', latency: 72, load: 38, health: 91 },
  { id: 'PE-CUS', name: 'Perú Cusco', region: 'América del Sur', country: 'Perú', latency: 78, load: 28, health: 88 },
  // España (4 nodos)
  { id: 'ES-MAD', name: 'España Madrid', region: 'Europa', country: 'España', latency: 145, load: 58, health: 96 },
  { id: 'ES-BCN', name: 'España Barcelona', region: 'Europa', country: 'España', latency: 148, load: 52, health: 95 },
  { id: 'ES-VAL', name: 'España Valencia', region: 'Europa', country: 'España', latency: 150, load: 42, health: 93 },
  { id: 'ES-AND', name: 'España Andalucía', region: 'Europa', country: 'España', latency: 152, load: 38, health: 91 },
  // Estados Unidos (4 nodos)
  { id: 'US-EAST', name: 'US East', region: 'América del Norte', country: 'Estados Unidos', latency: 35, load: 68, health: 97 },
  { id: 'US-WEST', name: 'US West', region: 'América del Norte', country: 'Estados Unidos', latency: 42, load: 55, health: 96 },
  { id: 'US-CENT', name: 'US Central', region: 'América del Norte', country: 'Estados Unidos', latency: 38, load: 48, health: 95 },
  { id: 'US-SOUTH', name: 'US South', region: 'América del Norte', country: 'Estados Unidos', latency: 40, load: 42, health: 94 },
  // Ecuador (2 nodos)
  { id: 'EC-UIO', name: 'Ecuador Quito', region: 'América del Sur', country: 'Ecuador', latency: 72, load: 45, health: 92 },
  { id: 'EC-GYE', name: 'Ecuador Guayaquil', region: 'América del Sur', country: 'Ecuador', latency: 75, load: 38, health: 90 },
  // Venezuela (2 nodos)
  { id: 'VE-CCS', name: 'Venezuela Caracas', region: 'América del Sur', country: 'Venezuela', latency: 85, load: 72, health: 82 },
  { id: 'VE-MAR', name: 'Venezuela Maracaibo', region: 'América del Sur', country: 'Venezuela', latency: 88, load: 48, health: 85 },
  // Centroamérica (3 nodos)
  { id: 'GT-GUA', name: 'Guatemala', region: 'Centroamérica', country: 'Guatemala', latency: 45, load: 35, health: 90 },
  { id: 'CR-SJO', name: 'Costa Rica', region: 'Centroamérica', country: 'Costa Rica', latency: 52, load: 42, health: 92 },
  { id: 'PA-PTY', name: 'Panamá', region: 'Centroamérica', country: 'Panamá', latency: 48, load: 55, health: 94 }
];

// Visibility by tier
const TIER_VISIBILITY = {
  free: { nodes: 0, metrics: ['basic'] },
  starter: { nodes: 10, metrics: ['basic', 'standard'] },
  pro: { nodes: 25, metrics: ['basic', 'standard', 'advanced'] },
  business: { nodes: 48, metrics: ['basic', 'standard', 'advanced', 'complete'] },
  enterprise: { nodes: 48, metrics: ['all'] },
  custom: { nodes: 48, metrics: ['all'] }
};

interface DashboardMetrics {
  summary: {
    totalUsers: number;
    activeUsers: number;
    totalNodes: number;
    onlineNodes: number;
    avgLatency: number;
    avgHealth: number;
    uptime: number;
  };
  nodes?: unknown[];
  charts?: {
    usersByRegion: unknown[];
    activityByTime: unknown[];
    healthDistribution: unknown[];
    systemHealth: unknown;
  };
  alerts?: unknown[];
}

Deno.serve(async (req) => {
  try {
    // Get authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'summary';
    
    // Get user's membership
    const { data: membership } = await supabase
      .from('memberships')
      .select('tier_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();
    
    const tierId = membership?.tier_id || 'free';
    const visibility = TIER_VISIBILITY[tierId] || TIER_VISIBILITY.free;
    
    // Get nodes based on visibility
    const visibleNodes = visibility.nodes === 0 
      ? [] 
      : visibility.nodes === -1 || visibility.nodes >= FEDERATION_NODES.length
        ? FEDERATION_NODES
        : FEDERATION_NODES.slice(0, visibility.nodes);
    
    // Calculate metrics
    const onlineNodes = visibleNodes.filter(n => n.health > 85);
    const avgLatency = visibleNodes.length > 0
      ? Math.round(visibleNodes.reduce((s, n) => s + n.latency, 0) / visibleNodes.length)
      : 0;
    const avgHealth = visibleNodes.length > 0
      ? Math.round(visibleNodes.reduce((s, n) => s + n.health, 0) / visibleNodes.length)
      : 0;
    
    switch (action) {
      case 'summary': {
        const metrics: DashboardMetrics = {
          summary: {
            totalUsers: 12547,
            activeUsers: 8432,
            totalNodes: visibility.nodes === 0 ? 0 : FEDERATION_NODES.length,
            onlineNodes: onlineNodes.length,
            avgLatency,
            avgHealth,
            uptime: 99.9
          }
        };
        
        // Add nodes only if visible
        if (visibility.nodes > 0) {
          metrics.nodes = visibleNodes.map(n => ({
            id: n.id,
            name: n.name,
            region: n.region,
            country: n.country,
            latency: n.latency,
            load: n.load,
            health: n.health,
            status: n.health > 85 ? 'online' : n.health > 70 ? 'warning' : 'offline'
          }));
        }
        
        return new Response(JSON.stringify(metrics), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      case 'nodes': {
        if (visibility.nodes === 0) {
          return new Response(JSON.stringify({ 
            error: 'Upgrade required to view nodes',
            upgradeUrl: '/membership'
          }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        return new Response(JSON.stringify({
          nodes: visibleNodes.map(n => ({
            id: n.id,
            name: n.name,
            region: n.region,
            country: n.country,
            latency: n.latency,
            load: n.load,
            health: n.health,
            status: n.health > 85 ? 'online' : n.health > 70 ? 'warning' : 'offline',
            capabilities: {
              quantum: n.health > 90,
              bci: n.health > 80,
              xr: n.health > 75,
              ai: true
            }
          })),
          total: FEDERATION_NODES.length,
          visible: visibleNodes.length,
          tier: tierId
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      case 'charts': {
        if (!visibility.metrics.includes('advanced') && !visibility.metrics.includes('all')) {
          return new Response(JSON.stringify({ 
            error: 'Upgrade required for detailed charts'
          }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // Generate chart data
        const usersByRegion = [
          { region: 'América del Norte', users: 4523, percentage: 36 },
          { region: 'América del Sur', users: 5234, percentage: 42 },
          { region: 'Europa', users: 1890, percentage: 15 },
          { region: 'Otros', users: 900, percentage: 7 }
        ];
        
        const activityByTime = Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          users: Math.floor(2000 + Math.random() * 3000),
          events: Math.floor(5000 + Math.random() * 10000)
        }));
        
        const healthDistribution = [
          { status: 'online', count: onlineNodes.length, color: '#22c55e' },
          { status: 'warning', count: visibleNodes.filter(n => n.health <= 85 && n.health > 70).length, color: '#fbbf24' },
          { status: 'offline', count: visibleNodes.filter(n => n.health <= 70).length, color: '#ef4444' }
        ];
        
        const systemHealth = {
          cpu: 45 + Math.random() * 20,
          memory: 60 + Math.random() * 15,
          network: 30 + Math.random() * 25,
          storage: 55 + Math.random() * 20,
          security: 95 + Math.random() * 5,
          uptime: 99.9
        };
        
        return new Response(JSON.stringify({
          usersByRegion,
          activityByTime,
          healthDistribution,
          systemHealth,
          tier: tierId
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      case 'alerts': {
        if (!visibility.metrics.includes('complete') && !visibility.metrics.includes('all')) {
          return new Response(JSON.stringify({ alerts: [] }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const alerts = [
          {
            id: 'alert-1',
            type: 'warning',
            message: 'Node BR-CO experiencing high load',
            timestamp: new Date().toISOString(),
            acknowledged: false
          },
          {
            id: 'alert-2',
            type: 'info',
            message: 'Scheduled maintenance: ES-MAD node',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            acknowledged: true
          }
        ];
        
        return new Response(JSON.stringify({ alerts, tier: tierId }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      case 'health': {
        const healthRadar = {
          performance: Math.min(100, avgHealth + 5),
          availability: 99.9,
          security: 98,
          scalability: 95,
          reliability: 99,
          userExperience: avgHealth
        };
        
        return new Response(JSON.stringify({
          health: healthRadar,
          avgLatency,
          avgHealth,
          uptime: 99.9,
          tier: tierId
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Dashboard Metrics Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
