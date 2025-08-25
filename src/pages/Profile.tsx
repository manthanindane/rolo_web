import { useNavigate } from 'react-router-dom';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BottomNav } from '@/components/layout/BottomNav';
import { useRoloStore } from '@/store/useRoloStore';
import { User, Mail, Phone, CreditCard, LogOut, Edit3, Clock } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useRoloStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 animate-fade-in">Profile</h1>
        
        <div className="space-y-6">
          {/* User Info */}
          <Card className="card-luxury animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <span>Personal Information</span>
                </div>
                <LuxuryButton variant="ghost" size="icon">
                  <Edit3 className="h-4 w-4" />
                </LuxuryButton>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="card-luxury animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <span>Payment Methods</span>
                </div>
                <LuxuryButton variant="ghost" size="sm">
                  Add
                </LuxuryButton>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/26</p>
                  </div>
                </div>
                <span className="text-sm text-success">Default</span>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="card-luxury animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-4">
              <div className="space-y-1">
                <LuxuryButton
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate('/rides')}
                >
                  <Clock className="h-4 w-4 mr-3" />
                  Ride History
                </LuxuryButton>
                
                <LuxuryButton
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <CreditCard className="h-4 w-4 mr-3" />
                  Payment Settings
                </LuxuryButton>
                
                <LuxuryButton
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <User className="h-4 w-4 mr-3" />
                  Account Settings
                </LuxuryButton>
              </div>
            </CardContent>
          </Card>

          {/* Logout */}
          <div className="pt-4">
            <LuxuryButton
              variant="outline"
              onClick={handleLogout}
              className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </LuxuryButton>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}