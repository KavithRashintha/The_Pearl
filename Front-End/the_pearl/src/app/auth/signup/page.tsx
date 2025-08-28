"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignUpPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passportNumber, setPassportNumber] = useState('');
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const defaultProfilePicture = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/HarryStylesWembley170623_%2865_of_93%29_%2852982678051%29_%28cropped_2%29.jpg/500px-HarryStylesWembley170623_%2865_of_93%29_%2852982678051%29_%28cropped_2%29.jpg";

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8003/api/auth/register/tourist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role: "tourist",
                    passportNumber,
                    country,
                    address,
                    birthDay,
                    profilePicture: defaultProfilePicture,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail?.[0]?.msg || 'Sign Up failed. Please try again.');
            }

            toast.success('Sign Up successful! Please log in.');
            router.push('/auth/login');

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full min-h-screen">
            <div className="hidden md:block w-1/2 relative">
                <Image
                    src="/images/signup_image.jpg"
                    alt="Elephants near a river in Sri Lanka"
                    layout="fill"
                    objectFit="cover"
                />
            </div>

            <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 bg-white">
                <div className="w-full max-w-md">
                    <div className="text-center mb-6">
                        <div className="flex justify-center items-center mb-3">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#8B5CF6"/>
                            </svg>
                            <h1 className="text-2xl font-bold text-gray-800 ml-2">The Pearl</h1>
                        </div>
                        <h2 className="text-xl font-semibold text-violet-600">Sign Up Here</h2>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-3">
                        <div>
                            <input
                                type="text" id="name" name="name" placeholder="Enter Your Name Here"
                                value={name} onChange={(e) => setName(e.target.value)} required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500 text-gray-900 placeholder-gray-500"
                            />
                        </div>
                        <div>
                            <input
                                type="email" id="email" name="email" placeholder="Enter Your Email Here"
                                value={email} onChange={(e) => setEmail(e.target.value)} required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500 text-gray-900 placeholder-gray-500"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="Enter Your Password Here"
                                value={password} onChange={(e) => setPassword(e.target.value)} required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500 text-gray-900 placeholder-gray-500 pr-10"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" placeholder="Confirm Your Password Here"
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500 text-gray-900 placeholder-gray-500 pr-10"
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <div>
                            <input
                                type="text" id="passportNumber" name="passportNumber" placeholder="Enter Your Passport Number"
                                value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500 text-gray-900 placeholder-gray-500"
                            />
                        </div>
                        <div>
                            <input
                                type="text" id="country" name="country" placeholder="Enter Your Country"
                                value={country} onChange={(e) => setCountry(e.target.value)} required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500 text-gray-900 placeholder-gray-500"
                            />
                        </div>
                        <div>
                            <textarea
                                id="address" name="address" placeholder="Enter Your Address"
                                value={address} onChange={(e) => setAddress(e.target.value)} rows={2} required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500 text-gray-900 placeholder-gray-500"
                            />
                        </div>
                        <div>
                            <input
                                type="date" id="birthDay" name="birthDay" placeholder="Select Your Birthday"
                                value={birthDay} onChange={(e) => setBirthDay(e.target.value)} required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500 text-gray-900 placeholder-gray-500"
                            />
                        </div>
                        <button
                            type="submit" disabled={loading}
                            className="w-full px-4 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400"
                        >
                            {loading ? 'Signing Up...' : 'Signup'}
                        </button>
                    </form>
                    <p className="mt-4 text-sm text-center text-gray-600">
                        Already have an account? {' '}
                        <Link href="/auth/login" className="font-medium text-violet-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}