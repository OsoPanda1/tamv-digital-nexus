# Tareas Específicas - Plan Quirúrgico Modular TAMV

***

## 1. Módulo QA Constitucional (QC-TAMV-01)

### Tareas
- [ ] Activar `eslint-plugin-tamv` con reglas en modo `error` en `eslint.config.js`
- [ ] Añadir mini-suite Playwright/Vitest base:
  - Test login flow
  - Test home page rendering
  - Test Isabella chat initialization
- [ ] Integrar `npm run check:architecture` en CI/CD (GitHub Actions)
- [ ] Verificar que `scripts/check-architecture.ts` detecta:
  - page→page imports
  - module→router imports
  - layout fuera de App.tsx

### Archivos a Modificar
- `eslint.config.js`
- `package.json` (scripts)
- `.github/workflows/ci.yml`
- `vitest.config.ts`
- `playwright.config.ts`

***

## 2. Social Core + Presencia

### Tareas
- [ ] Crear hook `useSocialFeed` con:
  - Paginación
  - Ordenamiento por fecha
  - Conexión a Supabase realtime
- [ ] Crear hook `useCreatePost` con:
  - Validación de inputs
  - Escritura en BD
  - Actualización realtime del feed
- [ ] Crear hook `useUserPresence` con:
  - Estado online/offline
  - Última actividad
  - Presencia en tiempo real
- [ ] Reemplazar dummy data en `UnifiedSocialFeed`
- [ ] Añadir eventos a `analytics_events` / BookPI

### Archivos a Modificar
- `src/hooks/useSocialFeed.ts` (nuevo)
- `src/hooks/useCreatePost.ts` (nuevo)
- `src/hooks/useUserPresence.ts` (nuevo)
- `src/components/social/UnifiedSocialFeed.tsx`
- `src/components/social/CreatePostComposer.tsx`

***

## 3. WebSocket Unificado + Chat TAMV

### Tareas
- [ ] Extender `useWebSocket` para tipos:
  - `gift_event`
  - `chat_message`
  - `presence_update`
- [ ] Crear `TAMVChatDock` (dock flotante)
- [ ] Implementar re‑uso de conexión única
- [ ] Optimizar reconexión controlada

### Archivos a Modificar
- `src/hooks/useWebSocket.ts`
- `src/components/TAMVChatDock.tsx` (nuevo)
- `src/stores/tamvStore.ts`

***

## 4. Isabella Prime (LLM+TTS)

### Tareas
- [ ] Reescribir sincronización a nivel **chunk/frase**
- [ ] Añadir cache TTS (hash texto+voz → audio)
- [ ] Implementar timeouts y fallback texto‑solo
- [ ] Confirmar despliegue como Edge Functions

### Archivos a Modificar
- `src/hooks/useIsabellaVoice.ts`
- `src/integrations/elevenlabs/isabella-tts.ts`
- `src/components/IsabellaChat.tsx`

***

## 5. DreamSpaces + HyperRealEngine

### Tareas
- [ ] Code-splitting por ruta XR
- [ ] Optimizar escenas (LOD, reducción de polycount/texturas)
- [ ] Throttling de audio-reactivo

### Archivos a Modificar
- `src/pages/DreamSpaces.tsx`
- `src/components/dreamspaces/DreamSpaceViewer.tsx`
- `src/components/effects/HyperRealEngine.tsx`

***

## 6. Marketplace, Stripe y TAU

### Tareas
- [ ] Validar `create-checkout` + `stripe-webhook` de punta a punta
- [ ] Conectar TAU a features (gifts premium, entradas especiales)
- [ ] Asegurar que webhook es ligero y jobs pesados van a cola

### Archivos a Modificar
- `src/components/stripe/StripeCheckout.tsx`
- `src/systems/EconomySystem.ts`
- `supabase/functions/create-checkout/index.ts`
- `supabase/functions/stripe-webhook/index.ts` (nuevo)

***

## 7. Content Sync + DigyTAMV + DevHub

### Tareas
- [ ] Implementar Content Sync con clasificación por tipo
- [ ] Añadir campo `module_target`
- [ ] Cargar contenido en DigyTAMV
- [ ] Crear inventario DevHub completo

### Archivos a Modificar
- `src/pages/Docs.tsx`
- `src/components/panels/BookPIPanel.tsx`
- `src/integrations/supabase/client.ts`

***

## 8. NOTITAMV + Gifts

### Tareas
- [ ] Stress-test interno con generación de eventos
- [ ] Ajustar límites (máx notificaciones visibles, colas)
- [ ] Degradación en dispositivos débiles

### Archivos a Modificar
- `src/hooks/useNotifications.ts`
- `src/components/notifications/NotificationCenter.tsx`
- `src/components/notifications/NotificationToast.tsx`

***

## 9. Auditoría TEE

### Tareas
- [ ] Identificar módulos sensibles para TEE
- [ ] Implementar procedimiento de auditoría TEE
- [ ] Integrar checks de comportamiento

### Archivos a Modificar
- `.github/workflows/security.yml` (nuevo)
- `scripts/check-tee.ts` (nuevo)
- `src/systems/AnubisSecuritySystem.ts`

***

## 10. Documentación Faltante

### Tareas
- [ ] Integrar QC-TAMV-01 en devhub/digy
- [ ] Escribir Manual Social & Tiempo Real
- [ ] Escribir Isabella Prime Spec
- [ ] Escribir XR Performance Guidelines
- [ ] Escribir Marketplace & TAU Spec
- [ ] Escribir Content Sync & DigyTAMV Spec
- [ ] Escribir TEE Audit Runbook

### Archivos a Crear
- `02_MODULOS/M02_SOCIAL/INTERNO/MANUAL-SOCIAL.md`
- `02_MODULOS/M05_IA_TAMVAI/INTERNO/ISABELLA-PRIME-SPEC.md`
- `02_MODULOS/M03_XR/INTERNO/XR-PERFORMANCE-GUIDELINES.md`
- `02_MODULOS/M04_ECONOMIA/INTERNO/MARKETPLACE-TAU-SPEC.md`
- `02_MODULOS/M06_CONTENT/INTERNO/CONTENT-SYNC-SPEC.md`
- `02_MODULOS/M01_QC/INTERNO/TEE-AUDIT-RUNBOOK.md`

***

## 11. CI/CD y Gobernanza

### Tareas
- [ ] Set up git workflows para CI/CD
- [ ] Implementar modular testing structure
- [ ] Añadir badges de estado en README
- [ ] Configurar alertas para violaciones QC

### Archivos a Crear/Modificar
- `.github/workflows/ci.yml`
- `.github/workflows/e2e.yml`
- `.github/workflows/security.yml`
- `README.md`

***

## Priorización de Tareas

| Prioridad | Tarea | Deadline |
|-----------|-------|----------|
| 🔴 Alta | Módulo QA Constitucional | Semana 1 |
| 🔴 Alta | Social Core + Presencia | Semana 2 |
| 🟠 Media | WebSocket Unificado + Chat | Semana 2 |
| 🔴 Alta | Isabella Prime | Semana 1 |
| 🟠 Media | DreamSpaces + HyperRealEngine | Semana 3 |
| 🟠 Media | Marketplace, Stripe y TAU | Semana 3 |
| 🟡 Baja | Content Sync + DigyTAMV | Semana 4 |
| 🟡 Baja | NOTITAMV + Gifts | Semana 4 |
| 🟠 Media | Auditoría TEE | Semana 5 |
| 🟡 Baja | Documentación Faltante | Semana 6 |

***

## Métricas de Éxito

- **QA**: 100% coverage de reglas QC-TAMV-01
- **Social**: Feed carga en < 300ms, 0 fallos en e2e
- **Chat**: RTT < 200ms, 100% de entrega de mensajes
- **Isabella**: P95 < 4s, fallback texto-solo funciona
- **XR**: FPS ≥ 45 en equipos medios
- **Economía**: 100% de transacciones procesadas correctamente
- **Security**: Todos los módulos sensibles en TEE

***

## Responsabilidades

| Rol | Módulos Responsable |
|-----|----------------------|
| Lead QA | QC-TAMV-01, CI/CD |
| Developer Social | Social Core, WebSocket |
| Developer AI | Isabella Prime |
| Developer XR | DreamSpaces, HyperReal |
| Developer Economy | Marketplace, Stripe, TAU |
| DAO Coordinator | Gobernanza, DigyTAMV |
| Documentalist | Content Sync, Documentación