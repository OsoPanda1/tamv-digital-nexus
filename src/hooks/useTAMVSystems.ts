// ============================================================================
// TAMV MD-X4â"¢ - Custom Hooks for System Integration
// React hooks for accessing all TAMV systems
// ============================================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTAMVStore } from '@/stores/tamvStore';
import { getKAOSInstance, type AudioEnvironment, type BinauralPreset, type NotificationType } from '@/systems/KAOSAudioSystem';
import { anubis, type SecurityEvent, type SecurityMetrics } from '@/systems/AnubisSecuritySystem';
import { university, type Course, type Enrollment, type Certificate } from '@/systems/UniversitySystem';
import { economy, type Wallet, type Transaction, type LotteryDraw, type MembershipTier } from '@/systems/EconomySystem';

// ============================================================================
// KAOS Audio Hook
// ============================================================================

export function useKAOSAudio() {
  const kaos = getKAOSInstance();
  const [isInitialized, setIsInitialized] = useState(false);
  const [config, setConfig] = useState(kaos.getConfig());

  useEffect(() => {
    const init = async () => {
      const success = await kaos.initialize();
      setIsInitialized(success);
    };
    init();
  }, []);

  const playBinaural = useCallback(async (preset: BinauralPreset, duration?: number) => {
    await kaos.playBinauralPreset(preset, duration);
  }, []);

  const playNotification = useCallback(async (type: NotificationType, position?: { x: number; y: number; z: number }) => {
    await kaos.playNotification(type, position);
  }, []);

  const playEnvironment = useCallback(async (environment: AudioEnvironment, duration?: number) => {
    await kaos.playEnvironment(environment, duration);
  }, []);

  const stopBinaural = useCallback(() => {
    kaos.stopBinaural();
  }, []);

  const stopEnvironment = useCallback(() => {
    kaos.stopEnvironment();
  }, []);

  const setVolume = useCallback((volume: number) => {
    kaos.setMasterVolume(volume);
    setConfig(kaos.getConfig());
  }, []);

  const setListenerPosition = useCallback((x: number, y: number, z: number) => {
    kaos.setListenerPosition(x, y, z);
  }, []);

  return {
    isInitialized,
    config,
    playBinaural,
    playNotification,
    playEnvironment,
    stopBinaural,
    stopEnvironment,
    setVolume,
    setListenerPosition,
  };
}

// ============================================================================
// Anubis Security Hook
// ============================================================================

export function useAnubisSecurity() {
  const [metrics, setMetrics] = useState<SecurityMetrics>(anubis.getMetrics());
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(anubis.getMetrics());
      setEvents(anubis.getRecentEvents(20));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const runScan = useCallback(async () => {
    const scanEvents = await anubis.runSecurityScan();
    setEvents(anubis.getRecentEvents(20));
    setMetrics(anubis.getMetrics());
    return scanEvents;
  }, []);

  const blockThreat = useCallback(async (eventId: string) => {
    const success = await anubis.blockThreat(eventId);
    setMetrics(anubis.getMetrics());
    return success;
  }, []);

  const healThreat = useCallback(async (eventId: string) => {
    const success = await anubis.initiateSelfHealing(eventId);
    setMetrics(anubis.getMetrics());
    return success;
  }, []);

  const getReport = useCallback(() => {
    return anubis.generateReport();
  }, []);

  return {
    metrics,
    events,
    isMonitoring,
    runScan,
    blockThreat,
    healThreat,
    getReport,
  };
}

// ============================================================================
// University Hook
// ============================================================================

export function useUniversity() {
  const user = useTAMVStore(state => state.user);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [statistics, setStatistics] = useState(university.getStatistics());

  useEffect(() => {
    setCourses(university.getAllCourses());
    if (user) {
      setEnrollments(university.getUserEnrollments(user.id));
    }
  }, [user]);

  const enroll = useCallback((courseId: string) => {
    if (!user) return null;
    const enrollment = university.enrollUser(user.id, courseId);
    setEnrollments(university.getUserEnrollments(user.id));
    return enrollment;
  }, [user]);

  const updateProgress = useCallback((courseId: string, lessonId: string) => {
    if (!user) return null;
    const enrollment = university.updateLessonProgress(user.id, courseId, lessonId);
    setEnrollments(university.getUserEnrollments(user.id));
    return enrollment;
  }, [user]);

  const completeCourse = useCallback(async (courseId: string) => {
    if (!user) return null;
    const certificate = await university.completeCourse(user.id, courseId);
    setEnrollments(university.getUserEnrollments(user.id));
    return certificate;
  }, [user]);

  const searchCourses = useCallback((query: string) => {
    return university.searchCourses(query);
  }, []);

  const getCourse = useCallback((courseId: string) => {
    return university.getCourse(courseId);
  }, []);

  return {
    courses,
    enrollments,
    statistics,
    enroll,
    updateProgress,
    completeCourse,
    searchCourses,
    getCourse,
  };
}

// ============================================================================
// Economy Hook
// ============================================================================

export function useEconomy() {
  const user = useTAMVStore(state => state.user);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [lotteryDraws, setLotteryDraws] = useState<LotteryDraw[]>([]);
  const [fenixFund, setFenixFund] = useState(economy.getFenixFund());
  const [statistics, setStatistics] = useState(economy.getStatistics());

  useEffect(() => {
    if (user) {
      setWallet(economy.getWallet(user.id));
      setTransactions(economy.getUserTransactions(user.id));
    }
    setLotteryDraws(economy.getActiveDraws());
    setFenixFund(economy.getFenixFund());
    setStatistics(economy.getStatistics());
  }, [user]);

  const refreshWallet = useCallback(() => {
    if (user) {
      setWallet(economy.getWallet(user.id));
      setTransactions(economy.getUserTransactions(user.id));
    }
  }, [user]);

  const transferCredits = useCallback((toUserId: string, amount: number, description: string) => {
    if (!user) return null;
    const tx = economy.transferCredits(user.id, toUserId, amount, description);
    refreshWallet();
    return tx;
  }, [user, refreshWallet]);

  const purchaseTickets = useCallback((drawId: string, quantity: number) => {
    const result = economy.purchaseTickets(user?.id || '', drawId, quantity);
    refreshWallet();
    setLotteryDraws(economy.getActiveDraws());
    return result;
  }, [user, refreshWallet]);

  const upgradeMembership = useCallback((tier: MembershipTier) => {
    if (!user) return null;
    const updatedWallet = economy.upgradeMembership(user.id, tier);
    setWallet(updatedWallet);
    return updatedWallet;
  }, [user]);

  const getCommissionRate = useCallback(() => {
    if (!user) return 0.30;
    return economy.getCommissionRate(user.id);
  }, [user]);

  return {
    wallet,
    transactions,
    lotteryDraws,
    fenixFund,
    statistics,
    refreshWallet,
    transferCredits,
    purchaseTickets,
    upgradeMembership,
    getCommissionRate,
  };
}

// ============================================================================
// Quantum State Hook (Enhanced)
// ============================================================================

export function useQuantumState() {
  const store = useTAMVStore();
  
  const coherence = store.quantumCoherence;
  const user = store.user;
  const sensorPermissions = store.sensorPermissions;
  const activeDreamSpace = store.activeDreamSpace;

  const updateCoherence = useCallback((delta: number) => {
    store.updateCoherence(delta);
  }, [store]);

  const setSensorPermission = useCallback((sensor: keyof typeof sensorPermissions, granted: boolean) => {
    store.setSensorPermission(sensor, granted);
  }, [store]);

  const activateDreamSpace = useCallback((spaceId: string) => {
    // Find the dream space and set it as active
    store.setActiveDreamSpace({ id: spaceId } as any);
  }, [store]);

  const deactivateDreamSpace = useCallback(() => {
    store.setActiveDreamSpace(null);
  }, [store]);

  return {
    coherence,
    user,
    sensorPermissions,
    activeDreamSpace,
    updateCoherence,
    setSensorPermission,
    activateDreamSpace,
    deactivateDreamSpace,
    isAuthenticated: store.isAuthenticated,
    login: store.setUser,
    logout: store.logout,
  };
}

// ============================================================================
// Notifications Hook
// ============================================================================

export function useNotifications() {
  const notifications = useTAMVStore(state => state.notifications);
  const unreadCount = useTAMVStore(state => state.unreadCount);
  const addNotification = useTAMVStore(state => state.addNotification);
  const markRead = useTAMVStore(state => state.markNotificationRead);
  const clearAll = useTAMVStore(state => state.clearNotifications);

  const notify = useCallback((type: 'info' | 'success' | 'warning' | 'error' | 'social' | 'achievement', title: string, message: string, actionUrl?: string) => {
    addNotification({ type, title, message, actionUrl });
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    notify,
    markRead,
    clearAll,
  };
}

// ============================================================================
// WebSocket Hook for Real-time Features
// ============================================================================

export function useWebSocket(url?: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = url || import.meta.env.VITE_SUPABASE_URL?.replace('https', 'wss') + '/websocket';
    
    if (!wsUrl) return;

    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        console.log('[WebSocket] Connected');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch (e) {
          setLastMessage(event.data);
        }
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        console.log('[WebSocket] Disconnected');
      };

      wsRef.current.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
      };
    } catch (error) {
      console.error('[WebSocket] Connection failed:', error);
    }

    return () => {
      wsRef.current?.close();
    };
  }, [url]);

  const send = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return {
    isConnected,
    lastMessage,
    send,
  };
}

// ============================================================================
// Export all hooks
// ============================================================================

export default {
  useKAOSAudio,
  useAnubisSecurity,
  useUniversity,
  useEconomy,
  useQuantumState,
  useNotifications,
  useWebSocket,
};