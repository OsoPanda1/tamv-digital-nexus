# TAMV Digital Nexus — Checklist E2E Prioritario

Este checklist consolida los pendientes declarados del proyecto para cerrar el estado
"núcleo completo + pendientes E2E" y llevarlo a release operable.

## 1) Flujo E2E principal (usuario nuevo)
- [ ] Registro / login real con Supabase Auth.
- [ ] Onboarding inicial y redirección al dashboard/feed.
- [ ] Publicación y visualización de post dinámico en feed social.
- [ ] Interacción con Isabella (chat + respuesta usable).
- [ ] Entrada a DreamSpaces con navegación básica funcional.
- [ ] Envío/recepción de gifts (CircleGiftGallery) y reflejo en estado.
- [ ] Inscripción/consumo de curso en Universidad + acceso BookPI.
- [ ] Conversión/uso de créditos TAU en flujo económico principal.

## 2) Chat social en tiempo real
- [ ] Definir alcance inicial: DM 1:1 + presencia online.
- [ ] Canal WebSocket/Supabase Realtime por conversación.
- [ ] Persistencia de mensajes + estado leído/no leído.
- [ ] Indicadores de typing y reconexión resiliente.
- [ ] Pruebas de carga mínima (>= 50 conversaciones concurrentes simuladas).

## 3) Marketplace funcional
- [ ] Catálogo con inventario y metadatos de producto.
- [ ] Compra extremo-a-extremo con Stripe + webhook idempotente.
- [ ] Asignación de activos/beneficios post-compra.
- [ ] Historial de órdenes en perfil de usuario.
- [ ] Reglas anti-fraude básicas (rate-limit, firma webhook, auditoría).

## 4) Criterios de salida
- [ ] `npm run lint` sin errores.
- [ ] `npm run typecheck` sin errores.
- [ ] `npm run build` sin errores.
- [ ] `npm run test` con tests ejecutándose (no "No test files found").
- [ ] Script E2E documentado y repetible por cualquier colaborador.
