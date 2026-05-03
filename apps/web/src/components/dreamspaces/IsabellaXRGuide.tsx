// ============================================================================
// TAMV MD-X4™ — Isabella XR Guide
// Contextual AI companion for cognitive safety and guidance in 3D spaces
// ============================================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Shield, AlertTriangle, Sparkles, X, MessageCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SafetyAlert {
  id: string;
  type: 'info' | 'warning' | 'danger';
  message: string;
  timestamp: number;
}

interface IsabellaXRGuideProps {
  environment: string;
  userCount: number;
  fps: number;
  sessionDuration: number; // seconds
  onDismiss?: () => void;
}

const ENVIRONMENT_TIPS: Record<string, string[]> = {
  quantum: [
    'Campo Cuántico: Interactúa con las esferas para observar distorsión de partículas.',
    'El audio theta binaural está diseñado para fomentar concentración profunda.',
    'Usa WASD para explorar — los portales te llevan a zonas de alta energía cuántica.',
  ],
  forest: [
    'Bosque Sensorial: Los cristales flotantes reaccionan a tu proximidad.',
    'Audio alpha para relajación — ideal para sesiones de reflexión.',
    'Explora los senderos ocultos entre los árboles cristalinos.',
  ],
  cosmic: [
    'Espacio Profundo: Las nebulosas se generan proceduralmente en tiempo real.',
    'Audio delta meditativo — recomendado para sesiones de introspección.',
    'El portal central conecta con la red de DreamSpaces federados.',
  ],
  crystal: [
    'Caverna Cristalina: Cada cristal emite una frecuencia única a 432 Hz.',
    'Resonancia armónica — la geometría cristalina amplifica el audio espacial.',
    'Toca los orbes de audio para activar secuencias musicales.',
  ],
};

const SESSION_ALERTS: { minutes: number; message: string; type: SafetyAlert['type'] }[] = [
  { minutes: 30, message: 'Llevas 30 minutos en inmersión. Considera un descanso para tu bienestar cognitivo.', type: 'info' },
  { minutes: 60, message: 'Una hora en XR. Te recomiendo una pausa de 10 minutos para reducir fatiga visual.', type: 'warning' },
  { minutes: 90, message: 'Sesión extendida detectada (90 min). Por tu salud, toma un descanso obligatorio.', type: 'danger' },
];

export function IsabellaXRGuide({ environment, userCount, fps, sessionDuration, onDismiss }: IsabellaXRGuideProps) {
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [currentTip, setCurrentTip] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const triggeredAlerts = useRef(new Set<number>());

  const tips = ENVIRONMENT_TIPS[environment] || ENVIRONMENT_TIPS.quantum;

  // Rotate tips every 15s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((p) => (p + 1) % tips.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [tips.length]);

  // Session duration safety alerts
  useEffect(() => {
    const mins = Math.floor(sessionDuration / 60);
    SESSION_ALERTS.forEach((sa) => {
      if (mins >= sa.minutes && !triggeredAlerts.current.has(sa.minutes)) {
        triggeredAlerts.current.add(sa.minutes);
        setAlerts((prev) => [
          ...prev,
          { id: `session-${sa.minutes}`, type: sa.type, message: sa.message, timestamp: Date.now() },
        ]);
      }
    });
  }, [sessionDuration]);

  // FPS performance alert
  useEffect(() => {
    if (fps > 0 && fps < 20 && !triggeredAlerts.current.has(-1)) {
      triggeredAlerts.current.add(-1);
      setAlerts((prev) => [
        ...prev,
        {
          id: 'fps-low',
          type: 'warning',
          message: `Rendimiento bajo (${fps} FPS). Reduciendo calidad automáticamente para proteger tu experiencia.`,
          timestamp: Date.now(),
        },
      ]);
    }
    if (fps >= 30) triggeredAlerts.current.delete(-1);
  }, [fps]);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  if (collapsed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute bottom-20 left-4 pointer-events-auto z-20"
      >
        <Button
          size="sm"
          variant="outline"
          className="bg-card/90 backdrop-blur-md border-primary/30 gap-2 shadow-lg shadow-primary/10"
          onClick={() => setCollapsed(false)}
        >
          <Brain className="w-4 h-4 text-primary" />
          Isabella
          {alerts.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          )}
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="absolute bottom-20 left-4 pointer-events-auto z-20 max-w-sm">
      {/* Safety Alerts */}
      <AnimatePresence>
        {alerts.slice(-2).map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className={`mb-2 p-3 rounded-lg backdrop-blur-md border flex items-start gap-2 text-xs ${
              alert.type === 'danger'
                ? 'bg-destructive/20 border-destructive/40 text-destructive-foreground'
                : alert.type === 'warning'
                ? 'bg-yellow-900/30 border-yellow-500/30 text-yellow-200'
                : 'bg-primary/10 border-primary/20 text-primary-foreground'
            }`}
          >
            {alert.type === 'danger' ? (
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-destructive" />
            ) : (
              <Shield className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
            )}
            <p className="flex-1">{alert.message}</p>
            <button onClick={() => dismissAlert(alert.id)} className="shrink-0">
              <X className="w-3 h-3 opacity-60 hover:opacity-100" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Isabella Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/90 backdrop-blur-md border border-border/40 rounded-xl overflow-hidden shadow-xl shadow-primary/5"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/20">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Brain className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="text-xs font-bold tracking-wide">ISABELLA · Guía XR</span>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-primary/10 border-primary/20">
              AVIXA
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setCollapsed(true)} className="p-1 rounded hover:bg-muted/50">
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Contextual Tip */}
        <div className="px-3 py-2.5">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTip}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-xs text-muted-foreground leading-relaxed"
            >
              <Sparkles className="w-3 h-3 inline mr-1 text-primary" />
              {tips[currentTip]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Status Footer */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-muted/30 text-[10px] text-muted-foreground">
          <span>{userCount} usuarios · {Math.floor(sessionDuration / 60)}m sesión</span>
          <span className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${fps >= 45 ? 'bg-green-400' : fps >= 30 ? 'bg-yellow-400' : 'bg-red-400'}`} />
            Seguridad Cognitiva Activa
          </span>
        </div>
      </motion.div>
    </div>
  );
}
