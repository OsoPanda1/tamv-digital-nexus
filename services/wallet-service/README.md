# wallet-service

## Propósito
Contrato documental y referencia dual del servicio **wallet-service** durante migración monorepo.

## Fuente actual
- Implementación activa: supabase/functions/wallet-service/

## Destino objetivo
- Carpeta objetivo de servicio: services/wallet-service/
- Pipeline independiente (Fase C) sin romper compatibilidad.

## Contratos esperados
- Definir endpoints/eventos y dependencias externas.
- Registrar variables de entorno requeridas.
- Mantener backward compatibility hasta cierre de Fase B.
