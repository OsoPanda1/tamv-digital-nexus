import Navigation from '@/components/Navigation';
import { QuantumCanvas } from '@/components/QuantumCanvas';
import { BookPIPanel } from '@/components/panels/BookPIPanel';

const BookPI = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <QuantumCanvas />
      <Navigation />
      <BookPIPanel />
    </div>
  );
};

export default BookPI;