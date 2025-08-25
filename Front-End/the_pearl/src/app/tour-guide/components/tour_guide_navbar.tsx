"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navLinks = [
    { name: 'My Profile', href: '/tour-guide/account' },
    { name: 'Requests', href: '/tour-guide/tour-request' },
    { name: 'Chats', href: '/tour-guide/chats' },
    { name: 'Completed Tours', href: '/tour-guide/completed-tours' },
];

export default function TourGuideSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-screen bg-violet-50 p-8 flex flex-col fixed">
            <div className="flex flex-col items-center text-center mb-16 mt-20">
                <div className="mb-2">
                    <Image
                        src="/images/the_pearl-logo-2.png"
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
                                    ? 'font-semibold text-violet-800 border-b-1 border-violet-600'
                                    : 'font-medium'
                            }`}
                        >
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto">
                <button className="w-full px-4 py-2 text-center rounded-lg text-gray-700 hover:bg-violet-200 font-medium transition-colors">
                    Logout
                </button>
            </div>
        </aside>
    );
}