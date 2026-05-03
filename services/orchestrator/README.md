# orchestrator

## Propósito
Contrato documental y referencia dual del servicio **orchestrator** durante migración monorepo.

## Fuente actual
- Implementación activa: supabase/functions/orchestrator/

## Destino objetivo
- Carpeta objetivo de servicio: services/orchestrator/
- Pipeline independiente (Fase C) sin romper compatibilidad.

## Contratos esperados
- Definir endpoints/eventos y dependencias externas.
- Registrar variables de entorno requeridas.
- Mantener backward compatibility hasta cierre de Fase B.
