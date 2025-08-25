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
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('is_available', true);
    
    if (!error && data) {
      setVehicles(data);
    }
  };

  // Fetch drivers
  const fetchDrivers = async () => {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('is_available', true);
    
    if (!error && data) {
      setDrivers(data);
    }
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