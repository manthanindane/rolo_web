import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRoloStore } from '@/store/useRoloStore';
import { Star, CheckCircle, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RideCompleted() {
  const navigate = useNavigate();
  const { currentBooking, updateRide, resetBookingFlow } = useRoloStore();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleRatingSubmit = () => {
    if (currentBooking && rating > 0) {
      updateRide(currentBooking.id, { 
        status: 'completed',
        rating 
      });
    }
    
    resetBookingFlow();
    navigate('/dashboard');
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 bg-success/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Trip Completed!</h1>
          <p className="text-muted-foreground">
            Thank you for choosing Rolo luxury service
          </p>
        </div>

        <Card className="card-luxury animate-slide-up">
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
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Fare</span>
                <span className="text-xl font-bold">${currentBooking.price}</span>
              </div>
              
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Vehicle: {currentBooking.vehicle.name}</span>
                <span>Driver: {currentBooking.driver?.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-luxury animate-slide-up" style={{ animationDelay: '0.1s' }}>
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
            
            <LuxuryButton
              onClick={handleRatingSubmit}
              className="w-full mb-3"
              disabled={rating === 0}
            >
              Submit Rating
            </LuxuryButton>
            
            <LuxuryButton
              variant="ghost"
              onClick={handleBookAgain}
              className="w-full"
            >
              Book Another Ride
            </LuxuryButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}