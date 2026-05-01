# Manual Social & Tiempo Real — TAMV MD-X4

> **Módulo:** M02_SOCIAL · **Estado:** `draft` · **Acceso:** INTERNO
> **Dominio:** DM-X4-01 Core (Social Cell)

---

## 1. Hooks sociales

### `useSocialFeed` — `src/hooks/useSocialFeed.ts`

Feed paginado con realtime Supabase.

**Interfaz:**
```typescript
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

**Comportamiento:**
- Página 0 al montar o cuando cambia el usuario.
- `loadMore()` incrementa página y appends al array.
- Subscription Supabase Realtime en `posts` → `INSERT` → `refreshFeed()` automático.
- Enriquece posts con `profiles` (display_name, avatar_url).

**Tests unitarios requeridos:**
- `useSocialFeed` devuelve posts ordenados por `created_at` DESC.
- `loadMore()` appends posts sin duplicados.
- Realtime INSERT dispara `refreshFeed`.

---

### `useCreatePost` — `src/hooks/useCreatePost.ts`

Creación de posts con validación y tracking de analytics.

**Interfaz:**
```typescript
useCreatePost(): {
  createPost: (input: CreatePostInput) => Promise<CreatePostResult | null>;
  creating: boolean;
  error: string | null;
}

interface CreatePostInput {
  content: string;         // 1–2000 caracteres
  mediaUrl?: string;
  mediaType?: string;
  tags?: string[];
  visibility?: 'public' | 'community' | 'private';
}
```

**Validaciones:**
- `content` requerido, 1–2000 caracteres.
- Usuario autenticado requerido.
- Inserta evento en `analytics_events` tras publicar.

**Tests unitarios requeridos:**
- Dado contenido vacío → devuelve error, no inserta en BD.
- Dado contenido válido + usuario → inserta en `posts` y devuelve result.
- Evento `post_created` insertado en `analytics_events`.

---

### `useUserPresence` — `src/hooks/useUserPresence.ts`

Presencia en tiempo real vía Supabase Presence.

**Interfaz:**
```typescript
useUserPresence(): {
  onlineUsers: PresenceState[];
  isOnline: (userId: string) => boolean;
  myStatus: 'online' | 'away' | 'offline';
  setMyStatus: (status: PresenceState['status']) => void;
}
```

**Comportamiento:**
- Canal Supabase Presence `tamv-presence` con key = `user.id`.
- `sync` → actualiza array completo.
- `join` → agrega usuario nuevo.
- `leave` → marca usuario como `offline` (no elimina del array).
- Track propio estado al suscribirse.

---

## 2. Integración con Supabase Realtime

### Tablas con subscripciones activas

| Tabla | Evento | Canal | Acción |
|-------|--------|-------|--------|
| `posts` | INSERT | `social-feed-realtime` | `refreshFeed()` |

### Presencia

| Canal | Tipo | Key |
|-------|------|-----|
| `tamv-presence` | Presence | `user.id` |

---

## 3. WebSocket unificado

**Hook:** `src/hooks/useWebSocket.ts`

Tipos de mensajes soportados (extensión pendiente TASKS ítem 3):

| Tipo | Descripción | Estado |
|------|-------------|--------|
| `chat_message` | Mensaje de chat 1:1 o grupal | pendiente |
| `gift_event` | Envío/recepción de gift | pendiente |
| `presence_update` | Cambio de estado de presencia | pendiente |
| `notification` | Notificación de sistema | conceptual |

**Principio:** Una sola instancia WS por sesión. Reutilizar conexión entre gifts, chat y presencia.

---

## 4. Métricas de calidad

| Métrica | Target | Cómo medir |
|---------|--------|-----------|
| Feed load inicial | < 300ms | Lighthouse / custom timer |
| Latencia realtime INSERT→UI | < 500ms | Timestamp comparison |
| RTT medio WS chat | < 200ms | WebSocket ping |
| Posts/página | 20 | `PAGE_SIZE_DEFAULT` |

---

## 5. DAOs y gobernanza social

**DAO-Comunidad** puede decidir sobre:
- Políticas de visibilidad de posts (público/comunidad).
- Parámetros de moderación.
- Mostrar/ocultar estados de presencia.

**No puede decidir sobre:**
- Monetización de acciones sociales.
- Comisiones por posts patrocinados.
