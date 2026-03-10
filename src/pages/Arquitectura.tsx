import { WikiPage } from "@/components/WikiPage";
import { Section, InfoCard } from "@/components/WikiElements";
import { Layers, Shield, Brain, Globe, Network } from "lucide-react";

const Arquitectura = () => (
  <WikiPage title="Arquitectura TAMV MD-X4" subtitle="Infraestructura federada y modular">
    <Section title="Vision General">
      <p>
        TAMV MD-X4 se organiza como una red de dominios y guardianias conectadas bajo el{" "}
        <span className="text-primary font-semibold">Codice Maestro</span>, un conjunto de principios tecnicos, eticos y
        simbolicos que unifican diseno, codigo y gobernanza. La arquitectura contempla 11 dominios activos y 48
        nodos federados operando con seguridad Zero-Trust.
      </p>
    </Section>

    <Section title="Dominios del Ecosistema">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <InfoCard icon={Shield} title="ID-NVIDA" description="Identidad soberana verificable" variant="gold" />
        <InfoCard icon={Globe} title="Metaverso MD-X4" description="Gemelos digitales y DreamSpaces XR" variant="cyan" />
        <InfoCard icon={Brain} title="Isabella AI" description="IA contextual y colaborativa" variant="gold" />
        <InfoCard icon={Layers} title="UTAMV" description="Universidad inmersiva" variant="cyan" />
        <InfoCard icon={Network} title="Economia TAMV" description="Intercambio etico y trazable" variant="gold" />
      </div>
    </Section>

    <Section title="CITEMESH: Ciudad-Malla Civilizatoria">
      <p>
        El concepto <span className="text-primary font-semibold">CITEMESH (Ciudad-Malla Civilizatoria)</span> define
        la topologia de TAMV: cada nodo federado opera de forma autonoma pero comparte identidad, estandares
        y protocolos de gobernanza con el resto del ecosistema. Esto permite escalabilidad horizontal sin
        perder coherencia civilizatoria.
      </p>
    </Section>

    <Section title="Stack Tecnologico">
      <div className="flex flex-wrap gap-2 mt-4">
        {["React 18", "TypeScript", "Three.js", "Supabase", "Zustand", "Vite", "Tailwind", "Framer Motion"].map((tech) => (
          <span key={tech} className="px-3 py-1.5 rounded-full bg-muted/30 border border-border/30 text-sm text-foreground">
            {tech}
          </span>
        ))}
      </div>
    </Section>
  </WikiPage>
);

export default Arquitectura;
