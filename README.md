# TAMV MD-X4™ Digital Nexus

<div align="center">
Repositorio unificado del ecosistema TAMV para consolidar módulos 3D/XR/AI, economía digital, gobernanza y servicios federados en una sola base operativa.

> Meta estratégica: unificar progresivamente los repositorios del ecosistema en una arquitectura mantenible y desplegable desde este núcleo.

## Estado actual del repositorio

El proyecto ya contiene piezas clave en producción técnica:
- Frontend React + Vite + TypeScript con componentes inmersivos.
- Integración con Supabase (cliente, tipos, funciones edge y migraciones).
- Módulos funcionales de social, economía, universidad, crisis y sistemas de seguridad.
- Base de QA constitucional (lint + scanner semántico + checker de arquitectura).
- Protocolo operativo MD-X5 con auditoría Deca-V ejecutable.

## Comandos principales


Repositorio objetivo para la convergencia funcional y documental del ecosistema TAMV (177 repos federados) en una base unificada, con gobierno por canon, trazabilidad y hardening operativo.

**Ecosistema Civilizatorio Latinoamericano**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.com/)

*PODER · LIDERAZGO · MAGIA*

</div>

---

## Visión General

TAMV MD-X4™ es un ecosistema civilizatorio digital de origen latinoamericano que integra:
- **Metaverso Inmersivo** con capacidades XR
- **IA Emocional** (Isabella AI + TBENA BCI)
- **Economía Digital** con tokens soberanos (TCEP/TAU)
- **Educación Certificada** con validación blockchain
- **Gobernanza Descentralizada** (CITEMESH)

Unifica **177 repositorios federados** en un núcleo operativo único.

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                    TAMV MD-X4™ DIGITAL NEXUS                    │
├─────────────────────────────────────────────────────────────────┤
│  WikiTAMV │ MembershipSystem │ BCIEmotionalSystem │ SocialCore │
├─────────────────────────────────────────────────────────────────┤
│  UniversitySystem │ EconomySystem │ AnubisSecurity │ KAOS Audio │
├─────────────────────────────────────────────────────────────────┤
│                   REACT 18 + VITE + TYPESCRIPT                   │
├─────────────────────────────────────────────────────────────────┤
│                  SUPABASE (Auth, DB, Edge Functions)            │
├─────────────────────────────────────────────────────────────────┤
│              48 NODOS FEDERADOS + MONITORING STACK              │
└─────────────────────────────────────────────────────────────────┘
```

## Stack Tecnológico

| Categoría | Tecnologías |
|-----------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Radix UI |
| **3D/XR** | Three.js, React Three Fiber, Framer Motion |
| **State** | Zustand, TanStack Query |
| **Backend** | Supabase (PostgreSQL, Edge Functions, Auth) |
| **Cache** | Redis |
| **Monitoring** | Prometheus, Grafana, Tempo, Loki |
| **AI/Voice** | ElevenLabs, Custom BCI Pipeline |
| **Deploy** | Docker, Kubernetes |

## Estructura del Proyecto

```
tamv-digital-nexus/
├── docs/
│   └── wikitamv/          # Documentación estructurada (13 secciones)
├── src/
│   ├── components/        # Componentes React
│   ├── pages/             # Páginas de la aplicación
│   ├── systems/           # Sistemas core
│   │   ├── MembershipSystem.ts
│   │   ├── BCIEmotionalSystem.ts
│   │   ├── UniversitySystem.ts
│   │   ├── SocialCoreSystem.ts
│   │   ├── EconomySystem.ts
│   │   └── AnubisSecuritySystem.ts
│   ├── hooks/             # Custom hooks
│   ├── stores/            # Zustand stores
│   └── integrations/      # Integraciones externas
├── supabase/
│   ├── functions/         # Edge Functions
│   │   ├── bci-emotional-handler/
│   │   ├── membership-validator/
│   │   └── dashboard-metrics/
│   └── migrations/        # SQL migrations
├── public/
│   └── sw.js              # Service Worker (PWA)
├── k8s/                   # Kubernetes manifests
├── monitoring/            # Prometheus, Tempo configs
└── docker-compose.yml     # Stack completo
```

## Sistemas Principales

### 1. MembershipSystem
Sistema de membresías B2B/B2G con 6 niveles:
- **Free** ($0) - Acceso básico
- **Starter** ($30/mes) - APIs limitadas
- **Pro** ($180/mes) - APIs extendidas, BCI básico
- **Business** ($550/mes) - Soporte prioritario, SLA 99.9%
- **Enterprise** ($2,400/año) - Infra dedicada
- **Custom** ($10,000+) - White-label

### 2. BCIEmotionalSystem (TBENA)
Sistema de interfaz cerebro-computadora con IA afectiva:
- Captura y procesamiento EEG
- Decodificación de estados emocionales
- Modulación del entorno 3D
- Modulación del comportamiento del agente IA

### 3. UniversitySystem
Plataforma educativa con:
- Cursos BCI-enhanced
- Certificaciones blockchain
- Contenido adaptativo basado en emociones
- Neurofeedback integrado

### 4. SocialCoreSystem
Red social con:
- Sistema de reputación EOCT
- 48 nodos federados
- Comunidades con membresía
- Feed personalizado

### 5. Dashboard de Monitoreo
Visualización en tiempo real de:
- Métricas de nodos federados
- Usuarios activos por región
- Salud del sistema
- Alertas y eventos

## Comandos

```bash
# Desarrollo
npm install
npm run dev

# Calidad
npm run lint
npm run typecheck
npm run test

# Build
npm run build

# Auditoría MD-X5 (Deca-V)
npm run audit:deca-v
```

## Despliegue

### Docker Compose
```bash
docker-compose up -d
```

### Kubernetes
```bash
kubectl apply -k k8s/
```

## Documentación

- [WikiTAMV](./docs/wikitamv/) - Documentación completa
- [CHANGELOG](./CHANGELOG.md) - Historial de cambios
- [SOUL.md](./SOUL.md) - Principios del proyecto
- [AGENTS.md](./AGENTS.md) - Guía para IA agents

## Contribución

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

## Fundador

**Edwin Oswaldo Castillo Trejo** (Anubis Villaseñor)

> "PROYECTO DEDICADO A REINA TREJO SERRANO. SONRÍE: TU OVEJA NEGRA LO LOGRÓ. TE QUIERO, MA'."

---

<div align="center">

**TAMV MD-X4™** - Orgullosamente Latinoamericano

[Documentación](./docs/wikitamv/) · [Contribuir](./CONTRIBUTING.md) · [Reportar Bug](https://github.com/tamv/digital-nexus/issues)
Para que la unificación sea real y sostenible, el plan técnico se divide en fases:

1. **Inventario y clasificación**
   - Catalogar los repos por dominio: identidad, economía, social, XR/3D, IA, seguridad, infra.
   - Marcar estado de cada repo: activo, legado, redundante, fusionable.

2. **Normalización de contratos**
   - Definir contratos de API y eventos entre módulos (tipos compartidos).
   - Homologar convenciones de carpetas, naming y versionado.

3. **Migración por federaciones**
   - Integrar primero repos de alto acoplamiento funcional (auth, wallet, social feed).
   - Reemplazar duplicados por módulos únicos mantenidos en este monorepo lógico.

4. **Consolidación CI/CD**
   - Aplicar gates comunes (lint/typecheck/test/build/deca-v) a todo módulo integrado.
   - Bloquear merges con regresiones arquitectónicas o constitucionales.

5. **Cierre y deprecación**
   - Congelar repos externos migrados.
   - Mantener este repositorio como fuente única de verdad operativa.

## Estructura de alto nivel

- `src/` — aplicación web, componentes, hooks, sistemas y páginas.
- `supabase/` — funciones edge, migraciones y configuración backend.
- `scripts/` — automatizaciones de chequeo arquitectónico, semántico y Deca-V.
- `eslint-plugin-tamv/` — plugin constitucional de reglas TAMV.

## Notas de despliegue

- El build de frontend se genera con `npm run build`.
- Las funciones de Supabase deben desplegarse con su pipeline correspondiente.
- Antes de publicar, ejecutar `npm run audit:deca-v` para validar integridad mínima.

## Enlace del proyecto en Lovable

- https://lovable.dev/projects/63163423-071c-45b1-95ff-6bdf8e698e0b?view=codeEditor

## Estado de sincronización de rama

</div>
