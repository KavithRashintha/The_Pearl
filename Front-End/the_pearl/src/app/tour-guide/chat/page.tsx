"use client";

import ChatWindow, { ChatPartner } from '@/components/chat_window';

export default function TourGuideChatPage() {
    const touristContacts: ChatPartner[] = [
        { id: 'tourist_1', name: 'Frank Paul', details: 'Russia' },
        { id: 'tourist_2', name: 'John Doe', details: 'England' },
        { id: 'tourist_3', name: 'Deepak Singh', details: 'India' },
    ];

    const currentUserName = "Nimal Perera";

    return (
        <div className="min-h-screen bg-white p-4 sm:p-8">
            <ChatWindow
                contacts={touristContacts}
                contactListTitle="Tourists Chat"
                currentUserName={currentUserName}
            />
        </div>
    );
}