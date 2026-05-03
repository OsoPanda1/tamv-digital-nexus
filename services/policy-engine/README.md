# policy-engine

## Propósito
Contrato documental y referencia dual del servicio **policy-engine** durante migración monorepo.

## Fuente actual
- Implementación activa: supabase/functions/policy-engine/

## Destino objetivo
- Carpeta objetivo de servicio: services/policy-engine/
- Pipeline independiente (Fase C) sin romper compatibilidad.

## Contratos esperados
- Definir endpoints/eventos y dependencias externas.
- Registrar variables de entorno requeridas.
- Mantener backward compatibility hasta cierre de Fase B.
