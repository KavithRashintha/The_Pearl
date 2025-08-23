"use client";

import Image from 'next/image';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';

type DestinationCardProps = {
    id: number;
    name: string;
    image: string;
    type: string;
    onAddToItinerary: (id: number) => void;
};

export default function DestinationCard({ id, name, image, onAddToItinerary }: DestinationCardProps) {
    const [isAdding, setIsAdding] = useState(false);

    const handleAddClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAdding(true);

        try {
            const wishlistResponse = await fetch('http://127.0.0.1:8000/wishlist/1');

            if (wishlistResponse.ok) {
                const wishlistData = await wishlistResponse.json();

                if(!wishlistData){
                    const response = await fetch('http://127.0.0.1:8000/wishlist/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            touristId: 1,
                            destinations: [id]
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to add to wishlist');
                    }
                }else{
                    const destinations: number[] = wishlistData.destinations || [];
                    const wishlistId = wishlistData.id;

                    let updatedDestinations = destinations.includes(id)
                        ? destinations
                        : [...destinations, id];

                    if (!destinations.includes(id)) {
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
                    } else {
                        console.log(`Destination ${id} already exists in wishlist`);
                    }
                }
            } else {
                throw new Error('Failed to get the wishlist');
            }

            onAddToItinerary(id);
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <Link href={`/tourist/destinations/${id}`} passHref>
            <div className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="relative h-64 w-full">
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        quality={100}
                    />
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-white font-semibold text-xl">{name}</h3>
                        <button
                            onClick={handleAddClick}
                            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
                            aria-label={`Add ${name} to itinerary`}
                            disabled={isAdding}
                        >
                            <PlusIcon className={`h-5 w-5 text-white ${isAdding ? 'animate-pulse' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
