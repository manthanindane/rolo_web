import { useNavigate } from 'react-router-dom';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { Car } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center text-center px-6">
      <div className="animate-fade-in">
        <div className="mb-8">
          <Car className="h-16 w-16 text-luxury-white mx-auto mb-4" />
          <h1 className="text-5xl md:text-7xl font-bold text-luxury-white mb-4 tracking-tight">
            Rolo
          </h1>
          <p className="text-xl md:text-2xl text-luxury-gray-200 font-light tracking-wide">
            Luxury. At Your Doorstep.
          </p>
        </div>
        
        <div className="space-y-4 max-w-sm mx-auto">
          <LuxuryButton
            onClick={() => navigate('/auth')}
            className="w-full h-14 text-base bg-luxury-white text-luxury-black hover:bg-luxury-gray-100"
            size="lg"
          >
            Book a Ride
          </LuxuryButton>
          
          <p className="text-sm text-luxury-gray-300">
            Premium rides • Professional drivers • Uncompromised luxury
          </p>
        </div>
      </div>
    </div>
  );
}