"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import DestinationCard from "@/app/(tourist)/components/destination_card";

type Destination = {
    id: number;
    name: string;
    image: string;
    type: string;
    province: string;
    activities: string[];
};

export default function Destination() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        type: '',
        province: '',
        activity: ''
    });

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const params = new URLSearchParams();
                if (filters.type) params.append('type', filters.type);
                if (filters.province) params.append('province', filters.province);
                if (filters.activity) params.append('activity', filters.activity);

                const response = await fetch(`http://127.0.0.1:8000/destinations/`);
                if (!response.ok) throw new Error('Failed to fetch destinations');

                const data = await response.json();
                setDestinations(data);
            } catch (error) {
                console.error('Error fetching destinations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, [filters]);

    const handleAddToItinerary = (destinationId: number) => {
        console.log('Added destination to itinerary:', destinationId);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            <section className="relative h-[46vh] w-full overflow-hidden">
                <div className="relative inset-0 w-full h-full">
                    <Image
                        src="/images/destinations_hero.jpg"
                        alt="Destinations Hero Image"
                        fill
                        className="object-cover scale-100"
                        style={{ objectPosition: 'center 25%' }}
                        quality={100}
                        priority
                    />
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/25 to-transparent h-[40vh] ml-4 mt-5 rounded-xl" />

                <div className="absolute inset-0 z-10 flex items-center pl-12">
                    <div className="max-w-[45%] pl-8 pb-10">
                        <h1 className="text-6xl font-semibold leading-tight text-white">
                            Destinations
                        </h1>
                        <hr className="border-white mb-4 ml-1 w-[22vw] border-t-3"/>
                        <p className="text-2xl text-white font-semibold">
                            Explore The Beauty, Plan The Journey
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-16 py-12">
                <div className="flex flex-wrap gap-4 mb-8">
                    <select
                        name="type"
                        value={filters.type}
                        onChange={handleFilterChange}
                        className="px-4 py-2 pr-8 rounded-lg border border-gray-300 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[right_0.5rem_center]"
                    >
                        <option value="">Destination Type</option>
                        <option value="Historical">Historical</option>
                        <option value="Beach">Beach</option>
                    </select>

                    <select
                        name="province"
                        value={filters.province}
                        onChange={handleFilterChange}
                        className="px-4 py-2 pr-8 rounded-lg border border-gray-300 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[right_0.5rem_center]"
                    >
                        <option value="">Province</option>
                        <option value="Central">Central</option>
                        <option value="Southern">Southern</option>
                    </select>

                    <select
                        name="activity"
                        value={filters.activity}
                        onChange={handleFilterChange}
                        className="px-4 py-2 pr-8 rounded-lg border border-gray-300 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[right_0.5rem_center]"
                    >
                        <option value="">Activities</option>
                        <option value="Attraction">Attraction</option>
                        <option value="Hiking">Hiking</option>
                    </select>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <p>Loading destinations...</p>
                    </div>
                ) : destinations.length === 0 ? (
                    <div className="flex justify-center py-12">
                        <p>No destinations found matching your filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {destinations.map((destination) => (
                            <DestinationCard
                                key={destination.id}
                                id={destination.id}
                                name={destination.name}
                                image={destination.image}
                                type={destination.type}
                                onAddToItinerary={handleAddToItinerary}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}