import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Vehicle {
  id: string;
  type: string;
  name: string;
  description: string | null;
  price_per_km: number;
  base_price: number;
  image_url: string | null;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  car_model: string;
  plate_number: string;
  rating: number;
  photo_url: string | null;
}

export interface Ride {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  estimated_price: number;
  final_price: number | null;
  status: string;
  rating: number | null;
  created_at: string;
  vehicle: Vehicle;
  driver: Driver | null;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
}

export function useSupabaseData() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch vehicles
  const fetchVehicles = async () => {
    // Temporary mock data with updated vehicles and reduced prices for testing
    const mockVehicles = [
      {
        id: '1',
        type: 'sedan',
        name: 'Audi A4',
        description: 'Premium comfort and performance for up to 4 passengers',
        price_per_km: 0.0025,
        base_price: 0.005,
        image_url: '/assets/audi-a4.png',
        is_available: true,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        type: 'suv',
        name: 'BMW 3 Series',
        description: 'Luxury sedan with advanced technology and comfort',
        price_per_km: 0.0035,
        base_price: 0.008,
        image_url: '/assets/bmw-3-series.png',
        is_available: true,
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        type: 'luxury_sedan',
        name: 'Mercedes C-Class',
        description: 'Executive luxury with premium amenities',
        price_per_km: 0.004,
        base_price: 0.01,
        image_url: '/assets/mercedes-c-class.png',
        is_available: true,
        created_at: new Date().toISOString()
      }
    ];
    
    // Try Supabase first; fallback to mock on error/empty
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('is_available', true);

    if (!error && Array.isArray(data) && data.length > 0) {
      setVehicles(data as unknown as Vehicle[]);
      return;
    }

    // Fallback to mock if no data available
    setVehicles(mockVehicles as unknown as Vehicle[]);
  };

  // Fetch drivers
  const fetchDrivers = async () => {
    // Temporary mock data with updated drivers matching the new vehicles
    const mockDrivers = [
      {
        id: '1',
        name: 'James Wilson',
        phone: '+1-555-0101',
        car_model: 'Mercedes C-Class',
        plate_number: 'LUX-001',
        rating: 4.9,
        photo_url: '/placeholder.svg',
        is_available: true,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        phone: '+1-555-0102',
        car_model: 'BMW 3 Series',
        plate_number: 'LUX-002',
        rating: 4.8,
        photo_url: '/placeholder.svg',
        is_available: true,
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Michael Chen',
        phone: '+1-555-0103',
        car_model: 'Audi A4',
        plate_number: 'LUX-003',
        rating: 4.9,
        photo_url: '/placeholder.svg',
        is_available: true,
        created_at: new Date().toISOString()
      }
    ];
    
    setDrivers(mockDrivers);
    
    // Uncomment below to use real Supabase data instead of mock data
    /*
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('is_available', true);
    
    if (!error && data) {
      setDrivers(data);
    }
    */
  };

  // Fetch user rides
  const fetchRides = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('rides')
      .select(`
        *,
        vehicle:vehicles(*),
        driver:drivers(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setRides(data as Ride[]);
    }
  };

  // Fetch user profile
  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (!error && data) {
      setProfile(data);
    }
  };

  // Create ride
  const createRide = async (rideData: {
    pickup_location: string;
    dropoff_location: string;
    vehicle_id: string;
    estimated_price: number;
  }) => {
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('rides')
      .insert([{
        user_id: user.id,
        ...rideData
      }])
      .select()
      .single();

    if (!error) {
      await fetchRides(); // Refresh rides
    }

    return { data, error };
  };

  // Ensure a valid vehicle exists in DB, create one if needed, and return it
  const ensureVehicle = async (vehicleLike: Partial<Vehicle>) => {
    // First try to find an existing available vehicle matching name/type
    const normalizedType = (vehicleLike.type || '').toLowerCase();
    const allowedTypes = new Set(['sedan', 'suv', 'limousine', 'luxury_sedan']);
    const finalType = allowedTypes.has(normalizedType) ? (normalizedType as any) : 'sedan';

    // try fetch fresh list from DB
    const { data: dbVehicles } = await supabase
      .from('vehicles')
      .select('*')
      .eq('is_available', true);

    const existing = (dbVehicles || []).find((v: any) =>
      (vehicleLike.name && v.name?.toLowerCase() === (vehicleLike.name || '').toLowerCase()) ||
      (vehicleLike.type && v.type?.toLowerCase() === finalType)
    );

    if (existing) {
      return existing as unknown as Vehicle;
    }

    // Create a basic vehicle row
    const insertPayload = {
      name: vehicleLike.name || 'Sedan',
      type: finalType,
      price_per_km: typeof (vehicleLike as any).price_per_km === 'number' ? (vehicleLike as any).price_per_km : 1,
      base_price: typeof (vehicleLike as any).base_price === 'number' ? (vehicleLike as any).base_price : 5,
      description: vehicleLike.description || null,
      image_url: (vehicleLike as any).image_url || null,
      is_available: true,
    };

    const { data: created, error } = await supabase
      .from('vehicles')
      .insert([insertPayload])
      .select('*')
      .single();

    if (error || !created) {
      return { error } as any;
    }

    // refresh local cache
    await fetchVehicles();

    return created as unknown as Vehicle;
  };

  // Update ride
  const updateRide = async (rideId: string, updates: Partial<{
    status: 'pending' | 'confirmed' | 'driver_assigned' | 'in_progress' | 'completed' | 'cancelled';
    driver_id: string;
    final_price: number;
    rating: number;
    started_at: string;
    completed_at: string;
  }>) => {
    const { data, error } = await supabase
      .from('rides')
      .update(updates)
      .eq('id', rideId)
      .select()
      .single();

    if (!error) {
      await fetchRides(); // Refresh rides
    }

    return { data, error };
  };

  // Update profile
  const updateProfile = async (updates: Partial<{
    full_name: string;
    phone: string;
  }>) => {
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (!error) {
      setProfile(data);
    }

    return { data, error };
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchVehicles(),
        fetchDrivers(),
        fetchRides(),
        fetchProfile(),
      ]);
      setLoading(false);
    };

    if (user) {
      loadData();
    } else {
      // Still fetch public data (vehicles, drivers) even when not logged in
      Promise.all([fetchVehicles(), fetchDrivers()]).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  return {
    vehicles,
    drivers,
    rides,
    profile,
    loading,
    createRide,
    ensureVehicle,
    updateRide,
    updateProfile,
    refetch: {
      vehicles: fetchVehicles,
      drivers: fetchDrivers,
      rides: fetchRides,
      profile: fetchProfile,
    }
  };
}