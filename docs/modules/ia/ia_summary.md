# IA / Isabella / THE SOF — Resumen

> **Estado:** `beta` · **Dominio:** DM-X4-02 IA · **Canon:** inmutable

## Definición

El dominio IA unifica el sistema Isabella Prime (LLM + TTS), el análisis emocional cuántico y THE SOF (Shadow Engine), el orquestador multiagente subyacente.

## Componentes principales

| Componente | Descripción | Artefacto |
|-----------|-------------|-----------|
| **Isabella Prime** | LLM conversacional + TTS vía ElevenLabs | `supabase/functions/isabella-chat-enhanced/` |
| **Isabella TTS** | Síntesis de voz con cache | `supabase/functions/isabella-tts/` |
| **Análisis emocional** | Detección de emociones en texto/voz | `src/hooks/useIsabellaEmotionalAnalysis.ts` |
| **THE SOF** | Shadow Engine — orquestación multiagente | `supabase/functions/tamv-fusion-core/` |
| **Isabella Chat UI** | Widget flotante de chat | `src/components/IsabellaChat.tsx` |
| **Bóveda** | Memoria persistente de conversaciones | `tamvStore.chatMessages` (últimos 50) |

## MSR State

```typescript
chatMessages: Message[]   // conversación activa
chatLoading: boolean       // indicador de carga LLM
chatEmotion: string        // última emoción detectada
```

## MSR Rules

- `MSR-IA-01`: Cache TTS obligatorio (hash text+voice_id → audio URL)
- `MSR-IA-02`: Fallback a texto si TTS falla
- P95 respuesta Isabella: < 4–5 segundos (chat + audio)
- Sincronización por chunk/frase (no por palabra)

## Flujo Isabella Prime

```
User input → useIsabellaChatQuantum
  → isabella-chat-enhanced (LLM chunks)
    → useIsabellaEmotionalAnalysis (detección emoción)
      → isabella-tts (ElevenLabs + cache)
        → audio playback sincronizado por chunk
```

## Cell mapping

| Cell | Artefacto | Estado |
|------|-----------|--------|
| `cell-isabella-chat` | `src/components/IsabellaChat.tsx` | stable |
| `cell-isabella-voice` | `src/hooks/useIsabellaVoice.ts` | beta |
| `cell-emotional` | `src/hooks/useIsabellaEmotionalAnalysis.ts` | beta |
| `cell-sof-core` | `supabase/functions/tamv-fusion-core/` | beta |

## Referencias

- `src/hooks/useIsabellaChatQuantum.ts`
- `src/hooks/useIsabellaEmotionalAnalysis.ts`
- `src/hooks/useIsabellaVoice.ts`
- `docs/07_isabella_multiagente_y_boveda.md`
- `02_MODULOS/M05_IA_TAMVAI/INTERNO/QC-TAMV-01-v1.1.md`
