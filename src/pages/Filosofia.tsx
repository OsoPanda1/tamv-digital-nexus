import { WikiPage } from "@/components/WikiPage";
import { Section } from "@/components/WikiElements";

const Filosofia = () => (
  <WikiPage title="Filosofia y Codice" subtitle="Principios eticos y tecnicos del ecosistema TAMV">
    <Section title="Codice Korima">
      <p>
        La arquitectura TAMV se rige por el <span className="text-primary font-semibold">Codice Korima</span>, inspirado
        en la filosofia Raramuri de reciprocidad. Este codice establece que toda tecnologia dentro del ecosistema
        debe servir para fortalecer la dignidad humana, no para extraer valor de las personas.
      </p>
    </Section>

    <Section title="Principios Fundamentales">
      <div className="space-y-4 mt-4">
        {[
          { name: "Soberania digital", desc: "Cada persona es duena de su identidad y datos." },
          { name: "Transparencia radical", desc: "Todo proceso es auditable y documentado publicamente." },
          { name: "Etica integrada", desc: "La etica no es un modulo externo, sino parte del codigo base." },
          { name: "Reciprocidad (Korima)", desc: "El valor generado se redistribuye equitativamente." },
          { name: "Determinismo estructural", desc: "La arquitectura garantiza predictibilidad y trazabilidad." },
        ].map((p) => (
          <div key={p.name} className="flex items-start gap-3 p-4 rounded-lg bg-muted/20 border border-border/20">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
            <div>
              <span className="font-semibold text-foreground">{p.name}</span>
              <span className="text-muted-foreground"> — {p.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Leyes Estructurales">
      <div className="space-y-3 mt-4">
        {[
          { id: "L1", rule: "createRoot solo existe en src/main.tsx" },
          { id: "L2", rule: "BrowserRouter restringido a src/App.tsx" },
          { id: "L3", rule: "Layout.tsx montado exactamente una vez en App.tsx" },
        ].map((l) => (
          <div key={l.id} className="flex gap-4 items-center p-3 bg-muted/10 rounded-lg border border-border/20">
            <span className="px-3 py-1 rounded bg-primary/20 text-primary font-mono text-sm">{l.id}</span>
            <span className="text-muted-foreground">{l.rule}</span>
          </div>
        ))}
      </div>
    </Section>
  </WikiPage>
);

export default Filosofia;
