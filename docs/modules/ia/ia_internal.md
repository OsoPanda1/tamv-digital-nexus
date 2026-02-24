# IA / Isabella — Documento Interno

> **Estado:** `draft` · **Acceso:** INTERNO · **Revisión:** DAO-Ética/IA

## Protocolo de chunks TTS

### Problema
La sincronización palabra-a-palabra genera latencia perceptible y artefactos de audio.

### Solución implementada (target)
Sincronización a nivel chunk/frase:
1. El LLM transmite respuesta en streaming.
2. Se acumulan tokens hasta completar una frase (`.`, `!`, `?`, `,` + pausa lógica).
3. Cada chunk se envía a `isabella-tts` como unidad atómica.
4. El audio de cada chunk se encola y reproduce secuencialmente.

### Cache TTS
- **Key:** `SHA256(text_chunk + voice_id)`
- **Storage:** Supabase Storage o tabla `tts_cache`
- **TTL:** 7 días (chunks de texto estático)
- **Beneficio esperado:** 60–80% de reducción de llamadas a ElevenLabs en producción

### Timeouts y fallback
```
isabella-tts timeout: 8s
  → TIMEOUT: retornar null (no audio)
    → UI: mostrar texto, no crash
      → Log evento en analytics_events
```

## Límites de contexto Isabella

| Parámetro | Valor actual | Motivo |
|-----------|-------------|--------|
| Max mensajes en bóveda | 50 | Balance memoria/relevancia |
| Max tokens por request | Por definir (DAO-Ética/IA) | Coste y latencia |
| Idiomas soportados | ES, EN | Prioridad actual |

## Política de logs IA (pendiente DAO-Ética/IA)

- ¿Se guardan prompts del sistema en logs?
- ¿Se almacenan conversaciones completas en BD?
- ¿Período de retención?

**Estado:** requiere aprobación DAO-Ética/IA antes de implementar persistencia completa.

## THE SOF — Shadow Engine

THE SOF es el orquestador multiagente que coordina Isabella con otros subsistemas:
- Recibe eventos de dominio (nuevo post, compra, alerta de seguridad).
- Decide si Isabella debe proactivamente notificar al usuario.
- Mantiene contexto de sesión enriquecido con datos de todos los dominios.
- Artefacto actual: `supabase/functions/tamv-fusion-core/index.ts`.
