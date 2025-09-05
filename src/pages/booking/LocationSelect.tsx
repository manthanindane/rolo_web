import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BottomNav } from '@/components/layout/BottomNav';
import { useRoloStore } from '@/store/useRoloStore';
import { ArrowLeft, MapPin, Navigation, Clock, Star, Zap, MapIcon } from 'lucide-react';

export default function LocationSelect() {
  const navigate = useNavigate();
  const { bookingFlow, updateBookingFlow } = useRoloStore();
  
  const [pickup, setPickup] = useState(bookingFlow.pickup);
  const [dropoff, setDropoff] = useState(bookingFlow.dropoff);

  const handleNext = () => {
    if (!pickup || !dropoff) return;
    
    updateBookingFlow({ pickup, dropoff });
    navigate('/booking/vehicle');
  };

  const handleCurrentLocation = () => {
    setPickup('Current Location');
  };

  const recentLocations = [
    { name: 'Home', address: '123 Main Street, Downtown', icon: '🏠' },
    { name: 'Office', address: '456 Business Ave, Central', icon: '🏢' },
    { name: 'Airport', address: 'International Airport Terminal 1', icon: '✈️' },
    { name: 'Mall', address: 'Grand Shopping Center', icon: '🛍️' }
  ];

  const popularDestinations = [
    'Downtown District',
    'Business Center',
    'Shopping Mall',
    'Airport Terminal',
    'Train Station',
    'University Campus'
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] font-['Plus_Jakarta_Sans'] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F36]/10 via-transparent to-[#00D1C1]/5"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-radial from-[#00D1C1]/8 via-[#1A1F36]/4 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/2 left-1/4 w-80 h-80 bg-gradient-radial from-[#1A1F36]/6 via-[#00D1C1]/3 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden relative z-10">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-6 pt-12">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-white">Book a Ride</h1>
          <div className="w-10" />
        </div>

        {/* Mobile Content */}
        <div className="px-6 pb-24">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/30 to-[#00D1C1]/30 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-[#1A1F36]/30 to-[#00D1C1]/20 rounded-xl flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-[#00D1C1]" />
                </div>
                <h2 className="text-xl font-semibold text-white">Where are you going?</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-white/70 text-sm font-medium">Pickup Location</label>
                  <div className="relative">
                    <input
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      placeholder="Enter pickup location"
                      className="w-full h-12 pl-4 pr-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-[#00D1C1]/50 focus:ring-2 focus:ring-[#00D1C1]/20 focus:outline-none transition-all duration-300"
                    />
                    <button
                      onClick={handleCurrentLocation}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-white/60 hover:text-[#00D1C1] transition-colors"
                    >
                      <Navigation className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-white/70 text-sm font-medium">Drop-off Location</label>
                  <input
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    placeholder="Where to?"
                    className="w-full h-12 pl-4 pr-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-[#00D1C1]/50 focus:ring-2 focus:ring-[#00D1C1]/20 focus:outline-none transition-all duration-300"
                  />
                </div>
                
                <div className="relative group/btn pt-4">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] rounded-xl blur opacity-40 group-hover/btn:opacity-60 transition duration-300"></div>
                  <button
                    onClick={handleNext}
                    disabled={!pickup || !dropoff}
                    className="relative w-full h-12 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-[#00D1C1]/20 transition-all duration-500 group-hover/btn:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block lg:ml-64 min-h-screen relative z-10">
        {/* Desktop Header */}
        <header className="px-8 py-6 border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Book Your Ride</h1>
              <p className="text-white/60">Choose your pickup and destination</p>
            </div>
          </div>
        </header>

        {/* Desktop Content */}
        <main className="p-8">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl">
            {/* Main Booking Form */}
            <div className="lg:col-span-2">
              <div className="relative group mb-8">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/30 to-[#00D1C1]/30 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#1A1F36]/30 to-[#00D1C1]/20 rounded-xl flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-[#00D1C1]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Plan Your Journey</h2>
                      <p className="text-white/60">Enter your pickup and destination locations</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-white font-medium text-lg flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#00D1C1] rounded-full"></div>
                        Pickup Location
                      </label>
                      <div className="relative">
                        <input
                          value={pickup}
                          onChange={(e) => setPickup(e.target.value)}
                          placeholder="Enter pickup location"
                          className="w-full h-14 pl-6 pr-14 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white text-lg placeholder-white/40 focus:border-[#00D1C1]/50 focus:ring-2 focus:ring-[#00D1C1]/20 focus:outline-none transition-all duration-300"
                        />
                        <button
                          onClick={handleCurrentLocation}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-white/60 hover:text-[#00D1C1] hover:bg-[#00D1C1]/10 rounded-lg transition-all duration-300"
                        >
                          <Navigation className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="text-white font-medium text-lg flex items-center gap-2">
                        <div className="w-3 h-3 bg-white/40 rounded-full"></div>
                        Drop-off Location
                      </label>
                      <input
                        value={dropoff}
                        onChange={(e) => setDropoff(e.target.value)}
                        placeholder="Where to?"
                        className="w-full h-14 pl-6 pr-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white text-lg placeholder-white/40 focus:border-[#00D1C1]/50 focus:ring-2 focus:ring-[#00D1C1]/20 focus:outline-none transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                  <div className="relative group/btn mt-8">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] rounded-xl blur opacity-40 group-hover/btn:opacity-60 transition duration-300"></div>
                    <button
                      onClick={handleNext}
                      disabled={!pickup || !dropoff}
                      className="relative w-full h-14 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] text-white font-semibold text-lg rounded-xl hover:shadow-2xl hover:shadow-[#00D1C1]/20 transition-all duration-500 group-hover/btn:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Vehicle Selection
                    </button>
                  </div>
                </div>
              </div>

              {/* Popular Destinations */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#00D1C1]" />
                  Popular Destinations
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {popularDestinations.map((destination, index) => (
                    <button
                      key={index}
                      onClick={() => setDropoff(destination)}
                      className="p-3 text-left text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/5 hover:border-white/20"
                    >
                      <p className="text-sm font-medium">{destination}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Locations */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-white/70" />
                  Recent Locations
                </h3>
                <div className="space-y-3">
                  {recentLocations.map((location, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (!pickup) setPickup(location.address);
                        else setDropoff(location.address);
                      }}
                      className="w-full flex items-center gap-3 p-3 text-left text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-lg">
                        {location.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white group-hover:text-[#00D1C1] transition-colors">
                          {location.name}
                        </p>
                        <p className="text-xs text-white/50">{location.address}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Booking Tips */}
              <div className="bg-gradient-to-br from-[#1A1F36]/30 to-[#00D1C1]/20 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#00D1C1]" />
                  Pro Tips
                </h3>
                <div className="space-y-3 text-sm text-white/70">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[#00D1C1] rounded-full mt-2"></div>
                    <p>Use the location button for precise pickup coordinates</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[#00D1C1] rounded-full mt-2"></div>
                    <p>Add specific landmarks for easier driver navigation</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[#00D1C1] rounded-full mt-2"></div>
                    <p>Save frequently used locations for quick booking</p>
                  </div>
                </div>
              </div>

              {/* Map Preview Placeholder */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#1A1F36]/30 to-[#00D1C1]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapIcon className="w-8 h-8 text-white/60" />
                </div>
                <h3 className="text-white font-medium mb-2">Route Preview</h3>
                <p className="text-white/50 text-sm">
                  Enter both locations to see your route and estimated time
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}