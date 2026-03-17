# TAMV MD-X5 — Núcleo conceptual y blueprint de unificación (177 repos)

## Estado
- **Versión:** v0.1-documental
- **Fecha:** 2026-03-17
- **Modo de ejecución:** DOCUMENTAL_ONLY
- **Alcance:** definir arquitectura objetivo y plan de convergencia para consolidar el ecosistema de `OsoPanda1` en `tamv-digital-nexus`.

---

> **Nota operativa:** la ejecución funcional paso a paso está definida en `docs/repo-unification/MDX5_FUNCTIONAL_IMPLEMENTATION_RUNBOOK.md`.

## 1) Núcleo conceptual TAMV MD-X5

TAMV MD-X5 se define como infraestructura digital civilizatoria híbrida con seis pilares de operación:

1. **Social Network**
2. **Digital Twin Territory**
3. **XR Worlds**
4. **AI Cognitive Core (Isabella / Realito)**
5. **DAO Governance**
6. **Creator Economy + Tourism Intelligence**

De la combinación de esos pilares emerge un stack de producto de tres capas:

- **Metaverse Infrastructure**
- **Territorial Intelligence OS**
- **AI Experience Engine**

---

## 2) Arquitectura técnica objetivo (MD-X5)

### Frontend
- NextJS / React / Tailwind
- Visualización cartográfica (territory explorer)
- Dashboards de métricas vivas
- UI de chat IA (Isabella Realito)
- Componentes XR visuales (90% visual en módulos experienciales)

### Backend (estilo RDM-X blueprint)

```text
server/
 ├ controllers
 ├ services
 ├ routes
 ├ middleware
 ├ schemas
 ├ config
 ├ utils
 ├ prisma
```

### Stack de servicios
- Node.js
- API estilo Express/Fastify
- Prisma ORM
- PostgreSQL
- JWT Auth
- Redis Rate Limit
- Stripe Billing

---

## 3) Módulos funcionales prioritarios

### 3.1 Dashboard TAMV
Métricas núcleo:
- users
- XR worlds
- merchants
- digital twins
- routes generated
- AI requests
- economy volume

Visualización:
- cards
- charts
- graphs
- live counters

### 3.2 RDM-X Territory Explorer
Mapa interactivo para:
- places
- merchants
- digital twins
- routes
- events

### 3.3 Route Genetic Optimizer
Lógica GA (genetic algorithm) basada en:
- diversity
- crowd
- merchant balance
- time fit
- interest affinity
- immersion
- stop count

Flujo:
`user preferences -> GA optimizer -> best route -> map visualization`

### 3.4 Isabella Realito AI
Modo conversacional multicanal:
- ROUTE_PLANNER
- STORYTELLER
- FAQ
- SYSTEM

Contrato de referencia:
- `POST /api/realito/chat`
- Input: message, visitor profile, location, history
- Output: reply, suggestedRoute, highlightTwins, followUpQuestions

### 3.5 Marketplace de comercios
Modelo:
- Merchant
- Subscription
- Stripe Billing

Planes:
- Basic
- Premium
- Elite

### 3.6 XR Worlds Gallery
Galería visual para:
- XR Cities
- Events
- DreamSpaces
- Digital Institutions

---

## 4) Dominio de datos mínimo (Prisma)

Modelos base para MD-X5:
- User
- Merchant
- MerchantUser
- Place
- DigitalTwin
- Proposal
- Vote

---

## 5) Seguridad base obligatoria

- JWT auth
- Rate limiting
- Helmet
- CORS

Endpoints troncales de plataforma:
- `GET /api/places`
- `GET /api/merchants`
- `POST /api/experience/optimize-route`
- `POST /api/realito/chat`
- `POST /api/billing/checkout`
- `GET /health`

---

## 6) Estructura UX de páginas (requisito operativo)

Solo dos páginas con densidad textual alta:

1. **Architecture page**
   - TAMV
   - MD-X5
   - RDM-X
   - Isabella
2. **Developer Dashboard**
   - documentación
   - métricas

Resto de páginas: **90% visual**
- map explorer
- XR gallery
- marketplace
- AI chat
- route planner

---

## 7) Plan de unificación de 177 repos en un solo repositorio funcional

### Fase A — Descubrimiento y clasificación (100%)
- Inventario completo de repos del owner.
- Clasificación por dominio funcional (social, IA, XR, economía, seguridad, gobierno, datos).
- Scoring de convergencia: `canon_fit`, `reuse_fit`, `risk`, `migration_cost`.

**Salida:** backlog priorizado por olas de integración.

### Fase B — Contratos soberanos y boundaries
- Definir contratos API y eventos por dominio.
- Establecer límites de contexto (bounded contexts).
- Congelar naming canónico TAMV para evitar drift semántico.

**Salida:** catálogo de contratos versionados.

### Fase C — Integración por olas
- Ola 1: Shared libs + auth + observabilidad.
- Ola 2: Territory + marketplace + billing.
- Ola 3: Isabella + route optimizer + tourism intelligence.
- Ola 4: XR worlds + DAO governance + creator economy completa.

**Salida:** monorepo funcional con gates de calidad por ola.

### Fase D — Hardening operacional
- SLO/SLA por servicio.
- Seguridad Tier 3 y auditoría continua.
- Plan de rollback por dominio.

**Salida:** operación estable lista para escala global.

---

## 8) Sistema híbrido extendido (siguiente iteración)

Para evolucionar de MD-X5 a infraestructura civilizatoria completa:

1. **Internet Overlay TAMV** (capa federada de identidad, presencia y contextos).
2. **DAO Governance Runtime** (propuestas, voto, ejecución auditable).
3. **Federated AI Swarm** (Isabella + Realito + agentes especializados).
4. **XR Persistent Worlds** (estado persistente interoperable por territorio).

---

## 9) Riesgos, controles y trazabilidad

### Riesgos críticos
- Drift de canon entre repos heterogéneos.
- Duplicación de modelos de datos.
- Contratos API incompatibles.
- Dependencias obsoletas no homogéneas.

### Controles
- Contract-first + CI constitucional.
- Matriz repo→dominio actualizada por ola.
- Regla de no-merge sin test + lint + typecheck.
- Runbooks de incidentes y rollback.

### Trazabilidad mínima
- ID de dominio por módulo.
- ID de contrato por endpoint/evento.
- ID de migración por repositorio absorbido.

---

## 10) Entregables inmediatos sugeridos (sólo documental)

1. Actualizar `REPO_REGISTRY_177.csv` con metadatos reales por repo.
2. Completar `REPO_TO_DOMAIN_MATRIX.md` con ownership por dominio.
3. Publicar `INTEGRATION_WAVES.md` v2 con fechas, gates y responsables.
4. Definir `API_CONTRACT_CATALOG.md` para la convergencia MD-X5/RDM-X.

> Este documento no ejecuta migraciones de código de producción; establece el marco técnico y operacional para unificación segura y verificable.
