import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useRoloStore } from '@/store/useRoloStore';
import { Loader2, Star, Car, Clock, MapPin, Phone, Sparkles } from 'lucide-react';

const mockDriver = {
  id: '1',
  name: 'Michael Chen',
  rating: 4.9,
  car: 'Mercedes S-Class',
  plateNumber: 'LUX 001',
  photo: '/placeholder.svg',
  totalRides: '500+',
  experience: '5 years'
};

export default function SearchingDriver() {
  const navigate = useNavigate();
  const { currentBooking, updateRide } = useRoloStore();
  const [isSearching, setIsSearching] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate search progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsSearching(false);
          return 100;
        }
        return prev + 8;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isSearching && currentBooking) {
      // Simulate driver assignment
      setTimeout(() => {
        updateRide(currentBooking.id, {
          driver: mockDriver,
          status: 'in-progress'
        });
        navigate('/booking/in-progress');
      }, 2500);
    }
  }, [isSearching, currentBooking, updateRide, navigate]);

  if (!currentBooking) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center px-4 relative overflow-hidden font-['Plus_Jakarta_Sans']">
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

      <div className="relative z-10 w-full max-w-md space-y-8">
        {isSearching ? (
          <div className="text-center space-y-8">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm text-white/70">
              <Sparkles className="w-4 h-4 text-[#00D1C1]" />
              Premium service active
              <div className="w-2 h-2 bg-[#00D1C1] rounded-full animate-pulse"></div>
            </div>

            {/* Animated Search Icon */}
            <div className="relative mx-auto w-32 h-32 mb-8">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 rounded-full border-2 border-white/10"></div>
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00D1C1] animate-spin"></div>
              
              {/* Inner glow effect */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#1A1F36]/20 to-[#00D1C1]/10 backdrop-blur-sm border border-white/5"></div>
              
              {/* Car icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Car className="h-12 w-12 text-[#00D1C1]" />
              </div>
              
              {/* Pulsing dots */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div className="w-1 h-1 bg-[#00D1C1] rounded-full animate-pulse"></div>
              </div>
              <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                <div className="w-1 h-1 bg-[#1A1F36] rounded-full animate-pulse delay-75"></div>
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="w-1 h-1 bg-[#00D1C1] rounded-full animate-pulse delay-150"></div>
              </div>
              <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
                <div className="w-1 h-1 bg-[#1A1F36] rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                Finding your
                <br />
                <span className="bg-gradient-to-r from-[#00D1C1] to-[#1A1F36] bg-clip-text text-transparent">
                  luxury driver
                </span>
              </h1>
              
              <p className="text-base text-white/60 leading-relaxed max-w-sm mx-auto">
                Connecting you with our finest professional drivers in your area
              </p>
            </div>
            
            {/* Enhanced Progress Bar */}
            <div className="space-y-3">
              <div className="relative bg-black/40 backdrop-blur-sm rounded-full h-2 border border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                <div 
                  className="h-full bg-gradient-to-r from-[#1A1F36] via-[#00D1C1] to-[#1A1F36] transition-all duration-500 ease-out relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
              <p className="text-sm text-white/40">{progress}% complete</p>
            </div>

            {/* Search Steps */}
            <div className="space-y-3 text-left">
              <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${progress >= 25 ? 'bg-white/5 border border-white/10' : 'opacity-50'}`}>
                <div className={`w-2 h-2 rounded-full ${progress >= 25 ? 'bg-[#00D1C1]' : 'bg-white/20'}`}></div>
                <span className="text-sm text-white/70">Analyzing your location</span>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${progress >= 50 ? 'bg-white/5 border border-white/10' : 'opacity-50'}`}>
                <div className={`w-2 h-2 rounded-full ${progress >= 50 ? 'bg-[#00D1C1]' : 'bg-white/20'}`}></div>
                <span className="text-sm text-white/70">Matching premium drivers</span>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${progress >= 75 ? 'bg-white/5 border border-white/10' : 'opacity-50'}`}>
                <div className={`w-2 h-2 rounded-full ${progress >= 75 ? 'bg-[#00D1C1]' : 'bg-white/20'}`}></div>
                <span className="text-sm text-white/70">Confirming availability</span>
              </div>
            </div>
          </div>
        ) : (
          /* Driver Found Card */
          <div className="relative group animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/30 to-[#00D1C1]/30 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            
            {/* Glass Card */}
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              {/* Success Badge */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-400">Confirmed</span>
                </div>
              </div>

              <div className="p-8 text-center space-y-6">
                {/* Driver Avatar */}
                <div className="relative mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 rounded-full border border-white/20 flex items-center justify-center">
                    <Car className="h-12 w-12 text-[#00D1C1]" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#00D1C1] to-[#1A1F36] rounded-full border-2 border-[#0A0A0B] flex items-center justify-center">
                    <Star className="h-4 w-4 fill-current text-white" />
                  </div>
                </div>
                
                {/* Driver Info */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-white">Driver Found!</h2>
                    <p className="text-xl font-semibold text-[#00D1C1]">{mockDriver.name}</p>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current text-yellow-500" />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-white">{mockDriver.rating}</span>
                    <span className="text-sm text-white/50">({mockDriver.totalRides} rides)</span>
                  </div>
                </div>
                
                {/* Vehicle Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="text-left">
                      <p className="text-sm text-white/60">Vehicle</p>
                      <p className="font-semibold text-white">{mockDriver.car}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white/60">Plate</p>
                      <p className="font-mono font-semibold text-[#00D1C1]">{mockDriver.plateNumber}</p>
                    </div>
                  </div>
                  
                  {/* ETA Card */}
                  <div className="relative p-4 bg-gradient-to-r from-[#00D1C1]/10 to-[#1A1F36]/10 rounded-2xl border border-[#00D1C1]/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#00D1C1]/20 rounded-full flex items-center justify-center">
                          <Clock className="h-5 w-5 text-[#00D1C1]" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-white/60">Arrival time</p>
                          <p className="text-lg font-bold text-white">3 minutes</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white/60">Distance</p>
                        <p className="font-semibold text-[#00D1C1]">0.8 km away</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300">
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">Call</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">Track</span>
                  </button>
                </div>

                <p className="text-sm text-white/40 leading-relaxed">
                  Your driver is on the way. You'll receive updates as they approach your location.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Grid Elements */}
      <div className="absolute top-20 left-10 w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
      <div className="absolute top-40 right-16 w-8 h-px bg-gradient-to-r from-transparent via-[#00D1C1]/20 to-transparent"></div>
      <div className="absolute bottom-32 left-20 w-px h-12 bg-gradient-to-b from-transparent via-[#1A1F36]/30 to-transparent"></div>
      <div className="absolute bottom-40 right-12 w-2 h-2 bg-[#00D1C1]/30 rounded-full"></div>
    </div>
  );
}