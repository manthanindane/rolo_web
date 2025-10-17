import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Shield, CreditCard, User, Globe, Moon, Sun, LogOut } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';

export default function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1F36] to-[#0A0A0A] text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <LuxuryButton
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </LuxuryButton>
            <h1 className="text-xl font-bold">Settings</h1>
          </div>
        </div>
      </div>

      <div className="p-4 pb-20 space-y-6">
        {/* Account Settings */}
        <Card className="card-luxury animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="h-5 w-5 text-[#00D1C1]" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LuxuryButton
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/profile')}
            >
              <User className="h-4 w-4 mr-3" />
              Profile Information
            </LuxuryButton>
            
            <LuxuryButton
              variant="ghost"
              className="w-full justify-start"
            >
              <CreditCard className="h-4 w-4 mr-3" />
              Payment Methods
            </LuxuryButton>
            
            <LuxuryButton
              variant="ghost"
              className="w-full justify-start"
            >
              <Shield className="h-4 w-4 mr-3" />
              Privacy & Security
            </LuxuryButton>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card className="card-luxury animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Globe className="h-5 w-5 text-[#00D1C1]" />
              App Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-white/70" />
                <span className="text-white">Push Notifications</span>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="h-4 w-4 text-white/70" />
                <span className="text-white">Dark Mode</span>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-white/70" />
                <span className="text-white">Language</span>
              </div>
              <span className="text-white/70">English</span>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="card-luxury animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-[#00D1C1]" />
              Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LuxuryButton
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/contact')}
            >
              <User className="h-4 w-4 mr-3" />
              Contact Support
            </LuxuryButton>
            
            <LuxuryButton
              variant="ghost"
              className="w-full justify-start"
            >
              <Shield className="h-4 w-4 mr-3" />
              Help Center
            </LuxuryButton>
            
            <LuxuryButton
              variant="ghost"
              className="w-full justify-start"
            >
              <Bell className="h-4 w-4 mr-3" />
              Terms & Conditions
            </LuxuryButton>
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

      <BottomNav />
    </div>
  );
}
