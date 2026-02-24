# TAMV MD-X5 — Protocolo Operacional Real (Deca‑V)

Este documento convierte la narrativa MD-X5 en ejecución verificable dentro del repo.

## Objetivo
Garantizar que el proyecto no despliegue cambios sin pasar un escudo de calidad repetido por ciclos (Deca‑V).

## Comando maestro
```bash
npm run audit:deca-v
```

Por defecto ejecuta **10 ciclos** (DECA_V_CYCLES=10) de los checks:
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

## Modo rápido (para desarrollo)
```bash
DECA_V_CYCLES=2 npm run audit:deca-v
```

## Criterio de aprobación
- Si cualquier comando falla en cualquier ciclo: aborta inmediatamente con exit code `1`.
- Si todos los ciclos pasan: confirma integridad operativa y build reproducible.

## Relación con arquitectura federada
Este protocolo no reemplaza las 7 federaciones, sino que actúa como una compuerta previa para cambios en:
- UI/3D/XR (`src/`)
- Integraciones y lógica de dominio
- funciones de Supabase (`supabase/functions/*`)

Con esto se evita que regresiones de frontend, tipado o build lleguen a producción sin detección temprana.
