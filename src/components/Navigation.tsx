import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Compass, Users, FileText, User, Sparkles } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Inicio", icon: Home },
    { path: "/ecosystem", label: "Ecosistema", icon: Sparkles },
    { path: "/isabella", label: "Isabella AI", icon: Sparkles },
    { path: "/metaverse", label: "Metaverse", icon: Compass },
    { path: "/community", label: "Community", icon: Users },
    { path: "/docs", label: "Docs", icon: FileText },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-quantum-gradient flex items-center justify-center shadow-quantum">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold glow-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              TAMV MD-X4™
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`gap-2 transition-all duration-300 ${
                      isActive
                        ? "bg-primary shadow-quantum"
                        : "hover:bg-primary/20 hover:shadow-glow"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          <Button className="bg-quantum-gradient shadow-quantum hover:shadow-glow transition-all duration-300 hover:scale-105">
            Conectar
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
