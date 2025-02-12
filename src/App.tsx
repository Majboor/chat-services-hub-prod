
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AnonymousMessage from "./pages/AnonymousMessage";
import EWhatsAppSim from "./pages/EWhatsAppSim";
import OTPService from "./pages/OTPService";
import MarketingLeads from "./pages/MarketingLeads";
import BulkSurveys from "./pages/BulkSurveys";
import APIIntegration from "./pages/APIIntegration";
import TradingBot from "./pages/TradingBot";
import AlertsService from "./pages/AlertsService";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/anonymous-message" element={<AnonymousMessage />} />
          <Route path="/e-whatsapp-sim" element={<EWhatsAppSim />} />
          <Route path="/otp-service" element={<OTPService />} />
          <Route path="/marketing-leads" element={<MarketingLeads />} />
          <Route path="/bulk-surveys" element={<BulkSurveys />} />
          <Route path="/api-integration" element={<APIIntegration />} />
          <Route path="/trading-bot" element={<TradingBot />} />
          <Route path="/alerts-service" element={<AlertsService />} />
          {/* Add routes for other pages */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
