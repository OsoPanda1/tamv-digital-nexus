// ============================================================================
// TAMV MD-X4™ - Accordion Sidebar (Left)
// Non-intrusive, retractable, grouped by domain
// ============================================================================

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Home, Brain, Shield, User, Globe, Palette, Headphones, Users,
  BookOpen, FileText, BarChart3, DollarSign, TrendingUp, Network,
  AlertTriangle, Settings, Lock, Radio, Layers, Heart, Infinity,
  Sparkles, ChevronLeft, ChevronRight, Zap, Crown, Store,
  GraduationCap, Wallet, Gamepad2, Video, Music, PawPrint,
  Dna as DNA,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import logoImg from '@/assets/LOGOTAMV2.jpg';

interface NavItem {
  icon: any;
  label: string;
  path: string;
  badge?: string;
  color?: string;
}

interface NavGroup {
  id: string;
  title: string;
  icon: any;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'social',
    title: 'Social Hub',
    icon: Home,
    items: [
      { icon: Home, label: 'Feed Global', path: '/' },
      { icon: Users, label: 'Comunidad', path: '/community' },
      { icon: Video, label: 'Streaming', path: '/metaverse', badge: 'LIVE' },
      { icon: User, label: 'Mi Perfil', path: '/profile' },
    ],
  },
  {
    id: 'ai',
    title: 'IA & Seguridad',
    icon: Brain,
    items: [
      { icon: Brain, label: 'Isabella AI', path: '/isabella', color: '#00D9FF' },
      { icon: Shield, label: 'Anubis Sentinel', path: '/anubis', color: '#FF4444' },
      { icon: Headphones, label: 'KAOS Audio', path: '/kaos', color: '#FBBF24' },
    ],
  },
  {
    id: 'spaces',
    title: 'Espacios & XR',
    icon: Palette,
    items: [
      { icon: Palette, label: 'DreamSpaces', path: '/dream-spaces', color: '#F472B6' },
      { icon: Globe, label: 'Ecosistema', path: '/ecosystem' },
      { icon: Gamepad2, label: 'Espacio 3D', path: '/3d-space' },
    ],
  },
  {
    id: 'education',
    title: 'Universidad',
    icon: GraduationCap,
    items: [
      { icon: GraduationCap, label: 'UTAMV', path: '/university', color: '#22C55E' },
      { icon: FileText, label: 'Documentación', path: '/docs' },
      { icon: BookOpen, label: 'BookPI', path: '/bookpi', color: '#14B8A6' },
    ],
  },
  {
    id: 'economy',
    title: 'Economía',
    icon: DollarSign,
    items: [
      { icon: Wallet, label: 'NubiWallet', path: '/economy', badge: 'TCEP' },
      { icon: Store, label: 'Marketplace', path: '/monetization' },
      { icon: Crown, label: 'Membresías', path: '/monetization', badge: 'Pro' },
      { icon: TrendingUp, label: 'Blockchain MSR', path: '/economy' },
    ],
  },
  {
    id: 'governance',
    title: 'Gobernanza',
    icon: Network,
    items: [
      { icon: Network, label: 'CITEMESH DAO', path: '/governance', color: '#6366F1' },
      { icon: DNA, label: 'ID-NVIDA', path: '/profile' },
      { icon: AlertTriangle, label: 'Panel Crisis', path: '/crisis' },
      { icon: Settings, label: 'Admin', path: '/admin', badge: 'Admin' },
    ],
  },
];

export const AccordionSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Find which group contains the active route
  const activeGroupId = NAV_GROUPS.find(g =>
    g.items.some(i => isActive(i.path))
  )?.id;

  return (
    <div
      className={cn(
        'fixed left-0 top-0 h-screen z-40 transition-all duration-500 ease-in-out flex flex-col',
        'border-r border-border/20',
        collapsed ? 'w-16' : 'w-64'
      )}
      style={{
        background: 'linear-gradient(180deg, hsl(220 15% 5% / 0.97) 0%, hsl(220 15% 4% / 0.99) 100%)',
        backdropFilter: 'blur(24px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b border-border/20 flex-shrink-0">
        <Link to="/" className="flex items-center gap-3 group flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-primary/30 shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
            <img src={logoImg} alt="TAMV" className="w-full h-full object-cover" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent truncate">
                TAMV MD-X4™
              </span>
              <span className="text-[10px] text-muted-foreground">Civilizatory Nexus</span>
            </div>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 text-muted-foreground hover:text-primary flex-shrink-0"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        {collapsed ? (
          /* Collapsed: icon-only mode */
          <div className="flex flex-col items-center gap-1 py-3 px-1">
            {NAV_GROUPS.flatMap(g => g.items).slice(0, 12).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={item.path + item.label} to={item.path} title={item.label}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'w-10 h-10 transition-all',
                      active ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                    )}
                  >
                    <Icon className="w-5 h-5" style={item.color ? { color: item.color } : {}} />
                  </Button>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Expanded: accordion groups */
          <Accordion
            type="multiple"
            defaultValue={activeGroupId ? [activeGroupId] : ['social']}
            className="px-2 py-2"
          >
            {NAV_GROUPS.map((group) => {
              const GroupIcon = group.icon;
              const hasActive = group.items.some(i => isActive(i.path));
              return (
                <AccordionItem key={group.id} value={group.id} className="border-b-0">
                  <AccordionTrigger
                    className={cn(
                      'py-2 px-3 rounded-lg text-sm font-medium hover:no-underline transition-all',
                      hasActive ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <GroupIcon className="w-4 h-4" />
                      <span>{group.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-1 pt-0">
                    <div className="space-y-0.5 pl-2">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                          <Link key={item.path + item.label} to={item.path}>
                            <Button
                              variant="ghost"
                              className={cn(
                                'w-full justify-start gap-2 h-9 text-sm transition-all',
                                active
                                  ? 'bg-primary/15 text-primary font-medium'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                              )}
                            >
                              <Icon
                                className="w-4 h-4 flex-shrink-0"
                                style={item.color ? { color: item.color } : {}}
                              />
                              <span className="truncate">{item.label}</span>
                              {item.badge && (
                                <Badge
                                  variant="outline"
                                  className="ml-auto text-[10px] px-1.5 py-0 border-primary/30 text-primary"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </Button>
                          </Link>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </ScrollArea>

      {/* Footer: User */}
      <div className="p-3 border-t border-border/20 flex-shrink-0">
        <Link to="/profile">
          <Button
            variant="ghost"
            className={cn(
              'w-full gap-2 hover:bg-primary/10 transition-all',
              collapsed ? 'justify-center px-0' : 'justify-start'
            )}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-md flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))' }}
            >
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="flex flex-col items-start min-w-0">
                <span className="text-xs font-medium truncate">Mi Perfil</span>
                <span className="text-[10px] text-muted-foreground">Nivel 5</span>
              </div>
            )}
          </Button>
        </Link>
      </div>
    </div>
  );
};
