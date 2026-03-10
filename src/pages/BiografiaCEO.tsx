import { WikiPage } from "@/components/WikiPage";
import { Section, InfoCard, InfoBox } from "@/components/WikiElements";
import { Crown, MapPin, Code, Eye, Flame, Globe, Cpu, Users, LineChart, Shield, BookOpen, Target } from "lucide-react";

const BiografiaCEO = () => (
  <WikiPage title="Edwin Oswaldo Castillo Trejo" subtitle="Fundador y Arquitecto del Ecosistema TAMV">
    {/* I. Identidad y Origen */}
    <Section title="Identidad y Origen" icon={MapPin}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <InfoCard icon={Crown} title="Anubis Villasenor" description="Nombre artistico y digital del fundador" variant="gold" />
        <InfoCard icon={MapPin} title="Real del Monte, Hidalgo" description="Origen: territorio minero y artesanal mexicano" variant="cyan" />
      </div>

      <p>
        Nacido y formado en Mineral del Monte (Real del Monte), Hidalgo, Mexico, 
        un territorio minero y artesanal, historicamente periferico respecto a los grandes polos tecnologicos globales.
      </p>

      <p className="mt-4">
        Este origen se convierte en eje estrategico de su vision: no intenta "migrar" hacia el centro, 
        sino <span className="text-primary font-semibold">reconfigurar el centro desde la periferia</span>, demostrando 
        que una arquitectura digital civilizatoria puede emerger desde un pueblo de montana con recursos limitados 
        pero alta densidad cultural.
      </p>

      <InfoBox type="info" title="Formacion Autodidacta">
        Su formacion es mayormente autodidacta, complementada con trayectos de educacion no convencional 
        (Udemy Alumni y formacion continua en linea), orientada hacia: arquitectura de sistemas, diseno modular, 
        infraestructuras distribuidas, gobernanza tecnologica e integracion de IA en entornos soberanos.
      </InfoBox>
    </Section>

    {/* II. Genesis del Proyecto */}
    <Section title="Genesis del Proyecto" icon={Cpu}>
      <p>
        Durante la decada de 2010, Edwin identifica lo que denomina un problema estructural del ecosistema digital contemporaneo: 
        una fragmentacion profunda entre identidad, economia, educacion e infraestructura.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {[
          { icon: Users, title: "Identidad Capturada", desc: "La identidad digital se encuentra capturada y condicionada por plataformas que actuan como intermediarios hegemonicos." },
          { icon: LineChart, title: "Economia Extractiva", desc: "La economia del usuario depende de infraestructuras centralizadas, disenadas para maximizar extraccion, no resiliencia ni equidad." },
          { icon: Cpu, title: "Asimetria Cognitiva", desc: "La IA se concentra progresivamente en pocas manos, generando asimetria entre individuos y corporaciones." },
        ].map((item) => (
          <div key={item.title} className="glass-panel rounded-xl p-5 border border-border/30">
            <div className="flex items-center gap-3 mb-3">
              <item.icon className="w-6 h-6 text-primary" />
              <span className="font-semibold text-foreground">{item.title}</span>
            </div>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      <p className="mt-6">
        A partir de este analisis, comienza a formular un marco alternativo que no nace como "app" 
        ni "startup" sino como <span className="text-primary font-semibold">arquitectura civilizatoria</span>. 
        Ese marco evoluciona desde modelos conceptuales de soberania digital (2015-2018) hacia lo que posteriormente 
        consolidara como TAMV Online Network 4D, y mas tarde como TAMV MD-X4, 
        el metaverso civilizatorio mexicano de nueva generacion.
      </p>
    </Section>

    {/* III. Vision 4D */}
    <Section title="La Cuarta Dimension (4D)" icon={Globe}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {[
          { dim: "Identidad", desc: "Quien es y como se representa" },
          { dim: "Infraestructura", desc: "Donde vive tecnicamente su identidad" },
          { dim: "Inteligencia", desc: "Como se procesa y asiste" },
          { dim: "Economia", desc: "Como se valoran los aportes" },
        ].map((d) => (
          <div key={d.dim} className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
            <span className="text-lg font-bold text-primary">{d.dim}</span>
            <p className="text-sm text-muted-foreground mt-1">{d.desc}</p>
          </div>
        ))}
      </div>
    </Section>

    {/* IV. Estilo de Liderazgo */}
    <Section title="Estilo de Liderazgo" icon={Target}>
      <p>
        El liderazgo de Edwin combina rigor tecnico, narrativa simbolica estructurada, 
        enfoque sistemico de largo plazo y rechazo a la improvisacion estrategica.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {[
          { icon: Code, text: "Modularidad antes que centralizacion" },
          { icon: BookOpen, text: "Documentacion antes que marketing" },
          { icon: Shield, text: "Gobernanza antes que expansion" },
          { icon: Flame, text: "Antifragilidad antes que crecimiento rapido" },
        ].map((principle) => (
          <div key={principle.text} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/20">
            <principle.icon className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-foreground">{principle.text}</span>
          </div>
        ))}
      </div>

      <InfoBox type="info" title="Logica de Infraestructura">
        No opera bajo la logica clasica de "startup acelerada" ni persigue rondas de inversion como primer objetivo; 
        su logica es la de infraestructura civilizatoria de decadas, que debe sobrevivir a ciclos 
        economicos, modas tecnologicas y cambios politicos.
      </InfoBox>
    </Section>

    {/* V. Mapa de Hitos */}
    <Section title="Mapa de Hitos">
      <div className="space-y-4 mt-4">
        {[
          { year: "2015-2018", event: "Primeros modelos de soberania digital", impact: "Germen de la arquitectura TAMV como respuesta a captura de identidad." },
          { year: "2020", event: "Diseno conceptual inicial de TAMV", impact: "Arquitectura embrionaria de infraestructura federada." },
          { year: "2022", event: "Consolidacion del nombre TAMV", impact: "Identidad estructural del movimiento; posicionamiento como ecosistema mexicano pionero." },
          { year: "2024", event: "Protocolos eticos de IA (Isabella IA)", impact: "Capa de inteligencia integrada, auditada y alineada con soberania." },
          { year: "2025", event: "Arquitectura TAMV MD-X4", impact: "Arquitectura madura para despliegue federado y Web 4.0/5.0." },
          { year: "2026", event: "Consolidacion y expansion estrategica", impact: "Documentacion avanzada y busqueda de alianzas para validacion publica." },
        ].map((hito, idx) => (
          <div key={idx} className="flex gap-4 p-4 rounded-lg bg-muted/10 border border-border/20">
            <span className="px-3 py-1 h-fit rounded bg-primary/20 text-primary font-mono text-sm whitespace-nowrap">{hito.year}</span>
            <div>
              <p className="font-semibold text-foreground">{hito.event}</p>
              <p className="text-sm text-muted-foreground">{hito.impact}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>

    {/* VI. Estado Actual */}
    <Section title="Estado Actual 2026" icon={Eye}>
      <p>En 2026, Edwin Oswaldo Castillo Trejo se encuentra en fase de:</p>

      <ul className="space-y-2 mt-4">
        {[
          "Consolidacion estructural de TAMV MD-X4, afinando la arquitectura del metaverso civilizatorio.",
          "Documentacion formal avanzada, incluyendo wiki tecnica, libro, blog y artefactos auditables.",
          "Preparacion para validacion publica ampliada, buscando foros y alianzas para auditar y escalar el modelo.",
          "Diseno de gobernanza federada operativa, distribuyendo responsabilidades en una red de nodos civilizatorios.",
        ].map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>

      <InfoBox type="success" title="Horas de Trabajo Documentadas">
        El proyecto acumula mas de 21,600 horas de trabajo individual documentadas, posicionandose como uno de los 
        experimentos mas radicales e integros en torno a como un solo individuo puede intentar reescribir 
        la arquitectura de la civilizacion digital desde la periferia latinoamericana.
      </InfoBox>
    </Section>
  </WikiPage>
);

export default BiografiaCEO;
