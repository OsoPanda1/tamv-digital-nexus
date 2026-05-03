# apps/

## Propósito
Contiene aplicaciones ejecutables del ecosistema TAMV (frontend, backoffice, apps especializadas).

## Responsables
- Equipo Plataforma Web
- Equipo Experiencia de Producto

## Contratos esperados
- Cada app define su propio `README.md` local con comandos de ejecución y build.
- Dependencias compartidas deben consumirse desde `packages/`.
- No se permite acoplamiento directo a infraestructura: usar contratos de `services/`.
