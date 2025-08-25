import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useRoloStore } from '@/store/useRoloStore';
import { Loader2, Star, Car } from 'lucide-react';

const mockDriver = {
  id: '1',
  name: 'Michael Chen',
  rating: 4.9,
  car: 'Mercedes S-Class',
  plateNumber: 'LUX 001',
  photo: '/placeholder.svg'
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
        return prev + 10;
      });
    }, 300);

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
      }, 2000);
    }
  }, [isSearching, currentBooking, updateRide, navigate]);

  if (!currentBooking) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {isSearching ? (
          <>
            <div className="text-center animate-fade-in">
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <Car className="absolute inset-0 m-auto h-8 w-8 text-primary" />
              </div>
              
              <h1 className="text-2xl font-bold mb-2">Finding your luxury driver</h1>
              <p className="text-muted-foreground">
                We're connecting you with the best available driver in your area
              </p>
              
              <div className="mt-6 bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <Card className="card-luxury animate-scale-in">
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <Car className="h-10 w-10 text-muted-foreground" />
              </div>
              
              <h2 className="text-xl font-bold mb-2">Driver Found!</h2>
              <p className="text-lg font-semibold">{mockDriver.name}</p>
              
              <div className="flex items-center justify-center gap-1 mt-2 mb-4">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <span className="text-sm font-medium">{mockDriver.rating}</span>
                <span className="text-sm text-muted-foreground">(500+ rides)</span>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{mockDriver.car}</p>
                <p className="font-mono">{mockDriver.plateNumber}</p>
              </div>
              
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">
                  <span className="font-medium text-foreground">ETA:</span> 3 minutes
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}