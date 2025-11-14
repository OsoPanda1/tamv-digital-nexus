import Navigation from '@/components/Navigation';
import { QuantumCanvas } from '@/components/QuantumCanvas';
import { MonetizationPanel } from '@/components/monetization/MonetizationPanel';

const Monetization = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <QuantumCanvas />
      <Navigation />
      <div className="relative z-10 container mx-auto">
        <MonetizationPanel />
      </div>
    </div>
  );
};

export default Monetization;
