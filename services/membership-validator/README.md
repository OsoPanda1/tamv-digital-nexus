# membership-validator

## Propósito
Contrato documental y referencia dual del servicio **membership-validator** durante migración monorepo.

## Fuente actual
- Implementación activa: supabase/functions/membership-validator/

## Destino objetivo
- Carpeta objetivo de servicio: services/membership-validator/
- Pipeline independiente (Fase C) sin romper compatibilidad.

## Contratos esperados
- Definir endpoints/eventos y dependencias externas.
- Registrar variables de entorno requeridas.
- Mantener backward compatibility hasta cierre de Fase B.
