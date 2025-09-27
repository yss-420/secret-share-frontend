
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import ScenarioSelection from "./pages/ScenarioSelection";
import Showdown from "./pages/Showdown";
import Store from "./pages/Store";
import Settings from "./pages/Settings";
import LanguageSelection from "./pages/LanguageSelection";
import HelpCenter from "./pages/HelpCenter";
import ContactSupport from "./pages/ContactSupport";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/character/:name" element={<ScenarioSelection />} />
            <Route path="/showdown" element={<Showdown />} />
            <Route path="/store" element={<Store />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/language-selection" element={<LanguageSelection />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/contact-support" element={<ContactSupport />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
