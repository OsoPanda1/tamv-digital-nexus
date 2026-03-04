/**
 * TAMV - Sistema de Shutdown Manual de Emergencia (Hard Stop)
 * QC-TAMV-IA-01 — All logs consolidated to isabella_interactions table
 */

import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// TIPOS Y CONSTANTES
// ============================================================================

export enum ShutdownPhase {
  IDLE = 'IDLE',
  AUTHORIZATION_A = 'AUTHORIZATION_A',
  AUTHORIZATION_B = 'AUTHORIZATION_B',
  MEMORY_FREEZE = 'MEMORY_FREEZE',
  OUTPUT_CUT = 'OUTPUT_CUT',
  LOG_EXPORT = 'LOG_EXPORT',
  SHUTDOWN_COMPLETE = 'SHUTDOWN_COMPLETE',
  AUDITING = 'AUDITING'
}

export enum AuthorizationLevel {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SECURITY_ADMIN = 'SECURITY_ADMIN',
  ETHICS_OFFICER = 'ETHICS_OFFICER'
}

export interface Authorization {
  level: AuthorizationLevel;
  userId: string;
  timestamp: number;
  signature: string;
}

export interface ShutdownState {
  phase: ShutdownPhase;
  authorizations: Authorization[];
  startTime?: number;
  completionTime?: number;
  frozenSessions: string[];
  exportedLogs: string[];
  metadata: Record<string, unknown>;
}

export interface HardStopConfig {
  requireDualAuth: boolean;
  authTimeout: number;
  enableMemoryFreeze: boolean;
  enableLogExport: boolean;
  allowPartialShutdown: boolean;
}

const DEFAULT_CONFIG: HardStopConfig = {
  requireDualAuth: true,
  authTimeout: 300000,
  enableMemoryFreeze: true,
  enableLogExport: true,
  allowPartialShutdown: false
};

// ============================================================================
// AUTHORIZATION MANAGER
// ============================================================================

class AuthorizationManager {
  private static instance: AuthorizationManager;
  private pendingAuthA: Authorization | null = null;
  private pendingAuthB: Authorization | null = null;
  private authTimeout: ReturnType<typeof setTimeout> | null = null;

  private constructor() {}

  static getInstance(): AuthorizationManager {
    if (!AuthorizationManager.instance) {
      AuthorizationManager.instance = new AuthorizationManager();
    }
    return AuthorizationManager.instance;
  }

  async requestAuthorizationA(level: AuthorizationLevel, userId: string) {
    const now = Date.now();
    const expiresAt = now + DEFAULT_CONFIG.authTimeout;
    const authCode = this.generateAuthCode();

    this.pendingAuthA = {
      level, userId, timestamp: now,
      signature: await this.signAuthorization(authCode, userId)
    };

    this.authTimeout = setTimeout(() => this.clearAuthorizations(), DEFAULT_CONFIG.authTimeout);
    return { success: true, authCode, expiresAt };
  }

  async confirmAuthorizationB(level: AuthorizationLevel, userId: string, authCode: string) {
    if (!this.pendingAuthA) return { success: false, reason: 'No pending authorization A' };
    if (this.pendingAuthA.userId === userId) return { success: false, reason: 'Must be different user' };
    if (![AuthorizationLevel.SUPER_ADMIN, AuthorizationLevel.SECURITY_ADMIN].includes(level)) {
      return { success: false, reason: 'Insufficient level' };
    }

    this.pendingAuthB = {
      level, userId, timestamp: Date.now(),
      signature: await this.signAuthorization(authCode, userId)
    };

    if (this.authTimeout) { clearTimeout(this.authTimeout); this.authTimeout = null; }
    return { success: true };
  }

  hasFullAuthorization(): boolean { return this.pendingAuthA !== null && this.pendingAuthB !== null; }
  getAuthorizations(): Authorization[] {
    const a: Authorization[] = [];
    if (this.pendingAuthA) a.push(this.pendingAuthA);
    if (this.pendingAuthB) a.push(this.pendingAuthB);
    return a;
  }

  clearAuthorizations(): void {
    this.pendingAuthA = null;
    this.pendingAuthB = null;
    if (this.authTimeout) { clearTimeout(this.authTimeout); this.authTimeout = null; }
  }

  private generateAuthCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 12; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  }

  private async signAuthorization(code: string, userId: string): Promise<string> {
    const data = `${code}|${userId}|${Date.now()}`;
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

// ============================================================================
// MEMORY FREEZE MANAGER
// ============================================================================

class MemoryFreezeManager {
  private static instance: MemoryFreezeManager;
  private frozenSessions: Set<string> = new Set();
  private isFrozen = false;

  private constructor() {}
  static getInstance(): MemoryFreezeManager {
    if (!MemoryFreezeManager.instance) MemoryFreezeManager.instance = new MemoryFreezeManager();
    return MemoryFreezeManager.instance;
  }

  async freezeAllSessions(): Promise<{ sessionIds: string[]; success: boolean }> {
    try {
      const sessionIds = Array.from(this.frozenSessions);
      for (const sid of sessionIds) await this.freezeSession(sid);
      this.isFrozen = true;
      return { sessionIds, success: true };
    } catch (error) {
      console.error('[MemoryFreeze] Error:', error);
      return { sessionIds: [], success: false };
    }
  }

  async freezeSession(sessionId: string): Promise<void> {
    try {
      await supabase.from('isabella_interactions').insert({
        user_id: sessionId,
        message_role: 'system',
        content: `SESSION_FROZEN: ${sessionId}`,
        metadata: { status: 'frozen', frozen_at: new Date().toISOString() },
      });
      this.frozenSessions.add(sessionId);
    } catch (error) {
      console.error('[MemoryFreeze] Error freezing session:', sessionId, error);
    }
  }

  async unfreezeSession(sessionId: string): Promise<boolean> {
    try {
      await supabase.from('isabella_interactions').insert({
        user_id: sessionId,
        message_role: 'system',
        content: `SESSION_UNFROZEN: ${sessionId}`,
        metadata: { status: 'active', unfrozen_at: new Date().toISOString() },
      });
      this.frozenSessions.delete(sessionId);
      return true;
    } catch (error) {
      console.error('[MemoryFreeze] Error unfreezing:', error);
      return false;
    }
  }

  isSessionFrozen(sessionId: string): boolean {
    return this.frozenSessions.has(sessionId) || this.isFrozen;
  }
}

// ============================================================================
// LOG EXPORT MANAGER
// ============================================================================

class LogExportManager {
  private static instance: LogExportManager;
  private exportedLogs: string[] = [];

  private constructor() {}
  static getInstance(): LogExportManager {
    if (!LogExportManager.instance) LogExportManager.instance = new LogExportManager();
    return LogExportManager.instance;
  }

  async exportAllLogs(): Promise<{ logIds: string[]; success: boolean }> {
    try {
      const logIds: string[] = [];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const allLogs = await supabase
        .from('isabella_interactions')
        .select('*')
        .gte('created_at', weekAgo);

      if (allLogs.data) {
        const exportId = `export_isabella_interactions_${Date.now()}`;
        await supabase.from('isabella_interactions').insert({
          user_id: '00000000-0000-0000-0000-000000000000',
          message_role: 'system',
          content: `LOG_EXPORT: isabella_interactions (${allLogs.data.length} records)`,
          metadata: { export_id: exportId, record_count: allLogs.data.length },
        });
        logIds.push(exportId);
      }

      const audits = await supabase.from('audit_logs').select('*').gte('created_at', weekAgo);
      if (audits.data) {
        const exportId = `export_audit_logs_${Date.now()}`;
        logIds.push(exportId);
      }

      this.exportedLogs = logIds;
      return { logIds, success: true };
    } catch (error) {
      console.error('[LogExport] Error:', error);
      return { logIds: [], success: false };
    }
  }

  getExportedLogs(): string[] { return this.exportedLogs; }
}

// ============================================================================
// HARD STOP CONTROLLER
// ============================================================================

export class HardStopController {
  private static instance: HardStopController;
  private state: ShutdownState;
  private config: HardStopConfig;
  private isActive = false;
  private outputBlocked = false;

  private constructor(config: Partial<HardStopConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.state = { phase: ShutdownPhase.IDLE, authorizations: [], frozenSessions: [], exportedLogs: [], metadata: {} };
  }

  static getInstance(): HardStopController {
    if (!HardStopController.instance) HardStopController.instance = new HardStopController();
    return HardStopController.instance;
  }

  getState(): ShutdownState { return { ...this.state }; }
  getSystemStatus() { return { isActive: this.isActive, outputBlocked: this.outputBlocked, phase: this.state.phase }; }
  isOutputBlocked(): boolean { return this.outputBlocked || this.isActive; }

  async initiateShutdown(level: AuthorizationLevel, userId: string) {
    if (this.isActive) return { success: false, reason: 'Shutdown already in progress' };
    const result = await AuthorizationManager.getInstance().requestAuthorizationA(level, userId);
    this.state.phase = ShutdownPhase.AUTHORIZATION_A;
    return result;
  }

  async confirmShutdown(level: AuthorizationLevel, userId: string, authCode: string) {
    const authManager = AuthorizationManager.getInstance();
    const result = await authManager.confirmAuthorizationB(level, userId, authCode);
    if (!result.success) return result;

    this.state.phase = ShutdownPhase.AUTHORIZATION_B;
    this.state.authorizations.push({ level, userId, timestamp: Date.now(), signature: '' });

    if (this.config.requireDualAuth && !authManager.hasFullAuthorization()) {
      return { success: false, reason: 'Second authorization required' };
    }
    return await this.executeShutdown();
  }

  private async executeShutdown(): Promise<{ success: boolean; reason?: string }> {
    this.state.startTime = Date.now();
    this.isActive = true;

    try {
      this.state.phase = ShutdownPhase.MEMORY_FREEZE;
      if (this.config.enableMemoryFreeze) {
        const r = await MemoryFreezeManager.getInstance().freezeAllSessions();
        this.state.frozenSessions = r.sessionIds;
      }

      this.state.phase = ShutdownPhase.OUTPUT_CUT;
      this.outputBlocked = true;

      this.state.phase = ShutdownPhase.LOG_EXPORT;
      if (this.config.enableLogExport) {
        const r = await LogExportManager.getInstance().exportAllLogs();
        this.state.exportedLogs = r.logIds;
      }

      this.state.phase = ShutdownPhase.SHUTDOWN_COMPLETE;
      this.state.completionTime = Date.now();
      await this.logShutdown();
      return { success: true };
    } catch (error) {
      console.error('[HardStop] Shutdown error:', error);
      return { success: false, reason: 'Shutdown failed' };
    }
  }

  async restoreSystem(auditorId: string): Promise<{ success: boolean; reason?: string }> {
    if (this.state.phase !== ShutdownPhase.SHUTDOWN_COMPLETE) {
      return { success: false, reason: 'Shutdown not complete' };
    }
    try {
      const mm = MemoryFreezeManager.getInstance();
      for (const sid of this.state.frozenSessions) await mm.unfreezeSession(sid);
      this.outputBlocked = false;
      AuthorizationManager.getInstance().clearAuthorizations();
      this.state = { phase: ShutdownPhase.IDLE, authorizations: [], frozenSessions: [], exportedLogs: [], metadata: {} };
      this.isActive = false;

      await supabase.from('isabella_interactions').insert({
        user_id: auditorId,
        message_role: 'system',
        content: 'SYSTEM_RESTORED',
        metadata: { event_type: 'SYSTEM_RESTORED', restored_at: Date.now() },
      });
      return { success: true };
    } catch (error) {
      console.error('[HardStop] Restore error:', error);
      return { success: false, reason: 'Restore failed' };
    }
  }

  private async logShutdown(): Promise<void> {
    try {
      await supabase.from('isabella_interactions').insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        message_role: 'system',
        content: 'HARD_STOP',
        metadata: {
          event_type: 'HARD_STOP',
          phase: this.state.phase,
          authorizations: this.state.authorizations.map(a => ({ level: a.level, userId: a.userId, timestamp: a.timestamp })),
          frozenSessions: this.state.frozenSessions,
          exportedLogs: this.state.exportedLogs,
          startTime: this.state.startTime,
          completionTime: this.state.completionTime
        },
      });
    } catch (error) {
      console.error('[HardStop] Log error:', error);
    }
  }

  cancelShutdown(): void {
    if (this.state.phase === ShutdownPhase.SHUTDOWN_COMPLETE) return;
    AuthorizationManager.getInstance().clearAuthorizations();
    this.state = { phase: ShutdownPhase.IDLE, authorizations: [], frozenSessions: [], exportedLogs: [], metadata: {} };
    this.isActive = false;
  }
}

export const hardStop = HardStopController.getInstance();
export { AuthorizationManager, MemoryFreezeManager, LogExportManager };
