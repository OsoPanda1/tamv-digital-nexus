import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Trophy, AlertCircle, MessageCircle, Zap } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { binauralAudio } from '@/utils/binauralAudio';
import Confetti from 'react-confetti';

export const NotificationToast = () => {
  const { notifications } = useNotifications();
  const [activeToasts, setActiveToasts] = useState<any[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const unreadNotifications = notifications.filter(n => !n.read).slice(0, 3);
    
    unreadNotifications.forEach(notification => {
      if (!activeToasts.find(t => t.id === notification.id)) {
        setActiveToasts(prev => [...prev, notification]);
        
        // Play binaural audio
        const categoryMap: Record<string, 'achievement' | 'alert' | 'social' | 'celebration' | 'system'> = {
          achievement: 'achievement',
          celebration: 'celebration',
          alert: 'alert',
          social: 'social',
          system: 'system'
        };
        
        binauralAudio.playNotificationSound(
          categoryMap[notification.category] || 'system',
          { x: 1, y: 0, z: -1 }
        );

        // Celebration confetti
        if (notification.category === 'celebration' || notification.category === 'achievement') {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }

        // Auto remove after 7 seconds
        setTimeout(() => {
          setActiveToasts(prev => prev.filter(t => t.id !== notification.id));
        }, 7000);
      }
    });
  }, [notifications]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'achievement': return Trophy;
      case 'celebration': return Sparkles;
      case 'alert': return AlertCircle;
      case 'social': return MessageCircle;
      default: return Zap;
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-red-500/50 bg-gradient-to-r from-red-950/90 to-red-900/90 shadow-lg shadow-red-500/20';
      case 'high':
        return 'border-amber-500/50 bg-gradient-to-r from-amber-950/90 to-amber-900/90 shadow-lg shadow-amber-500/20';
      case 'normal':
        return 'border-cyan-500/50 bg-gradient-to-r from-cyan-950/90 to-blue-950/90 shadow-lg shadow-cyan-500/20';
      case 'low':
        return 'border-slate-500/50 bg-gradient-to-r from-slate-950/90 to-slate-900/90 shadow-lg shadow-slate-500/20';
      default:
        return 'border-blue-500/50 bg-gradient-to-r from-blue-950/90 to-blue-900/90 shadow-lg shadow-blue-500/20';
    }
  };

  const removeToast = (id: string) => {
    setActiveToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          colors={['#06b6d4', '#0ea5e9', '#3b82f6', '#60a5fa', '#93c5fd']}
        />
      )}
      
      <div className="fixed top-4 right-4 z-[100] space-y-3 pointer-events-none">
        <AnimatePresence>
          {activeToasts.map((toast, index) => {
            const Icon = getCategoryIcon(toast.category);
            
            return (
              <motion.div
                key={toast.id}
                initial={{ x: 400, opacity: 0, scale: 0.8 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 400, opacity: 0, scale: 0.8 }}
                transition={{
                  type: 'spring',
                  damping: 25,
                  stiffness: 300,
                  delay: index * 0.1
                }}
                className={`
                  w-96 p-4 rounded-xl border-2 backdrop-blur-xl
                  pointer-events-auto
                  ${getPriorityStyles(toast.priority)}
                `}
              >
                <div className="flex gap-3">
                  {/* Icon with glow effect */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg blur-lg opacity-50" />
                    <div className="relative p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                      <Icon className="h-6 w-6 text-cyan-400" />
                    </div>
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                      {toast.title}
                      {toast.priority === 'urgent' && (
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          className="text-red-400"
                        >
                          🔴
                        </motion.span>
                      )}
                    </h4>
                    <p className="text-sm text-slate-200 line-clamp-2">
                      {toast.message}
                    </p>

                    {/* Celebration sparkles */}
                    {(toast.category === 'celebration' || toast.category === 'achievement') && (
                      <div className="flex gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, rotate: 0 }}
                            animate={{
                              scale: [0, 1, 0],
                              rotate: [0, 180, 360],
                              y: [0, -20, 0]
                            }}
                            transition={{
                              duration: 2,
                              delay: i * 0.2,
                              repeat: Infinity
                            }}
                          >
                            <Sparkles className="h-3 w-3 text-yellow-400" />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => removeToast(toast.id)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Progress bar */}
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 7, ease: 'linear' }}
                  className="h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mt-3"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
};
