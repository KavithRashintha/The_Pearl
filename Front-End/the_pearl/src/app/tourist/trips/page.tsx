"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiWind } from 'react-icons/fi';

type Destination = {
    id: number;
    name: string;
    image: string;
};

type WishlistItem = {
    id: number;
    touristId: number;
    destinations: number[];
};

type SelectedDestinationsItem = {
    id: number;
    touristId: number;
    selectedDestinations: number[];
};

export default function PlanTrip() {
    const [wishlist, setWishlist] = useState<Destination[]>([]);
    const [selectedDestinations, setSelectedDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLoading, setSelectedLoading] = useState(true);
    const touristId = 1;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const wishlistResponse = await fetch(`http://localhost:8000/wishlist/${touristId}`);
                if (!wishlistResponse.ok) throw new Error('Failed to fetch wishlist');

                const wishlistData: WishlistItem = await wishlistResponse.json();
                if (wishlistData?.destinations?.length > 0) {
                    const destinationPromises = wishlistData.destinations.map(async (destinationId) => {
                        const destinationResponse = await fetch(`http://localhost:8000/destinations/destination/${destinationId}`);
                        return destinationResponse.ok ? await destinationResponse.json() : null;
                    });
                    const destinations = await Promise.all(destinationPromises);
                    setWishlist(destinations.filter(dest => dest !== null) as Destination[]);
                }

                const selectedResponse = await fetch(`http://localhost:8000/selected-destinations/${touristId}`);
                if (selectedResponse.ok) {
                    const selectedData: SelectedDestinationsItem = await selectedResponse.json();
                    if (selectedData?.selectedDestinations?.length > 0) {
                        const selectedPromises = selectedData.selectedDestinations.map(async (destinationId) => {
                            const destinationResponse = await fetch(`http://localhost:8000/destinations/destination/${destinationId}`);
                            return destinationResponse.ok ? await destinationResponse.json() : null;
                        });
                        const selectedDests = await Promise.all(selectedPromises);
                        setSelectedDestinations(selectedDests.filter(dest => dest !== null) as Destination[]);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
                setSelectedLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddToSelected = async (destinationId: number) => {
        try {
            const selectedResponse = await fetch(`http://localhost:8000/selected-destinations/${touristId}`);

            if (selectedResponse.ok) {
                const selectedData: SelectedDestinationsItem = await selectedResponse.json();

                if (!selectedData) {
                    const createResponse = await fetch('http://localhost:8000/selected-destinations/add', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            touristId: 1,
                            selectedDestinations: [destinationId]
                        })
                    });

                    if (createResponse.ok) {
                        const destinationResponse = await fetch(`http://localhost:8000/destinations/destination/${destinationId}`);
                        if (destinationResponse.ok) {
                            const newDestination = await destinationResponse.json();
                            setSelectedDestinations([newDestination]);
                        }
                    }
                } else {
                    const updatedSelected = [...selectedData.selectedDestinations, destinationId];
                    const updateResponse = await fetch(
                        `http://localhost:8000/selected-destinations/${selectedData.id}/updated-selected-destinations`,
                        {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(updatedSelected)
                        }
                    );

                    if (updateResponse.ok) {
                        const destinationResponse = await fetch(`http://localhost:8000/destinations/destination/${destinationId}`);
                        if (destinationResponse.ok) {
                            const newDestination = await destinationResponse.json();
                            setSelectedDestinations(prev => [...prev, newDestination]);
                        }
                    }
                }
            } else {
                throw new Error('Failed to get the selected destinations');
            }
        } catch (error) {
            console.error('Error adding to selected destinations:', error);
        }
    };

    const handleRemoveFromSelected = async (destinationId: number) => {
        try {
            const selectedResponse = await fetch(`http://localhost:8000/selected-destinations/${touristId}`);
            if (!selectedResponse.ok) throw new Error('Failed to fetch selected destinations');

            const selectedData: SelectedDestinationsItem = await selectedResponse.json();
            const updatedSelected = selectedData.selectedDestinations.filter(id => id !== destinationId);

            const updateResponse = await fetch(
                `http://localhost:8000/selected-destinations/${selectedData.id}/updated-selected-destinations`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedSelected)
                }
            );

            if (updateResponse.ok) {
                setSelectedDestinations(prev => prev.filter(dest => dest.id !== destinationId));
            }
        } catch (error) {
            console.error('Error removing from selected destinations:', error);
        }
    };

    const handleRemoveFromWishlist = async (destinationId: number) => {
        try {
            const wishlistResponse = await fetch(`http://localhost:8000/wishlist/${touristId}`);
            if (!wishlistResponse.ok) throw new Error('Failed to fetch wishlist');

            const wishlistData: WishlistItem = await wishlistResponse.json();
            const updatedDestinations = wishlistData.destinations.filter(id => id !== destinationId);

            const updateResponse = await fetch(`http://localhost:8000/wishlist/${wishlistData.id}/update-destinations`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedDestinations)
            });

            if (updateResponse.ok) {
                setWishlist(prev => prev.filter(dest => dest.id !== destinationId));
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    return (
        <div className="min-h-screen">
            <section className="relative h-[40vh] w-full overflow-hidden">
                <div className="relative inset-0 w-full h-full">
                    <Image
                        src="/images/trips_hero.jpg"
                        alt="Plan Trip Hero Image"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/25 to-transparent" />

                <div className="absolute inset-0 z-10 flex items-center pl-12">
                    <div className="max-w-[45%] pl-8 pb-10">
                        <h1 className="text-4xl md:text-6xl font-semibold leading-tight text-white">
                            Plan Your Trip Here
                        </h1>
                        <hr className="border-white mb-4 ml-1 w-[50%] border-t-2 md:border-t-3"/>
                        <p className="text-xl md:text-2xl text-white font-semibold">
                            Explore The Beauty, Plan The Journey
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 md:px-16 py-8 md:py-12">
                <div className="flex items-center justify-end mb-8 md:mb-12">
                    <span className="text-base md:text-base font-medium text-gray-600">Ask From Wandy</span>
                    <button className="flex items-center gap-3 px-3 py-3 ml-2 rounded-full bg-royal-purple text-white hover:bg-purple-700 transition-colors">
                        <FiWind size={22} />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {/* Dream Bucket */}
                    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-gray-200">
                        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-royal-purple mt-1">Dream Bucket</h2>
                        {loading ? (
                            <div className="flex justify-center py-8"><p>Loading your dream destinations...</p></div>
                        ) : wishlist.length === 0 ? (
                            <div className="flex justify-center py-8"><p>Your dream bucket is empty</p></div>
                        ) : (
                            <div className="space-y-3">
                                {wishlist.map((destination) => (
                                    <div key={destination.id} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <span className="font-medium text-gray-800">{destination.name}</span>
                                        <div className="flex gap-2">
                                            <button
                                                className="p-1 md:p-2 text-purple-600 hover:bg-white rounded-full transition-colors"
                                                onClick={() => handleAddToSelected(destination.id)}
                                                aria-label={`Add ${destination.name} to itinerary`}
                                            >
                                                <FiPlus size={18} />
                                            </button>
                                            <button
                                                className="p-1 md:p-2 text-red-600 hover:bg-white rounded-full transition-colors"
                                                onClick={() => handleRemoveFromWishlist(destination.id)}
                                                aria-label={`Remove ${destination.name}`}
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Make The Dream Real */}
                    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-gray-200">
                        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-royal-purple">Make The Dream Real</h2>
                        {selectedLoading ? (
                            <div className="flex justify-center py-8"><p>Loading selected destinations...</p></div>
                        ) : selectedDestinations.length === 0 ? (
                            <div className="flex justify-center py-8 text-gray-500"><p>Your planned destinations will appear here</p></div>
                        ) : (
                            <div className="space-y-3">
                                {selectedDestinations.map((destination) => (
                                    <div key={destination.id} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <span className="font-medium text-gray-800">{destination.name}</span>
                                        <button
                                            className="p-1 md:p-2 text-red-600 hover:bg-white rounded-full transition-colors"
                                            onClick={() => handleRemoveFromSelected(destination.id)}
                                            aria-label={`Remove ${destination.name}`}
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-6 md:mt-8 flex justify-center">
                            <button className="px-6 py-2 md:py-3 bg-royal-purple text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                                Proceed
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}