"use client";

import { useState, useEffect } from 'react';
import RequestCard from '@/app/tour-guide/components/request_card';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export type TourRequest = {
    id: number;
    touristName: string;
    touristCountry: string;
    startDate: string;
    numberOfDays: number;
    numberOfAdults: number;
    numberOfChildren: number;
    destinations: string[];
    tripPayment: number;
};

type DecodedToken = {
    sub: string;
    role: string;
    userId: number;
    userName: string;
    exp: number;
};

export default function TourRequestsPage() {
    const [requests, setRequests] = useState<TourRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedRequestId, setExpandedRequestId] = useState<number | null>(null);
    const [accessToken, setAccessToken] = useState()
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
        if (tourGuideId == null){
            return;
        }
        const fetchRequests = async () => {
            try {
                const response = await fetch(`http://localhost:8003/api/trips/tour-guide/${tourGuideId}/pending`);
                if (!response.ok) {
                    throw new Error('Failed to fetch tour requests.');
                }
                const data: TourRequest[] = await response.json();
                setRequests(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [tourGuideId]);

    const handleToggleExpand = (requestId: number) => {
        setExpandedRequestId(prevId => (prevId === requestId ? null : requestId));
    };

    const updateTripStatus = async (tripId: number, status: 'Accepted' | 'Rejected') => {

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        };

        try {
            const response = await fetch(`http://localhost:8003/api/trips/${tripId}/update-trip-status`, {
                method: 'PATCH',
                headers: headers,
                body: JSON.stringify({ tripStatus: status }),
            });

            if (!response.ok) {
                throw new Error(`Failed to ${status.toLowerCase()} the request.`);
            }

            setRequests(prevRequests => prevRequests.filter(request => request.id !== tripId));
            toast.success(`Request has been ${status.toLowerCase()}.`);

        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleAcceptRequest = (requestId: number) => {
        updateTripStatus(requestId, 'Accepted');
    };

    const handleRejectRequest = (requestId: number) => {
        updateTripStatus(requestId, 'Rejected');
    };

    const renderContent = () => {
        if (loading) {
            return <p className="text-gray-500">Loading requests...</p>;
        }
        if (error) {
            return <p className="text-red-500">Error: {error}</p>;
        }
        if (requests.length === 0) {
            return <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 text-center text-gray-500">
                <p>You have no pending tour requests.</p>
            </div>;
        }
        return (
            <div className="space-y-6">
                {requests.map((request) => (
                    <RequestCard
                        key={request.id}
                        request={request}
                        isExpanded={expandedRequestId === request.id}
                        onToggleExpand={handleToggleExpand}
                        onAccept={handleAcceptRequest}
                        onReject={handleRejectRequest}
                    />
                ))}
            </div>
        );
    };

    return (
        <main className="p-8 md:p-12 bg-white flex-1">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Tour Requests</h1>
            <hr className="border-violet-300 border-t-2 w-24 mb-10" />

            {renderContent()}
        </main>
    );
}