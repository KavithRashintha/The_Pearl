import { Mail, Phone, Facebook, Youtube, Twitter } from 'lucide-react';

export default function TouristFooter() {
    return (
        <footer className="bg-[#f5ecfa] py-16 px-4">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-800 space-y-4 md:space-y-0">

                <div className="flex space-x-6 text-sm font-medium">
                    <a href="#" className="hover:underline">About Us</a>
                    <a href="#" className="hover:underline">Privacy</a>
                    <a href="#" className="hover:underline">Policy</a>
                </div>

                <div className="text-sm text-center font-medium">
                    All Rights Reserved ©The_Perl_2025
                </div>

                <div className="flex items-center space-x-4">
                    <Mail size={20} />
                    <Phone size={20} />
                    <Facebook size={20} />
                    <Youtube size={20} />
                    <Twitter size={20} />
                    <span className="text-sm font-medium">+94 077 6438907</span>
                </div>
            </div>
        </footer>
    );
}
