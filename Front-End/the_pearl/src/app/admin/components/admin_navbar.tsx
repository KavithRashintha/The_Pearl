"use client";

import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import Image from 'next/image';
import Cookies from "js-cookie";

const navLinks = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Destinations', href: '/admin/destinations' },
    { name: 'Trips', href: '/admin/trips' },
    { name: 'Tour Guides', href: '/admin/tour-guides' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove('accessToken');
        router.push('/login');
    };

    return (
        <aside className="w-64 h-screen bg-violet-50 p-8 flex flex-col fixed">
            <div className="flex flex-col items-center text-center mb-8 mt-20">
                <div className="mb-2">
                    <Image
                        src="/images/the_pearl_logo.png"
                        alt="The Pearl Logo"
                        width={120}
                        height={120}
                        priority
                    />
                </div>
            </div>

            <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`px-4 py-2 text-center text-gray-700 hover:text-violet-800 transition-colors ${
                                isActive
                                    ? 'font-semibold text-violet-800 border-b-2 border-violet-600'
                                    : 'font-medium'
                            }`}
                        >
                            {link.name}
                        </Link>
                    );
                })}
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-center rounded-lg text-gray-700 hover:bg-violet-200 font-medium transition-colors"
                >
                    Logout
                </button>
            </nav>

            <div className="mt-auto">
            </div>
        </aside>
    );
}