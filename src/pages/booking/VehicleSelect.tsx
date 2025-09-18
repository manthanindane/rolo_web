import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { useRoloStore } from '@/store/useRoloStore';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { ArrowLeft, Users, Clock, Star, ArrowRight, Shield, Wifi, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  // Transform database vehicles to include additional UI properties
  const luxuryVehicles: Vehicle[] = vehicles.map(vehicle => ({
    ...vehicle,
    eta: "3-8 min", // Default ETA
    seats: vehicle.type === 'suv' ? 6 : 4, // Default seats based on type
    rating: 4.8, // Default rating
    features: getVehicleFeatures(vehicle.type) // Get features based on type
  }));

  const handleVehicleSelect = (vehicleId: string): void => {
    setSelectedVehicle(vehicleId);
  };

  const handleNext = (): void => {
    const vehicle = luxuryVehicles.find(v => v.id === selectedVehicle);
    if (!vehicle) return;
    
    // Calculate estimated price based on base_price and a sample distance
    const estimatedPrice = vehicle.base_price + (vehicle.price_per_km * 10); // Assuming 10km average trip
    
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

  // Mobile Card Component
  const MobileVehicleCard: React.FC<{ vehicle: Vehicle; index: number }> = ({ vehicle, index }) => (
    <div
      className={cn(
        "relative group cursor-pointer transition-all duration-500 md:hidden",
        selectedVehicle === vehicle.id ? "scale-[1.02]" : "hover:scale-[1.01]"
      )}
      onClick={() => handleVehicleSelect(vehicle.id)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Glow Effect */}
      <div className={cn(
        "absolute -inset-1 bg-gradient-to-r rounded-3xl blur opacity-0 transition duration-500",
        selectedVehicle === vehicle.id 
          ? "from-[#1A1F36]/40 to-[#00D1C1]/40 opacity-40" 
          : "from-[#1A1F36]/20 to-[#00D1C1]/20 group-hover:opacity-20"
      )}></div>
      
      {/* Card */}
      <div className={cn(
        "relative bg-black/40 backdrop-blur-xl border rounded-3xl overflow-hidden transition-all duration-300",
        selectedVehicle === vehicle.id
          ? "border-[#00D1C1]/50 bg-black/60"
          : "border-white/10 hover:border-white/20"
      )}>
        <div className="p-4">
          {/* Vehicle Image */}
          <div className="relative w-full h-32 mb-4 flex items-center justify-center">
            <img
              src={vehicle.image_url || "/placeholder.svg"}
              alt={vehicle.name}
              className="w-full h-full object-cover rounded-xl"
              style={{
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
              }}
            />
            {/* Selection Indicator */}
            {selectedVehicle === vehicle.id && (
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-[#00D1C1] rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Vehicle Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{vehicle.name}</h3>
                <p className="text-[#00D1C1] text-sm font-medium">{vehicle.type}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">₹{vehicle.base_price + (vehicle.price_per_km * 10)}</div>
                <div className="text-xs text-white/40">Estimated</div>
              </div>
            </div>
            
            <p className="text-white/60 text-sm">{vehicle.description}</p>
            
            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-white/50">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{vehicle.eta}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{vehicle.seats} Adults</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span>{vehicle.rating}</span>
              </div>
            </div>
            
            {/* Features */}
            <div className="flex flex-wrap gap-1">
              {vehicle.features.slice(0, 3).map((feature, idx) => (
                <span key={idx} className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded-full text-white/60">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop Card Component
  const DesktopVehicleCard: React.FC<{ vehicle: Vehicle; index: number }> = ({ vehicle, index }) => (
    <div
      className={cn(
        "relative group cursor-pointer transition-all duration-500 hidden md:block",
        selectedVehicle === vehicle.id ? "scale-[1.02]" : "hover:scale-[1.01]"
      )}
      onClick={() => handleVehicleSelect(vehicle.id)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Glow Effect */}
      <div className={cn(
        "absolute -inset-1 bg-gradient-to-r rounded-3xl blur opacity-0 transition duration-500",
        selectedVehicle === vehicle.id 
          ? "from-[#1A1F36]/40 to-[#00D1C1]/40 opacity-40" 
          : "from-[#1A1F36]/20 to-[#00D1C1]/20 group-hover:opacity-20"
      )}></div>
      
      {/* Card */}
      <div className={cn(
        "relative bg-black/40 backdrop-blur-xl border rounded-3xl overflow-hidden transition-all duration-300",
        selectedVehicle === vehicle.id
          ? "border-[#00D1C1]/50 bg-black/60"
          : "border-white/10 hover:border-white/20"
      )}>
        <div className="flex items-center p-6">
          {/* Vehicle Image */}
          <div className="relative w-40 h-28 mr-6 flex-shrink-0">
            <img
              src={vehicle.image_url || "/placeholder.svg"}
              alt={vehicle.name}
              className="w-full h-full object-cover rounded-xl"
              style={{
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
              }}
            />
            {/* Reflection Effect */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent rounded-b-xl"></div>
          </div>
          
          {/* Vehicle Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-white">{vehicle.name}</h3>
              {selectedVehicle === vehicle.id && (
                <div className="w-2 h-2 bg-[#00D1C1] rounded-full animate-pulse"></div>
              )}
            </div>
            
            <p className="text-[#00D1C1] text-sm font-medium mb-1">{vehicle.type}</p>
            <p className="text-white/60 text-sm mb-4">{vehicle.description}</p>
            
            {/* Features */}
            <div className="flex items-center gap-4 text-xs text-white/50 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{vehicle.eta}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{vehicle.seats} Adults</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span>{vehicle.rating}</span>
              </div>
            </div>
            
            {/* Price and Features */}
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {vehicle.features.slice(0, 3).map((feature, idx) => (
                  <span key={idx} className="text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/60">
                    {feature}
                  </span>
                ))}
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">₹{vehicle.base_price + (vehicle.price_per_km * 10)}</div>
                <div className="text-xs text-white/40">Estimated fare</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Selection Indicator */}
        {selectedVehicle === vehicle.id && (
          <div className="absolute top-6 right-6">
            <div className="w-8 h-8 bg-[#00D1C1] rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0B] relative overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F36]/15 via-transparent to-[#00D1C1]/8"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-[#00D1C1]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-gradient-radial from-[#1A1F36]/8 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute inset-0 opacity-[0.02]" 
             style={{
               backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
               backgroundSize: '20px 20px'
             }}>
        </div>
      </div>

      <div className="relative z-10">
        {/* Mobile Layout */}
        <div className="md:hidden p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBack}
              className="w-12 h-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold text-white">Choose Ride</h1>
            <div className="w-12" />
          </div>

          {/* Route Summary */}
          <div className="relative group mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/20 to-[#00D1C1]/20 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#00D1C1] rounded-full"></div>
                  <span className="text-white/80 truncate">{bookingFlow.pickup || "Current Location"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-white/80 truncate">{bookingFlow.dropoff || "Destination"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Grid - Mobile */}
          <div className="space-y-4 mb-6">
            {luxuryVehicles.map((vehicle, index) => (
              <MobileVehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
            ))}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="max-w-6xl mx-auto p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
              <button
                onClick={handleBack}
                className="w-14 h-14 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Choose your preferred ride</h1>
                <p className="text-white/60">Premium vehicles for your luxury journey</p>
              </div>
              <div className="w-14" />
            </div>

            {/* Route Summary */}
            <div className="relative group mb-12 max-w-md mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/20 to-[#00D1C1]/20 rounded-2xl blur opacity-20"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-[#00D1C1] rounded-full"></div>
                    <span className="text-white/80">{bookingFlow.pickup || "Current Location"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-white/80">{bookingFlow.dropoff || "Destination"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Grid - Desktop */}
            <div className="space-y-6 mb-12">
              {luxuryVehicles.map((vehicle, index) => (
                <DesktopVehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* Book Now Button - Fixed Bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/95 to-transparent backdrop-blur-xl md:relative md:bg-none md:backdrop-blur-none">
          <div className="max-w-6xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <button
                onClick={handleNext}
                disabled={!selectedVehicle}
                className={cn(
                  "relative w-full py-4 px-6 rounded-2xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-3",
                  selectedVehicle
                    ? "bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] text-white hover:shadow-2xl hover:shadow-[#00D1C1]/20 hover:scale-[1.02]"
                    : "bg-white/5 text-white/40 cursor-not-allowed border border-white/10"
                )}
              >
                <span>{selectedVehicle ? "Book Now" : "Select a Vehicle"}</span>
                {selectedVehicle && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Trust Indicators - Desktop Only */}
        <div className="hidden md:block">
          <div className="max-w-6xl mx-auto px-8 pb-8">
            <div className="flex items-center justify-center gap-8 text-white/30">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#00D1C1]" />
                <span className="text-sm">Verified Drivers</span>
              </div>
              <div className="w-px h-4 bg-white/10"></div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-[#00D1C1]" />
                <span className="text-sm">Free WiFi</span>
              </div>
              <div className="w-px h-4 bg-white/10"></div>
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-[#00D1C1]" />
                <span className="text-sm">Complimentary Refreshments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}