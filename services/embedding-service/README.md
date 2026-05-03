# embedding-service

## Propósito
Contrato documental y referencia dual del servicio **embedding-service** durante migración monorepo.

## Fuente actual
- Implementación activa: supabase/functions/embedding-service/

## Destino objetivo
- Carpeta objetivo de servicio: services/embedding-service/
- Pipeline independiente (Fase C) sin romper compatibilidad.

## Contratos esperados
- Definir endpoints/eventos y dependencias externas.
- Registrar variables de entorno requeridas.
- Mantener backward compatibility hasta cierre de Fase B.
