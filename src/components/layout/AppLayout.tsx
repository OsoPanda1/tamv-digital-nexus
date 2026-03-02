// ============================================================================
// TAMV MD-X4™ - App Layout
// Orchestrates: AccordionSidebar (left) + Content + SmartFloatingBar (right)
// ============================================================================

import { ReactNode } from 'react';
import { AccordionSidebar } from './AccordionSidebar';
import { SmartFloatingBar } from './SmartFloatingBar';
import { UnifiedBackground } from '@/components/UnifiedBackground';
import { IsabellaChat } from '@/components/IsabellaChat';
import { NotificationToast } from '@/components/notifications/NotificationToast';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      {/* UNIFIED BACKGROUND */}
      <UnifiedBackground mode="matrix" intensity={0.35} />

      {/* LEFT: Accordion Sidebar */}
      <AccordionSidebar />

      {/* RIGHT: Smart Floating Bar */}
      <SmartFloatingBar />

      {/* Isabella AI Chat Widget */}
      <IsabellaChat />

      {/* Notification System */}
      <NotificationToast />

      {/* MAIN CONTENT - adapts to sidebar */}
      <main className="ml-16 lg:ml-64 mr-16 transition-all duration-500 relative z-20 min-h-screen">
        {children}
      </main>
    </div>
  );
};
