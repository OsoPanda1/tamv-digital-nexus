import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, 
  Shield, 
  RotateCcw, 
  CheckCircle,
  Activity,
  FileWarning
} from 'lucide-react';
import { motion } from 'framer-motion';

const CRISIS_TYPES = [
  { value: 'fraud', label: 'Fraude Detectado', icon: AlertTriangle, color: 'destructive' },
  { value: 'data_breach', label: 'Brecha de Datos', icon: Shield, color: 'destructive' },
  { value: 'system_failure', label: 'Fallo del Sistema', icon: Activity, color: 'warning' },
  { value: 'user_report', label: 'Reporte de Usuario', icon: FileWarning, color: 'default' },
];

export const CrisisPanel = () => {
  const [crisisType, setCrisisType] = useState('fraud');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [description, setDescription] = useState('');
  const [affectedResources, setAffectedResources] = useState('');
  const [loading, setLoading] = useState(false);
  const [crisisLogs, setCrisisLogs] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadCrisisLogs();
  }, []);

  const loadCrisisLogs = async () => {
    const { data } = await supabase
      .from('crisis_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setCrisisLogs(data);
    }
  };

  const handleTriggerCrisis = async () => {
    if (!description.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes proporcionar una descripción",
      });
      return;
    }

    setLoading(true);

    try {
      // Parse affected resources
      const resources = affectedResources
        .split(',')
        .map(r => r.trim())
        .filter(r => r);

      // Call crisis rollback function
      const { data, error } = await supabase.rpc('trigger_crisis_rollback', {
        p_incident_type: crisisType,
        p_description: description,
        p_severity: severity
      });

      if (error) throw error;

      toast({
        title: "🚨 Crisis Registrada",
        description: `Rollback ejecutado. Sistema en modo recuperación. ID: ${data}`,
      });

      // Reset form
      setDescription('');
      setAffectedResources('');
      setSeverity([5]);

      // Reload logs
      loadCrisisLogs();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return 'text-green-500';
    if (severity <= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <AlertTriangle className="w-16 h-16 mx-auto text-destructive" />
        <h1 className="text-3xl font-bold">Sistema de Crisis & Recuperación</h1>
        <p className="text-muted-foreground">
          Detección automática · Rollback instantáneo · Recovery auditable · BookPI compliance
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trigger Crisis Form */}
        <Card className="glass-panel border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Reportar Incidente
            </CardTitle>
            <CardDescription>
              Activa protocolo de crisis con rollback automático
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Crisis</Label>
              <div className="grid grid-cols-2 gap-2">
                {CRISIS_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Button
                      key={type.value}
                      variant={crisisType === type.value ? "default" : "outline"}
                      onClick={() => setCrisisType(type.value)}
                      className="h-auto py-4"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Icon className="w-5 h-5" />
                        <span className="text-xs">{type.label}</span>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Severidad: {severity[0]}/10</Label>
              <Slider
                value={severity}
                onValueChange={setSeverity}
                max={10}
                min={1}
                step={1}
                className={getSeverityColor(severity[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Bajo</span>
                <span>Medio</span>
                <span>Crítico</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe el incidente..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resources">Recursos Afectados (separados por comas)</Label>
              <Input
                id="resources"
                placeholder="user:123, transaction:456, ..."
                value={affectedResources}
                onChange={(e) => setAffectedResources(e.target.value)}
              />
            </div>

            <Button
              onClick={handleTriggerCrisis}
              className="w-full"
              variant="destructive"
              disabled={loading}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Activar Crisis & Rollback
            </Button>
          </CardContent>
        </Card>

        {/* Crisis Logs */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Historial de Crisis
            </CardTitle>
            <CardDescription>
              Registro de incidentes y recuperaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {crisisLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                  <p>No hay crisis registradas</p>
                  <p className="text-xs">Sistema operando normalmente</p>
                </div>
              ) : (
                crisisLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={log.resolved ? "default" : "destructive"}>
                            {log.crisis_type}
                          </Badge>
                          <span className={`text-sm font-bold ${getSeverityColor(log.severity)}`}>
                            Severidad: {log.severity}/10
                          </span>
                        </div>
                        <p className="text-sm">{log.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                          {log.rollback_executed && (
                            <Badge variant="outline" className="text-xs">
                              <RotateCcw className="w-3 h-3 mr-1" />
                              Rollback OK
                            </Badge>
                          )}
                        </div>
                      </div>
                      {log.resolved ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel border-primary/20">
        <CardHeader>
          <CardTitle>Protocolo de Recuperación TAMV</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              1
            </div>
            <div>
              <p className="font-medium">Detección Automática</p>
              <p className="text-muted-foreground">
                Sistema Anubis Sentinel detecta anomalías en tiempo real
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              2
            </div>
            <div>
              <p className="font-medium">Freeze & Snapshot</p>
              <p className="text-muted-foreground">
                Congelamiento inmediato y creación de snapshot de estado
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              3
            </div>
            <div>
              <p className="font-medium">Triple Rollback</p>
              <p className="text-muted-foreground">
                Rollback de datos, configuración y estado de aplicación
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              4
            </div>
            <div>
              <p className="font-medium">Registro BookPI</p>
              <p className="text-muted-foreground">
                Toda la crisis queda registrada con hash, DOI y evidencia legal
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              5
            </div>
            <div>
              <p className="font-medium">Recovery & Audit</p>
              <p className="text-muted-foreground">
                Recuperación verificada y auditoría exportable (ZIP/PDF/CSV)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
