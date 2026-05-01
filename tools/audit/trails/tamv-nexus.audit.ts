import type { AuditFinding } from './types';

export const tamvNexusAuditFindings: AuditFinding[] = [
  {
    id: 'TAMV-NEXUS-ARCH-CONST-002',
    type: 'architecture',
    severity: 'high',
    title: 'Lógica crítica fuera de Unified Constitutional API',
    description: 'Hooks y funciones pueden ejecutar lógica sin gatekeeper único.',
    location: 'src/hooks, supabase/functions',
    recommendation: 'Migrar flujos a UnifiedAPI + ConstitutionalGuard + ConstitutionEngine.',
    status: 'in_progress',
    owner: 'architecture_team',
    openedAt: new Date().toISOString(),
  },
];
