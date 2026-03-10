import { WikiPage } from "@/components/WikiPage";
import { Section, InfoBox } from "@/components/WikiElements";
import { BookOpen, Layers, Cpu, Heart, Globe, Target, FileText } from "lucide-react";

const WikiTAMV = () => (
  <WikiPage title="WikiTAMV" subtitle="Documento maestro de integracion del ecosistema">
    <p className="text-lg text-muted-foreground">
      Este documento integra y estructura de manera coherente todos los componentes del proyecto TAMV:
      reportaje institucional, marco estrategico, introduccion cinematografica, logica operativa,
      script tecnico de ingenieria avanzada, arquitectura audiovisual digital, dimension humana
      y proyeccion nacional e internacional.
    </p>

    {/* Seccion 1: Naturaleza del Proyecto */}
    <Section title="Naturaleza del Proyecto" icon={Layers}>
      <p className="font-semibold text-foreground mb-4">Definicion Estructural</p>
      <p>
        TAMV Online Network es una iniciativa independiente orientada a la construccion de:
      </p>

      <ul className="space-y-2 mt-4">
        {[
          "Infraestructura digital soberana",
          "Arquitectura tecnologica modular",
          "Ecosistema colaborativo",
          "Sistema de documentacion estructural",
          "Red de conocimiento estrategico",
        ].map((item) => (
          <li key={item} className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>

      <InfoBox type="info">
        No se presenta como startup tradicional ni como plataforma comercial masiva, sino como
        proyecto arquitectonico de largo plazo con identidad propia.
      </InfoBox>
    </Section>

    {/* Seccion 2: Posicionamiento Estrategico */}
    <Section title="Posicionamiento Estrategico" icon={Target}>
      <p className="font-semibold text-foreground mb-2">Contexto</p>
      <p>
        En un entorno donde la inteligencia artificial redefine economias, la soberania tecnologica
        es un eje geopolitico, y las grandes corporaciones concentran infraestructura digital,
        TAMV propone una alternativa independiente.
      </p>

      <p className="font-semibold text-foreground mt-6 mb-2">Diferenciacion</p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Aspecto</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Corporativo Tradicional</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">TAMV</th>
            </tr>
          </thead>
          <tbody>
            {[
              { aspect: "Financiamiento", corp: "Fondos y capital privado", tamv: "Independiente" },
              { aspect: "Gobernanza", corp: "Centralizada", tamv: "Conceptualmente abierta" },
              { aspect: "Identidad", corp: "Comercial", tamv: "Civilizatoria" },
              { aspect: "Narrativa", corp: "Producto", tamv: "Infraestructura" },
            ].map((row) => (
              <tr key={row.aspect} className="border-b border-border/20">
                <td className="py-3 px-4 text-foreground font-medium">{row.aspect}</td>
                <td className="py-3 px-4 text-muted-foreground">{row.corp}</td>
                <td className="py-3 px-4 text-primary">{row.tamv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
          <p className="font-semibold text-green-400 mb-2">Fortalezas</p>
          {["Vision coherente", "Arquitectura conceptual clara", "Independencia estrategica", "Capacidad de adaptacion", "Identidad narrativa fuerte"].map((item) => (
            <p key={item} className="text-sm text-muted-foreground">+ {item}</p>
          ))}
        </div>

        <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
          <p className="font-semibold text-yellow-400 mb-2">Limitaciones Reales</p>
          {["Falta de padrinazgo empresarial", "Recursos financieros limitados", "Ausencia de validacion institucional formal", "Crecimiento organico"].map((item) => (
            <p key={item} className="text-sm text-muted-foreground">- {item}</p>
          ))}
        </div>
      </div>
    </Section>

    {/* Seccion 3: WikiTAMV */}
    <Section title="Sistema Documental WikiTAMV" icon={FileText}>
      <p>
        WikiTAMV es el sistema documental oficial del ecosistema TAMV.
        Funciona como bitacora estructural, registro historico, documento de legitimacion y archivo tecnico evolutivo.
      </p>

      <p className="font-semibold text-foreground mt-6 mb-4">Capas Operativas</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { num: "01", title: "Identidad y filosofia" },
          { num: "02", title: "Documentacion tecnica" },
          { num: "03", title: "Infraestructura conceptual" },
          { num: "04", title: "Proyeccion estrategica" },
          { num: "05", title: "Ecosistema comunitario" },
        ].map((capa) => (
          <div key={capa.num} className="p-3 rounded-lg bg-muted/20 border border-border/20 text-center">
            <span className="text-2xl font-bold text-primary">{capa.num}</span>
            <p className="text-sm text-muted-foreground mt-1">{capa.title}</p>
          </div>
        ))}
      </div>
    </Section>

    {/* Seccion 4: Introduccion Cinematografica */}
    <Section title="Introduccion Cinematografica" icon={Globe}>
      <p className="text-primary font-semibold">Objetivo: No informar. Posicionar. No describir. Establecer magnitud.</p>

      <p className="font-semibold text-foreground mt-6 mb-4">Estructura Narrativa — Seis Fases</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { phase: "Fase 1", name: "Vacio", desc: "Autoridad" },
          { phase: "Fase 2", name: "Origen", desc: "Humanizacion" },
          { phase: "Fase 3", name: "Infraestructura", desc: "Escala" },
          { phase: "Fase 4", name: "Inscripcion historica", desc: "Permanencia" },
          { phase: "Fase 5", name: "Dedicatoria", desc: "Anclaje emocional" },
          { phase: "Fase 6", name: "Expansion global", desc: "Proyeccion" },
        ].map((fase) => (
          <div key={fase.phase} className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 text-center">
            <span className="text-xs text-primary/70">{fase.phase}</span>
            <p className="font-semibold text-foreground">{fase.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{fase.desc}</p>
          </div>
        ))}
      </div>

      <p className="font-semibold text-foreground mt-6 mb-2">Arquitectura Psicologica</p>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {["Misterio", "Origen", "Construccion", "Consolidacion", "Humanizacion", "Escalamiento"].map((step, idx, arr) => (
          <span key={step} className="flex items-center gap-2">
            <span className="text-primary">{step}</span>
            {idx < arr.length - 1 && <span className="text-muted-foreground">→</span>}
          </span>
        ))}
      </div>
    </Section>

    {/* Seccion 5: Script Tecnico */}
    <Section title="Script Tecnico de Ingenieria" icon={Cpu}>
      <p>La introduccion no es animacion decorativa. Es sistema deterministico.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="p-4 rounded-lg bg-muted/20 border border-border/20">
          <p className="font-semibold text-foreground mb-3">Maquina de Estados</p>
          <div className="font-mono text-sm space-y-1 text-muted-foreground">
            <p>S0: Idle</p>
            <p>S1: Activation</p>
            <p>S2: Origin_Render</p>
            <p>S3: Infrastructure_Projection</p>
            <p>S4: Dedication_Anchor</p>
            <p>S5: Global_Expansion</p>
            <p>S6: Transition_To_Core</p>
          </div>
          <p className="text-xs text-primary mt-3">Flujo: S0 → S1 → S2 → S3 → S4 → S5 → S6</p>
        </div>

        <div className="p-4 rounded-lg bg-muted/20 border border-border/20">
          <p className="font-semibold text-foreground mb-3">Motor Visual</p>
          <ul className="space-y-2">
            {["WebGL / Three.js", "Grafo dinamico tipo force-directed", "Sistema de particulas", "Shaders personalizados", "Render 60 FPS"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>

    {/* Conclusion */}
    <Section title="Sintesis Final" icon={Heart}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
          <p className="font-semibold text-red-400 mb-2">TAMV NO es:</p>
          {["Producto aislado", "Campana narrativa", "Propuesta especulativa"].map((item) => (
            <p key={item} className="text-sm text-muted-foreground">X {item}</p>
          ))}
        </div>

        <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
          <p className="font-semibold text-green-400 mb-2">TAMV ES:</p>
          {["Proyecto estructural independiente", "Sistema documental vivo", "Arquitectura conceptual soberana", "Intento de construccion civilizatoria desde periferia tecnologica"].map((item) => (
            <p key={item} className="text-sm text-muted-foreground">✓ {item}</p>
          ))}
        </div>
      </div>

      <InfoBox type="success" title="Conclusion">
        La WikiTAMV representa el nucleo de legitimacion del proyecto.
        No como espectaculo. No como marketing. Sino como archivo estructural en evolucion.
      </InfoBox>
    </Section>
  </WikiPage>
);

export default WikiTAMV;
