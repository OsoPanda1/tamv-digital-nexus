import { useState } from 'react';
import { Bell, X, Check, Sparkles, AlertCircle, MessageCircle, Trophy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { binauralAudio } from '@/utils/binauralAudio';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'achievement': return Trophy;
      case 'celebration': return Sparkles;
      case 'alert': return AlertCircle;
      case 'social': return MessageCircle;
      default: return Zap;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-950/20 border-red-500/30';
      case 'high': return 'text-amber-400 bg-amber-950/20 border-amber-500/30';
      case 'normal': return 'text-blue-400 bg-blue-950/20 border-blue-500/30';
      case 'low': return 'text-slate-400 bg-slate-950/20 border-slate-500/30';
      default: return 'text-blue-400 bg-blue-950/20 border-blue-500/30';
    }
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
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
      { x: 0, y: 0, z: -1 }
    );
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative glass-morphism hover:bg-primary/20"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-xs font-bold text-black"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full md:w-[480px] glass-morphism border-l border-white/10 z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gradient bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-600">
                    Notificaciones
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    className="flex-1"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Marcar todas
                  </Button>
                  <Badge variant="secondary" className="px-3">
                    {unreadCount} sin leer
                  </Badge>
                </div>
              </div>

              {/* Notifications List */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-12"
                    >
                      <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                      <p className="text-muted-foreground">No hay notificaciones</p>
                    </motion.div>
                  ) : (
                    notifications.map((notification, index) => {
                      const Icon = getCategoryIcon(notification.category);
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-4 rounded-xl border transition-all cursor-pointer ${
                            notification.read
                              ? 'bg-background/40 border-white/5'
                              : getPriorityColor(notification.priority)
                          } hover:scale-[1.02] hover:border-cyan-400/50`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex gap-3">
                            <div className={`p-2 rounded-lg ${
                              notification.read ? 'bg-muted' : 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20'
                            }`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="font-semibold text-sm">{notification.title}</h4>
                                {!notification.read && (
                                  <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                                )}
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(notification.created_at).toLocaleString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    day: '2-digit',
                                    month: 'short'
                                  })}
                                </span>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
