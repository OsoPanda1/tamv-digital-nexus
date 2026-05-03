import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { QuantumCanvas } from '@/components/QuantumCanvas';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, Crown, Vote, Users, Sparkles, Scale, 
  FileText, TrendingUp, Zap, Eye, Gavel, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Proposal {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  votes_for: number;
  votes_against: number;
  quorum_required: number;
  created_at: string;
  author_id: string;
}

const Governance = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('general');

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    const { data } = await (supabase as any).from('dao_proposals').select('*').order('created_at', { ascending: false }).limit(20);
    setProposals(data || []);
    setLoading(false);
  };

  const createProposal = async () => {
    if (!newTitle.trim() || !newDesc.trim()) return toast.error('Completa título y descripción');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return toast.error('Inicia sesión para crear propuestas');

    const { error } = await (supabase as any).from('dao_proposals').insert({
      author_id: user.id, title: newTitle, description: newDesc,
      category: newCategory, status: 'voting',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });
    if (error) return toast.error(error.message);
    toast.success('¡Propuesta creada exitosamente!');
    setNewTitle(''); setNewDesc(''); setShowCreate(false);
    fetchProposals();
  };

  const castVote = async (proposalId: string, vote: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return toast.error('Inicia sesión para votar');
    const { error } = await (supabase as any).from('dao_votes').insert({
      proposal_id: proposalId, voter_id: user.id, vote
    });
    if (error) return toast.error(error.message.includes('duplicate') ? 'Ya votaste en esta propuesta' : error.message);
    toast.success(vote ? '✅ Voto a favor registrado' : '❌ Voto en contra registrado');
    fetchProposals();
  };

  const powers = [
    { name: 'LOGICAL', desc: 'Acceso de lectura', icon: Eye, color: 'text-blue-400' },
    { name: 'EXECUTIVE', desc: 'Acceso de escritura', icon: Gavel, color: 'text-amber-400' },
    { name: 'OBSERVER', desc: 'Monitoreo', icon: Shield, color: 'text-green-400' },
    { name: 'HUMAN', desc: 'Control total humano', icon: Crown, color: 'text-purple-400' },
  ];

  const roles = [
    { name: 'CITIZEN', powers: ['LOGICAL', 'OBSERVER'], badge: 'bg-blue-500/20 text-blue-300' },
    { name: 'CUSTODIAN', powers: ['LOGICAL', 'EXECUTIVE', 'OBSERVER'], badge: 'bg-amber-500/20 text-amber-300' },
    { name: 'GUARDIAN', powers: ['LOGICAL', 'EXECUTIVE', 'OBSERVER', 'HUMAN'], badge: 'bg-purple-500/20 text-purple-300' },
  ];

  const federations = [
    { name: 'Seguridad', code: 'ANUBIS/HORUS', icon: Shield, color: 'from-red-600 to-red-900' },
    { name: 'Economía', code: 'MSR/TCEP', icon: TrendingUp, color: 'from-amber-600 to-amber-900' },
    { name: 'Técnica', code: 'QUANTUM', icon: Zap, color: 'from-cyan-600 to-cyan-900' },
    { name: 'Educación', code: 'UTAMV', icon: FileText, color: 'from-green-600 to-green-900' },
    { name: 'IA', code: 'ISABELLA', icon: Sparkles, color: 'from-violet-600 to-violet-900' },
    { name: 'Creativa', code: 'DREAMSPACES', icon: Users, color: 'from-pink-600 to-pink-900' },
    { name: 'Gobernanza', code: 'CITEMESH', icon: Scale, color: 'from-indigo-600 to-indigo-900' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <QuantumCanvas />
      <Navigation />
      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
            <h1 className="text-5xl font-bold mb-4 glow-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              ⚖️ CITEMESH · Gobernanza Civilizatoria
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              DAO Híbrida con las 7 Federaciones · Votación ponderada · Veto ético · MSR inmutable
            </p>
          </motion.div>

          <Tabs defaultValue="federations" className="space-y-8">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto glass-panel">
              <TabsTrigger value="federations">Federaciones</TabsTrigger>
              <TabsTrigger value="dao">DAO Propuestas</TabsTrigger>
              <TabsTrigger value="roles">Roles & Poderes</TabsTrigger>
              <TabsTrigger value="identity">ID-NVIDA</TabsTrigger>
            </TabsList>

            <TabsContent value="federations">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {federations.map((fed, i) => {
                  const Icon = fed.icon;
                  return (
                    <motion.div key={fed.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                      <Card className="glass-panel p-6 hover:shadow-quantum transition-all duration-300 hover:scale-105">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${fed.color} flex items-center justify-center mb-4 shadow-lg`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-1">{fed.name}</h3>
                        <p className="text-sm text-muted-foreground font-mono">{fed.code}</p>
                        <Badge className="mt-3 bg-green-500/20 text-green-300">Activa</Badge>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="dao">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold flex items-center gap-2"><Vote className="w-6 h-6 text-primary" /> Propuestas Activas</h2>
                  <Button onClick={() => setShowCreate(!showCreate)} className="bg-quantum-gradient shadow-quantum">
                    <Plus className="w-4 h-4 mr-2" /> Nueva Propuesta
                  </Button>
                </div>

                <AnimatePresence>
                  {showCreate && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <Card className="glass-panel p-6 space-y-4">
                        <Input placeholder="Título de la propuesta" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="bg-background/50" />
                        <Textarea placeholder="Descripción detallada..." value={newDesc} onChange={e => setNewDesc(e.target.value)} className="bg-background/50" />
                        <div className="flex gap-2">
                          {['general', 'economía', 'seguridad', 'educación', 'XR'].map(cat => (
                            <Button key={cat} variant={newCategory === cat ? 'default' : 'outline'} size="sm" onClick={() => setNewCategory(cat)}>{cat}</Button>
                          ))}
                        </div>
                        <Button onClick={createProposal} className="bg-quantum-gradient">Publicar Propuesta</Button>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {loading ? (
                  <div className="text-center py-12 text-muted-foreground">Cargando propuestas...</div>
                ) : proposals.length === 0 ? (
                  <Card className="glass-panel p-12 text-center">
                    <Vote className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-xl text-muted-foreground">No hay propuestas activas. ¡Crea la primera!</p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {proposals.map((p, i) => {
                      const total = p.votes_for + p.votes_against;
                      const pct = total > 0 ? (p.votes_for / total) * 100 : 50;
                      return (
                        <motion.div key={p.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                          <Card className="glass-panel p-6">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold">{p.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                              </div>
                              <Badge className={p.status === 'voting' ? 'bg-blue-500/20 text-blue-300' : p.status === 'approved' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}>
                                {p.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mb-3">
                              <Badge variant="outline">{p.category}</Badge>
                              <span className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-green-400">A favor: {p.votes_for}</span>
                                <span className="text-red-400">En contra: {p.votes_against}</span>
                              </div>
                              <Progress value={pct} className="h-2" />
                              <p className="text-xs text-muted-foreground">Quórum: {total}/{p.quorum_required}</p>
                            </div>
                            {p.status === 'voting' && (
                              <div className="flex gap-3 mt-4">
                                <Button size="sm" onClick={() => castVote(p.id, true)} className="bg-green-600 hover:bg-green-500 flex-1">✅ A Favor</Button>
                                <Button size="sm" onClick={() => castVote(p.id, false)} variant="destructive" className="flex-1">❌ En Contra</Button>
                              </div>
                            )}
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="roles">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2"><Crown className="w-6 h-6 text-amber-400" /> Poderes CITEMESH</h2>
                  {powers.map((power, i) => {
                    const Icon = power.icon;
                    return (
                      <motion.div key={power.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className="glass-panel p-5 flex items-center gap-4">
                          <Icon className={`w-8 h-8 ${power.color}`} />
                          <div>
                            <h3 className="font-bold font-mono">{power.name}</h3>
                            <p className="text-sm text-muted-foreground">{power.desc}</p>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2"><Users className="w-6 h-6 text-blue-400" /> Roles del Sistema</h2>
                  {roles.map((role, i) => (
                    <motion.div key={role.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                      <Card className="glass-panel p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-lg">{role.name}</h3>
                          <Badge className={role.badge}>{role.powers.length} poderes</Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {role.powers.map(p => (
                            <Badge key={p} variant="outline" className="font-mono text-xs">{p}</Badge>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="identity">
              <IDNvidaPanel />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

const IDNvidaPanel = () => {
  const [identity, setIdentity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await (supabase as any).from('id_nvida').select('*').eq('user_id', user.id).single();
        setIdentity(data);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="text-center py-12 text-muted-foreground">Cargando identidad...</div>;

  if (!identity) {
    return (
      <Card className="glass-panel p-12 text-center">
        <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">ID-NVIDA™ No Activada</h3>
        <p className="text-muted-foreground mb-4">Inicia sesión y completa el onboarding para activar tu huella digital emocional inclonable.</p>
        <Button className="bg-quantum-gradient" onClick={() => window.location.href = '/auth'}>Activar ID-NVIDA</Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="glass-panel p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Crown className="w-5 h-5 text-amber-400" /> Dignidad</h3>
        <div className="text-5xl font-bold text-center mb-2 glow-text">{identity.dignity_score}</div>
        <Progress value={identity.dignity_score} className="h-3 mb-2" />
        <p className="text-xs text-muted-foreground text-center">Decae 1 punto cada 24h sin actividad positiva</p>
      </Card>
      <Card className="glass-panel p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-400" /> Reputación</h3>
        <div className="text-5xl font-bold text-center mb-2 text-green-400">{identity.reputation_score}</div>
        <p className="text-xs text-muted-foreground text-center">Se gana con acciones positivas verificadas</p>
      </Card>
      <Card className="glass-panel p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-blue-400" /> Trust Level</h3>
        <div className="text-5xl font-bold text-center mb-2 text-blue-400">{identity.trust_level}</div>
        <p className="text-xs text-muted-foreground text-center">Nivel de confianza en el ecosistema</p>
      </Card>
      <Card className="glass-panel p-6 md:col-span-2 lg:col-span-3">
        <h3 className="text-lg font-bold mb-3">Detalles ID-NVIDA™</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-muted-foreground">Username:</span> <span className="font-mono">{identity.immutable_username}</span></div>
          <div><span className="text-muted-foreground">Status:</span> <Badge className="bg-green-500/20 text-green-300">{identity.status}</Badge></div>
          <div><span className="text-muted-foreground">Creado:</span> {new Date(identity.created_at).toLocaleDateString()}</div>
          <div><span className="text-muted-foreground">Último decay:</span> {new Date(identity.last_dignity_decay).toLocaleDateString()}</div>
        </div>
      </Card>
    </div>
  );
};

export default Governance;
