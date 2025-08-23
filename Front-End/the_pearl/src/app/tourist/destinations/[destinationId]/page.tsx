"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { toast } from 'react-toastify';

interface Destination {
    id: number;
    name: string;
    image: string;
    district: string;
    province: string;
    type: string;
    details: string[];
    activities: string[];
    climate: string;
}

async function getDestination(id: number): Promise<Destination | null> {
    try {
        const res = await fetch(`http://127.0.0.1:8000/destinations/destination/${id}`, {
            next: { revalidate: 3600 }
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Failed to fetch destination:', error);
        return null;
    }
}

export default function DestinationPage() {
    const [isAdding, setIsAdding] = useState(false);
    const [destination, setDestination] = useState<Destination | null>(null);
    const params = useParams();
    const destinationId = params.destinationId as string;

    // Fetch destination data
    useEffect(() => {
        if (!destinationId) return;

        const fetchDestination = async () => {
            const data = await getDestination(Number(destinationId));
            if (!data) {
                return <div>Destination not found.</div>;
            }
            setDestination(data);
        };

        fetchDestination();
    }, [destinationId]);

    const handleAddToDreamList = async () => {
        if (!destination) return;

        setIsAdding(true);

        try {
            const wishlistResponse = await fetch('http://127.0.0.1:8000/wishlist/1');

            if (wishlistResponse.ok) {
                const wishlistData = await wishlistResponse.json();

                if (!wishlistData) {
                    const response = await fetch('http://127.0.0.1:8000/wishlist/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            touristId: 1,
                            destinations: [destination.id]
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to create wishlist');
                    }
                    toast.success(`${destination.name} added to your Dream List!`);
                } else {
                    const destinations: number[] = wishlistData.destinations || [];
                    const wishlistId = wishlistData.id;

                    if (!destinations.includes(destination.id)) {
                        const updatedDestinations = [...destinations, destination.id];
                        const response = await fetch(
                            `http://127.0.0.1:8000/wishlist/${wishlistId}/update-destinations`,
                            {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(updatedDestinations)
                            }
                        );

                        if (!response.ok) {
                            throw new Error('Failed to update wishlist');
                        }
                        toast.success(`${destination.name} added to your Dream List!`);
                    } else {
                        toast.info(`${destination.name} is already in your Dream List`);
                    }
                }
            } else {
                throw new Error('Failed to get the wishlist');
            }
        } catch (error) {
            console.error('Error updating wishlist:', error);
            toast.error(`Failed to add ${destination.name} to Dream List`);
        } finally {
            setIsAdding(false);
        }
    };

    if (!destination) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="ml-6">
                <h1 className="text-4xl font-bold text-gray-900 mt-2 text-royal-purple">
                    {destination.name}
                </h1>

                <hr className="border-gray-300 w-full max-w-[98%] border-t-2 my-6 mb-12"/>
            </div>

            <div className="flex flex-col lg:flex-row gap-14">
                <div className="lg:w-1/2 ml-6">
                    <div className="relative h-64 md:h-[500px] rounded-lg overflow-hidden shadow-lg">
                        <Image
                            src={destination.image}
                            alt={destination.name}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    </div>
                </div>

                <div className="lg:w-1/2">
                    <div className="prose max-w-none mb-8 mr-8">
                        <h2 className="text-xl font-semibold mb-4">Overview</h2>
                        {destination.details.map((paragraph, index) => (
                            <p key={index} className="mb-4 text-gray-700 text-justify">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-4 mt-8">
                        <button
                            onClick={handleAddToDreamList}
                            className="px-6 py-3 bg-royal-purple text-white rounded-lg hover:bg-purple-700 transition-colors"
                            disabled={isAdding}
                        >
                            {isAdding ? 'Adding...' : 'Add to Dream List'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}