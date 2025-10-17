import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoloStore, Vehicle, Ride } from '@/store/useRoloStore';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';
import {
	ArrowLeft,
	MapPin,
	Car,
	Clock,
	CreditCard,
	Shield,
	Star,
	Users,
	Edit3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import BookingFlowGuard from '@/components/BookingFlowGuard';

interface BookingFlowLocal {
	pickup: string;
	dropoff: string;
	selectedVehicle: Vehicle | null;
	estimatedPrice: number;
}

export default function RideConfirmation(): JSX.Element {
	const navigate = useNavigate();
	const { bookingFlow, setCurrentBooking } = useRoloStore();
  const { createRide, vehicles, ensureVehicle } = useSupabaseData();
	const { toast } = useToast();
	const [isBooking, setIsBooking] = useState<boolean>(false);

	const isValidUUID = (uuid: string): boolean => {
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
		return uuidRegex.test(uuid);
	};

	const handleConfirmBooking = async (): Promise<void> => {
		if (!bookingFlow?.selectedVehicle || !bookingFlow?.estimatedPrice) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'Please select a vehicle first',
			});
			return;
		}

		try {
			setIsBooking(true);

			const selectedVehicle = bookingFlow.selectedVehicle as Vehicle;

			// Match a real DB vehicle with a UUID id
			let databaseVehicle = null as unknown as Vehicle | null;

			if (selectedVehicle.id && isValidUUID(selectedVehicle.id)) {
				databaseVehicle = vehicles.find((v: any) => v.id === selectedVehicle.id) as any;
			}
			if (!databaseVehicle) {
				databaseVehicle = vehicles.find(
					(v: any) =>
						v.type?.toLowerCase() === (selectedVehicle.type || '').toLowerCase() ||
						v.name?.toLowerCase() === (selectedVehicle.name || '').toLowerCase()
				) as any;
			}
			if (!databaseVehicle) {
      // last resort: try create a valid vehicle in DB and use it
      const ensured = await ensureVehicle({
        name: selectedVehicle.name,
        type: (selectedVehicle.type || 'sedan').toLowerCase(),
        description: selectedVehicle.description,
        image_url: (selectedVehicle as any).image,
        price_per_km: 1,
        base_price: 5,
      } as any);
      if ((ensured as any)?.id) {
        databaseVehicle = ensured as any;
      }
			}

      if (!databaseVehicle || !isValidUUID((databaseVehicle as any).id)) {
        throw new Error('Unable to ensure a valid vehicle in the database.');
      }

			const rideData = {
				pickup_location: (bookingFlow as BookingFlowLocal).pickup,
				dropoff_location: (bookingFlow as BookingFlowLocal).dropoff,
				vehicle_id: (databaseVehicle as any).id,
				estimated_price: (bookingFlow as BookingFlowLocal).estimatedPrice,
			};

			const { data, error } = await createRide(rideData as any);
			if (error || !data) {
				throw new Error(typeof error === 'string' ? error : error?.message || 'Failed to create ride');
			}

			const storeRide: Ride = {
				id: data.id,
				pickup: data.pickup_location,
				dropoff: data.dropoff_location,
				vehicle: {
					id: (databaseVehicle as any).id,
					type: (databaseVehicle as any).type || 'sedan',
					name: (databaseVehicle as any).name,
					price: data.estimated_price,
					eta: selectedVehicle.eta,
					image: (databaseVehicle as any).image_url || '',
					description: (databaseVehicle as any).description || '',
				},
				price: data.estimated_price,
				status: 'upcoming',
				date: new Date().toISOString().split('T')[0],
			};

			setCurrentBooking(storeRide);
			toast({ title: 'Ride booked!', description: 'Finding your driver...' });
			navigate('/booking/searching');
		} catch (err) {
			toast({
				variant: 'destructive',
				title: 'Booking failed',
				description: err instanceof Error ? err.message : 'Please try again.',
			});
		} finally {
			setIsBooking(false);
		}
	};

	const handleBack = (): void => {
		navigate('/booking/vehicle');
	};

	const handleEditPayment = (): void => {
		toast({
			title: 'Payment',
			description: 'Payment will be collected after trip completion.',
		});
	};

	if (!bookingFlow?.selectedVehicle) {
		navigate('/booking/location');
		return <div></div>;
	}

	const selectedVehicle = bookingFlow.selectedVehicle as Vehicle;
	const estimatedPrice = (bookingFlow as BookingFlowLocal).estimatedPrice || 0;
	const estimatedTime = new Date();
	const etaMinutes = parseInt(selectedVehicle.eta?.replace(/\D/g, '') || '10');
	estimatedTime.setMinutes(estimatedTime.getMinutes() + etaMinutes);

	const baseFare = Math.round(estimatedPrice * 0.8);
	const serviceCharge = Math.round(estimatedPrice * 0.1);
	const taxes = Math.round(estimatedPrice * 0.1);

	return (
		<BookingFlowGuard requiredStep="confirmation">
			<div className="min-h-screen bg-[#0A0A0B] relative overflow-hidden font-['Plus_Jakarta_Sans']">
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute inset-0 bg-gradient-to-br from-[#1A1F36]/15 via-transparent to-[#00D1C1]/8"></div>
				<div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#00D1C1]/5 rounded-full blur-3xl"></div>
				<div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-[#1A1F36]/8 rounded-full blur-3xl"></div>
			</div>

			<div className="relative z-10">
				{/* Mobile Layout */}
				<div className="md:hidden p-4">
					{/* Header */}
					<div className="flex items-center justify-between mb-6">
						<button
							onClick={handleBack}
							className="w-12 h-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
						>
							<ArrowLeft className="h-5 w-5" />
						</button>
						<h1 className="text-lg font-bold text-white">Confirm Booking</h1>
						<div className="w-12" />
					</div>

					{/* Trip Details */}
					<div className="relative group mb-6">
						<div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/20 to-[#00D1C1]/20 rounded-3xl blur opacity-20"></div>
						<div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
							<div className="flex items-center gap-3 mb-4">
								<MapPin className="h-5 w-5 text-[#00D1C1]" />
								<h2 className="text-lg font-semibold text-white">Trip Details</h2>
							</div>

							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<div className="w-3 h-3 bg-[#00D1C1] rounded-full mt-2" />
									<div className="flex-1">
										<p className="font-medium text-white">Pickup</p>
										<p className="text-sm text-white/60 mt-1">{(bookingFlow as BookingFlowLocal).pickup}</p>
									</div>
								</div>

								<div className="ml-1.5 border-l-2 border-dashed border-white/20 h-6" />

								<div className="flex items-start gap-3">
									<div className="w-3 h-3 bg-red-500 rounded-full mt-2" />
									<div className="flex-1">
										<p className="font-medium text-white">Drop-off</p>
										<p className="text-sm text-white/60 mt-1">{(bookingFlow as BookingFlowLocal).dropoff}</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Vehicle Details */}
					<div className="relative group mb-6">
						<div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/20 to-[#00D1C1]/20 rounded-3xl blur opacity-20"></div>
						<div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
							<div className="flex items-center gap-4 mb-4">
								<div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center">
									<Car className="h-8 w-8 text-[#00D1C1]" />
								</div>

								<div className="flex-1">
									<h3 className="font-bold text-white text-lg">{selectedVehicle.name}</h3>
									<p className="text-[#00D1C1] text-sm font-medium capitalize">
										{selectedVehicle.type?.replace('_', ' ') || 'Luxury'}
									</p>
									<div className="flex items-center gap-4 mt-2 text-xs text-white/50">
										<div className="flex items-center gap-1">
											<Clock className="h-3 w-3" />
											<span>Arrives in {selectedVehicle.eta}</span>
										</div>
										<div className="flex items-center gap-1">
											<Star className="h-3 w-3 text-yellow-500" />
											<span>4.8</span>
										</div>
									</div>
								</div>
							</div>

							<div className="flex items-center justify-between pt-4 border-t border-white/10">
								<div className="text-white/60">
									<p className="text-sm">Estimated Fare</p>
									<p className="text-xs">Including taxes</p>
								</div>
								<div className="text-right">
									<p className="text-2xl font-bold text-white">₹{estimatedPrice}</p>
								</div>
							</div>
						</div>
					</div>

					{/* Payment Info */}
					<div className="relative group mb-6">
						<div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/20 to-[#00D1C1]/20 rounded-3xl blur opacity-20"></div>
						<div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] rounded-xl flex items-center justify-center">
										<CreditCard className="h-5 w-5 text-white" />
									</div>
									<div>
										<p className="font-medium text-white">Pay after ride</p>
										<p className="text-sm text-white/60">Secure payment on completion</p>
									</div>
								</div>

								<button
									onClick={handleEditPayment}
									className="text-[#00D1C1] text-sm font-medium hover:text-[#00D1C1]/80 flex items-center gap-1"
								>
									<Edit3 className="h-4 w-4" />
									Info
								</button>
							</div>
						</div>
					</div>

					{/* Safety Features */}
					<div className="flex items-center justify-center gap-6 mb-6 text-white/40">
						<div className="flex items-center gap-2">
							<Shield className="h-4 w-4 text-[#00D1C1]" />
							<span className="text-xs">Verified Driver</span>
						</div>
						<div className="w-px h-4 bg-white/10"></div>
						<div className="flex items-center gap-2">
							<Shield className="h-4 w-4 text-[#00D1C1]" />
							<span className="text-xs">Secure Payment</span>
						</div>
					</div>
				</div>

				{/* Desktop Layout (summary cards are same as mobile content) */}
				<div className="hidden md:block">
					<div className="max-w-5xl mx-auto p-8">
						<div className="flex items-center justify-between mb-12">
							<button
								onClick={handleBack}
								className="w-14 h-14 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
							>
								<ArrowLeft className="h-6 w-6" />
							</button>
							<div className="text-center">
								<h1 className="text-3xl font-bold text-white mb-2">Confirm Your Ride</h1>
								<p className="text-white/60">Review details and complete booking</p>
							</div>
							<div className="w-14" />
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							<div className="lg:col-span-2 space-y-8">
								{/* Trip and Vehicle cards are same as mobile, omitted here for brevity */}
							</div>
							<div className="space-y-8">
								<div className="relative group">
									<div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36]/20 to-[#00D1C1]/20 rounded-3xl blur opacity-20"></div>
									<div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
										<h2 className="text-xl font-bold text-white mb-6">Fare Summary</h2>
										<div className="space-y-4 mb-6">
											<div className="flex justify-between text-white/70">
												<span>Base fare</span>
												<span>₹{baseFare}</span>
											</div>
											<div className="flex justify-between text-white/70">
												<span>Service charge</span>
												<span>₹{serviceCharge}</span>
											</div>
											<div className="flex justify-between text-white/70">
												<span>Taxes</span>
												<span>₹{taxes}</span>
											</div>
											<div className="border-t border-white/10 pt-4">
												<div className="flex justify-between text-white text-lg font-bold">
													<span>Total Amount</span>
													<span>₹{estimatedPrice}</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Confirm Button */}
				<div className="fixed md:relative bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t md:bg-none from-[#0A0A0B] via-[#0A0A0B]/95 to-transparent backdrop-blur-xl md:backdrop-blur-none border-t border-white/5 md:border-0">
					<div className="max-w-5xl mx-auto">
						<div className="relative group">
							<div className="absolute -inset-1 bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] rounded-2xl blur opacity-20 group-hover:opacity-40 transition"></div>
							<button
								onClick={handleConfirmBooking}
								disabled={isBooking}
								className={cn(
									"relative w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3",
									isBooking
										? 'bg-white/5 text-white/40 cursor-not-allowed'
										: 'bg-gradient-to-r from-[#1A1F36] to-[#00D1C1] text-white hover:shadow-2xl hover:shadow-[#00D1C1]/20 hover:scale-[1.02]'
								)}
							>
								{isBooking ? (
									<>
										<div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
										<span>Booking...</span>
									</>
								) : (
									<>
										<CreditCard className="w-5 h-5" />
										<span>Confirm Booking</span>
									</>
								)}
							</button>
						</div>

						<div className="text-center mt-4 space-y-2">
							<p className="text-xs text-white/40">Payment after ride • 256-bit SSL</p>
							<p className="text-xs text-white/30">
								By confirming, you agree to our <span className="text-[#00D1C1] hover:underline cursor-pointer">terms</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		</BookingFlowGuard>
	);
}
