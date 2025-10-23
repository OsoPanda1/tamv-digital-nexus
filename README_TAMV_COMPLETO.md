# 🌌 TAMV MD-X4™ — Ecosistema Civilizatorio Digital Mexicano

**Versión:** 1.0.0  
**Origen:** Real del Monte, Hidalgo, México  
**Stack:** React + TypeScript + Vite + Tailwind + Three.js + Lovable Cloud (Supabase)

---

## 📦 **Arquitectura Completa**

### **Frontend**
- **Framework:** React 18.3 + TypeScript + Vite
- **Styling:** Tailwind CSS con sistema de diseño Quantum-Crystal
- **3D/XR:** Three.js + @react-three/fiber + @react-three/drei
- **Estado:** Zustand con persistencia
- **Animaciones:** Framer Motion
- **UI Components:** shadcn/ui con personalización quantum

### **Backend (Lovable Cloud)**
- **Base de datos:** PostgreSQL con Row Level Security
- **Autenticación:** Supabase Auth (JWT)
- **Edge Functions:**
  - `isabella-chat`: IA multimodal con Lovable AI (Gemini 2.5 Flash)
  - `quantum-analytics`: Analytics y métricas de coherencia cuántica
  - `dekateotl-security`: Sistema de seguridad post-cuántica de 11 capas
- **Storage:** Supabase Storage para assets multimedia

---

## 🎯 **Características Principales**

### 1. **Intro Cinemática**
- Animación 3D con partículas cuánticas
- Permisos sensoriales (audio, video, háptica)
- Formación del logo TAMV con efectos volumétricos
- Se muestra solo la primera vez

### 2. **Isabella AI**
- Asistente multimodal con Gemini 2.5 Flash
- Streaming de respuestas en tiempo real
- Memoria contextual de conversaciones
- Personalidad empática y mexicana

### 3. **Dream Spaces**
- Espacios 3D multisensoriales
- Ambientes: Quantum, Cosmic, Forest, Crystal
- Sistema de coherencia cuántica requerida
- Roles: Public, Creator, Pro

### 4. **Anubis Security**
- Dashboard de seguridad en tiempo real
- Sistema DEKATEOTL de 11 capas
- Detección de amenazas post-cuánticas
- Alertas y escaneos automatizados

### 5. **KAOS Audio System**
- Audio espacial 3D/4D
- Paisajes sonoros inmersivos
- Integración con Dream Spaces
- Control de intensidad sensorial

### 6. **Universidad TAMV**
- Cursos gratuitos y certificados
- Categorías: Fundamentos, Desarrollo, IA, Seguridad, Audio
- Certificación oficial del ecosistema
- Comunidad global de aprendizaje

### 7. **Ecosystem View**
- Visualización del ecosistema completo
- Módulos interconectados
- Arquitectura quantum-native
- Roadmap y filosofía

---

## 🚀 **Instalación y Despliegue**

### **Requisitos Previos**
```bash
node >= 18.0.0
npm >= 9.0.0
```

### **1. Clonar el repositorio**
```bash
git clone https://github.com/tu-org/tamv-md-x4.git
cd tamv-md-x4
```

### **2. Instalar dependencias**
```bash
npm install
```

### **3. Configurar variables de entorno**
El proyecto ya viene configurado con Lovable Cloud. Las variables de entorno están en `.env`:
```
VITE_SUPABASE_URL=https://bnjvxgguatrfwswnoluz.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=tu_key_aqui
VITE_SUPABASE_PROJECT_ID=bnjvxgguatrfwswnoluz
```

### **4. Ejecutar en desarrollo**
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:8080`

### **5. Build para producción**
```bash
npm run build
```

### **6. Despliegue**
El proyecto está optimizado para Lovable Cloud, pero también puede desplegarse en:
- Vercel
- Netlify
- Cloudflare Pages

---

## 📁 **Estructura del Proyecto**

```
tamv-md-x4/
├── src/
│   ├── components/
│   │   ├── CinematicIntro.tsx       # Intro animada 3D
│   │   ├── QuantumCanvas.tsx        # Background de partículas
│   │   ├── HolographicUI.tsx        # Componentes holográficos
│   │   ├── Navigation.tsx           # Navbar quantum
│   │   └── ui/                      # shadcn components
│   ├── pages/
│   │   ├── Index.tsx                # Landing principal
│   │   ├── Isabella.tsx             # Chat IA
│   │   ├── Anubis.tsx               # Security dashboard
│   │   ├── Kaos.tsx                 # Audio 4D
│   │   ├── DreamSpaces.tsx          # Metaverso
│   │   ├── University.tsx           # Cursos
│   │   ├── Ecosystem.tsx            # Vista del ecosistema
│   │   ├── Community.tsx            # Red social
│   │   ├── Docs.tsx                 # Centro de documentación
│   │   └── Dashboard.tsx            # Panel de control
│   ├── hooks/
│   │   ├── useIsabellaChat.ts       # Hook para IA
│   │   └── useQuantumState.ts       # Estado global Zustand
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts            # Cliente Supabase
│   │       └── types.ts             # Tipos auto-generados
│   ├── index.css                    # Design system
│   └── main.tsx                     # Entry point
├── supabase/
│   ├── functions/
│   │   ├── isabella-chat/
│   │   ├── quantum-analytics/
│   │   └── dekateotl-security/
│   └── config.toml                  # Configuración Supabase
├── public/
│   └── assets/                      # Assets estáticos
└── README_TAMV_COMPLETO.md          # Este archivo
```

---

## 🎨 **Sistema de Diseño Quantum-Crystal**

### **Tokens de Color (HSL)**
```css
--primary: 217 91% 60%        /* Azul quantum */
--secondary: 271 81% 56%      /* Violeta místico */
--accent: 45 93% 58%          /* Oro mexicano */
```

### **Gradientes**
```css
--gradient-quantum: linear-gradient(135deg, primary, secondary, accent)
--gradient-holographic: linear-gradient(90deg, rotating colors)
--gradient-nebula: radial-gradient(ellipse, glow effects)
```

### **Efectos Especiales**
- `.glass-panel`: Glassmorphism con blur(20px)
- `.glow-text`: Text-shadow con efecto quantum
- `.shadow-quantum`: Box-shadow multicapa
- `.animate-holographic`: Animación de colores holográficos

---

## 🔐 **Seguridad**

### **DEKATEOTL - 11 Capas**
1. Análisis de identidad digital (ID-NVIDA)
2. Comportamiento del usuario
3. Anomalías cuánticas
4. Post-quantum cryptography
5. Biométrica emocional
6. Blockchain de reputación
7. Bifurcación de identidad
8. Detección de deepfakes
9. Auditoría continua
10. Consenso distribuido
11. Auto-sanación del sistema

### **RLS (Row Level Security)**
Todas las tablas de la base de datos tienen políticas RLS activas.

---

## 🤖 **Isabella AI**

### **Capabilities**
- Streaming de respuestas
- Memoria contextual
- Personalidad empática
- Multimodal (texto)
- Voz espacial (próximamente)

### **Modelo**
- **Provider:** Lovable AI Gateway
- **Model:** google/gemini-2.5-flash
- **Rate Limits:** Gestionado por Lovable Cloud

---

## 📊 **Analytics y Métricas**

### **Eventos Tracked**
- `page_view`: Navegación
- `interaction`: Interacciones del usuario
- `quantum_coherence`: Métricas de coherencia
- `dream_space_enter`: Entradas a espacios
- `ai_interaction`: Uso de Isabella AI

### **Dashboard**
Métricas en tiempo real disponibles en `/dashboard`

---

## 🌐 **API REST (Próximamente)**

### **Endpoints Planificados**
```
POST   /api/v1/auth/login
POST   /api/v1/auth/register
GET    /api/v1/users/me
GET    /api/v1/spaces
POST   /api/v1/ai/message
GET    /api/v1/security/scan
POST   /api/v1/analytics/event
```

---

## 🎓 **Contribuir**

### **Código de Conducta**
Respeto, inclusión y co-creación emocional.

### **Pull Requests**
1. Fork del repositorio
2. Crear branch: `git checkout -b feature/mi-feature`
3. Commit: `git commit -m 'Add: Mi feature'`
4. Push: `git push origin feature/mi-feature`
5. Abrir PR

---

## 📜 **Licencia**

Proyecto de código abierto bajo licencia MIT con cláusula de soberanía digital mexicana.

---

## 🌟 **Créditos**

**Creador:** Ecosistema TAMV MD-X4™  
**Origen:** Real del Monte, Hidalgo, México  
**Civilización:** Digital Mexicana  
**Filosofía:** Quantum-Emocional  
**Stack:** Lovable + React + Three.js + Supabase

---

## 🔗 **Enlaces**

- **Demo:** [https://tamv.lovable.app](https://tamv.lovable.app)
- **Docs:** `/docs` (dentro de la app)
- **Backend:** Lovable Cloud (Supabase)
- **GitHub:** [tu-repo-aqui]

---

## 📞 **Soporte**

Para soporte técnico, abre un issue en GitHub o contacta al equipo de desarrollo en `dev@tamv.network`

---

**¡Bienvenido al futuro de la civilización digital! 🌌✨**
