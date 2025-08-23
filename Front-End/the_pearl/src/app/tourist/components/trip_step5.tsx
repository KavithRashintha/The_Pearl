import { FiCheck } from 'react-icons/fi';

export default function Step5_Success() {
    return (
        <div className="flex flex-col items-center justify-center text-center py-16 max-w-7xl mx-auto">
            <div className="flex items-center justify-center w-24 h-24 bg-violet-600 rounded-full mb-6">
                <FiCheck className="text-white" size={60} />
            </div>
            <h2 className="text-3xl font-bold text-violet-600 mb-2">
                Your Trip Request Has Been Created
            </h2>
            <p className="text-lg text-gray-600">
                Your tour guide will accept the trip soon
            </p>
        </div>
    );
}