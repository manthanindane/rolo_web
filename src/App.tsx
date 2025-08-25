import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useRoloStore } from "@/store/useRoloStore";

// Import pages
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import RideHistory from "./pages/RideHistory";

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
  const { isAuthenticated } = useRoloStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
