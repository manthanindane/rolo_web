import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { Card, CardContent } from '@/components/ui/card';
import { useRoloStore } from '@/store/useRoloStore';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { ArrowLeft, Car, Users, Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VehicleSelect() {
  const navigate = useNavigate();
  const { vehicles, loading } = useSupabaseData();
  const { bookingFlow, updateBookingFlow } = useRoloStore();
  
  const [selectedVehicle, setSelectedVehicle] = useState(bookingFlow.selectedVehicle?.id);

  const estimatePrice = (vehicle: any) => {
    const basePrice = vehicle.base_price;
    const estimatedDistance = 10;
    return Math.round(basePrice + (vehicle.price_per_km * estimatedDistance));
  };

  const handleNext = () => {
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    if (!vehicle) return;
    
    const estimatedPrice = estimatePrice(vehicle);
    updateBookingFlow({ 
      selectedVehicle: vehicle,
      estimatedPrice 
    });
    navigate('/booking/confirmation');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-4">
      <div className="flex items-center justify-between mb-6">
        <LuxuryButton
          variant="minimal"
          size="icon"
          onClick={() => navigate('/booking/location')}
        >
          <ArrowLeft className="h-5 w-5" />
        </LuxuryButton>
        <h1 className="text-lg font-semibold">Choose Vehicle</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 space-y-4">
        <div className="animate-slide-up">
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>{bookingFlow.pickup}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <div className="w-2 h-2 bg-destructive rounded-full" />
              <span>{bookingFlow.dropoff}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {vehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              className={cn(
                "card-minimal cursor-pointer transition-all duration-200",
                selectedVehicle === vehicle.id
                  ? "ring-2 ring-primary bg-primary/5"
                  : "hover:bg-muted/50"
              )}
              onClick={() => setSelectedVehicle(vehicle.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Car className="h-6 w-6 text-muted-foreground" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">{vehicle.name}</h3>
                      <p className="text-sm text-muted-foreground">{vehicle.description}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {vehicle.eta}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {vehicle.type === 'Limousine' ? '8+' : vehicle.type === 'SUV' ? '6' : '4'} seats
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="font-bold text-lg">${estimatePrice(vehicle)}</p>
                      <p className="text-xs text-muted-foreground">Estimated</p>
                    </div>
                    
                    {selectedVehicle === vehicle.id && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="pt-6">
        <LuxuryButton
          onClick={handleNext}
          className="w-full"
          size="lg"
          disabled={!selectedVehicle}
        >
          Confirm Selection
        </LuxuryButton>
      </div>
    </div>
  );
}