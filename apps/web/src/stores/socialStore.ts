// ============================================================================
// TAMV MD-X4™ - DM-X4-01 Social Cell Store
// Zustand slice for Social domain state
// ============================================================================

import { create } from 'zustand';
import type { SocialPost } from '@/hooks/useSocialFeed';

export interface SocialStoreState {
  feedPosts: SocialPost[];
  feedLoading: boolean;
  presenceCount: number;
  activeTab: 'feed' | 'stories' | 'live' | 'groups';

  setFeedPosts: (posts: SocialPost[]) => void;
  appendFeedPosts: (posts: SocialPost[]) => void;
  setFeedLoading: (loading: boolean) => void;
  setPresenceCount: (count: number) => void;
  setActiveTab: (tab: SocialStoreState['activeTab']) => void;
}

export const useSocialStore = create<SocialStoreState>((set) => ({
  feedPosts: [],
  feedLoading: false,
  presenceCount: 0,
  activeTab: 'feed',

  setFeedPosts: (posts) => set({ feedPosts: posts }),
  appendFeedPosts: (posts) =>
    set((state) => ({ feedPosts: [...state.feedPosts, ...posts] })),
  setFeedLoading: (feedLoading) => set({ feedLoading }),
  setPresenceCount: (presenceCount) => set({ presenceCount }),
  setActiveTab: (activeTab) => set({ activeTab }),
}));
