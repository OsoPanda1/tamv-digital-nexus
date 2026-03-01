// ============================================================================
// TAMV MD-X4™ - Main Application Entry
// Ecosystem Civilizatory Digital Mexicano
// ============================================================================

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout System
import { AppLayout } from "@/components/layout/AppLayout";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Metaverse from "./pages/Metaverse";
import Community from "./pages/Community";
import Docs from "./pages/Docs";
import Profile from "./pages/Profile";
import Isabella from "./pages/Isabella";
import Anubis from "./pages/Anubis";
import Kaos from "./pages/Kaos";
import Ecosystem from "./pages/Ecosystem";
import DreamSpaces from "./pages/DreamSpaces";
import University from "./pages/University";
import BookPI from "./pages/BookPI";
import ThreeDSpace from "./pages/ThreeDSpace";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Monetization from "./pages/Monetization";
import Crisis from "./pages/Crisis";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Gifts from "./pages/Gifts";
import Governance from "./pages/Governance";
import Economy from "./pages/Economy";

// Configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

// ============================================================================
// Main App Component
// ============================================================================

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />

      <BrowserRouter>
        <AppLayout>
          <Routes>
            {/* Core Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/metaverse" element={<Metaverse />} />
            <Route path="/community" element={<Community />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/profile" element={<Profile />} />

            {/* AI & Security */}
            <Route path="/isabella" element={<Isabella />} />
            <Route path="/anubis" element={<Anubis />} />
            <Route path="/kaos" element={<Kaos />} />

            {/* Ecosystem */}
            <Route path="/ecosystem" element={<Ecosystem />} />
            <Route path="/dream-spaces" element={<DreamSpaces />} />
            <Route path="/university" element={<University />} />
            <Route path="/bookpi" element={<BookPI />} />
            <Route path="/3d-space" element={<ThreeDSpace />} />

            {/* Auth & Onboarding */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Economy & Governance */}
            <Route path="/monetization" element={<Monetization />} />
            <Route path="/gifts" element={<Gifts />} />
            <Route path="/governance" element={<Governance />} />
            <Route path="/economy" element={<Economy />} />

            {/* Admin & Crisis */}
            <Route path="/crisis" element={<Crisis />} />
            <Route path="/admin" element={<Admin />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
