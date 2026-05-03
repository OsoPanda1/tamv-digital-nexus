# stripe-webhook

## Propósito
Contrato documental y referencia dual del servicio **stripe-webhook** durante migración monorepo.

## Fuente actual
- Implementación activa: supabase/functions/stripe-webhook/

## Destino objetivo
- Carpeta objetivo de servicio: services/stripe-webhook/
- Pipeline independiente (Fase C) sin romper compatibilidad.

## Contratos esperados
- Definir endpoints/eventos y dependencias externas.
- Registrar variables de entorno requeridas.
- Mantener backward compatibility hasta cierre de Fase B.
