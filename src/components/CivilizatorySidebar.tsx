// ============================================================================
// TAMV ONLINE - Civilizatory Sidebar
// Elegant navigation with 21+ Federations
// ============================================================================

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Home, Sparkles, Globe, Users, BookOpen, Shield, 
  BarChart3, Settings, Brain, Zap, ChevronLeft, 
  ChevronRight, Crown, DollarSign, FileText, AlertTriangle,
  Headphones, Palette, Network, Lock, TrendingUp, 
  Radio, Layers, Star, Heart, Infinity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FEDERATIONS, type FederationId } from '@/systems/FederationSystem';

// ============================================================================
// Navigation Configuration
// ============================================================================

interface NavItem {
  icon: any;
  label: string;
  path: string;
  badge?: string;
  federation?: FederationId;
  highlight?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Nucleo Central',
    items: [
      { icon: Home, label: 'Dashboard', path: '/dashboard' },
      { icon: Brain, label: 'Isabella AI', path: '/isabella', federation: 'ISABELLA', highlight: true },
      { icon: Shield, label: 'Anubis Sentinel', path: '/anubis', federation: 'ANUBIS' },
      { icon: User, label: 'Perfil de Usuario', path: '/profile' },
    ],
  },
  {
    title: 'Infraestructura',
    items: [
      { icon: Globe, label: 'Ecosistema', path: '/ecosystem' },
      { icon: Palette, label: 'Dream Spaces', path: '/dream-spaces', federation: 'DREAMSPACES', highlight: true },
      { icon: Headphones, label: 'KAOS Audio', path: '/kaos', federation: 'KAOS' },
      { icon: Users, label: 'Comunidad', path: '/community', federation: 'HARMONY' },
    ],
  },
  {
    title: 'Universidad',
    items: [
      { icon: BookOpen, label: 'Academia', path: '/university', federation: 'UTAMV' },
      { icon: FileText, label: 'Documentacion', path: '/docs', federation: 'CRYSTAL' },
      { icon: BarChart3, label: 'Analytics', path: '/dashboard', federation: 'NOVA' },
    ],
  },
  {
    title: 'Economia',
    items: [
      { icon: DollarSign, label: 'Monetizacion', path: '/monetization', badge: 'Pro' },
      { icon: VIP, label: 'Membresias', path: '/monetization' },
      { icon: TrendingUp, label: ' Blockchain MSR', path: '/economy', federation: 'MSR', badge: 'TCEP' },
    ],
  },
  {
    title: 'Gobernanza',
    items: [
      { icon: Network, label: 'CITEMESH DAO', path: '/governance', federation: 'CITEMESH', highlight: true },
      { icon: FileText, label: 'BookPI', path: '/bookpi', federation: 'BOOKPI' },
      { icon: DNA, label: 'ID-NVIDA', path: '/profile', federation: 'STELLAR' },
      { icon: AlertTriangle, label: 'Crisis Panel', path: '/crisis' },
      { icon: Settings, label: 'Admin', path: '/admin', badge: 'Admin' },
    ],
  },
  {
    title: 'Federaciones',
    items: [
      { icon: Lock, label: 'Eclipse Privacy', path: '/anubis', federation: 'ECLIPSE' },
      { icon: Radio, label: 'Nexus Gateway', path: '/ecosystem', federation: 'NEXUS' },
      { icon: Layers, label: 'Phoenix Fund', path: '/economy', federation: 'PHOENIX' },
      { icon: Heart, label: 'Serenity', path: '/isabella', federation: 'SERENITY' },
      { icon: Infinity, label: 'Eternity', path: '/bookpi', federation: 'ETERNITY' },
    ],
  },
];

// ============================================================================
// Sidebar Component
// ============================================================================

export const CivilizatorySidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const getFederationColor = (federationId?: FederationId) => {
    if (!federationId) return undefined;
    return FEDERATIONS[federationId]?.color;
  };

  return (
    <div
      className={cn(
        'fixed left-0 top-0 h-screen z-40 transition-all duration-500 ease-in-out',
        'glass-panel border-r border-aqua/20',
        collapsed ? 'w-20' : 'w-72'
      )}
      style={{
        background: 'linear-gradient(180deg, rgba(11, 12, 17, 0.95) 0%, rgba(13, 15, 22, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-6 z-50 w-8 h-8 rounded-full border-2 shadow-lg transition-all duration-300 hover:scale-110"
        style={{
          background: 'linear-gradient(135deg, #3E7EA3 0%, #1E4D6B 100%)',
          borderColor: '#00D9FF',
        }}
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-aqua" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-aqua" />
        )}
      </Button>

      {/* Logo */}
      <div className="p-6 border-b border-aqua/20">
        <Link to="/" className="flex items-center gap-3 group">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, #00D9FF 0%, #3E7EA3 50%, #C1CBD5 100%)',
            }}
          >
            <Sparkles className="w-6 h-6 text-background" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span 
                className="text-lg font-bold"
                style={{
                  background: 'linear-gradient(90deg, #00D9FF, #3E7EA3, #C1CBD5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                TAMV MD-X4â"¢
              </span>
              <span className="text-xs text-muted-foreground">Civilizatory System</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="px-3 py-4 space-y-4">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              {!collapsed && (
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  const fedColor = getFederationColor(item.federation);
                  
                  return (
                    <Link key={item.path + item.label} to={item.path}>
                      <Button
                        variant="ghost"
                        className={cn(
                          'w-full justify-start gap-3 transition-all duration-300 group relative',
                          collapsed ? 'px-3' : 'px-4',
                          active && 'bg-aqua/15 text-aqua',
                          !active && 'hover:bg-aqua/10 hover:text-aqua'
                        )}
                        style={active && fedColor ? { borderLeft: `3px solid ${fedColor}` } : {}}
                      >
                        <Icon
                          className={cn(
                            'w-5 h-5 transition-transform duration-300 group-hover:scale-110',
                            active && 'text-aqua',
                            item.highlight && 'animate-pulse'
                          )}
                          style={fedColor ? { color: fedColor } : {}}
                        />
                        {!collapsed && (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm font-medium">{item.label}</span>
                            <div className="flex items-center gap-1">
                              {item.badge && (
                                <Badge 
                                  variant="outline" 
                                  className="text-xs px-2 py-0.5 border-aqua/30 text-aqua"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                              {item.highlight && (
                                <Zap className="w-3 h-3 text-aqua animate-pulse" />
                              )}
                            </div>
                          </div>
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-aqua/20 glass-panel">
        <Link to="/profile">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start gap-3 hover:bg-aqua/10 transition-all duration-300',
              collapsed && 'px-3'
            )}
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #00D9FF 0%, #3E7EA3 100%)',
              }}
            >
              <Sparkles className="w-4 h-4 text-background" />
            </div>
            {!collapsed && (
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">Perfil Usuario</span>
                <span className="text-xs text-muted-foreground">Nivel CuÃ¡ntico 5</span>
              </div>
            )}
          </Button>
        </Link>
      </div>
    </div>
  );
};
