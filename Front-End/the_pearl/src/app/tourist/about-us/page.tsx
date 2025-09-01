"use client";

import Image from 'next/image';

export default function AboutUs() {
    return (
        <div>
            <section className="relative h-[46vh] w-full overflow-hidden">
                <div className="relative inset-0 w-full h-full">
                    <Image
                        src="/images/about_us_hero.jpg"
                        alt="About Us Hero Image"
                        fill
                        className="object-cover scale-100"
                        style={{ objectPosition: 'center 25%' }}
                        quality={100}
                        priority
                    />
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/25 to-transparent h-[40vh] ml-4 mt-5 rounded-xl" />

                <div className="absolute inset-0 z-10 flex items-center pl-12">
                    <div className="max-w-[45%] pl-8 pb-10">
                        <h1 className="text-6xl font-semibold leading-tight text-white">
                            About Us
                        </h1>
                        <hr className="border-white mb-4 ml-1 w-[22vw] border-t-3"/>
                        <p className="text-2xl text-white font-semibold">
                            Explore The Beauty, Plan The Journey
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-20 py-12">
                <div className="max-w-12xl mx-auto">
                    <div className="prose lg:prose-xl mt-4">
                        <p className="mb-6 text-md text-justify">
                            At The Pearl, we are dedicated to showcasing the magic of Sri Lanka to travelers from around the world. Our platform is designed to provide everything you need to plan and experience an unforgettable journey through this tropical paradise.
                            We specialize in offering personalized travel destination guidance and connecting you with professional travel guides who bring Sri Lanka's rich culture, history, and natural beauty to life. From the golden beaches of the southern coast to the misty highlands of the central hills, from ancient heritage sites to vibrant wildlife sanctuaries, we ensure every traveler gets to experience the best of what Sri Lanka has to offer.
                        </p>

                        <p className="mb-6 text-md text-justify">
                            Our team is committed to making your adventure seamless and hassle-free by offering expert insights, tailored itineraries, and practical travel tips. Whether you're a solo explorer, a family on vacation, or a couple seeking a romantic getaway, The Pearl is here to help you uncover hidden gems, immerse yourself in authentic local experiences, and create memories that last a lifetime. With a deep love for this island and a passion for travel, we strive to be more than just a travel guide – we aim to be your trusted companion on your Sri Lankan journey.
                        </p>

                        <p className="mb-4 text-md text-justify">
                            At The Pearl, we believe that travel is more than just visiting destinations—it's about connecting with the soul of a place and creating stories that stay with you forever. That's why we go beyond simply offering guidance. We curate experiences that allow you to immerse yourself in Sri Lanka's vibrant culture, taste its exotic flavors, and witness its timeless traditions.
                            Whether it's exploring ancient ruins, trekking through lush rainforests, or experiencing the warmth of Sri Lankan hospitality, we ensure every moment of your journey is meaningful and unforgettable. Our vision is to redefine the way travelers experience Sri Lanka by combining convenience, authenticity, and expert support. With The Pearl by your side, you're not just a tourist—you're an explorer, adventurer, and storyteller discovering the hidden treasures of this extraordinary island.
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}