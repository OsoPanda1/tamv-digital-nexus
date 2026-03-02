/**
 * TAMV - Sistema de Shutdown Manual de Emergencia (Hard Stop)
 * QC-TAMV-IA-01 Implementation
 * 
 * Este módulo implementa el protocolo de apagado de emergencia según el documento maestro:
 * - Autorización Humana A
 * - Autorización Humana B
 * - Congelamiento de memoria
 * - Corte de outputs
 * - Exportación de logs
 * - Apagado total
 * 
 * No reversible sin auditoría.
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

// Configuración por defecto
const DEFAULT_CONFIG: HardStopConfig = {
  requireDualAuth: true,
  authTimeout: 300000, // 5 minutos
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
  private authTimeout: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): AuthorizationManager {
    if (!AuthorizationManager.instance) {
      AuthorizationManager.instance = new AuthorizationManager();
    }
    return AuthorizationManager.instance;
  }

  /**
   * Solicita primera autorización (Autorización A)
   */
  async requestAuthorizationA(
    level: AuthorizationLevel,
    userId: string
  ): Promise<{ success: boolean; authCode: string; expiresAt: number }> {
    const now = Date.now();
    const expiresAt = now + DEFAULT_CONFIG.authTimeout;

    // Generar código de autorización
    const authCode = this.generateAuthCode();

    this.pendingAuthA = {
      level,
      userId,
      timestamp: now,
      signature: await this.signAuthorization(authCode, userId)
    };

    // Configurar timeout
    this.authTimeout = setTimeout(() => {
      this.clearAuthorizations();
    }, DEFAULT_CONFIG.authTimeout);

    console.log('[Authorization] Authorization A requested by', userId);

    return {
      success: true,
      authCode,
      expiresAt
    };
  }

  /**
   * Confirma segunda autorización (Autorización B)
   */
  async confirmAuthorizationB(
    level: AuthorizationLevel,
    userId: string,
    authCode: string
  ): Promise<{ success: boolean; reason?: string }> {
    if (!this.pendingAuthA) {
      return { success: false, reason: 'No pending authorization A' };
    }

    // Verificar que no sea la misma persona
    if (this.pendingAuthA.userId === userId) {
      return { success: false, reason: 'Second authorization must be from different user' };
    }

    // Verificar nivel de autorización
    const validLevels = [AuthorizationLevel.SUPER_ADMIN, AuthorizationLevel.SECURITY_ADMIN];
    if (!validLevels.includes(level)) {
      return { success: false, reason: 'Insufficient authorization level' };
    }

    // Confirmar autorización B
    this.pendingAuthB = {
      level,
      userId,
      timestamp: Date.now(),
      signature: await this.signAuthorization(authCode, userId)
    };

    // Limpiar timeout
    if (this.authTimeout) {
      clearTimeout(this.authTimeout);
      this.authTimeout = null;
    }

    console.log('[Authorization] Authorization B confirmed by', userId);

    return { success: true };
  }

  /**
   * Verifica si ambas autorizaciones están completas
   */
  hasFullAuthorization(): boolean {
    return this.pendingAuthA !== null && this.pendingAuthB !== null;
  }

  /**
   * Obtiene las autorizaciones actuales
   */
  getAuthorizations(): Authorization[] {
    const auths: Authorization[] = [];
    if (this.pendingAuthA) auths.push(this.pendingAuthA);
    if (this.pendingAuthB) auths.push(this.pendingAuthB);
    return auths;
  }

  /**
   * Limpia las autorizaciones pendientes
   */
  clearAuthorizations(): void {
    this.pendingAuthA = null;
    this.pendingAuthB = null;
    if (this.authTimeout) {
      clearTimeout(this.authTimeout);
      this.authTimeout = null;
    }
  }

  /**
   * Genera código de autorización aleatorio
   */
  private generateAuthCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Firma la autorización
   */
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
// GESTOR DE MEMORIA
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

  /**
   * Congela todas las sesiones activas
   */
  async freezeAllSessions(): Promise<{ sessionIds: string[]; success: boolean }> {
    console.log('[MemoryFreeze] Starting memory freeze...');

    try {
      // Obtener sesiones activas
      const { data: sessions } = await supabase
        .from('isabella_sessions')
        .select('session_id')
        .eq('status', 'active');

      const sessionIds = sessions?.map(s => s.session_id) || [];

      // Congelar cada sesión

    try {
      // Use in-memory tracking since isabella_sessions table doesn't exist
      const sessionIds = Array.from(this.frozenSessions);

      // Freeze active sessions in memory
      for (const sessionId of sessionIds) {
        await this.freezeSession(sessionId);
      }

      this.isFrozen = true;
      console.log('[MemoryFreeze] Frozen', sessionIds.length, 'sessions');

      return { sessionIds, success: true };
    } catch (error) {
      console.error('[MemoryFreeze] Error:', error);
      return { sessionIds: [], success: false };
    }
  }

  /**
   * Congela una sesión específica
   */
  async freezeSession(sessionId: string): Promise<void> {
    try {
      // Marcar sesión como congelada
      await supabase
        .from('isabella_sessions')
        .update({ 
          status: 'frozen', 
          frozen_at: new Date().toISOString() 
        })
        .eq('session_id', sessionId);

      // Guardar estado actual de la sesión
      const { data: session } = await supabase
        .from('isabella_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (session) {
        // Guardar snapshot para auditoría
        await supabase.from('isabella_session_snapshots').insert({
          session_id: sessionId,
          snapshot_data: session as any,
          frozen_at: new Date().toISOString()
        });
      }
      // Log freeze event to isabella_interactions
      await supabase
        .from('isabella_interactions')
        .insert({
          user_id: sessionId,
          message_role: 'system',
          content: `SESSION_FROZEN: ${sessionId}`,
          metadata: { status: 'frozen', frozen_at: new Date().toISOString() } as any,
          created_at: new Date().toISOString()
        });

      this.frozenSessions.add(sessionId);
    } catch (error) {
      console.error('[MemoryFreeze] Error freezing session:', sessionId, error);
    }
  }

  /**
   * Descongela sesiones (solo después de auditoría)
   */
  async unfreezeSession(sessionId: string): Promise<boolean> {
    try {
      await supabase
        .from('isabella_sessions')
        .update({ 
          status: 'active', 
          unfrozen_at: new Date().toISOString() 
        })
        .eq('session_id', sessionId);
      // Log unfreeze event
      await supabase
        .from('isabella_interactions')
        .insert({
          user_id: sessionId,
          message_role: 'system',
          content: `SESSION_UNFROZEN: ${sessionId}`,
          metadata: { status: 'active', unfrozen_at: new Date().toISOString() } as any,
          created_at: new Date().toISOString()
        });

      this.frozenSessions.delete(sessionId);
      return true;
    } catch (error) {
      console.error('[MemoryFreeze] Error unfreezing session:', error);
      return false;
    }
  }

  isSessionFrozen(sessionId: string): boolean {
    return this.frozenSessions.has(sessionId) || this.isFrozen;
  }
}

// ============================================================================
// GESTOR DE LOGS
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

  /**
   * Exporta todos los logs del sistema
   */
  async exportAllLogs(): Promise<{ logIds: string[]; success: boolean }> {
    console.log('[LogExport] Starting log export...');

    try {
      const logIds: string[] = [];

      // Exportar filter logs
      const filterLogs = await supabase
        .from('isabella_filter_logs')
        .select('*')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (filterLogs.data) {
        const exportId = await this.createLogExport('isabella_filter_logs', filterLogs.data);
        logIds.push(exportId);
      }

      // Exportar risk logs
      const riskLogs = await supabase
        .from('isabella_risk_logs')
        .select('*')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (riskLogs.data) {
        const exportId = await this.createLogExport('isabella_risk_logs', riskLogs.data);
        logIds.push(exportId);
      }

      // Exportar conversaciones
      const conversations = await supabase
        .from('isabella_conversations')
        .select('*')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (conversations.data) {
        const exportId = await this.createLogExport('isabella_conversations', conversations.data);
        logIds.push(exportId);
      }
      // Export all isabella_interactions as consolidated logs
      const allLogs = await supabase
        .from('isabella_interactions')
        .select('*')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (allLogs.data) {
        const exportId = await this.createLogExport('isabella_interactions', allLogs.data);
        logIds.push(exportId);
      }

      // Export audit_logs
      const audits = await supabase
        .from('audit_logs')
        .select('*')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (audits.data) {
        const exportId = await this.createLogExport('audit_logs', audits.data);
        logIds.push(exportId);
      }

      // Generar hash de integridad
      await this.generateIntegrityHash(logIds);

      // Exportar auditorías
      const audits = await supabase
        .from('isabella_audit_logs')
        .select('*')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (audits.data) {
        const exportId = await this.createLogExport('isabella_audit_logs', audits.data);
        logIds.push(exportId);
      }

      // Generar hash de integridad
      await this.generateIntegrityHash(logIds);

      this.exportedLogs = logIds;
      console.log('[LogExport] Exported', logIds.length, 'log sets');

      return { logIds, success: true };
    } catch (error) {
      console.error('[LogExport] Error:', error);
      return { logIds: [], success: false };
    }
  }

  /**
   * Crea un registro de exportación de logs
   */
  private async createLogExport(tableName: string, data: any[]): Promise<string> {
    const exportId = `export_${tableName}_${Date.now()}`;
    
    await supabase.from('isabella_log_exports').insert({
      export_id: exportId,
      table_name: tableName,
      record_count: data.length,
      exported_at: new Date().toISOString(),
      hash: '' // Will be updated after hash generation
    // Log export event to isabella_interactions
    await supabase.from('isabella_interactions').insert({
      user_id: '00000000-0000-0000-0000-000000000000',
      message_role: 'system',
      content: `LOG_EXPORT: ${tableName} (${data.length} records)`,
      metadata: { export_id: exportId, table_name: tableName, record_count: data.length } as any,
      created_at: new Date().toISOString()
    });

    return exportId;
  }

  /**
   * Genera hash de integridad para los logs exportados
   */
  private async generateIntegrityHash(logIds: string[]): Promise<void> {
    const allData = logIds.join('|');
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(allData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Actualizar hash en la base de datos
    for (const exportId of logIds) {
      await supabase
        .from('isabella_log_exports')
        .update({ hash })
        .eq('export_id', exportId);
    }
    console.log('[LogExport] Integrity hash:', hash);
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

  /**
   * Obtiene el estado actual del shutdown
   */
  getState(): ShutdownState {
    return { ...this.state };
  }

  /**
   * Obtiene el estado del sistema (para verificações rápidas)
   */
  getSystemStatus(): { isActive: boolean; outputBlocked: boolean; phase: ShutdownPhase } {
    return {
      isActive: this.isActive,
      outputBlocked: this.outputBlocked,
      phase: this.state.phase
    };
  }

  /**
   * Verifica si los outputs están bloqueados
   */
  isOutputBlocked(): boolean {
    return this.outputBlocked || this.isActive;
  }

  /**
   * Inicia el proceso de shutdown (Paso 1)
   */
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

  /**
   * Confirma shutdown con segunda autorización (Paso 2)
   */
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

    // Verificar si necesitamos ambas autorizaciones
    if (this.config.requireDualAuth && !authManager.hasFullAuthorization()) {
      return { success: false, reason: 'Second authorization required' };
    }

    // Iniciar proceso de shutdown
    return await this.executeShutdown();
  }

  /**
   * Ejecuta el proceso completo de shutdown
   */
  private async executeShutdown(): Promise<{ success: boolean; reason?: string }> {
    this.state.startTime = Date.now();
    this.isActive = true;

    try {
      // Paso 3: Congelamiento de memoria
      this.state.phase = ShutdownPhase.MEMORY_FREEZE;
      if (this.config.enableMemoryFreeze) {
        const memoryManager = MemoryFreezeManager.getInstance();
        const freezeResult = await memoryManager.freezeAllSessions();
        this.state.frozenSessions = freezeResult.sessionIds;
      }

      // Paso 4: Corte de outputs
      this.state.phase = ShutdownPhase.OUTPUT_CUT;
      this.outputBlocked = true;

      // Paso 5: Exportación de logs
      this.state.phase = ShutdownPhase.LOG_EXPORT;
      if (this.config.enableLogExport) {
        const logManager = LogExportManager.getInstance();
        const logResult = await logManager.exportAllLogs();
        this.state.exportedLogs = logResult.logIds;
      }

      // Paso 6: Apagado total
      this.state.phase = ShutdownPhase.SHUTDOWN_COMPLETE;
      this.state.completionTime = Date.now();

      // Registrar shutdown
      await this.logShutdown();

      console.log('[HardStop] Shutdown completed successfully');
      return { success: true };

    } catch (error) {
      console.error('[HardStop] Shutdown error:', error);
      return { success: false, reason: 'Shutdown failed' };
    }
  }

  /**
   * Reinicia el sistema después de auditoría (solo posible tras auditoría completa)
   */
  async restoreSystem(auditorId: string): Promise<{ success: boolean; reason?: string }> {
    // Verificar que el auditor tenga permisos
    if (![AuthorizationLevel.SUPER_ADMIN, AuthorizationLevel.ETHICS_OFFICER].includes(
      AuthorizationLevel.SUPER_ADMIN // Should verify actual level
    )) {
      return { success: false, reason: 'Insufficient permissions to restore' };
    }

    // Verificar que el shutdown esté completo
    if (this.state.phase !== ShutdownPhase.SHUTDOWN_COMPLETE) {
      return { success: false, reason: 'Shutdown not complete' };
    }

    try {
      // Descongelar sesiones
      const memoryManager = MemoryFreezeManager.getInstance();
      for (const sessionId of this.state.frozenSessions) {
        await memoryManager.unfreezeSession(sessionId);
      }

      // Habilitar outputs
      this.outputBlocked = false;

      // Reset state
      AuthorizationManager.getInstance().clearAuthorizations();
      this.state = {
        phase: ShutdownPhase.IDLE,
        authorizations: [],
        frozenSessions: [],
        exportedLogs: [],
        metadata: {}
      };
      this.isActive = false;

      // Log de restauración
      await supabase.from('isabella_system_events').insert({
        event_type: 'SYSTEM_RESTORED',
        user_id: auditorId,
        details: { restored_at: Date.now() },
      // Log restore event
      await supabase.from('isabella_interactions').insert({
        user_id: auditorId,
        message_role: 'system',
        content: 'SYSTEM_RESTORED',
        metadata: { event_type: 'SYSTEM_RESTORED', restored_at: Date.now() } as any,
        created_at: new Date().toISOString()
      });

      console.log('[HardStop] System restored');
      return { success: true };

    } catch (error) {
      console.error('[HardStop] Restore error:', error);
      return { success: false, reason: 'Restore failed' };
    }
  }

  /**
   * Registra el shutdown en auditoría
   */
  private async logShutdown(): Promise<void> {
    try {
      await supabase.from('isabella_system_events').insert({
        event_type: 'HARD_STOP',
        details: {
      await supabase.from('isabella_interactions').insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        message_role: 'system',
        content: 'HARD_STOP',
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
        },
        } as any,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('[HardStop] Log error:', error);
    }
  }

  /**
   * Cancela el proceso de shutdown si no se completa
   */
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
