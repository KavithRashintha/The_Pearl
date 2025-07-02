import Image from 'next/image';

export default function Destination() {
    return (
        <div>
            <section className="relative h-[46vh] w-full overflow-hidden">
                <div className="relative inset-0 w-full h-full">
                    <Image
                        src="/images/destinations_hero.jpg"
                        alt="Destinations Hero Image"
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
                            Destinations
                        </h1>
                        <hr className="border-white mb-4 ml-1 w-[22vw] border-t-3"/>
                        <p className="text-2xl text-white font-semibold">
                            Explore The Beauty, Plan The Journey
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
