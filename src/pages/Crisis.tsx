import Navigation from '@/components/Navigation';
import { QuantumCanvas } from '@/components/QuantumCanvas';
import { CrisisPanel } from '@/components/crisis/CrisisPanel';

const Crisis = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <QuantumCanvas />
      <Navigation />
      <div className="relative z-10 container mx-auto">
        <CrisisPanel />
      </div>
    </div>
  );
};

export default Crisis;
