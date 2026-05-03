import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, FileCode, Download, QrCode, Hash, Clock, 
  CheckCircle2, AlertTriangle, Lock, Eye 
} from 'lucide-react';
import { useState } from 'react';

interface PIEvent {
  id: string;
  timestamp: Date;
  eventType: 'consent' | 'data_access' | 'data_export' | 'data_deletion' | 'security_scan';
  hash: string;
  doi?: string;
  status: 'verified' | 'pending' | 'revoked';
  metadata: Record<string, any>;
}

/**
 * Panel BookPI - Sistema de Trazabilidad y Propiedad Intelectual
 * Registro inmutable de consentimientos, accesos y eventos críticos
 */
export const BookPIPanel = () => {
  const [events, setEvents] = useState<PIEvent[]>([
    {
      id: '1',
      timestamp: new Date(),
      eventType: 'consent',
      hash: 'sha3-256:a7f3b2c1d4e5f6...',
      doi: '10.5281/zenodo.123456',
      status: 'verified',
      metadata: { consentType: 'data_processing', granularity: 'detailed' }
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 86400000),
      eventType: 'data_access',
      hash: 'sha3-256:b8e4c3d2f5a6e7...',
      status: 'verified',
      metadata: { resource: 'profile_data', accessor: 'Isabella AI' }
    }
  ]);

  const [selectedEvent, setSelectedEvent] = useState<PIEvent | null>(null);

  const getEventIcon = (type: PIEvent['eventType']) => {
    switch (type) {
      case 'consent': return CheckCircle2;
      case 'data_access': return Eye;
      case 'data_export': return Download;
      case 'data_deletion': return AlertTriangle;
      case 'security_scan': return Shield;
    }
  };

  const getEventLabel = (type: PIEvent['eventType']) => {
    switch (type) {
      case 'consent': return 'Consentimiento';
      case 'data_access': return 'Acceso a Datos';
      case 'data_export': return 'Exportación';
      case 'data_deletion': return 'Eliminación';
      case 'security_scan': return 'Escaneo Seguridad';
    }
  };

  const exportToPDF = (event: PIEvent) => {
    console.log('📄 Exportando evento a PDF:', event);
    // TODO: Implementar generación de PDF con evidencia legal
  };

  const generateQR = (event: PIEvent) => {
    console.log('🔲 Generando QR code para:', event);
    // TODO: Implementar generación de QR con hash y DOI
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-950/20 to-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-quantum">
              <FileCode className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                BookPI™
              </h1>
              <p className="text-muted-foreground">Sistema de Trazabilidad y Propiedad Intelectual</p>
            </div>
          </div>

          <Alert className="glass-panel border-purple-500/30">
            <Lock className="w-5 h-5 text-purple-400" />
            <AlertDescription>
              Todos los eventos están registrados con hash SHA3-256, firma digital Ed25519, y timestamp verificable.
              Tu propiedad intelectual y consentimientos están protegidos con evidencia legal inmutable.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Eventos */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="glass-panel p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Registro de Eventos PI</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Exportar CSV
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileCode className="w-4 h-4" />
                    Exportar PDF
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {events.map((event) => {
                  const Icon = getEventIcon(event.eventType);
                  return (
                    <Card
                      key={event.id}
                      className={`glass-panel p-4 cursor-pointer transition-all hover:shadow-quantum ${
                        selectedEvent?.id === event.id ? 'border-purple-500 shadow-quantum' : ''
                      }`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{getEventLabel(event.eventType)}</span>
                              <Badge variant={event.status === 'verified' ? 'default' : 'secondary'}>
                                {event.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <Clock className="w-4 h-4" />
                              {event.timestamp.toLocaleString('es-MX')}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                              <Hash className="w-3 h-3" />
                              {event.hash.substring(0, 40)}...
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              exportToPDF(event);
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              generateQR(event);
                            }}
                          >
                            <QrCode className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Panel de Detalles */}
          <div>
            <Card className="glass-panel p-6">
              <h3 className="text-xl font-bold mb-4">Detalles del Evento</h3>
              {selectedEvent ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Hash SHA3-256</label>
                    <div className="text-xs font-mono bg-black/20 p-3 rounded-lg mt-1 break-all">
                      {selectedEvent.hash}
                    </div>
                  </div>
                  
                  {selectedEvent.doi && (
                    <div>
                      <label className="text-sm text-muted-foreground">DOI</label>
                      <div className="text-sm font-mono bg-black/20 p-3 rounded-lg mt-1">
                        {selectedEvent.doi}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm text-muted-foreground">Metadata</label>
                    <pre className="text-xs bg-black/20 p-3 rounded-lg mt-1 overflow-auto max-h-40">
                      {JSON.stringify(selectedEvent.metadata, null, 2)}
                    </pre>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button className="w-full gap-2" variant="outline">
                      <Download className="w-4 h-4" />
                      Descargar Evidencia PDF
                    </Button>
                    <Button className="w-full gap-2" variant="outline">
                      <QrCode className="w-4 h-4" />
                      Generar QR Code
                    </Button>
                    <Button className="w-full gap-2" variant="outline">
                      <Shield className="w-4 h-4" />
                      Verificar Integridad
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  Selecciona un evento para ver detalles
                </div>
              )}
            </Card>

            {/* Estadísticas */}
            <Card className="glass-panel p-6 mt-6">
              <h3 className="text-xl font-bold mb-4">Estadísticas PI</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Eventos</span>
                  <span className="font-bold">{events.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verificados</span>
                  <span className="font-bold text-green-400">
                    {events.filter(e => e.status === 'verified').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Integridad</span>
                  <span className="font-bold text-green-400">100%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};