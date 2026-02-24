import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { QuantumCanvas } from '@/components/QuantumCanvas';
import { PIConsentForm } from '@/components/onboarding/PIConsentForm';
// Si aún no tienes este store, puedes quitarlo y el efecto de redirect
import { useOnboardingStore } from '@/stores/onboarding';

const Onboarding = () => {
  const navigate = useNavigate();
  const onboarding = (() => {
    try {
      // Evita reventar si aún no existe el store
      return useOnboardingStore?.();
    } catch {
      return { isCompleted: false };
    }
  })();

  const isCompleted = onboarding?.isCompleted ?? false;

  useEffect(() => {
    if (isCompleted) {
      navigate('/hub'); // o '/dashboard' según tu routing real
    }
  }, [isCompleted, navigate]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Fondo cuántico */}
      <QuantumCanvas />

      {/* Nav TAMV */}
      <Navigation />

      {/* Contenido principal */}
      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-20 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-500 bg-clip-text text-transparent mb-6">
            Bienvenido a TAMV MD-X4
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Este onboarding es para Investigadores Principales (PI) que liderarán nodos, cursos y
            experiencias dentro del ecosistema civilizatorio TAMV.
          </p>
        </header>

        <main>
          <PIConsentForm />
        </main>
      </div>
    </div>
  );
};

export default Onboarding;
