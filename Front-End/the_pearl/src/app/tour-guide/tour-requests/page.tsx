"use client";

import { useState, useEffect } from 'react';
import RequestCard from '@/app/tour-guide/(components)/request_card';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import emailjs from '@emailjs/browser';

export type TourRequest = {
    id: number;
    touristId: number;
    touristName: string;
    touristCountry: string;
    touristEmail?: string;
    touristPhone?: string;
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

type TourGuideProfile = {
    name: string;
    email: string;
    tour_guide: {
        telephone: string;
    }
}

export default function TourRequestsPage() {
    const [requests, setRequests] = useState<TourRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedRequestId, setExpandedRequestId] = useState<number | null>(null);
    const [accessToken, setAccessToken] = useState<string | undefined>();
    const [tourGuideId, setTourGuideId] = useState<number | null>(null);
    const [hasActiveTrip, setHasActiveTrip] = useState(false);
    const [tourGuideProfile, setTourGuideProfile] = useState<TourGuideProfile | null>(null);

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
            setLoading(false);
            return;
        }
        const fetchRequests = async () => {
            try {
                const headers = { Authorization: `Bearer ${accessToken}` };
                const [requestsResponse, activeTripResponse, guideProfileResponse] = await Promise.all([
                    fetch(`http://localhost:8003/api/trips/tour-guide/${tourGuideId}/pending`, { headers }),
                    fetch(`http://localhost:8003/api/trips/tour-guide/${tourGuideId}/has-active-trip`, { headers }),
                    fetch(`http://localhost:8003/api/tour-guide/${tourGuideId}/profile`, { headers })
                ]);

                if (!requestsResponse.ok) throw new Error('Failed to fetch tour requests.');

                if (activeTripResponse.ok) {
                    const hasActive = await activeTripResponse.json();
                    setHasActiveTrip(hasActive.has_active_trip);
                    console.log(hasActive.has_active_trip);
                }

                if (guideProfileResponse.ok) {
                    const guideData = await guideProfileResponse.json();
                    setTourGuideProfile(guideData);
                }

                const data: TourRequest[] = await requestsResponse.json();

                const touristIds = [...new Set(data.map(req => req.touristId))];
                const touristPromises = touristIds.map(id =>
                    fetch(`http://localhost:8003/api/tourists/${id}/profile`, { headers }).then(res => res.ok ? res.json() : null)
                );
                const tourists = (await Promise.all(touristPromises)).filter(Boolean);
                const touristMap = new Map(tourists.map(t => [t.id, { email: t.email, phone: t.tourist?.telephone }]));

                const enrichedRequests = data.map(req => ({
                    ...req,
                    touristEmail: touristMap.get(req.touristId)?.email,
                    touristPhone: touristMap.get(req.touristId)?.phone,
                }));

                setRequests(enrichedRequests);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [tourGuideId, accessToken]);

    const handleToggleExpand = (requestId: number) => {
        setExpandedRequestId(prevId => (prevId === requestId ? null : requestId));
    };

    const sendConfirmationEmail = async (request: TourRequest, guideProfile: TourGuideProfile) => {
        const templateParams = {
            tourist_name: request.touristName,
            email: request.touristEmail,
            name: guideProfile.name,
            guide_email: guideProfile.email,
            guide_phone: guideProfile.tour_guide.telephone,
        };

        await emailjs.send(
            'service_yplt11j',
            'template_3u5wm2s',
            templateParams,
            '9vQugrlxpfHpeQLs2'
        );
    };

    const updateTripStatus = async (tripId: number, status: 'Accepted' | 'Rejected', request: TourRequest) => {
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

            if (status === 'Accepted' && tourGuideProfile && request.touristEmail) {
                await toast.promise(
                    sendConfirmationEmail(request, tourGuideProfile),
                    {
                        loading: 'Sending confirmation email...',
                        success: <b>Confirmation email sent!</b>,
                        error: <b>Could not send email.</b>,
                    }
                );
            }

            setRequests(prevRequests => prevRequests.filter(req => req.id !== tripId));
            toast.success(`Request has been ${status.toLowerCase()}.`);

        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleAcceptRequest = (request: TourRequest) => {
        updateTripStatus(request.id, 'Accepted', request);
    };

    const handleRejectRequest = (request: TourRequest) => {
        updateTripStatus(request.id, 'Rejected', request);
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
                        onAccept={() => handleAcceptRequest(request)}
                        onReject={() => handleRejectRequest(request)}
                        isAcceptDisabled={hasActiveTrip}
                    />
                ))}
            </div>
        );
    };

    return (
        <main className="p-8 md:p-12 bg-white flex-1">
            <h1 className="text-4xl font-bold text-royal-purple mb-2">Tour Requests</h1>
            <hr className="border-violet-700 border-t-2 w-full mb-10 mt-4" />

            {hasActiveTrip && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
                    <p className="font-bold">Attention</p>
                    <p>You already have an active trip. You cannot accept new requests until it is completed.</p>
                </div>
            )}

            {renderContent()}
        </main>
    );
}