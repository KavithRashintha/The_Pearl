"use client";

import { useState, useEffect } from 'react';
import AcceptedTripCard from '@/app/tour-guide/(components)/accepted_card';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export type AcceptedTrip = {
    id: number;
    startDate: string;
    endDate: string;
    numberOfDays: number;
    numberOfAdults: number;
    numberOfChildren: number;
    destinations: string[];
    tripPayment: number;
    tripStatus: string;
    paymentStatus: string;
    touristId: number;
    touristName: string;
    touristCountry: string;
    touristPassportNumber: string;
    touristEmail?: string;
};

type DecodedToken = {
    sub: string;
    role: string;
    userId: number;
    userName: string;
    exp: number;
};

export default function ActiveToursPage() {
    const [activeTrips, setActiveTrips] = useState<AcceptedTrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedTripId, setExpandedTripId] = useState<number | null>(null);
    const [accessToken, setAccessToken] = useState<string | undefined>();
    const [tourGuideId, setTourGuideId] = useState<number | null>(null);

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                setAccessToken(token);
                setTourGuideId(decoded.userId);
            } catch (e) {
                console.error('Invalid token');
            }
        }
    }, []);

    useEffect(() => {
        const fetchActiveTrips = async () => {
            if (!tourGuideId) return;
            try {
                const headers = { Authorization: `Bearer ${accessToken}` };
                const [acceptedResponse, startedResponse] = await Promise.all([
                    fetch(`http://localhost:8003/api/trips/tour-guide/${tourGuideId}/accepted`, { headers }),
                    fetch(`http://localhost:8003/api/trips/tour-guide/${tourGuideId}/started`, { headers })
                ]);

                if (!acceptedResponse.ok || !startedResponse.ok) {
                    throw new Error('Failed to fetch trip data.');
                }

                const acceptedData: AcceptedTrip[] = await acceptedResponse.json();
                const startedData: AcceptedTrip[] = await startedResponse.json();
                const allTrips = [...acceptedData, ...startedData];

                const touristIds = [...new Set(allTrips.map(trip => trip.touristId))];
                const touristPromises = touristIds.map(id =>
                    fetch(`http://localhost:8003/api/tourists/${id}/profile`, { headers }).then(res => res.ok ? res.json() : null)
                );
                const tourists = (await Promise.all(touristPromises)).filter(Boolean);
                const touristMap = new Map(tourists.map(t => [t.id, t.email]));

                const enrichedTrips = allTrips.map(trip => ({
                    ...trip,
                    touristEmail: touristMap.get(trip.touristId)
                }));

                setActiveTrips(enrichedTrips);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchActiveTrips();
    }, [tourGuideId, accessToken]);

    const handleToggleExpand = (tripId: number) => {
        setExpandedTripId(prevId => (prevId === tripId ? null : tripId));
    };

    const handleStatusUpdate = async (tripId: number, newStatus: string) => {
        try {
            const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` };
            const response = await fetch(`http://localhost:8003/api/trips/${tripId}/update-trip-status`, {
                method: 'PATCH',
                headers: headers,
                body: JSON.stringify({ tripStatus: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update trip status.');

            setActiveTrips(prevTrips =>
                prevTrips.map(trip =>
                    trip.id === tripId ? { ...trip, tripStatus: newStatus } : trip
                )
            );
            toast.success(`Trip status updated to "${newStatus}".`);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handlePaymentStatusUpdate = async (tripId: number, newStatus: string) => {
        try {
            const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` };
            const response = await fetch(`http://localhost:8003/api/trips/${tripId}/update-payment-status`, {
                method: 'PATCH',
                headers: headers,
                body: JSON.stringify({ paymentStatus: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update payment status.');

            setActiveTrips(prevTrips =>
                prevTrips.map(trip =>
                    trip.id === tripId ? { ...trip, paymentStatus: newStatus } : trip
                )
            );
            toast.success(`Payment status updated to "${newStatus}".`);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const renderContent = () => {
        if (loading) {
            return <p className="text-gray-500">Loading active trips...</p>;
        }
        if (error) {
            return <p className="text-red-500">Error: {error}</p>;
        }
        if (activeTrips.length === 0) {
            return (
                <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 text-center text-gray-500">
                    <p>You have no accepted or started trips.</p>
                </div>
            );
        }
        return (
            <div className="space-y-6">
                {activeTrips.map((trip) => (
                    <AcceptedTripCard
                        key={trip.id}
                        trip={trip}
                        isExpanded={expandedTripId === trip.id}
                        onToggleExpand={handleToggleExpand}
                        onStatusUpdate={handleStatusUpdate}
                        onPaymentStatusUpdate={handlePaymentStatusUpdate}
                    />
                ))}
            </div>
        );
    };

    return (
        <main className="p-8 md:p-12 bg-white flex-1">
            <h1 className="text-4xl font-bold text-royal-purple mb-2">Active Trips</h1>
            <hr className="border-violet-700 border-t-2 w-full mb-10 mt-4" />

            {renderContent()}
        </main>
    );
}