import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LuxuryButton } from '@/components/ui/luxury-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function ContactUs() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We'll get back to you soon!",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            <h1 className="text-xl font-bold">Contact Us</h1>
          </div>
        </div>
      </div>

      <div className="p-4 pb-20 space-y-6">
        {/* Contact Information */}
        <Card className="card-luxury animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MessageCircle className="h-5 w-5 text-[#00D1C1]" />
              Get in Touch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <Mail className="h-5 w-5 text-[#00D1C1]" />
              <div>
                <p className="text-white font-medium">Email</p>
                <p className="text-white/70 text-sm">support@rolo.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <Phone className="h-5 w-5 text-[#00D1C1]" />
              <div>
                <p className="text-white font-medium">Phone</p>
                <p className="text-white/70 text-sm">+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <MapPin className="h-5 w-5 text-[#00D1C1]" />
              <div>
                <p className="text-white font-medium">Address</p>
                <p className="text-white/70 text-sm">123 Luxury Street, Premium City</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="card-luxury animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Send className="h-5 w-5 text-[#00D1C1]" />
              Send us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/70 text-sm mb-2 block">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your name"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>
                <div>
                  <label className="text-white/70 text-sm mb-2 block">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-white/70 text-sm mb-2 block">Subject</label>
                <Input
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="What's this about?"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  required
                />
              </div>
              
              <div>
                <label className="text-white/70 text-sm mb-2 block">Message</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Tell us how we can help..."
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 min-h-[120px]"
                  required
                />
              </div>
              
              <LuxuryButton type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </LuxuryButton>
            </form>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="card-luxury animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-white/5">
              <h4 className="text-white font-medium mb-2">How do I book a ride?</h4>
              <p className="text-white/70 text-sm">Simply go to the dashboard and click "Book a Ride" to start your luxury transportation experience.</p>
            </div>
            
            <div className="p-4 rounded-lg bg-white/5">
              <h4 className="text-white font-medium mb-2">What payment methods do you accept?</h4>
              <p className="text-white/70 text-sm">We accept all major credit cards, digital wallets, and corporate accounts.</p>
            </div>
            
            <div className="p-4 rounded-lg bg-white/5">
              <h4 className="text-white font-medium mb-2">Can I cancel my booking?</h4>
              <p className="text-white/70 text-sm">Yes, you can cancel your booking up to 15 minutes before the scheduled pickup time.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
