import { Card, CardContent } from '@/components/ui/card';
import { BottomNav } from '@/components/layout/BottomNav';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { MapPin, Clock, Star, Car, ArrowLeft, Route, Calendar, Filter, Search } from 'lucide-react';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { useNavigate } from 'react-router-dom';

export default function RideHistory() {
  const navigate = useNavigate();
  const { rides, loading } = useSupabaseData();

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-[#00D1C1]';
      case 'in-progress':
        return 'text-[#1A1F36]';
      case 'upcoming':
        return 'text-yellow-400';
      default:
        return 'text-white/40';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-[#00D1C1]';
      case 'in-progress':
        return 'bg-[#1A1F36]';
      case 'upcoming':
        return 'bg-yellow-400';
      default:
        return 'bg-white/20';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'upcoming':
        return 'Upcoming';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center relative overflow-hidden font-['Plus_Jakarta_Sans']">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F36]/15 via-transparent to-[#00D1C1]/8"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-[#00D1C1]/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-gradient-radial from-[#1A1F36]/8 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-2 border-[#00D1C1]/30 border-t-[#00D1C1] rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border border-white/10 rounded-full mx-auto"></div>
          </div>
          <p className="text-white/60 font-medium">Loading your ride history...</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <div className="w-2 h-2 bg-[#00D1C1] rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-[#00D1C1]/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-[#00D1C1]/30 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] pb-20 lg:pb-8 relative overflow-hidden font-['Plus_Jakarta_Sans']">
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
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="max-w-7xl mx-auto px-8 py-8">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/30 to-[#00D1C1]/30 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                  <LuxuryButton
                    variant="minimal"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="relative bg-white/5 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 rounded-xl w-14 h-14 flex items-center justify-center"
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </LuxuryButton>
                </div>
                
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in">Ride History</h1>
                  <p className="text-white/60">Track all your premium journeys and experiences</p>
                </div>
              </div>

              {/* Desktop Controls */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/20 to-[#00D1C1]/20 rounded-xl blur opacity-20"></div>
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 min-w-[300px]">
                    <Search className="h-4 w-4 text-white/40" />
                    <input 
                      placeholder="Search rides..." 
                      className="bg-transparent text-white placeholder-white/40 flex-1 outline-none text-sm"
                    />
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/20 to-[#00D1C1]/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                  <LuxuryButton
                    variant="ghost"
                    className="relative bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 px-4 py-3 rounded-xl flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Filter
                  </LuxuryButton>
                </div>
              </div>
            </div>

            {/* Desktop Content */}
            {rides.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                {rides.map((ride, index) => (
                  <div key={ride.id} className="relative group" style={{ animationDelay: `${index * 0.05}s` }}>
                    {/* Desktop Ride Card */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/20 to-[#00D1C1]/20 rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500"></div>
                    
                    <Card className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-slide-up hover:bg-black/50 transition-all duration-300 h-full">
                      <CardContent className="p-6">
                        {/* Status and Price Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getStatusBg(ride.status)} shadow-lg`}>
                              <div className={`w-full h-full rounded-full ${getStatusBg(ride.status)} animate-pulse`}></div>
                            </div>
                            <div>
                              <span className={`text-sm font-semibold ${getStatusColor(ride.status)}`}>
                                {getStatusText(ride.status)}
                              </span>
                              <p className="text-white/40 text-xs font-medium mt-0.5">{ride.vehicle.name}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-bold text-2xl text-white">${ride.final_price || ride.estimated_price}</p>
                            {ride.rating && (
                              <div className="flex items-center gap-1 justify-end mt-2">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm text-white/60 font-medium">{ride.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Route Information */}
                        <div className="space-y-4 mb-6">
                          <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center mt-1.5">
                              <div className="w-4 h-4 rounded-full bg-[#00D1C1] shadow-lg shadow-[#00D1C1]/30"></div>
                              <div className="w-0.5 h-8 bg-gradient-to-b from-[#00D1C1]/50 to-white/20 my-2"></div>
                              <MapPin className="h-4 w-4 text-white/40" />
                            </div>
                            <div className="flex-1 space-y-4">
                              <div>
                                <p className="text-sm font-semibold text-white mb-1">From</p>
                                <p className="text-sm text-white/70 line-clamp-2">{ride.pickup_location}</p>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-white mb-1">To</p>
                                <p className="text-sm text-white/70 line-clamp-2">{ride.dropoff_location}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex items-center gap-6 text-xs text-white/40">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span className="font-medium">
                                {new Date(ride.created_at).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span className="font-medium">
                                {new Date(ride.created_at).toLocaleTimeString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                          
                          {ride.status === 'completed' && (
                            <div className="relative group/btn">
                              <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/30 to-[#00D1C1]/30 rounded-lg blur opacity-0 group-hover/btn:opacity-40 transition duration-300"></div>
                              <LuxuryButton 
                                variant="ghost" 
                                size="sm"
                                className="relative bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 text-xs font-medium px-4 py-2 rounded-lg"
                              >
                                Book Again
                              </LuxuryButton>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="relative group max-w-lg">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/30 to-[#00D1C1]/30 rounded-3xl blur opacity-20"></div>
                  <Card className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
                    <CardContent className="p-16 text-center">
                      <div className="relative mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1F36]/30 to-[#00D1C1]/30 rounded-full blur-xl"></div>
                        <div className="relative w-24 h-24 mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center">
                          <Car className="h-12 w-12 text-white/60" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">No rides yet</h3>
                      <p className="text-white/60 mb-10 max-w-sm mx-auto leading-relaxed text-lg">
                        Start your premium journey and experience luxury transportation like never before
                      </p>
                      <div className="relative group/cta">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] rounded-full blur opacity-20 group-hover/cta:opacity-40 transition duration-300"></div>
                        <LuxuryButton 
                          onClick={() => navigate('/booking/location')}
                          className="relative px-10 py-4 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] text-white font-semibold rounded-full border-0 hover:shadow-2xl hover:shadow-[#00D1C1]/20 transition-all duration-500 group-hover/cta:scale-[1.02] text-lg"
                        >
                          Book Your First Ride
                        </LuxuryButton>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="p-6">
            {/* Mobile Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/30 to-[#00D1C1]/30 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                <LuxuryButton
                  variant="minimal"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="relative bg-white/5 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 rounded-xl w-12 h-12 flex items-center justify-center"
                >
                  <ArrowLeft className="h-5 w-5" />
                </LuxuryButton>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-white mb-1 animate-fade-in">Ride History</h1>
                <p className="text-white/60 text-sm">Track your journeys</p>
              </div>
            </div>
            
            {/* Mobile Content */}
            {rides.length > 0 ? (
              <div className="space-y-4">
                {rides.map((ride, index) => (
                  <div key={ride.id} className="relative group" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/20 to-[#00D1C1]/20 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                    
                    <Card className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-slide-up hover:bg-black/50 transition-all duration-300">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getStatusBg(ride.status)} shadow-lg`}>
                              <div className={`w-full h-full rounded-full ${getStatusBg(ride.status)} animate-pulse`}></div>
                            </div>
                            <div>
                              <span className={`text-sm font-semibold ${getStatusColor(ride.status)}`}>
                                {getStatusText(ride.status)}
                              </span>
                              <p className="text-white/40 text-xs font-medium">{ride.vehicle.name}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-bold text-xl text-white">${ride.final_price || ride.estimated_price}</p>
                            {ride.rating && (
                              <div className="flex items-center gap-1 justify-end mt-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-white/60 font-medium">{ride.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-start gap-3">
                            <div className="flex flex-col items-center mt-1">
                              <div className="w-3 h-3 rounded-full bg-[#00D1C1] shadow-lg shadow-[#00D1C1]/30"></div>
                              <div className="w-0.5 h-6 bg-gradient-to-b from-[#00D1C1]/50 to-white/20 my-1"></div>
                              <MapPin className="h-3 w-3 text-white/40" />
                            </div>
                            <div className="flex-1 space-y-3">
                              <div>
                                <p className="text-sm font-medium text-white">From</p>
                                <p className="text-sm text-white/70">{ride.pickup_location}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">To</p>
                                <p className="text-sm text-white/70">{ride.dropoff_location}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex items-center gap-4 text-xs text-white/40">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3 w-3" />
                              <span className="font-medium">
                                {new Date(ride.created_at).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3 w-3" />
                              <span className="font-medium">
                                {new Date(ride.created_at).toLocaleTimeString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                          
                          {ride.status === 'completed' && (
                            <div className="relative group/btn">
                              <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/30 to-[#00D1C1]/30 rounded-lg blur opacity-0 group-hover/btn:opacity-40 transition duration-300"></div>
                              <LuxuryButton 
                                variant="ghost" 
                                size="sm"
                                className="relative bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 text-xs font-medium px-4 py-2 rounded-lg"
                              >
                                Book Again
                              </LuxuryButton>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/30 to-[#00D1C1]/30 rounded-3xl blur opacity-20"></div>
                <Card className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
                  <CardContent className="p-12 text-center">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#1A1F36]/30 to-[#00D1C1]/30 rounded-full blur-xl"></div>
                      <div className="relative w-20 h-20 mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center">
                        <Car className="h-10 w-10 text-white/60" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">No rides yet</h3>
                    <p className="text-white/60 mb-8 max-w-sm mx-auto leading-relaxed">
                      Start your premium journey and experience luxury transportation
                    </p>
                    <div className="relative group/cta">
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] rounded-full blur opacity-20 group-hover/cta:opacity-40 transition duration-300"></div>
                      <LuxuryButton 
                        onClick={() => navigate('/booking/location')}
                        className="relative px-8 py-4 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] text-white font-semibold rounded-full border-0 hover:shadow-2xl hover:shadow-[#00D1C1]/20 transition-all duration-500 group-hover/cta:scale-[1.02]"
                      >
                        Book Your First Ride
                      </LuxuryButton>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}