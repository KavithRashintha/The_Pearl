"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8003/api/auth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    username: email,
                    password: password,
                }).toString(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Login failed. Please check your credentials.');
            }

            const data = await response.json();
            localStorage.setItem('accessToken', data.access_token);
            toast.success('Login successful!');
            router.push('/admin/dashboard');

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
                    src="/images/login_image.jpg"
                    alt="Beautiful Sri Lankan Beach"
                    layout="fill"
                    objectFit="cover"
                />
            </div>

            <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-white">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <div className="flex justify-center items-center mb-4">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#8B5CF6"/>
                            </svg>
                            <h1 className="text-3xl font-bold text-gray-800 ml-2">The Pearl</h1>
                        </div>
                        <h2 className="text-2xl font-semibold text-violet-600">Login Here</h2>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter Your Email Here"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500 text-gray-900 placeholder-gray-500"
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="Enter Your Password Here"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500 text-gray-900 placeholder-gray-500 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400"
                        >
                            {loading ? 'Logging In...' : 'Login'}
                        </button>
                    </form>
                    <p className="mt-6 text-sm text-center text-gray-600">
                        Do not have an account? {' '}
                        <Link href="/signup" className="font-medium text-violet-600 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}