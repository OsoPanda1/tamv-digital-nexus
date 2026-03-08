# TAMV Digital Nexus — Checklist E2E Producción 100%

Este checklist consolida todos los pendientes para llevar TAMV MD-X4 a producción real.

---

## 1) Backend y Edge Functions

### Hardening de servicios críticos
- [x] wallet-service usa tablas reales (tcep_wallets, tcep_transactions).
- [x] governance-service usa tablas reales (dao_proposals, dao_votes).
- [x] isabella-chat-enhanced con triple bloqueo ético AVIXA.
- [x] transaction-service con Saga Pattern y rollback.
- [x] security-service con criptografía post-cuántica (Kyber/Dilithium).
- [x] Validaciones estrictas de payload en wallet-service (amount, UUID, length).
- [x] Rate limiting en-memory en wallet-service y isabella-chat-enhanced.
- [ ] Rate limiting persistente (Redis/tabla) en endpoints públicos (login, chat, feed, lotería).
- [ ] Sanitización de inputs en todos los edge functions con esquemas Zod.

### Ciclo de despliegue
- [x] Edge functions desplegables sin error (_shared eliminado, inline).
- [ ] Documentar en DEPLOYMENT_GUIDE.md comando único de deploy para todas las edge functions.
- [x] Smoke test /health en wallet-service, transaction-service, security-service, governance-service.
- [ ] Smoke tests automatizados post-deploy en CI/CD.

---

## 2) Unified API y contratos

### OpenAPI y clientes
- [x] TAMV_OPENAPI_SPEC_v3.1.0.yaml creado como contrato maestro.
- [ ] Congelar spec con tag de versión.
- [ ] Generar cliente TypeScript tipado desde OpenAPI y reemplazar llamadas ad-hoc.
- [ ] Alinear nombres de endpoints, códigos de error y objetos de respuesta en todos los servicios.

### Seguridad y QSL
- [x] QuantumToken wrapper de JWT implementado en security-service.
- [ ] Configurar expiraciones, rotación y revocación de tokens en auth-service-v3.
- [x] Sentinel/MSR loguea accesos críticos (auth, pagos, cambios de rol).

---

## 3) Frontend core (app shell y páginas)

### App shell y rutas
- [x] App.tsx con todas las rutas: /, /dashboard, /economy, /governance, /ecosystem, /evolution, /isabella, /singularity.
- [x] AccordionSidebar + SmartFloatingBar + AppLayout.
- [x] Estados de carga (Skeleton) en Dashboard.
- [x] Estados vacíos elegantes en Dashboard, Economy, Governance.
- [x] Error boundaries y fallback en páginas principales.

### Dashboard y Ecosystem 100% operativos
- [x] useEcosystemMetrics muestra datos reales con fallback.
- [x] Dashboard con métricas LIVE, actividad reciente y estado de federaciones.
- [ ] Filtros por federación, rango de fechas y tipo de evento en Dashboard.
- [ ] En /ecosystem, expandir vistas por federación (click → detalle con métricas, actividad, salud).

### Economy y Governance
- [x] /economy con saldo real, historial, lotería y Fondo Fénix.
- [x] /governance con propuestas, votación, roles y ID-NVIDA.
- [ ] Coherencia total: saldo, historial, MSR y lotería usan mismos endpoints wallet-service y tamv-unified-api.
- [ ] Flujo completo: listar propuestas → ver detalle → votar → ver resultados → estado (abierta/cerrada/archivada).

---

## 4) Social 300× y media

### NextGenFeed cerrado
- [x] Feed social con posts reales desde Supabase.
- [ ] Filtros: por federación, tipo de contenido (foto, video, texto, evento), y orden (reciente, tendencia).
- [ ] Moderación mínima: bloqueo de contenido marcado por Sentinel/MSR.
- [ ] Performance: paginación o infinite scroll real, compresión de media y lazy loading.

### Media gallery y paleta TAMV
- [x] GALLERY_PHOTOS, GALLERY_VIDEOS y NOTIFICATION_SOUNDS en media-gallery.ts.
- [x] Paleta negro profundo/plata/azul-acero en index.css.
- [x] Tokens semánticos aplicados en componentes principales.
- [ ] Verificar uso consistente de paleta en TODOS los componentes (audit sin colores sueltos).

---

## 5) Isabella y ética AVIXA

### Chat Isabella con escudo completo
- [x] Triple bloqueo ético (ontológico/semántico/conductual) en isabella-chat-enhanced.
- [x] Escalamiento de crisis con líneas de ayuda.
- [x] useIsabellaChatQuantum con streaming SSE, validación de calidad y cancelación.
- [x] Error handling robusto: red errors, reintentos, abort controller.
- [ ] Probar escenarios: consulta normal, crisis, intentos de abuso end-to-end.
- [ ] Exponer en la UI reglas claras de uso y mensajes cuando se active un bloqueo ético.

---

## 6) OMNI-KERNEL / Singularity

### Panel Singularity operativo
- [x] Página /singularity con DevOpsPanel y SystemHealthMonitor.
- [x] Página /evolution con arquitectura de federaciones.
- [ ] Validar que lee datos reales (o mocks controlados) de las 6 capas.
- [ ] Acciones seguras: reinicio lógico de servicios, clear de colas, reindex de embeddings.
- [ ] Logs resumidos de eventos críticos en tiempo real.

---

## 7) CI/CD y testing

### Pipeline CI completo
- [x] .github/workflows/tamv-ci-cd.yml con lint, TypeScript, tests y build.
- [x] Pipeline E2E con Playwright.
- [ ] Pruebas mínimas de integración para endpoints críticos (auth, wallet, governance, chat).
- [ ] Marcar build como fallo si algún edge function no se puede desplegar.

### Pipeline CD y entornos
- [x] vercel.json, fly.toml, k8s/ configurados.
- [ ] Definir staging vs production (variables, config.toml, deploy targets).
- [ ] Script único run-checks.sh + deploy staging, luego promoción a producción bajo tag/git release.

---

## 8) Observabilidad y seguridad operativa

### Horus Tower en vivo
- [x] prometheus.yml y tempo.yaml configurados.
- [ ] Conectar con app desplegada (scraping de métricas y recolección de trazas).
- [ ] Crear dashboards base en Grafana: salud de federaciones, errores, latencias, seguridad.

### Alertas y respuesta
- [ ] Reglas de alerta: caídas, tasa de errores alta, picos de login, anomalías en pagos.
- [ ] Documentar procedimientos de respuesta (playbooks) en SECURITY.md y este checklist.

---

## 9) Entrega operativa y documentación

### Documentación final
- [ ] Actualizar README_TAMV_COMPLETO.md, PLAN-TAMV-MODULAR.md, TAMV_DOCUMENTATION_INDEX.md al estado real.
- [ ] Sección "Cómo lanzar producción en 30 minutos" con pasos desde repo limpio hasta sistema vivo.

### Checklist pre-go-live
- [x] Este checklist convertido en E2E_CHECKLIST_TAMV.md con casillas.
- [ ] Ejecutar "fire drill" de fallo total simulado y recuperación usando OMNI-KERNEL y Horus.
- [ ] `npm run lint` sin errores.
- [ ] `npm run typecheck` sin errores.
- [ ] `npm run build` sin errores.
- [ ] `npm run test` con tests ejecutándose (no "No test files found").

---

## Criterio de éxito: 100% Producción
> Todos los ítems marcados ✅ = TAMV MD-X4 listo para producción real.
> Fecha objetivo: Q1 2026.
