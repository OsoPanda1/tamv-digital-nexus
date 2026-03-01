/**
 * TAMV - Sistema de Shutdown Manual de Emergencia (Hard Stop)
 * QC-TAMV-IA-01 Implementation
 * 
 * Uses existing tables: isabella_interactions, ai_interactions for logging.
 * Session/export management done in-memory with console logging.
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
  metadata: Record<string, any>;
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
// GESTOR DE AUTORIZACIONES
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

  async requestAuthorizationA(
    level: AuthorizationLevel,
    userId: string
  ): Promise<{ success: boolean; authCode: string; expiresAt: number }> {
    const now = Date.now();
    const expiresAt = now + DEFAULT_CONFIG.authTimeout;
    const authCode = this.generateAuthCode();

    this.pendingAuthA = {
      level,
      userId,
      timestamp: now,
      signature: await this.signAuthorization(authCode, userId)
    };

    this.authTimeout = setTimeout(() => {
      this.clearAuthorizations();
    }, DEFAULT_CONFIG.authTimeout);

    console.log('[Authorization] Authorization A requested by', userId);
    return { success: true, authCode, expiresAt };
  }

  async confirmAuthorizationB(
    level: AuthorizationLevel,
    userId: string,
    authCode: string
  ): Promise<{ success: boolean; reason?: string }> {
    if (!this.pendingAuthA) {
      return { success: false, reason: 'No pending authorization A' };
    }
    if (this.pendingAuthA.userId === userId) {
      return { success: false, reason: 'Second authorization must be from different user' };
    }
    const validLevels = [AuthorizationLevel.SUPER_ADMIN, AuthorizationLevel.SECURITY_ADMIN];
    if (!validLevels.includes(level)) {
      return { success: false, reason: 'Insufficient authorization level' };
    }

    this.pendingAuthB = {
      level,
      userId,
      timestamp: Date.now(),
      signature: await this.signAuthorization(authCode, userId)
    };

    if (this.authTimeout) {
      clearTimeout(this.authTimeout);
      this.authTimeout = null;
    }

    return { success: true };
  }

  hasFullAuthorization(): boolean {
    return this.pendingAuthA !== null && this.pendingAuthB !== null;
  }

  getAuthorizations(): Authorization[] {
    const auths: Authorization[] = [];
    if (this.pendingAuthA) auths.push(this.pendingAuthA);
    if (this.pendingAuthB) auths.push(this.pendingAuthB);
    return auths;
  }

  clearAuthorizations(): void {
    this.pendingAuthA = null;
    this.pendingAuthB = null;
    if (this.authTimeout) {
      clearTimeout(this.authTimeout);
      this.authTimeout = null;
    }
  }

  private generateAuthCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  private async signAuthorization(code: string, userId: string): Promise<string> {
    const data = `${code}|${userId}|${Date.now()}`;
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

// ============================================================================
// GESTOR DE MEMORIA (in-memory, no DB tables needed)
// ============================================================================

class MemoryFreezeManager {
  private static instance: MemoryFreezeManager;
  private frozenSessions: Set<string> = new Set();
  private isFrozen = false;

  private constructor() {}

  static getInstance(): MemoryFreezeManager {
    if (!MemoryFreezeManager.instance) {
      MemoryFreezeManager.instance = new MemoryFreezeManager();
    }
    return MemoryFreezeManager.instance;
  }

  async freezeAllSessions(): Promise<{ sessionIds: string[]; success: boolean }> {
    console.log('[MemoryFreeze] Starting memory freeze...');
    try {
      // Use isabella_interactions to find recent active sessions
      const { data: interactions } = await supabase
        .from('isabella_interactions')
        .select('user_id')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .limit(100);

      const sessionIds = [...new Set(interactions?.map(i => i.user_id) || [])];

      for (const sessionId of sessionIds) {
        this.frozenSessions.add(sessionId);
      }

      this.isFrozen = true;
      console.log('[MemoryFreeze] Frozen', sessionIds.length, 'sessions');
      return { sessionIds, success: true };
    } catch (error) {
      console.error('[MemoryFreeze] Error:', error);
      return { sessionIds: [], success: false };
    }
  }

  async unfreezeSession(sessionId: string): Promise<boolean> {
    this.frozenSessions.delete(sessionId);
    return true;
  }

  isSessionFrozen(sessionId: string): boolean {
    return this.frozenSessions.has(sessionId) || this.isFrozen;
  }
}

// ============================================================================
// GESTOR DE LOGS (uses existing tables)
// ============================================================================

class LogExportManager {
  private static instance: LogExportManager;
  private exportedLogs: string[] = [];

  private constructor() {}

  static getInstance(): LogExportManager {
    if (!LogExportManager.instance) {
      LogExportManager.instance = new LogExportManager();
    }
    return LogExportManager.instance;
  }

  async exportAllLogs(): Promise<{ logIds: string[]; success: boolean }> {
    console.log('[LogExport] Starting log export...');
    try {
      const logIds: string[] = [];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // Export isabella_interactions
      const interactions = await supabase
        .from('isabella_interactions')
        .select('*')
        .gte('created_at', weekAgo);

      if (interactions.data) {
        const exportId = `export_isabella_interactions_${Date.now()}`;
        console.log(`[LogExport] Exported ${interactions.data.length} isabella_interactions`);
        logIds.push(exportId);
      }

      // Export ai_interactions
      const aiInteractions = await supabase
        .from('ai_interactions')
        .select('*')
        .gte('created_at', weekAgo);

      if (aiInteractions.data) {
        const exportId = `export_ai_interactions_${Date.now()}`;
        console.log(`[LogExport] Exported ${aiInteractions.data.length} ai_interactions`);
        logIds.push(exportId);
      }

      // Export security_scans
      const scans = await supabase
        .from('security_scans')
        .select('*')
        .gte('created_at', weekAgo);

      if (scans.data) {
        const exportId = `export_security_scans_${Date.now()}`;
        console.log(`[LogExport] Exported ${scans.data.length} security_scans`);
        logIds.push(exportId);
      }

      this.exportedLogs = logIds;
      console.log('[LogExport] Exported', logIds.length, 'log sets');
      return { logIds, success: true };
    } catch (error) {
      console.error('[LogExport] Error:', error);
      return { logIds: [], success: false };
    }
  }

  getExportedLogs(): string[] {
    return this.exportedLogs;
  }
}

// ============================================================================
// CONTROLADOR PRINCIPAL DE SHUTDOWN
// ============================================================================

export class HardStopController {
  private static instance: HardStopController;
  private state: ShutdownState;
  private config: HardStopConfig;
  private isActive = false;
  private outputBlocked = false;

  private constructor(config: Partial<HardStopConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.state = {
      phase: ShutdownPhase.IDLE,
      authorizations: [],
      frozenSessions: [],
      exportedLogs: [],
      metadata: {}
    };
  }

  static getInstance(): HardStopController {
    if (!HardStopController.instance) {
      HardStopController.instance = new HardStopController();
    }
    return HardStopController.instance;
  }

  getState(): ShutdownState {
    return { ...this.state };
  }

  getSystemStatus(): { isActive: boolean; outputBlocked: boolean; phase: ShutdownPhase } {
    return {
      isActive: this.isActive,
      outputBlocked: this.outputBlocked,
      phase: this.state.phase
    };
  }

  isOutputBlocked(): boolean {
    return this.outputBlocked || this.isActive;
  }

  async initiateShutdown(
    level: AuthorizationLevel,
    userId: string
  ): Promise<{ success: boolean; authCode?: string; expiresAt?: number; reason?: string }> {
    if (this.isActive) {
      return { success: false, reason: 'Shutdown already in progress' };
    }

    const authManager = AuthorizationManager.getInstance();
    const result = await authManager.requestAuthorizationA(level, userId);

    this.state.phase = ShutdownPhase.AUTHORIZATION_A;
    this.state.authorizations.push(result as any);

    return result;
  }

  async confirmShutdown(
    level: AuthorizationLevel,
    userId: string,
    authCode: string
  ): Promise<{ success: boolean; reason?: string }> {
    const authManager = AuthorizationManager.getInstance();
    const result = await authManager.confirmAuthorizationB(level, userId, authCode);

    if (!result.success) {
      return result;
    }

    this.state.phase = ShutdownPhase.AUTHORIZATION_B;
    this.state.authorizations.push({
      level,
      userId,
      timestamp: Date.now(),
      signature: ''
    });

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
        const memoryManager = MemoryFreezeManager.getInstance();
        const freezeResult = await memoryManager.freezeAllSessions();
        this.state.frozenSessions = freezeResult.sessionIds;
      }

      this.state.phase = ShutdownPhase.OUTPUT_CUT;
      this.outputBlocked = true;

      this.state.phase = ShutdownPhase.LOG_EXPORT;
      if (this.config.enableLogExport) {
        const logManager = LogExportManager.getInstance();
        const logResult = await logManager.exportAllLogs();
        this.state.exportedLogs = logResult.logIds;
      }

      this.state.phase = ShutdownPhase.SHUTDOWN_COMPLETE;
      this.state.completionTime = Date.now();

      await this.logShutdown();
      console.log('[HardStop] Shutdown completed successfully');
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
      const memoryManager = MemoryFreezeManager.getInstance();
      for (const sessionId of this.state.frozenSessions) {
        await memoryManager.unfreezeSession(sessionId);
      }

      this.outputBlocked = false;
      AuthorizationManager.getInstance().clearAuthorizations();
      this.state = {
        phase: ShutdownPhase.IDLE,
        authorizations: [],
        frozenSessions: [],
        exportedLogs: [],
        metadata: {}
      };
      this.isActive = false;

      // Log restoration to isabella_interactions
      await supabase.from('isabella_interactions').insert({
        user_id: auditorId,
        message_role: 'system',
        content: 'SYSTEM_RESTORED',
        metadata: { restored_at: Date.now(), event_type: 'SYSTEM_RESTORED' }
      });

      console.log('[HardStop] System restored');
      return { success: true };
    } catch (error) {
      console.error('[HardStop] Restore error:', error);
      return { success: false, reason: 'Restore failed' };
    }
  }

  private async logShutdown(): Promise<void> {
    try {
      // Log shutdown event to isabella_interactions
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('isabella_interactions').insert({
        user_id: user?.id || '00000000-0000-0000-0000-000000000000',
        message_role: 'system',
        content: 'HARD_STOP_EXECUTED',
        metadata: {
          event_type: 'HARD_STOP',
          phase: this.state.phase,
          authorizations: this.state.authorizations.map(a => ({
            level: a.level,
            userId: a.userId,
            timestamp: a.timestamp
          })),
          frozenSessions: this.state.frozenSessions,
          exportedLogs: this.state.exportedLogs,
          startTime: this.state.startTime,
          completionTime: this.state.completionTime
        }
      });
    } catch (error) {
      console.error('[HardStop] Log error:', error);
    }
  }

  cancelShutdown(): void {
    if (this.state.phase === ShutdownPhase.SHUTDOWN_COMPLETE) {
      console.warn('[HardStop] Cannot cancel completed shutdown');
      return;
    }

    AuthorizationManager.getInstance().clearAuthorizations();
    this.state = {
      phase: ShutdownPhase.IDLE,
      authorizations: [],
      frozenSessions: [],
      exportedLogs: [],
      metadata: {}
    };
    this.isActive = false;
    console.log('[HardStop] Shutdown cancelled');
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const hardStop = HardStopController.getInstance();
export { AuthorizationManager, MemoryFreezeManager, LogExportManager };
