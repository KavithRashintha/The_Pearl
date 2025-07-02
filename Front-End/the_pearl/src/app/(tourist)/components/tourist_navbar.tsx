'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from "next/image";

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
        <nav className="bg-purple-100 py-2">
            <div className="container mx-auto flex justify-between items-center pl-0 pr-12">
                <Link href="/" className="relative w-28 h-10">
                    <Image
                        src="/images/the_pearl_logo.png"
                        alt="The Pearl Logo"
                        fill
                        className="object-contain"
                        quality={100}
                    />
                </Link>
                <div className="flex space-x-14 text-sm">
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
