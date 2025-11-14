import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/metaverse" element={<Metaverse />} />
          <Route path="/community" element={<Community />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/isabella" element={<Isabella />} />
          <Route path="/anubis" element={<Anubis />} />
          <Route path="/kaos" element={<Kaos />} />
          <Route path="/ecosystem" element={<Ecosystem />} />
          <Route path="/dream-spaces" element={<DreamSpaces />} />
          <Route path="/university" element={<University />} />
          <Route path="/bookpi" element={<BookPI />} />
          <Route path="/3d-space" element={<ThreeDSpace />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/monetization" element={<Monetization />} />
          <Route path="/crisis" element={<Crisis />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
