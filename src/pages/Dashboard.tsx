import { useNavigate } from 'react-router-dom';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { BottomNav } from '@/components/layout/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Search, MapPin, Clock, Star, Car, ArrowRight, Calendar, TrendingUp, Bell, Menu, Filter, User } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { rides, profile, loading } = useSupabaseData();
  
  const recentRides = rides.slice(0, 3);
  const currentTime = new Date().getHours();
  const greeting = currentTime < 12 ? 'Good morning' : currentTime < 18 ? 'Good afternoon' : 'Good evening';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center font-['Plus_Jakarta_Sans']">
        <div className="text-center">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-[#00D1C1]/30 border-t-[#00D1C1] rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-12 h-12 border border-[#1A1F36]/20 rounded-full mx-auto"></div>
          </div>
          <p className="text-white/60 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] font-['Plus_Jakarta_Sans'] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F36]/10 via-transparent to-[#00D1C1]/5"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-radial from-[#00D1C1]/8 via-[#1A1F36]/4 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/2 left-1/4 w-80 h-80 bg-gradient-radial from-[#1A1F36]/6 via-[#00D1C1]/3 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Header Section */}
        <div className="relative z-10 p-6 pt-12 pb-24">
          <div className="mb-8">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
              <div className="w-2 h-2 bg-[#00D1C1] rounded-full animate-pulse"></div>
              <span className="text-xs text-white/70 font-medium">Online & Available</span>
            </div>

            {/* Greeting */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {greeting},
              </h1>
              <p className="text-xl text-white/70 font-medium">
                {profile?.full_name || user?.email?.split('@')[0] || 'there'}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
              <TrendingUp className="w-5 h-5 text-[#00D1C1] mx-auto mb-2" />
              <p className="text-lg font-semibold text-white">{rides.length}</p>
              <p className="text-xs text-white/50">Total Rides</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
              <Star className="w-5 h-5 text-[#1A1F36] mx-auto mb-2" />
              <p className="text-lg font-semibold text-white">4.9</p>
              <p className="text-xs text-white/50">Rating</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
              <Calendar className="w-5 h-5 text-white/60 mx-auto mb-2" />
              <p className="text-lg font-semibold text-white">12</p>
              <p className="text-xs text-white/50">This Month</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 px-6 space-y-8">
          {/* Search Section */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/30 to-[#00D1C1]/30 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Where to next?</h3>
              
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  placeholder="Search destination..."
                  className="w-full h-14 pl-12 pr-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white text-lg placeholder-white/40 focus:border-[#00D1C1]/50 focus:ring-2 focus:ring-[#00D1C1]/20 focus:outline-none transition-all duration-300"
                  onClick={() => navigate('/booking/location')}
                  readOnly
                />
              </div>
              
              <div className="relative group/btn">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] rounded-xl blur opacity-40 group-hover/btn:opacity-60 transition duration-300"></div>
                <button
                  onClick={() => navigate('/booking/location')}
                  className="relative w-full h-12 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-[#00D1C1]/20 transition-all duration-500 group-hover/btn:scale-[1.01] flex items-center justify-center gap-2"
                >
                  Book a Ride
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Rides */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
              {recentRides.length > 0 && (
                <button 
                  onClick={() => navigate('/rides')}
                  className="text-[#00D1C1] hover:text-[#00D1C1]/80 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  View All
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
            
            {recentRides.length > 0 ? (
              <div className="space-y-3">
                {recentRides.map((ride, index) => (
                  <div 
                    key={ride.id} 
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center mt-1">
                            <div className="w-2 h-2 bg-[#00D1C1] rounded-full"></div>
                            <div className="w-px h-4 bg-white/20 my-1"></div>
                            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-white font-medium text-sm">{ride.pickup_location}</p>
                            <p className="text-white/60 text-sm">{ride.dropoff_location}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-white/50">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(ride.created_at).toLocaleDateString()}
                          </div>
                          {ride.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current text-[#00D1C1]" />
                              {ride.rating}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <p className="font-semibold text-white">${ride.final_price || ride.estimated_price}</p>
                        <p className="text-xs text-white/50">{ride.vehicle.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1A1F36]/30 to-[#00D1C1]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Car className="h-8 w-8 text-white/60" />
                </div>
                <h3 className="text-white font-medium mb-2">Ready for your first ride?</h3>
                <p className="text-white/50 text-sm mb-6">
                  Experience luxury transportation at your fingertips
                </p>
                <button
                  onClick={() => navigate('/booking/location')}
                  className="text-[#00D1C1] hover:text-[#00D1C1]/80 font-medium text-sm transition-colors"
                >
                  Book your first ride →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Floating Navigation Dots */}
        <div className="absolute bottom-32 right-6 flex flex-col space-y-2">
          <div className="w-1 h-8 bg-gradient-to-b from-[#00D1C1]/30 to-transparent rounded-full"></div>
          <div className="w-1 h-4 bg-[#1A1F36]/40 rounded-full"></div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block lg:ml-64 min-h-screen">
        {/* Desktop Header */}
        <header className="relative z-10 px-8 py-6 border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {greeting}, {profile?.full_name || user?.email?.split('@')[0] || 'there'}
                </h1>
                <p className="text-white/60">Ready for your next journey?</p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-2 h-2 bg-[#00D1C1] rounded-full animate-pulse"></div>
                <span className="text-xs text-white/70 font-medium">Online & Available</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-white/70 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#00D1C1] rounded-full"></div>
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Desktop Content */}
        <main className="relative z-10 p-8">
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#00D1C1]/20 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-[#00D1C1]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{rides.length}</p>
                      <p className="text-white/50 text-sm">Total Rides</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#1A1F36]/30 rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-[#1A1F36]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">4.9</p>
                      <p className="text-white/50 text-sm">Rating</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white/60" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">12</p>
                      <p className="text-white/50 text-sm">This Month</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#00D1C1]/20 to-[#1A1F36]/20 rounded-xl flex items-center justify-center">
                      <Car className="w-6 h-6 text-white/70" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">$247</p>
                      <p className="text-white/50 text-sm">Saved</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Rides Desktop */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white bg-white/5 border border-white/10 rounded-xl transition-colors">
                      <Filter className="w-4 h-4" />
                      Filter
                    </button>
                    {recentRides.length > 0 && (
                      <button 
                        onClick={() => navigate('/rides')}
                        className="text-[#00D1C1] hover:text-[#00D1C1]/80 font-medium flex items-center gap-1 transition-colors"
                      >
                        View All
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                {recentRides.length > 0 ? (
                  <div className="space-y-4">
                    {recentRides.map((ride, index) => (
                      <div 
                        key={ride.id} 
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6 flex-1">
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 bg-[#00D1C1] rounded-full"></div>
                              <div className="w-px h-8 bg-white/20 my-2"></div>
                              <div className="w-3 h-3 bg-white/40 rounded-full"></div>
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-4">
                                <p className="text-white font-semibold">{ride.pickup_location}</p>
                                <ArrowRight className="w-4 h-4 text-white/40" />
                                <p className="text-white/70">{ride.dropoff_location}</p>
                              </div>
                              <div className="flex items-center gap-6 text-sm text-white/50">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  {new Date(ride.created_at).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Car className="h-4 w-4" />
                                  {ride.vehicle?.name || 'Premium'}
                                </div>
                                {ride.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-current text-[#00D1C1]" />
                                    {ride.rating}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-xl font-bold text-white">${ride.final_price || ride.estimated_price}</p>
                            <p className="text-sm text-white/50">Total fare</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#1A1F36]/30 to-[#00D1C1]/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Car className="h-10 w-10 text-white/60" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Ready for your first ride?</h3>
                    <p className="text-white/50 mb-8 max-w-md mx-auto">
                      Experience luxury transportation with professional drivers and premium vehicles at your fingertips.
                    </p>
                    <button
                      onClick={() => navigate('/booking/location')}
                      className="bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-[#00D1C1]/20 transition-all duration-500 flex items-center gap-2 mx-auto"
                    >
                      Book your first ride
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Book Section */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/30 to-[#00D1C1]/30 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-white mb-6">Quick Booking</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                      <input
                        placeholder="Search destination..."
                        className="w-full h-12 pl-12 pr-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-[#00D1C1]/50 focus:ring-2 focus:ring-[#00D1C1]/20 focus:outline-none transition-all duration-300"
                        onClick={() => navigate('/booking/location')}
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div className="relative group/btn">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] rounded-xl blur opacity-40 group-hover/btn:opacity-60 transition duration-300"></div>
                    <button
                      onClick={() => navigate('/booking/location')}
                      className="relative w-full h-12 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-[#00D1C1]/20 transition-all duration-500 group-hover/btn:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      Book a Ride
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate('/rides')}
                    className="w-full flex items-center gap-3 p-3 text-left text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
                  >
                    <Clock className="w-5 h-5" />
                    <span>View All Rides</span>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </button>
                  <button 
                    onClick={() => navigate('/profile')}
                    className="w-full flex items-center gap-3 p-3 text-left text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
                  >
                    <User className="w-5 h-5" />
                    <span>Update Profile</span>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300">
                    <Star className="w-5 h-5" />
                    <span>Rate Last Ride</span>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </button>
                </div>
              </div>

              {/* Achievement Badge */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1F36]/30 to-[#00D1C1]/20 border border-white/10 rounded-2xl p-6">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#00D1C1]/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] rounded-xl flex items-center justify-center mb-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Premium Member</h3>
                  <p className="text-white/60 text-sm mb-4">
                    You've completed 25+ rides! Enjoy exclusive benefits and priority booking.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-[#00D1C1]">
                    <span className="font-medium">View Benefits</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}