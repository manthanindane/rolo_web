import { NavigateFunction } from 'react-router-dom';
import { Vehicle, Ride } from '@/store/useRoloStore';

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

interface BookingFlow {
  pickup: string;
  dropoff: string;
  selectedVehicle: Vehicle | null;
  estimatedPrice: number;
}

interface PaymentSuccessParams {
  response: RazorpayResponse;
  bookingFlow: BookingFlow;
  vehicles: any[];
  createRide: (data: any) => Promise<{ data: any; error: any }>;
  setCurrentBooking: (booking: Ride) => void;
  navigate: NavigateFunction;
  toast: any;
  setIsBooking: (value: boolean) => void;
}

const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const handlePaymentSuccess = async ({
  response,
  bookingFlow,
  vehicles,
  createRide,
  setCurrentBooking,
  navigate,
  toast,
  setIsBooking
}: PaymentSuccessParams): Promise<void> => {
  console.log('Payment successful:', response);
  
  if (!bookingFlow?.selectedVehicle || !bookingFlow?.estimatedPrice) {
    toast({
      variant: "destructive",
      title: "Booking Error",
      description: "Missing booking details",
    });
    setIsBooking(false);
    return;
  }

  try {
    const selectedVehicle = bookingFlow.selectedVehicle;
    
    console.log('Available vehicles:', vehicles);
    console.log('Selected vehicle:', selectedVehicle);
    
    // FIXED: Better vehicle matching logic
    let databaseVehicle = null;
    
    // Try to find by exact ID match first
    if (isValidUUID(selectedVehicle.id)) {
      databaseVehicle = vehicles.find(v => v.id === selectedVehicle.id);
    }
    
    // If not found, try to match by type or name
    if (!databaseVehicle) {
      databaseVehicle = vehicles.find(v => 
        v.type?.toLowerCase() === selectedVehicle.type?.toLowerCase() ||
        v.name?.toLowerCase().includes(selectedVehicle.name?.toLowerCase())
      );
    }
    
    // Use first available vehicle as fallback
    if (!databaseVehicle && vehicles.length > 0) {
      databaseVehicle = vehicles[0];
      console.warn('Using first available vehicle:', databaseVehicle);
    }
    
    if (!databaseVehicle) {
      throw new Error('No vehicles available in database. Please add vehicles first.');
    }
    
    if (!isValidUUID(databaseVehicle.id)) {
      throw new Error('Invalid vehicle ID format in database. Vehicle ID must be a valid UUID.');
    }
    
    const vehicleId = databaseVehicle.id;
    console.log('Using vehicle ID:', vehicleId);

    const rideData = {
      pickup_location: bookingFlow.pickup,
      dropoff_location: bookingFlow.dropoff,
      vehicle_id: vehicleId,
      estimated_price: bookingFlow.estimatedPrice
    };

    console.log('Creating ride with data:', rideData);

    const { data, error } = await createRide(rideData);

    if (error) {
      console.error('Ride creation error:', error);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: typeof error === 'string' ? error : error.message,
      });
      setIsBooking(false);
      return;
    }

    if (data) {
      const storeRide: Ride = {
        id: data.id,
        pickup: data.pickup_location,
        dropoff: data.dropoff_location,
        vehicle: {
          id: vehicleId,
          type: databaseVehicle.type || 'sedan',
          name: databaseVehicle.name,
          price: data.estimated_price,
          eta: selectedVehicle.eta,
          image: databaseVehicle.image_url || '',
          description: databaseVehicle.description || ''
        },
        price: data.estimated_price,
        status: 'upcoming',
        date: new Date().toISOString().split('T')[0]
      };
      
      setCurrentBooking(storeRide);
      
      toast({
        title: "Payment Successful!",
        description: "Your ride has been booked. Finding your driver...",
      });
      
      setTimeout(() => {
        navigate('/booking/searching');
      }, 500);
    }
  } catch (err) {
    console.error('Booking error:', err);
    toast({
      variant: "destructive",
      title: "Booking Failed",
      description: err instanceof Error ? err.message : "Please contact support.",
    });
    setIsBooking(false);
  }
};
