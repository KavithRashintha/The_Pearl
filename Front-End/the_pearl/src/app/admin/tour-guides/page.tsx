"use client";

import { useState, useEffect, useMemo } from 'react';
import { FiPlus, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import AddEditGuideModal from '@/app/admin/(components)/add_edit_tour_guide_model';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import emailjs from '@emailjs/browser';

export type TourGuide = {
    id: number;
    userId: number;
    name: string;
    email: string | null;
    nic: string;
    telephone: string;
    address: string;
    licenseNumber: string;
    reviewCount: number;
    profilePicture: string | null;
};

type DecodedToken = {
    sub: string;
    role: string;
    userId: number;
    userName: string;
    exp: number;
};

export default function TourGuidesPage() {
    const [tourGuides, setTourGuides] = useState<TourGuide[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedGuide, setSelectedGuide] = useState<TourGuide | null>(null);
    const [accessToken, setAccessToken] = useState<string | undefined>();

    const itemsPerPage = 8;

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (token) {
            setAccessToken(token);
        }
        fetchTourGuides();
    }, []);

    const fetchTourGuides = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8003/api/users/tour-guides');
            if (!response.ok) throw new Error('Failed to fetch tour guides.');
            const data: TourGuide[] = await response.json();
            setTourGuides(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setModalMode('add');
        setSelectedGuide(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (guide: TourGuide) => {
        setModalMode('edit');
        setSelectedGuide(guide);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedGuide(null);
    };

    const sendRegistrationEmail = async (formData: any) => {
        const templateParams = {
            guide_name: formData.name,
            guide_email: formData.email,
            password: formData.password,
        };

        await emailjs.send(
            'service_yplt11j',
            'template_ol7qdyj',
            templateParams,
            '9vQugrlxpfHpeQLs2'
        );
    };

    const handleSubmitGuide = async (formData: any) => {
        let url = '';
        let method = '';
        let payload = {};

        if (modalMode === 'add') {
            url = 'http://localhost:8003/api/auth/register/guide';
            method = 'POST';
            payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                nic: formData.nic,
                telephone: formData.telephone,
                address: formData.address,
                licenseNumber: formData.licenseNumber,
                reviewCount: Number(formData.reviewCount)
            };
        } else {
            url = `http://localhost:8003/api/tour-guide/${selectedGuide?.userId}/profile`;
            method = 'PATCH';
            payload = {
                name: formData.name,
                email: formData.email,
                nic: formData.nic,
                telephone: formData.telephone,
                address: formData.address,
                licenseNumber: formData.licenseNumber
            };
        }

        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            };

            const response = await fetch(url, {
                method: method,
                headers: headers,
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.detail?.[0]?.msg || `Failed to ${modalMode} tour guide.`;
                throw new Error(errorMessage);
            }

            if (modalMode === 'add') {
                await toast.promise(
                    sendRegistrationEmail(formData),
                    {
                        loading: 'Sending registration email...',
                        success: <b>Registration email sent!</b>,
                        error: <b>Could not send email.</b>,
                    }
                );
            }

            toast.success(`Tour guide ${modalMode === 'add' ? 'added' : 'updated'} successfully!`);
            handleCloseModal();
            fetchTourGuides();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (guideId: number, guideName: string) => {
        if (window.confirm(`Are you sure you want to delete ${guideName}?`)) {
            toast.promise(
                fetch(`http://localhost:8003/api/tour-guide/delete-tour-guide/${guideId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                }).then(response => {
                    if (!response.ok) throw new Error('Deletion failed.');
                }),
                {
                    loading: 'Deleting...',
                    success: () => {
                        fetchTourGuides();
                        return 'Tour guide deleted!';
                    },
                    error: 'Could not delete tour guide.',
                }
            );
        }
    };

    const paginatedGuides = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return tourGuides.slice(startIndex, startIndex + itemsPerPage);
    }, [tourGuides, currentPage]);

    const totalPages = Math.ceil(tourGuides.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const renderContent = () => {
        if (loading) return <p className="text-gray-500">Loading tour guides...</p>;
        if (error) return <p className="text-red-500">Error: {error}</p>;
        if (tourGuides.length === 0) {
            return <div className="bg-white rounded-lg p-8 text-center text-gray-500"><p>No tour guides found.</p></div>;
        }
        return (
            <div className="space-y-3">
                {paginatedGuides.map((guide) => (
                    <div key={guide.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 grid grid-cols-5 items-center">
                        <p className="font-semibold text-gray-800 col-span-2 pl-4">{guide.name} - {guide.address.split(',')[0]}</p>
                        <p className="text-gray-600">{guide.nic}</p>
                        <p className="text-gray-600">{guide.telephone}</p>
                        <div className="flex items-center gap-4 justify-self-end">
                            <button onClick={() => handleOpenEditModal(guide)} className="text-violet-600 font-medium hover:underline">
                                View More
                            </button>
                            <button onClick={() => handleDelete(guide.id, guide.name)} className="text-violet-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50">
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
                <h1 className="text-4xl font-bold text-violet-800 mb-2">Tour Guides</h1>
                <hr className="border-violet-700 border-t-2 w-full mb-10 mt-4" />
                <div className="flex justify-end">
                    <button onClick={handleOpenAddModal} className="px-5 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-medium transition-colors flex items-center gap-2">
                        <FiPlus />
                        Add Tour Guide
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

            <AddEditGuideModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitGuide}
                mode={modalMode}
                initialData={selectedGuide}
            />
        </div>
    );
}

