import { useNavigate } from 'react-router-dom';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { Card, CardContent } from '@/components/ui/card';
import { useRoloStore } from '@/store/useRoloStore';
import { Phone, MessageCircle, Star, MapPin, Clock } from 'lucide-react';
import { useEffect } from 'react';

export default function RideInProgress() {
  const navigate = useNavigate();
  const { currentBooking } = useRoloStore();

  useEffect(() => {
    // Simulate ride completion after 10 seconds
    const timer = setTimeout(() => {
      navigate('/booking/completed');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (!currentBooking?.driver) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Map Area - Mock */}
      <div className="flex-1 bg-gradient-subtle relative overflow-hidden">
        <div className="absolute inset-0 bg-luxury-gray-100 flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
            <p className="text-lg font-semibold">Live Map</p>
            <p className="text-sm text-muted-foreground">Tracking your luxury ride</p>
          </div>
        </div>
        
        {/* Floating ETA Card */}
        <div className="absolute top-6 left-4 right-4">
          <Card className="card-luxury">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span className="text-sm font-medium">In Transit</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Estimated arrival: 8 minutes
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold">${currentBooking.price}</p>
                  <p className="text-xs text-muted-foreground">Total fare</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Driver Info Panel */}
      <div className="p-4 space-y-4">
        <Card className="card-luxury animate-slide-up">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {currentBooking.driver.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                
                <div>
                  <h3 className="font-semibold">{currentBooking.driver.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                    <span className="text-sm text-muted-foreground">
                      {currentBooking.driver.rating}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <LuxuryButton variant="outline" size="icon">
                  <MessageCircle className="h-4 w-4" />
                </LuxuryButton>
                <LuxuryButton variant="outline" size="icon">
                  <Phone className="h-4 w-4" />
                </LuxuryButton>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vehicle:</span>
                <span className="font-medium">{currentBooking.driver.car}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plate Number:</span>
                <span className="font-mono font-medium">{currentBooking.driver.plateNumber}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trip Progress */}
        <Card className="card-minimal">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-success rounded-full mt-1" />
                <div>
                  <p className="font-medium text-sm">Picked up</p>
                  <p className="text-xs text-muted-foreground">{currentBooking.pickup}</p>
                </div>
              </div>
              
              <div className="ml-1.5 border-l-2 border-dashed border-primary h-6" />
              
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-primary rounded-full mt-1 animate-pulse" />
                <div>
                  <p className="font-medium text-sm">En route to destination</p>
                  <p className="text-xs text-muted-foreground">{currentBooking.dropoff}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}