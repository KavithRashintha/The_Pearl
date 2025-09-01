"use client";

import { useState, useEffect } from 'react';
import { FiTrash2, FiWind, FiList } from 'react-icons/fi';
import { TripFormData } from '@/app/tourist/trips/page';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import ActiveTripCard from '@/app/tourist/components/active_trip_card';

type Step1Props = {
    nextStep: () => void;
    setFormData: React.Dispatch<React.SetStateAction<TripFormData>>;
    openChat: () => void;
};

type DecodedToken = {
    sub: string;
    role: string;
    userId: number;
    userName: string;
    exp: number;
};

type Destination = { id: number; name: string; image: string; };
type WishlistItem = { id: number; touristId: number; destinations: number[]; };
type SelectedDestinationsItem = { id: number; touristId: number; selectedDestinations: number[]; };
export type Trip = {
    id: number;
    touristId: number;
    tourGuideId: number;
    touristCountry: string;
    destinations: string[];
    startDate: string;
    numberOfDays: number;
    numberOfAdults: number;
    numberOfChildren: number;
    tripStatus: string;
    paymentStatus: string;
    touristName?: string;
    tourGuideName?: string;
};

export default function Step1_SelectDestinations({ nextStep, setFormData, openChat }: Step1Props) {
    const [wishlist, setWishlist] = useState<Destination[]>([]);
    const [selectedDestinations, setSelectedDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLoading, setSelectedLoading] = useState(true);
    const [touristId, setTouristId] = useState<number | null>(null);
    const [accessToken, setAccessToken] = useState<string | undefined>();
    const [activeTrips, setActiveTrips] = useState<Trip[]>([]);
    const [hasActiveTrip, setHasActiveTrip] = useState(false);
    const [expandedTripId, setExpandedTripId] = useState<number | null>(null);

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                setAccessToken(token);
                setTouristId(decoded.userId);
            } catch (e) {
                console.error('Invalid token');
            }
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (touristId === null) {
                setLoading(false);
                setSelectedLoading(false);
                return;
            }
            try {
                const headers = { Authorization: `Bearer ${accessToken}` };
                const [
                    wishlistResponse,
                    selectedResponse,
                    activeTripStatusResponse,
                    acceptedTripsResponse
                ] = await Promise.all([
                    fetch(`http://127.0.0.1:8003/api/wishlist/${touristId}`, { headers }),
                    fetch(`http://127.0.0.1:8003/api/selected-destinations/${touristId}`, { headers }),
                    fetch(`http://127.0.0.1:8003/api/trips/tourist/${touristId}/has-active-trip`, { headers }),
                    fetch(`http://127.0.0.1:8003/api/trips/trip-by-tourist/${touristId}/accepted`, { headers })
                ]);

                if (wishlistResponse.ok) {
                    const wishlistData: WishlistItem | null = await wishlistResponse.json();
                    if (wishlistData?.destinations?.length > 0) {
                        const destinationPromises = wishlistData.destinations.map(async (destinationId) => {
                            const destinationResponse = await fetch(`http://127.0.0.1:8003/api/destinations/destination/${destinationId}`);
                            return destinationResponse.ok ? await destinationResponse.json() : null;
                        });
                        const destinations = await Promise.all(destinationPromises);
                        setWishlist(destinations.filter(dest => dest !== null) as Destination[]);
                    }
                }

                if (selectedResponse.ok) {
                    const selectedData: SelectedDestinationsItem | null = await selectedResponse.json();
                    if (selectedData?.selectedDestinations?.length > 0) {
                        const selectedPromises = selectedData.selectedDestinations.map(async (destinationId) => {
                            const destinationResponse = await fetch(`http://127.0.0.1:8003/api/destinations/destination/${destinationId}`);
                            return destinationResponse.ok ? await destinationResponse.json() : null;
                        });
                        const selectedDests = await Promise.all(selectedPromises);
                        setSelectedDestinations(selectedDests.filter(dest => dest !== null) as Destination[]);
                    }
                }

                if (activeTripStatusResponse.ok) {
                    const hasTrip = await activeTripStatusResponse.json();
                    setHasActiveTrip(hasTrip);
                }

                if (acceptedTripsResponse.ok) {
                    const acceptedData: Trip[] = await acceptedTripsResponse.json();
                    setActiveTrips(acceptedData);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
                setSelectedLoading(false);
            }
        };

        fetchData();
    }, [touristId, accessToken]);

    const handleToggleExpand = (tripId: number) => {
        setExpandedTripId(prevId => (prevId === tripId ? null : tripId));
    };

    const handleAddToSelected = async (destinationId: number) => {
        if (!touristId) {
            toast.error("Please log in to add destinations.");
            return;
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        };

        try {
            const selectedResponse = await fetch(`http://127.0.0.1:8003/api/selected-destinations/${touristId}`, { headers });
            if (selectedResponse.ok) {
                const selectedData: SelectedDestinationsItem | null = await selectedResponse.json();

                if(!selectedData || !selectedData.selectedDestinations) {
                    const createResponse = await fetch('http://127.0.0.1:8003/api/selected-destinations', {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({ touristId: touristId, selectedDestinations: [destinationId] })
                    });
                    if (createResponse.ok) {
                        const destinationToAdd = wishlist.find(dest => dest.id === destinationId);
                        if (destinationToAdd) {
                            setSelectedDestinations([destinationToAdd]);
                            toast.success("Added to Selected List!");
                        }
                    } else {
                        throw new Error('Failed to create selected list.');
                    }
                    return;
                }

                if (selectedData.selectedDestinations.includes(destinationId)) {
                    toast.info("Destination is already in your selected list.");
                    return;
                }

                const updatedSelected = [...selectedData.selectedDestinations, destinationId];
                const updateResponse = await fetch(
                    `http://127.0.0.1:8003/api/selected-destinations/${selectedData.id}/updated-selected-destinations`,
                    {
                        method: 'PATCH',
                        headers: headers,
                        body: JSON.stringify(updatedSelected)
                    }
                );
                if (updateResponse.ok) {
                    const destinationToAdd = wishlist.find(dest => dest.id === destinationId);
                    if (destinationToAdd) {
                        setSelectedDestinations(prev => [...prev, destinationToAdd]);
                        toast.success("Added to Selected List!");
                    }
                } else {
                    throw new Error('Failed to update selected list.');
                }
            } else if (selectedResponse.status === 404) {
                const createResponse = await fetch('http://127.0.0.1:8003/api/selected-destinations', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ touristId: touristId, selectedDestinations: [destinationId] })
                });
                if (createResponse.ok) {
                    const destinationToAdd = wishlist.find(dest => dest.id === destinationId);
                    if (destinationToAdd) {
                        setSelectedDestinations([destinationToAdd]);
                        toast.success("Added to Selected List!");
                    }
                } else {
                    throw new Error('Failed to create selected list.');
                }
            } else {
                throw new Error('Failed to get the selected destinations');
            }
        } catch (error: any) {
            console.error('Error adding to selected destinations:', error);
            toast.error(error.message || 'Could not add to selected list.');
        }
    };

    const handleRemoveFromSelected = async (destinationId: number) => {
        if (!touristId) return;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        };

        try {
            const selectedResponse = await fetch(`http://127.0.0.1:8003/api/selected-destinations/${touristId}`, { headers });
            if (!selectedResponse.ok) throw new Error('Failed to fetch selected destinations');
            const selectedData: SelectedDestinationsItem = await selectedResponse.json();
            const updatedSelected = selectedData.selectedDestinations.filter(id => id !== destinationId);
            const updateResponse = await fetch(
                `http://127.0.0.1:8003/api/selected-destinations/${selectedData.id}/updated-selected-destinations`,
                {
                    method: 'PATCH',
                    headers: headers,
                    body: JSON.stringify(updatedSelected)
                }
            );
            if (updateResponse.ok) {
                setSelectedDestinations(prev => prev.filter(dest => dest.id !== destinationId));
                toast.success("Removed from Selected List.");
            }
        } catch (error) {
            console.error('Error removing from selected destinations:', error);
            toast.error("Could not remove from selected list.");
        }
    };

    const handleRemoveFromWishlist = async (destinationId: number) => {
        if (!touristId) return;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        };

        try {
            const wishlistResponse = await fetch(`http://127.0.0.1:8003/api/wishlist/${touristId}`, { headers });
            if (!wishlistResponse.ok) throw new Error('Failed to fetch wishlist');
            const wishlistData: WishlistItem = await wishlistResponse.json();
            const updatedDestinations = wishlistData.destinations.filter(id => id !== destinationId);
            const updateResponse = await fetch(`http://127.0.0.1:8003/api/wishlist/${wishlistData.id}/update-destinations`, {
                method: 'PATCH',
                headers: headers,
                body: JSON.stringify(updatedDestinations)
            });
            if (updateResponse.ok) {
                setWishlist(prev => prev.filter(dest => dest.id !== destinationId));
                toast.success("Removed from Dream Bucket.");
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            toast.error("Could not remove from wishlist.");
        }
    };

    const handleProceed = () => {
        if (hasActiveTrip) {
            toast.error("You cannot create a new trip while you have an active one.");
            return;
        }
        setFormData(prevData => ({
            ...prevData,
            destinations: selectedDestinations.map(d => ({ id: d.id, name: d.name }))
        }));
        nextStep();
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-end mb-8 md:mb-12">
                <span className="text-base md:text-base font-medium text-gray-600">Ask From Wandy</span>
                <button
                    onClick={openChat}
                    className="flex items-center justify-center h-12 w-12 ml-2 rounded-full bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                >
                    <FiWind size={24} />
                </button>
            </div>

            {activeTrips.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Active Trip(s)</h2>
                    <div className="space-y-4">
                        {activeTrips.map(trip => (
                            <ActiveTripCard
                                key={trip.id}
                                trip={trip}
                                isExpanded={expandedTripId === trip.id}
                                onToggleExpand={handleToggleExpand}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-gray-200">
                    <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-violet-600 mt-1">Dream Bucket</h2>
                    {loading ? (
                        <div className="flex justify-center py-8"><p>Loading your dream destinations...</p></div>
                    ) : wishlist.length === 0 ? (
                        <div className="flex justify-center py-8"><p>Your dream bucket is empty</p></div>
                    ) : (
                        <div className="space-y-3">
                            {wishlist.map((destination) => (
                                <div key={destination.id} className="flex items-center justify-between p-3 md:p-4 bg-gray-100 rounded-lg">
                                    <span className="font-medium text-gray-800">{destination.name}</span>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleAddToSelected(destination.id)} className="p-2 text-violet-600 hover:text-white hover:bg-violet-600 rounded-full transition-colors" aria-label={`Add ${destination.name} to itinerary`}><FiList size={20} /></button>
                                        <button onClick={() => handleRemoveFromWishlist(destination.id)} className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-colors" aria-label={`Remove ${destination.name}`}><FiTrash2 size={20} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-gray-200">
                    <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-violet-600">Make The Dream Real</h2>
                    {selectedLoading ? (
                        <div className="flex justify-center py-8"><p>Loading selected destinations...</p></div>
                    ) : selectedDestinations.length === 0 ? (
                        <div className="flex justify-center py-8 text-gray-500"><p>Your planned destinations will appear here</p></div>
                    ) : (
                        <div className="space-y-3">
                            {selectedDestinations.map((destination) => (
                                <div key={destination.id} className="flex items-center justify-between p-3 md:p-4 bg-gray-100 rounded-lg">
                                    <span className="font-medium text-gray-800">{destination.name}</span>
                                    <button onClick={() => handleRemoveFromSelected(destination.id)} className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-colors" aria-label={`Remove ${destination.name}`}><FiTrash2 size={20} /></button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-6 md:mt-8 flex justify-center">
                        <button onClick={handleProceed} disabled={selectedDestinations.length === 0 || hasActiveTrip} className="w-full px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-gray-400 transition-colors font-medium">Proceed</button>
                    </div>
                </div>
            </div>
        </div>
    );
}