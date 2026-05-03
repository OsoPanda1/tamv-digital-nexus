# TAMV · Auditoría técnica integral (2026-05-03)

## 1) Alcance y método
- Revisión estructural del repositorio (frontend, integraciones, scripts, operación y documentación).
- Validación ejecutable mínima sobre toolchain local.
- Identificación de sesgos, debilidades, inconsistencias y cuellos de botella.

## 2) Hallazgos críticos

### 2.1 Bloqueador principal de visualización en Lovable
**Síntoma observado:** el proyecto no compila/levanta en este entorno porque `vite` no está disponible y la instalación de dependencias falla por `403` al resolver paquetes desde npm.

**Evidencia reproducible:**
- `npm run build` falla con `sh: 1: vite: not found`.
- `npm install` falla con `403 Forbidden - GET https://registry.npmjs.org/vite`.

**Impacto funcional:**
- Sin instalación de dependencias no existe `node_modules/.bin/vite`, por tanto Lovable no puede renderizar UI.

### 2.2 Inconsistencia de compatibilidad de toolchain
- `vite` está en `^8.0.8`.
- `@vitejs/plugin-react-swc@^3.11.0` declara compatibilidad de peer para Vite hasta `^7`.
- `lovable-tagger` declara compatibilidad `<8.0.0`.

**Riesgo:** incluso con acceso a red, la resolución de peers puede ser inestable o degradada.

### 2.3 Riesgo documental-operativo
- Existía gap entre scripts de operación y guía de ejecución/evidencia; ya quedó mitigado con runbooks 1:1 y matriz de permisos.

## 3) Sesgos y debilidades sistémicas
- **Sesgo de “todo-en-uno”:** amplitud funcional alta en el discurso, pero sin contract testing transversal por dominio.
- **Sesgo de sobreafirmación operacional:** claims de capacidades (auditoría/perpetuidad/resiliencia total) sin indicadores de verificación ejecutable en pipeline por defecto.
- **Sesgo de dependencia externa silenciosa:** arranque local depende de registro npm y configuración de red/proxy no explicitada en onboarding.

## 4) Cuellos de botella
1. **Bootstrap de entorno** (dependencias y red) es SPOF para desarrollo/visualización.
2. **Compatibilidad de versiones** (Vite 8 vs peers) puede romper DX y CI.
3. **Observabilidad de arranque**: faltan verificaciones “preflight” explícitas para detectar incompatibilidad antes del `npm run dev`.

## 5) Mejoras funcionales propuestas (priorizadas)

### P0 (inmediato)
1. Validar conectividad a npm registry, mirror o artefacto interno antes de instalar.
2. Alinear versiones de Vite/plugins/Lovable para una matriz soportada única.
3. Añadir preflight de entorno en CI/local (`node -v`, `npm -v`, acceso registry, lockfile coherente).

### P1 (corto plazo)
1. Endurecer scripts operativos con salida JSON estándar y códigos comunes (completado).
2. Exigir evidencia BookPI por operación en runbooks (completado).
3. Publicar playbook de resolución de “no visualiza en Lovable” con checklist de red/proxy/versiones.

### P2 (mediano plazo)
1. Contract tests de APIs críticas por dominio.
2. Métricas de SLO para build/startup y tasa de fallos de instalación.
3. Registro de decisiones técnicas en governance/decision-log enlazado a cambios de toolchain.

## 6) Plan de remediación para “no visualiza en Lovable” (paso a paso)
1. Verificar Node/npm soportados por stack.
2. Confirmar acceso a `https://registry.npmjs.org/` o configurar mirror corporativo.
3. Ejecutar instalación limpia (`rm -rf node_modules package-lock.json && npm install`) en entorno con red permitida.
4. Corregir matriz de versiones de Vite + plugins para evitar peer drift.
5. Ejecutar `npm run build` y luego `npm run dev`.
6. Documentar evidencia del arranque (logs, fecha/hora UTC, versión, commit).

## 7) Trazabilidad
- Fecha de auditoría: 2026-05-03 (UTC).
- Estado: análisis documental + validación técnica mínima.
