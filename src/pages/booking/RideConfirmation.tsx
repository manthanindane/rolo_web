import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRoloStore } from '@/store/useRoloStore';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, MapPin, Car, Clock, CreditCard } from 'lucide-react';

export default function RideConfirmation() {
  const navigate = useNavigate();
  const { bookingFlow, setCurrentBooking } = useRoloStore();
  const { createRide } = useSupabaseData();
  const { toast } = useToast();
  const [isBooking, setIsBooking] = useState(false);

  const handleConfirmBooking = async () => {
    if (!bookingFlow.selectedVehicle || !bookingFlow.estimatedPrice) {
      toast({
        variant: "destructive",
        title: "Booking Error",
        description: "Please select a vehicle first",
      });
      return;
    }

    setIsBooking(true);

    try {
      const { data, error } = await createRide({
        pickup_location: bookingFlow.pickup,
        dropoff_location: bookingFlow.dropoff,
        vehicle_id: bookingFlow.selectedVehicle.id,
        estimated_price: bookingFlow.estimatedPrice
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Booking Failed",
          description: error.message,
        });
        return;
      }

      if (data) {
        setCurrentBooking(data);
        toast({
          title: "Ride Booked!",
          description: "Finding your driver...",
        });
        navigate('/booking/searching');
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (!bookingFlow.selectedVehicle) {
    navigate('/booking/location');
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col p-4">
      <div className="flex items-center justify-between mb-6">
        <LuxuryButton
          variant="minimal"
          size="icon"
          onClick={() => navigate('/booking/vehicle')}
        >
          <ArrowLeft className="h-5 w-5" />
        </LuxuryButton>
        <h1 className="text-lg font-semibold">Confirm Booking</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 space-y-6">
        {/* Trip Details */}
        <Card className="card-luxury animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Trip Details
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-primary rounded-full mt-1" />
                <div>
                  <p className="font-medium">Pickup</p>
                  <p className="text-sm text-muted-foreground">{bookingFlow.pickup}</p>
                </div>
              </div>
              
              <div className="ml-1.5 border-l-2 border-dashed border-muted h-6" />
              
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-destructive rounded-full mt-1" />
                <div>
                  <p className="font-medium">Drop-off</p>
                  <p className="text-sm text-muted-foreground">{bookingFlow.dropoff}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Details */}
        <Card className="card-luxury animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <Car className="h-8 w-8 text-muted-foreground" />
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">{bookingFlow.selectedVehicle.name}</h3>
                  <p className="text-sm text-muted-foreground">{bookingFlow.selectedVehicle.description}</p>
                  <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Arrives in {bookingFlow.selectedVehicle.eta}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold">${bookingFlow.estimatedPrice}</p>
                <p className="text-sm text-muted-foreground">Estimated fare</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="card-luxury animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium">Payment Method</p>
                  <p className="text-sm text-muted-foreground">•••• •••• •••• 4242</p>
                </div>
              </div>
              
              <LuxuryButton variant="ghost" size="sm">
                Change
              </LuxuryButton>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-6">
        <LuxuryButton
          onClick={handleConfirmBooking}
          disabled={isBooking}
          className="w-full"
          size="lg"
        >
          {isBooking ? 'Booking...' : 'Confirm Booking'}
        </LuxuryButton>
        
        <p className="text-xs text-center text-muted-foreground mt-3">
          By confirming, you agree to our terms and conditions
        </p>
      </div>
    </div>
  );
}