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

export default function PlanTrip() {
    const [wishlist, setWishlist] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const touristId = 1; 

    useEffect(() => {
        const fetchWishlistAndDestinations = async () => {
            try {
                // Fetch the wishlist for the tourist
                const wishlistResponse = await fetch(`http://localhost:8000/wishlist/${touristId}`);

                if (!wishlistResponse.ok) {
                    throw new Error('Failed to fetch wishlist');
                }

                const wishlistData: WishlistItem = await wishlistResponse.json();

                if (!wishlistData || !wishlistData.destinations || wishlistData.destinations.length === 0) {
                    setWishlist([]);
                    setLoading(false);
                    return;
                }

                // Fetch details for each destination in the wishlist
                const destinationPromises = wishlistData.destinations.map(async (destinationId) => {
                    const destinationResponse = await fetch(`http://localhost:8000/destinations/destination/${destinationId}`);

                    if (!destinationResponse.ok) {
                        console.error(`Failed to fetch destination ${destinationId}`);
                        return null;
                    }

                    return await destinationResponse.json();
                });

                const destinations = await Promise.all(destinationPromises);

                // Filter out any failed requests and set the wishlist
                const validDestinations = destinations.filter(dest => dest !== null) as Destination[];
                setWishlist(validDestinations);

            } catch (error) {
                console.error('Error fetching wishlist data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlistAndDestinations();
    }, []);

    const handleRemoveFromWishlist = async (destinationId: number) => {
        try {
            // First get the current wishlist to update it
            const wishlistResponse = await fetch(`http://localhost:8000/wishlist/${touristId}`);

            if (!wishlistResponse.ok) {
                throw new Error('Failed to fetch wishlist for removal');
            }

            const wishlistData: WishlistItem = await wishlistResponse.json();

            // Remove the destination from the array
            const updatedDestinations = wishlistData.destinations.filter(id => id !== destinationId);

            // Update the wishlist on the backend
            const updateResponse = await fetch(`http://localhost:8000/wishlist/${wishlistData.id}/update-destinations`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedDestinations)
            });

            if (!updateResponse.ok) {
                throw new Error('Failed to remove destination from wishlist');
            }

            // Update the local state
            setWishlist(wishlist.filter(dest => dest.id !== destinationId));

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
                    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-gray-200">
                        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-royal-purple mt-1">Dream Bucket</h2>

                        {loading ? (
                            <div className="flex justify-center py-8">
                                <p>Loading your dream destinations...</p>
                            </div>
                        ) : wishlist.length === 0 ? (
                            <div className="flex justify-center py-8">
                                <p>Your dream bucket is empty</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {wishlist.map((destination) => (
                                    <div key={destination.id} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <span className="font-medium text-gray-800">{destination.name}</span>
                                        <div className="flex gap-2">
                                            <button
                                                className="p-1 md:p-2 text-purple-600 hover:bg-white rounded-full transition-colors"
                                                onClick={() => console.log('Add to itinerary:', destination.id)}
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

                    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-gray-200">
                        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-royal-purple">Make The Dream Real</h2>

                        <div className="flex justify-center py-8 text-gray-500">
                            <p>Your planned destinations will appear here</p>
                        </div>

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