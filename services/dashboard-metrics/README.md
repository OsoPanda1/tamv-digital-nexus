# dashboard-metrics

## Propósito
Contrato documental y referencia dual del servicio **dashboard-metrics** durante migración monorepo.

## Fuente actual
- Implementación activa: supabase/functions/dashboard-metrics/

## Destino objetivo
- Carpeta objetivo de servicio: services/dashboard-metrics/
- Pipeline independiente (Fase C) sin romper compatibilidad.

## Contratos esperados
- Definir endpoints/eventos y dependencias externas.
- Registrar variables de entorno requeridas.
- Mantener backward compatibility hasta cierre de Fase B.
