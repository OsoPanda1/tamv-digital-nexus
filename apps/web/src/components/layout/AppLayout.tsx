// ============================================================================
// TAMV MD-X4™ - App Layout v2.0
// Clean layout: Sidebar + Content. Background handled by UnifiedBackground.
// ============================================================================

import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { AccordionSidebar } from './AccordionSidebar';
import { SmartFloatingBar } from './SmartFloatingBar';
import { UnifiedBackground } from '@/components/UnifiedBackground';
import { IsabellaChat } from '@/components/IsabellaChat';
import { NotificationToast } from '@/components/notifications/NotificationToast';

interface AppLayoutProps {
  children: ReactNode;
}

// Pages that handle their own visuals (cinematic intro, etc.)
const FULL_SCREEN_ROUTES = ['/auth'];

export const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const isFullScreen = FULL_SCREEN_ROUTES.includes(location.pathname);

  if (isFullScreen) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden monolith-noir-shell">
      {/* 3D Matrix Background — renders globally */}
      <UnifiedBackground mode="matrix" intensity={0.4} />

      {/* LEFT: Accordion Sidebar */}
      <AccordionSidebar />

      {/* RIGHT: Smart Floating Bar */}
      <SmartFloatingBar />

      {/* Isabella AI Chat Widget */}
      <IsabellaChat />

      {/* Notification System */}
      <NotificationToast />

      {/* MAIN CONTENT */}
      <main className="ml-16 lg:ml-64 mr-16 transition-all duration-500 relative z-20 min-h-screen">
        {children}
      </main>
    </div>
  );
};
