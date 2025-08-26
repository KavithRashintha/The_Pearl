"use client";

import { useState, useEffect } from 'react';
import CompletedTripCard from '@/app/tour-guide/components/completed_card';

export type CompletedTrip = {
    id: number;
    startDate: string;
    numberOfDays: number;
    numberOfAdults: number;
    numberOfChildren: number;
    destinations: string[];
    tripPayment: number;
    touristName: string;
    touristCountry: string;
};

export default function CompletedToursPage() {
    const [completedTrips, setCompletedTrips] = useState<CompletedTrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const tourGuideId = 1;

    useEffect(() => {
        const fetchCompletedTrips = async () => {
            try {
                const response = await fetch(`http://localhost:8003/api/trips/tour-guide/${tourGuideId}/completed`);
                if (!response.ok) {
                    throw new Error('Failed to fetch completed trips.');
                }
                const data = await response.json();
                const formattedData = data.map((trip: any) => ({
                    ...trip,
                    touristName: trip.touristName || 'Peter Maxwell',
                }));
                setCompletedTrips(formattedData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCompletedTrips();
    }, [tourGuideId]);

    const renderContent = () => {
        if (loading) {
            return <p className="text-gray-500">Loading completed tours...</p>;
        }
        if (error) {
            return <p className="text-red-500">Error: {error}</p>;
        }
        if (completedTrips.length === 0) {
            return (
                <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 text-center text-gray-500">
                    <p>You have no completed tours.</p>
                </div>
            );
        }
        return (
            <div className="space-y-8">
                {completedTrips.map((trip) => (
                    <CompletedTripCard key={trip.id} trip={trip} />
                ))}
            </div>
        );
    };

    return (
        <main className="p-8 md:p-12 bg-white flex-1">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Completed Tours</h1>
            <hr className="border-violet-300 border-t-2 w-32 mb-10" />

            {renderContent()}
        </main>
    );
}