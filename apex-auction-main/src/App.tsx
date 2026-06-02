import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import LiveAuction from "./pages/LiveAuction";
import Leaderboard from "./pages/Leaderboard";
import Auth from "./pages/Auth";
import SellerDashboard from "./pages/SellerDashboard";
import SellerCreateListing from "./pages/SellerCreateListing";
import AdminSellerRequests from "./pages/AdminSellerRequests";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/live" element={<LiveAuction />} />
            <Route path="/live/:id" element={<LiveAuction />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/seller/create" element={<SellerCreateListing />} />
            <Route path="/admin/seller-requests" element={<AdminSellerRequests />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
