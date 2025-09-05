import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Workspace from "./pages/Workspace";
import Landing from "./pages/Landing";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing page is now the root */}
          <Route path="/" element={<Landing />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          
          {/* App routes under /app */}
          <Route path="/app" element={<Home />} />
          <Route path="/app/workspace" element={<Workspace />} />
          <Route path="/app/workspace/:id" element={<Workspace />} />
          <Route path="/app/methodologies" element={<Home />} />
          
          {/* Legacy redirects for backward compatibility */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/workspace" element={<Index />} />
          <Route path="/workspace/:id" element={<Index />} />
          <Route path="/methodologies" element={<Index />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
