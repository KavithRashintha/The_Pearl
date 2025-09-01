"use client";

import { useState, useEffect, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import TripRow from '@/app/admin/(components)/trip_card';

export type Trip = {
    id: number;
    touristId: number;
    touristPassportNumber: string;
    touristCountry: string;
    tourGuideId: number;
    destinations: string[];
    numberOfAdults: number;
    numberOfChildren: number;
    startDate: string;
    numberOfDays: number;
    tripStatus: string;
    tripPayment: number;
    paymentStatus: string;
    touristName?: string;
    tourGuideName?: string;
};

export default function TripsPage() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedTripId, setExpandedTripId] = useState<number | null>(null);

    const itemsPerPage = 8;

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const tripResponse = await fetch('http://localhost:8003/api/trips/');
                if (!tripResponse.ok) throw new Error('Failed to fetch trips.');
                const tripData: Trip[] = await tripResponse.json();

                const touristIds = [...new Set(tripData.map(t => t.touristId))];
                const tourGuideIds = [...new Set(tripData.map(t => t.tourGuideId))];

                const touristPromises = touristIds.map(id => fetch(`http://localhost:8003/api/tourists/${id}/profile`).then(res => res.json()));
                const tourGuidePromises = tourGuideIds.map(id => fetch(`http://localhost:8003/api/tour-guide/${id}/profile`).then(res => res.json()));

                const tourists = await Promise.all(touristPromises);
                const tourGuides = await Promise.all(tourGuidePromises);

                const touristMap = new Map(tourists.map(t => [t.id, t.name]));
                const tourGuideMap = new Map(tourGuides.map(g => [g.id, g.name]));

                const enrichedTrips = tripData.map(trip => ({
                    ...trip,
                    touristName: touristMap.get(trip.touristId) || 'Unknown Tourist',
                    tourGuideName: tourGuideMap.get(trip.tourGuideId) || 'Unknown Guide',
                }));

                setTrips(enrichedTrips);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const handleToggleExpand = (tripId: number) => {
        setExpandedTripId(prevId => (prevId === tripId ? null : tripId));
    };

    const paginatedTrips = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return trips.slice(startIndex, startIndex + itemsPerPage);
    }, [trips, currentPage]);

    const totalPages = Math.ceil(trips.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const renderContent = () => {
        if (loading) return <p className="text-gray-500">Loading trips...</p>;
        if (error) return <p className="text-red-500">Error: {error}</p>;
        if (trips.length === 0) {
            return <div className="bg-white rounded-lg p-8 text-center text-gray-500"><p>No trips found.</p></div>;
        }
        return (
            <div className="space-y-3">
                {paginatedTrips.map((trip) => (
                    <TripRow
                        key={trip.id}
                        trip={trip}
                        isExpanded={expandedTripId === trip.id}
                        onToggleExpand={handleToggleExpand}
                    />
                ))}
            </div>
        );
    };

    return (
        <div>
            <div>
                <h1 className="text-4xl font-bold text-violet-600 mb-2">Trips</h1>
                <hr className="border-violet-300 border-t-2 w-full" />
            </div>

            <div className="mt-8">
                {renderContent()}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 mx-1 rounded-md disabled:opacity-50 hover:bg-gray-200">
                        <FiChevronLeft />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 mx-1 rounded-md ${currentPage === page ? 'bg-violet-600 text-white' : 'bg-white hover:bg-gray-200'}`}
                        >
                            {page}
                        </button>
                    ))}
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 mx-1 rounded-md disabled:opacity-50 hover:bg-gray-200">
                        <FiChevronRight />
                    </button>
                </div>
            )}
        </div>
    );
}