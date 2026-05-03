import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Stethoscope, Video, ShieldCheck, FileText, Clock, Lock,
  Heart, Brain, Activity, CalendarDays, User, Send, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Consultation {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  status: 'scheduled' | 'completed' | 'in-progress';
  bookpiHash?: string;
}

const SPECIALTIES = [
  { name: 'Medicina General', icon: Stethoscope, available: 3, color: 'text-primary' },
  { name: 'Salud Mental', icon: Brain, available: 2, color: 'text-violet-400' },
  { name: 'Cardiología', icon: Heart, available: 1, color: 'text-destructive' },
  { name: 'Neurología', icon: Activity, available: 2, color: 'text-emerald-400' },
];

const DEMO_CONSULTATIONS: Consultation[] = [
  { id: '1', doctor: 'Dr. Alejandra Pérez', specialty: 'Medicina General', date: '2026-03-10 10:00', status: 'scheduled' },
  { id: '2', doctor: 'Dr. Carlos Mendoza', specialty: 'Salud Mental', date: '2026-03-05 14:30', status: 'completed', bookpiHash: 'bkpi:health:a3f2...9c1d' },
  { id: '3', doctor: 'Dra. María Torres', specialty: 'Cardiología', date: '2026-02-28 09:00', status: 'completed', bookpiHash: 'bkpi:health:7e4b...2a8f' },
];

const statusConfig = {
  scheduled: { label: 'Programada', className: 'bg-primary/20 text-primary' },
  'in-progress': { label: 'En Curso', className: 'bg-amber-500/20 text-amber-400' },
  completed: { label: 'Completada', className: 'bg-emerald-500/20 text-emerald-400' },
};

const Health = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState('');

  const handleSchedule = () => {
    if (!selectedSpecialty) {
      toast.error('Selecciona una especialidad');
      return;
    }
    toast.success('Consulta programada. Recibirás confirmación por notificación.', {
      icon: <Stethoscope className="w-4 h-4" />,
    });
    setSelectedSpecialty(null);
    setSymptoms('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Salud · Telemedicina</h1>
              <p className="text-muted-foreground">Consultas virtuales encriptadas con evidencia BookPI</p>
            </div>
          </div>

          {/* Security banner */}
          <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400">Todas las consultas están cifradas con PQC y registradas en BookPI Health</span>
          </div>
        </motion.div>

        <Tabs defaultValue="consultar" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="consultar">Nueva Consulta</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
            <TabsTrigger value="bookpi">BookPI Health</TabsTrigger>
          </TabsList>

          {/* New consultation */}
          <TabsContent value="consultar" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SPECIALTIES.map((spec) => {
                const Icon = spec.icon;
                const isSelected = selectedSpecialty === spec.name;
                return (
                  <motion.div key={spec.name} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card
                      className={cn(
                        "cursor-pointer transition-all border",
                        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      )}
                      onClick={() => setSelectedSpecialty(spec.name)}
                    >
                      <CardContent className="p-5 flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-muted", isSelected && "bg-primary/10")}>
                          <Icon className={cn("w-6 h-6", spec.color)} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{spec.name}</p>
                          <p className="text-sm text-muted-foreground">{spec.available} médicos disponibles</p>
                        </div>
                        <Badge className={isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}>
                          {isSelected ? 'Seleccionada' : 'Elegir'}
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {selectedSpecialty && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Video className="w-5 h-5 text-primary" />
                      Agendar Consulta Virtual
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Síntomas o motivo de consulta</label>
                      <Textarea
                        placeholder="Describe brevemente tus síntomas..."
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        className="resize-none"
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs text-muted-foreground">Tu información será cifrada y el registro quedará inmutable en BookPI Health</span>
                    </div>
                    <Button onClick={handleSchedule} className="w-full gap-2">
                      <CalendarDays className="w-4 h-4" />
                      Programar Consulta
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          {/* History */}
          <TabsContent value="historial" className="space-y-4">
            {DEMO_CONSULTATIONS.map((c) => (
              <Card key={c.id} className="border-border">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{c.doctor}</p>
                    <p className="text-sm text-muted-foreground">{c.specialty}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{c.date}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={statusConfig[c.status].className}>
                      {statusConfig[c.status].label}
                    </Badge>
                    {c.bookpiHash && (
                      <span className="text-[10px] font-mono text-muted-foreground">{c.bookpiHash}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* BookPI Health */}
          <TabsContent value="bookpi" className="space-y-4">
            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                  BookPI Health · Evidencia Inmutable
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Todos tus registros médicos están protegidos con criptografía post-cuántica (PQC) y encadenados en el BookPI.
                  Solo tú y tu médico autorizado pueden acceder a la información.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold text-foreground">{DEMO_CONSULTATIONS.filter(c => c.status === 'completed').length}</p>
                    <p className="text-xs text-muted-foreground">Consultas registradas</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold text-emerald-400">{DEMO_CONSULTATIONS.filter(c => c.bookpiHash).length}</p>
                    <p className="text-xs text-muted-foreground">Evidencias BookPI</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold text-primary">PQC</p>
                    <p className="text-xs text-muted-foreground">Cifrado activo</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs text-amber-400">Para exportar o compartir tus registros, se requiere autenticación biométrica y consentimiento PI explícito</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Health;
