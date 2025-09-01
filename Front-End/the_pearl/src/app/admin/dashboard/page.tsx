"use client";

import { FiMap, FiBriefcase, FiUsers, FiUserCheck } from 'react-icons/fi';
import React, { useState, useEffect } from 'react';

type DashboardCounts = {
    total_destinations: number;
    completed_trips_count: number;
    tourists_count: number;
    tour_guides_count: number;
};

const StatCard = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
        <div className="text-violet-500 text-4xl mb-3">
            {icon}
        </div>
        <h3 className="text-lg text-gray-600 mb-2">{title}</h3>
        <p className="text-4xl font-bold text-violet-600">{value}</p>
    </div>
);

const topDestinations = [
    "Ella Rock",
    "Galle Fort",
    "Mirissa Beach",
    "Horton Plains",
    "Arugam Bay",
    "Sigiriya Rock Fortress",
    "Temple Of Tooth",
    "Rawana Falls",
    "Hikkaduwa Beach",
    "Anuradhpura"
];

export default function AdminDashboardPage() {
    const [counts, setCounts] = useState<DashboardCounts | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const response = await fetch('http://localhost:8003/api/dashboard/counts');
                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard data.');
                }
                const data: DashboardCounts = await response.json();
                setCounts(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, []);

    if (loading) {
        return <div className="p-8">Loading dashboard data...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div>
            <h1 className="text-4xl font-bold text-violet-600 mb-2">Welcome</h1>
            <hr className="border-violet-700 border-t-2 w-full mb-10 mt-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard title="Total Destinations" value={String(counts?.total_destinations || 0)} icon={<FiMap />} />
                <StatCard title="Total Trips Completed" value={String(counts?.completed_trips_count || 0)} icon={<FiBriefcase />} />
                <StatCard title="Number Of Users" value={String(counts?.tourists_count || 0)} icon={<FiUsers />} />
                <StatCard title="Tour Guides" value={String(counts?.tour_guides_count || 0)} icon={<FiUserCheck />} />
            </div>

            <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Top Destinations</h2>
                <hr className="border-violet-300 border-t-2 w-32 mb-6" />
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-gray-700 text-lg">
                        {topDestinations.map((dest, index) => (
                            <p key={index}>{`${index + 1}. ${dest}`}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}