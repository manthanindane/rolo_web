import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";

// Import pages
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import RideHistory from "./pages/RideHistory";
import Settings from "./pages/Settings";
import ContactUs from "./pages/ContactUs";

// Import booking flow pages
import LocationSelect from "./pages/booking/LocationSelect";
import VehicleSelect from "./pages/booking/VehicleSelect";
import RideConfirmation from "./pages/booking/RideConfirmation";
import SearchingDriver from "./pages/booking/SearchingDriver";
import RideInProgress from "./pages/booking/RideInProgress";
import RideCompleted from "./pages/booking/RideCompleted";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Auth />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/rides" element={
        <ProtectedRoute>
          <RideHistory />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/contact" element={
        <ProtectedRoute>
          <ContactUs />
        </ProtectedRoute>
      } />
      
      {/* Booking flow routes */}
      <Route path="/booking/location" element={
        <ProtectedRoute>
          <LocationSelect />
        </ProtectedRoute>
      } />
      <Route path="/booking/vehicle" element={
        <ProtectedRoute>
          <VehicleSelect />
        </ProtectedRoute>
      } />
      <Route path="/booking/confirmation" element={
        <ProtectedRoute>
          <RideConfirmation />
        </ProtectedRoute>
      } />
      <Route path="/booking/searching" element={
        <ProtectedRoute>
          <SearchingDriver />
        </ProtectedRoute>
      } />
      <Route path="/booking/in-progress" element={
        <ProtectedRoute>
          <RideInProgress />
        </ProtectedRoute>
      } />
      <Route path="/booking/completed" element={
        <ProtectedRoute>
          <RideCompleted />
        </ProtectedRoute>
      } />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;