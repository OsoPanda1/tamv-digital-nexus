import type { AuditFinding } from './types';

export const openDAAuditFindings: AuditFinding[] = [
  {
    id: 'OPDA-SEC-001',
    type: 'security',
    severity: 'medium',
    title: 'Revisión de dependencias legacy en runtime científico',
    description: 'Se requiere auditoría continua de JDK/libs nativas y hardening de integración.',
    location: 'build scripts, native libs',
    recommendation: 'Ejecutar OWASP Dependency-Check/Snyk + ASAN/Valgrind en interfaces nativas.',
    status: 'open',
    owner: 'security_team',
    openedAt: new Date().toISOString(),
  },
];
