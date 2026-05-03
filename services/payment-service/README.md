# payment-service

## Propósito
Contrato documental y referencia dual del servicio **payment-service** durante migración monorepo.

## Fuente actual
- Implementación activa: supabase/functions/payment-service/

## Destino objetivo
- Carpeta objetivo de servicio: services/payment-service/
- Pipeline independiente (Fase C) sin romper compatibilidad.

## Contratos esperados
- Definir endpoints/eventos y dependencias externas.
- Registrar variables de entorno requeridas.
- Mantener backward compatibility hasta cierre de Fase B.
