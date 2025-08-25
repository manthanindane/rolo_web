import { useNavigate } from 'react-router-dom';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { BottomNav } from '@/components/layout/BottomNav';
import { useRoloStore } from '@/store/useRoloStore';
import { Search, MapPin, Clock, Star, Car } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, rides } = useRoloStore();
  
  const recentRides = rides.slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="p-6 bg-gradient-subtle">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold mb-1">Good morning,</h1>
          <p className="text-xl text-muted-foreground">{user?.name}</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Search Section */}
        <Card className="card-luxury animate-slide-up">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Where to?"
                className="pl-12 input-luxury text-lg h-14"
                onClick={() => navigate('/booking/location')}
                readOnly
              />
            </div>
            
            <LuxuryButton
              onClick={() => navigate('/booking/location')}
              className="w-full mt-4"
              size="lg"
            >
              Book a Ride
            </LuxuryButton>
          </CardContent>
        </Card>

        {/* Recent Rides */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-lg font-semibold mb-4">Recent Rides</h2>
          
          {recentRides.length > 0 ? (
            <div className="space-y-3">
              {recentRides.map((ride) => (
                <Card key={ride.id} className="card-minimal">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{ride.pickup}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{ride.dropoff}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {ride.date}
                          </div>
                          {ride.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current text-yellow-500" />
                              {ride.rating}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold">${ride.price}</p>
                        <p className="text-sm text-muted-foreground">{ride.vehicle.name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="card-minimal">
              <CardContent className="p-6 text-center">
                <Car className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No recent rides</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Book your first luxury ride today
                </p>
              </CardContent>
            </Card>
          )}
          
          {recentRides.length > 0 && (
            <LuxuryButton
              variant="ghost"
              onClick={() => navigate('/rides')}
              className="w-full mt-4"
            >
              View All Rides
            </LuxuryButton>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}