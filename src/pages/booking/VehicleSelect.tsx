import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { useRoloStore } from '@/store/useRoloStore';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { ArrowLeft, Users, Clock, Star, ArrowRight, Shield, Wifi, Coffee, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import BookingFlowGuard from '@/components/BookingFlowGuard';

interface Vehicle {
  id: string;
  type: string;
  name: string;
  description: string | null;
  price_per_km: number;
  base_price: number;
  image_url: string | null;
  eta?: string;
  seats?: number;
  rating?: number;
  features?: string[];
}

export default function VehicleSelect(): JSX.Element {
  const navigate = useNavigate();
  const { bookingFlow, updateBookingFlow } = useRoloStore();
  const { vehicles, refetch } = useSupabaseData();
  
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  // Helper function to get features based on vehicle type
  const getVehicleFeatures = (type: string): string[] => {
    switch (type) {
      case 'sedan':
        return ["Leather Seats", "Climate Control", "Premium Audio"];
      case 'suv':
        return ["Panoramic Roof", "360° Camera", "Harman Kardon"];
      case 'limousine':
        return ["Executive Rear", "Air Suspension", "Burmester Audio"];
      case 'luxury_sedan':
        return ["Virtual Cockpit", "Bang & Olufsen", "Massage Seats"];
      default:
        return ["Premium Interior", "Professional Driver", "WiFi Available"];
    }
  };

  // Fetch vehicles from database on component mount
  useEffect(() => {
    refetch.vehicles();
  }, [refetch]);

  // Calculate pricing under ₹10 for testing
  const calculateTestPrice = (base_price: number, price_per_km: number): number => {
    // Keep prices very low for testing (under ₹10)
    const basePrice = Math.max(base_price, 2);
    const perKmPrice = Math.max(price_per_km, 0.5);
    const estimatedDistance = 5; // 5 km average trip
    
    const totalPrice = basePrice + (perKmPrice * estimatedDistance);
    
    // Ensure price is under ₹10 and at least ₹1
    return Math.max(Math.min(Math.round(totalPrice), 9), 1);
  };

  // Transform database vehicles to include additional UI properties
  const luxuryVehicles: Vehicle[] = vehicles.map(vehicle => ({
    ...vehicle,
    eta: "3-8 min",
    seats: vehicle.type === 'suv' ? 6 : 4,
    rating: 4.8,
    features: getVehicleFeatures(vehicle.type)
  }));

  const handleVehicleSelect = (vehicleId: string): void => {
    console.log('Vehicle selected:', vehicleId);
    setSelectedVehicle(vehicleId);
  };

  const handleNext = (): void => {
    const vehicle = luxuryVehicles.find(v => v.id === selectedVehicle);
    if (!vehicle) return;
    
    const estimatedPrice = calculateTestPrice(vehicle.base_price, vehicle.price_per_km);
    
    updateBookingFlow({ 
      selectedVehicle: {
        id: vehicle.id,
        type: vehicle.type,
        name: vehicle.name,
        price: estimatedPrice,
        eta: vehicle.eta || "5 min",
        image: vehicle.image_url || "/placeholder.svg",
        description: vehicle.description || "Premium luxury vehicle"
      },
      estimatedPrice: estimatedPrice
    });
    navigate('/booking/confirmation');
  };

  const handleBack = (): void => {
    navigate('/booking/location');
  };

  // Vehicle Card Component - COMPLETELY FIXED CLICK HANDLING
  const VehicleCard: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => {
    const displayPrice = calculateTestPrice(vehicle.base_price, vehicle.price_per_km);
    const isSelected = selectedVehicle === vehicle.id;

    // Single click handler at the top level
    const handleCardClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleVehicleSelect(vehicle.id);
    };

    return (
      <div
        onClick={handleCardClick}
        className={cn(
          "relative cursor-pointer transition-all duration-200 group select-none",
          "hover:shadow-lg hover:shadow-[#00D1C1]/5"
        )}
      >
        {/* Card Content - pointer-events-none on all children to prevent blocking */}
        <div className={cn(
          "relative bg-black/40 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-200",
          isSelected
            ? "border-[#00D1C1]/50 bg-black/60 ring-2 ring-[#00D1C1]/30"
            : "border-white/10 hover:border-white/20 hover:bg-black/50"
        )}>
          {/* Mobile Layout */}
          <div className="block lg:hidden p-4 pointer-events-none">
            {/* Vehicle Image */}
            <div className="relative w-full h-32 mb-4 rounded-xl overflow-hidden">
              <img
                src={vehicle.image_url || "/placeholder.svg"}
                alt={vehicle.name}
                className="w-full h-full object-cover"
                draggable="false"
              />
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-[#00D1C1] rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </div>
            
            {/* Vehicle Info */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white truncate">{vehicle.name}</h3>
                  <p className="text-[#00D1C1] text-sm font-medium capitalize">{vehicle.type.replace('_', ' ')}</p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-xl font-bold text-white">₹{displayPrice}</div>
                  <div className="text-xs text-white/60">Estimated</div>
                </div>
              </div>
              
              {vehicle.description && (
                <p className="text-white/70 text-sm line-clamp-2">{vehicle.description}</p>
              )}
              
              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-white/60">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{vehicle.eta}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{vehicle.seats} seats</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  <span>{vehicle.rating}</span>
                </div>
              </div>
              
              {/* Features */}
              <div className="flex flex-wrap gap-1">
                {vehicle.features?.slice(0, 3).map((feature, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded-full text-white/70">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block pointer-events-none">
            <div className="flex items-center p-6 relative">
              {/* Vehicle Image */}
              <div className="relative w-40 h-28 mr-6 flex-shrink-0 rounded-xl overflow-hidden">
                <img
                  src={vehicle.image_url || "/placeholder.svg"}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                  draggable="false"
                />
              </div>
              
              {/* Vehicle Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-white truncate">{vehicle.name}</h3>
                      {isSelected && (
                        <div className="w-2 h-2 bg-[#00D1C1] rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <p className="text-[#00D1C1] text-sm font-medium capitalize mb-1">{vehicle.type.replace('_', ' ')}</p>
                    {vehicle.description && (
                      <p className="text-white/70 text-sm mb-4 line-clamp-2">{vehicle.description}</p>
                    )}
                  </div>
                  <div className="text-right ml-6 flex-shrink-0">
                    <div className="text-3xl font-bold text-white">₹{displayPrice}</div>
                    <div className="text-xs text-white/60">Estimated fare</div>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-white/60 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{vehicle.eta}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{vehicle.seats} seats</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span>{vehicle.rating}</span>
                  </div>
                </div>
                
                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {vehicle.features?.slice(0, 4).map((feature, idx) => (
                    <span key={idx} className="text-sm px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/70">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Selection Indicator - Desktop */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-[#00D1C1] rounded-full flex items-center justify-center shadow-lg shadow-[#00D1C1]/50">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <BookingFlowGuard requiredStep="vehicle">
      <div className="min-h-screen bg-[#0A0A0B] relative font-['Plus_Jakarta_Sans']">
      {/* Background Effects - Simplified */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F36]/10 via-transparent to-[#00D1C1]/5"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#00D1C1]/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-[#1A1F36]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between py-6 mb-6">
            <button
              onClick={handleBack}
              className="w-12 h-12 lg:w-14 lg:h-14 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>
            <div className="text-center">
              <h1 className="text-xl lg:text-3xl font-bold text-white">Choose your ride</h1>
              <p className="text-white/60 text-sm lg:text-base mt-1 hidden lg:block">Premium vehicles for your journey</p>
            </div>
            <div className="w-12 lg:w-14" />
          </div>

          {/* Route Summary */}
          <div className="relative mb-6 lg:mb-8">
            <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-4 lg:p-6 max-w-md mx-auto">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[#00D1C1] rounded-full flex-shrink-0"></div>
                  <span className="text-white/80 text-sm lg:text-base truncate">
                    {bookingFlow.pickup || "Current Location"}
                  </span>
                </div>
                <div className="w-px h-4 bg-white/20 ml-1.5"></div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span className="text-white/80 text-sm lg:text-base truncate">
                    {bookingFlow.dropoff || "Destination"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle List */}
          <div className="space-y-4 mb-6 lg:mb-8">
            {luxuryVehicles.length > 0 ? (
              luxuryVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-white/60 text-lg">Loading vehicles...</p>
              </div>
            )}
          </div>

          {/* Trust Indicators - Desktop Only */}
          <div className="hidden lg:flex items-center justify-center gap-8 text-white/40 mb-8">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#00D1C1]" />
              <span className="text-sm">Verified Drivers</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-[#00D1C1]" />
              <span className="text-sm">Free WiFi</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <Coffee className="w-4 h-4 text-[#00D1C1]" />
              <span className="text-sm">Complimentary Refreshments</span>
            </div>
          </div>
        </div>

        {/* Book Now Button - Fixed Bottom on Mobile, Static on Desktop */}
        <div className="sticky bottom-0 lg:static p-4 lg:p-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/95 to-transparent lg:bg-none backdrop-blur-xl lg:backdrop-blur-none border-t border-white/5 lg:border-0">
          <div className="container mx-auto px-0 lg:px-8 max-w-6xl">
            <button
              onClick={handleNext}
              disabled={!selectedVehicle}
              className={cn(
                "w-full py-4 px-6 rounded-2xl font-semibold text-base lg:text-lg transition-all duration-200 flex items-center justify-center gap-3",
                selectedVehicle
                  ? "bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] text-white hover:shadow-xl hover:shadow-[#00D1C1]/20 hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-white/10 text-white/50 cursor-not-allowed border border-white/20"
              )}
            >
              <span>{selectedVehicle ? "Book Now" : "Select a Vehicle"}</span>
              {selectedVehicle && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
    </BookingFlowGuard>
  );
}
