# TAMV Digital Nexus (MD-X4)

Repositorio unificado de TAMV para frontend inmersivo, sistemas modulares, funciones Supabase, operación auditada y documentación canónica.

## Estado real actual (2026-05-03)

### Lo que sí existe en este repositorio
- Frontend React + TypeScript + Vite con componentes UI/XR y páginas de dominio en `src/`.
- Integraciones Supabase (cliente, tipos, funciones edge y migraciones) en `supabase/`.
- Manifiestos de despliegue en `k8s/`, `Dockerfile` y `docker-compose.yml`.
- Capa documental extensa en `docs/` y canon maestro en `SOUL.md` + `docs/MASTER_CANON_OPENCLAW_TAMV.md`.
- Scripts operativos canónicos con runbooks 1:1 para BookPI en `scripts/` y `docs/ops/runbooks/`.

### Bloqueador operativo detectado para visualización en Lovable
En este entorno, la app no visualiza porque no fue posible completar instalación de dependencias:
- `npm run build` → `vite: not found` (no existe binario local por falta de instalación).
- `npm install` → `403 Forbidden` al acceder al registro npm para `vite`.

Además hay **riesgo de compatibilidad** por matriz de peers:
- `vite@^8.x` vs `@vitejs/plugin-react-swc@^3.11.0` (peer hasta `^7`).
- `lovable-tagger` declara compatibilidad `<8.0.0`.

## Estructura principal

```text
.
├── src/                    # App React (componentes, hooks, pages, systems)
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
npm run build
npm run dev
```

## Documentación clave

- `SOUL.md`
- `docs/MASTER_CANON_OPENCLAW_TAMV.md`
- `docs/TAMV_TECH_AUDIT_2026-05-03.md`
- `docs/ops/runbooks/README.md`

## Nota de gobernanza

Este repositorio opera con modo documental y trazabilidad canónica. Cambios de lógica crítica deben pasar autorización humana explícita y registro de decisión.
