import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Gift, Sparkles, Shield, Zap, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type GiftTier = 'light' | 'epic' | 'legendary' | 'ultra';

interface CircleGift {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  tier: GiftTier;
  visual_preview: {
    color: string;
    geometry: 'sphere' | 'box' | 'torus' | 'octahedron';
    scale: number;
  };
  combo_effects?: {
    multiplier: number;
    threshold: number;
    visual: string;
  };
  special_protocol?: string;
}

const TIER_CONFIG: Record<GiftTier, { label: string; color: string; emissive: number; particles: boolean; description: string }> = {
  light: { label: 'Light', color: 'text-foreground/60', emissive: 0.1, particles: false, description: 'Partículas básicas y shaders sutiles' },
  epic: { label: 'Epic', color: 'text-violet-400', emissive: 0.4, particles: true, description: 'Animaciones 3D avanzadas y efectos persistentes' },
  legendary: { label: 'Legendary', color: 'text-amber-400', emissive: 0.7, particles: true, description: 'Integración temporal y audio espacial' },
  ultra: { label: 'Ultra', color: 'text-destructive', emissive: 1.0, particles: true, description: 'Experiencia AR completa que transforma el entorno' },
};

interface Gift3DProps {
  gift: CircleGift;
  position: [number, number, number];
  onClick: () => void;
  isSelected: boolean;
}

function Gift3D({ gift, position, onClick, isSelected }: Gift3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      if (isSelected || hovered) {
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      }
    }
  });

  const geometry = () => {
    const scale = gift.visual_preview.scale || 1;
    switch (gift.visual_preview.geometry) {
      case 'box': return <boxGeometry args={[scale, scale, scale]} />;
      case 'torus': return <torusGeometry args={[scale * 0.7, scale * 0.3, 16, 100]} />;
      case 'octahedron': return <octahedronGeometry args={[scale]} />;
      default: return <sphereGeometry args={[scale, 32, 32]} />;
    }
  };

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered || isSelected ? 1.2 : 1}
      >
        {geometry()}
        <meshStandardMaterial
          color={gift.visual_preview.color}
          metalness={0.8}
          roughness={0.2}
          emissive={gift.visual_preview.color}
          emissiveIntensity={isSelected || hovered ? 0.5 : 0.2}
        />
        {(isSelected || hovered) && (
          <Html distanceFactor={10}>
            <div className="glass-metallic border border-aqua/30 rounded-lg p-2 min-w-[150px] shadow-epic">
              <p className="font-bold text-aqua text-sm">{gift.name}</p>
              <p className="text-xs text-silver-dark">{gift.price} {gift.currency}</p>
            </div>
          </Html>
        )}
      </mesh>
    </Float>
  );
}

export const CircleGiftGallery = () => {
  const [gifts, setGifts] = useState<CircleGift[]>([]);
  const [selectedGift, setSelectedGift] = useState<CircleGift | null>(null);
  const [loading, setLoading] = useState(true);
  const [comboCount, setComboCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    loadGifts();
    connectWebSocket();
    return () => {
      wsRef.current?.close();
    };
  }, []);

  const loadGifts = async () => {
    try {
      const { data, error } = await supabase
        .from('circle_gifts')
        .select('*')
        .eq('is_available', true);

      if (error) throw error;

      const formattedGifts: CircleGift[] = (data || []).map(gift => {
        const price = gift.price;
        const tier: GiftTier = price >= 500 ? 'ultra' : price >= 200 ? 'legendary' : price >= 50 ? 'epic' : 'light';
        return {
          ...gift,
          tier,
          visual_preview: typeof gift.visual_preview === 'string' 
            ? JSON.parse(gift.visual_preview)
            : gift.visual_preview || { color: '#00D9FF', geometry: 'sphere', scale: 1 },
          combo_effects: gift.combo_effects && typeof gift.combo_effects === 'string'
            ? JSON.parse(gift.combo_effects)
            : gift.combo_effects
        };
      });

      setGifts(formattedGifts);
    } catch (error) {
      console.error('Error loading gifts:', error);
      toast.error('Error al cargar regalos');
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    const ws = new WebSocket(
      `wss://${import.meta.env.VITE_SUPABASE_URL?.replace('https://', '')}/realtime/v1/websocket`
    );

    ws.onopen = () => {
      console.log('[CircleGift] WebSocket conectado');
      ws.send(JSON.stringify({
        topic: 'circle_gifts:*',
        event: 'phx_join',
        payload: {},
        ref: '1'
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === 'gift_sent') {
        handleGiftEvent(data.payload);
      }
    };

    wsRef.current = ws;
  };

  const handleGiftEvent = (payload: any) => {
    toast.success(`¡${payload.sender} envió un regalo!`, {
      icon: <Gift className="w-4 h-4 text-aqua" />,
      duration: 5000
    });
    
    if (payload.combo) {
      setComboCount(prev => prev + 1);
      toast.success(`¡COMBO x${payload.combo}!`, {
        icon: <Zap className="w-4 h-4 text-yellow-400" />,
        className: 'animate-bounce'
      });
    }
  };

  const handleSendGift = async (receiverId: string) => {
    if (!selectedGift) return;

    try {
      // Mini Anubis Security Protocol
      const securityCheck = await validateTransaction(selectedGift);
      if (!securityCheck.valid) {
        toast.error(`Protocolo Anubis: ${securityCheck.reason}`);
        return;
      }

      const { error } = await supabase
        .from('gift_transactions')
        .insert({
          gift_id: selectedGift.id,
          sender_id: (await supabase.auth.getUser()).data.user?.id,
          receiver_id: receiverId,
          quantity: 1,
          total_amount: selectedGift.price
        });

      if (error) throw error;

      // Broadcast via WebSocket
      wsRef.current?.send(JSON.stringify({
        topic: 'circle_gifts:broadcast',
        event: 'gift_sent',
        payload: {
          gift: selectedGift,
          sender: 'Usuario',
          combo: comboCount > 0 ? comboCount : undefined
        }
      }));

      toast.success(`¡Regalo enviado con éxito!`);
      setComboCount(prev => prev + 1);
    } catch (error) {
      console.error('Error sending gift:', error);
      toast.error('Error al enviar regalo');
    }
  };

  const validateTransaction = async (gift: CircleGift) => {
    // Mini Anubis Security Protocol
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      return { valid: false, reason: 'Usuario no autenticado' };
    }

    // Check rate limiting
    const { data: recentGifts } = await supabase
      .from('gift_transactions')
      .select('created_at')
      .eq('sender_id', user.id)
      .gte('created_at', new Date(Date.now() - 60000).toISOString());

    if ((recentGifts?.length || 0) > 10) {
      return { valid: false, reason: 'Límite de regalos por minuto excedido' };
    }

    return { valid: true, reason: '' };
  };

  const getGiftPositions = (count: number): [number, number, number][] => {
    const radius = 5;
    const positions: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      positions.push([
        Math.cos(angle) * radius,
        Math.sin(i * 0.5) * 2,
        Math.sin(angle) * radius
      ]);
    }
    return positions;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Sparkles className="w-12 h-12 text-aqua animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-navy-deep">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 glow-text">
            <span className="bg-gradient-to-r from-aqua via-silver to-aqua bg-clip-text text-transparent">
              CircleGift Gallery
            </span>
          </h1>
          <p className="text-silver-dark text-lg">Regalos virtuales 3D con efectos especiales</p>
          {comboCount > 0 && (
            <Badge className="mt-4 bg-epic-gradient text-lg px-6 py-2 animate-pulse-aqua">
              <Zap className="w-5 h-5 mr-2" />
              COMBO x{comboCount}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3D Gallery Canvas */}
          <div className="relative h-[600px] glass-metallic rounded-2xl border border-aqua/30 overflow-hidden shadow-epic">
            <Canvas>
              <PerspectiveCamera makeDefault position={[0, 5, 10]} />
              <OrbitControls 
                enableZoom={true}
                enablePan={true}
                minDistance={5}
                maxDistance={20}
              />
              
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#00D9FF" />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#C0C0C0" />
              
              {gifts.map((gift, index) => (
                <Gift3D
                  key={gift.id}
                  gift={gift}
                  position={getGiftPositions(gifts.length)[index]}
                  onClick={() => setSelectedGift(gift)}
                  isSelected={selectedGift?.id === gift.id}
                />
              ))}
            </Canvas>

            {/* Mini Anubis Protocol Indicator */}
            <div className="absolute top-4 right-4 glass-metallic border border-aqua/30 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-aqua animate-pulse-aqua" />
                <span className="text-xs text-silver-dark">Protocolo Anubis Activo</span>
              </div>
            </div>
          </div>

          {/* Gift Details Panel */}
          <div className="space-y-6">
            {selectedGift ? (
              <Card className={cn(
                "glass-metallic border border-aqua/30 p-6 shadow-epic",
                "animate-fade-in-up"
              )}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-aqua mb-2">
                        {selectedGift.name}
                      </h3>
                      <Badge className="bg-navy-metallic text-silver">
                        {selectedGift.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-aqua">
                        {selectedGift.price}
                      </p>
                      <p className="text-sm text-silver-dark">
                        {selectedGift.currency}
                      </p>
                    </div>
                  </div>

                  <p className="text-silver-dark">{selectedGift.description}</p>

                  {selectedGift.combo_effects && (
                    <div className="glass-panel border border-aqua/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <span className="font-bold text-aqua">Efecto Combo</span>
                      </div>
                      <p className="text-sm text-silver-dark">
                        Multiplicador: x{selectedGift.combo_effects.multiplier} después de {selectedGift.combo_effects.threshold} regalos
                      </p>
                    </div>
                  )}

                  {selectedGift.special_protocol && (
                    <div className="glass-panel border border-aqua/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-aqua" />
                        <span className="font-bold text-aqua">Protocolo Especial</span>
                      </div>
                      <p className="text-sm text-silver-dark">
                        {selectedGift.special_protocol}
                      </p>
                    </div>
                  )}

                  <Button 
                    className="w-full bg-epic-gradient shadow-aqua hover:shadow-epic text-lg py-6"
                    onClick={() => handleSendGift('demo-user-id')}
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Enviar Regalo
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="glass-metallic border border-aqua/30 p-6 text-center">
                <Gift className="w-16 h-16 mx-auto mb-4 text-silver-dark" />
                <p className="text-silver-dark">
                  Selecciona un regalo en la galería 3D
                </p>
              </Card>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="glass-metallic border border-aqua/30 p-4">
                <p className="text-sm text-silver-dark mb-1">Total Regalos</p>
                <p className="text-2xl font-bold text-aqua">{gifts.length}</p>
              </Card>
              <Card className="glass-metallic border border-aqua/30 p-4">
                <p className="text-sm text-silver-dark mb-1">Combo Actual</p>
                <p className="text-2xl font-bold text-aqua">x{comboCount}</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
