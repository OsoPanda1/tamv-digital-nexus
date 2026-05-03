# github-repo-scanner

## Propósito
Contrato documental y referencia dual del servicio **github-repo-scanner** durante migración monorepo.

## Fuente actual
- Implementación activa: supabase/functions/github-repo-scanner/

## Destino objetivo
- Carpeta objetivo de servicio: services/github-repo-scanner/
- Pipeline independiente (Fase C) sin romper compatibilidad.

## Contratos esperados
- Definir endpoints/eventos y dependencias externas.
- Registrar variables de entorno requeridas.
- Mantener backward compatibility hasta cierre de Fase B.
