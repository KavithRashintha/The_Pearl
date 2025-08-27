"use client";

import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { TourGuide } from '@/app/admin/tour-guides/page';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: any) => Promise<void>;
    mode: 'add' | 'edit';
    initialData?: TourGuide | null;
};

const defaultFormState = {
    name: '',
    hometown: '',
    address: '',
    nic: '',
    email: '',
    licenseNumber: '',
    telephone: '',
    password: '',
    reviewCount: 0,
};

export default function AddEditGuideModal({ isOpen, onClose, onSubmit, mode, initialData }: ModalProps) {
    const [formData, setFormData] = useState(defaultFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormData({
                name: initialData.name,
                hometown: initialData.address.split(',')[0],
                address: initialData.address,
                nic: initialData.nic,
                email: initialData.email || '',
                licenseNumber: initialData.licenseNumber,
                telephone: initialData.telephone,
                password: '',
                reviewCount: initialData.reviewCount,
            });
        } else {
            setFormData(defaultFormState);
        }
    }, [isOpen, mode, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await onSubmit(formData);
        setIsSubmitting(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[95vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-2xl font-bold text-violet-600">
                        {mode === 'add' ? 'Add New Tour Guide' : 'Update Tour Guide'}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                        <FiX size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Person Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="hometown" className="block text-sm font-medium text-gray-700 mb-1">Home Town</label>
                            <input type="text" name="hometown" id="hometown" value={formData.hometown} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Person Address</label>
                        <textarea name="address" id="address" value={formData.address} onChange={handleChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                            <label htmlFor="nic" className="block text-sm font-medium text-gray-700 mb-1">Person NIC</label>
                            <input type="text" name="nic" id="nic" value={formData.nic} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Person Email</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">Person Licence No</label>
                            <input type="text" name="licenseNumber" id="licenseNumber" value={formData.licenseNumber} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">Person Contact</label>
                            <input type="text" name="telephone" id="telephone" value={formData.telephone} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                        </div>
                    </div>
                    {mode === 'add' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end items-center gap-4 mt-8 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-medium disabled:bg-gray-400">
                            {isSubmitting ? 'Saving...' : 'Save Destination'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}