import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { useRoloStore } from '@/store/useRoloStore';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  MapPin, 
  Car, 
  Clock, 
  CreditCard, 
  Shield, 
  Star,
  Users,
  CheckCircle,
  Edit3,
  Phone,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RideData {
  pickup_location: string;
  dropoff_location: string;
  vehicle_id: string; // Changed from number to string to match Supabase UUID
  estimated_price: number;
}

interface SelectedVehicle {
  id: string; // Changed from number to string
  name: string;
  category?: string;
  description?: string;
  eta: string;
  seats: number;
  rating: number;
  features?: string[];
  price: number;
}

interface BookingFlow {
  pickup: string;
  dropoff: string;
  selectedVehicle: SelectedVehicle | null;
  estimatedPrice: number;
}

export default function RideConfirmation(): JSX.Element {
  const navigate = useNavigate();
  const { bookingFlow, setCurrentBooking } = useRoloStore();
  const { createRide } = useSupabaseData();
  const { toast } = useToast();
  const [isBooking, setIsBooking] = useState<boolean>(false);

  const handleConfirmBooking = async (): Promise<void> => {
    if (!bookingFlow?.selectedVehicle || !bookingFlow?.estimatedPrice) {
      toast({
        variant: "destructive",
        title: "Booking Error",
        description: "Please select a vehicle first",
      });
      return;
    }

    if (!bookingFlow?.pickup || !bookingFlow?.dropoff) {
      toast({
        variant: "destructive",
        title: "Booking Error",
        description: "Please set pickup and dropoff locations",
      });
      return;
    }

    setIsBooking(true);

    try {
      const rideData: RideData = {
        pickup_location: bookingFlow.pickup,
        dropoff_location: bookingFlow.dropoff,
        vehicle_id: bookingFlow.selectedVehicle.id, // Now correctly passing string ID
        estimated_price: bookingFlow.estimatedPrice
      };

      const { data, error } = await createRide(rideData);

      if (error) {
        toast({
          variant: "destructive",
          title: "Booking Failed",
          description: typeof error === 'string' ? error : error.message || 'Unknown error occurred',
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
      console.error('Booking error:', err);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleBack = (): void => {
    navigate('/booking/vehicle');
  };

  const handleEditPayment = (): void => {
    // Navigate to payment method selection
    console.log('Edit payment method');
  };

  // Type guard and early return
  if (!bookingFlow?.selectedVehicle) {
    navigate('/booking/location');
    return <div></div>;
  }

  const selectedVehicle = bookingFlow.selectedVehicle;
  const estimatedPrice = bookingFlow.estimatedPrice || 0;

  // Calculate estimated arrival time
  const estimatedTime = new Date();
  const etaMinutes = parseInt(selectedVehicle.eta?.replace(/\D/g, '') || '10'); // Extract numbers from eta string
  estimatedTime.setMinutes(estimatedTime.getMinutes() + etaMinutes);

  // Calculate fare breakdown
  const baseFare = Math.round(estimatedPrice * 0.8);
  const serviceCharge = Math.round(estimatedPrice * 0.1);
  const taxes = Math.round(estimatedPrice * 0.1);

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
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold text-white">Confirm Booking</h1>
            <div className="w-12" />
          </div>

          {/* Trip Details Card */}
          <div className="relative group mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/20 to-[#00D1C1]/20 rounded-3xl blur opacity-20"></div>
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="h-5 w-5 text-[#00D1C1]" />
                <h2 className="text-lg font-semibold text-white">Trip Details</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-[#00D1C1] rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="font-medium text-white">Pickup</p>
                    <p className="text-sm text-white/60 mt-1">{bookingFlow.pickup}</p>
                  </div>
                </div>
                
                <div className="ml-1.5 border-l-2 border-dashed border-white/20 h-6" />
                
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="font-medium text-white">Drop-off</p>
                    <p className="text-sm text-white/60 mt-1">{bookingFlow.dropoff}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Details Card */}
          <div className="relative group mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/20 to-[#00D1C1]/20 rounded-3xl blur opacity-20"></div>
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center">
                  <Car className="h-8 w-8 text-[#00D1C1]" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg">{selectedVehicle.name}</h3>
                  <p className="text-[#00D1C1] text-sm font-medium">{selectedVehicle.category || 'Luxury'}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-white/50">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Arrives in {selectedVehicle.eta}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>{selectedVehicle.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="text-white/60">
                  <p className="text-sm">Estimated Fare</p>
                  <p className="text-xs">Including taxes</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">₹{estimatedPrice}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="relative group mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/20 to-[#00D1C1]/20 rounded-3xl blur opacity-20"></div>
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] rounded-xl flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Payment Method</p>
                    <p className="text-sm text-white/60">•••• •••• •••• 4242</p>
                  </div>
                </div>
                
                <button
                  onClick={handleEditPayment}
                  className="text-[#00D1C1] text-sm font-medium hover:text-[#00D1C1]/80 transition-colors flex items-center gap-1"
                >
                  <Edit3 className="h-4 w-4" />
                  Change
                </button>
              </div>
            </div>
          </div>

          {/* Safety Features */}
          <div className="flex items-center justify-center gap-6 mb-6 text-white/40">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#00D1C1]" />
              <span className="text-xs">Verified Driver</span>
            </div>
            <div className="w-px h-4 bg-white/10"></div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#00D1C1]" />
              <span className="text-xs">Insured</span>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="max-w-5xl mx-auto p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
              <button
                onClick={handleBack}
                className="w-14 h-14 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                aria-label="Go back"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Confirm Your Ride</h1>
                <p className="text-white/60">Review details and complete your booking</p>
              </div>
              <div className="w-14" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Trip & Vehicle Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Trip Details */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/20 to-[#00D1C1]/20 rounded-3xl blur opacity-20"></div>
                  <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <MapPin className="h-6 w-6 text-[#00D1C1]" />
                      <h2 className="text-xl font-bold text-white">Trip Details</h2>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-4 h-4 bg-[#00D1C1] rounded-full mt-1" />
                        <div className="flex-1">
                          <p className="font-semibold text-white text-lg">Pickup Location</p>
                          <p className="text-white/70 mt-1">{bookingFlow.pickup}</p>
                          <p className="text-white/50 text-sm mt-2">
                            {new Date().toLocaleTimeString('en-IN', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })} - Today
                          </p>
                        </div>
                      </div>
                      
                      <div className="ml-2 border-l-2 border-dashed border-white/20 h-8" />
                      
                      <div className="flex items-start gap-4">
                        <div className="w-4 h-4 bg-red-500 rounded-full mt-1" />
                        <div className="flex-1">
                          <p className="font-semibold text-white text-lg">Drop-off Location</p>
                          <p className="text-white/70 mt-1">{bookingFlow.dropoff}</p>
                          <p className="text-white/50 text-sm mt-2">
                            Est. {estimatedTime.toLocaleTimeString('en-IN', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/20 to-[#00D1C1]/20 rounded-3xl blur opacity-20"></div>
                  <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <h2 className="text-xl font-bold text-white mb-6">Selected Vehicle</h2>
                    
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-18 bg-white/5 rounded-2xl flex items-center justify-center">
                        <Car className="h-10 w-10 text-[#00D1C1]" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-xl">{selectedVehicle.name}</h3>
                        <p className="text-[#00D1C1] font-medium mb-2">{selectedVehicle.category || 'Luxury'}</p>
                        <p className="text-white/70 mb-3">{selectedVehicle.description || 'Premium luxury vehicle'}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-white/60">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Arrives in {selectedVehicle.eta}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{selectedVehicle.seats} passengers</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{selectedVehicle.rating} rating</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    {selectedVehicle.features && selectedVehicle.features.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-white/60 text-sm mb-3">Included features:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedVehicle.features.map((feature: string, idx: number) => (
                            <span key={idx} className="text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/60">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Payment & Summary */}
              <div className="space-y-8">
                {/* Payment Summary */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/20 to-[#00D1C1]/20 rounded-3xl blur opacity-20"></div>
                  <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <h2 className="text-xl font-bold text-white mb-6">Fare Summary</h2>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-white/70">
                        <span>Base fare</span>
                        <span>₹{baseFare}</span>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Service charge</span>
                        <span>₹{serviceCharge}</span>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Taxes</span>
                        <span>₹{taxes}</span>
                      </div>
                      <div className="border-t border-white/10 pt-4">
                        <div className="flex justify-between text-white text-lg font-bold">
                          <span>Total Amount</span>
                          <span>₹{estimatedPrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/20 to-[#00D1C1]/20 rounded-3xl blur opacity-20"></div>
                  <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <h2 className="text-xl font-bold text-white mb-6">Payment Method</h2>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] rounded-xl flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">Credit Card</p>
                          <p className="text-sm text-white/60">•••• •••• •••• 4242</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleEditPayment}
                        className="text-[#00D1C1] font-medium hover:text-[#00D1C1]/80 transition-colors flex items-center gap-2"
                      >
                        <Edit3 className="h-4 w-4" />
                        Change
                      </button>
                    </div>
                  </div>
                </div>

                {/* Safety & Support */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/20 to-[#00D1C1]/20 rounded-3xl blur opacity-20"></div>
                  <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Safety & Support</h3>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3 text-white/60">
                        <Shield className="h-4 w-4 text-[#00D1C1]" />
                        <span>Verified professional driver</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/60">
                        <Phone className="h-4 w-4 text-[#00D1C1]" />
                        <span>24/7 customer support</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/60">
                        <MessageCircle className="h-4 w-4 text-[#00D1C1]" />
                        <span>In-app messaging with driver</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Button - Fixed Bottom on Mobile, Bottom of Content on Desktop */}
        <div className="fixed md:relative bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t md:bg-none from-[#0A0A0B] via-[#0A0A0B]/95 to-transparent backdrop-blur-xl md:backdrop-blur-none">
          <div className="max-w-5xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <button
                onClick={handleConfirmBooking}
                disabled={isBooking}
                className={cn(
                  "relative w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3",
                  isBooking
                    ? "bg-white/5 text-white/40 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] text-white hover:shadow-2xl hover:shadow-[#00D1C1]/20 hover:scale-[1.02]"
                )}
              >
                {isBooking ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
                    <span>Booking your ride...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Confirm Booking - ₹{estimatedPrice}</span>
                  </>
                )}
              </button>
            </div>
            
            <p className="text-xs text-center text-white/40 mt-4">
              By confirming, you agree to our{' '}
              <span className="text-[#00D1C1] hover:underline cursor-pointer">terms and conditions</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}