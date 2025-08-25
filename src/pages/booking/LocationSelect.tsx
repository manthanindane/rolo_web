import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRoloStore } from '@/store/useRoloStore';
import { ArrowLeft, MapPin, Navigation } from 'lucide-react';

export default function LocationSelect() {
  const navigate = useNavigate();
  const { bookingFlow, updateBookingFlow } = useRoloStore();
  
  const [pickup, setPickup] = useState(bookingFlow.pickup);
  const [dropoff, setDropoff] = useState(bookingFlow.dropoff);

  const handleNext = () => {
    if (!pickup || !dropoff) return;
    
    updateBookingFlow({ pickup, dropoff });
    navigate('/booking/vehicle');
  };

  const handleCurrentLocation = () => {
    setPickup('Current Location');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-4">
      <div className="flex items-center justify-between mb-6">
        <LuxuryButton
          variant="minimal"
          size="icon"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-5 w-5" />
        </LuxuryButton>
        <h1 className="text-lg font-semibold">Book a Ride</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1">
        <Card className="card-luxury animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Where are you going?
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pickup">Pickup Location</Label>
              <div className="relative">
                <Input
                  id="pickup"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Enter pickup location"
                  className="input-luxury pr-12"
                />
                <LuxuryButton
                  variant="minimal"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={handleCurrentLocation}
                >
                  <Navigation className="h-4 w-4" />
                </LuxuryButton>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dropoff">Drop-off Location</Label>
              <Input
                id="dropoff"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                placeholder="Where to?"
                className="input-luxury"
              />
            </div>
            
            <div className="pt-4">
              <LuxuryButton
                onClick={handleNext}
                className="w-full"
                size="lg"
                disabled={!pickup || !dropoff}
              >
                Next
              </LuxuryButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}