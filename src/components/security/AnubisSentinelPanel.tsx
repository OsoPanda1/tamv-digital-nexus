// ============================================================================
// TAMV MD-X4™ - ANUBIS SENTINEL v10 - PANEL TÁCTICO 4 CAPAS
// UI de Guardianía Post-Cuántica con Visualización Multi-Capa
// ============================================================================

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Activity, AlertTriangle, CheckCircle, XCircle,
  Eye, Zap, Lock, Globe, Server, Database, Cpu,
  Radio, Scan, Target, Crosshair, Bell, Siren,
  Play, Pause, RefreshCw, Settings, Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnubisSentinel } from '@/systems/AnubisSentinelSystem';

// ═════════════════════════════════════════════════════════════════════════════
// COMPONENTE: LayerCard - Tarjeta de Capa de Seguridad
// ═════════════════════════════════════════════════════════════════════════════

interface LayerCardProps {
  layer: 'PERCEPTION' | 'INGESTION' | 'CORRELATION' | 'EXECUTION';
  title: string;
  icon: React.ReactNode;
  status: 'ACTIVE' | 'DEGRADED' | 'OFFLINE';
  metrics: {
    events: number;
    threats: number;
    blocked: number;
  };
  color: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const LayerCard = ({ layer, title, icon, status, metrics, color, isExpanded, onToggle }: LayerCardProps) => {
  const statusColors = {
    ACTIVE: 'bg-green-500',
    DEGRADED: 'bg-yellow-500',
    OFFLINE: 'bg-red-500',
  };

  return (
    <motion.div
      layout
      className={`relative overflow-hidden rounded-2xl border cursor-pointer transition-all ${
        isExpanded ? 'col-span-2 row-span-2' : ''
      }`}
      style={{ 
        borderColor: `${color}40`,
        background: `linear-gradient(135deg, ${color}10 0%, transparent 100%)`,
      }}
      onClick={onToggle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 opacity-30 blur-xl"
        style={{ background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 70%)` }}
      />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="p-3 rounded-xl"
              style={{ background: `${color}20`, border: `1px solid ${color}40` }}
            >
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${statusColors[status]} animate-pulse`} />
                <span className="text-xs text-white/60 uppercase tracking-wider">{status}</span>
              </div>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className="text-xs"
            style={{ borderColor: color, color }}
          >
            Layer {layer === 'PERCEPTION' ? '1' : layer === 'INGESTION' ? '2' : layer === 'CORRELATION' ? '3' : '4'}
          </Badge>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 rounded-xl bg-white/5">
            <p className="text-2xl font-bold" style={{ color }}>{metrics.events.toLocaleString()}</p>
            <p className="text-xs text-white/50 uppercase">Events</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/5">
            <p className="text-2xl font-bold text-yellow-400">{metrics.threats}</p>
            <p className="text-xs text-white/50 uppercase">Threats</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/5">
            <p className="text-2xl font-bold text-green-400">{metrics.blocked}</p>
            <p className="text-xs text-white/50 uppercase">Blocked</p>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-4 border-t border-white/10"
            >
              {layer === 'PERCEPTION' && <PerceptionDetails />}
              {layer === 'INGESTION' && <IngestionDetails />}
              {layer === 'CORRELATION' && <CorrelationDetails />}
              {layer === 'EXECUTION' && <ExecutionDetails />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTES DE DETALLE POR CAPA
// ═════════════════════════════════════════════════════════════════════════════

const PerceptionDetails = () => {
  const sensors = [
    { name: 'Network Ingress', status: 'active', icon: Globe },
    { name: 'API Gateway', status: 'active', icon: Server },
    { name: 'Auth Service', status: 'active', icon: Lock },
    { name: 'K8s Cluster', status: 'active', icon: Cpu },
    { name: 'Honeypot Alpha', status: 'triggered', icon: Target },
    { name: 'DB Monitor', status: 'active', icon: Database },
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Active Sensors</h4>
      <div className="grid grid-cols-2 gap-2">
        {sensors.map((sensor, idx) => (
          <div 
            key={idx}
            className={`flex items-center gap-3 p-3 rounded-lg ${
              sensor.status === 'triggered' ? 'bg-red-500/20 border border-red-500/30' : 'bg-white/5'
            }`}
          >
            <sensor.icon className={`w-4 h-4 ${sensor.status === 'triggered' ? 'text-red-400' : 'text-cyan-400'}`} />
            <span className="text-sm text-white/70">{sensor.name}</span>
            <div className={`w-2 h-2 rounded-full ml-auto ${sensor.status === 'triggered' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

const IngestionDetails = () => {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Ingestion Pipeline</h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
          <div className="flex items-center gap-3">
            <Radio className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-white/70">Isabella Feed</span>
          </div>
          <Badge className="bg-purple-500/20 text-purple-300">2.4k/s</Badge>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
          <div className="flex items-center gap-3">
            <Database className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-white/70">MSR Blockchain</span>
          </div>
          <Badge className="bg-blue-500/20 text-blue-300">180/min</Badge>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
          <div className="flex items-center gap-3">
            <Scan className="w-4 h-4 text-green-400" />
            <span className="text-sm text-white/70">Endpoint Logs</span>
          </div>
          <Badge className="bg-green-500/20 text-green-300">45k/h</Badge>
        </div>
      </div>
    </div>
  );
};

const CorrelationDetails = () => {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider">ML Detection Models</h4>
      <div className="space-y-2">
        {['Brute Force Detection', 'SQL Injection ML', 'DDoS Pattern', 'Anomaly Score'].map((model, idx) => (
          <div key={idx} className="p-3 rounded-lg bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/70">{model}</span>
              <span className="text-xs text-white/40">{(94 + idx).toFixed(1)}% accuracy</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                style={{ width: `${94 + idx}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ExecutionDetails = () => {
  const countermeasures = [
    { type: 'BLOCK', count: 127, active: true },
    { type: 'QUARANTINE', count: 23, active: true },
    { type: 'ISOLATE', count: 5, active: false },
    { type: 'ALERT', count: 89, active: true },
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Active Countermeasures</h4>
      <div className="grid grid-cols-2 gap-2">
        {countermeasures.map((cm, idx) => (
          <div 
            key={idx}
            className={`p-3 rounded-lg border ${cm.active ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60 uppercase">{cm.type}</span>
              {cm.active && <Zap className="w-3 h-3 text-red-400 animate-pulse" />}
            </div>
            <p className="text-xl font-bold text-white mt-1">{cm.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL: AnubisSentinelPanel
// ═════════════════════════════════════════════════════════════════════════════

export const AnubisSentinelPanel = () => {
  const { metrics, layerStatus, isScanning, runScan } = useAnubisSentinel();
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const layers = [
    {
      id: 'PERCEPTION',
      title: 'Perception Layer',
      icon: <Eye className="w-6 h-6 text-cyan-400" />,
      color: '#00D9FF',
      metrics: metrics.layerMetrics.PERCEPTION,
    },
    {
      id: 'INGESTION',
      title: 'Ingestion Layer',
      icon: <Activity className="w-6 h-6 text-purple-400" />,
      color: '#9D4EDD',
      metrics: metrics.layerMetrics.INGESTION,
    },
    {
      id: 'CORRELATION',
      title: 'Correlation Layer',
      icon: <Crosshair className="w-6 h-6 text-yellow-400" />,
      color: '#FFD700',
      metrics: metrics.layerMetrics.CORRELATION,
    },
    {
      id: 'EXECUTION',
      title: 'Execution Layer',
      icon: <Shield className="w-6 h-6 text-red-400" />,
      color: '#FF4444',
      metrics: metrics.layerMetrics.EXECUTION,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050508] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Anubis Sentinel</h1>
            <p className="text-white/50">Post-Quantum Security System v10</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-white/40">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400 font-semibold">OPERATIONAL</span>
            </div>
          </div>
          <Button
            onClick={runScan}
            disabled={isScanning}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
          >
            {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
            {isScanning ? 'Scanning...' : 'Security Scan'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">Overview</TabsTrigger>
          <TabsTrigger value="layers" className="data-[state=active]:bg-white/10">4 Layers</TabsTrigger>
          <TabsTrigger value="threats" className="data-[state=active]:bg-white/10">Threats</TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-white/10">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Global Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/50 uppercase">Events Ingested</p>
                  <p className="text-3xl font-bold text-white">{metrics.eventsIngested.toLocaleString()}</p>
                </div>
                <Activity className="w-10 h-10 text-green-400 opacity-50" />
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/50 uppercase">Threats Detected</p>
                  <p className="text-3xl font-bold text-white">{metrics.threatsDetected}</p>
                </div>
                <AlertTriangle className="w-10 h-10 text-yellow-400 opacity-50" />
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-red-500/10 to-transparent border-red-500/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/50 uppercase">Threats Blocked</p>
                  <p className="text-3xl font-bold text-white">{metrics.threatsBlocked}</p>
                </div>
                <Shield className="w-10 h-10 text-red-400 opacity-50" />
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/50 uppercase">Active Incidents</p>
                  <p className="text-3xl font-bold text-white">{metrics.activeIncidents}</p>
                </div>
                <Siren className="w-10 h-10 text-blue-400 opacity-50" />
              </div>
            </Card>
          </div>

          {/* Layer Summary */}
          <div className="grid grid-cols-4 gap-4">
            {layers.map((layer) => (
              <LayerCard
                key={layer.id}
                layer={layer.id as any}
                title={layer.title}
                icon={layer.icon}
                status={layerStatus[layer.id as keyof typeof layerStatus]?.status as any || 'ACTIVE'}
                metrics={layer.metrics}
                color={layer.color}
                isExpanded={expandedLayer === layer.id}
                onToggle={() => setExpandedLayer(expandedLayer === layer.id ? null : layer.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="layers">
          <div className="grid grid-cols-2 gap-6">
            {layers.map((layer) => (
              <Card key={layer.id} className="bg-white/5 border-white/10 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-xl" style={{ background: `${layer.color}20` }}>
                    {layer.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{layer.title}</h3>
                    <p className="text-sm text-white/50">Layer {layers.indexOf(layer) + 1}</p>
                  </div>
                </div>
                
                {layer.id === 'PERCEPTION' && <PerceptionDetails />}
                {layer.id === 'INGESTION' && <IngestionDetails />}
                {layer.id === 'CORRELATION' && <CorrelationDetails />}
                {layer.id === 'EXECUTION' && <ExecutionDetails />}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="threats">
          <Card className="bg-white/5 border-white/10 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Top Threats</h3>
            <div className="space-y-3">
              {metrics.topThreats?.length > 0 ? metrics.topThreats.map((threat, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      threat.severity === 'CRITICAL' ? 'bg-red-500' :
                      threat.severity === 'HIGH' ? 'bg-orange-500' :
                      threat.severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div>
                      <p className="text-white font-medium">{threat.attackVector}</p>
                      <p className="text-sm text-white/50">{threat.events.length} events • {threat.confidence.toFixed(1)}% confidence</p>
                    </div>
                  </div>
                  <Badge className={`
                    ${threat.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                      threat.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                      threat.severity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' : 
                      'bg-green-500/20 text-green-400'}
                  `}>
                    {threat.severity}
                  </Badge>
                </div>
              )) : (
                <div className="text-center py-12 text-white/30">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                  <p>No active threats detected</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card className="bg-white/5 border-white/10 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Security Audit Log</h3>
            <div className="space-y-2 font-mono text-sm">
              {[
                { time: '04:02:15', event: 'BLOCK', target: 'IP 192.168.1.100', reason: 'Brute force attempt' },
                { time: '04:01:42', event: 'ALERT', target: 'User anon-4732', reason: 'Suspicious activity pattern' },
                { time: '04:00:18', event: 'QUARANTINE', target: 'Session xyz-789', reason: 'Anomaly detected' },
                { time: '03:58:33', event: 'SCAN', target: 'System', reason: 'Scheduled security scan' },
                { time: '03:55:07', event: 'BLOCK', target: 'IP 10.0.0.55', reason: 'SQL injection attempt' },
              ].map((log, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded bg-black/30">
                  <span className="text-white/30">{log.time}</span>
                  <Badge 
                    variant="outline" 
                    className={`
                      ${log.event === 'BLOCK' ? 'border-red-500/30 text-red-400' :
                        log.event === 'QUARANTINE' ? 'border-yellow-500/30 text-yellow-400' :
                        log.event === 'ALERT' ? 'border-orange-500/30 text-orange-400' :
                        'border-blue-500/30 text-blue-400'}
                    `}
                  >
                    {log.event}
                  </Badge>
                  <span className="text-white/70">{log.target}</span>
                  <span className="text-white/40 ml-auto">{log.reason}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnubisSentinelPanel;
