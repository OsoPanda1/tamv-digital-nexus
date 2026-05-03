import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { HolographicPanel, HolographicButton } from '@/components/HolographicUI';
import { Coins, Zap, Crown, Rocket, Shield, Star } from 'lucide-react';

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  bonusCredits: number;
  priceUsd: number;
  priceId: string;
  icon: React.ReactNode;
  popular?: boolean;
  color: string;
}

export const TAU_PACKAGES: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 100,
    bonusCredits: 0,
    priceUsd: 4.99,
    priceId: 'price_starter',
    icon: <Coins className="w-8 h-8" />,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    credits: 500,
    bonusCredits: 75,
    priceUsd: 19.99,
    priceId: 'price_popular',
    icon: <Zap className="w-8 h-8" />,
    popular: true,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    credits: 1500,
    bonusCredits: 300,
    priceUsd: 49.99,
    priceId: 'price_pro',
    icon: <Crown className="w-8 h-8" />,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'elite',
    name: 'Elite Pack',
    credits: 5000,
    bonusCredits: 1500,
    priceUsd: 149.99,
    priceId: 'price_elite',
    icon: <Rocket className="w-8 h-8" />,
    color: 'from-red-500 to-pink-500'
  }
];

export function StripeCheckout() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [userCredits, setUserCredits] = useState(0);

  const handlePurchase = async (pkg: CreditPackage) => {
    setIsLoading(pkg.id);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Debes iniciar sesión para comprar créditos TAU');
        setIsLoading(null);
        return;
      }

      // Call edge function to create Stripe checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: pkg.priceId,
          credits: pkg.credits + pkg.bonusCredits,
          packageName: pkg.name,
          userId: user.id
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Error al procesar el pago. Intenta de nuevo.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            💰 Créditos TAU
          </span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Los créditos TAU son la moneda del ecosistema TAMV. Úsalos para DreamSpaces, 
          regalos, marketplace, eventos exclusivos y más.
        </p>
        
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
          <Shield className="w-5 h-5 text-primary" />
          <span className="text-sm">Pagos seguros con Stripe</span>
        </div>
      </div>

      {/* Current Balance */}
      <HolographicPanel className="p-6 max-w-md mx-auto text-center">
        <p className="text-muted-foreground mb-2">Tu balance actual</p>
        <div className="flex items-center justify-center gap-3">
          <Coins className="w-8 h-8 text-primary" />
          <span className="text-4xl font-bold text-primary">{userCredits.toLocaleString()}</span>
          <span className="text-lg text-muted-foreground">TAU</span>
        </div>
      </HolographicPanel>

      {/* Packages Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TAU_PACKAGES.map((pkg) => (
          <HolographicPanel 
            key={pkg.id} 
            className={`p-6 relative overflow-hidden transition-all duration-300 hover:scale-105 ${
              pkg.popular ? 'ring-2 ring-secondary' : ''
            }`}
          >
            {/* Popular Badge */}
            {pkg.popular && (
              <div className="absolute top-0 right-0 bg-secondary text-secondary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg">
                ⭐ MÁS POPULAR
              </div>
            )}

            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${pkg.color} opacity-10`} />

            <div className="relative z-10">
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center text-white mb-4`}>
                {pkg.icon}
              </div>

              {/* Package Name */}
              <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>

              {/* Credits */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-primary">{pkg.credits.toLocaleString()}</span>
                <span className="text-muted-foreground ml-1">TAU</span>
                
                {pkg.bonusCredits > 0 && (
                  <div className="mt-1 text-sm text-green-400 font-medium">
                    +{pkg.bonusCredits.toLocaleString()} bonus 🎁
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-2xl font-bold">${pkg.priceUsd.toFixed(2)}</span>
                <span className="text-muted-foreground ml-1">USD</span>
              </div>

              {/* Price per credit */}
              <p className="text-xs text-muted-foreground mb-4">
                ${((pkg.priceUsd / (pkg.credits + pkg.bonusCredits)) * 100).toFixed(2)}¢ por TAU
              </p>

              {/* Purchase Button */}
              <HolographicButton
                variant={pkg.popular ? 'primary' : 'secondary'}
                onClick={() => handlePurchase(pkg)}
                disabled={isLoading !== null}
                className="w-full"
              >
                {isLoading === pkg.id ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Procesando...
                  </span>
                ) : (
                  'Comprar Ahora'
                )}
              </HolographicButton>
            </div>
          </HolographicPanel>
        ))}
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="text-center p-6">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-bold mb-2">Pagos Seguros</h4>
          <p className="text-sm text-muted-foreground">
            Procesados por Stripe con encriptación de grado bancario
          </p>
        </div>
        
        <div className="text-center p-6">
          <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-secondary" />
          </div>
          <h4 className="font-bold mb-2">Créditos Instantáneos</h4>
          <p className="text-sm text-muted-foreground">
            Recibe tus TAU inmediatamente después de la compra
          </p>
        </div>
        
        <div className="text-center p-6">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 text-accent" />
          </div>
          <h4 className="font-bold mb-2">Sin Caducidad</h4>
          <p className="text-sm text-muted-foreground">
            Tus créditos TAU nunca expiran
          </p>
        </div>
      </div>
    </div>
  );
}
