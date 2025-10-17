import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRoloStore } from '@/store/useRoloStore';
import { Star, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { initializePayment } from '@/utils/razorpayUtils';
import BookingFlowGuard from '@/components/BookingFlowGuard';

export default function RideCompleted() {
  const navigate = useNavigate();
  const { currentBooking, updateRide, resetBookingFlow } = useRoloStore();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isPaying, setIsPaying] = useState(false);

  const handlePayNow = async () => {
    if (!currentBooking) return;
    try {
      setIsPaying(true);
      await initializePayment({
        bookingFlow: { estimatedPrice: currentBooking.price },
        onSuccess: async () => {
          if (currentBooking?.id) {
            await updateRide(currentBooking.id, { status: 'completed' });
          }
        },
        onFailure: () => {}
      });
    } finally {
      setIsPaying(false);
    }
  };

  const handleRatingSubmit = () => {
    if (currentBooking && rating > 0) {
      updateRide(currentBooking.id, { 
        rating 
      });
    }
  };

  const handleBookAgain = () => {
    resetBookingFlow();
    navigate('/booking/location');
  };

  if (!currentBooking) {
    navigate('/dashboard');
    return null;
  }

  return (
    <BookingFlowGuard requiredStep="completed">
      <div className="min-h-screen bg-[#0A0A0B] relative overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F36]/15 via-transparent to-[#00D1C1]/8"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#00D1C1]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-[#1A1F36]/8 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto p-4 md:p-8 space-y-6">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 bg-success/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Trip Completed!</h1>
          <p className="text-white/60">
            Thank you for choosing Rolo luxury service
          </p>
        </div>

        <Card className="bg-black/40 border-white/10 backdrop-blur-xl rounded-2xl animate-slide-up">
          <CardHeader>
            <CardTitle className="text-center">Trip Summary</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-primary rounded-full mt-1" />
                <div className="flex-1">
                  <p className="font-medium text-sm">From</p>
                  <p className="text-sm text-muted-foreground">{currentBooking.pickup}</p>
                </div>
              </div>
              
              <div className="ml-1.5 border-l-2 border-dashed border-muted h-4" />
              
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-success rounded-full mt-1" />
                <div className="flex-1">
                  <p className="font-medium text-sm">To</p>
                  <p className="text-sm text-muted-foreground">{currentBooking.dropoff}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Fare</span>
                <span className="text-xl font-bold">${currentBooking.price}</span>
              </div>
              
              <div className="flex justify-between text-sm text-white/60 mt-1">
                <span>Vehicle: {currentBooking.vehicle.name}</span>
                <span>Driver: {currentBooking.driver?.name}</span>
              </div>
              <LuxuryButton className="w-full mt-4" onClick={handlePayNow} disabled={isPaying}>
                {isPaying ? 'Opening Payment...' : 'Pay Now'}
              </LuxuryButton>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10 backdrop-blur-xl rounded-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-6">
            <h3 className="font-semibold text-center mb-4">Rate Your Experience</h3>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      (star <= (hoveredRating || rating))
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-muted-foreground"
                    )}
                  />
                </button>
              ))}
            </div>
            
            <LuxuryButton onClick={handleRatingSubmit} className="w-full mb-3" disabled={rating === 0}>
              Submit Rating
            </LuxuryButton>
            <LuxuryButton variant="ghost" className="w-full" disabled={true}>
              Complete payment to book another ride
            </LuxuryButton>
          </CardContent>
        </Card>
      </div>
    </div>
    </BookingFlowGuard>
  );
}