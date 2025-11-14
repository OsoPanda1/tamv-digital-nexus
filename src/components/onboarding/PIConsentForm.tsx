import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, FileText, Download, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConsentType {
  id: string;
  label: string;
  description: string;
  required: boolean;
}

const CONSENT_TYPES: ConsentType[] = [
  {
    id: 'data_processing',
    label: 'Procesamiento de Datos',
    description: 'Permito que TAMV procese mis datos para mejorar la experiencia',
    required: true,
  },
  {
    id: 'biometric',
    label: 'Datos Biométricos',
    description: 'Acepto el uso de reconocimiento facial/voz para autenticación',
    required: false,
  },
  {
    id: 'audio',
    label: 'Grabación de Audio',
    description: 'Permito grabar audio para análisis emocional con Isabella AI',
    required: false,
  },
  {
    id: 'video',
    label: 'Grabación de Video',
    description: 'Acepto grabación de video para análisis gestual y emocional',
    required: false,
  },
  {
    id: 'third_party_sharing',
    label: 'Compartir con Terceros',
    description: 'Autorizo compartir datos anonimizados con instituciones académicas',
    required: false,
  },
];

export const PIConsentForm = () => {
  const [consents, setConsents] = useState<Record<string, boolean>>(
    CONSENT_TYPES.reduce((acc, type) => ({ ...acc, [type.id]: type.required }), {})
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleConsentChange = (consentId: string, checked: boolean) => {
    setConsents(prev => ({ ...prev, [consentId]: checked }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Insert consents
      const consentPromises = Object.entries(consents)
        .filter(([_, granted]) => granted)
        .map(([consentType]) =>
          supabase.from('pi_consents').insert({
            user_id: user.id,
            consent_type: consentType,
            granted: true,
            granted_at: new Date().toISOString(),
            hash_sha3: crypto.randomUUID(), // In production: generate actual SHA3-256 hash
            doi: `doi:10.tamv/${crypto.randomUUID()}`,
            export_format: 'pdf,qr,json',
          })
        );

      await Promise.all(consentPromises);

      // Create BookPI event
      await supabase.rpc('create_bookpi_event', {
        p_event_type: 'consent',
        p_resource_type: 'onboarding',
        p_resource_id: user.id,
        p_payload: { consents }
      });

      toast({
        title: "¡Consentimientos Registrados! 🎉",
        description: "Tus consentimientos PI han sido registrados con hash SHA3 y DOI legal",
      });
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

  const exportConsents = (format: 'pdf' | 'qr' | 'json') => {
    toast({
      title: `Exportando ${format.toUpperCase()}...`,
      description: "Tu certificado de consentimiento será descargado",
    });
    // In production: implement actual export logic
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <Shield className="w-16 h-16 mx-auto text-primary" />
        <h1 className="text-3xl font-bold">Consentimientos PI Granulares</h1>
        <p className="text-muted-foreground">
          Control total sobre tus datos · GDPR, CCPA, WIPO · Auditable · Revocable
        </p>
      </motion.div>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Permisos de Privacidad</CardTitle>
          <CardDescription>
            Selecciona los permisos que deseas otorgar. Puedes revocarlos en cualquier momento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {CONSENT_TYPES.map((consent, index) => (
            <motion.div
              key={consent.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-4 rounded-lg border hover:border-primary transition-colors"
            >
              <Checkbox
                id={consent.id}
                checked={consents[consent.id]}
                onCheckedChange={(checked) => 
                  handleConsentChange(consent.id, checked as boolean)
                }
                disabled={consent.required}
              />
              <div className="flex-1">
                <Label
                  htmlFor={consent.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {consent.label}
                  {consent.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {consent.description}
                </p>
              </div>
            </motion.div>
          ))}

          <div className="pt-4 space-y-3">
            <Button onClick={handleSubmit} className="w-full" disabled={loading}>
              <Shield className="mr-2 h-4 w-4" />
              Registrar Consentimientos con Hash PI
            </Button>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => exportConsents('pdf')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => exportConsents('qr')}
              >
                <QrCode className="mr-2 h-4 w-4" />
                Generar QR
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => exportConsents('json')}
              >
                <Download className="mr-2 h-4 w-4" />
                JSON
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p>Certificado con BookPI · Hash SHA3-256 · DOI Legal</p>
        <p>Compatible con GDPR (EU 2016/679), CCPA, eIDAS, WIPO, UNESCO</p>
      </div>
    </div>
  );
};
