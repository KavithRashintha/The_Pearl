"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiMessageSquare, FiSave, FiXCircle, FiCamera } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
    sub: string;
    role: string;
    userId: number;
    userName: string;
    exp: number;
};

type TouristProfile = {
    name: string;
    email: string;
    role: string;
    id: number;
    profilePicture: string;
    tourist: {
        passportNumber: string;
        country: string;
        address: string;
        birthDay: string;
        id: number;
        userId: number;
    };
};

type Trip = {
    id: number;
    startDate: string;
    endDate: string;
    tourGuideName: string;
    destinations: string[];
};

const calculateAge = (birthDateString: string): number | null => {
    if (!birthDateString) return null;
    const birthDate = new Date(`${birthDateString}T00:00:00`);
    if (isNaN(birthDate.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const DetailField = ({label, value, isEditing = false, name, onChange}: {
    label: string,
    value: string | number | undefined | null,
    isEditing?: boolean,
    name?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-500">{label}</label>
            {isEditing ? (
                <input
                    type={name === 'birthDay' ? 'date' : 'text'}
                    name={name}
                    id={name}
                    value={value || ''}
                    onChange={onChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                />
            ) : (
                <div className="mt-1 p-2 w-full bg-gray-100 border border-gray-200 rounded-md min-h-[42px]">
                    {value || 'N/A'}
                </div>
            )}
        </div>
    );
};


export default function MyAccountPage() {
    const [profile, setProfile] = useState<TouristProfile | null>(null);
    const [editableProfile, setEditableProfile] = useState<TouristProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [trips, setTrips] = useState<Trip[]>([]);
    const [tripsLoading, setTripsLoading] = useState(true);
    const [tripsError, setTripsError] = useState<string | null>(null);
    const [touristId, setTouristId] = useState<number | null>(null);
    const [accessToken, setAccessToken] = useState<string | undefined>();

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

    useEffect(() => {
        if (touristId == null) {
            setLoading(false);
            setTripsLoading(false);
            return;
        }
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8003/api/tourists/${touristId}/profile`);
                if (!response.ok) {
                    throw new Error('Failed to fetch profile data.');
                }
                const data: TouristProfile = await response.json();
                setProfile(data);
                setEditableProfile(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchTrips = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8003/api/trips/trip-by-tourist/${touristId}/completed`);
                if (!response.ok) {
                    throw new Error('Failed to fetch trips.');
                }
                const data: Trip[] = await response.json();
                setTrips(data);
            } catch (err: any) {
                setTripsError(err.message);
            } finally {
                setTripsLoading(false);
            }
        };

        fetchProfile();
        fetchTrips();
    }, [touristId]);

    const handleEdit = () => {
        setEditableProfile(profile);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSave = async () => {
        if (!editableProfile) return;

        const requiredFields = {
            name: editableProfile.name,
            email: editableProfile.email,
            passportNumber: editableProfile.tourist.passportNumber,
            country: editableProfile.tourist.country,
            address: editableProfile.tourist.address,
            birthDay: editableProfile.tourist.birthDay,
        };

        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value || String(value).trim() === '') {
                toast.error(`Please fill in the ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
                return;
            }
        }

        setIsSaving(true);
        let finalImageUrl = editableProfile.profilePicture;

        if (imageFile) {
            try {
                const presignResponse = await fetch('http://127.0.0.1:8003/api/v1/s3/generate-upload-url', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ file_name: imageFile.name, file_type: imageFile.type }),
                });
                if (!presignResponse.ok) throw new Error('Could not get upload URL.');
                const { uploadUrl, publicUrl } = await presignResponse.json();

                const uploadResponse = await fetch(uploadUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': imageFile.type },
                    body: imageFile,
                });
                if (!uploadResponse.ok) throw new Error('Image upload failed.');
                finalImageUrl = publicUrl;
            } catch (error: any) {
                toast.error(error.message);
                setIsSaving(false);
                return;
            }
        }

        const payload = {
            name: editableProfile.name,
            email: editableProfile.email,
            profilePicture: finalImageUrl,
            passportNumber: editableProfile.tourist.passportNumber,
            country: editableProfile.tourist.country,
            address: editableProfile.tourist.address,
            birthDay: editableProfile.tourist.birthDay,
        };

        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            };

            const response = await fetch(`http://127.0.0.1:8003/api/tourists/${touristId}/profile`, {
                method: 'PATCH',
                headers: headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile. Please try again.');
            }
            const updatedProfile = await response.json();
            toast.success('Profile updated successfully!');
            setProfile(updatedProfile);
            setIsEditing(false);
            setImageFile(null);
            setImagePreview(null);

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (!editableProfile) return;

        if (['passportNumber', 'country', 'address', 'birthDay'].includes(name)) {
            setEditableProfile({
                ...editableProfile,
                tourist: { ...editableProfile.tourist, [name]: value },
            });
        } else {
            setEditableProfile({ ...editableProfile, [name]: value });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    let profileImageUrl = imagePreview || profile?.profilePicture || "/images/profile-placeholder.jpg";

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 md:px-16 py-12">
                <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    <div className="flex flex-col items-center text-center md:w-1/3">
                        <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4 group">
                            <Image
                                src={profileImageUrl}
                                alt="Profile Picture"
                                layout="fill"
                                objectFit="cover"
                                priority
                                key={profileImageUrl}
                            />
                            {isEditing && (
                                <label htmlFor="profile-picture-upload" className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FiCamera size={32} />
                                    <input id="profile-picture-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                </label>
                            )}
                        </div>
                        {isEditing ? (
                            <input
                                type="text" name="name" value={editableProfile?.name || ''} onChange={handleChange}
                                className="text-3xl font-bold text-gray-800 text-center border-b-2 border-violet-300 focus:outline-none focus:border-violet-600"
                            />
                        ) : (
                            <h1 className="text-3xl font-bold text-gray-800">{profile?.name}</h1>
                        )}
                        <div className="mt-4 w-full flex flex-col gap-2">
                            {isEditing ? (
                                <>
                                    <button onClick={handleSave} disabled={isSaving} className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400">
                                        <FiSave /> {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button onClick={handleCancel} disabled={isSaving} className="w-full px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors flex items-center justify-center gap-2">
                                        <FiXCircle /> Cancel
                                    </button>
                                </>
                            ) : (
                                <button onClick={handleEdit} className="w-full px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-medium transition-colors">
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="w-full md:w-2/3">
                        {loading && <p>Loading profile...</p>}
                        {error && <p className="text-red-500">Error: {error}</p>}
                        {profile && editableProfile && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DetailField label="Email" value={isEditing ? editableProfile.email : profile.email} isEditing={isEditing} name="email" onChange={handleChange} />
                                <DetailField label="Country" value={isEditing ? editableProfile.tourist.country : profile.tourist.country} isEditing={isEditing} name="country" onChange={handleChange} />
                                <DetailField label="Birthday" value={isEditing ? editableProfile.tourist.birthDay : profile.tourist.birthDay} isEditing={isEditing} name="birthDay" onChange={handleChange} />
                                <DetailField label="Age" value={calculateAge(isEditing ? editableProfile.tourist.birthDay : profile.tourist.birthDay)} />
                                <div className="md:col-span-2">
                                    <DetailField label="Address" value={isEditing ? editableProfile.tourist.address : profile.tourist.address} isEditing={isEditing} name="address" onChange={handleChange} />
                                </div>
                                <DetailField label="Passport Number" value={isEditing ? editableProfile.tourist.passportNumber : profile.tourist.passportNumber} isEditing={isEditing} name="passportNumber" onChange={handleChange} />
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-violet-600">My Trips</h2>
                        <button className="px-6 py-2 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 font-medium transition-colors flex items-center gap-2">
                            <FiMessageSquare size={18} />
                            Chat
                        </button>
                    </div>
                    {tripsLoading && <p>Loading trips...</p>}
                    {tripsError && <p className="text-red-500">Error: {tripsError}</p>}
                    {!tripsLoading && !tripsError && (
                        <div className="space-y-6">
                            {trips.length > 0 ? (
                                trips.map(trip => (
                                    <div key={trip.id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 space-y-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-700 mb-4">
                                            <div><strong>Started Date -</strong> {trip.startDate}</div>
                                            <div><strong>End Date -</strong> {trip.endDate}</div>
                                            <div className="col-span-2"><strong>Tour Guide:</strong> {trip.tourGuideName}</div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-violet-600 border-b-2 border-violet-200 pb-1 mb-3">
                                                Destinations
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600">
                                                {trip.destinations.map((dest, index) => (
                                                    <div key={index} className="flex items-center">
                                                        <span>{dest}</span>
                                                        {index < trip.destinations.length - 1 && <span className="ml-4 text-violet-400">→</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 text-center text-gray-500">
                                    <p>You have no completed trips.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}