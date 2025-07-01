"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ImageCardsCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [
        { src: '/images/tourist_image_1.jpg', title: 'Beaches' },
        { src: '/images/tourist_image_2.jpg', title: 'Historical' },
        { src: '/images/tourist_image_3.jpg', title: 'Wildlife' },
        { src: '/images/tourist_image_4.jpg', title: 'Culture' },
        { src: '/images/tourist_image_5.jpg', title: 'Attraction' },
        { src: '/images/tourist_image_6.jpg', title: 'Landmarks' },
    ];
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev >= 3 ? 0 : prev + 1));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full max-w-[160vw] h-96 overflow-hidden mx-auto">
            <div
                className="flex transition-transform duration-900 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 33.33}%)` }}
            >
                {images.map((image, index) => (
                    <div key={index} className="flex-shrink-0 w-1/3 px-4">
                        <div className="relative w-full h-80 rounded-xl shadow-lg overflow-hidden bg-gray-200">
                            {image.src ? (
                                <Image
                                    src={image.src}
                                    alt={image.title}
                                    fill
                                    className="object-cover"
                                    quality={100}
                                    onError={(e) =>
                                        console.error('Failed to load image:', image.src, e)
                                    }
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    Image not found
                                </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                <h3 className="text-white font-semibold text-xl">
                                    {image.title}
                                </h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
