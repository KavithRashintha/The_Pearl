"use client";

import { useState } from 'react';
import ChatWindow from '@/components/chat_window';

const dummyCurrentUser = {
    uid: 'tourist_user_123',
    displayName: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'tourist',
    photoURL: 'https://i.pravatar.cc/150?u=jane_doe',
};

const dummyContacts = [
    {
        id: 'chat_1',
        participantInfo: {
            tourist_user_123: { displayName: 'Jane Doe' },
            guide_user_456: { displayName: 'Nimal Perera' },
        },
    },
    {
        id: 'chat_2',
        participantInfo: {
            tourist_user_123: { displayName: 'Jane Doe' },
            guide_user_789: { displayName: 'Saman Kumara' },
        },
    },
    {
        id: 'chat_3',
        participantInfo: {
            tourist_user_123: { displayName: 'Jane Doe' },
            guide_user_101: { displayName: 'Anura Bandara' },
        },
    },
];

export default function TouristChatPage() {
    const [currentUser] = useState(dummyCurrentUser);
    const [contacts] = useState(dummyContacts);

    return (
        <ChatWindow
            contacts={contacts}
            contactListTitle="Tour Guide Chats"
            currentUser={currentUser}
        />
    );
}