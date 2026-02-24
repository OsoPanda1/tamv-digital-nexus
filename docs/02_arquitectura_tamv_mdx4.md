# 02_arquitectura_tamv_mdx4

## Vista C4 L1 (contexto)
- **Actores:** usuario final, operador TAMV, servicios externos (pagos, auth).
- **Sistema:** TAMV Digital Nexus.
- **Bordes:** frontend React/Vite, Supabase Edge Functions, integraciones externas.

## Vista C4 L2 (contenedores)
1. **Frontend inmersivo** (`src/`) para experiencias TAMV ONLINE/Metaverse.
2. **Edge APIs** (`supabase/functions/`) para IA, seguridad y unificación de backend.
3. **Documentación canónica** (`docs/`) como capa de gobernanza.

## Vista C4 L3 (componentes destacados)
- Navegación y páginas de dominio: economía, universidad, metaverso, gobernanza.
- Sistemas cliente: `AnubisSecuritySystem`, `ThreeSceneManager`, `KAOSAudioSystem`.
- Componentes IA: hooks y librerías Isabella.

## MD-X4 (estado actual en este repo)
- Evidencia funcional parcial en componentes de render/escena (`QuantumCanvas`, `ThreeSceneManager`, `Metaverse`).
- Requiere consolidar contrato formal de pipeline dual (datos/sensorial) en siguientes iteraciones.
