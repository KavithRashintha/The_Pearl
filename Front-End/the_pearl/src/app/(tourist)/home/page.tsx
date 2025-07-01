import TouristHeroSection from "@/app/(tourist)/components/tourist_hero_section";
import Image from 'next/image';
export default function Home(){
    return(
        <div>
            <TouristHeroSection/>

            <div className="flex flex-col justify-center items-center pt-10 pb-18">
                <div className="pb-16">
                    <h1 className="font-semibold text-4xl text-royal-purple">Who We Are ?</h1>
                </div>

                <div className="flex flex-row justify-between w-full px-16">
                    <div className="w-160">
                        <p className="font-medium text-[1.45rem] mb-6 capitalize text-gray-600">Your ultimate travel companion for discovering the unmatched beauty</p>
                        <p className="font-normal text-md text-justify leading-[32px]">
                            Welcome to The Pearl, your trusted gateway to experiencing the vibrant beauty of Sri Lanka. We are a passionate team dedicated to connecting travelers with the heart and soul of this tropical island through personalized travel guidance tailored especially for foreign visitors. Our mission is to make your journey seamless and unforgettable by offering expertly curated itineraries, reliable travel advice, and experienced guides who breathe life into Sri Lanka’s rich culture, history, and hidden treasures. Whether you're drawn to serene beaches, ancient heritage sites, lush wildlife, or immersive local experiences, The Pearl is here to help you create extraordinary memories that will last a lifetime.
                        </p>
                    </div>
                    <div className="w-full md:w-170 h-86 relative overflow-hidden rounded-lg shadow-xl">
                        <Image
                            src="/images/tourist_intro_image.jpg"
                            alt="The Pearl Team"
                            fill
                            className="object-cover object-center scale-130"
                            quality={100}
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>

    )
}