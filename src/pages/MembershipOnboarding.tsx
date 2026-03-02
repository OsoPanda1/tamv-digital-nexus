// ============================================================================
// TAMV Membership & BCI Onboarding Flow
// Complete onboarding with plan selection, wallet creation, and BCI integration
// ============================================================================

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import ParticleField from "@/components/ParticleField";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import {
  Brain,
  Wallet,
  Sparkles,
  Crown,
  Gem,
  Shield,
  Zap,
  Eye,
  Heart,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  User,
  Mail,
  Lock,
} from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  icon: React.ElementType;
  color: string;
}

const plans: Plan[] = [
  {
    id: "citizen",
    name: "Ciudadano",
    price: 0,
    period: "gratis",
    features: [
      "Acceso básico al metaverso",
      "Feed social público",
      "Perfil público",
      "10 TCEP/día",
    ],
    icon: User,
    color: "from-blue-500 to-cyan-400",
  },
  {
    id: "creator",
    name: "Creador",
    price: 9.99,
    period: "mes",
    features: [
      "Todo de Ciudadano",
      "Creador de contenido",
      "Canal privado",
      "100 TCEP/día",
      "Badges exclusivos",
    ],
    icon: Sparkles,
    color: "from-purple-500 to-pink-400",
  },
  {
    id: "guardian",
    name: "Guardián",
    price: 29.99,
    period: "mes",
    features: [
      "Todo de Creador",
      "Acceso aHorus/Anubis",
      "优先 Soporte",
      "500 TCEP/día",
      "NFTs exclusivos",
    ],
    icon: Shield,
    color: "from-amber-500 to-orange-400",
  },
  {
    id: "founder",
    name: "Fundador",
    price: 99.99,
    period: "mes",
    features: [
      "Todo de Guardián",
      "Acceso DAO completo",
      "Staking premium",
      "2000 TCEP/día",
      "Invitaciones VIP",
    ],
    icon: Crown,
    color: "from-red-500 to-purple-400",
  },
];

type Step = "welcome" | "plan" | "wallet" | "bci" | "complete";

const MembershipOnboarding = () => {
  const { user, signUp } = useAuth();
  const { wallet, claimDailyReward, loading: walletLoading } = useWallet();
  const [step, setStep] = useState<Step>("welcome");
  const [selectedPlan, setSelectedPlan] = useState<string>("citizen");
  const [progress, setProgress] = useState(0);
  
  // Auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // BCI state
  const [bciConnected, setBciConnected] = useState(false);
  const [emotionalProfile, setEmotionalProfile] = useState<{
    joy: number;
    sadness: number;
    power: number;
    doubt: number;
  }>({ joy: 50, sadness: 50, power: 50, doubt: 50 });

  const handleNext = () => {
    const steps: Step[] = ["welcome", "plan", "wallet", "bci", "complete"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
      setProgress(((currentIndex + 1) / (steps.length - 1)) * 100);
    }
  };

  const handleBack = () => {
    const steps: Step[] = ["welcome", "plan", "wallet", "bci", "complete"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
      setProgress(((currentIndex - 1) / (steps.length - 1)) * 100);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !displayName) return;
    setIsLoading(true);
    try {
      await signUp(email, password, { display_name: displayName });
      handleNext();
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimWallet = async () => {
    if (!wallet) {
      await claimDailyReward();
    }
    handleNext();
  };

  const handleBCIConnect = () => {
    // Simulate BCI connection
    setBciConnected(true);
    handleNext();
  };

  const renderWelcome = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-2xl animate-pulse">
          <Brain className="w-12 h-12 text-white" />
        </div>
      </div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Bienvenido a TAMV
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Únete al ecosistema civilizatorio digital más avanzado de México. 
        Experimenta la convergedle IA, blockchain y realidad extendida.
      </p>
      <div className="flex gap-4 justify-center pt-4">
        {user ? (
          <Button onClick={handleNext} size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-500">
            Continuar <ChevronRight className="ml-2" />
          </Button>
        ) : (
          <Button onClick={handleNext} size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-500">
            Crear Cuenta <ChevronRight className="ml-2" />
          </Button>
        )}
      </div>
    </div>
  );

  const renderPlanSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Elige tu Membresía</h2>
        <p className="text-muted-foreground">
          Cada plan incluye acceso completo al metaverso y recompensas TCEP
        </p>
      </div>
      
      <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <Label key={plan.id} className="cursor-pointer">
              <RadioGroupItem value={plan.id} className="peer sr-only" />
              <Card className={`p-6 transition-all hover:shadow-xl ${
                selectedPlan === plan.id 
                  ? "border-cyan-500 shadow-lg shadow-cyan-500/20" 
                  : "border-border"
              }`}>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-2xl font-bold text-cyan-400 mb-4">
                  {plan.price === 0 ? "Gratis" : `$${plan.price}`}
                  {plan.price > 0 && <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>}
                </p>
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            </Label>
          );
        })}
      </RadioGroup>
    </div>
  );

  const renderWallet = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center">
            <Wallet className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-2">Tu Wallet Digital</h2>
        <p className="text-muted-foreground">
          Recibe recompensas diarias en TCEP y TAU por tu actividad en el metaverso
        </p>
      </div>

      {user ? (
        <Card className="p-6 bg-gradient-to-br from-green-900/30 to-cyan-900/30">
          {wallet ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Balance TCEP</span>
                <span className="text-2xl font-bold text-green-400">{wallet.balance_tcep}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Balance TAU</span>
                <span className="text-2xl font-bold text-cyan-400">{wallet.balance_tau}</span>
              </div>
              <Button onClick={handleNext} className="w-full mt-4">
                Continuar <ChevronRight className="ml-2" />
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                ¿Listo para reclamar tu recompensa diaria?
              </p>
              <Button 
                onClick={handleClaimWallet} 
                disabled={walletLoading}
                className="w-full bg-gradient-to-r from-green-500 to-cyan-500"
              >
                {walletLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                Reclamar 10 TCEP
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input 
              type="email" 
              placeholder="tu@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Nombre de usuario</Label>
            <Input 
              placeholder="Ciudadano TAMV" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Contraseña</Label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleSignUp} 
            disabled={isLoading || !email || !password || !displayName}
            className="w-full"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Crear wallet
          </Button>
        </Card>
      )}
    </div>
  );

  const renderBCI = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${bciConnected ? "from-green-400 to-cyan-500" : "from-purple-400 to-pink-500"} flex items-center justify-center`}>
            {bciConnected ? (
              <Check className="w-10 h-10 text-white" />
            ) : (
              <Brain className="w-10 h-10 text-white" />
            )}
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-2">
          {bciConnected ? "BCI Conectado" : "Conecta tu Perfil Emocional"}
        </h2>
        <p className="text-muted-foreground">
          El sistema BCI-IA analiza tus estados emocionales para personalizar tu experiencia
        </p>
      </div>

      {bciConnected ? (
        <Card className="p-6">
          <h3 className="font-bold mb-4">Tu Perfil Emocional</h3>
          <div className="space-y-4">
            {Object.entries(emotionalProfile).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{key}</span>
                  <span>{value}%</span>
                </div>
                <Progress value={value} />
              </div>
            ))}
          </div>
          <Button onClick={handleNext} className="w-full mt-6">
            Continuar <ChevronRight className="ml-2" />
          </Button>
        </Card>
      ) : (
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-4 p-4 bg-purple-900/20 rounded-lg">
            <Brain className="w-8 h-8 text-purple-400" />
            <div>
              <h4 className="font-bold">Sistema BCI-IA</h4>
              <p className="text-sm text-muted-foreground">
                Detecta y responde a tus estados emocionales
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              <span className="text-sm">Análisis emocional</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              <span className="text-sm">Adaptación visual</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">Respuesta háptica</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm">Privacidad total</span>
            </div>
          </div>

          <Button 
            onClick={handleBCIConnect} 
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
          >
            <Brain className="w-4 h-4 mr-2" />
            Conectar BCI
          </Button>
        </Card>
      )}
    </div>
  );

  const renderComplete = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center shadow-2xl animate-pulse">
          <Check className="w-12 h-12 text-white" />
        </div>
      </div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
        ¡Bienvenido a TAMV!
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Tu cuenta ha sido creada. Ahora puedes explorar el metaverso, 
        conectar con otros ciudadanos y comenzar a ganar recompensas.
      </p>
      <div className="flex gap-4 justify-center pt-4">
        <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-500">
          <a href="/dashboard">Ir al Dashboard</a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="/community">Explorar Comunidad</a>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <ParticleField />
      <Navigation />

      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Bienvenida</span>
            <span>Plan</span>
            <span>Wallet</span>
            <span>BCI</span>
            <span>Completo</span>
          </div>
        </div>

        {/* Content Card */}
        <Card className="max-w-4xl mx-auto p-8 glass-panel">
          {step === "welcome" && renderWelcome()}
          {step === "plan" && renderPlanSelection()}
          {step === "wallet" && renderWallet()}
          {step === "bci" && renderBCI()}
          {step === "complete" && renderComplete()}
        </Card>

        {/* Navigation Buttons */}
        {step !== "welcome" && step !== "complete" && (
          <div className="flex justify-between max-w-2xl mx-auto mt-8">
            <Button variant="outline" onClick={handleBack}>
              <ChevronLeft className="mr-2" /> Atrás
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MembershipOnboarding;
