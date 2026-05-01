# Isabella Prime Spec — TAMV MD-X4

> **Módulo:** M05_IA_TAMVAI · **Estado:** `draft` · **Acceso:** INTERNO
> **Dominio:** DM-X4-02 IA/Isabella/THE SOF

---

## 1. Arquitectura Isabella Prime

```
useIsabellaChatQuantum
  │
  ├── isabella-chat-enhanced (Edge fn)
  │     └── LLM streaming (chunk-by-phrase)
  │
  ├── useIsabellaEmotionalAnalysis
  │     └── Análisis de emoción en tiempo real
  │
  └── useIsabellaVoice
        └── isabella-tts (Edge fn)
              ├── Cache lookup (hash text+voice_id)
              ├── HIT → audio URL inmediato
              └── MISS → ElevenLabs API → cache → audio URL
```

---

## 2. Protocolo de sincronización chunk/frase

### 2.1 Definición de chunk

Un chunk es una unidad de texto que termina en:
- `.` seguido de espacio o fin de línea
- `!` o `?`
- `,` cuando el segmento previo supera 50 caracteres
- Salto de párrafo

### 2.2 Pipeline de streaming

```typescript
async function* streamIsabella(prompt: string): AsyncIterable<string> {
  // 1. Llamar isabella-chat-enhanced con stream=true
  // 2. Acumular tokens hasta completar chunk
  // 3. yield chunk completo
  // 4. Continuar hasta fin de stream
}

async function playChunk(chunk: string, voiceId: string): Promise<void> {
  // 1. Calcular hash(chunk + voiceId)
  // 2. Consultar cache (tabla tts_cache o Supabase Storage)
  // 3. HIT: reproducir URL directo
  // 4. MISS: llamar isabella-tts, guardar en cache, reproducir
}
```

### 2.3 Queue de reproducción

Los chunks se encolan para garantizar orden de reproducción:
```
Chunk 1 ready → play → onEnded → play Chunk 2 → ...
```

---

## 3. Cache TTS

### 3.1 Estructura de cache

**Tabla:** `tts_cache` (Supabase PostgreSQL)
```sql
CREATE TABLE tts_cache (
  cache_key   TEXT PRIMARY KEY,  -- SHA256(text + voice_id)
  audio_url   TEXT NOT NULL,     -- URL en Supabase Storage
  text_hash   TEXT NOT NULL,
  voice_id    TEXT NOT NULL,
  char_count  INT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  last_used   TIMESTAMPTZ DEFAULT now(),
  use_count   INT DEFAULT 1
);
```

**TTL:** 7 días. Purge por `created_at < now() - interval '7 days'` via pg_cron.

### 3.2 Generación de cache key

```typescript
async function ttsCacheKey(text: string, voiceId: string): Promise<string> {
  const data = new TextEncoder().encode(`${text}|${voiceId}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
```

---

## 4. Timeouts y fallback

| Operación | Timeout | Fallback |
|-----------|---------|----------|
| LLM chat response | 15s | Mensaje de error en texto |
| TTS synthesis | 8s | Mostrar texto sin audio |
| ElevenLabs API | 6s | Fallback a texto-solo |

**Principio:** Isabella nunca debe crashear la UI. Si TTS falla → texto visible sin error visible al usuario.

---

## 5. Métricas de calidad (targets)

| Métrica | Target | Medición |
|---------|--------|---------|
| P95 respuesta (chat+audio) | < 4–5s | `performance.now()` |
| P50 respuesta (chat+audio) | < 2.5s | `performance.now()` |
| Cache hit rate (producción) | > 60% | `use_count / total_calls` |
| TTS fallback rate | < 5% | `analytics_events` |

---

## 6. Límites y restricciones (pendiente DAO-Ética/IA)

| Parámetro | Valor propuesto | Estado |
|-----------|----------------|--------|
| Max tokens contexto | 4096 | Pendiente aprobación |
| Max mensajes bóveda | 50 | Implementado |
| Idiomas | ES, EN | Implementado |
| Retención de logs | 30 días | Pendiente aprobación |
| Logs de prompts de sistema | ❌ No | Recomendado |
| Almacenamiento completo de conv. | ❌ No (solo últimos 50) | Implementado |

---

## 6. THE SOF — Shadow Engine

THE SOF actúa como orquestador entre Isabella y el resto de dominios:
- Escucha eventos de Fusion Core (posts, compras, alertas de seguridad).
- Decide si Isabella debe notificar proactivamente.
- Mantiene contexto enriquecido por dominio.
- Artefacto: `supabase/functions/tamv-fusion-core/index.ts`.

**Estado:** beta — contrato formal pendiente.
