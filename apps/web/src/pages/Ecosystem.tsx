import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Globe, Users, Code, Rocket, Sparkles, Brain, Shield, TrendingUp, Zap, BookOpen, Crown, Scale, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFederationHealth } from '@/hooks/useEcosystemMetrics';

const modules = [
  { icon: Sparkles, title: 'Isabella AI', desc: 'Asistente multimodal con memoria cuántica y triple bloqueo ético AVIXA', color: 'from-primary to-primary/60', link: '/isabella' },
  { icon: Globe, title: 'Dream Spaces 4D', desc: 'Metaverso sensorial inmersivo con audio KAOS', color: 'from-secondary to-secondary/60', link: '/dream-spaces' },
  { icon: Users, title: 'Red Social', desc: 'Comunidad global conectada con feed NextGen', color: 'from-accent to-accent/60', link: '/community' },
  { icon: Shield, title: 'Anubis Security', desc: 'Protección post-cuántica Kyber/Dilithium', color: 'from-destructive to-destructive/60', link: '/anubis' },
  { icon: Code, title: 'KAOS Audio 4D', desc: 'Sistema de audio binaural espacial', color: 'from-accent to-secondary', link: '/kaos' },
  { icon: BookOpen, title: 'Universidad TAMV', desc: 'Cursos con certificaciones BookPI', color: 'from-primary to-secondary', link: '/university' },
  { icon: TrendingUp, title: 'Economía TCEP', desc: 'Wallet, lotería y Fondo Fénix', color: 'from-accent to-primary', link: '/economy' },
  { icon: Crown, title: 'Gobernanza DAO', desc: 'CITEMESH con las 7 Federaciones', color: 'from-secondary to-primary', link: '/governance' },
  { icon: Rocket, title: 'Documentación', desc: 'DevHub técnico y API docs', color: 'from-muted-foreground to-primary', link: '/docs' },
];

const federationDetails = [
  { name: 'Seguridad', code: 'ANUBIS/HORUS', icon: Shield, desc: '11 capas de defensa post-cuántica', link: '/anubis' },
  { name: 'Economía', code: 'MSR/TCEP', icon: TrendingUp, desc: 'Redistribución ética 20/30/50', link: '/economy' },
  { name: 'Técnica', code: 'QUANTUM', icon: Zap, desc: 'Infraestructura multinube resiliente', link: '/singularity' },
  { name: 'Educación', code: 'UTAMV', icon: BookOpen, desc: 'Universidad con BookPI certs', link: '/university' },
  { name: 'IA', code: 'ISABELLA', icon: Sparkles, desc: 'IA ética multimodal AVIXA', link: '/isabella' },
  { name: 'Creativa', code: 'DREAMSPACES', icon: Globe, desc: 'Metaverso XR inmersivo', link: '/dream-spaces' },
  { name: 'Gobernanza', code: 'CITEMESH', icon: Scale, desc: 'DAO híbrida con veto ético', link: '/governance' },
];

const Ecosystem = () => {
  const { data: federations, isLoading: fedLoading } = useFederationHealth();
  const [selectedFed, setSelectedFed] = useState<string | null>(null);

  const activeFeds = federations?.filter(f => f.health >= 80).length ?? 0;
  const totalFeds = federations?.length ?? 7;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-quantum">Ecosistema TAMV MD-X4™</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Plataforma civilizatoria digital completa: 7 federaciones, 9 módulos, datos en vivo.
            </p>
          </div>

          {/* Federation Health Bar */}
          <Card className="p-6 mb-8 border-border/50 bg-card/60 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Estado de Federaciones</h2>
              <Badge variant="outline" className="border-primary/30 text-primary">
                {activeFeds}/{totalFeds} activas
              </Badge>
            </div>
            {fedLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {(federations ?? []).map((fed) => (
                    <button
                      key={fed.id}
                      onClick={() => setSelectedFed(selectedFed === fed.id ? null : fed.id)}
                      className={`text-center p-2 rounded-lg border transition-all cursor-pointer ${
                        selectedFed === fed.id 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border/30 hover:border-primary/30'
                      }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-1 ${fed.health >= 80 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <p className="text-[10px] font-bold truncate">{fed.codename}</p>
                      <p className="text-[9px] text-muted-foreground">{fed.records}</p>
                    </button>
                  ))}
                </div>
                <Progress value={(activeFeds / totalFeds) * 100} className="h-2" />

                {/* Selected federation detail */}
                {selectedFed && (() => {
                  const fed = federations?.find(f => f.id === selectedFed);
                  const detail = federationDetails.find(d => d.code.includes(fed?.codename?.split('/')[0] || ''));
                  if (!fed || !detail) return null;
                  const Icon = detail.icon;
                  return (
                    <Card className="mt-4 p-4 border-primary/20 bg-primary/5">
                      <div className="flex items-center gap-3">
                        <Icon className="w-6 h-6 text-primary" />
                        <div className="flex-1">
                          <h3 className="font-bold">{detail.name} — {detail.code}</h3>
                          <p className="text-sm text-muted-foreground">{detail.desc}</p>
                        </div>
                        <Link to={detail.link}>
                          <Button size="sm" variant="outline" className="border-primary/30">
                            Ver <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
                        <div className="text-center p-2 rounded bg-background/50">
                          <p className="text-muted-foreground text-xs">Registros</p>
                          <p className="font-bold">{fed.records}</p>
                        </div>
                        <div className="text-center p-2 rounded bg-background/50">
                          <p className="text-muted-foreground text-xs">Salud</p>
                          <p className="font-bold">{fed.health}%</p>
                        </div>
                        <div className="text-center p-2 rounded bg-background/50">
                          <p className="text-muted-foreground text-xs">Estado</p>
                          <Badge variant="outline" className={fed.health >= 80 ? 'text-emerald-400 border-emerald-400/30' : 'text-amber-400 border-amber-400/30'}>
                            {fed.health >= 80 ? 'Operativa' : 'Degradada'}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  );
                })()}
              </>
            )}
          </Card>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <Link key={index} to={module.link}>
                  <Card className="p-6 border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center shadow-lg mb-4`}>
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                    <p className="text-sm text-muted-foreground">{module.desc}</p>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Vision */}
          <Card className="p-8 border-border/50 bg-card/60 backdrop-blur-sm text-center">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-gradient-quantum">La Civilización Digital Mexicana</span>
            </h2>
            <p className="text-muted-foreground mb-6 max-w-3xl mx-auto">
              TAMV MD-X4™ es el fundamento de la primera civilización digital completa de México y Latinoamérica.
              Tecnología cuántica, IA multimodal, metaverso sensorial y seguridad post-cuántica.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/dashboard">
                <Button className="btn-premium">Explorar Dashboard</Button>
              </Link>
              <Link to="/docs">
                <Button variant="outline" className="border-primary/30 hover:bg-primary/10">Ver Documentación</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Ecosystem;
