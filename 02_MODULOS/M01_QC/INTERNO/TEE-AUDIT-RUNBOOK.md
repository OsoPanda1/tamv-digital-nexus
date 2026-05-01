# TEE Audit Runbook — TAMV MD-X4

> **Módulo:** M01_QC · **Estado:** `draft` · **Acceso:** INTERNO
> **Dominio:** DM-X4-03 Seguridad / DM-X4-07 Infra

---

## 1. ¿Qué es TEE?

TEE (Trusted Execution Environment) es un entorno de ejecución aislado y verificable que garantiza que el código sensible no ha sido alterado y se ejecuta en condiciones controladas.

---

## 2. Módulos candidatos para TEE

| Módulo | Criticidad | Justificación |
|--------|-----------|--------------|
| Isabella LLM + TTS | Alta | Procesa datos personales y conversaciones |
| Stripe / Economy | Crítica | Maneja transacciones reales y wallets |
| MSR / BookPI | Alta | Certifica credenciales académicas en blockchain |
| DEKATEOTL Security | Crítica | Protege el ecosistema completo |

---

## 3. Proceso de auditoría TEE

### Paso 1: Aislamiento de código

```bash
# Identificar módulo objetivo
TARGET_MODULE="isabela-tts"  # o dekateotl-security, create-checkout, etc.

# Exportar snapshot del código
git archive HEAD supabase/functions/$TARGET_MODULE > /tmp/$TARGET_MODULE-snapshot.tar.gz

# Calcular hash del snapshot
sha256sum /tmp/$TARGET_MODULE-snapshot.tar.gz > /tmp/$TARGET_MODULE-snapshot.sha256
```

### Paso 2: Ejecución de tests en TEE

```bash
# Ejecutar tests del módulo en entorno aislado (Docker + seccomp)
docker run --read-only --no-new-privileges \
  --security-opt seccomp=<seccomp-profile.json> \
  -v /tmp/$TARGET_MODULE-snapshot.tar.gz:/module.tar.gz:ro \
  tamv-tee-runner:latest \
  run-tests /module.tar.gz
```

### Paso 3: Publicación de attestation

```json
{
  "module": "isabella-tts",
  "version": "git-sha-xxx",
  "snapshot_hash": "sha256:abc...",
  "test_results": {
    "passed": 12,
    "failed": 0,
    "skipped": 0
  },
  "audited_at": "2026-02-24T12:00:00Z",
  "auditor": "TAMV_DOC_SENTINEL",
  "signature": "..."
}
```

Publicar en `docs/sofreports/TEE_ATTESTATIONS/` con nombre `{module}-{date}.json`.

### Paso 4: Monitoreo continuo

- Frecuencia: cada PR a `main` que modifique módulos TEE-críticos.
- Alerta: si hash del módulo difiere del último attestation → bloquear merge.
- Dashboard: `docs/sofreports/THESOF_STATE_REPORT.md` (actualizar sección TEE).

---

## 4. Script de verificación TEE

```bash
# scripts/check-tee.ts (a implementar)
# Verifica que los módulos sensibles tienen attestation vigente

const TEE_MODULES = [
  'supabase/functions/isabella-tts',
  'supabase/functions/dekateotl-security-enhanced',
  'supabase/functions/create-checkout',
  'supabase/functions/stripe-webhook',
];

for (const module of TEE_MODULES) {
  const currentHash = computeHash(module);
  const attestation = loadLatestAttestation(module);
  
  if (attestation.snapshot_hash !== currentHash) {
    console.error(`TEE ALERT: ${module} hash mismatch!`);
    process.exit(1);
  }
}
```

---

## 5. Governance TEE

**DAO-Seguridad** puede decidir:
- Qué módulos exigen ejecución en TEE.
- Frecuencia de auditorías TEE.
- Criterios de fallo de attestation.

**No puede decidir:**
- Claves raíz del sistema.
- Decisiones económicas (comisiones, wallet rules).

---

## 6. Estado actual

| Módulo | TEE Status | Última attestation |
|--------|-----------|-------------------|
| `isabella-tts` | ❌ Pendiente | — |
| `dekateotl-security-enhanced` | ❌ Pendiente | — |
| `create-checkout` | ❌ Pendiente | — |
| `stripe-webhook` | ❌ Pendiente | — |

**Acción requerida:** Implementar `scripts/check-tee.ts` y pipeline en CI.
