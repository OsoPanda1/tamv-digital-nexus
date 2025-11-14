import Navigation from '@/components/Navigation';
import { QuantumCanvas } from '@/components/QuantumCanvas';
import { PIConsentForm } from '@/components/onboarding/PIConsentForm';

const Onboarding = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <QuantumCanvas />
      <Navigation />
      <div className="relative z-10 container mx-auto">
        <PIConsentForm />
      </div>
    </div>
  );
};

export default Onboarding;
