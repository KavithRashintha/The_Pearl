"use client";

import Image from 'next/image';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

type DestinationCardProps = {
    id: number;
    name: string;
    image: string;
    type: string;
    onAddToItinerary: (id: number) => void;
};

type DecodedToken = {
    sub: string;
    role: string;
    userId: number;
    userName: string;
    exp: number;
};

export default function DestinationCard({ id, name, image, onAddToItinerary }: DestinationCardProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [touristId, setTouristId] = useState<number | null>(null);

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                setTouristId(decoded.userId);
            } catch (e) {
                console.error('Invalid token');
            }
        }
    }, []);

    const handleAddClick = async (e: React.MouseEvent) => {

        const token = Cookies.get('accessToken');
        if (!token || !touristId) {
            toast.error("You must be logged in to perform this action.");
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        setIsAdding(true);

        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            const wishlistResponse = await fetch(`http://127.0.0.1:8003/api/wishlist/${touristId}`, { headers });

            if (wishlistResponse.ok) {
                const wishlistData = await wishlistResponse.json();

                if(!wishlistData){
                    const response = await fetch('http://127.0.0.1:8003/api/wishlist/add', {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({
                            touristId: touristId,
                            destinations: [id]
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to add to wishlist');
                    }
                    toast.success(`${name} added to your Dream List!`);
                }else{
                    const destinations: number[] = wishlistData.destinations || [];
                    const wishlistId = wishlistData.id;

                    if (!destinations.includes(id)) {
                        const updatedDestinations = [...destinations, id];
                        const response = await fetch(
                            `http://127.0.0.1:8003/api/wishlist/${wishlistId}/update-destinations`,
                            {
                                method: 'PATCH',
                                headers: headers,
                                body: JSON.stringify(updatedDestinations)
                            }
                        );

                        if (!response.ok) {
                            throw new Error('Failed to update wishlist');
                        }
                        toast.success(`${name} added to your Dream List!`);
                    } else {
                        toast.info(`${name} is already in your Dream List`);
                    }
                }
            } else if (wishlistResponse.status === 404) {
                const response = await fetch('http://127.0.0.1:8003/api/wishlist/add', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        touristId: touristId,
                        destinations: [id]
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to create wishlist');
                }
                toast.success(`${name} added to your Dream List!`);
            }
            else {
                throw new Error('Failed to get the wishlist');
            }

            onAddToItinerary(id);
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            toast.error(`Failed to add ${name} to Dream List`);
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
