"use client";

import { useState } from 'react';
import { AcceptedTrip } from '@/app/tour-guide/active-tours/page';

type AcceptedTripCardProps = {
    trip: AcceptedTrip;
    isExpanded: boolean;
    onToggleExpand: (id: number) => void;
    onStatusUpdate: (tripId: number, newStatus: string) => Promise<void>;
    onPaymentStatusUpdate: (tripId: number, newStatus: string) => Promise<void>;
};

export default function AcceptedTripCard({ trip, isExpanded, onToggleExpand, onStatusUpdate, onPaymentStatusUpdate }: AcceptedTripCardProps) {
    const [selectedTripStatus, setSelectedTripStatus] = useState(trip.tripStatus);
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(trip.paymentStatus);
    const [isSavingTrip, setIsSavingTrip] = useState(false);
    const [isSavingPayment, setIsSavingPayment] = useState(false);

    const handleTripSave = async () => {
        setIsSavingTrip(true);
        await onStatusUpdate(trip.id, selectedTripStatus);
        setIsSavingTrip(false);
    };

    const handlePaymentSave = async () => {
        setIsSavingPayment(true);
        await onPaymentStatusUpdate(trip.id, selectedPaymentStatus);
        setIsSavingPayment(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 transition-all duration-300 text-gray-600 pt-8">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div><strong>Person -</strong> {trip.touristName}</div>
                <div><strong>From -</strong> {trip.touristCountry}</div>
                <div><strong>Starting Date -</strong> {trip.startDate}</div>
                <div><strong>Number Of Days -</strong> {trip.numberOfDays} Days</div>
                <button
                    onClick={() => onToggleExpand(trip.id)}
                    className="text-violet-600 font-semibold text-right col-span-2 -mt-4"
                >
                    {isExpanded ? 'View Less' : 'View More'}
                </button>
            </div>

            {isExpanded && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                        <div><strong>Number Of Adults -</strong> {trip.numberOfAdults} Adults</div>
                        <div><strong>Number Of Children -</strong> {trip.numberOfChildren} Children</div>
                        <div><strong>Tourist Email -</strong> {trip.touristEmail || 'N/A'}</div>
                        <div><strong>Passport Number -</strong> {trip.touristPassportNumber}</div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-violet-600 mb-4 mt-2">Destinations</h3>
                        <ul className="list-disc list-inside grid grid-cols-2 md:grid-cols-3 gap-2 text-gray-600">
                            {trip.destinations.map(dest => <li key={dest}>{dest}</li>)}
                        </ul>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-8 pt-6 border-t border-gray-200 gap-4">
                        <div className = "flex flex-row gap-12">
                            <div className="flex items-end gap-3">
                                <div>
                                    <label htmlFor="tripStatus" className="block text-sm font-medium text-gray-500 mb-4">Trip Status</label>
                                    <select
                                        id="tripStatus"
                                        value={selectedTripStatus}
                                        onChange={(e) => setSelectedTripStatus(e.target.value)}
                                        className="p-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500 w-50"
                                    >
                                        <option value="Accepted">Accepted</option>
                                        <option value="Started">Started</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                                <button
                                    onClick={handleTripSave}
                                    disabled={selectedTripStatus === trip.tripStatus || isSavingTrip}
                                    className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-medium transition-colors disabled:bg-gray-400"
                                >
                                    {isSavingTrip ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                            <div className="flex items-end gap-3">
                                <div>
                                    <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-500 mb-4">Payment Status</label>
                                    <select
                                        id="paymentStatus"
                                        value={selectedPaymentStatus}
                                        onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                                        className="p-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500 w-50"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Half Paid">Half Paid</option>
                                        <option value="Full Paid">Full Paid</option>
                                    </select>
                                </div>
                                <button
                                    onClick={handlePaymentSave}
                                    disabled={selectedPaymentStatus === trip.paymentStatus || isSavingPayment}
                                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:bg-gray-400"
                                >
                                    {isSavingPayment ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Trip Amount</label>
                            <div className="p-2 text-lg font-semibold text-gray-800">
                                ${trip.tripPayment.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}