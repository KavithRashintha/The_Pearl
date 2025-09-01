"use client";

import { useState } from 'react';
import ChatWindow from '@/components/chat_window';

const dummyCurrentUser = {
    uid: 'guide_user_456',
    displayName: 'Nimal Perera',
    email: 'nimal.p@example.com',
    role: 'guide',
    photoURL: 'https://i.pravatar.cc/150?u=nimal_perera',
};

const dummyContacts = [
    {
        id: 'chat_1',
        participantInfo: {
            guide_user_456: { displayName: 'Nimal Perera' },
            tourist_user_123: { displayName: 'Frank Paul' },
        },
    },
    {
        id: 'chat_2',
        participantInfo: {
            guide_user_456: { displayName: 'Nimal Perera' },
            tourist_user_abc: { displayName: 'John Doe' },
        },
    },
    {
        id: 'chat_3',
        participantInfo: {
            guide_user_456: { displayName: 'Nimal Perera' },
            tourist_user_def: { displayName: 'Deepak Singh' },
        },
    },
];

export default function TourGuideChatPage() {
    const [currentUser] = useState(dummyCurrentUser);
    const [contacts] = useState(dummyContacts);

    return (
        <ChatWindow
            contacts={contacts}
            contactListTitle="Tourist Chats"
            currentUser={currentUser}
        />
    );
}