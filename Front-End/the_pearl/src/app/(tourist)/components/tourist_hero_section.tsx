import Image from 'next/image';

export default function TouristHeroSection(){
    return(
        <div className="p-8">
            <section className="relative h-[80vh] w-full overflow-hidden p-4 rounded-2xl">
                <div className="absolute inset-0 max-w-full h-full">
                    <Image
                        src="/images/tourist_hero_image.jpg"
                        alt="Sri Lanka Landscape"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="absolute inset-0 bg-gradient-to-l from-white/40 via-white/25 to-transparent h-[74vh] w-[94vw] mt-5 ml-2 rounded-xl"></div>

                <div className="relative z-10 h-full flex items-center pr-24">
                    <div className="container mx-auto px-4">
                        <div className="max-w-[40%] ml-auto text-right">
                            <h1 className="text-6xl font-semibold mb-6 leading-tight text-white">
                                Discover The Enchanting Beauty Of Sri Lanka
                            </h1>
                            <p className="text-xl mb-8 text-white">
                                The Peri - Your Best Travel Guide
                            </p>
                            <button className="bg-[#7119E6] hover:bg-[#7119D1] text-white font-semibold py-3 px-6 rounded-xl text-md transition">
                                Explore More
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}