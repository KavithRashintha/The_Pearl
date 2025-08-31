"use client";

import ChatWindow, { ChatPartner } from '@/components/chat_window';

export default function TouristChatPage() {
    const tourGuideContacts: ChatPartner[] = [
        { id: 'guide_1', name: 'Nimal Perera' },
        { id: 'guide_2', name: 'Saman Dissanayake' },
    ];

    const currentUserName = "Peter Maxwell";

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <ChatWindow
                contacts={tourGuideContacts}
                contactListTitle="Tour Guide Chat"
                currentUserName={currentUserName}
            />
        </div>
    );
}