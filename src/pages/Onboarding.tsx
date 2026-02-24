'use client'; // Si Next.js App Router
import { lazy, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // o react-router
import { useOnboardingStore } from '@/stores/onboarding'; // Zustand store
import Navigation from '@/components/Navigation';
import { PIConsentForm } from '@/components/onboarding/PIConsentForm';
import { QuantumCanvas } from '@/components/QuantumCanvas';

const Onboarding = () => {
  const router = useRouter();
  const { isCompleted, step, completeStep } = useOnboardingStore();
  const canvas = lazy(() => import('@/components/QuantumCanvas'));

  useEffect(() => {
    if (isCompleted) router.push('/dashboard');
  }, [isCompleted]);

  return (
    <div className="min-h-screen bg-background/90 backdrop-blur-sm relative overflow-hidden">
      <Suspense fallback={<div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 animate-pulse" />}>
        <QuantumCanvas />
      </Suspense>
      <Navigation />
      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-20 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-500 bg-clip-text text-transparent mb-6">
            Bienvenido a TAMV
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Consiente como PI para acceder al ecosistema cuántico-federado. Paso {step}/3.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <PIConsentForm onComplete={() => completeStep()} />
          <div className="hidden md:block space-y-6">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-emerald-400">
                <Shield className="h-4 w-4" /> Seguridad MSR post-cuántica
              </li>
              <li className="flex items-center gap-2 text-cyan-400">
                <Brain className="h-4 w-4" /> Isabella AI integrada
              </li>
            </ul>
            <Button variant="outline" onClick={() => router.push('/privacy')} className="w-full">
              Ver Política
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
