// ============================================================================
// TAMV MD-X4™ - Smart Floating Bar (Right)
// Intelligent contextual bar with quick actions, notifications, Isabella
// ============================================================================

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Bell, Search, MessageCircle, Wallet, Music,
  Sparkles, Users, ChevronLeft, ChevronRight, Plus,
  PawPrint, Video, ShoppingBag, Zap, Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAction {
  icon: any;
  label: string;
  path?: string;
  onClick?: () => void;
  color: string;
  badge?: string | number;
  pulse?: boolean;
}

const QUICK_ACTIONS: QuickAction[] = [
  { icon: Search, label: 'Buscar', path: '/community', color: 'hsl(var(--muted-foreground))' },
  { icon: Bell, label: 'Notificaciones', path: '/dashboard', color: 'hsl(var(--primary))', badge: 3, pulse: true },
  { icon: MessageCircle, label: 'Chat', path: '/community', color: '#22C55E' },
  { icon: Brain, label: 'Isabella AI', path: '/isabella', color: '#00D9FF', pulse: true },
  { icon: Video, label: 'Streaming', path: '/metaverse', color: '#EF4444', badge: 'LIVE' },
  { icon: Music, label: 'KAOS Audio', path: '/kaos', color: '#FBBF24' },
  { icon: Users, label: 'Presencia', path: '/community', color: '#8B5CF6', badge: 127 },
  { icon: Wallet, label: 'NubiWallet', path: '/economy', color: '#06B6D4' },
  { icon: ShoppingBag, label: 'Marketplace', path: '/monetization', color: '#F97316' },
  { icon: PawPrint, label: 'Mascotas', path: '/gifts', color: '#EC4899' },
  { icon: Plus, label: 'Crear', path: '/community', color: '#10B981' },
];

export const SmartFloatingBar = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  return (
    <motion.div
      className={cn(
        'fixed right-3 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1',
        'rounded-2xl border border-border/20 py-2 px-1',
        expanded ? 'w-48' : 'w-12'
      )}
      style={{
        background: 'hsl(220 15% 5% / 0.92)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px hsl(220 15% 0% / 0.5), 0 0 1px hsl(var(--primary) / 0.2)',
      }}
      layout
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setExpanded(!expanded)}
        className="w-8 h-8 text-muted-foreground hover:text-primary mb-1"
      >
        {expanded ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </Button>

      {/* Actions */}
      {QUICK_ACTIONS.map((action, i) => {
        const Icon = action.icon;
        const isActive = action.path && location.pathname === action.path;

        const content = (
          <motion.div
            key={action.label}
            layout
            className="relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              className={cn(
                'relative transition-all',
                expanded ? 'w-full justify-start gap-2 h-9 px-3' : 'w-10 h-10 p-0',
                isActive ? 'bg-primary/15' : 'hover:bg-primary/10'
              )}
            >
              <Icon
                className={cn('w-4 h-4 flex-shrink-0', action.pulse && 'animate-pulse')}
                style={{ color: action.color }}
              />
              {expanded && (
                <span className="text-xs text-muted-foreground truncate">{action.label}</span>
              )}

              {/* Badge */}
              {action.badge && !expanded && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[9px] font-bold bg-destructive text-destructive-foreground px-1">
                  {action.badge}
                </span>
              )}
              {action.badge && expanded && (
                <Badge variant="outline" className="ml-auto text-[9px] px-1 py-0 border-primary/30 text-primary">
                  {action.badge}
                </Badge>
              )}
            </Button>
          </motion.div>
        );

        return action.path ? (
          <Link key={action.label} to={action.path} className={expanded ? 'w-full' : ''}>
            {content}
          </Link>
        ) : (
          <div key={action.label} onClick={action.onClick} className={expanded ? 'w-full' : ''}>
            {content}
          </div>
        );
      })}

      {/* Settings at bottom */}
      <div className="border-t border-border/20 pt-1 mt-1 w-full flex justify-center">
        <Link to="/admin">
          <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-primary">
            <Settings className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};
