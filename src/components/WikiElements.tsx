import { motion } from "framer-motion";
import { ReactNode } from "react";
import { LucideIcon, Info, AlertTriangle, CheckCircle } from "lucide-react";

interface InfoCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant?: "gold" | "cyan";
}

export function InfoCard({ title, description, icon: Icon, variant = "gold" }: InfoCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className={`glass-panel rounded-xl p-5 border ${
        variant === "gold" ? "border-primary/30 hover:border-primary/50" : "border-cyan-500/30 hover:border-cyan-500/50"
      } transition-colors`}
    >
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
          variant === "gold" ? "bg-primary/20 text-primary" : "bg-cyan-500/20 text-cyan-400"
        }`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}

interface SectionProps {
  title: string;
  children: ReactNode;
  id?: string;
  icon?: LucideIcon;
}

export function Section({ title, children, id, icon: Icon }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20 space-y-4">
      <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 border-l-4 border-primary pl-4">
        {Icon ? <Icon className="w-6 h-6 text-primary" /> : null}
        {title}
      </h2>
      <div className="text-muted-foreground leading-relaxed space-y-4">{children}</div>
    </section>
  );
}

interface InfoBoxProps {
  type?: "info" | "warning" | "success";
  title?: string;
  children: ReactNode;
}

const typeStyles = {
  info: {
    border: "border-primary/30",
    bg: "bg-primary/5",
    icon: Info,
    iconColor: "text-primary",
  },
  warning: {
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/5",
    icon: AlertTriangle,
    iconColor: "text-yellow-500",
  },
  success: {
    border: "border-green-500/30",
    bg: "bg-green-500/5",
    icon: CheckCircle,
    iconColor: "text-green-500",
  },
};

export function InfoBox({ type = "info", title, children }: InfoBoxProps) {
  const styles = typeStyles[type];
  const Icon = styles.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`rounded-lg border ${styles.border} ${styles.bg} p-4`}
    >
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 ${styles.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="space-y-1">
          {title && (
            <p className={`font-semibold ${styles.iconColor}`}>{title}</p>
          )}
          <div className="text-muted-foreground text-sm">{children}</div>
        </div>
      </div>
    </motion.div>
  );
}
