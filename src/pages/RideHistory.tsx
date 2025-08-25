import { Card, CardContent } from '@/components/ui/card';
import { BottomNav } from '@/components/layout/BottomNav';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { MapPin, Clock, Star, Car, ArrowLeft } from 'lucide-react';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { useNavigate } from 'react-router-dom';

export default function RideHistory() {
  const navigate = useNavigate();
  const { rides, loading } = useSupabaseData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'in-progress':
        return 'text-primary';
      case 'upcoming':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading ride history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <LuxuryButton
            variant="minimal"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </LuxuryButton>
          <h1 className="text-2xl font-bold animate-fade-in">Ride History</h1>
        </div>
        
        {rides.length > 0 ? (
          <div className="space-y-4">
            {rides.map((ride, index) => (
              <Card 
                key={ride.id} 
                className="card-minimal animate-slide-up" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${
                          ride.status === 'completed' ? 'bg-success' : 
                          ride.status === 'in-progress' ? 'bg-primary' : 'bg-warning'
                        }`} />
                        <span className={`text-sm font-medium ${getStatusColor(ride.status)}`}>
                          {getStatusText(ride.status)}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{ride.pickup_location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{ride.dropoff_location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-lg">${ride.final_price || ride.estimated_price}</p>
                      <p className="text-sm text-muted-foreground">{ride.vehicle.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(ride.created_at).toLocaleDateString()}
                      </div>
                      {ride.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current text-yellow-500" />
                          {ride.rating}
                        </div>
                      )}
                    </div>
                    
                    {ride.status === 'completed' && (
                      <LuxuryButton variant="ghost" size="sm">
                        Book Again
                      </LuxuryButton>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="card-minimal">
            <CardContent className="p-8 text-center">
              <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No rides yet</h3>
              <p className="text-muted-foreground mb-6">
                Book your first luxury ride to see your history here
              </p>
              <LuxuryButton onClick={() => navigate('/booking/location')}>
                Book Your First Ride
              </LuxuryButton>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNav />
    </div>
  );
}