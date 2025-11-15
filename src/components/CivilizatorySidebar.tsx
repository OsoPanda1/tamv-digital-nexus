import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Home, Sparkles, Globe, Users, BookOpen, Shield, 
  BarChart3, Settings, Brain, Zap, ChevronLeft, 
  ChevronRight, Crown, DollarSign, FileText, AlertTriangle,
  Headphones, Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavSection {
  title: string;
  items: {
    icon: any;
    label: string;
    path: string;
    badge?: string;
    epicBadge?: boolean;
  }[];
}

export const CivilizatorySidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navSections: NavSection[] = [
    {
      title: 'Core Axioms',
      items: [
        { icon: Home, label: 'Dashboard', path: '/dashboard' },
        { icon: Brain, label: 'Isabella AI', path: '/isabella', epicBadge: true },
        { icon: Shield, label: 'Anubis Sentinel', path: '/anubis' },
        { icon: Sparkles, label: 'Quantum Identity', path: '/profile' },
      ],
    },
    {
      title: 'Infrastructure',
      items: [
        { icon: Globe, label: 'Ecosystem', path: '/ecosystem' },
        { icon: Palette, label: 'DreamSpaces', path: '/dream-spaces', epicBadge: true },
        { icon: Headphones, label: 'KAOS Audio', path: '/kaos' },
        { icon: Users, label: 'Community', path: '/community' },
      ],
    },
    {
      title: 'University Core',
      items: [
        { icon: BookOpen, label: 'Academia', path: '/university' },
        { icon: FileText, label: 'Documentation', path: '/docs' },
        { icon: BarChart3, label: 'Analytics', path: '/dashboard' },
      ],
    },
    {
      title: 'Marketplace',
      items: [
        { icon: DollarSign, label: 'Monetization', path: '/monetization', badge: 'Pro' },
        { icon: Crown, label: 'Memberships', path: '/monetization' },
      ],
    },
    {
      title: 'Governance',
      items: [
        { icon: Shield, label: 'BookPI', path: '/bookpi' },
        { icon: AlertTriangle, label: 'Crisis Panel', path: '/crisis' },
        { icon: Settings, label: 'Admin', path: '/admin', badge: 'Admin' },
      ],
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      className={cn(
        'fixed left-0 top-0 h-screen glass-metallic border-r border-aqua/20 z-40 transition-all duration-500 ease-in-out',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-6 z-50 w-8 h-8 rounded-full bg-navy-metallic border-2 border-aqua shadow-aqua hover:shadow-epic transition-all duration-300"
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
          <div className="w-10 h-10 rounded-lg bg-epic-gradient flex items-center justify-center shadow-epic animate-pulse-aqua">
            <Sparkles className="w-6 h-6 text-background" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold glow-aqua bg-gradient-to-r from-aqua via-navy-metallic to-silver bg-clip-text text-transparent">
                TAMV MD-X4™
              </span>
              <span className="text-xs text-silver-dark">Civilizatory System</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="px-3 py-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-2">
              {!collapsed && (
                <h3 className="px-3 text-xs font-semibold text-silver-dark uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link key={item.path} to={item.path}>
                      <Button
                        variant="ghost"
                        className={cn(
                          'w-full justify-start gap-3 transition-all duration-300 group',
                          collapsed ? 'px-3' : 'px-4',
                          active
                            ? 'bg-aqua/20 text-aqua shadow-aqua border-l-4 border-aqua'
                            : 'hover:bg-navy/20 hover:text-aqua hover:border-l-4 hover:border-aqua/50'
                        )}
                      >
                        <Icon
                          className={cn(
                            'w-5 h-5 transition-transform duration-300 group-hover:scale-110',
                            active && 'text-aqua',
                            item.epicBadge && 'animate-pulse-aqua'
                          )}
                        />
                        {!collapsed && (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm font-medium">{item.label}</span>
                            {item.badge && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-aqua/20 text-aqua border border-aqua/30">
                                {item.badge}
                              </span>
                            )}
                            {item.epicBadge && (
                              <Zap className="w-4 h-4 text-aqua animate-pulse" />
                            )}
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
            <div className="w-8 h-8 rounded-full bg-epic-gradient flex items-center justify-center shadow-aqua">
              <Sparkles className="w-4 h-4 text-background" />
            </div>
            {!collapsed && (
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-foreground">User Profile</span>
                <span className="text-xs text-silver-dark">Quantum Level 5</span>
              </div>
            )}
          </Button>
        </Link>
      </div>
    </div>
  );
};
