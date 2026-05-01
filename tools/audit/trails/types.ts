export type AuditTrailStatus = 'open' | 'in_progress' | 'resolved' | 'risk_accepted';

export interface AuditFinding {
  id: string;
  type: 'security' | 'performance' | 'architecture' | 'governance' | 'legal';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  evidence?: string;
  recommendation: string;
  status: AuditTrailStatus;
  owner: string;
  openedAt: string;
  resolvedAt?: string;
}
