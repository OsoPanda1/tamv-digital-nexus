import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export const HolographicPanel = ({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`
        glass-panel relative overflow-hidden
        border border-primary/30 rounded-2xl
        before:absolute before:inset-0 
        before:bg-gradient-to-br before:from-primary/10 before:to-secondary/10
        before:animate-pulse before:duration-3000
        after:absolute after:inset-0 after:rounded-2xl
        after:bg-gradient-to-tr after:from-transparent after:via-white/5 after:to-transparent
        shadow-quantum
        ${className}
      `}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export const HolographicButton = ({ 
  children, 
  onClick,
  variant = 'primary',
  className = ''
}: { 
  children: ReactNode; 
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}) => {
  const variants = {
    primary: 'bg-quantum-gradient text-white shadow-quantum hover:shadow-glow',
    secondary: 'bg-secondary/20 border-2 border-secondary text-secondary hover:bg-secondary/30',
    ghost: 'bg-transparent border border-primary/30 hover:bg-primary/10'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        px-6 py-3 rounded-xl font-semibold
        transition-all duration-300
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};

export const QuantumBadge = ({ 
  children, 
  color = 'primary' 
}: { 
  children: ReactNode; 
  color?: 'primary' | 'secondary' | 'accent';
}) => {
  const colors = {
    primary: 'bg-primary/20 text-primary border-primary',
    secondary: 'bg-secondary/20 text-secondary border-secondary',
    accent: 'bg-accent/20 text-accent border-accent'
  };

  return (
    <span className={`
      inline-flex items-center gap-2 px-3 py-1 rounded-full
      border ${colors[color]}
      text-sm font-medium
      shadow-glow
    `}>
      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
      {children}
    </span>
  );
};

export const NeuralGrid = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full">
          <defs>
            <pattern id="neural-grid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="1" fill="currentColor" className="text-primary" />
              <line x1="25" y1="25" x2="50" y2="25" stroke="currentColor" strokeWidth="0.5" className="text-primary/30" />
              <line x1="25" y1="25" x2="25" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-primary/30" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-grid)" />
        </svg>
      </div>
    </div>
  );
};
