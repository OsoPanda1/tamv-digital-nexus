import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Brain, CheckCircle2, Landmark, MapPinned, ShieldCheck, Store, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { createPersistedRdmEngine, saveRdmState } from "@/lib/rdm-digital";
import type { RdmAiAnswer, RdmState } from "@/lib/rdm-digital";

const progressItems = [
  { label: "Identidad + Wallet", value: 85 },
  { label: "Ledger MSR + BookPI", value: 82 },
  { label: "Comercio conectable", value: 78 },
  { label: "IA contextual territorial", value: 80 },
  { label: "Vercel/Supabase ready", value: 76 },
];

export default function TerritorialOS() {
  const engine = useMemo(() => createPersistedRdmEngine(), []);
  const [state, setState] = useState<RdmState>(() => engine.snapshot());
  const [email, setEmail] = useState("anubis@tamv.mx");
  const [rewardAmount, setRewardAmount] = useState(25);
  const [commerceName, setCommerceName] = useState("Café Nodo Cero");
  const [question, setQuestion] = useState("¿Dónde activo comercio con evidencia BookPI y salud territorial?");
  const [aiAnswer, setAiAnswer] = useState<RdmAiAnswer | null>(null);

  const activeUser = state.users[0];
  const activeWallet = activeUser ? state.wallets.find((wallet) => wallet.userId === activeUser.id) : undefined;

  const sync = () => {
    const snapshot = engine.snapshot();
    setState(snapshot);
    saveRdmState(snapshot);
  };

  const register = () => {
    try {
      engine.registerUser({ email, role: "operator" });
      sync();
      toast.success("Identidad creada con wallet MSR operativa");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo registrar");
    }
  };

  const reward = () => {
    if (!activeUser) {
      toast.error("Registra una identidad primero");
      return;
    }
    try {
      const result = engine.reward({ userId: activeUser.id, amount: rewardAmount, reason: "territorial_validation" });
      sync();
      toast.success(`Recompensa registrada: ${result.evidenceHash}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo recompensar");
    }
  };

  const createCommerce = () => {
    try {
      engine.createCommerce({ name: commerceName, category: "territorial", ownerUserId: activeUser?.id });
      engine.createPaymentIntent({ amount: 199, provider: "sandbox" });
      sync();
      toast.success("Comercio y pago sandbox creados");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo crear comercio");
    }
  };

  const ask = () => {
    try {
      const answer = engine.askAI(question);
      setAiAnswer(answer);
      toast.success("IA territorial respondió con contexto operativo");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo consultar IA");
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Badge className="bg-primary/20 text-primary border-primary/30">RDM Digital · Sistema Operativo Territorial</Badge>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Infraestructura territorial funcional, auditable y Vercel-ready
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Núcleo operativo integrado: identidad, wallet MSR, comercio, pagos sandbox, IA contextual,
                lugares territoriales y evidencia BookPI sin romper el canon TAMV.
              </p>
            </div>
            <Card className="glass-panel border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-400" /> Avance funcional demostrable</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {progressItems.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex justify-between text-sm"><span>{item.label}</span><span>{item.value}%</span></div>
                    <Progress value={item.value} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="glass-panel">
            <CardHeader><CardTitle className="flex items-center gap-2"><Landmark className="h-5 w-5 text-primary" /> Identidad</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="correo@dominio.mx" />
              <Button onClick={register} className="w-full bg-quantum-gradient">Crear identidad + wallet</Button>
              {activeUser && <p className="text-sm text-muted-foreground">Activo: {activeUser.email}</p>}
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader><CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5 text-emerald-400" /> Economía MSR</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Input type="number" value={rewardAmount} onChange={(event) => setRewardAmount(Number(event.target.value))} />
              <Button onClick={reward} className="w-full">Recompensar acción</Button>
              <p className="text-sm text-muted-foreground">Balance: <span className="text-emerald-400 font-bold">{activeWallet?.balance ?? 0} MSR</span></p>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader><CardTitle className="flex items-center gap-2"><Store className="h-5 w-5 text-amber-400" /> Comercio + pagos</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Input value={commerceName} onChange={(event) => setCommerceName(event.target.value)} />
              <Button onClick={createCommerce} className="w-full">Crear comercio + pago sandbox</Button>
              <p className="text-sm text-muted-foreground">Comercios: {state.commerces.length} · Pagos: {state.paymentIntents.length}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="glass-panel">
            <CardHeader><CardTitle className="flex items-center gap-2"><MapPinned className="h-5 w-5 text-secondary" /> Lugares territoriales</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {state.places.map((place) => (
                <div key={place.id} className="rounded-lg border border-border/40 bg-background/40 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{place.name}</p>
                    <Badge variant="outline">{place.type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{place.lat}, {place.lng} · {place.tags.join(" · ")}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-panel border-secondary/20">
            <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-secondary" /> IA contextual</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Textarea value={question} onChange={(event) => setQuestion(event.target.value)} rows={4} />
              <Button onClick={ask} className="bg-secondary text-secondary-foreground">Consultar IA territorial</Button>
              {aiAnswer && (
                <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-4 space-y-2">
                  <p>{aiAnswer.response}</p>
                  <p className="text-sm text-muted-foreground flex gap-2"><ShieldCheck className="h-4 w-4" /> {aiAnswer.governanceNote}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
