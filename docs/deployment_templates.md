# Deployment Templates & CI/CD References — TAMV MD-X4

> **Estado:** `stable` · **Versión:** 1.0 · **Dominio:** DM-X4-07 Infra
> **Última actualización:** 2026-03-01 · **Ref:** MD-X4 Wiki Master Update

---

## 1. Plataformas de despliegue soportadas

| Plataforma | Archivo de configuración | Estado |
|-----------|------------------------|--------|
| Fly.io | `fly.toml` | ✅ Configurado |
| Vercel | `vercel.json` (template) | ⚠️ Template |
| Netlify | `_redirects` (template) | ⚠️ Template |
| Docker | `Dockerfile` | ✅ Configurado |
| GitHub Pages | `.github/workflows/ci.yml` (job: build) | ✅ Configurado |
| Lovable Cloud | Automático | ✅ Recomendado |

---

## 2. Configuración Fly.io — `fly.toml`

```toml
# fly.toml — Configuración canónica TAMV
app = 'tamvonline'
primary_region = 'lax'

[build]

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = 'stop'
  auto_start_machines = true
  min_machines_running = 0
  processes = ['app']

[[vm]]
  memory = '1gb'
  cpu_kind = 'shared'
  cpus = 1
  memory_mb = 256
```

**Despliegue:**
```bash
fly auth login
fly deploy
```

**Variables de entorno en Fly.io:**
```bash
fly secrets set VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
fly secrets set VITE_SUPABASE_PUBLISHABLE_KEY=tu_anon_key
```

---

## 3. Template Vercel — `vercel.json`

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "@vite_supabase_url",
    "VITE_SUPABASE_PUBLISHABLE_KEY": "@vite_supabase_publishable_key"
  }
}
```

**Despliegue:**
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 4. Template Netlify — `netlify.toml`

```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

**Variables de entorno en Netlify:**
```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=tu_anon_key
```

---

## 5. Docker — `Dockerfile`

```dockerfile
# Dockerfile canónico TAMV MD-X4
FROM pierrezemb/gostatic
COPY . /srv/http/
CMD ["-port","8080","-https-promote", "-enable-logging"]
```

**Build y run local:**
```bash
npm run build
docker build -t tamv-nexus:latest .
docker run -p 8080:8080 tamv-nexus:latest
```

---

## 6. Variables de entorno requeridas

| Variable | Descripción | Requerida | Ejemplo |
|----------|-------------|-----------|---------|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase | ✅ | `https://xxx.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clave anon de Supabase | ✅ | `eyJ...` |
| `VITE_SUPABASE_PROJECT_ID` | ID del proyecto | ⚠️ Opcional | `abcdefgh` |
| `VITE_APP_ENV` | Entorno (`development`/`production`) | ⚠️ | `production` |

> **NUNCA** incluir `service_role` key en variables de entorno del frontend. Solo en Edge Functions via Supabase secrets.

---

## 7. Pipeline CI/CD — `.github/workflows/ci.yml`

El pipeline CI/CD canónico ejecuta los siguientes jobs en orden:

### Job 1: `quality-checks`
```
npm ci
→ npm run lint          (ESLint + eslint-plugin-tamv)
→ npm run check         (TypeScript sin emit)
→ npm run check:architecture (grafo de dependencias)
→ npm run test          (Vitest)
```

### Job 2: `e2e-tests` (requiere quality-checks)
```
npm ci
→ npx playwright install --with-deps
→ npm run test:e2e      (Playwright)
```

### Job 3: `build` (requiere quality-checks + e2e, solo en `main`)
```
npm ci
→ npm run build         (Vite production build)
→ Deploy a GitHub Pages / Fly.io / Vercel
```

### Job 4: `security-audit` (requiere quality-checks, solo en `main`)
```
npm audit --audit-level=high
```

---

## 8. Constitutional Gate — `.github/workflows/constitutional-gate.yml`

Pipeline exclusivo de integridad constitucional en PRs:

```
npm run lint:constitution   → ESLint plugin-tamv en modo error
npm run scan:semantics      → Detector de drift de nombres canónicos
npm run check:architecture  → Grafo de dependencias sin ciclos
npm run check:docs-sync     → Documentación sincronizada con código
```

**Criterio de bloqueo:** Cualquier fallo bloquea el merge del PR.

---

## 9. Deca-V Audit — Protocolo MD-X5

Para auditorías de integridad pre-despliegue:

```bash
# Protocolo completo (10 ciclos)
npm run audit:deca-v

# Modo rápido (2 ciclos, para desarrollo)
DECA_V_CYCLES=2 npm run audit:deca-v
```

Cada ciclo ejecuta: `lint` → `typecheck` → `test` → `build`.
Un fallo en cualquier ciclo aborta con exit code `1`.

Ver: `MDX5_OPERATIONAL_PROTOCOL.md`

---

## 10. Checklist de despliegue a producción

### Pre-deploy
- [ ] `npm run build` exitoso sin warnings
- [ ] `npm run lint` sin errores
- [ ] `npm run check` (TypeScript) sin errores
- [ ] `npm run test` (Vitest) sin fallos
- [ ] `npm run check:architecture` sin violaciones
- [ ] Variables de entorno configuradas en plataforma destino
- [ ] RLS habilitado en TODAS las tablas Supabase
- [ ] Edge Functions desplegadas y verificadas
- [ ] Stripe webhook secret configurado en Supabase secrets

### Deploy
- [ ] Aplicación desplegada correctamente
- [ ] DNS propagado (si dominio custom)
- [ ] HTTPS/SSL activo
- [ ] Edge Functions responden (ping test)

### Post-deploy
- [ ] Verificar login/signup en `/auth`
- [ ] Probar Isabella AI en `/isabella`
- [ ] Verificar feed social en `/dashboard`
- [ ] Confirmar wallet en `/economy`
- [ ] Revisar logs de Edge Functions
- [ ] Confirmar analytics funcionando
- [ ] Probar certificación en `/university`

---

## 11. Migraciones de base de datos requeridas

Ejecutar en orden en Supabase SQL Editor:

```sql
-- 1. profiles (base)
-- Ver: DEPLOYMENT_GUIDE.md § Configuración de Base de Datos

-- 2. analytics_events
-- Ver: DEPLOYMENT_GUIDE.md § analytics_events

-- 3. posts (Social Core)
-- Ver: docs/05_social_core_schema_ui.md § 2.1

-- 4. tcep_wallets (Economía)
-- Ver: 02_MODULOS/M04_ECONOMIA/INTERNO/MARKETPLACE-TAU-SPEC.md

-- 5. processed_stripe_events (Idempotencia webhooks)
-- Ver: 02_MODULOS/M04_ECONOMIA/INTERNO/MARKETPLACE-TAU-SPEC.md § 2

-- 6. courses, enrollments, certificates (BookPI/UTAMV)
-- Ver: docs/06_federated_certification.md § 2

-- 7. tts_cache (Isabella TTS)
-- Ver: 02_MODULOS/M05_IA_TAMVAI/INTERNO/ISABELLA-PRIME-SPEC.md § 3.1

-- 8. security_events, security_scans (DEKATEOTL)
-- Ver: DEPLOYMENT_GUIDE.md § security_scans
```

---

## 12. Referencias

- `fly.toml` — Configuración Fly.io
- `Dockerfile` — Imagen Docker estática
- `.github/workflows/ci.yml` — Pipeline CI/CD principal
- `.github/workflows/constitutional-gate.yml` — Gate constitucional
- `MDX5_OPERATIONAL_PROTOCOL.md` — Protocolo Deca-V
- `DEPLOYMENT_GUIDE.md` — Guía de despliegue completa
- `E2E_CHECKLIST_TAMV.md` — Checklist E2E
- `docs/02_arquitectura_tamv_mdx4.md` — Arquitectura completa
