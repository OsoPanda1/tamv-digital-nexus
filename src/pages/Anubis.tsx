import Navigation from '@/components/Navigation';
import { QuantumCanvas } from '@/components/QuantumCanvas';
import { Card } from '@/components/ui/card';
import { Shield, Lock, Eye, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

const Anubis = () => {
  const securityMetrics = [
    { label: 'Amenazas Bloqueadas', value: '1,247', status: 'success', icon: CheckCircle },
    { label: 'Escaneos Activos', value: '24/7', status: 'active', icon: Activity },
    { label: 'Nivel de Protección', value: 'Cuántico', status: 'max', icon: Shield },
    { label: 'Alertas Pendientes', value: '0', status: 'success', icon: AlertTriangle },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Encriptación Post-Cuántica',
      desc: 'Algoritmos resistentes a computadoras cuánticas futuras',
    },
    {
      icon: Eye,
      title: 'Monitoreo 24/7',
      desc: 'Vigilancia continua de amenazas en tiempo real',
    },
    {
      icon: Lock,
      title: 'Autenticación Biométrica',
      desc: 'Múltiples capas de verificación de identidad',
    },
    {
      icon: Activity,
      title: 'Análisis Predictivo',
      desc: 'IA que detecta patrones de amenazas antes de ocurrir',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <QuantumCanvas />
      <Navigation />

      <main className="container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-slide-in-up">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-destructive to-primary flex items-center justify-center shadow-quantum animate-pulse-glow">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-6xl font-bold glow-text bg-gradient-to-r from-destructive via-primary to-secondary bg-clip-text text-transparent">
                  Anubis Sentinel v10
                </h1>
                <p className="text-muted-foreground text-lg">Sistema de Seguridad Post-Cuántica</p>
              </div>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Monitoreo avanzado con IA, protección multi-capa y encriptación resistente a ataques cuánticos.
              La seguridad más avanzada del metaverso.
            </p>
          </div>

          {/* Security Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {securityMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card
                  key={index}
                  className="glass-panel p-6 text-center hover:shadow-quantum transition-all animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Icon
                    className={`w-12 h-12 mx-auto mb-4 ${
                      metric.status === 'success'
                        ? 'text-green-500'
                        : metric.status === 'active'
                        ? 'text-primary'
                        : 'text-destructive'
                    }`}
                  />
                  <p className="text-3xl font-bold mb-2">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </Card>
              );
            })}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="glass-panel p-8 hover:shadow-quantum transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-destructive to-primary flex items-center justify-center shadow-quantum flex-shrink-0">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Status Panel */}
          <Card className="glass-panel p-8">
            <h2 className="text-3xl font-bold mb-6 glow-text">Estado del Sistema</h2>
            <div className="space-y-6">
              {[
                { label: 'Firewall Cuántico', status: 'Activo', level: 100 },
                { label: 'Detección de Intrusiones', status: 'Operacional', level: 98 },
                { label: 'Análisis de Amenazas', status: 'En Línea', level: 100 },
                { label: 'Protección de Datos', status: 'Máxima', level: 100 },
              ].map((system, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{system.label}</span>
                    <span className="text-green-500">{system.status}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-primary transition-all duration-1000"
                      style={{ width: `${system.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Anubis;
