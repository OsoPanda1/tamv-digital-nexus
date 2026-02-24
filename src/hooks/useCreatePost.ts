// ============================================================================
// TAMV MD-X4™ - DM-X4-01 Social Cell
// Hook: useCreatePost — validated insertion + realtime update trigger
// ============================================================================

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface CreatePostInput {
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  tags?: string[];
  visibility?: 'public' | 'community' | 'private';
}

export interface CreatePostResult {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
}

export interface UseCreatePostReturn {
  createPost: (input: CreatePostInput) => Promise<CreatePostResult | null>;
  creating: boolean;
  error: string | null;
}

const MAX_CONTENT_LENGTH = 2000;
const MIN_CONTENT_LENGTH = 1;

function validateInput(input: CreatePostInput): string | null {
  if (!input.content || input.content.trim().length < MIN_CONTENT_LENGTH) {
    return 'El contenido no puede estar vacío.';
  }
  if (input.content.length > MAX_CONTENT_LENGTH) {
    return `El contenido no puede superar ${MAX_CONTENT_LENGTH} caracteres.`;
  }
  return null;
}

export function useCreatePost(): UseCreatePostReturn {
  const { user } = useAuth();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = useCallback(
    async (input: CreatePostInput): Promise<CreatePostResult | null> => {
      const validationError = validateInput(input);
      if (validationError) {
        setError(validationError);
        return null;
      }

      if (!user) {
        setError('Debes iniciar sesión para publicar.');
        return null;
      }

      setCreating(true);
      setError(null);

      const { data, error: dbError } = await supabase
        .from('posts')
        .insert({
          author_id: user.id,
          content: input.content.trim(),
          media_url: input.mediaUrl ?? null,
          media_type: input.mediaType ?? null,
          tags: input.tags ?? null,
          visibility: input.visibility ?? 'public',
        })
        .select('id, author_id, content, created_at')
        .single();

      setCreating(false);

      if (dbError || !data) {
        setError('No se pudo publicar. Intenta de nuevo.');
        return null;
      }

      supabase.from('analytics_events').insert({
        event_name: 'post_created',
        event_type: 'social',
        user_id: user.id,
        properties: { post_id: data.id },
      }).then(() => {});

      return data as CreatePostResult;
    },
    [user]
  );

  return { createPost, creating, error };
}
