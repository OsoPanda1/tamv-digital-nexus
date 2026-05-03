// ============================================================================
// TAMV MD-X4™ - DM-X4-01 Social Cell
// Hook: useSocialFeed — paginated, realtime, Supabase-connected
// ============================================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface SocialPost {
  id: string;
  author_id: string;
  content: string;
  media_url: string | null;
  media_type: string | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  tags: string[] | null;
  created_at: string;
  visibility: 'public' | 'community' | 'private';
  author_name?: string;
  author_avatar?: string;
}

export interface UseSocialFeedOptions {
  pageSize?: number;
  visibility?: 'public' | 'community' | 'all';
}

export interface UseSocialFeedReturn {
  posts: SocialPost[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  refreshFeed: () => void;
}

const PAGE_SIZE_DEFAULT = 20;

export function useSocialFeed(options: UseSocialFeedOptions = {}): UseSocialFeedReturn {
  const { pageSize = PAGE_SIZE_DEFAULT, visibility = 'public' } = options;
  const { user } = useAuth();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(0);
  const mountedRef = useRef(true);

  const fetchPage = useCallback(async (page: number, append: boolean) => {
    setLoading(true);
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (visibility !== 'all') {
      query = query.eq('visibility', visibility);
    }

    const { data, error } = await query;

    if (!mountedRef.current) return;

    if (error || !data) {
      setLoading(false);
      return;
    }

    const authorIds = [...new Set(data.map((p) => p.author_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, display_name, avatar_url')
      .in('user_id', authorIds);

    if (!mountedRef.current) return;

    const profileMap = new Map(
      (profiles ?? []).map((p) => [p.user_id, p])
    );

    const enriched: SocialPost[] = data.map((p) => {
      const prof = profileMap.get(p.author_id);
      return {
        ...p,
        likes_count: p.likes_count ?? 0,
        comments_count: p.comments_count ?? 0,
        shares_count: p.shares_count ?? 0,
        visibility: (p.visibility as SocialPost['visibility']) ?? 'public',
        author_name: prof?.display_name ?? 'Ciudadano TAMV',
        author_avatar: prof?.avatar_url ?? undefined,
      };
    });

    if (append) {
      setPosts((prev) => [...prev, ...enriched]);
    } else {
      setPosts(enriched);
    }

    setHasMore(data.length === pageSize);
    setLoading(false);
  }, [pageSize, visibility]);

  const refreshFeed = useCallback(() => {
    pageRef.current = 0;
    setHasMore(true);
    fetchPage(0, false);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    fetchPage(nextPage, true);
  }, [hasMore, loading, fetchPage]);

  useEffect(() => {
    mountedRef.current = true;
    refreshFeed();
    return () => {
      mountedRef.current = false;
    };
  }, [refreshFeed, user]);

  useEffect(() => {
    const channel = supabase
      .channel('social-feed-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        () => {
          refreshFeed();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshFeed]);

  return { posts, loading, hasMore, loadMore, refreshFeed };
}
