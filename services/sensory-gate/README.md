# sensory-gate

## Propósito
Contrato documental y referencia dual del servicio **sensory-gate** durante migración monorepo.

## Fuente actual
- Implementación activa: supabase/functions/sensory-gate/

## Destino objetivo
- Carpeta objetivo de servicio: services/sensory-gate/
- Pipeline independiente (Fase C) sin romper compatibilidad.

## Contratos esperados
- Definir endpoints/eventos y dependencias externas.
- Registrar variables de entorno requeridas.
- Mantener backward compatibility hasta cierre de Fase B.
