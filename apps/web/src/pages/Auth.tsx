import Navigation from '@/components/Navigation';
import { QuantumCanvas } from '@/components/QuantumCanvas';
import { AuthForm } from '@/components/auth/AuthForm';

const Auth = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <QuantumCanvas />
      <Navigation />
      <div className="relative z-10 container mx-auto px-4 py-20">
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
