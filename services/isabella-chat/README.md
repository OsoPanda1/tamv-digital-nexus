# isabella-chat

## Propósito
Contrato documental y referencia dual del servicio **isabella-chat** durante migración monorepo.

## Fuente actual
- Implementación activa: supabase/functions/isabella-chat/

## Destino objetivo
- Carpeta objetivo de servicio: services/isabella-chat/
- Pipeline independiente (Fase C) sin romper compatibilidad.

## Contratos esperados
- Definir endpoints/eventos y dependencias externas.
- Registrar variables de entorno requeridas.
- Mantener backward compatibility hasta cierre de Fase B.
