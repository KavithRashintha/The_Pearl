"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Toaster } from 'react-hot-toast';
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import Step1_SelectDestinations from '@/app/tourist/components/trip_step1';
import Step2_FillInformation from '@/app/tourist/components/trip_step2';
import Step3_SelectGuide from '@/app/tourist/components/trip_step3';
import Step4_ConfirmTrip from '@/app/tourist/components/trip_step4';
import Step5_Success from '@/app/tourist/components/trip_step5';
import WandyChat from '@/app/tourist/components/wandy_chat';

export type TourGuide = {
    id: number;
    name: string;
    location: string;
    phone: string;
    tripsCompleted: number;
    rating: number;
};

export type TripFormData = {
    destinations: { id: number; name: string }[];
    email: string;
    contact: string;
    country: string;
    passportNumber: string;
    address: string;
    numAdults: number;
    numChildren: number;
    startDate: string;
    numDays: number;
    tripPayment: number;
    selectedGuide: TourGuide | null;
};

type DecodedToken = {
    sub: string;
    role: string;
    userId: number;
    userName: string;
    exp: number;
};

export default function PlanTripPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [formData, setFormData] = useState<TripFormData>({
        destinations: [],
        email: '',
        contact: '',
        country: '',
        passportNumber: '',
        address: '',
        numAdults: 1,
        numChildren: 0,
        startDate: '',
        numDays: 1,
        tripPayment: 0,
        selectedGuide: null,
    });

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1_SelectDestinations nextStep={nextStep} setFormData={setFormData} openChat={() => setIsChatOpen(true)} />;
            case 2:
                return <Step2_FillInformation nextStep={nextStep} prevStep={prevStep} formData={formData} setFormData={setFormData} />;
            case 3:
                return <Step3_SelectGuide nextStep={nextStep} prevStep={prevStep} formData={formData} setFormData={setFormData} />;
            case 4:
                return <Step4_ConfirmTrip nextStep={nextStep} prevStep={prevStep} formData={formData} />;
            case 5:
                return <Step5_Success />;
            default:
                return <Step1_SelectDestinations nextStep={nextStep} setFormData={setFormData} openChat={() => setIsChatOpen(true)} />;
        }
    };

    return (
        <div className="min-h-screen">
            <Toaster position="top-center" />
            <section className="relative h-[40vh] w-full overflow-hidden">
                <div className="relative inset-0 w-full h-full">
                    <Image
                        src="/images/trips_hero.jpg"
                        alt="Plan Trip Hero Image"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/25 to-transparent" />
                <div className="absolute inset-0 z-10 flex items-center pl-12">
                    <div className="max-w-[45%] pl-8 pb-10">
                        <h1 className="text-4xl md:text-6xl font-semibold leading-tight text-white">
                            Plan Your Trip Here
                        </h1>
                        <hr className="border-white mb-4 ml-1 w-[50%] border-t-2 md:border-t-3"/>
                        <p className="text-xl md:text-2xl text-white font-semibold">
                            Explore The Beauty, Plan The Journey
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 md:px-16 py-8 md:py-12">
                {renderStep()}
            </div>

            {isChatOpen && <WandyChat onClose={() => setIsChatOpen(false)} />}
        </div>
    );
}

