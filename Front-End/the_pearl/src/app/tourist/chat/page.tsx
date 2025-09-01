"use client";

import { useEffect, useState } from 'react';
import ChatWindow from '@/components/chat_window';
import { PearlUser, Chat } from '@/utils/firestore'; // Import your main types
import { db, auth } from '@/utils/firebase'; // Import your Firebase config
import { onAuthStateChanged } from 'firebase/auth';
import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    getDoc,
    orderBy,
} from 'firebase/firestore';

export type ChatContact = Pick<Chat, 'id' | 'participantInfo'>;

export default function TouristChatPage() {
    // State to hold the full profile of the currently logged-in user
    const [currentUser, setCurrentUser] = useState<PearlUser | null>(null);
    // State to hold the list of chats for the contact list panel
    const [contacts, setContacts] = useState<ChatContact[]>([]);
    // State to manage the initial loading screen
    const [loading, setLoading] = useState(true);

    // Effect to check for the logged-in user and fetch their profile
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in, fetch their profile from Firestore
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    // Set the current user with their full profile data
                    setCurrentUser(userDocSnap.data() as PearlUser);
                } else {
                    console.error("User document not found in Firestore!");
                    setCurrentUser(null);
                }
            } else {
                // User is signed out
                setCurrentUser(null);
            }
        });
        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // Effect to fetch the user's chat list once we know who the user is
    useEffect(() => {
        // Don't run if there is no logged-in user
        if (!currentUser) {
            setLoading(false); // If no user, we're done loading
            return;
        }

        const chatsRef = collection(db, 'chats');
        // Create a query to get all chats where the user is a participant, ordered by the last update
        const q = query(
            chatsRef,
            where('participants', 'array-contains', currentUser.uid),
            orderBy('lastUpdated', 'desc')
        );

        // onSnapshot creates a real-time listener for the chat list
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatList = snapshot.docs.map(doc => {
                const data = doc.data() as Omit<Chat, 'id'>;
                return {
                    id: doc.id,
                    participantInfo: data.participantInfo,
                };
            });
            setContacts(chatList);
            setLoading(false); // Data has been loaded
        });

        // Cleanup the listener when the component unmounts or the user changes
        return () => unsubscribe();
    }, [currentUser]); // This effect depends on the currentUser state

    // Display a loading message while fetching initial data
    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    // Display a message if the user is not logged in
    if (!currentUser) {
        return <div className="flex h-screen items-center justify-center">Please log in to see your chats.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <ChatWindow
                contacts={contacts}
                contactListTitle="Tour Guide Chats"
                currentUser={currentUser}
            />
        </div>
    );
}