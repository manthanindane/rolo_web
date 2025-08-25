import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRoloStore } from '@/store/useRoloStore';
import { ArrowLeft } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const navigate = useNavigate();
  const { login } = useRoloStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication
    const mockUser = {
      id: '1',
      name: name || 'John Doe',
      email: email || 'john@example.com',
      phone: '+1 (555) 123-4567'
    };
    
    login(mockUser);
    navigate('/dashboard');
  };

  const handleSocialLogin = (provider: string) => {
    // Mock social login
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567'
    };
    
    login(mockUser);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-4">
      <div className="flex items-center mb-8">
        <LuxuryButton
          variant="minimal"
          size="icon"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-5 w-5" />
        </LuxuryButton>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md card-luxury animate-slide-up">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <p className="text-muted-foreground">
              {isLogin ? 'Sign in to continue' : 'Join Rolo today'}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-luxury"
                    placeholder="Enter your full name"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-luxury"
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-luxury"
                  placeholder="Enter your password"
                />
              </div>
              
              <LuxuryButton type="submit" className="w-full">
                {isLogin ? 'Sign In' : 'Create Account'}
              </LuxuryButton>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <LuxuryButton
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin('google')}
              >
                Continue with Google
              </LuxuryButton>
              
              <LuxuryButton
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin('apple')}
              >
                Continue with Apple
              </LuxuryButton>
            </div>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}