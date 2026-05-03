# tamv-content-sync

## Propósito
Contrato documental y referencia dual del servicio **tamv-content-sync** durante migración monorepo.

## Fuente actual
- Implementación activa: supabase/functions/tamv-content-sync/

## Destino objetivo
- Carpeta objetivo de servicio: services/tamv-content-sync/
- Pipeline independiente (Fase C) sin romper compatibilidad.

## Contratos esperados
- Definir endpoints/eventos y dependencias externas.
- Registrar variables de entorno requeridas.
- Mantener backward compatibility hasta cierre de Fase B.
