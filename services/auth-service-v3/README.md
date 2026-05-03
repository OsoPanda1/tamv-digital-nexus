# auth-service-v3

## Propósito
Contrato documental y referencia dual del servicio **auth-service-v3** durante migración monorepo.

## Fuente actual
- Implementación activa: supabase/functions/auth-service-v3/

## Destino objetivo
- Carpeta objetivo de servicio: services/auth-service-v3/
- Pipeline independiente (Fase C) sin romper compatibilidad.

## Contratos esperados
- Definir endpoints/eventos y dependencias externas.
- Registrar variables de entorno requeridas.
- Mantener backward compatibility hasta cierre de Fase B.
