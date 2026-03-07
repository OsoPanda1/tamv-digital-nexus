// ============================================================================
// TAMV MD-X4™ — Singularity Operations Center (Full Page)
// The central DevOps + AI + System dashboard
// Autor visionario: Edwin Oswaldo Castillo Trejo
// ============================================================================

import { motion } from 'framer-motion';
import { Cpu, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EpicBackground } from '@/components/effects/EpicBackground';
import { PremiumCard } from '@/components/effects/PremiumCard';
import { DevOpsPanel } from '@/components/devops/DevOpsPanel';
import { SystemHealthMonitor } from '@/components/devops/SystemHealthMonitor';

const Singularity = () => {
  return (
    <div className="relative min-h-screen">
      <EpicBackground />

      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Badge className="mb-4 px-4 py-1.5 text-sm bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30">
              <Cpu className="w-3 h-3 mr-2" />
              OMNI-KERNEL · Centro de Operaciones
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3">
              <span className="text-gradient-quantum">Singularity</span> Operations
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Controla la evolución autónoma del código, analiza riesgos con Isabella,
              monitorea la salud del sistema y ejecuta rollbacks seguros.
            </p>
          </motion.div>

          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <PremiumCard className="p-6">
              <SystemHealthMonitor />
            </PremiumCard>
          </motion.div>

          {/* DevOps Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PremiumCard className="p-6">
              <DevOpsPanel />
            </PremiumCard>
          </motion.div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground">
            © 2026 TAMV MD-X4™ · Visión de Edwin Oswaldo Castillo Trejo · Dedicado a Reina Trejo Serrano ✦
          </p>
        </div>
      </div>
    </div>
  );
};

export default Singularity;
