import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { QuantumCanvas } from '@/components/QuantumCanvas';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, 
  Ticket, Gift, Crown, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

const Economy = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [lotteryDraws, setLotteryDraws] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const [walletRes, txRes] = await Promise.all([
        (supabase as any).from('tcep_wallets').select('*').eq('user_id', user.id).single(),
        (supabase as any).from('tcep_transactions').select('*').or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`).order('created_at', { ascending: false }).limit(20)
      ]);
      setWallet(walletRes.data);
      setTransactions(txRes.data || []);
    }
    const { data: draws } = await (supabase as any).from('lottery_draws').select('*').eq('status', 'open');
    setLotteryDraws(draws || []);
    setLoading(false);
  };

  const commissionTiers = [
    { tier: 'Free', rate: '30%', color: 'text-muted-foreground', desc: 'Acceso básico' },
    { tier: 'Premium', rate: '25%', color: 'text-primary', desc: 'Funciones avanzadas' },
    { tier: 'VIP', rate: '20%', color: 'text-secondary', desc: 'Prioridad total' },
    { tier: 'Elite', rate: '15%', color: 'text-accent', desc: 'Máximo beneficio' },
    { tier: 'Celestial', rate: '10%', color: 'text-primary', desc: 'Tier supremo' },
    { tier: 'Enterprise', rate: '8%', color: 'text-secondary', desc: 'Institucional' },
  ];

  const fenixStats = {
    total_pool: 125000, distributed: 45000, contributors: 1250,
    rule: '20% Creadores / 30% Comunidad / 50% Desarrollo Social'
  };

  return (
    <div className="min-h-screen bg-background">
      <QuantumCanvas />
      <Navigation />
      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
            <h1 className="text-5xl font-bold mb-4 glow-text bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
              💰 Economía Simbiótica · MSR
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              TCEP Credits · Regla 20/30/50 · Lotería Civilizatoria · Fondo Fénix
            </p>
          </motion.div>

          <Tabs defaultValue="wallet" className="space-y-8">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto glass-panel">
              <TabsTrigger value="wallet">Wallet TCEP</TabsTrigger>
              <TabsTrigger value="fenix">Fondo Fénix</TabsTrigger>
              <TabsTrigger value="lottery">Lotería</TabsTrigger>
              <TabsTrigger value="tiers">Membresías</TabsTrigger>
            </TabsList>

            <TabsContent value="wallet">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="glass-panel p-8 lg:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                    <Wallet className="w-8 h-8 text-accent" />
                    <h2 className="text-2xl font-bold">Wallet TCEP</h2>
                  </div>
                  {wallet ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                          <p className="text-sm text-muted-foreground">Balance Disponible</p>
                          <p className="text-3xl font-bold text-accent">{Number(wallet.balance_credits).toLocaleString()} TC</p>
                        </div>
                        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                          <p className="text-sm text-muted-foreground">Balance Bloqueado</p>
                          <p className="text-3xl font-bold text-primary">{Number(wallet.balance_locked).toLocaleString()} TC</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-muted-foreground">Ganado Total</p>
                          <p className="text-lg font-bold text-secondary">+{Number(wallet.lifetime_earned).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Gastado Total</p>
                          <p className="text-lg font-bold text-destructive">-{Number(wallet.lifetime_spent).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Membresía</p>
                          <Badge className="bg-accent/20 text-accent">{wallet.membership_tier}</Badge>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Inicia sesión para ver tu wallet TCEP</p>
                      <Button className="mt-4 bg-quantum-gradient" onClick={() => window.location.href = '/auth'}>Iniciar Sesión</Button>
                    </div>
                  )}
                </Card>

                <Card className="glass-panel p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-secondary" /> Transacciones</h3>
                  {transactions.length > 0 ? (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {transactions.map((tx: any) => (
                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/30">
                          <div className="flex items-center gap-2">
                            {tx.tx_type === 'reward' ? <ArrowDownRight className="w-4 h-4 text-secondary" /> : <ArrowUpRight className="w-4 h-4 text-destructive" />}
                            <div>
                              <p className="text-sm font-medium">{tx.tx_type}</p>
                              <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <span className={`font-bold ${tx.tx_type === 'reward' ? 'text-secondary' : 'text-accent'}`}>
                            {tx.tx_type === 'reward' ? '+' : ''}{Number(tx.amount).toLocaleString()} TC
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Sin transacciones</p>
                  )}
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="fenix">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass-panel p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Gift className="w-8 h-8 text-accent" />
                    <h2 className="text-2xl font-bold">Fondo Fénix</h2>
                  </div>
                  <p className="text-muted-foreground mb-6">Fondo de desarrollo social redistributivo. Cada transacción contribuye automáticamente.</p>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Pool Total</span>
                        <span className="font-bold text-accent">${fenixStats.total_pool.toLocaleString()} MXN</span>
                      </div>
                      <Progress value={100} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Distribuido</span>
                        <span className="font-bold text-secondary">${fenixStats.distributed.toLocaleString()} MXN</span>
                      </div>
                      <Progress value={(fenixStats.distributed / fenixStats.total_pool) * 100} className="h-3" />
                    </div>
                    <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                      <p className="text-sm font-bold mb-1">Contribuyentes: {fenixStats.contributors.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Periodo: 2026-Q1</p>
                    </div>
                  </div>
                </Card>
                <Card className="glass-panel p-8">
                  <h2 className="text-2xl font-bold mb-6">Regla 20/30/50</h2>
                  <div className="space-y-6">
                    {[
                      { pct: 20, label: 'Creadores', desc: 'Ingresos directos para artistas y creadores', color: 'from-primary to-primary-glow' },
                      { pct: 30, label: 'Comunidad', desc: 'Reinversión en la comunidad y gobernanza', color: 'from-secondary to-secondary-glow' },
                      { pct: 50, label: 'Desarrollo Social', desc: 'Educación, dignificación y redistribución ética', color: 'from-accent to-accent-glow' },
                    ].map(item => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold">{item.pct}% — {item.label}</span>
                        </div>
                        <div className={`h-4 rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${item.pct * 2}%` }} />
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="lottery">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass-panel p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Ticket className="w-8 h-8 text-primary" />
                    <h2 className="text-2xl font-bold">Lotería Civilizatoria</h2>
                  </div>
                  <p className="text-muted-foreground mb-6">20,000 oportunidades por $1 USD. Redistribución ética con impacto social.</p>
                  {lotteryDraws.length > 0 ? lotteryDraws.map((draw: any) => (
                    <Card key={draw.id} className="p-4 bg-card/50 border border-primary/20 mb-4">
                      <h3 className="font-bold text-lg">{draw.draw_name}</h3>
                      <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                        <div><span className="text-muted-foreground">Tickets:</span> {draw.tickets_sold}/{draw.max_tickets}</div>
                        <div><span className="text-muted-foreground">Premio:</span> <span className="text-accent font-bold">${Number(draw.prize_pool).toLocaleString()}</span></div>
                        <div><span className="text-muted-foreground">Precio:</span> ${draw.ticket_price_usd} USD</div>
                        <div><Badge className="bg-secondary/20 text-secondary">{draw.status}</Badge></div>
                      </div>
                      <Progress value={(draw.tickets_sold / draw.max_tickets) * 100} className="h-2 mt-3" />
                      <Button className="w-full mt-4 bg-quantum-gradient" onClick={() => toast.info('Compra de tickets próximamente via Stripe')}>
                        <Ticket className="w-4 h-4 mr-2" /> Comprar Tickets
                      </Button>
                    </Card>
                  )) : (
                    <div className="text-center py-8">
                      <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No hay sorteos activos en este momento</p>
                    </div>
                  )}
                </Card>
                <Card className="glass-panel p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Shield className="w-6 h-6 text-secondary" /> Transparencia</h2>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                      <p className="font-bold">🔍 Auditable en BookPI</p>
                      <p className="text-sm text-muted-foreground">Cada sorteo genera un hash inmutable verificable</p>
                    </div>
                    <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                      <p className="font-bold">⚖️ Redistribución Ética</p>
                      <p className="text-sm text-muted-foreground">50% premio · 30% fondo social · 20% operación</p>
                    </div>
                    <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                      <p className="font-bold">🛡️ Verificación Anubis</p>
                      <p className="text-sm text-muted-foreground">Anti-fraude AI supervisa cada participación</p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tiers">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {commissionTiers.map((tier, i) => (
                  <motion.div key={tier.tier} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className="glass-panel p-6 hover:shadow-quantum transition-all duration-300 hover:scale-105 text-center">
                      <Crown className={`w-10 h-10 ${tier.color} mx-auto mb-3`} />
                      <h3 className="text-xl font-bold mb-1">{tier.tier}</h3>
                      <p className={`text-3xl font-bold mb-2 ${tier.color}`}>{tier.rate}</p>
                      <p className="text-sm text-muted-foreground mb-1">comisión</p>
                      <p className="text-xs text-muted-foreground">{tier.desc}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Economy;
