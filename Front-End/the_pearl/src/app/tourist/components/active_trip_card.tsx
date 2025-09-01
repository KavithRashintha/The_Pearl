"use client";

import { Trip } from '@/app/tourist/components/trip_step1';

type TripCardProps = {
    trip: Trip;
    isExpanded: boolean;
    onToggleExpand: (id: number) => void;
};

const getEndDate = (startDate: string, days: number): string => {
    if (!startDate || !days) return 'N/A';
    const date = new Date(startDate);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
};

const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
        case 'accepted':
            return 'bg-green-100 text-green-800';
        case 'started':
            return 'bg-blue-100 text-blue-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default function ActiveTripCard({ trip, isExpanded, onToggleExpand }: TripCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-medium text-gray-800 col-span-2">
                    Trip to {trip.destinations[0]} & more
                </p>
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusClasses(trip.tripStatus)}`}>
                        {trip.tripStatus}
                    </span>
                </div>
                <div className="flex items-center justify-end">
                    <button onClick={() => onToggleExpand(trip.id)} className="text-violet-600 font-medium hover:underline">
                        {isExpanded ? 'View Less' : 'View More'}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-gray-700 mb-4">
                        <div><strong>Started Date:</strong> {trip.startDate}</div>
                        <div><strong>End Date:</strong> {getEndDate(trip.startDate, trip.numberOfDays)}</div>
                        <div><strong>Adults:</strong> {trip.numberOfAdults}</div>
                        <div><strong>Children:</strong> {trip.numberOfChildren}</div>
                        <div className="col-span-2"><strong>Payment Status:</strong> {trip.paymentStatus}</div>
                        {trip.tourGuideName && <div className="col-span-2"><strong>Tour Guide:</strong> {trip.tourGuideName}</div>}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-violet-600 border-b-2 border-violet-200 pb-1 mb-3">
                            Destinations
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600">
                            {trip.destinations.map((dest, index) => (
                                <div key={index} className="flex items-center">
                                    <span>{dest}</span>
                                    {index < trip.destinations.length - 1 && <span className="ml-4 text-violet-400">→</span>}
                                </div>
                            ))}
                        </div>

                        <div className = "mt-4 text-sm text-gray-600">
                            {trip.tripStatus.toLowerCase() === 'pending'
                                ? <p>Your trip request is pending approval from a tour guide.</p>
                                : <p>Your trip is active now, please stay connected with your tour guide.</p>
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}