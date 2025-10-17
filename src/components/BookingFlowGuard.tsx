import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRoloStore } from '@/store/useRoloStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { ArrowLeft, Car, MapPin } from 'lucide-react';

interface BookingFlowGuardProps {
  children: React.ReactNode;
  requiredStep: 'location' | 'vehicle' | 'confirmation' | 'searching' | 'in-progress' | 'completed';
}

const BookingFlowGuard: React.FC<BookingFlowGuardProps> = ({ children, requiredStep }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingFlow, resetBookingFlow } = useRoloStore();

  const getStepOrder = (step: string): number => {
    const order = {
      'location': 1,
      'vehicle': 2,
      'confirmation': 3,
      'searching': 4,
      'in-progress': 5,
      'completed': 6
    };
    return order[step as keyof typeof order] || 0;
  };

  const getCurrentStep = (): string => {
    if (!bookingFlow.pickup || !bookingFlow.dropoff) return 'location';
    if (!bookingFlow.selectedVehicle) return 'vehicle';
    if (!bookingFlow.estimatedPrice) return 'confirmation';
    return 'confirmation';
  };

  const currentStep = getCurrentStep();
  const requiredStepOrder = getStepOrder(requiredStep);
  const currentStepOrder = getStepOrder(currentStep);

  useEffect(() => {
    // If user is trying to access a step they shouldn't be on
    if (currentStepOrder < requiredStepOrder) {
      console.warn(`Booking flow guard: Redirecting from ${requiredStep} to ${currentStep}`);
      navigate(`/booking/${currentStep}`);
    }
  }, [currentStep, requiredStep, navigate, currentStepOrder, requiredStepOrder]);

  // If user is on the wrong step, show a redirect message
  if (currentStepOrder < requiredStepOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1F36] to-[#0A0A0A] text-white flex items-center justify-center p-4">
        <Card className="card-luxury max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-[#00D1C1]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="h-8 w-8 text-[#00D1C1]" />
            </div>
            <CardTitle className="text-white">Complete Your Booking</CardTitle>
            <p className="text-white/70 text-sm mt-2">
              Please complete the previous steps to continue with your booking.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <LuxuryButton
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </LuxuryButton>
              <LuxuryButton
                onClick={() => navigate(`/booking/${currentStep}`)}
                className="flex-1"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Continue Booking
              </LuxuryButton>
            </div>
            
            <div className="pt-4 border-t border-white/10">
              <LuxuryButton
                variant="ghost"
                onClick={() => {
                  resetBookingFlow();
                  navigate('/booking/location');
                }}
                className="w-full text-white/70 hover:text-white"
              >
                Start New Booking
              </LuxuryButton>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default BookingFlowGuard;
