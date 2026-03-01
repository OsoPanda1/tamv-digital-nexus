// ============================================================================
// TAMV MD-X4™ - Global State Management Store
// Centralized Zustand store for the entire ecosystem
// ============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'public' | 'creator' | 'pro' | 'admin';
  createdAt: string;
  dignityScore: number;
  reputationScore: number;
  trustLevel: number;
}

export interface DreamSpace {
  id: string;
  name: string;
  description: string;
  environment: 'quantum' | 'forest' | 'cosmic' | 'crystal';
  ownerId: string;
  participants: number;
  maxParticipants: number;
  isPublic: boolean;
  coherenceRequired: number;
  audioType: 'binaural' | 'ambient' | 'interactive';
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'social' | 'achievement';
  title: string;
  message: string;
  read: boolean;
  timestamp: number;
  actionUrl?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  emotion?: 'neutral' | 'alegría' | 'tristeza' | 'poder' | 'duda';
}

export interface Wallet {
  balanceTCEP: number;
  balanceTAU: number;
  lockedBalance: number;
  membershipTier: 'free' | 'premium' | 'vip' | 'elite' | 'celestial' | 'enterprise';
  lifetimeEarned: number;
  lifetimeSpent: number;
}

export interface CourseProgress {
  courseId: string;
  progress: number;
  completed: boolean;
  lastAccessed: string;
}

export interface SensorPermissions {
  audio: boolean;
  video: boolean;
  haptic: boolean;
  geolocation: boolean;
  notifications: boolean;
}

// ============================================================================
// Store State Interface
// ============================================================================

interface TAMVState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Wallet & Economy
  wallet: Wallet | null;

  // Dream Spaces
  activeDreamSpace: DreamSpace | null;
  dreamSpaces: DreamSpace[];
  quantumCoherence: number;

  // Isabella AI
  chatMessages: Message[];
  chatLoading: boolean;
  chatEmotion: string;

  // Notifications
  notifications: Notification[];
  unreadCount: number;

  // University
  courseProgress: CourseProgress[];
  enrolledCourses: string[];

  // Permissions
  sensorPermissions: SensorPermissions;
  introShown: boolean;

  // UI State
  sidebarOpen: boolean;
  theme: 'dark' | 'light' | 'quantum';

  // Actions - Auth
  setUser: (user: User | null) => void;
  logout: () => void;

  // Actions - Wallet
  setWallet: (wallet: Wallet | null) => void;
  updateBalance: (amount: number, type: 'tcep' | 'tau') => void;

  // Actions - Dream Spaces
  setActiveDreamSpace: (space: DreamSpace | null) => void;
  setDreamSpaces: (spaces: DreamSpace[]) => void;
  updateCoherence: (delta: number) => void;

  // Actions - Isabella AI
  addMessage: (message: Message) => void;
  setChatLoading: (loading: boolean) => void;
  setChatEmotion: (emotion: string) => void;
  clearChat: () => void;

  // Actions - Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Actions - University
  enrollCourse: (courseId: string) => void;
  updateCourseProgress: (courseId: string, progress: number) => void;

  // Actions - Permissions
  setSensorPermission: (sensor: keyof SensorPermissions, granted: boolean) => void;
  setIntroShown: (shown: boolean) => void;

  // Actions - UI
  toggleSidebar: () => void;
  setTheme: (theme: 'dark' | 'light' | 'quantum') => void;
}

// ============================================================================
// Store Implementation
// ============================================================================

export const useTAMVStore = create<TAMVState>()(
  persist(
    (set, get) => ({
      // Initial State - Auth
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Initial State - Wallet
      wallet: null,

      // Initial State - Dream Spaces
      activeDreamSpace: null,
      dreamSpaces: [],
      quantumCoherence: 50,

      // Initial State - Isabella AI
      chatMessages: [],
      chatLoading: false,
      chatEmotion: 'neutral',

      // Initial State - Notifications
      notifications: [],
      unreadCount: 0,

      // Initial State - University
      courseProgress: [],
      enrolledCourses: [],

      // Initial State - Permissions
      sensorPermissions: {
        audio: false,
        video: false,
        haptic: false,
        geolocation: false,
        notifications: false,
      },
      introShown: false,

      // Initial State - UI
      sidebarOpen: true,
      theme: 'dark',

      // Actions - Auth
      setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      }),

      logout: () => set({
        user: null,
        isAuthenticated: false,
        wallet: null,
        activeDreamSpace: null,
        chatMessages: [],
        notifications: [],
        unreadCount: 0,
      }),

      // Actions - Wallet
      setWallet: (wallet) => set({ wallet }),

      updateBalance: (amount, type) => set((state) => {
        if (!state.wallet) return state;
        const key = type === 'tcep' ? 'balanceTCEP' : 'balanceTAU';
        return {
          wallet: {
            ...state.wallet,
            [key]: state.wallet[key] + amount,
            lifetimeEarned: amount > 0 ? state.wallet.lifetimeEarned + amount : state.wallet.lifetimeEarned,
            lifetimeSpent: amount < 0 ? state.wallet.lifetimeSpent + Math.abs(amount) : state.wallet.lifetimeSpent,
          }
        };
      }),

      // Actions - Dream Spaces
      setActiveDreamSpace: (space) => set({ activeDreamSpace: space }),

      setDreamSpaces: (spaces) => set({ dreamSpaces: spaces }),

      updateCoherence: (delta) => set((state) => ({
        quantumCoherence: Math.max(0, Math.min(100, state.quantumCoherence + delta))
      })),

      // Actions - Isabella AI
      addMessage: (message) => set((state) => ({
        chatMessages: [...state.chatMessages, message]
      })),

      setChatLoading: (loading) => set({ chatLoading: loading }),

      setChatEmotion: (emotion) => set({ chatEmotion: emotion }),

      clearChat: () => set({ chatMessages: [], chatEmotion: 'neutral' }),

      // Actions - Notifications
      addNotification: (notification) => set((state) => {
        const newNotification: Notification = {
          ...notification,
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          read: false,
        };
        return {
          notifications: [newNotification, ...state.notifications].slice(0, 100),
          unreadCount: state.unreadCount + 1,
        };
      }),

      markNotificationRead: (id) => set((state) => {
        const notif = state.notifications.find(n => n.id === id);
        if (!notif || notif.read) return state;
        return {
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        };
      }),

      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),

      // Actions - University
      enrollCourse: (courseId) => set((state) => {
        if (state.enrolledCourses.includes(courseId)) return state;
        return {
          enrolledCourses: [...state.enrolledCourses, courseId],
          courseProgress: [
            ...state.courseProgress,
            { courseId, progress: 0, completed: false, lastAccessed: new Date().toISOString() }
          ],
        };
      }),

      updateCourseProgress: (courseId, progress) => set((state) => ({
        courseProgress: state.courseProgress.map(cp =>
          cp.courseId === courseId
            ? { ...cp, progress, completed: progress >= 100, lastAccessed: new Date().toISOString() }
            : cp
        ),
      })),

      // Actions - Permissions
      setSensorPermission: (sensor, granted) => set((state) => ({
        sensorPermissions: {
          ...state.sensorPermissions,
          [sensor]: granted,
        }
      })),

      setIntroShown: (shown) => set({ introShown: shown }),

      // Actions - UI
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'tamv-quantum-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        wallet: state.wallet,
        quantumCoherence: state.quantumCoherence,
        chatMessages: state.chatMessages.slice(-50),
        sensorPermissions: state.sensorPermissions,
        introShown: state.introShown,
        enrolledCourses: state.enrolledCourses,
        courseProgress: state.courseProgress,
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

// ============================================================================
// Selectors (for optimized re-renders)
// ============================================================================

export const selectUser = (state: TAMVState) => state.user;
export const selectIsAuthenticated = (state: TAMVState) => state.isAuthenticated;
export const selectWallet = (state: TAMVState) => state.wallet;
export const selectQuantumCoherence = (state: TAMVState) => state.quantumCoherence;
export const selectActiveDreamSpace = (state: TAMVState) => state.activeDreamSpace;
export const selectNotifications = (state: TAMVState) => state.notifications;
export const selectUnreadCount = (state: TAMVState) => state.unreadCount;
export const selectChatMessages = (state: TAMVState) => state.chatMessages;
export const selectSensorPermissions = (state: TAMVState) => state.sensorPermissions;

// ============================================================================
// Export default
// ============================================================================

export default useTAMVStore;