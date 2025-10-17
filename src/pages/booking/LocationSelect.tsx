import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { BottomNav } from '@/components/layout/BottomNav';
import { useRoloStore } from '@/store/useRoloStore';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  Clock, 
  Star, 
  Zap, 
  MapIcon,
  Search,
  X,
  Loader,
  Building,
  Home,
  Plane,
  ShoppingBag,
  Car
} from 'lucide-react';

// Krutrim Maps API Configuration
const KRUTRIM_API_KEY = import.meta.env?.VITE_KRUTRIM_API_KEY || 'G0eGxIsSerBkUv2JkB94c3A1***************';
const AUTOCOMPLETE_API_URL = 'https://api.olamaps.io/places/v1/autocomplete';

// Debounce hook for API calls
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// AutoComplete Input Component
const AutoCompleteInput = ({ 
  value, 
  onChange, 
  onSelect, 
  placeholder, 
  label, 
  showCurrentLocation = false,
  onCurrentLocation = () => {}
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  const debouncedValue = useDebounce(value, 300);

  // Fetch autocomplete suggestions
  const fetchSuggestions = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `${AUTOCOMPLETE_API_URL}?input=${encodeURIComponent(query)}&api_key=${KRUTRIM_API_KEY}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.predictions || []);
      } else {
        console.error('Autocomplete API error:', response.statusText);
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Autocomplete fetch error:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to fetch suggestions when debounced value changes
  useEffect(() => {
    if (debouncedValue && showSuggestions) {
      fetchSuggestions(debouncedValue);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  }, [debouncedValue, showSuggestions, fetchSuggestions]);

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
    setFocusedIndex(-1);
  };

  // Handle input focus
  const handleInputFocus = () => {
    setShowSuggestions(true);
    if (value && suggestions.length === 0) {
      fetchSuggestions(value);
    }
  };

  // Handle input blur
  const handleInputBlur = (e) => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setFocusedIndex(-1);
    }, 150);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    const main = suggestion.structured_formatting?.main_text || '';
    const secondary = suggestion.structured_formatting?.secondary_text || '';
    const compact = secondary ? `${main}, ${secondary}` : main || suggestion.description;
    onChange(compact);
    onSelect && onSelect(suggestion);
    setShowSuggestions(false);
    setFocusedIndex(-1);
    inputRef.current?.blur();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && suggestions[focusedIndex]) {
          handleSuggestionSelect(suggestions[focusedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setFocusedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Get icon for place type
  const getPlaceIcon = (types) => {
    if (!types) return <MapPin className="w-4 h-4 text-white/60" />;
    
    const typeStr = types.join(',').toLowerCase();
    
    if (typeStr.includes('airport')) return <Plane className="w-4 h-4 text-blue-400" />;
    if (typeStr.includes('shopping') || typeStr.includes('mall')) return <ShoppingBag className="w-4 h-4 text-purple-400" />;
    if (typeStr.includes('restaurant') || typeStr.includes('food')) return <span className="text-orange-400">🍽️</span>;
    if (typeStr.includes('hospital') || typeStr.includes('medical')) return <span className="text-red-400">🏥</span>;
    if (typeStr.includes('school') || typeStr.includes('university')) return <span className="text-green-400">🎓</span>;
    if (typeStr.includes('bank') || typeStr.includes('atm')) return <span className="text-yellow-400">🏦</span>;
    if (typeStr.includes('gas_station')) return <Car className="w-4 h-4 text-red-400" />;
    
    return <Building className="w-4 h-4 text-white/60" />;
  };

  return (
    <div className="relative">
      <label className="text-white/70 text-sm font-medium mb-2 block">{label}</label>
      <div className="relative">
        <input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full h-12 lg:h-14 pl-4 pr-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-[#00D1C1]/50 focus:ring-2 focus:ring-[#00D1C1]/20 focus:outline-none transition-all duration-300"
          autoComplete="off"
        />
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <Loader className="h-4 w-4 text-white/60 animate-spin" />
          </div>
        )}
        
        {/* Current location button */}
        {showCurrentLocation && (
          <button
            type="button"
            onClick={onCurrentLocation}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-white/60 hover:text-[#00D1C1] transition-colors"
          >
            <Navigation className="h-4 w-4" />
          </button>
        )}
        
        {/* Clear button */}
        {value && !showCurrentLocation && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setShowSuggestions(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-white/60 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-[9999] max-h-64 overflow-y-auto"
        >
          {isLoading && suggestions.length === 0 ? (
            <div className="p-4 text-center text-white/60">
              <Loader className="h-5 w-5 animate-spin mx-auto mb-2" />
              <span className="text-sm">Searching locations...</span>
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <button
                key={suggestion.place_id || index}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSuggestionSelect(suggestion);
                }}
                className={`w-full flex items-center gap-3 p-4 text-left hover:bg-white/10 transition-colors ${
                  index === focusedIndex ? 'bg-white/10' : ''
                } ${index === 0 ? 'rounded-t-xl' : ''} ${index === suggestions.length - 1 ? 'rounded-b-xl' : ''}`}
              >
                <div className="flex-shrink-0">
                  {getPlaceIcon(suggestion.types)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {suggestion.structured_formatting?.main_text || suggestion.description}
                  </p>
                  <p className="text-white/60 text-sm truncate">
                    {suggestion.structured_formatting?.secondary_text || 
                     suggestion.description.replace(suggestion.structured_formatting?.main_text || '', '').replace(/^,\s*/, '')}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default function LocationSelect() {
  const navigate = useNavigate();
  const { bookingFlow, updateBookingFlow } = useRoloStore();
  
  const [pickup, setPickup] = useState(bookingFlow.pickup || '');
  const [dropoff, setDropoff] = useState(bookingFlow.dropoff || '');
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedDropoff, setSelectedDropoff] = useState(null);

  const handleNext = () => {
    if (!pickup || !dropoff) return;
    
    updateBookingFlow({ 
      pickup, 
      dropoff
    });
    navigate('/booking/vehicle');
  };

  const handleCurrentLocation = () => {
    setPickup('Getting current location...');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // You can use reverse geocoding API here to get address
          setPickup(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          setSelectedPickup({
            place_id: 'current_location',
            geometry: {
              location: { lat: latitude, lng: longitude }
            },
            description: 'Current Location'
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          setPickup('');
          alert('Unable to get your current location. Please enter manually.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    } else {
      setPickup('');
      alert('Geolocation is not supported by this browser.');
    }
  };

  const recentLocations = [
    { name: 'Home', address: '123 Main Street, Downtown', icon: '🏠' },
    { name: 'Office', address: '456 Business Ave, Central', icon: '🏢' },
    { name: 'Airport', address: 'International Airport Terminal 1', icon: '✈️' },
    { name: 'Mall', address: 'Grand Shopping Center', icon: '🛍️' }
  ];

  const popularDestinations = [
    'Downtown District',
    'Business Center',
    'Shopping Mall',
    'Airport Terminal',
    'Train Station',
    'University Campus'
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] font-['Plus_Jakarta_Sans'] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F36]/10 via-transparent to-[#00D1C1]/5"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-radial from-[#00D1C1]/8 via-[#1A1F36]/4 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/2 left-1/4 w-80 h-80 bg-gradient-radial from-[#1A1F36]/6 via-[#00D1C1]/3 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden relative z-10">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-6 pt-12">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-white">Book a Ride</h1>
          <div className="w-10" />
        </div>

        {/* Mobile Content */}
        <div className="px-6 pb-24">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/30 to-[#00D1C1]/30 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-[#1A1F36]/30 to-[#00D1C1]/20 rounded-xl flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-[#00D1C1]" />
                </div>
                <h2 className="text-xl font-semibold text-white">Where are you going?</h2>
              </div>
              
              <div className="space-y-6">
                <AutoCompleteInput
                  value={pickup}
                  onChange={setPickup}
                  onSelect={setSelectedPickup}
                  placeholder="Enter pickup location"
                  label="Pickup Location"
                  showCurrentLocation={true}
                  onCurrentLocation={handleCurrentLocation}
                />
                
                <AutoCompleteInput
                  value={dropoff}
                  onChange={setDropoff}
                  onSelect={setSelectedDropoff}
                  placeholder="Where to?"
                  label="Drop-off Location"
                />
                
                <div className="relative group/btn pt-4">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] rounded-xl blur opacity-40 group-hover/btn:opacity-60 transition duration-300"></div>
                  <button
                    onClick={handleNext}
                    disabled={!pickup || !dropoff}
                    className="relative w-full h-12 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-[#00D1C1]/20 transition-all duration-500 group-hover/btn:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Mobile */}
          <div className="mt-6 space-y-4">
            {/* Recent Locations */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/70" />
                Recent
              </h3>
              <div className="space-y-2">
                {recentLocations.slice(0, 2).map((location, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!pickup) setPickup(location.address);
                      else setDropoff(location.address);
                    }}
                    className="w-full flex items-center gap-2 p-2 text-left text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  >
                    <span className="text-sm">{location.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{location.name}</p>
                      <p className="text-xs text-white/50 truncate">{location.address}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block lg:ml-64 min-h-screen relative z-10">
        {/* Desktop Header */}
        <header className="px-8 py-6 border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Book Your Ride</h1>
              <p className="text-white/60">Choose your pickup and destination</p>
            </div>
          </div>
        </header>

        {/* Desktop Content */}
        <main className="p-8">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl">
            {/* Main Booking Form */}
            <div className="lg:col-span-2">
              <div className="relative group mb-8">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/30 to-[#00D1C1]/30 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#1A1F36]/30 to-[#00D1C1]/20 rounded-xl flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-[#00D1C1]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Plan Your Journey</h2>
                      <p className="text-white/60">Enter your pickup and destination locations</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-[#00D1C1] rounded-full"></div>
                        <span className="text-white font-medium text-lg">Pickup Location</span>
                      </div>
                      <AutoCompleteInput
                        value={pickup}
                        onChange={setPickup}
                        onSelect={setSelectedPickup}
                        placeholder="Enter pickup location"
                        label=""
                        showCurrentLocation={true}
                        onCurrentLocation={handleCurrentLocation}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-white/40 rounded-full"></div>
                        <span className="text-white font-medium text-lg">Drop-off Location</span>
                      </div>
                      <AutoCompleteInput
                        value={dropoff}
                        onChange={setDropoff}
                        onSelect={setSelectedDropoff}
                        placeholder="Where to?"
                        label=""
                      />
                    </div>
                  </div>
                  
                  <div className="relative group/btn mt-8">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] rounded-xl blur opacity-40 group-hover/btn:opacity-60 transition duration-300"></div>
                    <button
                      onClick={handleNext}
                      disabled={!pickup || !dropoff}
                      className="relative w-full h-14 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] text-white font-semibold text-lg rounded-xl hover:shadow-2xl hover:shadow-[#00D1C1]/20 transition-all duration-500 group-hover/btn:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Vehicle Selection
                    </button>
                  </div>
                </div>
              </div>

              {/* Popular Destinations */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#00D1C1]" />
                  Popular Destinations
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {popularDestinations.map((destination, index) => (
                    <button
                      key={index}
                      onClick={() => setDropoff(destination)}
                      className="p-3 text-left text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/5 hover:border-white/20"
                    >
                      <p className="text-sm font-medium">{destination}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Locations */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-white/70" />
                  Recent Locations
                </h3>
                <div className="space-y-3">
                  {recentLocations.map((location, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (!pickup) setPickup(location.address);
                        else setDropoff(location.address);
                      }}
                      className="w-full flex items-center gap-3 p-3 text-left text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-lg">
                        {location.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white group-hover:text-[#00D1C1] transition-colors">
                          {location.name}
                        </p>
                        <p className="text-xs text-white/50">{location.address}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Booking Tips */}
              <div className="bg-gradient-to-br from-[#1A1F36]/30 to-[#00D1C1]/20 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#00D1C1]" />
                  Pro Tips
                </h3>
                <div className="space-y-3 text-sm text-white/70">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[#00D1C1] rounded-full mt-2"></div>
                    <p>Start typing to see smart location suggestions</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[#00D1C1] rounded-full mt-2"></div>
                    <p>Use the location button for precise pickup coordinates</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[#00D1C1] rounded-full mt-2"></div>
                    <p>Select from recent locations for quick booking</p>
                  </div>
                </div>
              </div>

              {/* Route Preview */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#1A1F36]/30 to-[#00D1C1]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapIcon className="w-8 h-8 text-white/60" />
                </div>
                <h3 className="text-white font-medium mb-2">Route Preview</h3>
                <p className="text-white/50 text-sm">
                  {pickup && dropoff ? 
                    `Route from ${pickup.length > 20 ? pickup.substring(0, 20) + '...' : pickup} to ${dropoff.length > 20 ? dropoff.substring(0, 20) + '...' : dropoff}` :
                    'Enter both locations to see your route and estimated time'
                  }
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}