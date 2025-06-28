'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TouristNavBar() {
    const pathname = usePathname();

    const navItems = [
        { label: 'Home', href: '/home' },
        { label: 'Destinations', href: '/destinations' },
        { label: 'Plan Trip', href: '/trips' },
        { label: 'About Us', href: '/about-us' },
        { label: 'Account', href: '/account' },
    ];

    return (
        <nav className="bg-purple-100 py-4">
            <div className="container mx-auto flex justify-between items-center pl-6 pr-16">
                <Link href="/" className="text-xl font-bold text-blue-600">
                    The Pearl
                </Link>
                <div className="flex space-x-12">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`font-medium ${
                                pathname === item.href
                                    ? 'text-purple-600 underline underline-offset-4'
                                    : 'text-purple-500 hover:text-purple-600'
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
