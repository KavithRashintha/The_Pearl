"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiEdit, FiSave, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

type TourGuideProfile = {
    name: string;
    email: string;
    profilePicture: string;
    tour_guide: {
        telephone: string;
        address: string;
        nic: string;
        licenseNumber: string;
    };
};

const DetailField = ({label, value, isEditing = false, name, onChange}: {
    label: string,
    value: string | undefined,
    isEditing?: boolean,
    name?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
            {isEditing ? (
                <input
                    type="text"
                    name={name}
                    id={name}
                    value={value || ''}
                    onChange={onChange}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
            ) : (
                <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 min-h-[46px]">
                    {value}
                </div>
            )}
        </div>
    );
};

export default function TourGuideProfilePage() {
    const [profile, setProfile] = useState<TourGuideProfile | null>(null);
    const [editableProfile, setEditableProfile] = useState<TourGuideProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const tourGuideUserId = 2;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8003/api/tour-guide/${tourGuideUserId}/profile`);
                if (!response.ok) {
                    throw new Error('Failed to fetch tour guide profile.');
                }
                const data: TourGuideProfile = await response.json();
                setProfile(data);
                setEditableProfile(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [tourGuideUserId]);

    const handleEdit = () => {
        setEditableProfile(profile);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (!editableProfile) return;

        const requiredFields = {
            Name: editableProfile.name,
            Email: editableProfile.email,
            Contact: editableProfile.tour_guide.telephone,
            Address: editableProfile.tour_guide.address,
            NIC: editableProfile.tour_guide.nic,
            'Licence No': editableProfile.tour_guide.licenseNumber,
        };

        for (const [field, value] of Object.entries(requiredFields)) {
            if (!value || String(value).trim() === '') {
                toast.error(`Please fill in the ${field} field.`);
                return;
            }
        }

        setIsSaving(true);

        // 2. Map data to the API payload structure
        const payload = {
            name: editableProfile.name,
            email: editableProfile.email,
            telephone: editableProfile.tour_guide.telephone,
            address: editableProfile.tour_guide.address,
            nic: editableProfile.tour_guide.nic,
            licenseNumber: editableProfile.tour_guide.licenseNumber,
        };

        try {
            const response = await fetch(`http://127.0.0.1:8003/api/tour-guide/${tourGuideUserId}/profile`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to update profile.');
            }

            // 4. Handle success
            setProfile(editableProfile);
            setIsEditing(false);
            toast.success('Profile updated successfully!');

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (!editableProfile) return;

        if (['telephone', 'address', 'nic', 'licenseNumber'].includes(name)) {
            setEditableProfile({
                ...editableProfile,
                tour_guide: { ...editableProfile.tour_guide, [name]: value },
            });
        } else {
            setEditableProfile({ ...editableProfile, [name]: value });
        }
    };

    if (loading) {
        return <main className="p-8 md:p-12">Loading profile...</main>;
    }

    if (error) {
        return <main className="p-8 md:p-12 text-red-500">Error: {error}</main>;
    }

    if (!profile || !editableProfile) {
        return <main className="p-8 md:p-12">Could not load profile data.</main>;
    }

    return (
        <main className="p-8 md:p-12 bg-white flex-1 pl-8">
            <section className="flex items-center gap-6 mb-12 mt-12 pl-8">
                <div className="relative w-48 h-48 rounded-full overflow-hidden">
                    <Image
                        src={profile.profilePicture || "/images/profile-placeholder.jpg"}
                        alt="Tour Guide Profile Picture"
                        layout="fill"
                        objectFit="cover"
                        priority
                    />
                </div>
                <div className = "flex-col ml-8">
                    <div className = 'mb-4'>
                        {isEditing ? (
                            <input
                                type="text" name="name" value={editableProfile.name} onChange={handleChange}
                                className="text-5xl font-bold text-gray-800 border-b-2 focus:outline-none focus:border-violet-500 tracking-wider"
                            />
                        ) : (
                            <h1 className="text-5xl font-bold text-gray-800 tracking-wider">
                                <span className="text-violet-600">{profile.name} - <span className= "font-semibold">{profile.tour_guide.address.split(',')[0]}</span></span>
                            </h1>
                        )}
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                        {isEditing ? (
                            <>
                                <button onClick={handleSave} disabled={isSaving} className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center gap-2 disabled:bg-gray-400">
                                    <FiSave size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button onClick={handleCancel} disabled={isSaving} className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors flex items-center gap-2">
                                    <FiXCircle size={16} /> Cancel
                                </button>
                            </>
                        ) : (
                            <button onClick={handleEdit} className="px-5 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-medium transition-colors flex items-center gap-2">
                                <FiEdit size={16} /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </section>

            <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <DetailField label="Email" value={isEditing ? editableProfile.email : profile.email} isEditing={isEditing} name="email" onChange={handleChange} />
                    <DetailField label="Contact" value={isEditing ? editableProfile.tour_guide.telephone : profile.tour_guide.telephone} isEditing={isEditing} name="telephone" onChange={handleChange} />
                    <div className="md:col-span-2">
                        <DetailField label="Address" value={isEditing ? editableProfile.tour_guide.address : profile.tour_guide.address} isEditing={isEditing} name="address" onChange={handleChange} />
                    </div>
                    <DetailField label="NIC" value={isEditing ? editableProfile.tour_guide.nic : profile.tour_guide.nic} isEditing={isEditing} name="nic" onChange={handleChange} />
                    <DetailField label="Licence No" value={isEditing ? editableProfile.tour_guide.licenseNumber : profile.tour_guide.licenseNumber} isEditing={isEditing} name="licenseNumber" onChange={handleChange} />
                </div>
            </section>
        </main>
    );
}