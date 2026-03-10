import { WikiPage } from "@/components/WikiPage";
import { Section } from "@/components/WikiElements";
import { Users, Code, Building, Globe } from "lucide-react";

const Introduccion = () => (
  <WikiPage title="Introduccion al Ecosistema TAMV" subtitle="Vision general del primer CITEMESH civilizatorio">
    <Section title="Que es TAMV MD-X4">
      <p>
        TAMV MD-X4 es un ecosistema civilizatorio digital nacido en Mexico
        que integra identidad soberana, educacion inmersiva, metaverso, economia etica y seguridad avanzada en una sola
        infraestructura auditable. Se plantea como el primer CITEMESH: un metaverso
        civilizatorio disenado para servir a las personas y no a la publicidad ni a la vigilancia masiva.
      </p>
    </Section>

    <Section title="Segmentos Objetivo">
      <p>
        TAMV esta disenado como plantilla replicable para multiples segmentos. Cada uno accede al ecosistema
        segun su nivel de membresia (ver Economia TAMV para detalles completos).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {[
          { icon: Users, segment: "Ciudadanos y estudiantes", desc: "Acceso libre (Free) para explorar la wiki, usar Isabella AI y aprender sobre soberania digital." },
          { icon: Code, segment: "Desarrolladores y labs", desc: "Nivel Devs con sandbox tecnico, Kit de APIs completo y documentacion avanzada para construir sobre TAMV." },
          { icon: Building, segment: "Instituciones y universidades", desc: "Nivel Advance con monitoreo avanzado, configuracion de nodos y soporte prioritario para pilotos institucionales." },
          { icon: Globe, segment: "Gobiernos y grandes empresas", desc: "Nivel Enterprise con despliegues federados llave en mano, SLA dedicado y gobernanza compartida." },
        ].map((s) => (
          <div key={s.segment} className="glass-panel rounded-xl p-5 border border-border/30">
            <div className="flex items-center gap-3 mb-3">
              <s.icon className="w-6 h-6 text-primary" />
              <span className="font-semibold text-foreground">{s.segment}</span>
            </div>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Origen y Contexto">
      <p>
        TAMV no nace en un laboratorio corporativo, sino desde la experiencia personal de su fundador
        (<span className="text-primary font-semibold">Anubis Villasenor / Edwin Oswaldo Castillo Trejo</span>) tras miles
        de horas de autoestudio, rechazo laboral y frustracion con la educacion tecnologica superficial.
      </p>
      <p>
        Entre 2020 y 2026 se documentan mas de <span className="text-primary font-semibold">21,000 horas de trabajo</span>
        dedicadas a conceptualizar, disenar, programar y narrar el ecosistema, sosteniendolo practicamente como
        "proyecto de un solo ser humano".
      </p>
    </Section>

    <Section title="Proposito Civilizatorio">
      <p>
        El objetivo de TAMV es encender una infraestructura digital que permita a personas, organizaciones y ciudades
        construir futuro con dignidad, transparencia y control ciudadano sobre los datos. Mas que ser "otra red social",
        busca operar como un <span className="text-primary font-semibold">sistema operativo civilizatorio latinoamericano</span>,
        documentado publicamente y disenado como obra digital ligada a la evolucion de la region.
      </p>
    </Section>

    <Section title="Stack Tecnologico">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Capa</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tecnologias</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/20">
              <td className="py-3 px-4 text-foreground font-medium">Frontend</td>
              <td className="py-3 px-4 text-muted-foreground">React 18, TypeScript, Vite, Tailwind CSS, Framer Motion</td>
            </tr>
            <tr className="border-b border-border/20">
              <td className="py-3 px-4 text-foreground font-medium">3D/XR</td>
              <td className="py-3 px-4 text-muted-foreground">Three.js, React Three Fiber, Drei</td>
            </tr>
            <tr className="border-b border-border/20">
              <td className="py-3 px-4 text-foreground font-medium">Backend</td>
              <td className="py-3 px-4 text-muted-foreground">Supabase (PostgreSQL, Auth, Edge Functions, Storage)</td>
            </tr>
            <tr className="border-b border-border/20">
              <td className="py-3 px-4 text-foreground font-medium">Alineacion</td>
              <td className="py-3 px-4 text-muted-foreground">Web 4.0/5.0, AI Act, GDPR, ISO, NOM</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Section>
  </WikiPage>
);

export default Introduccion;
