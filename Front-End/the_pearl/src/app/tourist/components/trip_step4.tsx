import {useEffect, useState} from 'react';
import { TripFormData } from '@/app/tourist/trips/page';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

type StepProps = {
    nextStep: () => void;
    prevStep: () => void;
    formData: TripFormData;
};

type DecodedToken = {
    sub: string;
    role: string;
    userId: number;
    userName: string;
    exp: number;
};

const DetailItem = ({ label, value }: { label: string, value: string | number | undefined | null }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-800">{value || 'N/A'}</p>
    </div>
);

export default function Step4_ConfirmTrip({ nextStep, prevStep, formData }: StepProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [touristId, setTouristId] = useState<number | null>(null);
    const [accessToken, setAccessToken] = useState();

    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                setAccessToken(token);
                setTouristId(decoded.userId);
            } catch (e) {
                console.error('Invalid token');
            }
        }
    }, []);

    const handleConfirm = async () => {
        if (!formData.selectedGuide) {
            toast.error("A tour guide must be selected.");
            return;
        }
        setIsSubmitting(true);
        const payload = {
            touristId: touristId,
            touristPassportNumber: formData.passportNumber,
            touristCountry: formData.country,
            tourGuideId: formData.selectedGuide.id,
            destinations: formData.destinations.map(dest => dest.name),
            numberOfAdults: Number(formData.numAdults),
            numberOfChildren: Number(formData.numChildren),
            startDate: formData.startDate,
            numberOfDays: Number(formData.numDays),
            tripStatus: "Pending",
            tripPayment: formData.tripPayment,
            paymentStatus: "Pending"
        };
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            };

            const response = await fetch('http://127.0.0.1:8003/api/trips/add', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error('Failed to save the trip. Please try again.');
            }
            const result = await response.json();
            console.log("Trip saved successfully:", result);
            toast.success('Your trip request has been sent successfully!');

            nextStep();

        } catch (error: any) {
            console.error("Submission Error:", error);
            toast.error(error.message || 'An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border border-gray-200 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-12 mt-4 text-center text-violet-600">Confirm Your Dream Trip</h2>
            <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <DetailItem label="Email" value={formData.email} />
                    <DetailItem label="Contact" value={formData.contact} />
                    <DetailItem label="Country" value={formData.country} />
                    <DetailItem label="Passport Number" value={formData.passportNumber} />
                    <DetailItem label="Number Of Adults" value={formData.numAdults} />
                    <DetailItem label="Number Of Children" value={formData.numChildren} />
                    <DetailItem label="Starting Date" value={formData.startDate} />
                    <DetailItem label="Number Of Days" value={formData.numDays} />
                    <div className="col-span-1">
                        <DetailItem label="Address" value={formData.address} />
                    </div>
                    <DetailItem label="Budget" value={formData.tripPayment} />
                </div>
                <div className="pt-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-800">Selected Destinations</h3>
                    <ul className="list-disc list-inside mt-2 text-gray-600 columns-2 md:columns-4">
                        {formData.destinations.map(dest => <li key={dest.id}>{dest.name}</li>)}
                    </ul>
                </div>
                {formData.selectedGuide && (
                    <div className="pt-6 border-t">
                        <h3 className="text-lg font-semibold text-gray-800">Selected Guide</h3>
                        <p className="font-medium text-gray-800">{formData.selectedGuide.name}</p>
                        <p className="text-sm text-gray-500">{formData.selectedGuide.address}</p>
                    </div>
                )}
            </div>
            <div className="mt-8 flex justify-between">
                <button
                    onClick={prevStep}
                    className="px-8 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                    disabled={isSubmitting}
                >
                    Back
                </button>
                <button
                    onClick={handleConfirm}
                    className="px-8 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-medium transition-colors disabled:bg-gray-400"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Confirming...' : 'Confirm'}
                </button>
            </div>
        </div>
    );
}