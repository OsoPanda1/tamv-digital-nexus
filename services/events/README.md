# events

## Propósito
Contrato documental y referencia dual del servicio **events** durante migración monorepo.

## Fuente actual
- Implementación activa: supabase/functions/events/

## Destino objetivo
- Carpeta objetivo de servicio: services/events/
- Pipeline independiente (Fase C) sin romper compatibilidad.

## Contratos esperados
- Definir endpoints/eventos y dependencias externas.
- Registrar variables de entorno requeridas.
- Mantener backward compatibility hasta cierre de Fase B.
