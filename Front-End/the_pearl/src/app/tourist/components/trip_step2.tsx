"use client";

import { TripFormData } from '@/app/tourist/trips/page';
import toast from 'react-hot-toast';
import { ChangeEvent } from 'react';

type StepProps = {
    nextStep: () => void;
    prevStep: () => void;
    formData: TripFormData;
    setFormData: React.Dispatch<React.SetStateAction<TripFormData>>;
};

const FormInput = ({ label, name, value, onChange, type = 'text', required = false }: { label: string, name: string, value: string | number, onChange: (e: ChangeEvent<HTMLInputElement>) => void, type?: string, required?: boolean }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
        />
    </div>
);

export default function Step2_FillInformation({ nextStep, prevStep, formData, setFormData }: StepProps) {

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProceed = () => {
        const requiredFields: (keyof TripFormData)[] = [
            'email', 'contact', 'country',
            'passportNumber', 'address', 'numAdults',
            'numChildren', 'startDate', 'numDays', 'tripPayment'
        ];

        const emptyField = requiredFields.find(field => {
            const value = formData[field];
            return value == null || String(value).trim() === '';
        });

        if (emptyField) {
            toast.error('Please fill in all required fields.');
            return;
        }

        nextStep();
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border border-gray-200 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-violet-600 mt-4">We Need Your Information</h2>
            <p className="mb-8 text-gray-600">Please ensure that all required information is filled out completely and accurately. Double-check every detail before submission to avoid any delays or issues.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput label="Email" name="email" value={formData.email} onChange={handleChange} required/>
                <FormInput label="Contact" name="contact" value={formData.contact} onChange={handleChange} required/>
                <FormInput label="Country" name="country" value={formData.country} onChange={handleChange} required/>
                <FormInput label="Passport Number" name="passportNumber" value={formData.passportNumber} onChange={handleChange} required/>
                <div className="md:col-span-2">
                    <FormInput label="Address" name="address" value={formData.address} onChange={handleChange} required/>
                </div>
                <FormInput label="Number of Adults" name="numAdults" value={formData.numAdults} onChange={handleChange} type="number" required/>
                <FormInput label="Number of Children" name="numChildren" value={formData.numChildren} onChange={handleChange} type="number" required/>
                <FormInput label="Starting Date" name="startDate" value={formData.startDate} onChange={handleChange} type="date" required/>
                <FormInput label="Number of Days" name="numDays" value={formData.numDays} onChange={handleChange} type="number" required/>
                <FormInput label="Budget" name="tripPayment" value={formData.tripPayment} onChange={handleChange} type="number" required/>
            </div>

            <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-800">Destinations Summary</h3>
                <ul className="list-disc list-inside mt-2 text-gray-600 columns-2 md:columns-4">
                    {formData.destinations.map(dest => <li key={dest.id}>{dest.name}</li>)}
                </ul>
            </div>

            <div className="mt-8 flex justify-between">
                <button onClick={prevStep} className="px-8 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors">Back</button>
                <button onClick={handleProceed} className="px-8 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-medium transition-colors">Proceed</button>
            </div>
        </div>
    );
}

