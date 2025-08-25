-- Create enum for ride status
CREATE TYPE public.ride_status AS ENUM ('pending', 'confirmed', 'driver_assigned', 'in_progress', 'completed', 'cancelled');

-- Create enum for vehicle types
CREATE TYPE public.vehicle_type AS ENUM ('sedan', 'suv', 'limousine', 'luxury_sedan');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create vehicles table
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type vehicle_type NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_per_km DECIMAL(8,2) NOT NULL,
  base_price DECIMAL(8,2) NOT NULL DEFAULT 5.00,
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on vehicles (public read access)
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available vehicles" 
ON public.vehicles 
FOR SELECT 
USING (is_available = true);

-- Create drivers table
CREATE TABLE public.drivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  car_model TEXT NOT NULL,
  plate_number TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 5.0,
  photo_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on drivers
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available drivers" 
ON public.drivers 
FOR SELECT 
USING (is_available = true);

-- Create rides table
CREATE TABLE public.rides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id),
  driver_id UUID REFERENCES public.drivers(id),
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  pickup_latitude DECIMAL(10,8),
  pickup_longitude DECIMAL(11,8),
  dropoff_latitude DECIMAL(10,8),
  dropoff_longitude DECIMAL(11,8),
  estimated_price DECIMAL(8,2) NOT NULL,
  final_price DECIMAL(8,2),
  status ride_status NOT NULL DEFAULT 'pending',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on rides
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;

-- Create policies for rides
CREATE POLICY "Users can view their own rides" 
ON public.rides 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rides" 
ON public.rides 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rides" 
ON public.rides 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Insert sample vehicles
INSERT INTO public.vehicles (type, name, description, price_per_km, base_price, image_url) VALUES
('sedan', 'Luxury Sedan', 'Premium comfort for up to 4 passengers', 2.50, 5.00, '/placeholder.svg'),
('suv', 'Executive SUV', 'Spacious luxury for up to 6 passengers', 3.50, 8.00, '/placeholder.svg'),
('limousine', 'Stretch Limousine', 'Ultimate luxury experience for special occasions', 7.50, 15.00, '/placeholder.svg'),
('luxury_sedan', 'Premium Mercedes', 'High-end Mercedes-Benz experience', 4.00, 10.00, '/placeholder.svg');

-- Insert sample drivers
INSERT INTO public.drivers (name, phone, car_model, plate_number, rating, photo_url) VALUES
('James Wilson', '+1-555-0101', 'Mercedes-Benz S-Class', 'LUX-001', 4.9, '/placeholder.svg'),
('Sarah Johnson', '+1-555-0102', 'BMW 7 Series', 'LUX-002', 4.8, '/placeholder.svg'),
('Michael Chen', '+1-555-0103', 'Audi A8', 'LUX-003', 4.9, '/placeholder.svg'),
('Emma Rodriguez', '+1-555-0104', 'Lexus LS', 'LUX-004', 5.0, '/placeholder.svg'),
('David Thompson', '+1-555-0105', 'Cadillac Escalade', 'LUX-005', 4.7, '/placeholder.svg');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rides_updated_at
  BEFORE UPDATE ON public.rides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();