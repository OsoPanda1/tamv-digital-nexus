# 05 — Social Core: Schema & UI — TAMV MD-X4

> **Estado:** `stable` · **Versión:** 1.0 · **Dominio:** DM-X4-01 Core (Social Cell)
> **Última actualización:** 2026-03-01 · **Ref:** MD-X4 Wiki Master Update

---

## 1. Visión general

El Social Core de TAMV es el núcleo del feed inmersivo y presencia en tiempo real. Se articula en tres capas:

| Capa | Artefactos | Estado |
|------|-----------|--------|
| **Schema DB** | `posts`, `profiles`, `analytics_events` (Supabase PostgreSQL) | ✅ operativo |
| **Hooks** | `useSocialFeed`, `useCreatePost`, `useUserPresence` | ✅ operativo |
| **UI Components** | `UnifiedSocialFeed`, `CreatePostComposer`, `TAMV_SOCIAL_NETWORK_PORTAL` | ✅ operativo |

---

## 2. Schema de base de datos

### 2.1 Tabla `posts`

```sql
CREATE TABLE public.posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content       TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
  media_url     TEXT,
  media_type    TEXT,
  likes_count   INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count  INTEGER DEFAULT 0,
  tags          TEXT[],
  visibility    TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'community', 'private')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de rendimiento
CREATE INDEX idx_posts_author_id ON public.posts(author_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_posts_visibility ON public.posts(visibility);

-- RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts_select_public" ON public.posts
  FOR SELECT USING (visibility = 'public' OR auth.uid() = author_id);

CREATE POLICY "posts_insert_own" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "posts_update_own" ON public.posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "posts_delete_own" ON public.posts
  FOR DELETE USING (auth.uid() = author_id);
```

### 2.2 Tabla `profiles` (campos sociales relevantes)

```sql
CREATE TABLE public.profiles (
  user_id       UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT,
  display_name  TEXT,
  avatar_url    TEXT,
  bio           TEXT,
  role          TEXT DEFAULT 'public' CHECK (role IN ('public', 'creator', 'pro', 'admin')),
  dignity_score INTEGER DEFAULT 0,
  reputation_score INTEGER DEFAULT 0,
  trust_level   INTEGER DEFAULT 0 CHECK (trust_level BETWEEN 0 AND 100),
  id_nvida      JSONB,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

### 2.3 Tabla `analytics_events` (Social events)

```sql
CREATE TABLE public.analytics_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id),
  event_name  TEXT NOT NULL,
  event_type  TEXT NOT NULL,
  properties  JSONB,
  timestamp   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_type ON public.analytics_events(event_type);
```

**Eventos social registrados:**

| `event_name` | `event_type` | Cuándo |
|-------------|-------------|--------|
| `post_created` | `social` | Al crear post (`useCreatePost`) |
| `post_liked` | `social` | Al dar like |
| `post_shared` | `social` | Al compartir |
| `user_presence_join` | `presence` | Al conectarse |
| `user_presence_leave` | `presence` | Al desconectarse |

---

## 3. Hooks del Social Core

### 3.1 `useSocialFeed` — `src/hooks/useSocialFeed.ts`

Feed paginado con Supabase Realtime.

```typescript
interface SocialPost {
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

useSocialFeed(options?: {
  pageSize?: number;        // default: 20
  visibility?: 'public' | 'community' | 'all';
}): {
  posts: SocialPost[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  refreshFeed: () => void;
}
```

**Comportamiento clave:**
- Paginación via `.range(from, to)` de Supabase.
- Enriquecimiento de posts con datos de `profiles` (display_name, avatar_url).
- Subscription Realtime en canal `social-feed-realtime` → evento `INSERT` → `refreshFeed()`.
- Página 0 se resetea al cambiar `user` (login/logout).

### 3.2 `useCreatePost` — `src/hooks/useCreatePost.ts`

```typescript
interface CreatePostInput {
  content: string;         // 1–2000 caracteres
  mediaUrl?: string;
  mediaType?: string;
  tags?: string[];
  visibility?: 'public' | 'community' | 'private';
}

useCreatePost(): {
  createPost: (input: CreatePostInput) => Promise<CreatePostResult | null>;
  creating: boolean;
  error: string | null;
}
```

**Validaciones internas:**
- `content` vacío → error, sin inserción en BD.
- `content` > 2000 caracteres → error.
- Usuario no autenticado → error `'Debes iniciar sesión para publicar.'`
- Tras insertar → INSERT en `analytics_events` (event_name: `post_created`, asíncrono, no bloquea).

### 3.3 `useUserPresence` — `src/hooks/useUserPresence.ts`

```typescript
interface PresenceState {
  userId: string;
  onlineAt: string;
  status: 'online' | 'away' | 'offline';
}

useUserPresence(): {
  onlineUsers: PresenceState[];
  isOnline: (userId: string) => boolean;
  myStatus: 'online' | 'away' | 'offline';
  setMyStatus: (status: PresenceState['status']) => void;
}
```

**Canal Supabase Presence:** `tamv-presence` (key = `user.id`)

| Evento | Acción |
|--------|--------|
| `sync` | Reemplaza array completo de `onlineUsers` |
| `join` | Agrega nuevos usuarios al array |
| `leave` | Marca usuarios como `offline` (no elimina) |

---

## 4. Zustand Store — `socialStore.ts`

```typescript
// src/stores/socialStore.ts
interface SocialStoreState {
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
```

---

## 5. UI Components

### 5.1 `UnifiedSocialFeed` — `src/components/UnifiedSocialFeed.tsx`

Componente principal del feed social. Consume `useSocialFeed`.

**Props:**
```typescript
interface UnifiedSocialFeedProps {
  visibility?: 'public' | 'community' | 'all';
  showComposer?: boolean;
}
```

**Funcionalidades:**
- Feed infinito con botón "Cargar más".
- Integra `CreatePostComposer` cuando `showComposer=true`.
- Realtime updates vía hook.
- Skeleton loading states.

### 5.2 `CreatePostComposer` — `src/components/social/CreatePostComposer.tsx`

Composer de posts. Consume `useCreatePost`.

**Features:**
- Área de texto con límite de 2000 caracteres con contador.
- Selector de visibilidad (público / comunidad / privado).
- Upload de media (conceptual — pendiente integración Supabase Storage).
- Tags input (separados por coma).
- Estado de carga y manejo de errores.

### 5.3 `TAMV_SOCIAL_NETWORK_PORTAL` — `src/components/TAMV_SOCIAL_NETWORK_PORTAL.tsx`

Portal social completo con stories, live streaming y grupos.

**Secciones:**
- `feed` — Feed principal con `UnifiedSocialFeed`.
- `stories` — Historias de 24h (conceptual).
- `live` — Streaming en vivo (conceptual).
- `groups` — Grupos y comunidades (conceptual).

---

## 6. Flujos de integración Social

### 6.1 Publicar post

```
CreatePostComposer
  → useCreatePost.createPost({ content, visibility })
    → validación local (content 1–2000 chars, user autenticado)
      → supabase.from('posts').insert({ author_id, content, visibility, ... })
        → Supabase Realtime broadcast INSERT en canal 'social-feed-realtime'
          → useSocialFeed.refreshFeed() en todos los clientes suscritos
        → supabase.from('analytics_events').insert({ event_name: 'post_created', ... })
```

### 6.2 Cargar feed

```
UnifiedSocialFeed mount
  → useSocialFeed({ pageSize: 20, visibility: 'public' })
    → supabase.from('posts').select('*').order('created_at', { ascending: false }).range(0, 19)
      → JOIN profiles para author_name, author_avatar
        → setPosts(enriched)
    → Subscribe canal 'social-feed-realtime' (Supabase Realtime)
```

### 6.3 Presencia de usuarios

```
Componente que usa useUserPresence
  → Supabase channel 'tamv-presence' (Presence mode)
    → channel.track({ status: 'online', onlineAt: ISO8601 }) al SUBSCRIBED
      → sync/join/leave events → setOnlineUsers()
```

---

## 7. Métricas de calidad Social

| Métrica | Target | Medición |
|---------|--------|---------|
| Feed load inicial | < 300ms | Lighthouse / custom timer |
| Latencia realtime INSERT→UI | < 500ms | Timestamp delta |
| RTT medio WS | < 200ms | WebSocket ping |
| Posts por página | 20 | `PAGE_SIZE_DEFAULT` |
| Error rate de `createPost` | < 1% | `analytics_events` |

---

## 8. DAOs — Gobernanza Social

**DAO-Comunidad** puede decidir:
- Políticas de visibilidad de posts (público/comunidad).
- Parámetros de moderación automática.
- Mostrar/ocultar estados de presencia globalmente.
- Límite de posts por usuario por hora.

**No puede decidir:**
- Monetización de acciones sociales.
- Comisiones por posts patrocinados.
- Infraestructura de Supabase Realtime.

---

## 9. Estado de implementación

| Componente | Estado | Notas |
|-----------|--------|-------|
| Schema `posts` | ✅ Operativo | Requiere migración en Supabase |
| Schema `profiles` | ✅ Operativo | |
| `useSocialFeed` | ✅ Operativo | `src/hooks/useSocialFeed.ts` |
| `useCreatePost` | ✅ Operativo | `src/hooks/useCreatePost.ts` |
| `useUserPresence` | ✅ Operativo | `src/hooks/useUserPresence.ts` |
| `UnifiedSocialFeed` | ✅ Operativo | Con datos reales vía hook |
| `TAMV_SOCIAL_NETWORK_PORTAL` | ✅ Operativo | Stories/Live/Groups conceptual |
| Media upload | ⚠️ Pendiente | Requiere Supabase Storage |
| Tags filtering | ⚠️ Pendiente | |
| Post reactions | ⚠️ Pendiente | Tabla `post_reactions` |

---

## 10. Referencias

- `src/hooks/useSocialFeed.ts` — Hook feed social
- `src/hooks/useCreatePost.ts` — Hook creación post
- `src/hooks/useUserPresence.ts` — Hook presencia
- `src/stores/socialStore.ts` — Store Zustand social
- `src/components/UnifiedSocialFeed.tsx` — UI feed principal
- `src/components/social/` — Componentes sociales
- `02_MODULOS/M02_SOCIAL/INTERNO/MANUAL-SOCIAL.md` — Manual interno detallado
- `docs/02_arquitectura_tamv_mdx4.md` — Arquitectura base
