import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (!error) {
          navigate('/dashboard');
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (!error) {
          setIsLogin(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col p-6 relative overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F36]/15 via-transparent to-[#00D1C1]/8"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-[#00D1C1]/5 via-[#1A1F36]/3 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-gradient-radial from-[#1A1F36]/8 via-[#00D1C1]/4 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute inset-0 opacity-[0.01]" 
             style={{
               backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
               backgroundSize: '24px 24px'
             }}>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex items-center mb-8 relative z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md">
          {/* Glassmorphic Card */}
          <div className="relative group">
            {/* Card Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/30 to-[#00D1C1]/30 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                  {isLogin ? 'Welcome back' : 'Join Rolo'}
                </h1>
                <p className="text-white/60 text-base">
                  {isLogin ? 'Sign in to your account' : 'Create your luxury account'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium text-white/80 block">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                      <input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full h-12 pl-12 pr-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-[#00D1C1]/50 focus:ring-2 focus:ring-[#00D1C1]/20 focus:outline-none transition-all duration-300"
                        placeholder="Enter your full name"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-white/80 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 pl-12 pr-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-[#00D1C1]/50 focus:ring-2 focus:ring-[#00D1C1]/20 focus:outline-none transition-all duration-300"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-white/80 block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 pl-12 pr-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-[#00D1C1]/50 focus:ring-2 focus:ring-[#00D1C1]/20 focus:outline-none transition-all duration-300"
                      placeholder="Enter your password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] rounded-xl blur opacity-40 group-hover:opacity-60 transition duration-300"></div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full h-12 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-[#00D1C1]/20 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-[1.01]"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                        Please wait...
                      </div>
                    ) : (
                      isLogin ? 'Sign In' : 'Create Account'
                    )}
                  </button>
                </div>
              </form>
              
              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black/40 px-4 text-white/50 font-medium tracking-wider">
                    Or continue with
                  </span>
                </div>
              </div>
              
              {/* Social Login */}
              <div className="space-y-3">
                <button
                  className="w-full h-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white/70 font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                  disabled
                >
                  <div className="w-5 h-5 bg-white rounded-full mr-3"></div>
                  Continue with Google
                  <span className="text-xs text-white/40 ml-2">(Soon)</span>
                </button>
                
                <button
                  className="w-full h-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white/70 font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                  disabled
                >
                  <div className="w-5 h-5 bg-white rounded mr-3"></div>
                  Continue with Apple
                  <span className="text-xs text-white/40 ml-2">(Soon)</span>
                </button>
              </div>
              
              {/* Toggle */}
              <div className="text-center mt-8">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-white/60 hover:text-white transition-colors font-medium"
                >
                  {isLogin 
                    ? "Don't have an account? " 
                    : "Already have an account? "
                  }
                  <span className="text-[#00D1C1] hover:text-[#00D1C1]/80">
                    {isLogin ? "Sign up" : "Sign in"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-32 left-16 w-px h-16 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
      <div className="absolute bottom-40 right-20 w-12 h-px bg-gradient-to-r from-transparent via-[#00D1C1]/10 to-transparent"></div>
    </div>
  );
}