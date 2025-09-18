import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoloStore, Vehicle, Ride } from '@/store/useRoloStore';
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

// Razorpay interface
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, any>;
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}


interface BookingFlow {
  pickup: string;
  dropoff: string;
  selectedVehicle: Vehicle | null;
  estimatedPrice: number;
}

export default function RideConfirmation(): JSX.Element {
  const navigate = useNavigate();
  const { bookingFlow, setCurrentBooking } = useRoloStore();
  const { createRide } = useSupabaseData();
  const { toast } = useToast();
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState<boolean>(false);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          setRazorpayLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          console.error('Failed to load Razorpay script');
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    if (!window.Razorpay) {
      loadRazorpayScript();
    } else {
      setRazorpayLoaded(true);
    }
  }, []);

  // Generate a proper UUID v4
  const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handlePaymentSuccess = async (paymentResponse: RazorpayResponse): Promise<void> => {
    console.log('Payment successful:', paymentResponse);
    
    if (!bookingFlow?.selectedVehicle || !bookingFlow?.estimatedPrice) {
      toast({
        variant: "destructive",
        title: "Booking Error",
        description: "Missing booking details",
      });
      return;
    }

    try {
      // Ensure we have a valid UUID for vehicle_id
      let vehicleId = bookingFlow.selectedVehicle.id;
      
      // If the ID is not a valid UUID format, generate one
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(vehicleId)) {
        vehicleId = generateUUID();
        console.warn('Generated new UUID for vehicle_id:', vehicleId);
      }

      // Log payment information (not stored in database)
      console.log('Payment details:', {
        payment_id: paymentResponse.razorpay_payment_id,
        payment_status: 'completed'
      });

      const rideData = {
        pickup_location: bookingFlow.pickup,
        dropoff_location: bookingFlow.dropoff,
        vehicle_id: vehicleId,
        estimated_price: bookingFlow.estimatedPrice
      };

      const { data, error } = await createRide(rideData);

      if (error) {
        console.error('Ride creation error:', error);
        toast({
          variant: "destructive",
          title: "Booking Failed",
          description: typeof error === 'string' ? error : error.message || 'Failed to create ride after payment',
        });
        return;
      }

      if (data) {
        // Convert Supabase ride data to store Ride format
        const storeRide: Ride = {
          id: data.id,
          pickup: data.pickup_location,
          dropoff: data.dropoff_location,
          vehicle: {
            id: data.vehicle_id,
            type: 'luxury_sedan', // Default type since we don't have it in the response
            name: selectedVehicle.name,
            price: data.estimated_price,
            eta: selectedVehicle.eta,
            image: selectedVehicle.image,
            description: selectedVehicle.description
          },
          price: data.estimated_price,
          status: 'upcoming',
          date: new Date().toISOString().split('T')[0]
        };
        
        setCurrentBooking(storeRide);
        console.log('Booking created:', storeRide);
        toast({
          title: "Payment Successful!",
          description: "Your ride has been booked. Finding your driver...",
        });
        navigate('/booking/searching');
      }
    } catch (err) {
      console.error('Post-payment booking error:', err);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "Payment successful but ride booking failed. Please contact support.",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handlePaymentFailure = (): void => {
    console.log('Payment cancelled or failed');
    setIsBooking(false);
    toast({
      variant: "destructive",
      title: "Payment Cancelled",
      description: "Your payment was not completed. Please try again.",
    });
  };

  const initializeRazorpay = (): void => {
    if (!razorpayLoaded || !window.Razorpay) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Payment gateway is not loaded. Please refresh and try again.",
      });
      return;
    }

    if (!bookingFlow?.selectedVehicle || !bookingFlow?.estimatedPrice) {
      toast({
        variant: "destructive",
        title: "Booking Error",
        description: "Please select a vehicle first",
      });
      return;
    }

    const options: RazorpayOptions = {
      key: 'rzp_live_RHW97oiHDY3dQq', // Your Razorpay key
      amount: bookingFlow.estimatedPrice * 100, // Amount in paise (multiply by 100)
      currency: 'INR',
      name: 'ROLO Rides',
      description: `Ride from ${bookingFlow.pickup} to ${bookingFlow.dropoff}`,
      image: '/logo.png', // Add your app logo URL
      handler: handlePaymentSuccess,
      prefill: {
        name: 'Rolo Pvt.Ltd', // You can get this from user context/store
        email: 'team@rolorides.com', // You can get this from user context/store
        contact: '8329472792' // You can get this from user context/store
      },
      notes: {
        pickup: bookingFlow.pickup,
        dropoff: bookingFlow.dropoff,
        vehicle: bookingFlow.selectedVehicle.name,
        vehicle_id: bookingFlow.selectedVehicle.id
      },
      theme: {
        color: '#00D1C1'
      },
      modal: {
        ondismiss: handlePaymentFailure
      }
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

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

    if (!razorpayLoaded) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Payment gateway is loading. Please wait a moment and try again.",
      });
      return;
    }

    setIsBooking(true);
    
    // Add a small delay to show the loading state
    setTimeout(() => {
      initializeRazorpay();
    }, 500);
  };

  const handleBack = (): void => {
    navigate('/booking/vehicle');
  };

  const handleEditPayment = (): void => {
    toast({
      title: "Payment Method",
      description: "Currently using Razorpay for secure payments",
    });
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
  const etaMinutes = parseInt(selectedVehicle.eta?.replace(/\D/g, '') || '10');
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
                  <p className="text-[#00D1C1] text-sm font-medium">{selectedVehicle.type || 'Luxury'}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-white/50">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Arrives in {selectedVehicle.eta}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>4.8</span>
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
                    <p className="font-medium text-white">Razorpay</p>
                    <p className="text-sm text-white/60">Secure Payment Gateway</p>
                  </div>
                </div>
                
                <button
                  onClick={handleEditPayment}
                  className="text-[#00D1C1] text-sm font-medium hover:text-[#00D1C1]/80 transition-colors flex items-center gap-1"
                >
                  <Edit3 className="h-4 w-4" />
                  Info
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
              <span className="text-xs">Secure Payment</span>
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
                        <p className="text-[#00D1C1] font-medium mb-2">{selectedVehicle.type || 'Luxury'}</p>
                        <p className="text-white/70 mb-3">{selectedVehicle.description || 'Premium luxury vehicle'}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-white/60">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Arrives in {selectedVehicle.eta}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>4 passengers</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>4.8 rating</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <p className="text-white/60 text-sm mb-3">Included features:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/60">
                          Premium Interior
                        </span>
                        <span className="text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/60">
                          Professional Driver
                        </span>
                        <span className="text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/60">
                          WiFi Available
                        </span>
                      </div>
                    </div>
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
                          <p className="font-medium text-white">Razorpay</p>
                          <p className="text-sm text-white/60">Secure Payment Gateway</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <Shield className="h-3 w-3" />
                        <span>256-bit SSL</span>
                      </div>
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
                disabled={isBooking || !razorpayLoaded}
                className={cn(
                  "relative w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3",
                  isBooking || !razorpayLoaded
                    ? "bg-white/5 text-white/40 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] text-white hover:shadow-2xl hover:shadow-[#00D1C1]/20 hover:scale-[1.02]"
                )}
              >
                {isBooking ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
                    <span>Opening Payment Gateway...</span>
                  </>
                ) : !razorpayLoaded ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
                    <span>Loading Payment...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Pay ₹{estimatedPrice} - Confirm Booking</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="text-center mt-4 space-y-2">
              <p className="text-xs text-white/40">
                Secured by{' '}
                <span className="text-[#00D1C1] font-medium">Razorpay</span>
                {' '}• 256-bit SSL Encryption
              </p>
              <p className="text-xs text-white/30">
                By confirming, you agree to our{' '}
                <span className="text-[#00D1C1] hover:underline cursor-pointer">terms and conditions</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}