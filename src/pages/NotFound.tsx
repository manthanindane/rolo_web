import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Car, Clock, User } from "lucide-react";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(user ? '/dashboard' : '/');
    }
  };

  const quickActions = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', condition: !!user },
    { icon: Car, label: 'Book Ride', path: '/booking/location', condition: !!user },
    { icon: Clock, label: 'Ride History', path: '/rides', condition: !!user },
    { icon: User, label: 'Profile', path: '/profile', condition: !!user },
  ].filter(action => action.condition);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1F36] to-[#0A0A0A] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="card-luxury">
          <CardHeader className="text-center">
            <div className="text-6xl font-bold text-[#00D1C1] mb-4">404</div>
            <CardTitle className="text-2xl text-white">Page Not Found</CardTitle>
            <p className="text-white/70 mt-2">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <LuxuryButton
                variant="outline"
                onClick={handleGoBack}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </LuxuryButton>
              <LuxuryButton
                onClick={() => navigate(user ? '/dashboard' : '/')}
                className="flex-1"
              >
                <Home className="h-4 w-4 mr-2" />
                {user ? 'Dashboard' : 'Home'}
              </LuxuryButton>
            </div>

            {user && quickActions.length > 0 && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-white/70 text-sm mb-3">Quick Actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <LuxuryButton
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(action.path)}
                      className="justify-start"
                    >
                      <action.icon className="h-4 w-4 mr-2" />
                      {action.label}
                    </LuxuryButton>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-white/50 text-xs">
                If you believe this is an error, please contact support.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
