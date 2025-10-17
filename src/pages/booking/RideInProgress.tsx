import { useNavigate } from 'react-router-dom';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { Card, CardContent } from '@/components/ui/card';
import { useRoloStore } from '@/store/useRoloStore';
import { Phone, MessageCircle, Star, MapPin, Clock } from 'lucide-react';
import { useEffect } from 'react';
import BookingFlowGuard from '@/components/BookingFlowGuard';

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
    <BookingFlowGuard requiredStep="in-progress">
      <div className="min-h-screen bg-[#0A0A0B] relative overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F36]/15 via-transparent to-[#00D1C1]/8"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#00D1C1]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-[#1A1F36]/8 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-8 max-w-6xl mx-auto">
          <div className="w-12" />
          <h1 className="text-white font-bold text-lg md:text-2xl">Ride In Progress</h1>
          <div className="w-12" />
        </div>

        {/* Map Area - Mock */}
        <div className="relative h-[280px] md:h-[420px] mx-4 md:mx-auto md:w-[min(92vw,1200px)] bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center animate-fade-in">
              <MapPin className="h-12 w-12 md:h-16 md:w-16 text-[#00D1C1] mx-auto mb-3" />
              <p className="text-white font-semibold">Live Map</p>
              <p className="text-sm text-white/60">Tracking your ride</p>
            </div>
          </div>

          {/* Floating ETA Card */}
          <div className="absolute top-4 left-4 right-4">
            <Card className="bg-black/60 border-white/10 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#00D1C1] rounded-full animate-pulse" />
                      <span className="text-sm text-white/80 font-medium">In Transit</span>
                    </div>
                    <p className="text-xs text-white/60 mt-1">Estimated arrival: 8 minutes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">${currentBooking.price}</p>
                    <p className="text-xs text-white/60">Total fare</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-4 md:p-8 space-y-4 md:space-y-6 max-w-6xl mx-auto">
          {/* Driver Info */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl rounded-2xl">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {currentBooking.driver.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{currentBooking.driver.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      <span className="text-sm text-white/60">{currentBooking.driver.rating}</span>
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
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Vehicle</span>
                  <span className="font-medium text-white">{currentBooking.driver.car}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Plate</span>
                  <span className="font-mono font-medium text-white">{currentBooking.driver.plateNumber}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trip Progress */}
          <Card className="bg-black/40 border-white/10 backdrop-blur-xl rounded-2xl">
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-[#00D1C1] rounded-full mt-1" />
                  <div>
                    <p className="font-medium text-sm text-white">Picked up</p>
                    <p className="text-xs text-white/60">{currentBooking.pickup}</p>
                  </div>
                </div>
                <div className="ml-1.5 border-l-2 border-dashed border-white/20 h-6" />
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-[#00D1C1] rounded-full mt-1 animate-pulse" />
                  <div>
                    <p className="font-medium text-sm text-white">En route to destination</p>
                    <p className="text-xs text-white/60">{currentBooking.dropoff}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </BookingFlowGuard>
  );
}