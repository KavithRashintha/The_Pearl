import { useState, useEffect } from 'react';
import { TripFormData, TourGuide } from '@/app/tourist/trips/page';
import { FiMessageSquare } from 'react-icons/fi';

type StepProps = {
    nextStep: () => void;
    prevStep: () => void;
    formData: TripFormData;
    setFormData: React.Dispatch<React.SetStateAction<TripFormData>>;
};

const StarRating = ({ rating }: { rating: number }) => {
    const numericRating = typeof rating === 'number' ? rating : 0;

    const totalStars = 5;
    const fullStars = Math.floor(numericRating);
    const halfStar = numericRating % 1 !== 0;
    const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`} className="text-yellow-400">★</span>)}
            {halfStar && <span className="text-yellow-400">★</span>}
            {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="text-gray-300">★</span>)}
        </div>
    );
};

export default function Step3_SelectGuide({ nextStep, prevStep, formData, setFormData }: StepProps) {
    const [guides, setGuides] = useState<TourGuide[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const response = await fetch('http://localhost:8001/users/tour-guides');
                if (!response.ok) {
                    throw new Error(`Failed to fetch tour guides: ${response.statusText}`);
                }
                const data: TourGuide[] = await response.json();
                setGuides(data);
            } catch (err: any) {
                setError(err.message);
                console.error("Error fetching tour guides:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGuides();
    }, []);

    const handleSelectGuide = (guide: TourGuide) => {
        setFormData(prev => ({ ...prev, selectedGuide: guide }));
        nextStep();
    };

    const renderContent = () => {
        if (loading) {
            return <div className="text-center p-10">Loading tour guides...</div>;
        }

        if (error) {
            return <div className="text-center p-10 text-red-500">Error: {error}</div>;
        }

        if (guides.length === 0) {
            return <div className="text-center p-10">No tour guides available at the moment.</div>;
        }

        return (
            <div className="space-y-4">
                {guides.map(guide => (
                    <div key={guide.id} className="flex flex-col md:flex-row items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex-1 w-full md:w-auto mb-4 md:mb-0">
                            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                <p className="font-medium text-lg text-gray-800 w-60">{guide.name}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span className="w-60">{guide.address}</span>
                                    <span className="w-40">{guide.telephone}</span>
                                    <span className="w-24">{guide.reviewCount} Reviews</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-16 w-full md:w-auto justify-between">
                            <StarRating rating={guide.reviewCount}/>
                            <div className="flex items-center gap-6">
                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"><FiMessageSquare size={20} /></button>
                                <button
                                    onClick={() => handleSelectGuide(guide)}
                                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${formData.selectedGuide?.id === guide.id ? 'bg-green-500 text-white' : 'bg-violet-100 text-violet-700 hover:bg-violet-200'}`}
                                >
                                    {formData.selectedGuide?.id === guide.id ? 'Selected' : 'Select'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border border-gray-200 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-violet-600 mb-4 mt-6">Select Your Travel Guide</h2>
            <p className="mb-8 text-gray-600">We rely on having the correct and complete information to proceed further. Please select a guide for your journey.</p>

            {renderContent()}

            <div className="mt-8 flex justify-start">
                <button onClick={prevStep} className="px-8 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors">Back</button>
            </div>
        </div>
    );
}