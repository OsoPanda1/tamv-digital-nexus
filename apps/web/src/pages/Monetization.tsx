import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { QuantumCanvas } from '@/components/QuantumCanvas';
import { MonetizationPanel } from '@/components/monetization/MonetizationPanel';
import { StripeCheckout } from '@/components/stripe/StripeCheckout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Monetization = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for Stripe redirect
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const credits = searchParams.get('credits');

    if (success === 'true' && credits) {
      toast.success(`¡Compra exitosa! Has recibido ${credits} créditos TAU 🎉`);
    } else if (canceled === 'true') {
      toast.info('Compra cancelada');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background relative">
      <QuantumCanvas />
      <Navigation />
      <div className="relative z-10 container mx-auto pt-32 pb-20 px-6">
        <Tabs defaultValue="credits" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="credits">Comprar Créditos TAU</TabsTrigger>
            <TabsTrigger value="membership">Membresías</TabsTrigger>
          </TabsList>
          
          <TabsContent value="credits">
            <StripeCheckout />
          </TabsContent>
          
          <TabsContent value="membership">
            <MonetizationPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Monetization;
