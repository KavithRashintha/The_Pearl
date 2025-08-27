"use client";

import { Trip } from '@/app/admin/trips/page';

type TripRowProps = {
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

export default function TripRow({ trip, isExpanded, onToggleExpand }: TripRowProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <p className="font-medium text-gray-800">{trip.touristName} - {trip.touristCountry}</p>
                <p className="text-gray-600">Start - {trip.startDate}</p>
                <p className="text-gray-600">{trip.destinations.length} Destinations</p>
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
                        <div><strong>Tour Guide:</strong> {trip.tourGuideName}</div>
                        <div><strong>Trip Status:</strong> {trip.tripStatus}</div>
                        <div><strong>Adults:</strong> {trip.numberOfAdults}</div>
                        <div><strong>Children:</strong> {trip.numberOfChildren}</div>
                        <div><strong>Payment Status:</strong> {trip.paymentStatus}</div>
                        <div><strong>Payment:</strong> ${trip.tripPayment.toFixed(2)}</div>
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
                    </div>
                </div>
            )}
        </div>
    );
}