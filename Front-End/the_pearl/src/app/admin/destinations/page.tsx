"use client";

import { useState, useEffect, useMemo } from 'react';
import { FiPlus, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import AddEditDestinationModal from '@/app/admin/components/add_edit_destination_model';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export type Destination = {
    id: number;
    name: string;
    details: string[];
    type: string;
    activities: string[];
    province: string;
    district: string;
    climate: string;
    image: string;
};

type DecodedToken = {
    sub: string;
    role: string;
    userId: number;
    userName: string;
    exp: number;
};


export default function DestinationsPage() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
    const [accessToken, setAccessToken] = useState()

    const itemsPerPage = 8;

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                setAccessToken(token);
            } catch (e) {
                console.error('Invalid token');
            }
        }
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8003/api/destinations/');
            if (!response.ok) throw new Error('Failed to fetch destinations.');
            const data: Destination[] = await response.json();
            setDestinations(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setModalMode('add');
        setSelectedDestination(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (destination: Destination) => {
        setModalMode('edit');
        setSelectedDestination(destination);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDestination(null);
    };

    const handleSubmitDestination = async (formData: Omit<Destination, 'id'>) => {
        const url = modalMode === 'add'
            ? 'http://localhost:8003/api/destinations/add'
            : `http://localhost:8003/api/destinations/update_destination/${selectedDestination?.id}`;

        const method = modalMode === 'add' ? 'POST' : 'PATCH';

        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            };

            const response = await fetch(url, {
                method: method,
                headers: headers,
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error(`Failed to ${modalMode} destination.`);
            }
            toast.success(`Destination ${modalMode === 'add' ? 'added' : 'updated'} successfully!`);
            handleCloseModal();
            fetchDestinations();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (destinationId: number, destinationName: string) => {
        if (window.confirm(`Are you sure you want to delete ${destinationName}?`)) {
            toast.promise(
                fetch(`http://localhost:8003/api/destinations/delete_destination/${destinationId}`, {
                    method: 'DELETE',
                }).then(response => {
                    if (!response.ok) throw new Error('Deletion failed.');
                    return response.json();
                }),
                {
                    loading: 'Deleting...',
                    success: () => {
                        fetchDestinations();
                        return 'Destination deleted!';
                    },
                    error: 'Could not delete destination.',
                }
            );
        }
    };

    const paginatedDestinations = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return destinations.slice(startIndex, startIndex + itemsPerPage);
    }, [destinations, currentPage]);

    const totalPages = Math.ceil(destinations.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const renderContent = () => {
        if (loading) return <p className="text-gray-500">Loading destinations...</p>;
        if (error) return <p className="text-red-500">Error: {error}</p>;
        if (destinations.length === 0) {
            return <div className="bg-white rounded-lg p-8 text-center text-gray-500"><p>No destinations found.</p></div>;
        }
        return (
            <div className="space-y-3">
                {paginatedDestinations.map((dest) => (
                    <div key={dest.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center">
                        <p className="flex-1 font-semibold text-gray-800">{dest.name}</p>
                        <p className="flex-1 text-gray-600">{dest.type}</p>
                        <p className="flex-1 text-gray-600">{dest.province}</p>
                        <div className="flex items-center gap-4">
                            <button onClick={() => handleOpenEditModal(dest)} className="text-violet-600 font-medium hover:underline">
                                View More
                            </button>
                            <button onClick={() => handleDelete(dest.id, dest.name)} className="text-violet-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50">
                                <FiTrash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            <div>
                <h1 className="text-4xl font-bold text-violet-600 mb-2">Destinations</h1>
                <hr className="border-violet-700 border-t-2 w-full mb-10 mt-4" />
                <div className="flex justify-end">
                    <button onClick={handleOpenAddModal} className="px-5 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-medium transition-colors flex items-center gap-2">
                        <FiPlus />
                        Add Destination
                    </button>
                </div>
            </div>

            <div className="mt-8">
                {renderContent()}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 mx-1 rounded-md disabled:opacity-50 hover:bg-gray-200">
                        <FiChevronLeft />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 mx-1 rounded-md ${currentPage === page ? 'bg-violet-600 text-white' : 'bg-white hover:bg-gray-200'}`}
                        >
                            {page}
                        </button>
                    ))}
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 mx-1 rounded-md disabled:opacity-50 hover:bg-gray-200">
                        <FiChevronRight />
                    </button>
                </div>
            )}

            <AddEditDestinationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitDestination}
                mode={modalMode}
                initialData={selectedDestination}
            />
        </div>
    );
}