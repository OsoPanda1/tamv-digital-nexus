import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface FeedPost {
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
  visibility: string;
  // Joined from profiles
  author_name?: string;
  author_avatar?: string;
}

export function useRealFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("visibility", "public")
      .order("created_at", { ascending: false })
      .limit(30);

    if (!error && data) {
      // Fetch author profiles
      const authorIds = [...new Set(data.map((p) => p.author_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", authorIds);

      const profileMap = new Map(
        (profiles ?? []).map((p) => [p.user_id, p])
      );

      const enriched: FeedPost[] = data.map((p) => {
        const prof = profileMap.get(p.author_id);
        return {
          ...p,
          likes_count: p.likes_count ?? 0,
          comments_count: p.comments_count ?? 0,
          shares_count: p.shares_count ?? 0,
          visibility: p.visibility ?? "public",
          author_name: prof?.display_name ?? "Ciudadano TAMV",
          author_avatar: prof?.avatar_url ?? undefined,
        };
      });
      setPosts(enriched);
    }
    setLoading(false);
  }, []);

  const createPost = useCallback(
    async (content: string, mediaUrl?: string, mediaType?: string) => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("posts")
        .insert({
          author_id: user.id,
          content,
          media_url: mediaUrl ?? null,
          media_type: mediaType ?? null,
        })
        .select()
        .single();

      if (!error && data) {
        await fetchPosts(); // Refresh
        return data;
      }
      return null;
    },
    [user, fetchPosts]
  );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("posts-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPosts]);

  return { posts, loading, createPost, refreshFeed: fetchPosts };
}
