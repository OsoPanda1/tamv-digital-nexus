import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Coins, 
  TrendingUp, 
  CreditCard, 
  Users, 
  Crown,
  Sparkles,
  Building2,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

interface MembershipTier {
  name: string;
  tier: string;
  price: number;
  features: string[];
  icon: any;
  color: string;
}

const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    name: 'Free',
    tier: 'free',
    price: 0,
    features: ['Acceso básico', 'Isabella AI limitado', '1 DreamSpace', 'BookPI básico'],
    icon: Shield,
    color: 'from-gray-500 to-gray-600'
  },
  {
    name: 'Pro',
    tier: 'pro',
    price: 99,
    features: ['Todo Free +', 'Isabella AI completo', '5 DreamSpaces', 'Analytics avanzado', 'Soporte prioritario'],
    icon: Sparkles,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Gold',
    tier: 'gold',
    price: 299,
    features: ['Todo Pro +', 'DreamSpaces ilimitados', 'API access', 'Mentorías 1-1', 'Certificación Gold'],
    icon: Crown,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    name: 'Gold 18+',
    tier: 'gold_18',
    price: 399,
    features: ['Todo Gold +', 'Contenido exclusivo 18+', 'Verificación KYC', 'Compliance legal'],
    icon: Crown,
    color: 'from-red-500 to-pink-500'
  },
  {
    name: 'Celestial',
    tier: 'celestial',
    price: 999,
    features: ['Todo Gold 18+ +', 'Acceso VIP', 'Eventos exclusivos', 'NFT airdrop', 'Quantum privileges'],
    icon: Sparkles,
    color: 'from-purple-500 to-indigo-600'
  },
  {
    name: 'Enterprise',
    tier: 'enterprise',
    price: 2999,
    features: ['Solución corporativa', 'API ilimitado', 'SLA garantizado', 'Soporte 24/7', 'Custom branding'],
    icon: Building2,
    color: 'from-emerald-500 to-teal-600'
  },
];

export const MonetizationPanel = () => {
  const [currentTier, setCurrentTier] = useState<string>('free');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    transactionCount: 0,
    commissionEarned: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadMembershipData();
    loadTransactions();
  }, []);

  const loadMembershipData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('memberships')
      .select('tier')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setCurrentTier(data.tier);
    }
  };

  const loadTransactions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setTransactions(data);
      
      // Calculate stats - 85-95% creator share target
      const total = data.reduce((sum, t) => sum + Number(t.amount), 0);
      const creatorShare = total * 0.90;
      
      setStats({
        totalRevenue: total,
        monthlyRevenue: total * 0.7, // Mock monthly
        transactionCount: data.length,
        commissionEarned: commission
      });
    }
  };

  const handleUpgrade = async (tier: string, price: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes iniciar sesión para actualizar tu membresía",
      });
      return;
    }

    try {
      // Update membership
      await supabase
        .from('memberships')
        .upsert({
          user_id: user.id,
          tier: tier,
          started_at: new Date().toISOString(),
        });

      // Create transaction
      await supabase.from('transactions').insert({
        user_id: user.id,
        transaction_type: 'subscription',
        amount: price,
        currency: 'MXN',
        commission_rate: 8.00,
        commission_amount: price * 0.08,
        status: 'completed',
      });

      // Log to BookPI
      await supabase.rpc('create_bookpi_event', {
        p_event_type: 'subscription',
        p_resource_type: 'membership',
        p_resource_id: user.id,
        p_payload: { tier, price }
      });

      toast({
        title: "¡Membresía Actualizada! 🎉",
        description: `Ahora eres miembro ${tier}`,
      });

      setCurrentTier(tier);
      loadTransactions();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <Coins className="w-16 h-16 mx-auto text-primary" />
        <h1 className="text-3xl font-bold">Economía TAMV</h1>
        <p className="text-muted-foreground">
          Monetización justa · Comisiones transparentes · +20 formas de ganar
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ingresos Totales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)} MXN</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Este Mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toFixed(2)} MXN</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Transacciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.transactionCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Comisiones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.commissionEarned.toFixed(2)} MXN</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="memberships" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="memberships">Membresías</TabsTrigger>
          <TabsTrigger value="transactions">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="memberships" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MEMBERSHIP_TIERS.map((membership, index) => {
              const Icon = membership.icon;
              const isCurrent = currentTier === membership.tier;
              
              return (
                <motion.div
                  key={membership.tier}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`relative overflow-hidden ${isCurrent ? 'ring-2 ring-primary' : ''}`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${membership.color} opacity-10`} />
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Icon className="w-8 h-8" />
                        {isCurrent && <Badge>Actual</Badge>}
                      </div>
                      <CardTitle>{membership.name}</CardTitle>
                      <CardDescription>
                        <span className="text-3xl font-bold">${membership.price}</span>
                        <span className="text-muted-foreground"> MXN/mes</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2 text-sm">
                        {membership.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full"
                        variant={isCurrent ? "outline" : "default"}
                        disabled={isCurrent}
                        onClick={() => handleUpgrade(membership.tier, membership.price)}
                      >
                        {isCurrent ? 'Plan Actual' : 'Actualizar'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Transacciones</CardTitle>
              <CardDescription>Todas tus transacciones con comisiones transparentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {transactions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No hay transacciones aún
                  </p>
                ) : (
                  transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{tx.transaction_type}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${parseFloat(tx.amount).toFixed(2)} {tx.currency}</p>
                        <p className="text-xs text-muted-foreground">
                          Comisión: ${parseFloat(tx.commission_amount || 0).toFixed(2)} ({tx.commission_rate}%)
                        </p>
                      </div>
                      <Badge variant={tx.status === 'completed' ? 'default' : 'secondary'}>
                        {tx.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
