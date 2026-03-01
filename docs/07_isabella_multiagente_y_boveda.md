# 07 — Isabella Multiagente y Bóveda

> **Estado:** `draft` · **Versión:** 1.0 · **Origen:** Master Canon TAMV

---

## 1. Arquitectura multiagente

Isabella opera como sistema multiagente compuesto por:

| Agente | Rol | Artefacto |
|--------|-----|-----------|
| **Isabella Prime** | Agente conversacional principal (LLM + TTS) | `supabase/functions/isabella-chat-enhanced/` |
| **Isabella Voice** | Agente de síntesis de voz | `supabase/functions/isabella-tts/` |
| **Isabella Emotional** | Agente de análisis emocional | `src/hooks/useIsabellaEmotionalAnalysis.ts` |
| **THE SOF** | Shadow Engine — orquestador multiagente | `supabase/functions/tamv-fusion-core/` |

---

## 2. Bóveda de memoria

La bóveda de Isabella es el repositorio de memoria conversacional y contextual:

### Memoria a corto plazo
- **Almacén:** Zustand `chatMessages[]` (últimos 50 mensajes)
- **Persistencia:** localStorage vía Zustand persist middleware
- **Acceso:** Solo durante la sesión activa

### Memoria contextual (futura)
- **Almacén:** Tabla `isabella_memory` en Supabase
- **Estructura:** vectores de embedding para búsqueda semántica
- **Retención:** configurable (pendiente DAO-Ética/IA)

---

## 3. Protocolo de interacción

```
Usuario → IsabellaChat.tsx
  → useIsabellaChatQuantum.sendMessage()
    → isabella-chat-enhanced (LLM streaming)
      → useIsabellaEmotionalAnalysis (emoción detectada)
        → THE SOF (contexto enriquecido de otros dominios)
          → isabella-tts (síntesis por chunk)
            → reproducción audio sincronizada
```

---

## 4. Emociones reconocidas

| Emoción | Código | Descripción |
|---------|--------|-------------|
| Neutral | `neutral` | Estado base |
| Alegría | `alegría` | Tono positivo, motivador |
| Tristeza | `tristeza` | Empatía, apoyo |
| Poder | `poder` | Determinación, liderazgo |
| Duda | `duda` | Reflexión, análisis |

---

## 5. THE SOF — Shadow Engine

THE SOF actúa como orquestador subyacente invisible:
- Escucha eventos de todos los dominios (Fusion Core).
- Enriquece el contexto de Isabella con información cruzada.
- Puede instruir a Isabella para hacer contacto proactivo.
- No expone su existencia directamente al usuario final.

---

## 6. Seguridad y privacidad

- Los prompts del sistema de Isabella no se exponen al usuario.
- Los mensajes se procesan en Edge Functions (no se guardan en log accesible).
- La bóveda de memoria está aislada por `userId`.
- Revisión de política de retención pendiente: DAO-Ética/IA.

---

## 7. Referencias

- `src/hooks/useIsabellaChatQuantum.ts`
- `src/hooks/useIsabellaEmotionalAnalysis.ts`
- `src/hooks/useIsabellaVoice.ts`
- `src/components/IsabellaChat.tsx`
- `docs/modules/ia/ia_summary.md`
- `02_MODULOS/M05_IA_TAMVAI/INTERNO/ISABELLA-PRIME-SPEC.md`
- `docs/devhub/tamvai_api.md`
