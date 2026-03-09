// ============================================================================
// TAMV MD-X4™ - Main Application Entry
// Ecosystem Civilizatory Digital Mexicano
// OMNI-KERNEL Integration Active
// ============================================================================

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// OMNI-KERNEL Provider
import { OmniKernelProvider } from "@/lib/omni-kernel";

// Layout System
import { AppLayout } from "@/components/layout/AppLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
import MDXOperations from "./pages/MDXOperations";
import MembershipOnboarding from "./pages/MembershipOnboarding";
import Evolution from "./pages/Evolution";
import Singularity from "./pages/Singularity";
import Reels from "./pages/Reels";
import Health from "./pages/Health";
import RepoUnification from "./pages/RepoUnification";

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
        <OmniKernelProvider workflowId="tamv-main">
          <AppLayout>
            <ErrorBoundary>
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

              {/* MD-X Operations & OMNI-KERNEL */}
              <Route path="/operations" element={<MDXOperations />} />
              <Route path="/evolution" element={<Evolution />} />
              <Route path="/singularity" element={<Singularity />} />
              <Route path="/reels" element={<Reels />} />
              <Route path="/health" element={<Health />} />
              <Route path="/onboarding/membership" element={<MembershipOnboarding />} />
              <Route path="/repo-unification" element={<RepoUnification />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </ErrorBoundary>
          </AppLayout>
        </OmniKernelProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
