import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Vehicle {
  id: string;
  type: string;
  name: string;
  price: number;
  eta: string;
  image: string;
  description: string;
}

export interface Driver {
  id: string;
  name: string;
  rating: number;
  car: string;
  plateNumber: string;
  photo: string;
}

export interface Ride {
  id: string;
  pickup: string;
  dropoff: string;
  vehicle: Vehicle;
  driver?: Driver;
  price: number;
  status: 'upcoming' | 'in-progress' | 'completed';
  date: string;
  rating?: number;
}

export interface BookingFlow {
  pickup: string;
  dropoff: string;
  selectedVehicle?: Vehicle;
  estimatedPrice?: number;
}

interface RoloState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Booking flow state
  bookingFlow: BookingFlow;
  currentBooking?: Ride;
  
  // App data
  vehicles: Vehicle[];
  rides: Ride[];
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  updateBookingFlow: (updates: Partial<BookingFlow>) => void;
  resetBookingFlow: () => void;
  createRide: (ride: Omit<Ride, 'id'>) => void;
  updateRide: (id: string, updates: Partial<Ride>) => void;
  setCurrentBooking: (booking?: Ride) => void;
}

// Mock data
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    type: 'Sedan',
    name: 'Luxury Sedan',
    price: 25,
    eta: '3 min',
    image: '/placeholder.svg',
    description: 'Premium comfort for up to 4 passengers'
  },
  {
    id: '2',
    type: 'SUV',
    name: 'Executive SUV',
    price: 35,
    eta: '5 min',
    image: '/placeholder.svg',
    description: 'Spacious luxury for up to 6 passengers'
  },
  {
    id: '3',
    type: 'Limousine',
    name: 'Stretch Limousine',
    price: 75,
    eta: '8 min',
    image: '/placeholder.svg',
    description: 'Ultimate luxury experience'
  }
];

const mockRides: Ride[] = [
  {
    id: '1',
    pickup: 'Downtown Office',
    dropoff: 'International Airport',
    vehicle: mockVehicles[0],
    price: 45,
    status: 'completed',
    date: '2024-01-20',
    rating: 5
  },
  {
    id: '2',
    pickup: 'Hotel Luxe',
    dropoff: 'Business District',
    vehicle: mockVehicles[1],
    price: 28,
    status: 'completed',
    date: '2024-01-18',
    rating: 4
  }
];

export const useRoloStore = create<RoloState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  bookingFlow: {
    pickup: '',
    dropoff: ''
  },
  currentBooking: undefined,
  vehicles: mockVehicles,
  rides: mockRides,
  
  // Actions
  login: (user) => set({ user, isAuthenticated: true }),
  
  logout: () => set({ 
    user: null, 
    isAuthenticated: false,
    bookingFlow: { pickup: '', dropoff: '' },
    currentBooking: undefined
  }),
  
  updateBookingFlow: (updates) => set((state) => ({
    bookingFlow: { ...state.bookingFlow, ...updates }
  })),
  
  resetBookingFlow: () => set({
    bookingFlow: { pickup: '', dropoff: '' }
  }),
  
  createRide: (rideData) => set((state) => ({
    rides: [
      {
        ...rideData,
        id: Math.random().toString(36).substr(2, 9)
      },
      ...state.rides
    ]
  })),
  
  updateRide: (id, updates) => set((state) => ({
    rides: state.rides.map(ride =>
      ride.id === id ? { ...ride, ...updates } : ride
    ),
    currentBooking: state.currentBooking?.id === id 
      ? { ...state.currentBooking, ...updates }
      : state.currentBooking
  })),
  
  setCurrentBooking: (booking) => set({ currentBooking: booking })
}));