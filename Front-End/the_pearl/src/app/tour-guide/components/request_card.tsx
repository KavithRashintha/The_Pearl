"use client";

import { TourRequest } from '@/app/tour-guide/tour-requests/page';

type RequestCardProps = {
    request: TourRequest;
    isExpanded: boolean;
    isAcceptDisabled: boolean;
    onToggleExpand: (id: number) => void;
    onAccept: (id: number) => void;
    onReject: (id: number) => void;
};

export default function RequestCard({ request, isExpanded, isAcceptDisabled, onToggleExpand, onAccept, onReject }: RequestCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 transition-all duration-300">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div><strong>Person -</strong> {request.touristName}</div>
                <div><strong>From -</strong> {request.touristCountry}</div>
                <div><strong>Starting Date -</strong> {request.startDate}</div>
                <div><strong>Number Of Days -</strong> {request.numberOfDays} Days</div>

                <button
                    onClick={() => onToggleExpand(request.id)}
                    className="text-violet-600 font-semibold text-right col-span-2 -mt-4"
                >
                    {isExpanded ? 'View Less' : 'View More'}
                </button>
            </div>

            {isExpanded && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                        <div><strong>Number Of Adults -</strong> {request.numberOfAdults} Adults</div>
                        <div><strong>Number Of Children -</strong> {request.numberOfChildren} Children</div>
                        <div><strong>Tourist Email -</strong> {request.touristEmail || 'N/A'}</div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-violet-600 mb-2">Destinations</h3>
                        <ul className="list-disc list-inside grid grid-cols-3 gap-2 text-gray-600">
                            {request.destinations.map(dest => <li key={dest}>{dest}</li>)}
                        </ul>
                    </div>

                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Your Charge</label>
                            <div className="w-48 p-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800">
                                ${request.tripPayment}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => onReject(request.id)}
                                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => onAccept(request.id)}
                                disabled={isAcceptDisabled}
                                className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}