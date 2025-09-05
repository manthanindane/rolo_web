import { useNavigate } from 'react-router-dom';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F36]/20 via-transparent to-[#00D1C1]/10"></div>
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-radial from-[#00D1C1]/8 via-[#1A1F36]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-gradient-radial from-[#1A1F36]/10 via-[#00D1C1]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute inset-0 opacity-[0.02]" 
             style={{
               backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
               backgroundSize: '20px 20px'
             }}>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 text-sm text-white/70 font-['Plus_Jakarta_Sans']">
          <Sparkles className="w-4 h-4 text-[#00D1C1]" />
          Now available in your city
          <div className="w-2 h-2 bg-[#00D1C1] rounded-full animate-pulse"></div>
        </div>

        {/* Hero Section */}
        <div className="space-y-6 mb-12">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight font-['Plus_Jakarta_Sans'] leading-none">
            The future of
            <br />
            <span className="bg-gradient-to-r from-white via-[#00D1C1] to-[#1A1F36] bg-clip-text text-transparent">
              luxury transport
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 font-normal font-['Plus_Jakarta_Sans'] max-w-2xl mx-auto leading-relaxed">
            Experience premium rides with professional drivers, 
            cutting-edge technology, and uncompromising comfort.
          </p>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] rounded-full blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
            <LuxuryButton
              onClick={() => navigate('/auth')}
              className="relative px-8 py-4 text-base font-semibold font-['Plus_Jakarta_Sans'] bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] text-white hover:shadow-2xl hover:shadow-[#00D1C1]/20 transition-all duration-500 rounded-full border-0 backdrop-blur-xl group-hover:scale-[1.02] flex items-center gap-2"
              size="lg"
            >
              <span>Start your journey</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </LuxuryButton>
          </div>
          
          <button className="px-8 py-4 text-white/70 hover:text-white font-semibold font-['Plus_Jakarta_Sans'] transition-colors duration-300 flex items-center gap-2 group">
            Watch demo
            <div className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center group-hover:border-white/40 transition-colors">
              <div className="w-0 h-0 border-l-[6px] border-l-white/70 border-y-[4px] border-y-transparent ml-0.5"></div>
            </div>
          </button>
        </div>

        {/* Social Proof */}
        <div className="space-y-4">
          <p className="text-sm text-white/40 font-['Plus_Jakarta_Sans'] tracking-wider uppercase">
            Trusted by thousands
          </p>
          <div className="flex items-center justify-center gap-8 text-white/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00D1C1] rounded-full"></div>
              <span className="text-sm font-medium font-['Plus_Jakarta_Sans']">1M+ rides completed</span>
            </div>
            <div className="w-px h-4 bg-white/10"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#1A1F36] rounded-full"></div>
              <span className="text-sm font-medium font-['Plus_Jakarta_Sans']">4.9★ average rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Grid Elements */}
      <div className="absolute top-20 left-10 w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
      <div className="absolute top-40 right-16 w-8 h-px bg-gradient-to-r from-transparent via-[#00D1C1]/20 to-transparent"></div>
      <div className="absolute bottom-32 left-20 w-px h-12 bg-gradient-to-b from-transparent via-[#1A1F36]/30 to-transparent"></div>
    </div>
  );
}