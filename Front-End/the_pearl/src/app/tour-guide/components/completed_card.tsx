import { CompletedTrip } from '@/app/tour-guide/completed-tours/page';

type CardProps = {
    trip: CompletedTrip;
};

export default function CompletedTripCard({ trip }: CardProps) {
    const getEndDate = (startDate: string, days: number): string => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
                <div><strong>Person -</strong> {trip.touristName}</div>
                <div><strong>From -</strong> {trip.touristCountry}</div>
                <div><strong>Starting Date -</strong> {trip.startDate}</div>
                <div><strong>End Date -</strong> {getEndDate(trip.startDate, trip.numberOfDays)}</div>
                <div><strong>Number Of Adults -</strong> {trip.numberOfAdults} Adults</div>
                <div><strong>Number Of Children -</strong> {trip.numberOfChildren} Children</div>
            </div>

            <hr className="my-6" />

            <div>
                <h3 className="text-lg font-semibold text-violet-600 mb-4">Destinations</h3>
                <div className="grid grid-cols-3 gap-x-8 gap-y-2 text-gray-700">
                    {trip.destinations.map((dest, index) => (
                        <div key={index}>{`${index + 1}. ${dest}`}</div>
                    ))}
                </div>
            </div>

            <hr className="my-6" />

            <div className="text-right text-lg">
                <span className="text-gray-600">Received - </span>
                <span className="font-bold text-violet-600">${trip.tripPayment.toFixed(2)}</span>
            </div>
        </div>
    );
}