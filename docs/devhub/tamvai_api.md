# TAMV AI API (Isabella) — DevHub

> **Status:** `validated` · **Versión:** 1.0 · **Dominio:** DM-X4-02 IA/Isabella

---

## Endpoints

### 1. Isabella Chat Enhanced

```
POST https://<project>.supabase.co/functions/v1/isabella-chat-enhanced
```

**Auth:** `Authorization: Bearer <user_jwt>`

**Payload:**
```json
{
  "message": "string (max 2000 chars)",
  "conversationHistory": [
    { "role": "user | assistant", "content": "string" }
  ],
  "userId": "uuid",
  "emotionalContext": "neutral | alegría | tristeza | poder | duda (opcional)"
}
```

**Response:**
```json
{
  "response": "string",
  "emotion": "neutral | alegría | tristeza | poder | duda",
  "chunkIndex": 0,
  "isFinal": true,
  "traceId": "uuid"
}
```

**Errors:**

| Código | Descripción |
|--------|-------------|
| 400 | Mensaje vacío o demasiado largo |
| 401 | Token inválido |
| 408 | LLM timeout (> 15s) — fallback a texto |
| 500 | Error LLM |

---

### 2. Isabella TTS

```
POST https://<project>.supabase.co/functions/v1/isabella-tts
```

**Auth:** `Authorization: Bearer <user_jwt>`

**Payload:**
```json
{
  "text": "string (chunk de frase, max 500 chars)",
  "voiceId": "string (ElevenLabs voice ID)",
  "userId": "uuid"
}
```

**Response:**
```json
{
  "audioUrl": "https://... (URL del audio generado o cacheado)",
  "cacheHit": true,
  "durationMs": 1240
}
```

**Comportamiento de cache:**
- Cache key: `SHA256(text + voiceId)`
- TTL: 7 días
- En cache hit: retorna URL inmediatamente (sin llamar a ElevenLabs)

**Errors:**

| Código | Descripción |
|--------|-------------|
| 400 | Texto vacío o demasiado largo |
| 401 | Token inválido |
| 408 | ElevenLabs timeout (> 8s) |
| 503 | ElevenLabs no disponible — retorna `{ audioUrl: null }` |

**Nota importante:** Error 408/503 retorna `audioUrl: null`. El cliente DEBE mostrar texto sin audio (no crashear).

---

### 3. Quantum Analytics

```
POST https://<project>.supabase.co/functions/v1/quantum-analytics
```

**Auth:** `Authorization: Bearer <user_jwt>`

**Payload:**
```json
{
  "eventType": "string",
  "userId": "uuid | null",
  "metadata": {}
}
```

**Response:**
```json
{ "success": true, "eventId": "uuid" }
```

---

## Rate limits IA

| Endpoint | Límite |
|----------|--------|
| `isabella-chat-enhanced` | 30 req/min por usuario |
| `isabella-tts` | 60 req/min por usuario |
| `quantum-analytics` | 200 req/min por usuario |

---

## Ejemplo completo de chat + TTS

```typescript
// 1. Obtener respuesta de chat
const chatRes = await supabase.functions.invoke('isabella-chat-enhanced', {
  body: { message: 'Hola Isabella', conversationHistory: [], userId }
});

// 2. Si hay respuesta, sintetizar voz
if (chatRes.data?.response) {
  const ttsRes = await supabase.functions.invoke('isabella-tts', {
    body: { text: chatRes.data.response, voiceId: 'voice_id_xxx', userId }
  });

  // 3. Reproducir audio si está disponible, o mostrar texto
  if (ttsRes.data?.audioUrl) {
    const audio = new Audio(ttsRes.data.audioUrl);
    await audio.play();
  } else {
    // Fallback: solo mostrar el texto
    displayText(chatRes.data.response);
  }
}
```
