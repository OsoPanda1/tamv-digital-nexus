# TAMV Digital Nexus (MD-X4)

Repositorio unificado de TAMV para frontend inmersivo, sistemas modulares, funciones Supabase, operación auditada y documentación canónica.

## Estado real actual (2026-05-15)

### Lo que sí existe en este repositorio
- Frontend React + TypeScript + Vite con componentes UI/XR y páginas de dominio en `apps/web/src/`.
- Integraciones Supabase (cliente, tipos, funciones edge y migraciones) en `supabase/`.
- Manifiestos de despliegue en `k8s/`, `Dockerfile` y `docker-compose.yml`.
- Capa documental extensa en `docs/` y canon maestro en `SOUL.md` + `docs/MASTER_CANON_OPENCLAW_TAMV.md`.
- Scripts operativos canónicos con runbooks 1:1 para BookPI en `scripts/` y `docs/ops/runbooks/`.

### Avance funcional integrado (RDM Territorial OS)

Se integró un núcleo demostrable de **Sistema Operativo Territorial** en `/territorial-os`:
- Registro de identidad operativa + wallet MSR local.
- Recompensas auditadas con hashes `bookpi:*`.
- Comercio conectable + payment intents sandbox.
- Catálogo de lugares territoriales.
- IA contextual segura basada en lugares/tags.
- Persistencia local para demo Vercel/Lovable sin backend obligatorio.
- API serverless `supabase/functions/rdm-digital-api` con migración SQL para identidad, wallet, comercio, lugares, pagos sandbox/Stripe e IA contextual.

**Avance funcional MVP estimado:** ~78–80% para demostración frontend + core local. Producción bancaria/SPEI/Stripe live y multi-región permanecen como hardening regulado.

### Bloqueador operativo de dependencias detectado

En este contenedor, la app no pudo compilarse porque no fue posible completar instalación de dependencias:
- `npm run build` → `vite: not found` cuando no existe `node_modules`.
- `npm install` → `403 Forbidden`/timeout al acceder al registro npm para paquetes como `vite`/`esbuild`.

Mitigaciones incorporadas:
- `vite.config.ts` apunta a la raíz real `apps/web`.
- `tsconfig*.json` resuelve `@/*` hacia `apps/web/src/*`.
- `.npmrc` activa `legacy-peer-deps=true` para reducir bloqueo por peers en npm estricto.

## Estructura principal

```text
.
├── apps/web/src/           # App React (componentes, hooks, pages, systems)
├── apps/web/src/lib/rdm-digital/ # Core RDM: identidad, wallet, ledger, IA
├── supabase/functions/rdm-digital-api/ # API serverless RDM
├── supabase/               # Edge functions + migraciones
├── scripts/                # Operación canónica (BookPI / SRE)
├── docs/                   # Canon y documentación técnica/operativa
├── k8s/                    # Manifiestos Kubernetes
├── monitoring/             # Configs observabilidad
└── docker-compose.yml      # Entorno local de servicios
```

## Scripts operativos canónicos

- `scripts/pi-check.sh`
- `scripts/publish-bookpi.sh`
- `scripts/openapi-diff.sh`
- `scripts/canary-weights.sh`
- `scripts/rotate-keys.sh`
- `scripts/drain-dlq.sh`

Todos soportan:
- `--help` (contrato de entrada/salida)
- `--json` (salida estructurada opcional)
- códigos estándar (`0`, `2`, `3`, `4`, `5`)

Runbooks asociados en `docs/ops/runbooks/` (1:1).

## Diagnóstico rápido cuando “no visualiza en Lovable”

1. Verifica red hacia npm registry o mirror permitido.
2. Verifica versiones de Node/npm del entorno.
3. Reinstala dependencias en limpio.
4. Alinea versión de Vite con plugins/peer deps soportadas.
5. Ejecuta:

```bash
npm run test:rdm
npm run build
npm run dev
```

## Documentación clave

- `SOUL.md`
- `docs/MASTER_CANON_OPENCLAW_TAMV.md`
- `docs/TAMV_TECH_AUDIT_2026-05-03.md`
- `docs/RDM_TERRITORIAL_OS_IMPLEMENTATION_2026-05-15.md`
- `docs/ops/runbooks/README.md`

## Nota de gobernanza

Este repositorio opera con modo documental y trazabilidad canónica. Cambios de lógica crítica deben pasar autorización humana explícita y registro de decisión.
