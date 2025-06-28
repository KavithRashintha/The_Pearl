import Link from 'next/link';

export default function TouristNavBar() {
    return(
        <nav className="bg-white shadow-md py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-blue-600">The Pearl</Link>
                <div className="flex space-x-6">
                    <Link href="/home" className="hover:text-blue-500">Home</Link>
                    <Link href="/destinations" className="hover:text-blue-500">Destinations</Link>
                    <Link href="/tips" className="hover:text-blue-500">Plan Trip</Link>
                    <Link href="/about-us" className="hover:text-blue-500">About Us</Link>
                    <Link href="/account" className="hover:text-blue-500">Account</Link>
                </div>
            </div>
        </nav>
    );
}