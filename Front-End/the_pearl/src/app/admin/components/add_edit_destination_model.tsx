"use client";

import { useState, useEffect } from 'react';
import { FiX, FiUploadCloud } from 'react-icons/fi';
import { Destination } from '@/app/admin/destinations/page';
import Image from 'next/image';
import { toast } from 'react-toastify'; // NEW: For better feedback

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: Omit<Destination, 'id'>) => Promise<void>;
    mode: 'add' | 'edit';
    initialData?: Destination | null;
};

type FormState = Omit<Destination, 'id' | 'details'> & {
    details: string;
};

const destinationTypes = ["Historical", "Beach", "Attraction", "Cultural"];
const provinces = ["Central", "Eastern", "Southern", "Western", "Northern"];
const districts = ["Galle", "Matale", "Ampara", "Nuwara Eliya"];
const climates = ["Dry", "Wet", "Intermediate"];
const allActivities = ["Hiking", "Surfing", "Photography", "Relaxing", "Cycling", "Diving", "Safari", "Yoga & Meditation", "Adventure", "Cultural"];

const defaultFormState: FormState = {
    name: '',
    type: '',
    details: '',
    activities: [],
    province: '',
    district: '',
    climate: '',
    image: '',
};

export default function AddEditDestinationModal({ isOpen, onClose, onSubmit, mode, initialData }: ModalProps) {
    const [formData, setFormData] = useState<FormState>(defaultFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormData({
                name: initialData.name,
                type: initialData.type,
                details: initialData.details.join('\n'),
                activities: initialData.activities,
                province: initialData.province,
                district: initialData.district,
                climate: initialData.climate,
                image: initialData.image,
            });
            setImagePreview(initialData.image);
            setImageFile(null);
        } else {
            setFormData(defaultFormState);
            setImagePreview(null);
            setImageFile(null);
        }
    }, [isOpen, mode, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCheckboxChange = (activity: string) => {
        setFormData(prev => {
            const newActivities = prev.activities.includes(activity)
                ? prev.activities.filter(a => a !== activity)
                : [...prev.activities, activity];
            return { ...prev, activities: newActivities };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        let finalImageUrl = formData.image;

        if (imageFile) {
            try {
                const presignResponse = await fetch('http://localhost:8003/api/v1/s3/generate-upload-url', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        file_name: imageFile.name,
                        file_type: imageFile.type,
                    }),
                });

                if (!presignResponse.ok) throw new Error('Failed to get upload URL.');
                const { uploadUrl, publicUrl } = await presignResponse.json();

                const uploadResponse = await fetch(uploadUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': imageFile.type },
                    body: imageFile,
                });

                if (!uploadResponse.ok) throw new Error('Image upload to S3 failed.');

                finalImageUrl = publicUrl;

            } catch (error: any) {
                toast.error(error.message);
                setIsSubmitting(false);
                return;
            }
        }

        const submissionData = {
            ...formData,
            image: finalImageUrl,
            details: formData.details.split('\n').filter(p => p.trim() !== ''),
        };

        await onSubmit(submissionData);
        setIsSubmitting(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-2xl font-bold text-violet-600">
                        {mode === 'add' ? 'Add New Destination' : 'Update Destination'}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                        <FiX size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Destination Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Destination Type</label>
                            <select name="type" id="type" value={formData.type} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required>
                                <option value="">Select the Type</option>
                                {destinationTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">Destination Information</label>
                        <textarea name="details" id="details" value={formData.details} onChange={handleChange} rows={5} className="w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Destination Image</label>
                        <div className="mt-2 flex items-center gap-4">
                            {imagePreview && (
                                <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image src={imagePreview} alt="Image Preview" layout="fill" objectFit="cover" />
                                </div>
                            )}
                            <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-violet-600 hover:text-violet-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-violet-500 border border-gray-300 p-2 text-center w-full">
                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-violet-400">
                                    <FiUploadCloud className="w-8 h-8 text-gray-400" />
                                    <span className="mt-2 block text-sm">Click to upload an image</span>
                                    <input id="image-upload" name="image-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Activities</label>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                            {allActivities.map(activity => (
                                <label key={activity} className="flex items-center gap-2">
                                    <input type="checkbox" checked={formData.activities.includes(activity)} onChange={() => handleCheckboxChange(activity)} className="h-4 w-4 rounded text-violet-600 focus:ring-violet-500" />
                                    <span className="text-sm">{activity}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                            <select name="province" id="province" value={formData.province} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required>
                                <option value="">Select the Province</option>
                                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">District</label>
                            <select name="district" id="district" value={formData.district} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required>
                                <option value="">Select the District</option>
                                {districts.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="climate" className="block text-sm font-medium text-gray-700 mb-1">Climate</label>
                            <select name="climate" id="climate" value={formData.climate} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required>
                                <option value="">Select the Climate</option>
                                {climates.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end items-center gap-4 mt-8 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-medium disabled:bg-gray-400">
                            {isSubmitting ? 'Saving...' : (mode === 'add' ? 'Save Destination' : 'Update Destination')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}