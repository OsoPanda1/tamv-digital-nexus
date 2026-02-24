import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { QuantumCanvas } from '@/components/QuantumCanvas';
import { PIConsentForm } from '@/components/onboarding/PIConsentForm';

const Onboarding = () => {
  const navigate = useNavigate();

  // Si más adelante quieres redirigir tras consentimiento,
  // hazlo desde dentro de PIConsentForm con navigate('/hub').

  useEffect(() => {
    // Aquí podrías hacer checks simples (ej: token en localStorage)
    // por ahora no redirige automáticamente.
  }, []);

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
